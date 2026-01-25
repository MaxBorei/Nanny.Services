// src/components/FloatingThemeSwitcher/FloatingThemeSwitcher.tsx
import { useEffect, useMemo, useState } from "react";
import css from "./FloatingThemeSwitcher.module.css";

type Theme = "red" | "blue" | "green";

const STORAGE_KEY = "theme";

const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "red" || saved === "blue" || saved === "green") return saved;
  return "red";
};

export default function FloatingThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const themes = useMemo(
    () => [
      {
        id: "red" as const,
        label: "Red",
        iconColor: "#f03f3b",
        bg: "rgba(240, 63, 59, 0.2)",
      },
      {
        id: "blue" as const,
        label: "Blue",
        iconColor: "#0857c3",
        bg: "rgba(9, 87, 195, 0.2)",
      },
      {
        id: "green" as const,
        label: "Green",
        iconColor: "#103931",
        bg: "rgba(16, 57, 49, 0.2)",
      },
    ],
    [],
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <div className={css.floating} role="group" aria-label="Theme switcher">
      {themes.map((t) => {
        const isActive = theme === t.id;

        return (
          <button
            key={t.id}
            type="button"
            className={css.item}
            data-active={isActive ? "true" : undefined}
            aria-pressed={isActive}
            aria-label={`Switch theme to ${t.label}`}
            onClick={() => setTheme(t.id)}
          >
            <span className={css.iconWrap} style={{ background: t.bg }}>
              <span
                className={css.iconDot}
                style={{ background: t.iconColor }}
                aria-hidden="true"
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}
