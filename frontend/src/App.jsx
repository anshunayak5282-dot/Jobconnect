import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from './router';
import Home from './pages/Home';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function RouteToastCleaner() {
  const { pathname } = useLocation();
  const { clearToasts } = useAuth();
  const prevPathRef = React.useRef(pathname);

  React.useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      if (clearToasts) {
        clearToasts();
      }
    }
  }, [pathname, clearToasts]);

  return null;
}

function getStandardRole(data) {
  const rawRole = data?.currentUserRole || data?.currentUser?.role;
  return rawRole === 'user' ? 'seeker' : rawRole;
}

function getRoleHomePath(role) {
  if (role === 'hr') return '/recruiter/dashboard';
  if (role === 'admin') return '/admin/dashboard';
  return '/dashboard';
}

function ProtectedRoute({ children, allowedRoles }) {
  const { data } = useAuth();
  const location = useLocation();
  const token = typeof window !== 'undefined' ? localStorage.getItem('jobconnect_token') : null;
  const isLoggedIn = Boolean(token && data?.currentUser && data?.currentUser?.status !== 'Suspended');

  if (!isLoggedIn) {
    if (typeof window !== 'undefined' && location.pathname && location.pathname !== '/login') {
      sessionStorage.setItem('jobconnect_redirect', location.pathname);
    }
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const currentRole = getStandardRole(data);
    const isAllowed = allowedRoles.some(
      (r) =>
        r === currentRole ||
        (r === 'user' && currentRole === 'seeker') ||
        (r === 'seeker' && currentRole === 'user')
    );

    if (!isAllowed) {
      return <Navigate to={getRoleHomePath(currentRole)} replace />;
    }
  }

  return children;
}

function PublicOnlyRoute({ children }) {
  const { data } = useAuth();
  const token = typeof window !== 'undefined' ? localStorage.getItem('jobconnect_token') : null;
  const isLoggedIn = Boolean(token && data?.currentUser);

  if (isLoggedIn) {
    const currentRole = getStandardRole(data);
    return <Navigate to={getRoleHomePath(currentRole)} replace />;
  }

  return children;
}

function RootRouteDispatcher() {
  const { data } = useAuth();
  const token = typeof window !== 'undefined' ? localStorage.getItem('jobconnect_token') : null;
  const isLoggedIn = Boolean(token && data?.currentUser && data?.currentUser?.status !== 'Suspended');

  if (isLoggedIn) {
    const currentRole = getStandardRole(data);
    if (currentRole === 'hr') return <Navigate to="/recruiter/dashboard" replace />;
    if (currentRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  // When users open the website (`/`), show Candidate's Explore Jobs dashboard without forcing login
  return <Navigate to="/dashboard" replace />;
}

function DashboardRouteDispatcher() {
  const { data } = useAuth();
  const token = typeof window !== 'undefined' ? localStorage.getItem('jobconnect_token') : null;
  const isLoggedIn = Boolean(token && data?.currentUser && data?.currentUser?.status !== 'Suspended');

  if (isLoggedIn) {
    const currentRole = getStandardRole(data);
    if (currentRole === 'hr') {
      return <Navigate to="/recruiter/dashboard" replace />;
    }
    if (currentRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  // Both logged-in Candidate and logged-out public visitors browse Explore Jobs without forced login
  return <Home initialTab="explore" />;
}

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <RouteToastCleaner />
        <Routes>
          {/* Public Authentication Route */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />

          {/* Root Route: Redirects to appropriate role dashboard (Candidate Explore Jobs for public visitors) */}
          <Route path="/" element={<RootRouteDispatcher />} />

          {/* Candidate / Job Seeker Routes: /dashboard is public for exploration */}
          <Route
            path="/dashboard"
            element={<DashboardRouteDispatcher />}
          />
          <Route
            path="/jobs"
            element={<Navigate to="/dashboard" replace />}
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute allowedRoles={['seeker']}>
                <Home initialTab="applications" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute allowedRoles={['seeker']}>
                <Home initialTab="saved" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-jobs"
            element={
              <ProtectedRoute allowedRoles={['seeker']}>
                <Navigate to="/saved" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['seeker']}>
                <Home initialTab="profile" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-profile"
            element={
              <ProtectedRoute allowedRoles={['seeker']}>
                <Navigate to="/profile" replace />
              </ProtectedRoute>
            }
          />

          {/* HR Recruiter Routes */}
          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute allowedRoles={['hr']}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/dashboard"
            element={<Navigate to="/recruiter/dashboard" replace />}
          />
          <Route
            path="/recruiter"
            element={<Navigate to="/recruiter/dashboard" replace />}
          />
          <Route
            path="/hr"
            element={<Navigate to="/recruiter/dashboard" replace />}
          />

          {/* Super Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />

          {/* Wildcard Fallback */}
          <Route path="*" element={<RootRouteDispatcher />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
