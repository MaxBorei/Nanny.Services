import { NavLink } from "react-router-dom";
import clsx from "clsx";
import Logo from "../Logo/Logo";
import css from "./Header.module.css";

const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(css.navLink, isActive && css.navLinkActive);

export default function Header() {
  return (
    <header className={css.header}>
      <div className={css.inner}>
        <Logo />

        <nav className={css.nav} aria-label="Main navigation">
          <NavLink to="/" end className={getNavLinkClass}>
            Home
          </NavLink>

          <NavLink to="/nannies" className={getNavLinkClass}>
            Nannies
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
