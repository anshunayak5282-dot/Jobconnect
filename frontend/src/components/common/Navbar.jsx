import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from '../../router';

export function Navbar({
  currentRole,
  userInitials,
  currentUser,
  profile,
  seekerTab,
  setSeekerTab,
  myApplicationsCount = 0,
  savedJobsCount = 0,
  adminPendingCount = 0,
  notifications = [],
  onOpenEditProfile,
  onLogout
}) {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isLoggedIn = Boolean(currentUser);
  const brandHomeLink =
    currentRole === 'hr'
      ? '/recruiter/dashboard'
      : currentRole === 'admin'
      ? '/admin/dashboard'
      : '/dashboard';

  // Auto-close mobile menu on desktop resize or logout
  useEffect(() => {
    if (!isLoggedIn) {
      setShowMobileMenu(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to={brandHomeLink} className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-600 bg-clip-text text-transparent">
                JobConnect
              </span>
              <span className="block text-[9px] sm:text-[10px] font-semibold text-indigo-700 tracking-wider uppercase -mt-0.5 sm:-mt-1">
                Enterprise Recruitment OS
              </span>
            </div>
          </Link>

          {/* Dynamic Role Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 font-medium text-sm text-slate-600">
            {currentRole === 'seeker' && (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition ${
                      isActive || seekerTab === 'explore'
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                  onClick={() => setSeekerTab?.('explore')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  Explore Jobs
                </NavLink>

                <NavLink
                  to="/applications"
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition ${
                      isActive || seekerTab === 'applications'
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                  onClick={(e) => {
                    if (!isLoggedIn) {
                      e.preventDefault();
                      if (typeof window !== 'undefined') {
                        sessionStorage.setItem('jobconnect_redirect', '/applications');
                      }
                      navigate('/login', { state: { from: '/applications' } });
                      return;
                    }
                    setSeekerTab?.('applications');
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  My Applications ({myApplicationsCount})
                </NavLink>

                <NavLink
                  to="/saved"
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition ${
                      isActive || seekerTab === 'saved'
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                  onClick={(e) => {
                    if (!isLoggedIn) {
                      e.preventDefault();
                      if (typeof window !== 'undefined') {
                        sessionStorage.setItem('jobconnect_redirect', '/saved');
                      }
                      navigate('/login', { state: { from: '/saved' } });
                      return;
                    }
                    setSeekerTab?.('saved');
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                  Saved ({savedJobsCount})
                </NavLink>

                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition ${
                      isActive || seekerTab === 'profile'
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                  onClick={(e) => {
                    if (!isLoggedIn) {
                      e.preventDefault();
                      if (typeof window !== 'undefined') {
                        sessionStorage.setItem('jobconnect_redirect', '/profile');
                      }
                      navigate('/login', { state: { from: '/profile' } });
                      return;
                    }
                    setSeekerTab?.('profile');
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7 7z"></path>
                  </svg>
                  My Profile & Resume
                </NavLink>
              </>
            )}

            {currentRole === 'hr' && (
              <NavLink
                to="/recruiter/dashboard"
                className="text-xs font-bold px-3 py-1 bg-purple-50 text-purple-700 rounded-xl border border-purple-100 flex items-center gap-1.5 hover:bg-purple-100 transition"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                Enterprise Recruiter Portal
              </NavLink>
            )}

            {currentRole === 'admin' && (
              <NavLink
                to="/admin/dashboard"
                className="text-xs font-bold px-3 py-1 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 flex items-center gap-1.5 hover:bg-rose-100 transition"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                Super Admin Console ({adminPendingCount} Pending)
              </NavLink>
            )}
          </nav>

          {/* User Account Area: Login button for public visitors vs Avatar menu for logged-in users */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {isLoggedIn ? (
              <>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu((prev) => !prev);
                      setShowMobileMenu(false);
                      setShowNotifPanel(false);
                    }}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-full border border-slate-200/80 cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    title="Account Menu & Settings"
                    aria-haspopup="true"
                    aria-expanded={showUserMenu}
                  >
                    <div
                      className={`w-7 h-7 rounded-full text-white font-black text-xs flex items-center justify-center shadow-sm ${
                        currentRole === 'seeker'
                          ? 'bg-indigo-600'
                          : currentRole === 'hr'
                          ? 'bg-purple-600'
                          : 'bg-rose-600'
                      }`}
                    >
                      {userInitials}
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        {profile?.name || currentUser?.name || 'Account'}
                      </p>
                      <p className="text-[10px] text-slate-500 leading-none capitalize">
                        {currentRole === 'seeker' ? 'Candidate' : currentRole === 'hr' ? 'HR Recruiter' : 'Admin'}
                      </p>
                    </div>
                    <svg
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                        showUserMenu ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>

                  {/* User Account Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      ></div>
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-fade-in text-xs">
                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 rounded-t-2xl">
                          <div className="flex items-center gap-2.5 mb-2">
                            <div
                              className={`w-8 h-8 rounded-full text-white font-black text-xs flex items-center justify-center shadow-sm shrink-0 ${
                                currentRole === 'seeker'
                                  ? 'bg-indigo-600'
                                  : currentRole === 'hr'
                                  ? 'bg-purple-600'
                                  : 'bg-rose-600'
                              }`}
                            >
                              {userInitials}
                            </div>
                            <div className="min-w-0">
                              <p className="font-extrabold text-slate-900 text-xs truncate">
                                {profile?.name || currentUser?.name || 'Logged In User'}
                              </p>
                              <p className="text-slate-500 text-[10px] truncate">
                                {profile?.email || currentUser?.email || 'user@example.com'}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              currentRole === 'seeker'
                                ? 'bg-indigo-100 text-indigo-700'
                                : currentRole === 'hr'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {currentRole === 'seeker' ? 'Candidate Access' : currentRole === 'hr' ? 'HR Recruiter' : 'Super Admin'}
                          </span>
                        </div>

                        <div className="py-1">
                          {currentRole === 'seeker' && (
                            <>
                              <Link
                                to="/profile"
                                onClick={() => {
                                  setSeekerTab?.('profile');
                                  setShowUserMenu(false);
                                }}
                                className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 font-semibold flex items-center gap-2.5 transition"
                              >
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7 7z"></path>
                                </svg>
                                <span>My Profile & Resume</span>
                              </Link>
                              <Link
                                to="/applications"
                                onClick={() => {
                                  setSeekerTab?.('applications');
                                  setShowUserMenu(false);
                                }}
                                className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 font-semibold flex items-center gap-2.5 transition"
                              >
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                                <span>My Applications ({myApplicationsCount})</span>
                              </Link>
                            </>
                          )}
                          {currentRole === 'hr' && (
                            <button
                              type="button"
                              onClick={() => {
                                setShowUserMenu(false);
                                if (onOpenEditProfile) onOpenEditProfile();
                              }}
                              className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 font-semibold flex items-center gap-2.5 transition"
                            >
                              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <span>Edit Company Profile</span>
                            </button>
                          )}
                        </div>

                        <div className="pt-1 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              setShowUserMenu(false);
                              if (onLogout) onLogout();
                            }}
                            className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-2.5 transition group"
                          >
                            <svg className="w-4 h-4 text-rose-500 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                            </svg>
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Notifications Bell */}
                <button
                  onClick={() => {
                    setShowNotifPanel(!showNotifPanel);
                    setShowMobileMenu(false);
                    setShowUserMenu(false);
                  }}
                  className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                  title="Notifications"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
                  )}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm shadow-indigo-600/30 shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Login</span>
              </Link>
            )}

            {/* Responsive Mobile Hamburger Menu Toggle Button */}
            {isLoggedIn && (
              <button
                type="button"
                onClick={() => {
                  setShowMobileMenu((prev) => !prev);
                  setShowUserMenu(false);
                  setShowNotifPanel(false);
                }}
                className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                title="Toggle Navigation Menu"
                aria-label="Toggle Navigation Menu"
                aria-expanded={showMobileMenu}
              >
                {showMobileMenu ? (
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Responsive Mobile Dropdown Menu Container */}
        {isLoggedIn && showMobileMenu && (
          <div className="md:hidden border-t border-slate-200/90 bg-white/98 backdrop-blur-xl shadow-2xl px-4 py-4 space-y-3 max-h-[calc(100vh-4rem)] overflow-y-auto animate-fade-in text-xs">
            {/* User Profile Card */}
            <div className="p-3 bg-gradient-to-r from-slate-50 to-indigo-50/40 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-9 h-9 rounded-full text-white font-black text-xs flex items-center justify-center shadow-sm shrink-0 ${
                    currentRole === 'seeker'
                      ? 'bg-indigo-600'
                      : currentRole === 'hr'
                      ? 'bg-purple-600'
                      : 'bg-rose-600'
                  }`}
                >
                  {userInitials}
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-slate-900 text-xs truncate">
                    {profile?.name || currentUser?.name || 'Logged In User'}
                  </p>
                  <p className="text-slate-500 text-[10px] truncate">
                    {profile?.email || currentUser?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
              <span
                className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  currentRole === 'seeker'
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    : currentRole === 'hr'
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'bg-rose-100 text-rose-700 border border-rose-200'
                }`}
              >
                {currentRole === 'seeker' ? 'Candidate' : currentRole === 'hr' ? 'HR Recruiter' : 'Super Admin'}
              </span>
            </div>

            {/* Role-Specific Navigation Links */}
            <div className="space-y-1">
              {currentRole === 'seeker' && (
                <>
                  <div className="px-2 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Candidate Navigation
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => {
                      setSeekerTab?.('explore');
                      setShowMobileMenu(false);
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition ${
                      seekerTab === 'explore'
                        ? 'bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-100'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>Explore Jobs</span>
                    </div>
                    {seekerTab === 'explore' && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    )}
                  </Link>

                  <Link
                    to="/applications"
                    onClick={() => {
                      setSeekerTab?.('applications');
                      setShowMobileMenu(false);
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition ${
                      seekerTab === 'applications'
                        ? 'bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-100'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span>My Applications</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                      {myApplicationsCount}
                    </span>
                  </Link>

                  <Link
                    to="/saved"
                    onClick={() => {
                      setSeekerTab?.('saved');
                      setShowMobileMenu(false);
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition ${
                      seekerTab === 'saved'
                        ? 'bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-100'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>Saved Jobs</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                      {savedJobsCount}
                    </span>
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => {
                      setSeekerTab?.('profile');
                      setShowMobileMenu(false);
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition ${
                      seekerTab === 'profile'
                        ? 'bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-100'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7 7z" />
                      </svg>
                      <span>My Profile & Resume</span>
                    </div>
                    {seekerTab === 'profile' && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    )}
                  </Link>
                </>
              )}

              {currentRole === 'hr' && (
                <>
                  <div className="px-2 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Recruiter Console
                  </div>
                  <Link
                    to="/recruiter/dashboard"
                    onClick={() => setShowMobileMenu(false)}
                    className="w-full px-3.5 py-2.5 bg-purple-50 rounded-xl border border-purple-100 flex items-center gap-2.5 hover:bg-purple-100 transition"
                  >
                    <svg className="w-4 h-4 text-purple-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <div>
                      <p className="font-bold text-purple-900 text-xs">Enterprise Recruiter Portal</p>
                      <p className="text-[10px] text-purple-700">Talent Acquisition & Vacancies Hub</p>
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMobileMenu(false);
                      if (onOpenEditProfile) onOpenEditProfile();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 text-slate-700 hover:bg-slate-100 transition"
                  >
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Edit Company Profile</span>
                  </button>
                </>
              )}

              {currentRole === 'admin' && (
                <>
                  <div className="px-2 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Platform Management
                  </div>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setShowMobileMenu(false)}
                    className="w-full px-3.5 py-2.5 bg-rose-50 rounded-xl border border-rose-100 flex items-center justify-between hover:bg-rose-100 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="font-bold text-rose-900 text-xs">Super Admin Console</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                      {adminPendingCount} Pending
                    </span>
                  </Link>
                </>
              )}

              {/* Mobile Actions: Notifications & Logout */}
              <div className="pt-2 mt-2 border-t border-slate-100 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMenu(false);
                    setShowNotifPanel(true);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between text-slate-700 hover:bg-slate-100 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span>Activity Feed & Notifications</span>
                  </div>
                  {notifications.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                      {notifications.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMenu(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full px-3 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 text-rose-600 hover:bg-rose-50 transition"
                >
                  <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Backdrop overlay for mobile menu */}
      {isLoggedIn && showMobileMenu && (
        <div
          className="fixed inset-0 top-16 bg-slate-900/40 backdrop-blur-xs z-30 md:hidden animate-fade-in"
          onClick={() => setShowMobileMenu(false)}
          aria-hidden="true"
        />
      )}

      {/* Notifications Popup */}
      {showNotifPanel && (
        <div className="fixed top-20 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-4 animate-fade-in text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Activity Feed
            </h4>
            <button
              onClick={() => setShowNotifPanel(false)}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          </div>
          <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-slate-400 text-center py-4">No new notifications</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition border border-slate-100">
                  <p className="font-bold text-slate-800 text-xs">{n.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{n.text}</p>
                  <span className="text-[10px] text-indigo-600 font-semibold block mt-1">{n.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
