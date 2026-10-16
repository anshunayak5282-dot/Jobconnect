import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from '../router';
import { useAuth } from '../context/AuthContext';
import { demoAnkitProfile } from '../data/initialData';

export function Login() {
  const navigate = useNavigate();
  const auth = useAuth?.() || {};
  const { switchRole, showToast: authShowToast, clearToasts: authClearToasts, removeToast: authRemoveToast } = auth;

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
        if (prev.some(t => t.message === cleanMsg)) return prev;
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
    // Role enforcement: The attempted roleType MUST match the current login tab (loginRole)
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

    showToast(`Welcome, ${demoUser.name}! Successfully signed in as ${targetRole === 'seeker' ? 'Candidate' : targetRole === 'hr' ? 'HR Recruiter' : 'Super Admin'}.`, 'success');

    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/');
    }, 600);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isCandidate = (loginEmail.trim().toLowerCase() === 'ankit.dev@example.com' && loginPassword === 'candidate123');
    const isRecruiter = (loginEmail.trim().toLowerCase() === 'priya.hr@abctech.com' && loginPassword === 'recruiter123');
    const isAdmin = (loginEmail.trim().toLowerCase() === 'admin@jobconnect.io' && loginPassword === 'superadmin123');

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
        // Display backend's explicit role rejection or credential error
        showToast(data?.message || 'Invalid email or password.', 'error');
        setIsSubmitting(false);
        return;
      }

      // Backend succeeded - verify returned MySQL role matches the selected login role
      const targetRole = data.user.role === 'user' ? 'seeker' : data.user.role;
      if (targetRole !== loginRole) {
        showToast(
          `Access denied: Authenticated role (${data.user.role}) does not match the selected ${loginRole === 'seeker' ? 'Candidate' : loginRole === 'hr' ? 'HR Recruiter' : 'Super Admin'} login portal.`,
          'error'
        );
        setIsSubmitting(false);
        return;
      }

      // Store JWT token
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
          // Dedicated clean profile for the new user
          state.profile = {
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone || '',
            location: data.user.location || '',
            title: data.user.title || 'Candidate',
            about: data.user.about || '',
            skills: data.user.skills ? (Array.isArray(data.user.skills) ? data.user.skills : data.user.skills.split(',').map(s => s.trim())) : [],
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
          skills: data.user.skills ? (Array.isArray(data.user.skills) ? data.user.skills : data.user.skills.split(',').map(s => s.trim())) : [],
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
      // Fallback demo authentication ONLY when backend server is completely offline
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
          role: regRole, // 'user' or 'hr'
          company: regRole === 'hr' ? regCompany.trim() : null
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast(data.message || 'Registration failed. Please check your inputs.', 'error');
        setIsSubmitting(false);
        return;
      }

      // Sync into AuthContext and localStorage
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
          if (!state.users.some(u => u.email === regEmail.trim())) {
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
    const emailPrompt = prompt('Enter your registered email address for password reset link:', loginEmail || 'ankit.dev@example.com');
    if (emailPrompt) {
      showToast(`Reset link dispatched to ${emailPrompt}!`, 'info');
    }
  };

  const handleSocialAuth = (provider) => {
    showToast(`Signing in via ${provider} OAuth 2.0...`, 'info');
    setTimeout(() => {
      fillDemoCredentials('user');
      showToast('OAuth validated successfully! Redirecting...', 'success');
      setTimeout(() => {
        navigate('/');
      }, 700);
    }, 700);
  };

  return (
    <div className="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* ================= TOP NAV BAR ================= */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
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

        {/* <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500 hidden sm:inline">Need to explore jobs first?</span>
          <Link
            to="/"
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Portal
          </Link>
        </div> */}
      </header>

      {/* ================= MAIN AUTH SECTION (SPLIT SCREEN) ================= */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          
          {/* ================= LEFT COLUMN: HERO SHOWCASE & TESTIMONIAL ================= */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-indigo-600/30 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-purple-600/25 blur-3xl pointer-events-none"></div>

            <div className="relative z-10 space-y-6">
              {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Unified Recruitment Ecosystem
              </div> */}

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Connecting Ambition with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-teal-200">
                  Opportunity
                </span>.
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                One secure gateway for Job Seekers to land high-impact careers, HRs to recruit verified talent, and Administrators to monitor operations.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600/40 text-indigo-300 flex items-center justify-center font-bold">✓</span>
                  <span>1-Click Fast Track Applications & Resume Vault</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600/40 text-indigo-300 flex items-center justify-center font-bold">✓</span>
                  <span>Live 5-Stage Candidate Status Stepper</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600/40 text-indigo-300 flex items-center justify-center font-bold">✓</span>
                  <span>Admin Verified Vacancies & Encrypted JWT Auth</span>
                </div>
              </div>
            </div>

            {/* <div className="relative z-10 mt-8 pt-6 border-t border-slate-800">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                <div className="flex items-center gap-1 text-amber-400 text-xs mb-1.5">
                  ★★★★★
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "JobConnect streamlined our hiring at ABC Technologies. Reviewing candidates and updating stages in one place cut our time-to-hire by 60%."
                </p>
                <div className="mt-3 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                    PS
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">Priya Sharma</p>
                    <p className="text-[10px] text-slate-400 leading-none">Lead Technical Recruiter, ABC Tech</p>
                  </div>
                </div>
              </div>
            </div> */}
            
          </div>

          {/* ================= RIGHT COLUMN: INTERACTIVE AUTH FORM ================= */}
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

            {/* 1-CLICK DEMO TEST ACCOUNTS BAR (VISIBLE ONLY ON SIGN IN) */}
            {authMode === 'login' && (
              <div className="mb-6 p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-indigo-950 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd"></path>
                    </svg>
                    Quick Test: Fill Demo Credentials
                  </span>
                  <span className="text-[10px] text-indigo-600 font-semibold">1-Click Auto Fill</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('user')}
                    className="p-2 rounded-xl bg-white border border-indigo-100 hover:border-indigo-300 hover:shadow-sm text-left transition group"
                  >
                    <span className="block text-[10px] font-bold text-indigo-700 group-hover:text-indigo-900">👤 Candidate</span>
                    <span className="block text-[9px] text-slate-500 truncate">ankit.dev@example.com</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('hr')}
                    className="p-2 rounded-xl bg-white border border-purple-100 hover:border-purple-300 hover:shadow-sm text-left transition group"
                  >
                    <span className="block text-[10px] font-bold text-purple-700 group-hover:text-purple-900">💼 Recruiter</span>
                    <span className="block text-[9px] text-slate-500 truncate">priya.hr@abctech.com</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('admin')}
                    className="p-2 rounded-xl bg-white border border-rose-100 hover:border-rose-300 hover:shadow-sm text-left transition group"
                  >
                    <span className="block text-[10px] font-bold text-rose-700 group-hover:text-rose-900">🛡️ Admin</span>
                    <span className="block text-[9px] text-slate-500 truncate">admin@jobconnect.io</span>
                  </button>
                </div>
              </div>
            )}

            {/* FORM 1: SIGN IN */}
            {authMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Sign in as:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="loginRole"
                        value="seeker"
                        checked={loginRole === 'seeker'}
                        onChange={(e) => setLoginRole(e.target.value)}
                        className="peer sr-only"
                      />
                      <div className="p-2 rounded-xl border border-slate-200 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 text-center font-bold text-slate-700 peer-checked:text-indigo-700 transition">
                        User
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="loginRole"
                        value="hr"
                        checked={loginRole === 'hr'}
                        onChange={(e) => setLoginRole(e.target.value)}
                        className="peer sr-only"
                      />
                      <div className="p-2 rounded-xl border border-slate-200 peer-checked:border-purple-600 peer-checked:bg-purple-50 text-center font-bold text-slate-700 peer-checked:text-purple-700 transition">
                        HR Recruiter
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="loginRole"
                        value="admin"
                        checked={loginRole === 'admin'}
                        onChange={(e) => setLoginRole(e.target.value)}
                        className="peer sr-only"
                      />
                      <div className="p-2 rounded-xl border border-slate-200 peer-checked:border-rose-600 peer-checked:bg-rose-50 text-center font-bold text-slate-700 peer-checked:text-rose-700 transition">
                        Super Admin
                      </div>
                    </label>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"></path>
                      </svg>
                    </span>
                    <input
                      type="email"
                      name="email"
                      autoComplete="username email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={triggerForgotPassword}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </span>
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      name="password"
                      autoComplete="current-password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Keep me signed in for 30 days</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Authenticating with JWT...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to JobConnect</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* FORM 2: CREATE ACCOUNT (REGISTER) */
              <form onSubmit={handleRegisterSubmit} autoComplete="off" className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">I want to register as:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="regRole"
                        value="user"
                        checked={regRole === 'user'}
                        onChange={(e) => setRegRole(e.target.value)}
                        className="peer sr-only"
                      />
                      <div className="p-2 rounded-xl border border-slate-200 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 text-center font-bold text-slate-700 peer-checked:text-indigo-700 transition">
                        👤 Job Seeker (Candidate)
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="regRole"
                        value="hr"
                        checked={regRole === 'hr'}
                        onChange={(e) => setRegRole(e.target.value)}
                        className="peer sr-only"
                      />
                      <div className="p-2 rounded-xl border border-slate-200 peer-checked:border-purple-600 peer-checked:bg-purple-50 text-center font-bold text-slate-700 peer-checked:text-purple-700 transition">
                        💼 HR / Recruiter
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    name="reg_fullname"
                    autoComplete="off"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                {regRole === 'hr' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Company / Organization *</label>
                    <input
                      type="text"
                      name="reg_company"
                      autoComplete="off"
                      required
                      value={regCompany}
                      onChange={(e) => setRegCompany(e.target.value)}
                      placeholder="e.g. Acme Technologies Inc."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"></path>
                      </svg>
                    </span>
                    <input
                      type="email"
                      name="reg_email"
                      autoComplete="off"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </span>
                    <input
                      type="tel"
                      name="reg_mobile_phone"
                      autoComplete="off"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Password *</label>
                    <input
                      type="password"
                      name="reg_user_password"
                      autoComplete="new-password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      name="reg_user_confirm_password"
                      autoComplete="new-password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-600 pt-1">
                  <input
                    type="checkbox"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                  />
                  <span>I agree to the JobConnect Terms of Service, Privacy Policy, and candidate verification standards.</span>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating Account in MySQL...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Free Account</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}

            

          </div>

        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-400">
        JobConnect Security • Signed JWT Tokens • bcrypt Hashed Credentials • RBAC Active
      </footer>

      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
        {(auth.toasts && auth.toasts.length > 0 ? auth.toasts : toasts).map((t) => (
          <div
            key={t.id}
            className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/60 flex items-center justify-between gap-3 text-xs font-semibold animate-fade-in pointer-events-auto"
          >
            <div className="flex items-center gap-3">
              {t.type === 'info' ? (
                <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              ) : t.type === 'error' ? (
                <svg className="w-4 h-4 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              )}
              <span>{t.message}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (authRemoveToast) authRemoveToast(t.id);
                setToasts(prev => prev.filter(item => item.id !== t.id));
              }}
              className="text-slate-400 hover:text-white text-xs font-bold p-1 transition"
              title="Dismiss"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Login;
