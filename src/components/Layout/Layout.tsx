import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Container from "../Container/Container";

export default function Layout() {
  return (
    <>
      <Container>
        <Header />
        <Outlet />
      </Container>
    </>
  );
}
