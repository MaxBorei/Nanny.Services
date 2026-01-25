import { useEffect } from "react";
import AppRoutes from "../../routes/AppRoutes";
import FloatingThemeSwitcher from "../ThemeSwitcher/FloatingThemeSwitcher";

function App() {
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "red";
    document.documentElement.setAttribute("data-theme", saved);
  }, []);
  return (
    <>
      <AppRoutes />
      <FloatingThemeSwitcher />
    </>
  );
}

export default App;
