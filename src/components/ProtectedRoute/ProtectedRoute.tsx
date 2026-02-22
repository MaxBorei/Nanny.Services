import { Navigate, useLocation } from "react-router-dom";
import { useAuthUser } from "../../lib/authApi";
import Loader from "../Loader/Loader";
import type { ReactNode } from "react";

type ProtectedRouteProps = { children: ReactNode };

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuthUser();
  const location = useLocation();

  if (isLoading) return <Loader />;

  if (!user) {
    return <Navigate to="/nannies" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
