import { useState } from "react";
import css from "./AppointmentForm.module.css";
import TimePicker from "../TimePicker/TimePicker";

type AppointmentFormProps = {
  nannyName: string;
  avatar_url: string;
  onClose: () => void;
};

type FormState = {
  address: string;
  phone: string;
  childAge: string;
  time: string;
  email: string;
  parentsName: string;
  comment: string;
};

const initialState: FormState = {
  address: "",
  phone: "+380",
  childAge: "",
  time: "09:00",
  email: "",
  parentsName: "",
  comment: "",
};

export default function AppointmentForm({
  nannyName,
  avatar_url,
  onClose,
}: AppointmentFormProps) {
  const [values, setValues] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setValues((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      await new Promise((r) => setTimeout(r, 600));

      onClose();
      setValues(initialState);
    } finally {
      setIsSubmitting(false);
    }
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

      <form className={css.form} onSubmit={handleSubmit}>
        <div className={css.row2}>
          <input
            className={css.input}
            name="address"
            placeholder="Address"
            value={values.address}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          <input
            className={css.input}
            name="phone"
            placeholder="+380"
            value={values.phone}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className={css.row2}>
          <input
            className={css.input}
            name="childAge"
            placeholder="Child's age"
            value={values.childAge}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          <TimePicker
            value={values.time}
            onChange={(t) => setValues((p) => ({ ...p, time: t }))}
            disabled={isSubmitting}
            start="08:00"
            end="20:00"
            stepMinutes={30}
            placeholder="00:00"
          />
        </div>

        <input
          className={css.input}
          name="email"
          type="email"
          placeholder="Email"
          value={values.email}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />

        <input
          className={css.input}
          name="parentsName"
          placeholder="Father's or mother's name"
          value={values.parentsName}
          onChange={handleChange}
          disabled={isSubmitting}
        />

        <textarea
          className={css.textarea}
          name="comment"
          placeholder="Comment"
          rows={4}
          value={values.comment}
          onChange={handleChange}
          disabled={isSubmitting}
        />

        <button className={css.submit} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
