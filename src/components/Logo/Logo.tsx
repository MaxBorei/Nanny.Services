import { Link } from "react-router-dom";
import clsx from "clsx";
import css from "./Logo.module.css";

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <Link
      to="/"
      aria-label="Nanny.Services — Home"
      className={clsx(css.logo, className)}
    >
      <span className={css.logo}>Nanny.Services</span>
    </Link>
  );
}
