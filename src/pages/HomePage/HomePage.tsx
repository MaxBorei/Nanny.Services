import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import css from "./HomePage.module.css";

export default function HomePage() {
  return (
    <section className={css.split}>
      {/* Фони */}
      <div className={css.bgLeft} aria-hidden="true" />
      <div className={css.bgRight} aria-hidden="true" />

      {/* Контент поверх */}
      <Header variant="transparent" />
      <Hero />
    </section>
  );
}
