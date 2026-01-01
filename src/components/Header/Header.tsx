import { NavLink } from "react-router-dom";
import clsx from "clsx";
import Logo from "../Logo/Logo";
import css from "./Header.module.css";
import type { NavLinkProps } from "react-router-dom";
import { useState } from "react";
import AuthModal from "../AuthModal/AuthModal";

const getNavLinkClass: NavLinkProps["className"] = ({ isActive }) =>
  clsx(css.navLink, isActive && css.navLinkActive);

export default function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  return (
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
              onClick={() => setIsAuthModalOpen(true)}
            >
              Log In
            </button>

            <AuthModal
              isOpen={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
            />

            <button
              type="button"
              className={clsx(css.authBtn, css.authBtnPrimary)}
            >
              Registration
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
