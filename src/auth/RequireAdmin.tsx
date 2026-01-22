import * as React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/auth/useAuth";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { role, loading } = useAuth();

  if (loading) return null;
  if (role !== "platform_admin") return <Navigate to="/" replace />;
  return <>{children}</>;
}
