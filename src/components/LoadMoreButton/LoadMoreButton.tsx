import css from "./LoadMoreButton.module.css";

type LoadMoreButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  children?: string;
};

export default function LoadMoreButton({
  onClick,
  disabled = false,
  children = "Load more",
}: LoadMoreButtonProps) {
  return (
    <div className={css.btnContainer}>
      <button className={css.loadBtn} onClick={onClick} disabled={disabled}>
        {children}
      </button>
    </div>
  );
}
