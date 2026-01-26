import css from "./RegisterForm.module.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../schemas/registerSchema";

type FormValues = {
  name: string;
  email: string;
  password: string;
};

type RegisterFormProps = {
  onSubmit: (data: FormValues) => void;
};

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(registerSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="on">
      <div className={css.form}>
        <div>
          <input
            className={css.input}
            placeholder="Name"
            {...register("name")}
          />
          {errors.name && <p className={css.error}>{errors.name.message}</p>}
        </div>

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
            onClick={() => setShowPassword((p) => !p)}
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
        Sign Up
      </button>
    </form>
  );
}
