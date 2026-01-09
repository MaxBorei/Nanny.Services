import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import css from "./Header.module.css";

import Modal from "../Modal/Modal";
import { LoginForm } from "../LoginForm/LoginForm";
import { RegisterForm } from "../RegisterForm/RegisterForm";

type AuthMode = "login" | "register";

type HeaderProps = {
  variant?: "transparent" | "solid";
};

export default function Header({ variant = "transparent" }: HeaderProps) {
  const [open, setOpen] = useState(false);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const closeAuth = () => setIsAuthOpen(false);

  const openLogin = () => {
    setAuthMode("login");
    setIsAuthOpen(true);
    setOpen(false);
  };

  const openRegister = () => {
    setAuthMode("register");
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
  const handleLoginSubmit = (data: { email: string; password: string }) => {
    console.log("LOGIN:", data);
    closeAuth();
  };

  const handleRegisterSubmit = (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    console.log("REGISTER:", data);
    closeAuth();
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

  // const isHome = pathname === "/";
  const isNannies = pathname === "/nannies" || pathname.startsWith("/nannies/");
  const isFavorites =
    pathname === "/favorites" || pathname.startsWith("/favorites/");

  // Favorites виден на Nannies и Favorites
  const showFavorites = isNannies || isFavorites;

  return (
    <header className={`${css.header} ${css[variant]}`}>
      <div className={css.inner}>
        <a className={css.logo} href="/">
          Nanny.Services
        </a>

        {/* Desktop nav */}
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

          {/* Desktop auth */}
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

        {/* Burger button (mobile) */}
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

      {/* Mobile menu via Portal */}
      {open && createPortal(mobileMenu, document.body)}

      {/* Auth modal */}
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
        {authMode === "login" ? (
          <LoginForm onSubmit={handleLoginSubmit} />
        ) : (
          <RegisterForm onSubmit={handleRegisterSubmit} />
        )}
      </Modal>
    </header>
  );
}
