import css from "./LoginForm.module.css";
import { useState } from "react";

type LoginFormProps = {
  onSubmit: (data: { email: string; password: string }) => void;
};

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    onSubmit({
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    });
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="on">
      <div className={css.form}>
        <input
          className={css.input}
          name="email"
          type="email"
          placeholder="Email"
          required
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          autoCapitalize="none"
        />
        <div className={css.field}>
          <input
            className={`${css.input} ${css.inputWithIcon}`}
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
          />
          <button
            type="button"
            className={css.iconBtn}
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <svg className={css.ctaIcon} aria-hidden="true">
              <use
                href={`/vite.svg#icon-${showPassword ? "eye" : "eye-off"}`}
              />
            </svg>
          </button>
        </div>
      </div>

      <button className={css.submit} type="submit">
        Log In
      </button>
    </form>
  );
}
