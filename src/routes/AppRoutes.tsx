import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import Nannies from "../pages/Nannies/Nannies";
import Favorites from "../pages/Favorites/Favorites";
import ErrorView from "../components/ErrorView/ErrorView";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/nannies" element={<Nannies />} />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <ErrorView
            code={404}
            title="Сторінку не знайдено"
            message="Сторінка, яку ви шукаєте, не існує або була переміщена."
            homeHref="/"
          />
        }
      />
    </Routes>
  );
}
