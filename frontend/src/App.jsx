import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { RoleBanner } from './components/RoleBanner';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { Home } from './pages/Home';
import { MyApplications } from './pages/MyApplications';
import { SavedJobs } from './pages/SavedJobs';
import { Profile } from './pages/Profile';
import { HRDashboard } from './pages/HRDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';

export function App() {
  const { data } = useAuth();
  const [activeTab, setActiveTab] = useState('explore'); // explore, applications, saved, profile
  const [showLoginPage, setShowLoginPage] = useState(false);

  const currentRole = data.currentUserRole;

  if (showLoginPage) {
    return (
      <>
        <Login onBack={() => setShowLoginPage(false)} />
        <Toast />
      </>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Role Switcher */}
      <RoleBanner />

      {/* Main Glass Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogin={() => setShowLoginPage(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentRole === 'seeker' && (
          <>
            {activeTab === 'explore' && <Home />}
            {activeTab === 'applications' && <MyApplications onExplore={() => setActiveTab('explore')} />}
            {activeTab === 'saved' && <SavedJobs />}
            {activeTab === 'profile' && <Profile />}
          </>
        )}

        {currentRole === 'hr' && <HRDashboard />}

        {currentRole === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">J</div>
            <span className="font-bold text-slate-800">JobConnect React Client</span>
            <span>• Built with React 18 & Tailwind CSS</span>
          </div>
          <div className="flex items-center gap-4">
            <span>JWT Secured • REST API Ready • Vite Powered</span>
          </div>
        </div>
      </footer>

      {/* Global Animated Toasts */}
      <Toast />
    </div>
  );
}

export default App;
