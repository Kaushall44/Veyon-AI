import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types/auth';
import { ShieldAlert, UserCheck, ArrowRight } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isAuthorized, isLoading, loginAsDemoUser } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-600">Authenticating SOA Session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !isAuthorized(allowedRoles)) {
    const requiredRole = allowedRoles[0]; // e.g. Faculty or Admin

    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-amber-200 p-8 shadow-card text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-subtle">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900">
              Role Access Gated: {requiredRole.replace('_', ' ')} Required
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              You are currently logged in as <strong>{user?.name}</strong> (Role: <strong className="text-indigo-600">{user?.role}</strong>). 
              Accessing <code className="bg-slate-100 px-2 py-0.5 rounded font-mono font-semibold">{location.pathname}</code> requires {allowedRoles.join(' or ')} authorization.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => loginAsDemoUser(requiredRole)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Switch to Demo {requiredRole.replace('_', ' ')} Account</span>
            </button>

            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
