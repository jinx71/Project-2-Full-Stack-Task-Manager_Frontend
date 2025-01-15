import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-ink/50">
        Loading…
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
