import css from "./AppointmentForm.module.css";
import TimePicker from "../TimePicker/TimePicker";
import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { appointmentSchema } from "../../schemas/appointmentSchema";
import { notifySuccess } from "../../lib/notify";

type AppointmentFormProps = {
  nannyName: string;
  avatar_url: string;
  onClose: () => void;
};

type FormValues = {
  address: string;
  phone: string;
  childAge: string;
  time: string;
  email: string;
  parentsName: string;
  comment: string;
};

export default function AppointmentForm({
  nannyName,
  avatar_url,
  onClose,
}: AppointmentFormProps) {
  const defaultValues = useMemo<FormValues>(
    () => ({
      address: "",
      phone: "+380",
      childAge: "",
      time: "09:00",
      email: "",
      parentsName: "",
      comment: "",
    }),
    [],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(appointmentSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 600));

    notifySuccess("Appointment successfully created 🎉");

    onClose();
    reset(defaultValues);
  };

  return (
    <div className={css.wrap}>
      <h2 className={css.title}>Make an appointment with a babysitter</h2>
      <p className={css.text}>
        Arranging a meeting with a caregiver for your child is the first step to
        creating a safe and comfortable environment. Fill out the form below so
        we can match you with the perfect care partner.
      </p>

      <div className={css.nanny}>
        <div className={css.nannyAvatar}>
          <img className={css.nannyImg} src={avatar_url} alt={nannyName} />
        </div>
        <div>
          <div className={css.nannyLabel}>Your nanny</div>
          <div className={css.nannyName}>{nannyName}</div>
        </div>
      </div>

      <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={css.row2}>
          <div>
            <input
              className={css.input}
              placeholder="Address"
              disabled={isSubmitting}
              {...register("address")}
            />
            {errors.address && (
              <p className={css.error}>{errors.address.message}</p>
            )}
          </div>

          <div>
            <input
              className={css.input}
              placeholder="+380"
              disabled={isSubmitting}
              {...register("phone")}
            />
            {errors.phone && (
              <p className={css.error}>{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className={css.row2}>
          <div>
            <input
              className={css.input}
              placeholder="Child's age"
              disabled={isSubmitting}
              {...register("childAge")}
            />
            {errors.childAge && (
              <p className={css.error}>{errors.childAge.message}</p>
            )}
          </div>

          <div>
            <Controller
              name="time"
              control={control}
              render={({ field }) => (
                <TimePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                  start="08:00"
                  end="20:00"
                  stepMinutes={30}
                  placeholder="00:00"
                />
              )}
            />
            {errors.time && <p className={css.error}>{errors.time.message}</p>}
          </div>
        </div>

        <div>
          <input
            className={css.input}
            type="email"
            placeholder="Email"
            disabled={isSubmitting}
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            autoCapitalize="none"
            {...register("email")}
          />
          {errors.email && <p className={css.error}>{errors.email.message}</p>}
        </div>

        <div>
          <input
            className={css.input}
            placeholder="Father's or mother's name"
            disabled={isSubmitting}
            {...register("parentsName")}
          />
          {errors.parentsName && (
            <p className={css.error}>{errors.parentsName.message}</p>
          )}
        </div>

        <div>
          <textarea
            className={css.textarea}
            placeholder="Comment"
            rows={4}
            disabled={isSubmitting}
            {...register("comment")}
          />
          {errors.comment && (
            <p className={css.error}>{errors.comment.message}</p>
          )}
        </div>

        <button className={css.submit} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
