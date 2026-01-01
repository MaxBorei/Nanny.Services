import { NavLink } from "react-router-dom";
import clsx from "clsx";
import Logo from "../Logo/Logo";
import css from "./Header.module.css";
import type { NavLinkProps } from "react-router-dom";
import { useState } from "react";
import Modal from "../Modal/Modal";
import { LoginForm } from "../LoginForm/LoginForm";
import { RegisterForm } from "../RegisterForm/RegisterForm";

const getNavLinkClass: NavLinkProps["className"] = ({ isActive }) =>
  clsx(css.navLink, isActive && css.navLinkActive);

type AuthMode = "login" | "register" | null;

export default function Header() {
  const [authMode, setAuthMode] = useState<AuthMode>(null);

  const isOpen = authMode !== null;
  const close = () => setAuthMode(null);

  return (
    <>
      <header className={css.header}>
        <div className={css.inner}>
          <Logo />

          <div className={css.navContainer}>
            <nav className={css.nav} aria-label="Main navigation">
              <NavLink to="/" end className={getNavLinkClass}>
                Home
              </NavLink>
              <NavLink to="/nannies" className={getNavLinkClass}>
                Nannies
              </NavLink>
            </nav>

            <div className={css.authActions}>
              <button
                type="button"
                className={clsx(css.authBtn, css.authBtnGhost)}
                onClick={() => setAuthMode("login")}
              >
                Log In
              </button>

              <button
                type="button"
                className={clsx(css.authBtn, css.authBtnPrimary)}
                onClick={() => setAuthMode("register")}
              >
                Registration
              </button>
            </div>
          </div>
        </div>
      </header>

      <Modal
        isOpen={isOpen}
        onClose={close}
        title={authMode === "login" ? "Log In" : "Registration"}
        description={
          authMode === "login"
            ? "Welcome back! Please enter your credentials to access your account and continue your babysitter search."
            : "Create an account to start using the service."
        }
      >
        {authMode === "login" ? (
          <LoginForm
            onSubmit={(data) => {
              console.log("login", data);
              close();
            }}
          />
        ) : (
          <RegisterForm
            onSubmit={(data) => {
              console.log("register", data);
              close();
            }}
          />
        )}
      </Modal>
    </>
  );
}
