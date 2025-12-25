import { Link } from "react-router-dom";
import css from "./Logo.module.css";

export default function Logo() {
  return (
    <Link to="/" aria-label="Nanny.Services — Home" className={css.logo}>
      <span className={css.text}>Nanny.Services</span>
    </Link>
  );
}
