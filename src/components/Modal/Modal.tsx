import { useEffect } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={css.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={css.closeBtn}
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        {(title || description) && (
          <div className={css.textContainer}>
            {title && <h2 className={css.title}>{title}</h2>}
            {description && <p className={css.description}>{description}</p>}
          </div>
        )}

        {children}
      </div>
    </div>,
    document.body
  );
}
