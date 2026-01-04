import { useEffect, useState } from "react";
import css from "./Header.module.css";

export default function Header() {
  const [open, setOpen] = useState(false);

  // ESC closes
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

  return (
    <header className={css.header}>
      <div className={css.inner}>
        <a className={css.logo} href="/">
          Nanny.Services
        </a>

        {/* Desktop nav */}
        <nav className={css.navDesktop} aria-label="Primary">
          <a className={css.navLink} href="#">
            Home
          </a>
          <a className={css.navLink} href="#">
            Nannies
          </a>
        </nav>

        {/* Desktop auth */}
        <div className={css.authDesktop}>
          <button className={css.authBtnGhost} type="button">
            Log In
          </button>
          <button className={css.authBtnPrimary} type="button">
            Registration
          </button>
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

      {/* Mobile menu */}
      {open && (
        <div className={css.mobileMenu} role="dialog" aria-modal="true">
          {/* backdrop FIRST so it doesn't cover the panel */}
          <div className={css.mobileBackdrop} onClick={() => setOpen(false)} />

          <div className={css.mobilePanel}>
            <button
              type="button"
              className={css.mobileClose}
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>

            <nav className={css.navMobile} aria-label="Mobile">
              <a
                className={css.mobileLink}
                href="#"
                onClick={() => setOpen(false)}
              >
                Home
              </a>
              <a
                className={css.mobileLink}
                href="#"
                onClick={() => setOpen(false)}
              >
                Nannies
              </a>
            </nav>

            <div className={css.authMobile}>
              <button className={css.authBtnGhost} type="button">
                Log In
              </button>
              <button className={css.authBtnPrimary} type="button">
                Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
