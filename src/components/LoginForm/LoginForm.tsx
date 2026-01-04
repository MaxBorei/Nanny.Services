import css from "./LoginForm.module.css";

type LoginFormProps = {
  onSubmit: (data: { email: string; password: string }) => void;
};

export function LoginForm({ onSubmit }: LoginFormProps) {
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
    <form className={css.form} onSubmit={handleSubmit}>
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
          type="password"
          placeholder="Password"
          required
        />
        <button
          type="button"
          className={css.iconBtn}
          aria-label="Toggle password visibility"
        >
          <svg className={css.ctaIcon} aria-hidden="true">
            <use href="/vite.svg#icon-eye-off" />
          </svg>
        </button>
      </div>

      <button className={css.submit} type="submit">
        Log In
      </button>
    </form>
  );
}
