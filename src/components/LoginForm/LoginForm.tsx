import css from "./LoginForm.module.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../schemas/loginSchema";
import ErrorView from "../ErrorView/ErrorView";

type FormValues = {
  email: string;
  password: string;
};

type LoginFormProps = {
  onSubmit: (data: FormValues) => Promise<void> | void;
};

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleFormSubmit = async (data: FormValues) => {
    clearErrors("root");

    try {
      await onSubmit(data);
    } catch {
      // ❗ серверна помилка (невірний email/пароль)
      setError("root", {
        type: "server",
        message: "Невірний email або пароль",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} autoComplete="on">
      <div className={css.form}>
        {errors.root?.message && (
          <ErrorView
            variant="inline"
            title="Помилка входу"
            message={errors.root.message}
          />
        )}

        <div>
          <input
            className={css.input}
            type="email"
            placeholder="Email"
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            autoCapitalize="none"
            {...register("email")}
          />
          {errors.email && <p className={css.error}>{errors.email.message}</p>}
        </div>

        <div className={css.field}>
          <input
            className={`${css.input} ${css.inputWithIcon}`}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password")}
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

        {errors.password && (
          <p className={css.error}>{errors.password.message}</p>
        )}
      </div>

      <button className={css.submit} type="submit" disabled={isSubmitting}>
        Log In
      </button>
    </form>
  );
}
