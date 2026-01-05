import css from "./RegisterForm.module.css";

type RegisterFormProps = {
  onSubmit: (data: { name: string; email: string; password: string }) => void;
};

export function RegisterForm({ onSubmit }: RegisterFormProps) {
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
    <form className={css.form} onSubmit={handleSubmit}>
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
        Create account
      </button>
    </form>
  );
}
