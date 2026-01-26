import { Outlet } from "react-router-dom";
import Container from "../Container/Container";
import Header from "../Header/Header";

export default function Layout() {
  return (
    <>
      <Header variant="solid" />
      <Container>
        <Outlet />
      </Container>
    </>
  );
}
