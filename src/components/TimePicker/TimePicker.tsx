import { useEffect, useMemo, useRef, useState } from "react";
import css from "./TimePicker.module.css";

type TimePickerProps = {
  value: string;
  onChange: (time: string) => void;
  disabled?: boolean;
  start?: string;
  end?: string;
  stepMinutes?: number;
  placeholder?: string;
};

const generateTimes = (
  start: string,
  end: string,
  stepMinutes: number,
): string[] => {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  const current = sh * 60 + sm;
  const endMin = eh * 60 + em;

  const out: string[] = [];
  for (let m = current; m <= endMin; m += stepMinutes) {
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    out.push(`${hh}:${mm}`);
  }
  return out;
};

export default function TimePicker({
  value,
  onChange,
  disabled = false,
  start = "08:00",
  end = "20:00",
  stepMinutes = 30,
  placeholder = "00:00",
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const times = useMemo(
    () => generateTimes(start, end, stepMinutes),
    [start, end, stepMinutes],
  );

  const selectTime = (t: string) => {
    onChange(t);
    setOpen(false);
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    const idx = times.indexOf(value);
    if (idx < 0) return;

    const li = listRef.current?.children[idx] as HTMLElement | undefined;
    li?.scrollIntoView({ block: "center" });
  }, [open, times, value]);

  const toggle = () => {
    if (disabled) return;
    setOpen((v) => !v);
  };

  return (
    <div className={css.wrap} ref={wrapRef}>
      <button
        type="button"
        className={css.field}
        onClick={toggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={css.value}>{value || placeholder}</span>
        <span className={css.icon} aria-hidden="true">
          <svg className={css.iconSvgClock} width="20" height="20">
            <use href="/vite.svg#icon-clock" />
          </svg>
        </span>
      </button>

      {open && (
        <div className={css.popup} role="listbox" aria-label="Meeting time">
          <div className={css.title}>Meeting time</div>
          <ul className={css.list} ref={listRef}>
            {times.map((t) => (
              <li key={t}>
                <button
                  type="button"
                  className={`${css.item} ${t === value ? css.active : ""}`}
                  onClick={() => selectTime(t)}
                >
                  {t}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
