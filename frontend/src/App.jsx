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

function ProtectedRoute({ children }) {
  const { data } = useAuth();
  const token = localStorage.getItem('jobconnect_token');
  const isLoggedIn = Boolean(token && data?.currentUser && data?.currentUser?.status !== 'Suspended');

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicOnlyRoute({ children }) {
  const { data } = useAuth();
  const token = localStorage.getItem('jobconnect_token');
  const isLoggedIn = Boolean(token && data?.currentUser);

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <RouteToastCleaner />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
