import css from "./Loader.module.css";

type LoaderProps = {
  message?: string;
};

export default function Loader({ message = "Loading..." }: LoaderProps) {
  return (
    <div
      className={css.overlay}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className={css.card}>
        <div className={css.spinner} />
        {message ? <p className={css.message}>{message}</p> : null}
        <span className={css.srOnly}>Завантаження…</span>
      </div>
    </div>
  );
}
