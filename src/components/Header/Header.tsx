import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import css from "./Header.module.css";

import Modal from "../Modal/Modal";
import { LoginForm } from "../LoginForm/LoginForm";
import { RegisterForm } from "../RegisterForm/RegisterForm";

import {
  loginUser,
  logoutUser,
  registerUser,
  useAuthUser,
} from "../../lib/authApi";
import { notifyLoginRequired } from "../../lib/notify";
import Loader from "../Loader/Loader";
import ErrorView from "../ErrorView/ErrorView";

type AuthMode = "login" | "register";

type HeaderProps = {
  variant?: "transparent" | "solid";
};

type LoginData = { email: string; password: string };
type RegisterData = { name: string; email: string; password: string };

function getAuthErrorMessage(err: unknown): string {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case "auth/email-already-in-use":
        return "Ця пошта вже зареєстрована.";
      case "auth/weak-password":
        return "Пароль занадто простий (мінімум 6 символів).";
      case "auth/invalid-email":
        return "Некоректна пошта.";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Невірна пошта або пароль.";
      case "auth/too-many-requests":
        return "Забагато спроб. Спробуй пізніше.";
      case "auth/operation-not-allowed":
        return "Email/Password метод вимкнений у Firebase.";
      default:
        return err.message || "Помилка авторизації.";
    }
  }

  if (err instanceof Error) return err.message;
  return "Невідома помилка.";
}

export default function Header({ variant = "transparent" }: HeaderProps) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [optimisticName, setOptimisticName] = useState<string | null>(null);

  const { user, isLoading } = useAuthUser();

  const closeAuth = () => {
    setIsAuthOpen(false);
    setAuthError(null);
    setIsSubmitting(false);
  };

  const openLogin = () => {
    setAuthMode("login");
    setAuthError(null);
    setIsAuthOpen(true);
    setOpen(false);
  };

  const openRegister = () => {
    setAuthMode("register");
    setAuthError(null);
    setIsAuthOpen(true);
    setOpen(false);
  };

  const handleLogout = async (): Promise<void> => {
    setAuthError(null);
    try {
      await logoutUser();
      setOptimisticName(null);
    } catch (err: unknown) {
      setAuthError(getAuthErrorMessage(err));
    }
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleLoginSubmit = async (data: LoginData) => {
    setAuthError(null);
    setIsSubmitting(true);
    try {
      await loginUser(data);
      setOptimisticName(null);
      closeAuth();
      navigate("/nannies", { replace: true });
    } catch (err: unknown) {
      setAuthError(getAuthErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (data: RegisterData) => {
    setAuthError(null);
    setIsSubmitting(true);

    const trimmedName = data.name.trim();
    if (trimmedName) setOptimisticName(trimmedName);

    try {
      await registerUser(data);
      setOptimisticName(null);
      closeAuth();
      navigate("/nannies", { replace: true });
    } catch (err: unknown) {
      setAuthError(getAuthErrorMessage(err));
      setIsSubmitting(false);

      setOptimisticName(null);
    }
  };

  const pathname = window.location.pathname;
  const isNannies = pathname === "/nannies" || pathname.startsWith("/nannies/");
  const isFavorites =
    pathname === "/favorites" || pathname.startsWith("/favorites/");
  const showFavorites = isNannies || isFavorites;

  const displayName =
    user?.displayName ?? optimisticName ?? user?.email ?? "User";

  const mobileMenu = open ? (
    <div className={css.mobileMenu} role="dialog" aria-modal="true">
      <div className={css.mobileBackdrop} onClick={() => setOpen(false)} />

      <div className={css.mobilePanel}>
        <button
          type="button"
          className={css.mobileClose}
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        >
          <svg className={css.closeIcon} aria-hidden="true">
            <use href="/vite.svg#icon-close" />
          </svg>
        </button>

        <nav className={css.navMobile} aria-label="Mobile">
          <Link
            className={css.mobileLink}
            to="/"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>

          <Link
            className={css.mobileLink}
            to="/nannies"
            onClick={() => setOpen(false)}
          >
            Nannies
          </Link>

          <Link
            className={css.mobileLink}
            to="/favorites"
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                notifyLoginRequired();
                openRegister();
                return;
              }
              setOpen(false);
            }}
          >
            Favorites
          </Link>
        </nav>

        <div className={css.authMobile}>
          {isLoading ? null : user ? (
            <div className={css.userBarMobile}>
              <div>
                <span className={css.userIcon} aria-hidden="true">
                  <svg className={css.userIconSvg}>
                    <use href="/vite.svg#icon-user" />
                  </svg>
                </span>

                <span className={css.userNameMobile}>{displayName}</span>
              </div>

              <button
                type="button"
                className={css.logoutBtnMobile}
                onClick={async () => {
                  await handleLogout();
                  setOpen(false);
                }}
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <button
                className={css.authBtnGhost}
                type="button"
                onClick={openLogin}
              >
                Log In
              </button>

              <button
                className={css.authBtnPrimary}
                type="button"
                onClick={openRegister}
              >
                Registration
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <header className={`${css.header} ${css[variant]}`}>
      <div className={css.inner}>
        <a className={css.logo} href="/">
          Nanny.Services
        </a>

        <div className={css.navContainer}>
          <nav className={css.navDesktop} aria-label="Primary">
            <a className={css.navLink} href="/">
              Home
            </a>

            <a
              className={css.navLink}
              href="/nannies"
              data-active={isNannies ? "true" : undefined}
            >
              Nannies
            </a>

            {showFavorites && (
              <a
                className={css.navLink}
                href="/favorites"
                data-active={isFavorites ? "true" : undefined}
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                    notifyLoginRequired();
                    openRegister();
                  }
                }}
              >
                Favorites
              </a>
            )}
          </nav>

          <div className={css.authDesktop}>
            {isLoading ? null : user ? (
              <div className={css.userBar}>
                <span className={css.userIcon} aria-hidden="true">
                  <svg className={css.userIconSvg}>
                    <use href="/vite.svg#icon-user" />
                  </svg>
                </span>

                <span className={css.userName}>{displayName}</span>

                <button
                  type="button"
                  className={css.logoutBtn}
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            ) : (
              <>
                <button
                  className={css.authBtnGhost}
                  type="button"
                  onClick={openLogin}
                >
                  Log In
                </button>

                <button
                  className={css.authBtnPrimary}
                  type="button"
                  onClick={openRegister}
                >
                  Registration
                </button>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          className={css.burger}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={css.burgerBar} />
          <span className={css.burgerBar} />
          <span className={css.burgerBar} />
        </button>
      </div>

      {open && createPortal(mobileMenu, document.body)}

      <Modal
        isOpen={isAuthOpen}
        onClose={closeAuth}
        title={authMode === "login" ? "Log In" : "Registration"}
        description={
          authMode === "login"
            ? "Welcome back! Please enter your credentials to access your account and continue your babysitter search."
            : "Thank you for your interest in our platform! In order to register, we need some information. Please provide us with the following information."
        }
      >
        {authError && <ErrorView message={authError} />}

        <div style={{ position: "relative" }}>
          {isSubmitting && <Loader message="Loading..." />}

          {authMode === "login" ? (
            <LoginForm onSubmit={handleLoginSubmit} />
          ) : (
            <RegisterForm onSubmit={handleRegisterSubmit} />
          )}
        </div>
      </Modal>
    </header>
  );
}
