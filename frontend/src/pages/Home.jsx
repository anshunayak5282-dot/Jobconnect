import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from '../router';
import { useAuth } from '../context/AuthContext';

export function Home() {
  const navigate = useNavigate();
  const {
    data,
    toasts,
    showToast,
    removeToast,
    clearToasts,
    switchRole,
    resetAllData,
    applyForJob,
    toggleSaveJob,
    postNewJob,
    updateApplicationStatus,
    approveJob,
    rejectJob,
    approveProfileRequest,
    rejectProfileRequest,
    toggleUserStatus,
    addSkill,
    removeSkill,
    addEducation,
    removeEducation,
    addExperience,
    removeExperience,
    addProject,
    removeProject,
    updateProfile,
    logout
  } = useAuth();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [rejectProfileModalData, setRejectProfileModalData] = useState(null);
  const [rejectReasonText, setRejectReasonText] = useState('');
  const [editProfileForm, setEditProfileForm] = useState({
    name: '',
    title: '',
    company: '',
    location: '',
    phone: '',
    about: ''
  });

  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [summaryText, setSummaryText] = useState(data.profile?.about || '');

  // Education form state
  const [showAddEdu, setShowAddEdu] = useState(false);
  const [eduForm, setEduForm] = useState({ degree: '', institution: '', year: '' });

  // Experience form state
  const [showAddExp, setShowAddExp] = useState(false);
  const [expForm, setExpForm] = useState({ position: '', company: '', startDate: '', endDate: '', description: '' });

  // Projects form state
  const [showAddProj, setShowAddProj] = useState(false);
  const [projForm, setProjForm] = useState({ title: '', technologies: '', description: '', link: '' });

  useEffect(() => {
    setSummaryText(data.profile?.about || '');
  }, [data.profile?.about]);

  const handleSaveSummary = () => {
    if (updateProfile) {
      updateProfile({ about: summaryText });
    }
    setIsEditingSummary(false);
  };

  const handleAddEducationSubmit = (e) => {
    e.preventDefault();
    if (!eduForm.degree.trim() || !eduForm.institution.trim()) {
      showToast('Please enter both Degree and Institution.', 'error');
      return;
    }
    if (addEducation) {
      addEducation({
        degree: eduForm.degree.trim(),
        institution: eduForm.institution.trim(),
        year: eduForm.year.trim() || new Date().getFullYear().toString()
      });
    }
    setEduForm({ degree: '', institution: '', year: '' });
    setShowAddEdu(false);
  };

  const handleAddExperienceSubmit = (e) => {
    e.preventDefault();
    if (!expForm.position.trim() || !expForm.company.trim()) {
      showToast('Please enter Position and Company name.', 'error');
      return;
    }
    if (addExperience) {
      addExperience({
        position: expForm.position.trim(),
        company: expForm.company.trim(),
        startDate: expForm.startDate.trim() || '2023',
        endDate: expForm.endDate.trim() || 'Present',
        description: expForm.description.trim() || 'Contributing to key projects and deliverables.'
      });
    }
    setExpForm({ position: '', company: '', startDate: '', endDate: '', description: '' });
    setShowAddExp(false);
  };

  const handleAddProjectSubmit = (e) => {
    e.preventDefault();
    if (!projForm.title.trim()) {
      showToast('Please enter a Project Title.', 'error');
      return;
    }
    const techArray = projForm.technologies
      ? projForm.technologies.split(',').map((t) => t.trim()).filter(Boolean)
      : ['Web Tech'];

    if (addProject) {
      addProject({
        title: projForm.title.trim(),
        description: projForm.description.trim() || 'Project developed and published by candidate.',
        technologies: techArray,
        link: projForm.link.trim()
      });
    }
    setProjForm({ title: '', technologies: '', description: '', link: '' });
    setShowAddProj(false);
  };

  const handleLogoutClick = () => {
    setShowUserMenu(false);
    if (logout) {
      logout();
    }
    navigate('/login');
  };

  // Derive active role strictly from authenticated MySQL user role to prevent spoofing
  const currentRole = useMemo(() => {
    const dbRole = data.currentUser?.role;
    if (dbRole === 'user') return 'seeker';
    if (dbRole === 'hr') return 'hr';
    if (dbRole === 'admin') return 'admin';
    return data.currentUserRole || 'seeker';
  }, [data.currentUser?.role, data.currentUserRole]);

  // Seeker active sub-tab
  const [seekerTab, setSeekerTab] = useState('explore'); // 'explore' | 'applications' | 'saved' | 'profile'

  // Search & Filter state
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [expFilters, setExpFilters] = useState([]);
  const [minSalary, setMinSalary] = useState(0);
  const [sortBy, setSortBy] = useState('newest');

  // Modals state
  const [selectedJobDetail, setSelectedJobDetail] = useState(null);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [candidateModalData, setCandidateModalData] = useState(null);

  // Cover letter in apply modal
  const [coverLetter, setCoverLetter] = useState('');

  // Notifications dropdown
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  // HR filters
  const [hrJobFilter, setHrJobFilter] = useState('all');
  const [hrStatusFilter, setHrStatusFilter] = useState('all');

  // Post Job Form State
  const [postForm, setPostForm] = useState({
    title: '',
    company: '',
    location: 'Ranchi',
    jobType: 'Full Time',
    experience: 'Fresher',
    salaryMin: 4,
    salaryMax: 8,
    skills: '',
    description: ''
  });

  // Profile new skill input
  const [newSkillText, setNewSkillText] = useState('');

  // Filtered jobs calculation
  const filteredJobs = useMemo(() => {
    let list = (data.jobs || []).filter((j) => j.status === 'Approved');

    if (keyword.trim()) {
      const q = keyword.toLowerCase().trim();
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q)) ||
          j.description.toLowerCase().includes(q)
      );
    }

    if (location) {
      list = list.filter((j) => j.location.toLowerCase() === location.toLowerCase());
    }

    if (jobType) {
      list = list.filter((j) => j.jobType === jobType);
    }

    if (minSalary > 0) {
      list = list.filter((j) => j.salaryMax >= minSalary);
    }

    if (expFilters.length > 0) {
      list = list.filter((j) => expFilters.includes(j.experience));
    }

    if (sortBy === 'salary') {
      list.sort((a, b) => b.salaryMax - a.salaryMax);
    } else {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  }, [data.jobs, keyword, location, jobType, minSalary, expFilters, sortBy]);

  const clearAllFilters = () => {
    setKeyword('');
    setLocation('');
    setJobType('');
    setExpFilters([]);
    setMinSalary(0);
    showToast('Filters reset', 'info');
  };

  const handleExpCheckboxChange = (val) => {
    setExpFilters((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
  };

  const handleOpenJobDetail = (job) => {
    setSelectedJobDetail(job);
    setCoverLetter(
      `I am excited to apply for ${job.title} at ${job.company}. My background in ${job.skills.slice(0, 3).join(', ')} aligns well with your team's objectives.`
    );
  };

  const handleApplySubmit = (jobId) => {
    if (profileCompleteness < 100) {
      showToast('Complete your profile to 100% to apply for jobs.', 'error');
      setSelectedJobDetail(null);
      setSeekerTab('profile');
      return;
    }
    applyForJob(jobId, coverLetter || 'Interested in the opportunity.');
    setSelectedJobDetail(null);
  };

  const handlePostJobSubmit = (e) => {
    e.preventDefault();
    const skillsArray = postForm.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    postNewJob({
      title: postForm.title,
      company: postForm.company,
      location: postForm.location,
      jobType: postForm.jobType,
      experience: postForm.experience,
      salaryMin: Number(postForm.salaryMin),
      salaryMax: Number(postForm.salaryMax),
      skills: skillsArray.length > 0 ? skillsArray : ['General Tech'],
      description: postForm.description,
      deadline: 'In 30 days'
    });

    setShowPostJobModal(false);
    setPostForm({
      title: '',
      company: myCompany || '',
      location: 'Ranchi',
      jobType: 'Full Time',
      experience: 'Fresher',
      salaryMin: 4,
      salaryMax: 8,
      skills: '',
      description: ''
    });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (updateProfile) {
      updateProfile(editProfileForm);
    }
    setShowEditProfileModal(false);
  };

  const previewResume = (name) => {
    const candidateName = name || data.profile?.name || 'Candidate';
    const resumeDoc = data.profile?.resumeName || `${candidateName.replace(/\s+/g, '_')}_Resume.pdf`;
    const skillsList = (data.profile?.skills || []).length > 0 ? data.profile.skills.join(', ') : 'Not specified';
    alert(
      `[JobConnect PDF Viewer Simulation]\n\nCandidate: ${candidateName}\nResume Document: ${resumeDoc}\nTitle: ${data.profile?.title || 'Job Seeker'}\nLocation: ${data.profile?.location || 'India'}\nSkills: ${skillsList}\nStatus: Verified by JobConnect.`
    );
  };

  const simulateUploadResume = () => {
    const candidateName = (data.profile?.name || 'My').replace(/\s+/g, '_');
    const defaultName = `${candidateName}_Resume.pdf`;
    const newName = prompt('Enter resume filename to upload (e.g. My_Resume.pdf):', defaultName);
    if (newName && newName.trim()) {
      if (updateProfile) {
        updateProfile({ resumeName: newName.trim(), resumeUploadDate: 'Just now' });
      }
      showToast(`Resume attached: ${newName.trim()}`, 'success');
    }
  };

  const openCandidateDetail = (email) => {
    if (email === data.profile?.email) {
      setCandidateModalData(data.profile);
      return;
    }

    try {
      const storedMap = JSON.parse(localStorage.getItem('jobconnect_user_profiles') || '{}');
      if (storedMap[email]) {
        setCandidateModalData(storedMap[email]);
        return;
      }
    } catch (e) {}

    fetch(`/api/users/profile/${encodeURIComponent(email)}`)
      .then(res => res.json())
      .then(resData => {
        if (resData.success && resData.data) {
          const user = resData.data;
          setCandidateModalData({
            name: user.name || 'Candidate',
            email: user.email,
            phone: user.phone || 'Not provided',
            location: user.location || 'India',
            about: user.about || 'Candidate looking for relevant opportunities.',
            skills: user.skills ? (Array.isArray(user.skills) ? user.skills : user.skills.split(',').map(s => s.trim())) : ['General Tech'],
            education: user.education || [],
            experience: user.experience || [],
            projects: user.projects || []
          });
        } else {
          setCandidateModalData({
            name: 'Sneha Roy',
            email: 'sneha.roy@example.com',
            phone: '+91 94321 88990',
            location: 'Ranchi',
            about: 'Frontend engineer with hands-on expertise building single-page applications with React and CSS.',
            skills: ['React', 'JavaScript', 'HTML', 'CSS'],
            education: [{ degree: 'B.Sc Information Technology', institution: 'Ranchi University', year: '2024' }],
            experience: [{ company: 'WebStudio', position: 'Junior Dev', startDate: '2024', endDate: '2025', description: 'Created client websites' }],
            projects: []
          });
        }
      })
      .catch(() => {
        setCandidateModalData({
          name: 'Sneha Roy',
          email: 'sneha.roy@example.com',
          phone: '+91 94321 88990',
          location: 'Ranchi',
          about: 'Frontend engineer with hands-on expertise building single-page applications with React and CSS.',
          skills: ['React', 'JavaScript', 'HTML', 'CSS'],
          education: [{ degree: 'B.Sc Information Technology', institution: 'Ranchi University', year: '2024' }],
          experience: [{ company: 'WebStudio', position: 'Junior Dev', startDate: '2024', endDate: '2025', description: 'Created client websites' }],
          projects: []
        });
      });
  };

  // Seeker user stats
  const activeUserEmail = data.currentUser?.email || data.profile?.email;
  const myApplications = (data.applications || []).filter(
    (a) => a.applicantEmail === activeUserEmail
  );
  const savedJobs = (data.jobs || []).filter((j) =>
    (data.savedJobIds || []).includes(j.id)
  );

  const userInitials = useMemo(() => {
    const name = data.profile?.name || data.currentUser?.name || 'User';
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [data.profile?.name, data.currentUser?.name]);

  const profileCompleteness = useMemo(() => {
    const p = data.profile || {};
    let score = 0;
    if (p.name && String(p.name).trim()) score += 20;
    if (p.email && String(p.email).trim()) score += 20;
    if (p.phone && String(p.phone).trim()) score += 15;
    if (p.location && String(p.location).trim()) score += 15;
    if (p.title && String(p.title).trim()) score += 10;
    if (p.about && String(p.about).trim()) score += 10;
    const hasSkills = Array.isArray(p.skills)
      ? p.skills.length > 0
      : Boolean(p.skills && String(p.skills).trim());
    if (hasSkills) score += 10;
    return Math.min(score, 100);
  }, [data.profile]);

  // HR computations & strict multi-tenant isolation
  const hrUser = data.currentUser || {};
  const hrEmail = (hrUser.email || data.profile?.email || '').toLowerCase().trim();
  const isDemoHR = hrEmail === 'priya.hr@abctech.com';
  const hrCompany = hrUser.company || hrUser.company_name || data.profile?.company || (isDemoHR ? 'ABC Technologies' : '');
  const myCompany = hrCompany;
  const hrName = hrUser.name || data.profile?.name || '';
  const hrId = hrUser.id || hrUser._id;

  useEffect(() => {
    if (myCompany) {
      setPostForm((prev) => ({ ...prev, company: prev.company || myCompany }));
    }
  }, [myCompany]);

  const hrJobs = useMemo(() => {
    return (data.jobs || []).filter((j) => {
      // 1. If logged in as the demo Priya account, show Priya's ABC Tech demo vacancies
      if (isDemoHR) {
        return (
          j.company === 'ABC Technologies' ||
          j.postedBy === 'HR - Priya Sharma' ||
          String(j.posted_by) === '2'
        );
      }

      // 2. For newly registered HR accounts, STRICTLY ISOLATE:
      // Do NOT show Priya Sharma or ABC Technologies demo vacancies
      const isDemoJob =
        j.postedBy === 'HR - Priya Sharma' ||
        String(j.posted_by) === '2' ||
        (j.company === 'ABC Technologies' && (j.id === 'job-1' || j.id === 1 || j.id === 'job-6'));

      if (isDemoJob) return false;

      // Match jobs explicitly created by this HR user
      const matchesCreatorId =
        hrId && (String(j.posted_by) === String(hrId) || String(j.postedBy) === String(hrId));
      const matchesCreatorEmail =
        hrEmail && j.postedByEmail && j.postedByEmail.toLowerCase() === hrEmail;
      const matchesCreatorName =
        hrName && (j.postedBy === `HR - ${hrName}` || j.postedBy === hrName);

      // Match jobs under this HR's company (only if company is non-empty)
      const matchesCompany =
        myCompany &&
        j.company &&
        j.company.toLowerCase().trim() === myCompany.toLowerCase().trim();

      return Boolean(matchesCreatorId || matchesCreatorEmail || matchesCreatorName || matchesCompany);
    });
  }, [data.jobs, isDemoHR, hrId, hrEmail, hrName, myCompany]);

  const hrActiveJobs = hrJobs.filter((j) => j.status === 'Approved');
  const hrJobIds = hrJobs.map((j) => j.id);
  const hrAllApps = (data.applications || []).filter((a) => hrJobIds.includes(a.jobId));
  const hrShortlisted = hrAllApps.filter((a) =>
    ['Shortlisted', 'Interview'].includes(a.status)
  );
  const hrSelected = hrAllApps.filter((a) => a.status === 'Selected');

  let hrFilteredApps = hrAllApps;
  if (hrJobFilter !== 'all') {
    hrFilteredApps = hrFilteredApps.filter((a) => a.jobId === hrJobFilter);
  }
  if (hrStatusFilter !== 'all') {
    hrFilteredApps = hrFilteredApps.filter((a) => a.status === hrStatusFilter);
  }

  // Admin computations
  const adminPendingJobs = (data.jobs || []).filter((j) => j.status === 'Pending');
  const adminSeekers = (data.users || []).filter((u) => u.role === 'user');
  const adminHrs = (data.users || []).filter((u) => u.role === 'hr');
  const adminPendingProfileRequests = (data.profileRequests || []).filter((r) => r.status === 'Pending');

  // HR computations & Profile Request status
  const hrProfileRequests = useMemo(() => {
    const userEmail = (data.currentUser?.email || data.profile?.email || '').toLowerCase().trim();
    const userId = data.currentUser?.id || data.currentUser?._id;
    return (data.profileRequests || []).filter((r) => {
      const rEmail = (r.userEmail || r.user_email || '').toLowerCase().trim();
      const rId = r.userId || r.user_id;
      return (userEmail && rEmail === userEmail) || (userId && String(rId) === String(userId));
    });
  }, [data.profileRequests, data.currentUser, data.profile]);

  const latestHrProfileRequest = hrProfileRequests.length > 0 ? hrProfileRequests[0] : null;

  // Stages for 5-stage stepper
  const stages = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected'];

  return (
    <div className="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* ================= MAIN HEADER NAVBAR ================= */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-600 bg-clip-text text-transparent">
                JobConnect
              </span>
              <span className="block text-[10px] font-semibold text-indigo-700 tracking-wider uppercase -mt-1">
                Enterprise Recruitment OS
              </span>
            </div>
          </Link>

          {/* Dynamic Role Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 font-medium text-sm text-slate-600">
            {currentRole === 'seeker' && (
              <>
                <button
                  onClick={() => setSeekerTab('explore')}
                  className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition ${
                    seekerTab === 'explore'
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  Explore Jobs
                </button>
                <button
                  onClick={() => setSeekerTab('applications')}
                  className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition ${
                    seekerTab === 'applications'
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  My Applications ({myApplications.length})
                </button>
                <button
                  onClick={() => setSeekerTab('saved')}
                  className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition ${
                    seekerTab === 'saved'
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                  Saved ({savedJobs.length})
                </button>
                <button
                  onClick={() => setSeekerTab('profile')}
                  className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition ${
                    seekerTab === 'profile'
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7 7z"></path>
                  </svg>
                  My Profile & Resume
                </button>
              </>
            )}

            {currentRole === 'hr' && (
              <span className="text-xs font-bold px-3 py-1 bg-purple-50 text-purple-700 rounded-xl border border-purple-100 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                Enterprise Recruiter Portal
              </span>
            )}

            {currentRole === 'admin' && (
              <span className="text-xs font-bold px-3 py-1 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                Super Admin Console ({adminPendingJobs.length + adminPendingProfileRequests.length} Pending)
              </span>
            )}
          </nav>

          {/* User Account Icon & Dropdown Menu with Logout */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu((prev) => !prev)}
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
                    {data.profile?.name || data.currentUser?.name || 'Account'}
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
                            {data.profile?.name || data.currentUser?.name || 'Logged In User'}
                          </p>
                          <p className="text-slate-500 text-[10px] truncate">
                            {data.profile?.email || data.currentUser?.email || 'user@example.com'}
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
                          <button
                            type="button"
                            onClick={() => {
                              setSeekerTab('profile');
                              setShowUserMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 font-semibold flex items-center gap-2.5 transition"
                          >
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7 7z"></path>
                            </svg>
                            <span>My Profile & Resume</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSeekerTab('applications');
                              setShowUserMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 font-semibold flex items-center gap-2.5 transition"
                          >
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                            <span>My Applications ({myApplications.length})</span>
                          </button>
                        </>
                      )}
                      {currentRole === 'hr' && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditProfileForm({
                              name: data.profile?.name || data.currentUser?.name || '',
                              title: data.profile?.title || 'HR Talent Acquisition',
                              company: myCompany || '',
                              location: data.profile?.location || '',
                              phone: data.profile?.phone || '',
                              about: data.profile?.about || ''
                            });
                            setShowUserMenu(false);
                            setShowEditProfileModal(true);
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
                        onClick={handleLogoutClick}
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

            <button
              onClick={() => setShowNotifPanel(!showNotifPanel)}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              title="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              {(data.notifications || []).length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* ================= NOTIFICATIONS POPUP ================= */}
      {showNotifPanel && (
        <div className="fixed top-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-4 animate-fade-in">
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
          <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto text-xs">
            {(data.notifications || []).map((n) => (
              <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition border border-slate-100">
                <p className="font-bold text-slate-800 text-xs">{n.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{n.text}</p>
                <span className="text-[10px] text-indigo-600 font-semibold block mt-1">{n.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ================= VIEW 1: JOB SEEKER VIEWS ================= */}
        {currentRole === 'seeker' && (
          <div className="space-y-8 animate-fade-in">

            {/* TAB 1: EXPLORE JOBS */}
            {seekerTab === 'explore' && (
              <div>
                {/* HERO SEARCH SECTION */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-8 md:p-12 shadow-xl mb-8">
                  <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
                  <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-purple-500/15 blur-3xl pointer-events-none"></div>
                  
                  <div className="relative z-10 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-4">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Verified Recruitment Platform 2026
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                      Discover Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-teal-200">Career Breakthrough</span>.
                    </h1>
                    <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed">
                      Connect directly with verified tech enterprises, startup unicorns, and top recruiters across India and globally.
                    </p>

                    {/* SEARCH BAR BOX */}
                    <div className="mt-6 bg-white p-2.5 rounded-2xl shadow-2xl flex flex-col md:flex-row items-stretch gap-2 text-slate-800">
                      <div className="flex-1 flex items-center px-3 gap-2 border-b md:border-b-0 md:border-r border-slate-200 py-1.5">
                        <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <input
                          type="text"
                          value={keyword}
                          onChange={(e) => setKeyword(e.target.value)}
                          placeholder="Job title, skill (e.g. React, Node.js), or company..."
                          className="w-full text-xs md:text-sm focus:outline-none bg-transparent placeholder-slate-400 font-medium"
                        />
                      </div>

                      <div className="flex-1 flex items-center px-3 gap-2 border-b md:border-b-0 md:border-r border-slate-200 py-1.5">
                        <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <select
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full text-xs md:text-sm focus:outline-none bg-transparent text-slate-700 font-medium cursor-pointer"
                        >
                          <option value="">All Locations</option>
                          <option value="Ranchi">Ranchi</option>
                          <option value="Bengaluru">Bengaluru</option>
                          <option value="Hyderabad">Hyderabad</option>
                          <option value="Pune">Pune</option>
                          <option value="Delhi NCR">Delhi NCR</option>
                          <option value="Remote">Remote</option>
                        </select>
                      </div>

                      <div className="flex items-center px-3 gap-2 py-1.5">
                        <select
                          value={jobType}
                          onChange={(e) => setJobType(e.target.value)}
                          className="w-full text-xs md:text-sm focus:outline-none bg-transparent text-slate-700 font-medium cursor-pointer"
                        >
                          <option value="">All Job Types</option>
                          <option value="Full Time">Full Time</option>
                          <option value="Part Time">Part Time</option>
                          <option value="Internship">Internship</option>
                          <option value="Contract">Contract</option>
                        </select>
                      </div>

                      <button
                        onClick={() => {}}
                        className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs md:text-sm shrink-0 shadow-lg shadow-indigo-600/30"
                      >
                        <span>Find Jobs</span>
                      </button>
                    </div>

                    {/* Quick tags */}
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                      <span className="text-slate-400 font-medium">Popular:</span>
                      {['React', 'Node.js', 'Fresher', 'Remote', 'MongoDB'].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setKeyword(tag)}
                          className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Profile Completeness Alert for Job Seekers */}
                {profileCompleteness < 100 && (
                  <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-fade-in">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg shrink-0">
                        ⚠️
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">
                          Complete your profile to 100% to apply for jobs.
                        </p>
                        <p className="text-xs text-amber-800">
                          Your profile is currently at <strong>{profileCompleteness}%</strong>. Complete all required fields to unlock job applications.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSeekerTab('profile')}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs transition shadow-md shadow-indigo-600/20 shrink-0 flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <span>Complete Profile</span>
                      <span>→</span>
                    </button>
                  </div>
                )}

                {/* MAIN JOB LISTING AREA WITH SIDEBAR FILTERS */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* FILTERS SIDEBAR */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm sticky top-28">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                          </svg>
                          Filter Vacancies
                        </h3>
                        <button
                          onClick={clearAllFilters}
                          className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          Clear
                        </button>
                      </div>

                      {/* Experience Filter */}
                      <div className="mt-4">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Experience
                        </label>
                        <div className="space-y-1.5 text-xs text-slate-600">
                          {[
                            { val: 'Fresher', label: 'Fresher (0 - 1 yrs)' },
                            { val: '1-3 Years', label: 'Junior (1 - 3 yrs)' },
                            { val: '3-5 Years', label: 'Mid-Senior (3 - 5 yrs)' }
                          ].map((exp) => (
                            <label key={exp.val} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                              <input
                                type="checkbox"
                                value={exp.val}
                                checked={expFilters.includes(exp.val)}
                                onChange={() => handleExpCheckboxChange(exp.val)}
                                className="rounded text-indigo-600 focus:ring-indigo-500"
                              />
                              <span>{exp.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Minimum Salary Slider */}
                      <div className="mt-5 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Min Salary
                          </label>
                          <span className="text-xs font-bold text-indigo-600">
                            ₹{minSalary} LPA
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="25"
                          step="1"
                          value={minSalary}
                          onChange={(e) => setMinSalary(Number(e.target.value))}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                          <span>₹0</span>
                          <span>₹12L</span>
                          <span>₹25L+</span>
                        </div>
                      </div>

                      {/* Status Info Box */}
                      <div className="mt-6 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-[11px] text-indigo-900 leading-relaxed">
                        <p className="font-bold flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                          </svg>
                          Admin Verified Jobs Only
                        </p>
                        <p className="mt-1 text-slate-600">
                          All listed jobs are moderated and verified before appearing in search.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* JOB CARDS GRID */}
                  <div className="lg:col-span-3 space-y-4">
                    {/* Results Header */}
                    <div className="flex items-center justify-between bg-white px-5 py-3 rounded-xl border border-slate-200/80 text-xs text-slate-600">
                      <div>
                        Showing <span className="font-bold text-slate-900">{filteredJobs.length}</span> active vacancies
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Sort by:</span>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                        >
                          <option value="newest">Newest First</option>
                          <option value="salary">Highest Salary</option>
                        </select>
                      </div>
                    </div>

                    {/* Jobs List */}
                    {filteredJobs.length === 0 ? (
                      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                        <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <h3 className="font-bold text-slate-800 text-base">No Matching Vacancies Found</h3>
                        <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or clearing keywords to see more opportunities.</p>
                        <button
                          onClick={clearAllFilters}
                          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition"
                        >
                          Reset All Filters
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredJobs.map((job) => {
                          const isSaved = (data.savedJobIds || []).includes(job.id);
                          const hasApplied = (data.applications || []).some(
                            (a) => a.jobId === job.id && a.applicantEmail === data.profile?.email
                          );

                          return (
                            <div
                              key={job.id}
                              className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                            >
                              <div className="flex items-start gap-4 flex-1">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-indigo-50 border border-slate-200 flex items-center justify-center font-extrabold text-indigo-700 text-lg shadow-inner shrink-0 group-hover:scale-105 transition">
                                  {job.company.charAt(0)}
                                </div>

                                <div className="space-y-1.5 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3
                                      onClick={() => handleOpenJobDetail(job)}
                                      className="font-extrabold text-slate-900 text-base hover:text-indigo-600 cursor-pointer transition"
                                    >
                                      {job.title}
                                    </h3>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                      {job.jobType}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                      ₹{job.salaryMin}–{job.salaryMax} LPA
                                    </span>
                                  </div>

                                  <p className="text-xs font-semibold text-slate-600 flex items-center gap-3">
                                    <span className="text-slate-800">{job.company}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 text-slate-500">
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                      </svg>
                                      {job.location}
                                    </span>
                                    <span>•</span>
                                    <span className="text-slate-500">{job.experience}</span>
                                  </p>

                                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                    {job.skills.map((s) => (
                                      <span
                                        key={s}
                                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700"
                                      >
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center md:flex-col justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                                <div className="flex items-center gap-2 w-full justify-end">
                                  <button
                                    onClick={() => toggleSaveJob(job.id)}
                                    title={isSaved ? 'Remove from saved' : 'Save job'}
                                    className={`p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition ${
                                      isSaved
                                        ? 'text-rose-500 bg-rose-50 border-rose-200'
                                        : 'text-slate-400 hover:text-rose-500'
                                    }`}
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill={isSaved ? 'currentColor' : 'none'}
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                    </svg>
                                  </button>

                                  {hasApplied ? (
                                    <button
                                      onClick={() => handleOpenJobDetail(job)}
                                      className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                      </svg>
                                      Applied
                                    </button>
                                  ) : profileCompleteness < 100 ? (
                                    <div className="flex flex-col items-end gap-1">
                                      <div className="flex items-center gap-1.5">
                                        <button
                                          onClick={() => setSeekerTab('profile')}
                                          className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition"
                                          title="Redirect to My Profile & Resume"
                                        >
                                          Complete Profile
                                        </button>
                                        <button
                                          disabled
                                          title="Complete your profile to 100% to apply for jobs."
                                          className="px-3.5 py-1.5 rounded-xl bg-slate-200 text-slate-400 font-bold text-xs cursor-not-allowed"
                                        >
                                          Apply
                                        </button>
                                      </div>
                                      <span className="text-[10px] text-amber-600 font-semibold text-right">
                                        Complete your profile to 100% to apply for jobs.
                                      </span>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => handleOpenJobDetail(job)}
                                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs transition shadow-md shadow-indigo-600/20"
                                    >
                                      Apply Now
                                    </button>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400 hidden md:block">
                                  Deadline: {job.deadline}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MY APPLICATIONS */}
            {seekerTab === 'applications' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">Application Status Tracker</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Track your live candidate pipeline across applied enterprises in real time.</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">Live Stages:</span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">Applied</span>
                    <span>→</span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">Under Review</span>
                    <span>→</span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800">Shortlisted</span>
                    <span>→</span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800">Interview</span>
                    <span>→</span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">Selected</span>
                  </div>
                </div>

                {myApplications.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-800 text-sm">No Applications Yet</h4>
                    <p className="text-xs text-slate-500 mt-1">Explore open jobs and submit your profile with 1 click.</p>
                    <button
                      onClick={() => setSeekerTab('explore')}
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                    >
                      Find Jobs
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myApplications.map((app) => {
                      const job =
                        (data.jobs || []).find((j) => j.id === app.jobId) || {
                          title: 'Technical Role',
                          company: 'Partner Company',
                          location: 'India'
                        };
                      const isRejected = app.status === 'Rejected';
                      const currentStageIdx = stages.indexOf(app.status);

                      return (
                        <div key={app.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                            <div>
                              <h3 className="font-extrabold text-slate-900 text-base">{job.title}</h3>
                              <p className="text-xs font-semibold text-slate-600">
                                {job.company} • {job.location} • Applied on {app.appliedAt}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400">Current Status:</span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-black ${
                                  app.status === 'Selected'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : app.status === 'Interview'
                                    ? 'bg-blue-100 text-blue-800'
                                    : app.status === 'Shortlisted'
                                    ? 'bg-purple-100 text-purple-800'
                                    : app.status === 'Under Review'
                                    ? 'bg-amber-100 text-amber-800'
                                    : app.status === 'Rejected'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-slate-100 text-slate-800'
                                }`}
                              >
                                {app.status}
                              </span>
                            </div>
                          </div>

                          {!isRejected ? (
                            <div className="pt-2">
                              <div className="grid grid-cols-5 gap-1 relative text-center">
                                {stages.map((st, idx) => {
                                  const isPassed = idx <= currentStageIdx;
                                  const isCurrent = idx === currentStageIdx;
                                  let circleClass = 'bg-slate-200 text-slate-500';
                                  let labelClass = 'text-slate-400';
                                  if (isPassed) {
                                    circleClass = 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30';
                                    labelClass = 'text-indigo-900 font-bold';
                                  }
                                  if (isCurrent && st === 'Selected') {
                                    circleClass = 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30';
                                    labelClass = 'text-emerald-700 font-black';
                                  }

                                  return (
                                    <div key={st} className="flex flex-col items-center">
                                      <div className={`w-8 h-8 rounded-full ${circleClass} flex items-center justify-center font-bold text-xs transition duration-300`}>
                                        {isPassed ? '✓' : idx + 1}
                                      </div>
                                      <span className={`text-[10px] mt-1.5 ${labelClass}`}>{st}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                              <p className="font-bold">Application Status: Not Selected</p>
                              <p className="text-[11px] text-rose-600 mt-0.5">Thank you for your interest. The hiring team decided to proceed with other profiles for this vacancy.</p>
                            </div>
                          )}

                          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="flex items-center gap-1.5">
                              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                              </svg>
                              Attached: <strong className="text-slate-700">{app.resumeUrl}</strong>
                            </span>
                            <button
                              onClick={() => {
                                const j = (data.jobs || []).find((item) => item.id === app.jobId);
                                if (j) handleOpenJobDetail(j);
                              }}
                              className="text-indigo-600 hover:text-indigo-800 font-bold"
                            >
                              View Vacancy Info →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SAVED JOBS */}
            {seekerTab === 'saved' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                  <h2 className="text-xl font-extrabold text-slate-900">Bookmarked Vacancies</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Jobs you have saved to apply for later.</p>
                </div>

                {savedJobs.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-800 text-sm">No Saved Jobs</h4>
                    <p className="text-xs text-slate-500 mt-1">Click the heart icon on any job card to save it here for quick reference.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedJobs.map((job) => (
                      <div
                        key={job.id}
                        className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 shadow-sm flex flex-col justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                              {job.jobType}
                            </span>
                            <button
                              onClick={() => toggleSaveJob(job.id)}
                              className="text-rose-500 hover:text-slate-400 text-xs font-bold"
                            >
                              Remove
                            </button>
                          </div>
                          <h3 className="font-bold text-slate-900 text-base mt-2">{job.title}</h3>
                          <p className="text-xs text-slate-500 font-semibold">{job.company} • {job.location}</p>
                          <p className="text-xs font-extrabold text-emerald-700 mt-1">₹{job.salaryMin}–{job.salaryMax} LPA</p>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <span className="text-[10px] text-slate-400">Deadline: {job.deadline}</span>
                          {profileCompleteness < 100 ? (
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => setSeekerTab('profile')}
                                  className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition"
                                  title="Redirect to My Profile & Resume"
                                >
                                  Complete Profile
                                </button>
                                <button
                                  disabled
                                  title="Complete your profile to 100% to apply for jobs."
                                  className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-400 font-bold text-xs cursor-not-allowed"
                                >
                                  Apply
                                </button>
                              </div>
                              <span className="text-[10px] text-amber-600 font-semibold text-right">
                                Complete your profile to 100% to apply for jobs.
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenJobDetail(job)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
                            >
                              Apply Now
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: MY PROFILE & RESUME */}
            {seekerTab === 'profile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column Profile Card */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
                        {userInitials}
                      </div>
                      <h2 className="text-xl font-black text-slate-900 mt-3">{data.profile?.name || 'Candidate'}</h2>
                      <p className="text-xs font-bold text-indigo-600">{data.profile?.title || 'Job Seeker'}</p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        </svg>
                        {data.profile?.location || 'Location Not Set'}
                      </p>

                      <button
                        onClick={() => {
                          setEditProfileForm({
                            name: data.profile?.name || '',
                            title: data.profile?.title || '',
                            company: data.profile?.company || '',
                            location: data.profile?.location || '',
                            phone: data.profile?.phone || '',
                            about: data.profile?.about || ''
                          });
                          setShowEditProfileModal(true);
                        }}
                        className="mt-4 w-full py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                        <span>Edit Profile Details</span>
                      </button>

                      <div className="mt-5 pt-4 border-t border-slate-100 text-left">
                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                          <span className="text-slate-700">Profile Completeness</span>
                          <span className={profileCompleteness === 100 ? "text-emerald-600 font-extrabold" : profileCompleteness >= 40 ? "text-amber-600 font-bold" : "text-rose-500 font-bold"}>
                            {profileCompleteness}% ({profileCompleteness === 100 ? '100% Complete - Applications Active' : 'Incomplete - 100% Required'})
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              profileCompleteness === 100
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                : 'bg-gradient-to-r from-indigo-500 to-amber-500'
                            }`}
                            style={{ width: `${profileCompleteness}%` }}
                          ></div>
                        </div>
                        <p className="text-[10px] mt-1.5 leading-relaxed">
                          {profileCompleteness === 100 ? (
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              ✓ Profile 100% complete! Job applications are fully enabled.
                            </span>
                          ) : (
                            <span className="text-amber-700 font-medium block">
                              ⚠️ Complete your profile to 100% to apply for jobs. (Ensure Name, Email, Phone, Location, Title, Bio, and Technical Skills are all filled out).
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-left text-slate-600">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                          <span>{data.profile?.email || 'No email registered'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                          </svg>
                          <span>{data.profile?.phone || 'Phone not set'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                      <h3 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center justify-between">
                        <span>Active Resume</span>
                        <span className="text-xs text-emerald-600 font-semibold">{data.profile?.resumeName ? 'Verified' : 'Optional'}</span>
                      </h3>
                      
                      {data.profile?.resumeName ? (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="w-8 h-8 rounded-lg bg-rose-500 text-white font-black text-xs flex items-center justify-center">PDF</span>
                            <div className="text-xs">
                              <p className="font-bold text-slate-800 truncate max-w-[150px]">{data.profile.resumeName}</p>
                              <p className="text-[10px] text-slate-400">Attached to all applications</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center">
                          <p className="text-xs font-semibold text-slate-600">No Resume Uploaded</p>
                          <p className="text-[10px] text-slate-400">Upload your PDF resume to fast-track job applications</p>
                        </div>
                      )}

                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={simulateUploadResume}
                          className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                        >
                          Upload New
                        </button>
                        <button
                          onClick={() => previewResume(data.profile?.name)}
                          className="flex-1 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition"
                        >
                          Preview
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column Details */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <h3 className="font-extrabold text-sm text-slate-900">Professional Summary</h3>
                          <p className="text-[11px] text-slate-400">Brief overview of your career and technical background</p>
                        </div>
                        {isEditingSummary ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSummaryText(data.profile?.about || '');
                                setIsEditingSummary(false);
                              }}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleSaveSummary}
                              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-sm flex items-center gap-1.5"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              Save Summary
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setIsEditingSummary(true)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition flex items-center gap-1.5"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Edit Summary
                          </button>
                        )}
                      </div>

                      {isEditingSummary ? (
                        <div className="mt-4 space-y-3">
                          <textarea
                            rows="5"
                            value={summaryText}
                            onChange={(e) => setSummaryText(e.target.value)}
                            placeholder="Introduce yourself, your experience, key skills, and what kind of roles you are seeking..."
                            className="w-full text-xs p-3.5 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 font-medium leading-relaxed bg-slate-50 focus:bg-white transition"
                            autoFocus
                          />
                          <p className="text-[11px] text-slate-400">Click "Save Summary" to update your profile in MySQL database.</p>
                        </div>
                      ) : (
                        <div
                          onClick={() => setIsEditingSummary(true)}
                          className="mt-4 p-4 rounded-xl hover:bg-indigo-50/40 border border-dashed border-slate-200 hover:border-indigo-300 cursor-pointer transition group"
                          title="Click to edit your summary"
                        >
                          {data.profile?.about ? (
                            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                              {data.profile.about}
                            </p>
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-xs text-indigo-600 font-bold mb-1">No summary added yet</p>
                              <p className="text-[11px] text-slate-400">Click here to write an introduction that will be shown to recruiters.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className="font-extrabold text-sm text-slate-900">Technical Skills</h3>
                        <span className="text-xs text-slate-400">{(data.profile?.skills || []).length} skills listed</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(data.profile?.skills || []).length === 0 ? (
                          <span className="text-xs text-slate-400 italic py-1">No technical skills listed yet. Add your programming languages and tools below!</span>
                        ) : (
                          (data.profile?.skills || []).map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-800 font-bold text-xs border border-indigo-100 flex items-center gap-1.5"
                            >
                              {skill}
                              <button
                                onClick={() => removeSkill(skill)}
                                className="text-indigo-400 hover:text-rose-500 text-[10px]"
                              >
                                ✕
                              </button>
                            </span>
                          ))
                        )}
                      </div>

                      <div className="mt-4 flex items-center gap-2 pt-3 border-t border-slate-100">
                        <input
                          type="text"
                          value={newSkillText}
                          onChange={(e) => setNewSkillText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newSkillText.trim()) {
                              addSkill(newSkillText.trim());
                              setNewSkillText('');
                            }
                          }}
                          placeholder="Add skill (e.g. Docker, TypeScript)..."
                          className="text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1"
                        />
                        <button
                          onClick={() => {
                            if (newSkillText.trim()) {
                              addSkill(newSkillText.trim());
                              setNewSkillText('');
                            }
                          }}
                          className="px-3.5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Education Card */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <h3 className="font-extrabold text-sm text-slate-900">Education</h3>
                          <p className="text-[11px] text-slate-400">{(data.profile?.education || []).length} qualifications recorded</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAddEdu((prev) => !prev)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition flex items-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showAddEdu ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
                          </svg>
                          <span>{showAddEdu ? 'Cancel' : '+ Add Education'}</span>
                        </button>
                      </div>

                      {/* Add Education Form */}
                      {showAddEdu && (
                        <form onSubmit={handleAddEducationSubmit} className="mt-4 p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-3 animate-fade-in text-xs">
                          <h4 className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                            Add New Academic Qualification
                          </h4>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Degree / Course *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. B.Tech in Computer Science & Engineering"
                              value={eduForm.degree}
                              onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">College / University *</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Birla Institute of Technology, Mesra"
                                value={eduForm.institution}
                                onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Graduation Year</label>
                              <input
                                type="text"
                                placeholder="e.g. 2024"
                                value={eduForm.year}
                                onChange={(e) => setEduForm({ ...eduForm, year: e.target.value })}
                                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEduForm({ degree: '', institution: '', year: '' });
                                setShowAddEdu(false);
                              }}
                              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 transition"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm transition"
                            >
                              Save Education
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="mt-4 space-y-3">
                        {(data.profile?.education || []).length === 0 ? (
                          <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                            <p className="text-xs text-slate-500 font-medium">No education history added yet.</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Click "+ Add Education" above to list your college or degree.</p>
                          </div>
                        ) : (
                          (data.profile?.education || []).map((edu, idx) => (
                            <div key={idx} className="p-3.5 bg-slate-50 hover:bg-indigo-50/20 rounded-xl border border-slate-200 text-xs flex items-start justify-between transition group">
                              <div>
                                <p className="font-bold text-slate-900">{edu.degree}</p>
                                <p className="text-slate-600 mt-0.5">{edu.institution}</p>
                                {edu.year && (
                                  <span className="inline-block mt-1 text-[10px] font-bold text-indigo-700 bg-indigo-100/60 px-2 py-0.5 rounded-full">
                                    Graduation: {edu.year}
                                  </span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => removeEducation(idx)}
                                title="Remove education entry"
                                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition opacity-80 group-hover:opacity-100"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Experience Card */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <h3 className="font-extrabold text-sm text-slate-900">Experience</h3>
                          <p className="text-[11px] text-slate-400">{(data.profile?.experience || []).length} positions recorded</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAddExp((prev) => !prev)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition flex items-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showAddExp ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
                          </svg>
                          <span>{showAddExp ? 'Cancel' : '+ Add Experience'}</span>
                        </button>
                      </div>

                      {/* Add Experience Form */}
                      {showAddExp && (
                        <form onSubmit={handleAddExperienceSubmit} className="mt-4 p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-3 animate-fade-in text-xs">
                          <h4 className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Add Work Experience / Internship
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Role / Job Position *</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Frontend Developer"
                                value={expForm.position}
                                onChange={(e) => setExpForm({ ...expForm, position: e.target.value })}
                                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Company / Organization *</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. ABC Technologies"
                                value={expForm.company}
                                onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                              <input
                                type="text"
                                placeholder="e.g. Jan 2023"
                                value={expForm.startDate}
                                onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })}
                                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">End Date</label>
                              <input
                                type="text"
                                placeholder="e.g. Present or Dec 2024"
                                value={expForm.endDate}
                                onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })}
                                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Key Responsibilities / Achievements</label>
                            <textarea
                              rows="3"
                              placeholder="Describe your contributions, tools used, and key accomplishments..."
                              value={expForm.description}
                              onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white leading-relaxed"
                            />
                          </div>
                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setExpForm({ position: '', company: '', startDate: '', endDate: '', description: '' });
                                setShowAddExp(false);
                              }}
                              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 transition"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm transition"
                            >
                              Save Experience
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="mt-4 space-y-3">
                        {(data.profile?.experience || []).length === 0 ? (
                          <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                            <p className="text-xs text-slate-500 font-medium">No previous work experience listed yet.</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Click "+ Add Experience" above to highlight your internships or full-time roles.</p>
                          </div>
                        ) : (
                          (data.profile?.experience || []).map((exp, idx) => (
                            <div key={idx} className="p-3.5 bg-slate-50 hover:bg-indigo-50/20 rounded-xl border border-slate-200 text-xs transition group">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-bold text-slate-900 text-sm">{exp.position}</p>
                                  <p className="text-indigo-600 font-semibold mt-0.5">{exp.company}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {(exp.startDate || exp.endDate) && (
                                    <span className="text-[10px] font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full">
                                      {exp.startDate} – {exp.endDate}
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => removeExperience(idx)}
                                    title="Remove experience entry"
                                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition opacity-80 group-hover:opacity-100"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              {exp.description && (
                                <p className="text-slate-600 mt-2 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-slate-100">
                                  {exp.description}
                                </p>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Featured Projects Card */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <h3 className="font-extrabold text-sm text-slate-900">Featured Projects</h3>
                          <p className="text-[11px] text-slate-400">{(data.profile?.projects || []).length} projects showcased</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAddProj((prev) => !prev)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition flex items-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showAddProj ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
                          </svg>
                          <span>{showAddProj ? 'Cancel' : '+ Add Project'}</span>
                        </button>
                      </div>

                      {/* Add Project Form */}
                      {showAddProj && (
                        <form onSubmit={handleAddProjectSubmit} className="mt-4 p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-3 animate-fade-in text-xs">
                          <h4 className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            Add Showcase Project
                          </h4>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Project Title *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Real-Time Chat & Job Tracking Platform"
                              value={projForm.title}
                              onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Tech Stack (comma separated)</label>
                              <input
                                type="text"
                                placeholder="e.g. React, Node.js, MySQL, Tailwind"
                                value={projForm.technologies}
                                onChange={(e) => setProjForm({ ...projForm, technologies: e.target.value })}
                                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Project / GitHub URL</label>
                              <input
                                type="text"
                                placeholder="e.g. https://github.com/myusername/project"
                                value={projForm.link}
                                onChange={(e) => setProjForm({ ...projForm, link: e.target.value })}
                                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Description & Key Features</label>
                            <textarea
                              rows="3"
                              placeholder="Explain what the project accomplishes and any technical hurdles solved..."
                              value={projForm.description}
                              onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white leading-relaxed"
                            />
                          </div>
                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setProjForm({ title: '', technologies: '', description: '', link: '' });
                                setShowAddProj(false);
                              }}
                              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 transition"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm transition"
                            >
                              Save Project
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {(data.profile?.projects || []).length === 0 ? (
                          <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl col-span-2">
                            <p className="text-xs text-slate-500 font-medium">No featured projects added yet.</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Click "+ Add Project" above to showcase your work to recruiters.</p>
                          </div>
                        ) : (
                          (data.profile?.projects || []).map((proj, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 hover:bg-indigo-50/20 rounded-2xl border border-slate-200 text-xs flex flex-col justify-between transition group">
                              <div>
                                <div className="flex items-start justify-between">
                                  <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{proj.title}</h4>
                                  <button
                                    type="button"
                                    onClick={() => removeProject(idx)}
                                    title="Remove project"
                                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition opacity-80 group-hover:opacity-100"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                                <p className="text-slate-600 mt-1.5 text-[11px] leading-relaxed">{proj.description}</p>
                                <div className="flex flex-wrap gap-1 mt-2.5">
                                  {(proj.technologies || []).map((t) => (
                                    <span key={t} className="px-2 py-0.5 rounded-md bg-white text-indigo-700 text-[10px] font-bold border border-indigo-100 shadow-2xs">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              {proj.link ? (
                                <a
                                  href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-indigo-600 font-bold text-[11px] mt-3.5 inline-flex items-center gap-1 hover:underline"
                                >
                                  <span>View Project Live / Code</span>
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              ) : (
                                <span className="text-[10px] text-slate-400 mt-3 block italic">Internal Portfolio Asset</span>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ================= VIEW 2: HR / RECRUITER VIEWS ================= */}
        {currentRole === 'hr' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-lg">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase border border-emerald-500/30">
                    Verified Enterprise Recruiter
                  </span>
                  <span className="text-xs text-indigo-200">
                    {myCompany ? `${myCompany} Portal` : 'Enterprise Recruiter Portal'}
                  </span>
                </div>
                <h2 className="text-2xl font-black mt-1">HR Talent & Recruitment Hub</h2>
                <p className="text-xs text-slate-300">
                  {myCompany ? `Publish and manage vacancies for ${myCompany}, review applicant resumes, and track recruitment.` : 'Publish job vacancies, review applicant resumes, and update recruitment pipeline status.'}
                </p>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditProfileForm({
                      name: data.profile?.name || data.currentUser?.name || '',
                      title: data.profile?.title || 'HR Talent Acquisition',
                      company: myCompany || '',
                      location: data.profile?.location || '',
                      phone: data.profile?.phone || '',
                      about: data.profile?.about || ''
                    });
                    setShowEditProfileModal(true);
                  }}
                  className="bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-white/20 transition flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => {
                    setPostForm((prev) => ({ ...prev, company: myCompany || prev.company }));
                    setShowPostJobModal(true);
                  }}
                  className="bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/30 transition shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Post New Vacancy
                </button>
              </div>
            </div>

            {/* HR PROFILE MODIFICATION STATUS NOTIFICATIONS */}
            {latestHrProfileRequest && latestHrProfileRequest.status === 'Pending' && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 text-amber-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-amber-100 rounded-xl text-amber-600 shrink-0 mt-0.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-sm text-amber-950">Profile Modification Pending Admin Approval</h4>
                      <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-bold rounded-full uppercase tracking-wider">
                        Pending Approval
                      </span>
                    </div>
                    <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                      You submitted updates to your recruiter credentials. The Super Admin is reviewing the proposed changes. Your current profile remains active in MySQL until approved.
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-amber-900 font-medium bg-amber-100/60 px-3 py-1.5 rounded-lg border border-amber-200/60">
                      <span><strong>Requested Name:</strong> {latestHrProfileRequest.proposed_data?.name || data.currentUser?.name}</span>
                      <span><strong>Company:</strong> {latestHrProfileRequest.proposed_data?.company || latestHrProfileRequest.proposed_data?.company_name || myCompany || 'N/A'}</span>
                      {latestHrProfileRequest.proposed_data?.title && (
                        <span><strong>Title:</strong> {latestHrProfileRequest.proposed_data.title}</span>
                      )}
                      {latestHrProfileRequest.proposed_data?.location && (
                        <span><strong>Location:</strong> {latestHrProfileRequest.proposed_data.location}</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const prop = latestHrProfileRequest.proposed_data || {};
                    setEditProfileForm({
                      name: prop.name || data.profile?.name || data.currentUser?.name || '',
                      title: prop.title || data.profile?.title || 'HR Talent Acquisition',
                      company: prop.company || prop.company_name || myCompany || '',
                      location: prop.location || data.profile?.location || '',
                      phone: prop.phone || data.profile?.phone || '',
                      about: prop.about || data.profile?.about || ''
                    });
                    setShowEditProfileModal(true);
                  }}
                  className="self-start md:self-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition whitespace-nowrap shrink-0 flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Revise Submission</span>
                </button>
              </div>
            )}

            {latestHrProfileRequest && latestHrProfileRequest.status === 'Rejected' && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 text-rose-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-rose-100 rounded-xl text-rose-600 shrink-0 mt-0.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-sm text-rose-950">Profile Modification Request Rejected by Super Admin</h4>
                      <span className="px-2 py-0.5 bg-rose-200 text-rose-900 text-[10px] font-bold rounded-full uppercase tracking-wider">
                        Rejected
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-rose-800">
                      <strong>Admin Rejection Reason:</strong>{' '}
                      <span className="italic">{latestHrProfileRequest.admin_notes || 'Proposed details could not be verified by platform administrator.'}</span>
                    </div>
                    <p className="text-[11px] text-rose-700 mt-1">
                      Your existing profile credentials were kept unchanged in MySQL. You can update and resubmit your details for review at any time.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditProfileForm({
                      name: data.profile?.name || data.currentUser?.name || '',
                      title: data.profile?.title || 'HR Talent Acquisition',
                      company: myCompany || '',
                      location: data.profile?.location || '',
                      phone: data.profile?.phone || '',
                      about: data.profile?.about || ''
                    });
                    setShowEditProfileModal(true);
                  }}
                  className="self-start md:self-center px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition whitespace-nowrap shrink-0 flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Edit & Resubmit Profile</span>
                </button>
              </div>
            )}

            {/* HR METRIC CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">Total Jobs Posted</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{hrJobs.length}</p>
                <span className="text-[10px] text-indigo-600 font-semibold">All vacancies</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">Active Approved</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">{hrActiveJobs.length}</p>
                <span className="text-[10px] text-emerald-600 font-semibold">Live in market</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">Applications Received</p>
                <p className="text-2xl font-black text-indigo-600 mt-1">{hrAllApps.length}</p>
                <span className="text-[10px] text-indigo-600 font-semibold">Candidates applied</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">Shortlisted</p>
                <p className="text-2xl font-black text-purple-600 mt-1">{hrShortlisted.length}</p>
                <span className="text-[10px] text-purple-600 font-semibold">In technical stages</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm col-span-2 lg:col-span-1">
                <p className="text-xs font-semibold text-slate-500">Hired / Selected</p>
                <p className="text-2xl font-black text-teal-600 mt-1">{hrSelected.length}</p>
                <span className="text-[10px] text-teal-600 font-semibold">Offer accepted</span>
              </div>
            </div>

            {/* HR SUB-SECTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col">
                  {/* Panel Header */}
                  <div className="pb-3.5 border-b border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm shrink-0">
                        <svg className="w-4 h-4 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 leading-tight">My Job Openings</h3>
                        <p className="text-[11px] text-slate-400">Manage vacancies & review applicants</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-100/80 shrink-0">
                      {hrJobs.length} {hrJobs.length === 1 ? 'Job' : 'Jobs'}
                    </span>
                  </div>

                  {/* Active filter helper tag */}
                  {hrJobFilter !== 'all' && (
                    <div className="mt-3 px-3 py-1.5 bg-purple-50/80 border border-purple-200/70 rounded-xl flex items-center justify-between text-xs animate-fade-in">
                      <span className="text-[11px] text-purple-900 font-medium truncate flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                        Filtering pipeline by selected opening
                      </span>
                      <button
                        type="button"
                        onClick={() => setHrJobFilter('all')}
                        className="text-[11px] font-bold text-purple-700 hover:text-purple-900 underline shrink-0 ml-2"
                      >
                        Reset filter
                      </button>
                    </div>
                  )}

                  {/* Compact & Independently Scrollable Job Card List */}
                  <div className="mt-3.5 space-y-3 max-h-[540px] overflow-y-auto pr-1">
                    {hrJobs.length === 0 ? (
                      <div className="text-center py-10 px-4 bg-slate-50/70 rounded-2xl border border-dashed border-purple-200 space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto text-xl shadow-sm">
                          💼
                        </div>
                        <p className="font-bold text-slate-800 text-xs sm:text-sm">No Job Openings Posted Yet</p>
                        <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                          You haven't posted any vacancies for {myCompany || 'your organization'} yet.
                        </p>
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setPostForm((prev) => ({ ...prev, company: myCompany || prev.company }));
                              setShowPostJobModal(true);
                            }}
                            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs transition inline-flex items-center gap-1.5 shadow-md shadow-purple-600/20"
                          >
                            <span>+ Post Your First Job</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      hrJobs.map((job) => {
                        const appCount = (data.applications || []).filter((a) => a.jobId === job.id).length;
                        const isSelected = hrJobFilter === job.id;

                        return (
                          <div
                            key={job.id}
                            className={`p-4 rounded-2xl border transition-all duration-200 space-y-3 bg-white text-xs ${
                              isSelected
                                ? 'border-purple-500 ring-2 ring-purple-500/20 shadow-md bg-purple-50/20'
                                : 'border-slate-200/80 hover:border-purple-300 hover:shadow-sm'
                            }`}
                          >
                            {/* Card Top: Title & Status Badge */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-slate-900 text-sm leading-snug truncate" title={job.title}>
                                  {job.title}
                                </h4>
                                {job.jobType && (
                                  <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-semibold text-[10px] border border-purple-100">
                                    {job.jobType}
                                  </span>
                                )}
                              </div>
                              <span
                                className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 border ${
                                  job.status === 'Approved'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                                    : job.status === 'Pending'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200/80'
                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    job.status === 'Approved'
                                      ? 'bg-emerald-500'
                                      : job.status === 'Pending'
                                      ? 'bg-amber-500 animate-pulse'
                                      : 'bg-slate-400'
                                  }`}
                                ></span>
                                {job.status}
                              </span>
                            </div>

                            {/* Card Middle: Location & Salary Details */}
                            <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-100 text-[11px]">
                              <div className="flex items-center gap-1.5 text-slate-600 truncate">
                                <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="truncate">{job.location || 'India'}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-700 font-semibold truncate justify-end">
                                <svg className="w-3.5 h-3.5 text-purple-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="truncate">₹{job.salaryMin}–{job.salaryMax} LPA</span>
                              </div>
                            </div>

                            {/* Card Bottom: Applicant Count & View Candidates Action */}
                            <div className="flex items-center justify-between pt-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md font-extrabold text-[11px] ${
                                  appCount > 0
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {appCount}
                                </span>
                                <span className="text-[11px] text-slate-500 font-medium">
                                  {appCount === 1 ? 'Applicant' : 'Applicants'}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => setHrJobFilter(isSelected ? 'all' : job.id)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition active:scale-95 ${
                                  isSelected
                                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                                    : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/60'
                                }`}
                              >
                                <span>{isSelected ? 'Viewing' : 'View Candidates'}</span>
                                <svg
                                  className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-90' : ''}`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Candidate Pipeline & Review</h3>
                      <p className="text-xs text-slate-500">Review resumes, shortlist candidates, or advance to interviews.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={hrJobFilter}
                        onChange={(e) => setHrJobFilter(e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium bg-slate-50 text-slate-700"
                      >
                        <option value="all">
                          {myCompany ? `All ${myCompany} Vacancies` : 'All My Vacancies'}
                        </option>
                        {hrJobs.map((j) => (
                          <option key={j.id} value={j.id}>
                            {j.title}
                          </option>
                        ))}
                      </select>
                      <select
                        value={hrStatusFilter}
                        onChange={(e) => setHrStatusFilter(e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium bg-slate-50 text-slate-700"
                      >
                        <option value="all">All Stages</option>
                        <option value="Applied">Applied</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {hrFilteredApps.length === 0 ? (
                      <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="font-bold text-slate-700 text-xs">No Candidates in this Stage</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {hrJobs.length === 0 ? 'Publish your first job vacancy to start receiving applicant resumes.' : 'Select another filter or post more vacancies.'}
                        </p>
                      </div>
                    ) : (
                      hrFilteredApps.map((app) => {
                        const job = (data.jobs || []).find((j) => j.id === app.jobId) || { title: 'Role' };

                        return (
                          <div key={app.id} className="p-4 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-2xl transition space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-bold text-sm flex items-center justify-center shrink-0">
                                  {app.applicantName.charAt(0)}
                                </div>
                                <div>
                                  <h4 className="font-extrabold text-slate-900 text-sm">{app.applicantName}</h4>
                                  <p className="text-xs text-slate-500 font-semibold">
                                    Applied for: <span className="text-indigo-600">{job.title}</span> • {app.appliedAt}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-500">Pipeline Status:</span>
                                <select
                                  value={app.status}
                                  onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                                  className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border border-slate-300 bg-white cursor-pointer ${
                                    app.status === 'Selected'
                                      ? 'text-emerald-700 border-emerald-300'
                                      : app.status === 'Interview'
                                      ? 'text-blue-700 border-blue-300'
                                      : app.status === 'Shortlisted'
                                      ? 'text-purple-700 border-purple-300'
                                      : app.status === 'Rejected'
                                      ? 'text-rose-700 border-rose-300'
                                      : 'text-slate-800'
                                  }`}
                                >
                                  <option value="Applied">Applied</option>
                                  <option value="Under Review">Under Review</option>
                                  <option value="Shortlisted">Shortlisted</option>
                                  <option value="Interview">Interview Scheduled</option>
                                  <option value="Selected">Offer / Selected</option>
                                  <option value="Rejected">Rejected</option>
                                </select>
                              </div>
                            </div>

                            <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
                              <p className="italic text-[11px] text-slate-700">"{app.coverLetter}"</p>
                              <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                                <span className="text-[11px] text-slate-500 font-medium">
                                  📍 {app.applicantLocation} • ✉️ {app.applicantEmail} • 📞 {app.applicantPhone}
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => previewResume(app.applicantName)}
                                    className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 font-bold text-[11px] hover:bg-indigo-100"
                                  >
                                    View Resume PDF
                                  </button>
                                  <button
                                    onClick={() => openCandidateDetail(app.applicantEmail)}
                                    className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-bold text-[11px] hover:bg-slate-200"
                                  >
                                    Full Profile
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 3: ADMIN VIEWS ================= */}
        {currentRole === 'admin' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase tracking-wider border border-rose-500/30">
                  Platform Master Console
                </div>
                <h2 className="text-2xl font-black mt-1">Super Admin Operations & Moderation</h2>
                <p className="text-xs text-slate-300">Oversee ecosystem integrity, verify new HR job postings, monitor accounts, and inspect platform metrics.</p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <div className="bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700 text-right">
                  <span className="block text-[10px] text-slate-400">Database Engine</span>
                  <span className="font-bold text-emerald-400">MySQL 8.x (Workbench)</span>
                </div>
                <div className="bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700 text-right">
                  <span className="block text-[10px] text-slate-400">Auth Guard</span>
                  <span className="font-bold text-indigo-300">JWT + bcrypt</span>
                </div>
              </div>
            </div>

            {/* ADMIN KPIS */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Total Seekers</span>
                  <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </span>
                </div>
                <p className="text-2xl font-black text-slate-900 mt-2">{adminSeekers.length}</p>
                <span className="text-[10px] text-emerald-600 font-medium">Active Candidates</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">HRs & Companies</span>
                  <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </span>
                </div>
                <p className="text-2xl font-black text-slate-900 mt-2">{adminHrs.length} HRs</p>
                <span className="text-[10px] text-indigo-600 font-medium">Verified Employers</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Pending Jobs</span>
                  <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                  </span>
                </div>
                <p className="text-2xl font-black text-amber-600 mt-2">{adminPendingJobs.length}</p>
                <span className="text-[10px] text-amber-600 font-medium">Vacancy moderation</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Profile Requests</span>
                  <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7 7z" />
                    </svg>
                  </span>
                </div>
                <p className="text-2xl font-black text-purple-600 mt-2">{adminPendingProfileRequests.length}</p>
                <span className="text-[10px] text-purple-600 font-medium">HR edits pending</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm col-span-2 md:col-span-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Total Applications</span>
                  <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </span>
                </div>
                <p className="text-2xl font-black text-teal-600 mt-2">{(data.applications || []).length}</p>
                <span className="text-[10px] text-teal-600 font-medium">Platform throughput</span>
              </div>
            </div>

            {/* JOB APPROVAL QUEUE */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    Job Moderation & Verification Queue
                  </h3>
                  <p className="text-xs text-slate-500">Review jobs submitted by HR before they are made public to candidates.</p>
                </div>
                <span className="text-xs bg-amber-50 text-amber-800 px-3 py-1 rounded-full font-bold border border-amber-200">
                  {adminPendingJobs.length} Pending Approval
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {adminPendingJobs.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
                    <svg className="w-8 h-8 text-emerald-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="font-bold text-slate-800 text-xs">All Clear! No Pending Vacancies</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Every submitted job has been verified and processed.</p>
                  </div>
                ) : (
                  adminPendingJobs.map((job) => (
                    <div key={job.id} className="p-4 bg-slate-50 border border-amber-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">{job.title}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Pending Verification</span>
                        </div>
                        <p className="text-slate-600 font-semibold">{job.company} • {job.location} • ₹{job.salaryMin}–{job.salaryMax} LPA • {job.experience}</p>
                        <p className="text-slate-500 text-[11px]">{job.description}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {job.skills.map((s) => (
                            <span key={s} className="px-2 py-0.5 rounded bg-white text-slate-700 text-[10px] border border-slate-200">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => rejectJob(job.id)}
                          className="px-3.5 py-2 rounded-xl border border-rose-300 text-rose-700 font-bold hover:bg-rose-50 transition"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => approveJob(job.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Approve & Publish
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* HR PROFILE MODIFICATION APPROVAL QUEUE */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                    HR Recruiter Profile Verification & Approval Queue
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review and verify credential changes requested by recruiters before updating their official profiles in MySQL.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-purple-50 text-purple-800 px-3 py-1 rounded-full font-bold border border-purple-200">
                    {adminPendingProfileRequests.length} Pending Approval
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                {adminPendingProfileRequests.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
                    <svg className="w-8 h-8 text-emerald-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="font-bold text-slate-800 text-xs">All Clear! No Pending Profile Modification Requests</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">All recruiter credentials are up-to-date and verified.</p>
                  </div>
                ) : (
                  adminPendingProfileRequests.map((req) => {
                    const isSelf = String(req.userId || req.user_id) === String(data.currentUser?.id);
                    const cur = req.current_data || {};
                    const prop = req.proposed_data || {};

                    return (
                      <div key={req.id} className="p-5 bg-slate-50/80 border border-purple-200 rounded-2xl text-xs space-y-4 transition hover:border-purple-300">
                        {/* Request Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-purple-100 gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 font-extrabold flex items-center justify-center text-sm shadow-sm">
                              {(req.userName || 'HR').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-slate-900 text-sm">{req.userName}</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                                  {req.companyName || cur.company || 'Enterprise Recruiter'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 font-medium">
                                {req.userEmail} • Submitted {req.created_at ? new Date(req.created_at).toLocaleString() : 'Recently'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                              Pending Super Admin Review
                            </span>
                          </div>
                        </div>

                        {/* Side-by-Side Comparison Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Current Details */}
                          <div className="bg-white rounded-xl p-3.5 border border-slate-200 space-y-2">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                              <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                                Current Profile (Active in MySQL)
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">Original</span>
                            </div>
                            <div className="space-y-1.5 text-[11px]">
                              <div>
                                <span className="text-slate-400 font-medium">Name:</span>{' '}
                                <span className="font-bold text-slate-800">{cur.name || 'Not specified'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-medium">Company:</span>{' '}
                                <span className="font-bold text-slate-800">{cur.company || cur.company_name || 'Not specified'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-medium">Title:</span>{' '}
                                <span className="font-semibold text-slate-700">{cur.title || 'Not specified'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-medium">Location:</span>{' '}
                                <span className="font-semibold text-slate-700">{cur.location || 'Not specified'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-medium">Phone:</span>{' '}
                                <span className="font-semibold text-slate-700">{cur.phone || 'Not specified'}</span>
                              </div>
                              {cur.about && (
                                <div>
                                  <span className="text-slate-400 font-medium">Bio:</span>{' '}
                                  <p className="text-slate-600 text-[10px] line-clamp-2 mt-0.5">{cur.about}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Proposed Details */}
                          <div className="bg-purple-50/50 rounded-xl p-3.5 border border-purple-200 space-y-2">
                            <div className="flex items-center justify-between pb-2 border-b border-purple-100">
                              <span className="font-bold text-purple-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                                Proposed Changes (Requested by HR)
                              </span>
                              <span className="text-[10px] text-purple-700 font-bold bg-purple-100 px-1.5 py-0.5 rounded">New Submission</span>
                            </div>
                            <div className="space-y-1.5 text-[11px]">
                              <div>
                                <span className="text-purple-600 font-medium">Name:</span>{' '}
                                <span className={`font-bold ${prop.name && prop.name !== cur.name ? 'text-purple-950 bg-purple-200/60 px-1 py-0.5 rounded' : 'text-slate-800'}`}>
                                  {prop.name || cur.name || 'Not specified'}
                                </span>
                              </div>
                              <div>
                                <span className="text-purple-600 font-medium">Company:</span>{' '}
                                <span className={`font-bold ${(prop.company || prop.company_name) && (prop.company || prop.company_name) !== (cur.company || cur.company_name) ? 'text-purple-950 bg-purple-200/60 px-1 py-0.5 rounded' : 'text-slate-800'}`}>
                                  {prop.company || prop.company_name || cur.company || cur.company_name || 'Not specified'}
                                </span>
                              </div>
                              <div>
                                <span className="text-purple-600 font-medium">Title:</span>{' '}
                                <span className={`font-semibold ${prop.title && prop.title !== cur.title ? 'text-purple-950 bg-purple-200/60 px-1 py-0.5 rounded' : 'text-slate-700'}`}>
                                  {prop.title || cur.title || 'Not specified'}
                                </span>
                              </div>
                              <div>
                                <span className="text-purple-600 font-medium">Location:</span>{' '}
                                <span className={`font-semibold ${prop.location && prop.location !== cur.location ? 'text-purple-950 bg-purple-200/60 px-1 py-0.5 rounded' : 'text-slate-700'}`}>
                                  {prop.location || cur.location || 'Not specified'}
                                </span>
                              </div>
                              <div>
                                <span className="text-purple-600 font-medium">Phone:</span>{' '}
                                <span className={`font-semibold ${prop.phone && prop.phone !== cur.phone ? 'text-purple-950 bg-purple-200/60 px-1 py-0.5 rounded' : 'text-slate-700'}`}>
                                  {prop.phone || cur.phone || 'Not specified'}
                                </span>
                              </div>
                              {prop.about && (
                                <div>
                                  <span className="text-purple-600 font-medium">Bio:</span>{' '}
                                  <p className={`text-[10px] line-clamp-2 mt-0.5 ${prop.about !== cur.about ? 'text-purple-950 bg-purple-200/60 p-1 rounded' : 'text-slate-600'}`}>{prop.about}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions & Self-Approval Prevention */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-purple-100 gap-3">
                          <div>
                            {isSelf ? (
                              <span className="text-[11px] text-rose-600 font-bold bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Self-approval blocked: Another Super Admin must review this request.
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-500">
                                Approving will write proposed credentials to MySQL and notify the recruiter.
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setRejectProfileModalData(req);
                                setRejectReasonText('Unable to verify company registration and corporate domain.');
                              }}
                              className="px-3.5 py-2 rounded-xl border border-rose-300 text-rose-700 font-bold hover:bg-rose-50 transition"
                            >
                              Reject Request
                            </button>
                            <button
                              type="button"
                              disabled={isSelf}
                              onClick={() => approveProfileRequest(req.id)}
                              className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 shadow-md ${
                                isSelf
                                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                              }`}
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              <span>Approve & Update MySQL</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* SYSTEM USER DIRECTORY */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">User & Employer Directory</h3>
                  <p className="text-xs text-slate-500">View and manage system credentials and roles.</p>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3">User</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(data.users || []).map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                            {u.name.charAt(0)}
                          </span>
                          {u.name}
                        </td>
                        <td className="p-3 text-slate-600">{u.email}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              u.role === 'admin'
                                ? 'bg-rose-100 text-rose-800'
                                : u.role === 'hr'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => toggleUserStatus(u.id)}
                            className="text-indigo-600 hover:text-indigo-800 font-bold text-[11px]"
                          >
                            {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">J</div>
            <span className="font-bold text-slate-800">JobConnect Engine</span>
            <span>• Full-Stack Architecture (React, Express, MySQL, Node.js)</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Roles: Admin, HR Recruiter, Job Seeker</span>
            <span>• JWT Security • REST API Ready</span>
          </div>
        </div>
      </footer>

      {/* ================= MODAL 1: JOB DETAIL ================= */}
      {selectedJobDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fade-in p-6 sm:p-8">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-xl flex items-center justify-center">
                  {selectedJobDetail.company.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 leading-tight">{selectedJobDetail.title}</h2>
                  <p className="text-xs font-bold text-slate-600 mt-0.5">{selectedJobDetail.company} • {selectedJobDetail.location}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedJobDetail(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-slate-600">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div>
                  <span className="block text-[10px] text-slate-400 font-medium">SALARY</span>
                  <span className="font-extrabold text-slate-900">₹{selectedJobDetail.salaryMin}–{selectedJobDetail.salaryMax} LPA</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-medium">JOB TYPE</span>
                  <span className="font-extrabold text-slate-900">{selectedJobDetail.jobType}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-medium">EXPERIENCE</span>
                  <span className="font-extrabold text-slate-900">{selectedJobDetail.experience}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-medium">DEADLINE</span>
                  <span className="font-extrabold text-slate-900">{selectedJobDetail.deadline}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">Required Tech Stack & Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJobDetail.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 font-semibold text-xs border border-indigo-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">Role Overview</h4>
                <p className="text-slate-700 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                  {selectedJobDetail.description}
                </p>
              </div>

              {(data.applications || []).some(
                (a) => a.jobId === selectedJobDetail.id && a.applicantEmail === data.profile?.email
              ) ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800">
                  <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p className="font-bold text-xs">Application Submitted</p>
                    <p className="text-[11px] text-emerald-700">You applied for this vacancy with your verified resume. Track live progress under 'My Applications'.</p>
                  </div>
                </div>
              ) : profileCompleteness < 100 ? (
                <div className="border-t border-slate-100 pt-3">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900">
                    <div className="flex items-center gap-3">
                      <span className="p-2 bg-amber-100 text-amber-700 rounded-xl font-bold text-sm shrink-0">⚠️</span>
                      <div>
                        <p className="font-bold text-xs sm:text-sm">Complete your profile to 100% to apply for jobs.</p>
                        <p className="text-[11px] text-amber-800 mt-0.5">
                          Your profile is currently at <strong>{profileCompleteness}%</strong>. All candidate details must be completed before applying.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedJobDetail(null);
                        setSeekerTab('profile');
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-md shadow-indigo-600/20 shrink-0 flex items-center justify-center gap-1.5 self-start sm:self-auto"
                    >
                      <span>Complete Profile</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-slate-100 pt-3">
                  <h4 className="font-bold text-slate-900 text-xs mb-2">Apply with Your Candidate Profile</h4>
                  <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold">PDF</span>
                      <div>
                        <p className="font-bold text-slate-800 text-xs">{data.profile?.resumeName || 'Candidate_Resume.pdf'}</p>
                        <p className="text-[10px] text-slate-500">Uploaded {data.profile?.resumeUploadDate || 'Active'}</p>
                      </div>
                    </div>
                    <span className="text-indigo-600 font-bold text-[11px]">Ready to attach</span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 text-xs mb-1">Cover Note / Introduction (Optional)</label>
                    <textarea
                      rows="3"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Briefly describe why you are a good match for this role..."
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedJobDetail(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-100 transition"
              >
                Close
              </button>
              
              {!(data.applications || []).some(
                (a) => a.jobId === selectedJobDetail.id && a.applicantEmail === data.profile?.email
              ) && (
                profileCompleteness < 100 ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedJobDetail(null);
                        setSeekerTab('profile');
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition"
                    >
                      Complete Profile
                    </button>
                    <button
                      type="button"
                      disabled
                      title="Complete your profile to 100% to apply for jobs."
                      className="px-5 py-2 rounded-xl bg-slate-200 text-slate-400 font-bold text-xs cursor-not-allowed flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                      </svg>
                      Apply (Disabled)
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleApplySubmit(selectedJobDetail.id)}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                    Submit Application
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: POST JOB MODAL ================= */}
      {showPostJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fade-in p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-900">Post New Vacancy</h3>
                <p className="text-xs text-slate-500">Will be sent to Super Admin for verification.</p>
              </div>
              <button
                onClick={() => setShowPostJobModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostJobSubmit} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={postForm.title}
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    value={postForm.company}
                    onChange={(e) => setPostForm({ ...postForm, company: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location *</label>
                  <select
                    value={postForm.location}
                    onChange={(e) => setPostForm({ ...postForm, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Ranchi">Ranchi</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Job Type *</label>
                  <select
                    value={postForm.jobType}
                    onChange={(e) => setPostForm({ ...postForm, jobType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Experience *</label>
                  <select
                    value={postForm.experience}
                    onChange={(e) => setPostForm({ ...postForm, experience: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Fresher">Fresher (0-1 yrs)</option>
                    <option value="1-3 Years">Junior (1-3 yrs)</option>
                    <option value="3-5 Years">Mid-Senior (3-5 yrs)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min Salary (₹ LPA) *</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={postForm.salaryMin}
                    onChange={(e) => setPostForm({ ...postForm, salaryMin: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Salary (₹ LPA) *</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={postForm.salaryMax}
                    onChange={(e) => setPostForm({ ...postForm, salaryMax: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Required Skills (Comma separated) *</label>
                <input
                  type="text"
                  required
                  value={postForm.skills}
                  onChange={(e) => setPostForm({ ...postForm, skills: e.target.value })}
                  placeholder="React, Node.js, MongoDB, TypeScript"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Job Description & Responsibilities *</label>
                <textarea
                  rows="3"
                  required
                  value={postForm.description}
                  onChange={(e) => setPostForm({ ...postForm, description: e.target.value })}
                  placeholder="Detail the duties, technology stack, and expectations for the role..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPostJobModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-md shadow-indigo-600/30"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: CANDIDATE PROFILE MODAL ================= */}
      {candidateModalData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fade-in p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-900">{candidateModalData.name}</h3>
                <p className="text-xs text-indigo-600 font-bold">
                  {candidateModalData.email} • {candidateModalData.phone} • {candidateModalData.location}
                </p>
              </div>
              <button
                onClick={() => setCandidateModalData(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-slate-700">
              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-1">About Candidate</h4>
                <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {candidateModalData.about}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-1">Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(candidateModalData.skills || []).map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 font-semibold text-xs border border-indigo-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-1">Education & Background</h4>
                <div className="space-y-2">
                  {(candidateModalData.education || []).map((e, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="font-bold text-slate-800">{e.degree}</p>
                      <p className="text-slate-500 text-[11px]">{e.institution} ({e.year})</p>
                    </div>
                  ))}
                </div>
              </div>

              {candidateModalData.experience && candidateModalData.experience.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 text-xs mb-1">Work Experience</h4>
                  <div className="space-y-2">
                    {candidateModalData.experience.map((exp, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="font-bold text-slate-800">{exp.position} • <span className="text-indigo-600 font-semibold">{exp.company}</span></p>
                        <p className="text-slate-500 text-[11px]">{exp.startDate} – {exp.endDate}</p>
                        {exp.description && <p className="text-slate-600 text-[11px] mt-1">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {candidateModalData.projects && candidateModalData.projects.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 text-xs mb-1">Featured Projects</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {candidateModalData.projects.map((proj, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="font-bold text-slate-800">{proj.title}</p>
                        <p className="text-slate-600 text-[11px] mt-0.5">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setCandidateModalData(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: EDIT PROFILE MODAL ================= */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fade-in p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {currentRole === 'hr' ? 'Edit Recruiter Profile' : 'Edit Profile Details'}
                </h3>
                <p className="text-xs text-slate-500">
                  {currentRole === 'hr'
                    ? 'Proposed modifications will be submitted for Super Admin verification and approval.'
                    : 'Update your details to be saved in MySQL.'}
                </p>
              </div>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {currentRole === 'hr' && latestHrProfileRequest?.status === 'Pending' && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>
                  <strong>Notice:</strong> You currently have a pending profile request. Submitting this form will update your pending request for Super Admin review.
                </span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={editProfileForm.name}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              {currentRole === 'hr' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company / Organization Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corporation"
                    value={editProfileForm.company}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, company: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Professional Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Frontend React Developer"
                    value={editProfileForm.title}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Ranchi, Jharkhand"
                    value={editProfileForm.location}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={editProfileForm.phone}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Professional Summary / Bio</label>
                <textarea
                  rows="3"
                  placeholder="Share a short summary about your background, goals, and technical interests..."
                  value={editProfileForm.about}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, about: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium leading-relaxed"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>{currentRole === 'hr' ? 'Submit for Admin Approval' : 'Save Profile to MySQL'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 5: REJECT PROFILE REQUEST MODAL ================= */}
      {rejectProfileModalData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 animate-fade-in p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-rose-100 text-rose-600 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm">Reject Profile Change Request</h3>
              </div>
              <button
                onClick={() => setRejectProfileModalData(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 space-y-3 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Rejecting this request will keep <strong>{rejectProfileModalData.userName}</strong>'s current profile details unchanged in MySQL. The recruiter will be notified of the reason.
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Rejection *</label>
                <textarea
                  rows="3"
                  value={rejectReasonText}
                  onChange={(e) => setRejectReasonText(e.target.value)}
                  placeholder="Provide an explanation for the recruiter..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  'Unable to verify company registration and corporate domain.',
                  'Incomplete organization credentials provided.',
                  'Unauthorized recruiter profile modification.'
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setRejectReasonText(preset)}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md transition font-medium"
                  >
                    {preset.slice(0, 32)}...
                  </button>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectProfileModalData(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    rejectProfileRequest(rejectProfileModalData.id, rejectReasonText || 'Profile request rejected by platform administrator.');
                    setRejectProfileModalData(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-md shadow-rose-600/30"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TOAST CONTAINER ================= */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
        {(toasts || []).map((t) => (
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
            {removeToast && (
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1 transition"
                title="Dismiss"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
