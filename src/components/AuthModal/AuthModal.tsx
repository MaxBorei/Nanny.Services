import { createPortal } from "react-dom";
import css from "./AuthModal.module.css";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className={css.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <div className={css.text_container}>
          <h2 className={css.title_modal}>Log In</h2>
          <p className={css.text_modal}>
            Welcome back! Please enter your credentials to access your account
            and continue your babysitter search.
          </p>
        </div>

        <form className={css.form}>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Sign in</button>
        </form>

        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>,
    document.body
  );
}
