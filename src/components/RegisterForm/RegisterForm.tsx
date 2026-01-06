import css from "./RegisterForm.module.css";
import { useState } from "react";

type RegisterFormProps = {
  onSubmit: (data: { name: string; email: string; password: string }) => void;
};

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    onSubmit({
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={css.form}>
        <input
          className={css.input}
          name="name"
          type="text"
          placeholder="Name"
          required
        />
        <input
          className={css.input}
          name="email"
          type="email"
          placeholder="Email"
          required
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
        Sign Up
      </button>
    </form>
  );
}
