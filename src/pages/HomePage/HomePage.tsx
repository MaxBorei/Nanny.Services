import Container from "../../components/Container/Container";
import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import css from "./HomePage.module.css";

export default function HomePage() {
  return (
    <Container>
      <section className={css.split}>
        <div className={css.bgLeft} aria-hidden="true" />
        <div className={css.bgRight} aria-hidden="true" />
        <Header variant="transparent" />
        <Hero />
      </section>
    </Container>
  );
}
