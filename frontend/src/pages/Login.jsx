import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from '../router';
import { useAuth } from '../context/AuthContext';
import { demoAnkitProfile } from '../data/initialData';
import { AuthHeroShowcase } from '../components/auth/AuthHeroShowcase';
import { DemoCredentialsBar } from '../components/auth/DemoCredentialsBar';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { ToastContainer } from '../components/common/ToastContainer';

export function Login() {
  const navigate = useNavigate();
  const auth = useAuth?.() || {};
  const { showToast: authShowToast, removeToast: authRemoveToast } = auth;

  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [loginRole, setLoginRole] = useState('seeker');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Registration state: strictly empty by default so only placeholder text is visible
  const [regRole, setRegRole] = useState('user'); // 'user' or 'hr'
  const [regName, setRegName] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Local toasts state for fallback
  const [toasts, setToasts] = useState([]);
  const [showMobileNav, setShowMobileNav] = useState(false);

  // Authenticated session check: hide mobile navigation menu on login/signup pages when unauthenticated
  const token = typeof window !== 'undefined' ? localStorage.getItem('jobconnect_token') : null;
  const isLoggedIn = Boolean(token && auth?.data?.currentUser && auth?.data?.currentUser?.status !== 'Suspended');

  // Auto-close mobile nav if logged out or on desktop resize
  useEffect(() => {
    if (!isLoggedIn) {
      setShowMobileNav(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setShowMobileNav(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    return () => {
      setToasts([]);
    };
  }, []);

  // Ensure all registration fields are clean and empty whenever switching to Create Account
  useEffect(() => {
    if (authMode === 'register') {
      setRegName('');
      setRegCompany('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
      setRegConfirmPassword('');
      setAgreeTerms(false);
    }
  }, [authMode]);

  const showToast = (message, type = 'success') => {
    if (!message) return;
    const cleanMsg = message.trim();
    if (authShowToast) {
      authShowToast(cleanMsg, type, 3000);
    } else {
      const id = `login-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setToasts((prev) => {
        if (prev.some((t) => t.message === cleanMsg)) return prev;
        return [...prev, { id, message: cleanMsg, type }];
      });
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    }
  };

  const fillDemoCredentials = (role) => {
    setAuthMode('login');
    if (role === 'user') {
      setLoginRole('seeker');
      setLoginEmail('ankit.dev@example.com');
      setLoginPassword('candidate123');
      showToast('Auto-filled Candidate credentials!', 'info');
    } else if (role === 'hr') {
      setLoginRole('hr');
      setLoginEmail('priya.hr@abctech.com');
      setLoginPassword('recruiter123');
      showToast('Auto-filled HR Recruiter credentials!', 'info');
    } else if (role === 'admin') {
      setLoginRole('admin');
      setLoginEmail('admin@jobconnect.io');
      setLoginPassword('superadmin123');
      showToast('Auto-filled Super Admin credentials!', 'info');
    }
  };

  const apiCall = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      const contentType = response.headers.get('content-type') || '';
      if (!response.ok && contentType.includes('text/html')) {
        throw new Error('Proxy returned HTML');
      }
      return response;
    } catch (proxyErr) {
      // Direct call fallback to backend port 5000
      const directUrl = `http://localhost:5000${url.startsWith('/') ? url : `/${url}`}`;
      return await fetch(directUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
    }
  };

  const applyDemoLogin = (roleType) => {
    const expectedFrontendRole = roleType === 'user' ? 'seeker' : roleType;
    if (loginRole !== expectedFrontendRole) {
      if (loginRole === 'seeker') {
        const attemptedLabel = roleType === 'admin' ? 'Admin' : 'HR';
        showToast(
          `Access denied: Candidate login does not allow ${attemptedLabel} accounts. Please switch to the ${attemptedLabel === 'Admin' ? 'Super Admin' : 'HR Recruiter'} login tab.`,
          'error'
        );
      } else if (loginRole === 'hr') {
        showToast(
          `Access denied: This account is not registered as an HR Recruiter. Please select your authorized role.`,
          'error'
        );
      } else {
        showToast(
          `Access denied: This account does not have Super Admin privileges. Please select your authorized role.`,
          'error'
        );
      }
      setIsSubmitting(false);
      return;
    }

    let demoUser = null;
    let targetRole = 'seeker';

    if (roleType === 'user') {
      targetRole = 'seeker';
      demoUser = {
        id: 1,
        _id: 1,
        name: 'Ankit Kumar',
        email: 'ankit.dev@example.com',
        role: 'user',
        status: 'Active',
        phone: '+91 98765 43210',
        location: 'Ranchi, Jharkhand',
        title: 'Full Stack MERN Developer',
        about: 'Proactive Full-Stack Software Developer passionate about high-performance web applications with React, Node.js, Express, and MySQL.',
        skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express', 'MySQL', 'Git', 'Tailwind CSS'],
        resume_name: 'Ankit_Kumar_FullStack_Resume.pdf'
      };
    } else if (roleType === 'hr') {
      targetRole = 'hr';
      demoUser = {
        id: 2,
        _id: 2,
        name: 'Priya Sharma',
        email: 'priya.hr@abctech.com',
        role: 'hr',
        company: 'ABC Technologies',
        company_name: 'ABC Technologies',
        status: 'Active',
        phone: '+91 98111 22334',
        location: 'Ranchi, Jharkhand',
        title: 'Lead Technical Recruiter',
        skills: ['Technical Sourcing', 'Candidate Screening', 'Engineering Pipeline']
      };
    } else {
      targetRole = 'admin';
      demoUser = {
        id: 3,
        _id: 3,
        name: 'Platform Admin',
        email: 'admin@jobconnect.io',
        role: 'admin',
        company: 'JobConnect Platform Ops',
        company_name: 'JobConnect Platform Ops',
        status: 'Active',
        phone: '+91 90000 00000',
        location: 'New Delhi',
        title: 'Super Administrator',
        skills: ['System Security', 'DB Administration', 'RBAC']
      };
    }

    const demoToken = `jobconnect_jwt_token_demo_${roleType}_${Date.now()}`;
    localStorage.setItem('jobconnect_token', demoToken);

    if (auth.loginUserSuccess) {
      auth.loginUserSuccess(demoUser, targetRole, demoToken);
    }

    let state = {};
    try {
      state = JSON.parse(localStorage.getItem('jobconnect_state')) || {};
    } catch (e) {
      state = {};
    }

    state.currentUserRole = targetRole;
    state.currentUser = demoUser;
    if (targetRole === 'seeker') {
      state.profile = demoAnkitProfile;
    }
    localStorage.setItem('jobconnect_state', JSON.stringify(state));

    showToast(
      `Welcome, ${demoUser.name}! Successfully signed in as ${targetRole === 'seeker' ? 'Candidate' : targetRole === 'hr' ? 'HR Recruiter' : 'Super Admin'}.`,
      'success'
    );

    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/');
    }, 600);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isCandidate = loginEmail.trim().toLowerCase() === 'ankit.dev@example.com' && loginPassword === 'candidate123';
    const isRecruiter = loginEmail.trim().toLowerCase() === 'priya.hr@abctech.com' && loginPassword === 'recruiter123';
    const isAdmin = loginEmail.trim().toLowerCase() === 'admin@jobconnect.io' && loginPassword === 'superadmin123';

    // Frontend validation guard: Candidate login rejects Admin and HR demo credentials immediately
    if (loginRole === 'seeker' && (isAdmin || isRecruiter)) {
      showToast(
        `Access denied: Candidate login does not allow ${isAdmin ? 'Admin' : 'HR'} accounts. Please switch to the ${isAdmin ? 'Super Admin' : 'HR Recruiter'} login tab.`,
        'error'
      );
      setIsSubmitting(false);
      return;
    }
    if (loginRole === 'hr' && (isCandidate || isAdmin)) {
      showToast(
        `Access denied: This account is not registered as an HR Recruiter. Please select your authorized role.`,
        'error'
      );
      setIsSubmitting(false);
      return;
    }
    if (loginRole === 'admin' && (isCandidate || isRecruiter)) {
      showToast(
        `Access denied: This account does not have Super Admin privileges. Please select your authorized role.`,
        'error'
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword,
          role: loginRole === 'seeker' ? 'user' : loginRole
        })
      });

      let data = null;
      try {
        data = await res.json();
      } catch (parseErr) {
        data = null;
      }

      if (!res.ok || !data || !data.success) {
        showToast(data?.message || 'Invalid email or password.', 'error');
        setIsSubmitting(false);
        return;
      }

      const targetRole = data.user.role === 'user' ? 'seeker' : data.user.role;
      if (targetRole !== loginRole) {
        showToast(
          `Access denied: Authenticated role (${data.user.role}) does not match the selected ${loginRole === 'seeker' ? 'Candidate' : loginRole === 'hr' ? 'HR Recruiter' : 'Super Admin'} login portal.`,
          'error'
        );
        setIsSubmitting(false);
        return;
      }

      if (data.token) {
        localStorage.setItem('jobconnect_token', data.token);
      }

      if (auth.loginUserSuccess) {
        auth.loginUserSuccess(data.user, targetRole, data.token);
      }

      let state = {};
      try {
        state = JSON.parse(localStorage.getItem('jobconnect_state')) || {};
      } catch (err) {
        state = {};
      }

      state.currentUserRole = targetRole;
      state.currentUser = data.user;

      if (targetRole === 'seeker') {
        if (data.user.email !== 'ankit.dev@example.com') {
          state.profile = {
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone || '',
            location: data.user.location || '',
            title: data.user.title || 'Candidate',
            about: data.user.about || '',
            skills: data.user.skills ? (Array.isArray(data.user.skills) ? data.user.skills : data.user.skills.split(',').map((s) => s.trim())) : [],
            education: data.user.education || [],
            experience: data.user.experience || [],
            projects: data.user.projects || [],
            resumeName: data.user.resume_name || null,
            resumeUploadDate: data.user.resume_name ? 'Active' : null
          };
        } else {
          state.profile = demoAnkitProfile;
        }
      } else if (targetRole === 'hr') {
        state.profile = {
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || '',
          company: data.user.company || data.user.company_name || '',
          location: data.user.location || '',
          title: data.user.title || 'HR Recruiter',
          about: data.user.about || '',
          skills: data.user.skills ? (Array.isArray(data.user.skills) ? data.user.skills : data.user.skills.split(',').map((s) => s.trim())) : [],
          education: data.user.education || [],
          experience: data.user.experience || [],
          projects: []
        };
      }
      localStorage.setItem('jobconnect_state', JSON.stringify(state));

      showToast(`Welcome back, ${data.user.name}! Authenticated via MySQL.`, 'success');

      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/');
      }, 700);
    } catch (err) {
      console.error('Login error:', err);
      if (loginRole === 'seeker' && isCandidate) {
        applyDemoLogin('user');
        return;
      }
      if (loginRole === 'hr' && isRecruiter) {
        applyDemoLogin('hr');
        return;
      }
      if (loginRole === 'admin' && isAdmin) {
        applyDemoLogin('admin');
        return;
      }
      showToast(`Backend connection error: Could not connect to http://localhost:5000. Ensure the backend server is running.`, 'error');
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      showToast('Passwords do not match!', 'error');
      return;
    }

    if (regPassword.length < 6) {
      showToast('Password must be at least 6 characters long!', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await apiCall('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          phone: regPhone.trim(),
          password: regPassword,
          role: regRole,
          company: regRole === 'hr' ? regCompany.trim() : null
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast(data.message || 'Registration failed. Please check your inputs.', 'error');
        setIsSubmitting(false);
        return;
      }

      const newUser = {
        id: data.user?.id ? `u-${data.user.id}` : `u-${Date.now()}`,
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        role: regRole,
        status: 'Active',
        company: regRole === 'hr' ? regCompany.trim() : undefined,
        joined: new Date().toISOString().split('T')[0]
      };

      if (auth.registerNewUser) {
        auth.registerNewUser(newUser);
      }

      try {
        const state = JSON.parse(localStorage.getItem('jobconnect_state')) || {};
        if (Array.isArray(state.users)) {
          if (!state.users.some((u) => u.email === regEmail.trim())) {
            state.users.push(newUser);
          }
          localStorage.setItem('jobconnect_state', JSON.stringify(state));
        }

        const storedMap = JSON.parse(localStorage.getItem('jobconnect_user_profiles') || '{}');
        storedMap[regEmail.trim()] = {
          name: regName.trim(),
          email: regEmail.trim(),
          phone: regPhone.trim(),
          company: regRole === 'hr' ? regCompany.trim() : '',
          location: '',
          title: regRole === 'hr' ? 'HR Recruiter' : 'Candidate',
          about: '',
          skills: [],
          education: [],
          experience: [],
          projects: [],
          resumeName: null,
          resumeUploadDate: null
        };
        localStorage.setItem('jobconnect_user_profiles', JSON.stringify(storedMap));
      } catch (err) {
        console.error(err);
      }

      showToast(`Account successfully created in MySQL database! (User #${data.user?.id || 'new'}) Please sign in.`, 'success');
      setAuthMode('login');
      setLoginEmail(regEmail.trim());
      setLoginPassword(regPassword);
      setLoginRole(regRole === 'hr' ? 'hr' : 'seeker');
    } catch (err) {
      console.error('Registration error:', err);
      showToast(`Database error: Cannot reach MySQL backend at http://localhost:5000. Please ensure the backend is running!`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerForgotPassword = () => {
    const emailPrompt = prompt(
      'Enter your registered email address for password reset link:',
      loginEmail || 'ankit.dev@example.com'
    );
    if (emailPrompt) {
      showToast(`Reset link dispatched to ${emailPrompt}!`, 'info');
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* ================= TOP NAV BAR ================= */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-indigo-700 bg-clip-text text-transparent">
              JobConnect
            </span>
            <span className="block text-[9px] font-bold text-indigo-700 tracking-wider uppercase -mt-1">
              Enterprise Auth Guard
            </span>
          </div>
        </Link>

        {/* Desktop Quick Nav Actions */}
        {/* <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl transition border border-indigo-100/80"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Explore Open Jobs</span>
          </Link>
        </div> */}

        {/* Mobile Hamburger Toggle Button */}
        {/* <button
          type="button"
          onClick={() => setShowMobileNav((prev) => !prev)}
          className="sm:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          title="Toggle Navigation Menu"
          aria-label="Toggle Navigation Menu"
          aria-expanded={showMobileNav}
        >
          {showMobileNav ? (
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button> */}

        {/* Mobile Dropdown Menu Container */}
        {showMobileNav && (
          <div className="sm:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-xl border-b border-slate-200 shadow-2xl px-4 py-4 space-y-3 animate-fade-in text-xs z-50">
            <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Auth Navigation
            </div>

            <Link
              to="/"
              onClick={() => setShowMobileNav(false)}
              className="w-full px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Browse Open Jobs Portal</span>
              </div>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setShowMobileNav(false);
                }}
                className={`py-2 px-3 rounded-xl font-bold text-center border transition ${
                  authMode === 'login'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setRegName('');
                  setRegCompany('');
                  setRegEmail('');
                  setRegPhone('');
                  setRegPassword('');
                  setRegConfirmPassword('');
                  setAgreeTerms(false);
                  setAuthMode('register');
                  setShowMobileNav(false);
                }}
                className={`py-2 px-3 rounded-xl font-bold text-center border transition ${
                  authMode === 'register'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                1-Click Demo Logins
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    fillDemoCredentials('user');
                    setShowMobileNav(false);
                  }}
                  className="px-2 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] border border-indigo-100"
                >
                  Candidate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    fillDemoCredentials('hr');
                    setShowMobileNav(false);
                  }}
                  className="px-2 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[11px] border border-purple-100"
                >
                  HR Recruiter
                </button>
                <button
                  type="button"
                  onClick={() => {
                    fillDemoCredentials('admin');
                    setShowMobileNav(false);
                  }}
                  className="px-2 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] border border-rose-100"
                >
                  Super Admin
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Backdrop overlay for mobile login nav */}
      {showMobileNav && (
        <div
          className="fixed inset-0 top-16 bg-slate-900/40 backdrop-blur-xs z-30 sm:hidden animate-fade-in"
          onClick={() => setShowMobileNav(false)}
          aria-hidden="true"
        />
      )}

      {/* ================= MAIN AUTH SECTION (SPLIT SCREEN) ================= */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* LEFT COLUMN: HERO SHOWCASE */}
          <AuthHeroShowcase />

          {/* RIGHT COLUMN: INTERACTIVE AUTH FORM */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`px-5 py-2 rounded-lg text-xs font-bold transition shadow-sm ${
                    authMode === 'login'
                      ? 'bg-white text-indigo-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRegName('');
                    setRegCompany('');
                    setRegEmail('');
                    setRegPhone('');
                    setRegPassword('');
                    setRegConfirmPassword('');
                    setAgreeTerms(false);
                    setAuthMode('register');
                  }}
                  className={`px-5 py-2 rounded-lg text-xs font-bold transition shadow-sm ${
                    authMode === 'register'
                      ? 'bg-white text-indigo-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Role-Based Access Control</span>
            </div>

            {/* 1-CLICK DEMO TEST ACCOUNTS BAR */}
            {authMode === 'login' && (
              <DemoCredentialsBar onFillDemoCredentials={fillDemoCredentials} />
            )}

            {/* FORM 1: SIGN IN */}
            {authMode === 'login' ? (
              <LoginForm
                loginRole={loginRole}
                setLoginRole={setLoginRole}
                loginEmail={loginEmail}
                setLoginEmail={setLoginEmail}
                loginPassword={loginPassword}
                setLoginPassword={setLoginPassword}
                showLoginPassword={showLoginPassword}
                setShowLoginPassword={setShowLoginPassword}
                rememberMe={rememberMe}
                setRememberMe={setRememberMe}
                isSubmitting={isSubmitting}
                onSubmit={handleLoginSubmit}
                onForgotPassword={triggerForgotPassword}
              />
            ) : (
              /* FORM 2: CREATE ACCOUNT (REGISTER) */
              <RegisterForm
                regRole={regRole}
                setRegRole={setRegRole}
                regName={regName}
                setRegName={setRegName}
                regCompany={regCompany}
                setRegCompany={setRegCompany}
                regEmail={regEmail}
                setRegEmail={setRegEmail}
                regPhone={regPhone}
                setRegPhone={setRegPhone}
                regPassword={regPassword}
                setRegPassword={setRegPassword}
                regConfirmPassword={regConfirmPassword}
                setRegConfirmPassword={setRegConfirmPassword}
                agreeTerms={agreeTerms}
                setAgreeTerms={setAgreeTerms}
                isSubmitting={isSubmitting}
                onSubmit={handleRegisterSubmit}
              />
            )}
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-400">
        JobConnect Security • Signed JWT Tokens • bcrypt Hashed Credentials • RBAC Active
      </footer>

      {/* Toast container */}
      <ToastContainer
        toasts={auth.toasts && auth.toasts.length > 0 ? auth.toasts : toasts}
        removeToast={(id) => {
          if (authRemoveToast) authRemoveToast(id);
          setToasts((prev) => prev.filter((item) => item.id !== id));
        }}
      />
    </div>
  );
}

export default Login;
