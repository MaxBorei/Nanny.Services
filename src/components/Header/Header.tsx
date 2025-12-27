import { NavLink } from "react-router-dom";
import clsx from "clsx";
import Logo from "../Logo/Logo";
import css from "./Header.module.css";
import type { NavLinkProps } from "react-router-dom";

const getNavLinkClass: NavLinkProps["className"] = ({ isActive }) =>
  clsx(css.navLink, isActive && css.navLinkActive);

export default function Header() {
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
            >
              Log In
            </button>

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
