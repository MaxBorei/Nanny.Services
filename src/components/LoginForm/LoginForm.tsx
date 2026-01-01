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
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Sign in</button>
    </form>
  );
}
