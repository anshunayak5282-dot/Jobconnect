import React, { useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from './router';
import Home from './pages/Home';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';

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

// Error Boundary to prevent any blank white screen
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('JobConnect App Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '24px', fontFamily: 'sans-serif' }}>
          <div style={{ maxWidth: '480px', width: '100%', backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px' }}>
              ⚠️
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Something went wrong</h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', lineHeight: '1.5' }}>
              The application encountered a runtime error. Click below to reset platform state and reload safely.
            </p>
            <div style={{ textAlign: 'left', backgroundColor: '#f1f5f9', padding: '12px', borderRadius: '10px', fontSize: '11px', color: '#334155', marginBottom: '20px', overflowX: 'auto' }}>
              {this.state.error?.message || 'Unknown error'}
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('jobconnect_token');
                localStorage.removeItem('jobconnect_state');
                window.location.href = '/login';
              }}
              style={{ padding: '10px 20px', borderRadius: '10px', backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
            >
              Reset Session & Go to Login
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
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
