import { Link } from "react-router-dom";
import css from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={css.hero} aria-label="Hero">
      <div className={css.left}>
        <h1 className={css.title}>
          Make Life Easier
          <br />
          for the Family:
        </h1>

        <p className={css.subtitle}>
          Find Babysitters Online for All Occasions
        </p>

        <Link to="/nannies" className={css.cta}>
          <span className={css.ctaText}>Get started</span>

          <svg
            className={css.ctaIcon}
            width="14"
            height="16"
            aria-hidden="true"
          >
            <use href="/vite.svg#icon-Arrow" />
          </svg>
        </Link>
      </div>

      <div className={css.right}>
        <div className={css.overlay} />

        <div className={css.badge} role="note" aria-label="Experienced nannies">
          <div className={css.badgeIcon}>
            <svg
              className={css.badgeIconSvg}
              width="20"
              height="15"
              aria-hidden="true"
            >
              <use href="/vite.svg#icon-feCheck" />
            </svg>
          </div>

          <div className={css.badgeText}>
            <span className={css.badgeLabel}>Experienced nannies</span>
            <span className={css.badgeValue}>15,000</span>
          </div>
        </div>
      </div>
    </section>
  );
}
