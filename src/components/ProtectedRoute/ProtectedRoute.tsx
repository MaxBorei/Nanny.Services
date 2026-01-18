import { Navigate } from "react-router-dom";
import { useAuthUser } from "../../lib/authApi";
import type { ReactNode } from "react";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuthUser();

  if (isLoading) return null;

  if (!user) {
    return <Navigate to="/nannies" replace />;
  }

  return children;
}
