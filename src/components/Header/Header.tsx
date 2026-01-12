import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import css from "./Header.module.css";

import Modal from "../Modal/Modal";
import { LoginForm } from "../LoginForm/LoginForm";
import { RegisterForm } from "../RegisterForm/RegisterForm";

import { loginUser, registerUser } from "../../lib/authApi";

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

  // ESC closes mobile menu
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // lock body scroll when menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // handlers for forms
  const handleLoginSubmit = async (data: LoginData) => {
    setAuthError(null);
    setIsSubmitting(true);
    try {
      await loginUser(data);
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
    try {
      await registerUser(data);
      closeAuth();
      navigate("/nannies", { replace: true });
    } catch (err: unknown) {
      setAuthError(getAuthErrorMessage(err));
      setIsSubmitting(false);
    }
  };

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
          <a className={css.mobileLink} href="#" onClick={() => setOpen(false)}>
            Home
          </a>
          <a className={css.mobileLink} href="#" onClick={() => setOpen(false)}>
            Nannies
          </a>
        </nav>

        <div className={css.authMobile}>
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
        </div>
      </div>
    </div>
  ) : null;

  const pathname = window.location.pathname;
  const isNannies = pathname === "/nannies" || pathname.startsWith("/nannies/");
  const isFavorites =
    pathname === "/favorites" || pathname.startsWith("/favorites/");
  const showFavorites = isNannies || isFavorites;

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
              >
                Favorites
              </a>
            )}
          </nav>

          <div className={css.authDesktop}>
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
        {/* повідомлення помилки */}
        {authError && (
          <p style={{ color: "crimson", marginBottom: 12 }}>{authError}</p>
        )}

        {/* опційно: простий індикатор */}
        {isSubmitting && <p style={{ marginBottom: 12 }}>Loading...</p>}

        {authMode === "login" ? (
          <LoginForm onSubmit={handleLoginSubmit} />
        ) : (
          <RegisterForm onSubmit={handleRegisterSubmit} />
        )}
      </Modal>
    </header>
  );
}
