import { useEffect, useMemo, useRef, useState } from "react";
import css from "./Filters.module.css";
import type { SortValue } from "../../types/Sort";

type Option = { value: SortValue; label: string };

type Props = {
  value: SortValue;
  onChange: (v: SortValue) => void;
};

const OPTIONS: Option[] = [
  { value: "a-z", label: "A to Z" },
  { value: "z-a", label: "Z to A" },
  { value: "price-low", label: "Less than 10$" },
  { value: "price-high", label: "Greater than 10$" },
  { value: "rating-high", label: "Popular" },
  { value: "rating-low", label: "Not popular" },
  { value: "all", label: "Show all" },
];

export default function Filters({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(() =>
    Math.max(
      0,
      OPTIONS.findIndex((o) => o.value === value),
    ),
  );

  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const selected = useMemo(
    () => OPTIONS.find((o) => o.value === value) ?? OPTIONS[0],
    [value],
  );

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!open) return;
      const target = e.target as Node;
      if (rootRef.current && !rootRef.current.contains(target)) {
        setOpen(false);
      }
    };

    const onDocKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onDocKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onDocKeyDown);
    };
  }, [open]);

  const commit = (v: SortValue) => {
    onChange(v);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const openDropdown = () => {
    const idx = OPTIONS.findIndex((o) => o.value === value);
    setActiveIndex(Math.max(0, idx));
    setOpen(true);

    requestAnimationFrame(() => {
      listRef.current?.focus();
    });
  };

  const onButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  };

  const onListKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, OPTIONS.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const opt = OPTIONS[activeIndex];
      if (opt) commit(opt.value);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div className={css.section} ref={rootRef}>
      <p className={css.filter_text}>Filters</p>

      <div className={css.selectWrap}>
        <button
          ref={buttonRef}
          type="button"
          className={`${css.selectBtn} ${open ? css.open : ""}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => (open ? setOpen(false) : openDropdown())}
          onKeyDown={onButtonKeyDown}
        >
          <span className={css.selectValue}>{selected.label}</span>
          <svg className={css.arrow} width="16" height="16" aria-hidden="true">
            <use href="/vite.svg#icon-arrow" />
          </svg>
        </button>

        {open && (
          <ul
            ref={listRef}
            className={css.dropdown}
            role="listbox"
            tabIndex={-1}
            aria-activedescendant={`opt-${activeIndex}`}
            onKeyDown={onListKeyDown}
          >
            {OPTIONS.map((opt, idx) => {
              const isSelected = opt.value === value;
              const isActive = idx === activeIndex;

              return (
                <li
                  key={opt.value}
                  id={`opt-${idx}`}
                  role="option"
                  aria-selected={isSelected}
                  className={[
                    css.option,
                    isSelected ? css.optionSelected : "",
                    isActive ? css.optionActive : "",
                  ].join(" ")}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => commit(opt.value)}
                >
                  {opt.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
