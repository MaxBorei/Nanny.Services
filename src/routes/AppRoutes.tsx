import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout/Layout";

import HomePage from "../pages/HomePage/HomePage";
import Nannies from "../pages/Nannies/Nannies";
import Favorites from "../pages/Favorites/Favorites";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/nannies" element={<Nannies />} />
        <Route path="/favorites" element={<Favorites />} />
      </Route>
    </Routes>
  );
}
