import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { initialData } from '../data/initialData';

const AuthContext = createContext();

import { parseJwtPayload } from '../utils/jwtUtils';
import { getProfileForUser, calculateProfileCompleteness } from '../utils/profileUtils';
import { matchesJobId } from '../utils/jobUtils';
import { getApiUrl, apiFetch } from '../services/api';

export { calculateProfileCompleteness };

export const AuthProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const token = localStorage.getItem('jobconnect_token');
    const local = localStorage.getItem('jobconnect_state');

    // If no JWT token, user is strictly NOT logged in
    if (!token) {
      return {
        ...initialData,
        currentUser: null,
        currentUserRole: null,
        profile: null
      };
    }

    if (!local) {
      return {
        ...initialData,
        currentUser: null,
        currentUserRole: null,
        profile: null
      };
    }

    try {
      const parsed = JSON.parse(local);
      if (!parsed.currentUser || !parsed.currentUser.email) {
        return {
          ...parsed,
          currentUser: null,
          currentUserRole: null,
          profile: null
        };
      }

      // Anti-role spoofing: Verify parsed role against signed JWT payload if present
      const jwtPayload = parseJwtPayload(token);
      if (jwtPayload && jwtPayload.role) {
        const tokenRole = jwtPayload.role;
        parsed.currentUser.role = tokenRole;
        parsed.currentUserRole = tokenRole === 'user' ? 'seeker' : tokenRole;
      } else if (parsed.currentUser.role) {
        parsed.currentUserRole = parsed.currentUser.role === 'user' ? 'seeker' : parsed.currentUser.role;
      }

      parsed.profile = getProfileForUser(parsed.currentUser);
      return parsed;
    } catch (e) {
      return {
        ...initialData,
        currentUser: null,
        currentUserRole: null,
        profile: null
      };
    }
  });

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('jobconnect_state', JSON.stringify(data));
  }, [data]);

  // Backend session & anti-role spoofing verification on startup
  useEffect(() => {
    const token = localStorage.getItem('jobconnect_token');
    if (!token) return;

    apiFetch('/api/auth/me')
      .then(res => {
        const contentType = res.headers.get('content-type') || '';
        if (!res.ok || contentType.includes('text/html')) {
          throw new Error('Token verification failed');
        }
        return res.json();
      })
      .then(resData => {
        if (resData.success && resData.user) {
          const dbUser = resData.user;
          const verifiedRole = dbUser.role === 'user' ? 'seeker' : dbUser.role;

          setData(prev => {
            // If local storage was tampered with, reconcile with genuine MySQL record
            if (
              !prev.currentUser ||
              prev.currentUser.id !== dbUser.id ||
              prev.currentUser.role !== dbUser.role ||
              prev.currentUserRole !== verifiedRole
            ) {
              return {
                ...prev,
                currentUser: dbUser,
                currentUserRole: verifiedRole,
                profile: getProfileForUser(dbUser)
              };
            }
            return prev;
          });
        }
      })
      .catch(() => {
        // Token was invalid, expired, or tampered with
        if (!token.startsWith('jobconnect_jwt_token_demo_')) {
          localStorage.removeItem('jobconnect_token');
          localStorage.removeItem('jobconnect_state');
          setData(prev => ({
            ...prev,
            currentUser: null,
            currentUserRole: null,
            profile: null
          }));
        }
      });
  }, []);

  // Sync profile data directly from MySQL when user session is active
  useEffect(() => {
    const token = localStorage.getItem('jobconnect_token');
    const userEmail = data.currentUser?.email;
    if (token && userEmail) {
      fetch(`/api/users/profile/${encodeURIComponent(userEmail)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(resData => {
          if (resData.success && resData.data) {
            const dbUser = resData.data;
            setData(prev => ({
              ...prev,
              profile: {
                ...prev.profile,
                name: dbUser.name || prev.profile?.name,
                email: dbUser.email || prev.profile?.email,
                company: dbUser.company_name || dbUser.company || prev.profile?.company || '',
                phone: dbUser.phone !== null && dbUser.phone !== undefined ? dbUser.phone : prev.profile?.phone,
                location: dbUser.location !== null && dbUser.location !== undefined ? dbUser.location : prev.profile?.location,
                title: dbUser.title || prev.profile?.title || 'Candidate',
                about: dbUser.about !== null && dbUser.about !== undefined ? dbUser.about : prev.profile?.about,
                resumeName: dbUser.resume_name || dbUser.resumeName || prev.profile?.resumeName,
                skills: dbUser.skills ? (Array.isArray(dbUser.skills) ? dbUser.skills : dbUser.skills.split(',').map(s => s.trim())) : prev.profile?.skills,
                education: dbUser.education !== undefined && dbUser.education !== null ? (Array.isArray(dbUser.education) ? dbUser.education : (typeof dbUser.education === 'string' ? JSON.parse(dbUser.education) : [])) : (prev.profile?.education || []),
                experience: dbUser.experience !== undefined && dbUser.experience !== null ? (Array.isArray(dbUser.experience) ? dbUser.experience : (typeof dbUser.experience === 'string' ? JSON.parse(dbUser.experience) : [])) : (prev.profile?.experience || []),
                projects: dbUser.projects !== undefined && dbUser.projects !== null ? (Array.isArray(dbUser.projects) ? dbUser.projects : (typeof dbUser.projects === 'string' ? JSON.parse(dbUser.projects) : [])) : (prev.profile?.projects || [])
              }
            }));
          }
        })
        .catch(() => {});
    }
  }, [data.currentUser?.email]);

  // Sync profile requests from MySQL for Admin and HR
  useEffect(() => {
    const token = localStorage.getItem('jobconnect_token');
    const role = data.currentUserRole || data.currentUser?.role;
    if (token) {
      if (role === 'admin') {
        apiFetch('/api/users/profile-requests')
          .then(res => {
            const contentType = res.headers.get('content-type') || '';
            if (!res.ok || contentType.includes('text/html')) return null;
            return res.json();
          })
          .then(resData => {
            if (resData && resData.success && Array.isArray(resData.data)) {
              setData(prev => ({
                ...prev,
                profileRequests: resData.data
              }));
            }
          })
          .catch(() => {});
      } else if (role === 'hr') {
        apiFetch('/api/users/profile-requests/my')
          .then(res => {
            const contentType = res.headers.get('content-type') || '';
            if (!res.ok || contentType.includes('text/html')) return null;
            return res.json();
          })
          .then(resData => {
            if (resData && resData.success && resData.data) {
              setData(prev => {
                const existing = (prev.profileRequests || []).filter(r => r.id !== resData.data.id);
                return {
                  ...prev,
                  profileRequests: [resData.data, ...existing]
                };
              });
            }
          })
          .catch(() => {});
      }
    }
  }, [data.currentUserRole, data.currentUser?.role, data.currentUser?.email]);

  // Live MySQL Jobs Fetcher:
  // Fetches live vacancies from MySQL on every page load and persists across server restarts.
  // Super Admin receives all jobs; HR receives approved + own jobs; Candidates receive approved jobs.
  const fetchJobs = useCallback(async () => {
    try {
      const res = await apiFetch('/api/jobs');
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || contentType.includes('text/html')) {
        return;
      }
      const resData = await res.json();
      if (resData && resData.success && Array.isArray(resData.data)) {
        setData(prev => {
          const dbJobs = resData.data;
          // Keep recent local optimistic jobs posted within the last 15s if not yet indexed in MySQL
          const now = Date.now();
          const recentLocalJobs = (prev.jobs || []).filter(j => 
            typeof j.id === 'string' && 
            j.id.startsWith('job-') && 
            (now - parseInt(j.id.replace('job-', ''), 10)) < 15000 &&
            !dbJobs.some(dbJ => dbJ.title === j.title && dbJ.company === j.company)
          );
          return {
            ...prev,
            jobs: [...recentLocalJobs, ...dbJobs]
          };
        });
      }
    } catch (e) {
      console.error('Failed to fetch live jobs from MySQL:', e);
    }
  }, []);

  // Fetch live jobs from MySQL on every page load / initial mount
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Refetch live jobs when user role or session identity changes
  useEffect(() => {
    fetchJobs();
  }, [data.currentUserRole, data.currentUser?.id, fetchJobs]);

  // Live MySQL Applications Fetcher:
  // Fetches live candidate applications directly from MySQL.
  // Candidates fetch their own applications (/api/applications/my);
  // HR/Admin fetch company/all applications (/api/applications).
  const fetchApplications = useCallback(async () => {
    try {
      const token = localStorage.getItem('jobconnect_token');
      const currentUser = data.currentUser;
      if (!token && !currentUser) return;

      const role = data.currentUserRole || currentUser?.role;
      let endpoint = '/api/applications/my';
      if (role === 'hr' || role === 'admin' || currentUser?.role === 'hr' || currentUser?.role === 'admin') {
        endpoint = '/api/applications';
      }

      const res = await apiFetch(endpoint);
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || contentType.includes('text/html')) return;
      const resData = await res.json();

      if (resData.success && Array.isArray(resData.data)) {
        const dbApps = resData.data;

        setData(prev => {
          const currentApps = prev.applications || [];

          // Format incoming DB applications to standard frontend shape
          const formattedDbApps = dbApps.map(app => ({
            id: app.id || app._id,
            _id: app._id || app.id,
            jobId: app.jobId || app.job?.id || app.job_id,
            applicantName: app.applicantName || app.applicant?.name || 'Candidate',
            applicantEmail: app.applicantEmail || app.applicant?.email || '',
            applicantPhone: app.applicantPhone || app.applicant?.phone || '',
            applicantLocation: app.applicantLocation || app.applicant?.location || '',
            applicantId: app.applicantId || app.applicant?.id || app.applicant_id,
            resumeUrl: app.resumeUrl || app.resume || '',
            coverLetter: app.coverLetter || '',
            status: app.status || 'Applied',
            appliedAt: app.appliedAt || (app.createdAt ? new Date(app.createdAt).toISOString().split('T')[0] : 'Just now'),
            job: app.job,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt
          }));

          // Merge: DB applications are authoritative. Retain local optimistic applications if not yet in DB.
          const merged = [...formattedDbApps];
          for (const localApp of currentApps) {
            const alreadyInDb = merged.some(dbApp =>
              (dbApp.id && String(dbApp.id) === String(localApp.id)) ||
              (matchesJobId(dbApp.jobId, localApp.jobId) &&
               (dbApp.applicantEmail || '').toLowerCase().trim() === (localApp.applicantEmail || '').toLowerCase().trim())
            );
            if (!alreadyInDb) {
              merged.push(localApp);
            }
          }

          return {
            ...prev,
            applications: merged
          };
        });
      }
    } catch (e) {
      console.error('Failed to fetch live applications from MySQL:', e);
    }
  }, [data.currentUserRole, data.currentUser?.role, data.currentUser?.id, data.currentUser?.email]);

  // Fetch live applications from MySQL on every page load / initial mount
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Refetch live applications when user role or session identity changes
  useEffect(() => {
    fetchApplications();
  }, [data.currentUserRole, data.currentUser?.id, data.currentUser?.email, fetchApplications]);

  // Live MySQL Saved Jobs Fetcher:
  // Fetches candidate's bookmarked jobs from MySQL
  const fetchSavedJobs = useCallback(async () => {
    try {
      const token = localStorage.getItem('jobconnect_token');
      const role = data.currentUserRole || data.currentUser?.role;
      if (!token || (role !== 'seeker' && role !== 'user' && data.currentUser?.role !== 'user')) {
        return;
      }
      const res = await apiFetch('/api/jobs/saved/my');
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || contentType.includes('text/html')) return;
      const resData = await res.json();
      if (resData && resData.success && Array.isArray(resData.data)) {
        setData(prev => ({
          ...prev,
          savedJobIds: resData.data
        }));
      }
    } catch (e) {
      console.error('Failed to fetch saved jobs from MySQL:', e);
    }
  }, [data.currentUserRole, data.currentUser?.role]);

  // Live MySQL Users Fetcher:
  // Fetches platform user directory from MySQL for Admin
  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('jobconnect_token');
      const role = data.currentUserRole || data.currentUser?.role;
      if (!token || (role !== 'admin' && data.currentUser?.role !== 'admin')) {
        return;
      }
      const res = await apiFetch('/api/users');
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || contentType.includes('text/html')) return;
      const resData = await res.json();
      if (resData && resData.success && Array.isArray(resData.data)) {
        setData(prev => ({
          ...prev,
          users: resData.data
        }));
      }
    } catch (e) {
      console.error('Failed to fetch users from MySQL:', e);
    }
  }, [data.currentUserRole, data.currentUser?.role]);

  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toastTimersRef = useRef(new Map());
  const recentToastsRef = useRef(new Map());

  // Function to remove a specific toast by id
  const removeToast = useCallback((id) => {
    if (toastTimersRef.current.has(id)) {
      clearTimeout(toastTimersRef.current.get(id));
      toastTimersRef.current.delete(id);
    }
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Function to clear all toasts and cancel active timers (used on login, logout, and page navigation)
  const clearToasts = useCallback(() => {
    toastTimersRef.current.forEach(timer => clearTimeout(timer));
    toastTimersRef.current.clear();
    recentToastsRef.current.clear();
    setToasts([]);
  }, []);

  // Function to show toast:
  // - Prevents duplicates if identical message is currently active
  // - Debounces identical messages within 2.5s
  // - Automatically dismisses after exactly 3 seconds (3000ms)
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    if (!message || typeof message !== 'string') return;
    const cleanMsg = message.trim();
    if (!cleanMsg) return;

    const now = Date.now();
    const lastShown = recentToastsRef.current.get(cleanMsg);
    // Ignore duplicate notifications dispatched within 2500ms
    if (lastShown && (now - lastShown) < 2500) {
      return;
    }
    recentToastsRef.current.set(cleanMsg, now);

    const id = `toast-${now}-${Math.random().toString(36).substr(2, 9)}`;

    setToasts(prev => {
      // Prevent duplicate notification if identical message is already displayed
      if (prev.some(t => t.message === cleanMsg)) {
        return prev;
      }
      return [...prev, { id, message: cleanMsg, type }];
    });

    // Automatically dismiss after 3 seconds
    const timer = setTimeout(() => {
      removeToast(id);
    }, duration);

    toastTimersRef.current.set(id, timer);
  }, [removeToast]);

  // Clean up all toast timers on unmount
  useEffect(() => {
    return () => {
      toastTimersRef.current.forEach(timer => clearTimeout(timer));
      toastTimersRef.current.clear();
    };
  }, []);

  // Show this toast ONLY when the simulation role actually changes, display it once, and dismiss after 3 seconds.
  // Anti-role spoofing guard: Authenticated users cannot escalate or change permissions.
  const switchRole = useCallback((newRole) => {
    if (!newRole) return;
    const actualRole = data.currentUser?.role;
    if (actualRole) {
      const authorizedRole = actualRole === 'user' ? 'seeker' : actualRole;
      if (newRole !== authorizedRole) {
        const authorizedLabel = authorizedRole === 'seeker' ? 'Candidate' : authorizedRole === 'hr' ? 'HR Recruiter' : 'Super Admin';
        const attemptedLabel = newRole === 'seeker' ? 'Candidate' : newRole === 'hr' ? 'HR Recruiter' : 'Super Admin';
        showToast(
          `Role spoofing prevented: Your account is authorized only as ${authorizedLabel} and cannot access ${attemptedLabel} mode.`,
          'error',
          3500
        );
        return;
      }
    }

    setData(prev => {
      const currentRole = prev.currentUserRole;
      // If role did not change, DO NOT show toast and DO NOT re-render
      if (currentRole === newRole) {
        return prev;
      }
      const roleLabel = newRole === 'seeker' ? 'Candidate' : newRole === 'hr' ? 'HR Recruiter' : 'Super Admin';
      showToast(`Switched simulation role to ${roleLabel}`, 'info', 3000);
      return { ...prev, currentUserRole: newRole };
    });
  }, [data.currentUser?.role, showToast]);

  const resetAllData = () => {
    setData(initialData);
    showToast("Reset platform session state", "info");
    setTimeout(() => {
      fetchJobs();
      fetchApplications();
      fetchSavedJobs();
      fetchUsers();
    }, 50);
  };

  const applyForJob = async (jobId, coverLetter) => {
    const job = (data.jobs || []).find(j => matchesJobId(j.id, jobId));
    if (!job) return false;

    // Enforce 100% candidate profile completion validation
    const completeness = calculateProfileCompleteness(data.profile);
    if (completeness < 100) {
      showToast('Complete your profile to 100% to apply for jobs.', 'error');
      return false;
    }

    const newApp = {
      id: `app-${Date.now()}`,
      jobId,
      applicantName: data.profile?.name || 'Candidate',
      applicantEmail: data.profile?.email || '',
      applicantPhone: data.profile?.phone || '',
      applicantLocation: data.profile?.location || '',
      resumeUrl: data.profile?.resumeName || 'Candidate_Resume.pdf',
      coverLetter,
      status: 'Applied',
      appliedAt: new Date().toISOString().split('T')[0]
    };

    const newNotif = {
      id: `n-${Date.now()}`,
      title: "Application Sent!",
      text: `Successfully applied to ${job.company} for ${job.title}.`,
      time: "Just now",
      type: "job"
    };

    setData(prev => ({
      ...prev,
      applications: [newApp, ...prev.applications],
      notifications: [newNotif, ...prev.notifications]
    }));

    const token = localStorage.getItem('jobconnect_token');
    if (token) {
      const numericJobId = typeof jobId === 'string' ? jobId.replace('job-', '') : jobId;
      try {
        const res = await apiFetch('/api/applications', {
          method: 'POST',
          body: JSON.stringify({
            jobId: numericJobId,
            coverLetter,
            resume: data.profile?.resumeName || 'Candidate_Resume.pdf'
          })
        });
        const resData = await res.json().catch(() => null);
        if (!res.ok && resData && !resData.success) {
          showToast(resData.message || 'Complete your profile to 100% to apply for jobs.', 'error');
          return false;
        }
        setTimeout(() => {
          fetchApplications();
        }, 50);
      } catch (e) {}
    }

    showToast(`Application submitted for ${job.title}!`, 'success');
    return true;
  };

  const toggleSaveJob = async (jobId) => {
    setData(prev => {
      const exists = (prev.savedJobIds || []).some(id => matchesJobId(id, jobId));
      const updated = exists 
        ? prev.savedJobIds.filter(id => !matchesJobId(id, jobId))
        : [...prev.savedJobIds, jobId];
      
      showToast(exists ? "Removed from saved jobs" : "Saved to your bookmarks!", exists ? "info" : "success");
      return { ...prev, savedJobIds: updated };
    });

    const token = localStorage.getItem('jobconnect_token');
    if (token) {
      const numericId = typeof jobId === 'string' && jobId.startsWith('job-')
        ? parseInt(jobId.replace('job-', ''), 10) || jobId
        : jobId;
      try {
        await apiFetch(`/api/jobs/${encodeURIComponent(numericId)}/save`, {
          method: 'POST'
        });
        fetchSavedJobs();
      } catch (e) {
        console.error('Failed to persist saved job in MySQL:', e);
      }
    }
  };

  const postNewJob = async (jobData) => {
    const hrName = data.currentUser?.name || data.profile?.name;
    const hrEmail = data.currentUser?.email || data.profile?.email;
    const hrId = data.currentUser?.id || data.currentUser?._id;
    const hrCompany = data.currentUser?.company || data.currentUser?.company_name || data.profile?.company || '';

    const tempId = `job-${Date.now()}`;
    const newJob = {
      id: tempId,
      ...jobData,
      company: jobData.company || hrCompany || 'My Company',
      companyName: jobData.company || hrCompany || 'My Company',
      status: 'Pending', // Sent to Admin
      postedBy: hrName ? `HR - ${hrName}` : 'HR Recruiter',
      posted_by: hrId || 2,
      postedByEmail: hrEmail,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const newNotif = {
      id: `n-${Date.now()}`,
      title: "Job Opening Submitted",
      text: `'${jobData.title}' submitted for Super Admin verification.`,
      time: "Just now",
      type: "admin"
    };

    setData(prev => ({
      ...prev,
      jobs: [newJob, ...prev.jobs],
      notifications: [newNotif, ...prev.notifications]
    }));

    const token = localStorage.getItem('jobconnect_token');
    if (token) {
      try {
        const res = await apiFetch('/api/jobs', {
          method: 'POST',
          body: JSON.stringify({
            title: jobData.title,
            company: jobData.company || hrCompany,
            companyName: jobData.company || hrCompany,
            location: jobData.location,
            salaryMin: jobData.salaryMin,
            salaryMax: jobData.salaryMax,
            experience: jobData.experience,
            jobType: jobData.jobType,
            skills: Array.isArray(jobData.skills) ? jobData.skills.join(', ') : jobData.skills,
            description: jobData.description,
            deadline: jobData.deadline || '2026-12-31'
          })
        });
        const resData = await res.json().catch(() => null);
        if (resData && resData.success && resData.data) {
          const createdJob = resData.data;
          setData(prev => ({
            ...prev,
            jobs: [
              createdJob,
              ...(prev.jobs || []).filter(j => j.id !== tempId && j.id !== createdJob.id)
            ]
          }));
          fetchJobs();
        }
      } catch (e) {
        console.error('Failed to post job to MySQL:', e);
      }
    }

    showToast("Job submitted! Awaiting Super Admin approval.", "info");
  };

  const updateApplicationStatus = async (appId, status) => {
    // Find target application in current state
    const targetApp = (data.applications || []).find(a =>
      String(a.id) === String(appId) ||
      (typeof a.id === 'string' && typeof appId === 'string' && a.id.replace('app-', '') === appId.replace('app-', ''))
    );
    const applicantName = targetApp ? targetApp.applicantName : 'Candidate';

    // 1. Immediate optimistic update in state
    setData(prev => {
      const updatedApps = (prev.applications || []).map(a => {
        const isMatch =
          String(a.id) === String(appId) ||
          (targetApp &&
           matchesJobId(a.jobId, targetApp.jobId) &&
           (a.applicantEmail || '').toLowerCase().trim() === (targetApp.applicantEmail || '').toLowerCase().trim());
        return isMatch ? { ...a, status } : a;
      });

      const newNotif = {
        id: `n-${Date.now()}`,
        title: "Candidate Pipeline Updated",
        text: `${applicantName} status changed to ${status}.`,
        time: "Just now",
        type: "status"
      };

      return {
        ...prev,
        applications: updatedApps,
        notifications: [newNotif, ...prev.notifications]
      };
    });

    // 2. Persist to MySQL via PUT /api/applications/:id/status
    const token = localStorage.getItem('jobconnect_token');
    if (token) {
      try {
        const numericId = typeof appId === 'string' && appId.startsWith('app-')
          ? parseInt(appId.replace('app-', ''), 10) || appId
          : appId;

        const res = await apiFetch(`/api/applications/${encodeURIComponent(numericId)}/status`, {
          method: 'PUT',
          body: JSON.stringify({ status })
        });

        const resData = await res.json().catch(() => null);
        if (res.ok && resData && resData.success && resData.data) {
          const updated = resData.data;
          // Synchronize authoritative updated row into state
          setData(prev => ({
            ...prev,
            applications: (prev.applications || []).map(a => {
              const isMatch =
                String(a.id) === String(updated.id) ||
                String(a.id) === String(appId) ||
                (matchesJobId(a.jobId, updated.jobId) &&
                 (a.applicantEmail || '').toLowerCase().trim() === (updated.applicantEmail || '').toLowerCase().trim());
              return isMatch ? { ...a, ...updated, status: updated.status } : a;
            })
          }));
        } else if (!res.ok) {
          console.warn('API status update error:', resData?.message);
        }
      } catch (err) {
        console.error('Failed to sync application status to MySQL:', err);
      }
    }

    // 3. Re-fetch applications from MySQL to synchronize across all dashboards
    await fetchApplications();

    showToast(`Candidate status updated to "${status}"!`, 'success');
  };

  const approveJob = async (jobId) => {
    const numericId = typeof jobId === 'string' && jobId.startsWith('job-')
      ? parseInt(jobId.replace('job-', ''), 10)
      : jobId;

    setData(prev => {
      const job = prev.jobs.find(j => matchesJobId(j.id, jobId));
      const updatedJobs = prev.jobs.map(j => matchesJobId(j.id, jobId) ? { ...j, status: 'Approved' } : j);
      const newNotif = {
        id: `n-${Date.now()}`,
        title: "Job Approved by Admin",
        text: `'${job ? job.title : 'Job'}' is now publicly searchable by all seekers.`,
        time: "Just now",
        type: "job"
      };

      return {
        ...prev,
        jobs: updatedJobs,
        notifications: [newNotif, ...prev.notifications]
      };
    });

    const token = localStorage.getItem('jobconnect_token');
    if (token) {
      try {
        const res = await apiFetch(`/api/jobs/${encodeURIComponent(numericId)}/approve`, {
          method: 'PUT'
        });
        const resData = await res.json().catch(() => null);
        if (resData && resData.success && resData.data) {
          const updated = resData.data;
          setData(prev => ({
            ...prev,
            jobs: (prev.jobs || []).map(j => (j.id === jobId || j.id === numericId || j.id === updated.id) ? updated : j)
          }));
          fetchJobs();
        }
      } catch (e) {
        console.error('Failed to sync job approval to MySQL:', e);
      }
    }

    showToast("Job opening verified and published live!", "success");
  };

  const rejectJob = async (jobId) => {
    const numericId = typeof jobId === 'string' && jobId.startsWith('job-')
      ? parseInt(jobId.replace('job-', ''), 10)
      : jobId;

    setData(prev => ({
      ...prev,
      jobs: prev.jobs.map(j => matchesJobId(j.id, jobId) ? { ...j, status: 'Rejected' } : j)
    }));

    const token = localStorage.getItem('jobconnect_token');
    if (token) {
      try {
        const res = await apiFetch(`/api/jobs/${encodeURIComponent(numericId)}/reject`, {
          method: 'PUT'
        });
        const resData = await res.json().catch(() => null);
        if (resData && resData.success && resData.data) {
          const updated = resData.data;
          setData(prev => ({
            ...prev,
            jobs: (prev.jobs || []).map(j => (j.id === jobId || j.id === numericId || j.id === updated.id) ? updated : j)
          }));
          fetchJobs();
        }
      } catch (e) {
        console.error('Failed to sync job rejection to MySQL:', e);
      }
    }

    showToast("Job rejected", "info");
  };

  const deleteJob = async (jobId) => {
    const numericId = typeof jobId === 'string' && jobId.startsWith('job-')
      ? parseInt(jobId.replace('job-', ''), 10)
      : jobId;

    const targetJob = (data.jobs || []).find(j => matchesJobId(j.id, jobId));
    const jobTitle = targetJob ? targetJob.title : 'Job opening';

    // 1. Optimistic removal from state
    setData(prev => {
      const updatedJobs = (prev.jobs || []).filter(j => !matchesJobId(j.id, jobId));
      const updatedApps = (prev.applications || []).filter(a => !matchesJobId(a.jobId, jobId));
      const updatedSaved = (prev.savedJobIds || []).filter(id => !matchesJobId(id, jobId));

      const newNotif = {
        id: `n-${Date.now()}`,
        title: "Job Opening Removed",
        text: `'${jobTitle}' and its applicant records have been deleted.`,
        time: "Just now",
        type: "job"
      };

      return {
        ...prev,
        jobs: updatedJobs,
        applications: updatedApps,
        savedJobIds: updatedSaved,
        notifications: [newNotif, ...(prev.notifications || [])]
      };
    });

    // 2. Call backend DELETE /api/jobs/:id
    const token = localStorage.getItem('jobconnect_token');
    if (token) {
      try {
        const res = await apiFetch(`/api/jobs/${encodeURIComponent(numericId)}`, {
          method: 'DELETE'
        });

        const resData = await res.json().catch(() => null);

        if (!res.ok || (resData && !resData.success)) {
          const errMsg = resData?.message || 'Failed to delete job posting from server.';
          showToast(errMsg, 'error');
          // Revert state by re-fetching live data from MySQL
          await fetchJobs();
          await fetchApplications();
          return { success: false, message: errMsg };
        }

        // 3. Re-fetch jobs and applications from MySQL to synchronize
        await fetchJobs();
        await fetchApplications();
        showToast(`Job posting "${jobTitle}" was deleted successfully.`, 'success');
        return { success: true };
      } catch (err) {
        console.error('Failed to delete job from MySQL:', err);
        showToast('Network error while deleting job posting.', 'error');
        await fetchJobs();
        await fetchApplications();
        return { success: false, message: err.message };
      }
    }

    showToast(`Job posting "${jobTitle}" deleted`, 'success');
    return { success: true };
  };

  const toggleUserStatus = async (userId) => {
    const target = (data.users || []).find(u => String(u.id) === String(userId));
    const newStatus = target?.status === 'Active' ? 'Suspended' : 'Active';

    setData(prev => ({
      ...prev,
      users: (prev.users || []).map(u => 
        String(u.id) === String(userId) ? { ...u, status: newStatus } : u
      )
    }));

    const token = localStorage.getItem('jobconnect_token');
    if (token) {
      try {
        const numericId = typeof userId === 'string' && userId.startsWith('u-')
          ? parseInt(userId.replace('u-', ''), 10) || userId
          : userId;
        const res = await apiFetch(`/api/users/${encodeURIComponent(numericId)}/status`, {
          method: 'PUT'
        });
        const resData = await res.json().catch(() => null);
        if (res.ok && resData && resData.success && resData.data) {
          setData(prev => ({
            ...prev,
            users: (prev.users || []).map(u => 
              String(u.id) === String(userId) ? { ...u, status: resData.data.status } : u
            )
          }));
          fetchUsers();
        }
      } catch (e) {
        console.error('Failed to sync user status in MySQL:', e);
      }
    }

    showToast(`User account status toggled to ${newStatus}`, 'info');
  };

  const updateProfile = async (updatedFields) => {
    const isHR = data.currentUserRole === 'hr' || data.currentUser?.role === 'hr';

    if (isHR) {
      // === HR PROFILE MODERATION QUEUE WORKFLOW ===
      // When an HR user edits and submits their profile, do not update the profile directly in MySQL.
      // Save the changes as a Pending Approval Request for the Admin.
      const hrUser = data.currentUser || {};
      const hrName = data.profile?.name || hrUser.name || 'HR Recruiter';
      const hrEmail = data.profile?.email || hrUser.email || '';
      const hrId = hrUser.id || hrUser._id || 2;
      const currentProfileData = { ...data.profile };

      const tempId = `pr-${Date.now()}`;
      const newRequest = {
        id: tempId,
        _id: tempId,
        user_id: hrId,
        userId: hrId,
        userName: hrName,
        user_name: hrName,
        userEmail: hrEmail,
        user_email: hrEmail,
        current_data: currentProfileData,
        currentData: currentProfileData,
        proposed_data: updatedFields,
        proposedData: updatedFields,
        status: 'Pending',
        created_at: new Date().toISOString()
      };

      setData(prev => {
        const existing = (prev.profileRequests || []).filter(
          r => r.userEmail !== hrEmail || r.status !== 'Pending'
        );
        const adminNotif = {
          id: `n-${Date.now()}`,
          title: 'HR Profile Edit Request',
          text: `${hrName} submitted profile changes for Super Admin approval.`,
          time: 'Just now',
          type: 'admin'
        };
        return {
          ...prev,
          profileRequests: [newRequest, ...existing],
          notifications: [adminNotif, ...(prev.notifications || [])]
        };
      });

      const token = localStorage.getItem('jobconnect_token');
      if (token) {
        try {
          const res = await apiFetch('/api/users/profile', {
            method: 'PUT',
            body: JSON.stringify(updatedFields)
          });
          const resData = await res.json().catch(() => null);
          if (resData && resData.success && resData.data) {
            setData(prev => ({
              ...prev,
              profileRequests: [
                resData.data,
                ...(prev.profileRequests || []).filter(r => r.id !== tempId && r.id !== resData.data.id)
              ]
            }));
          }
        } catch (e) {
          console.error('Failed to submit HR profile request to MySQL:', e);
        }
      }

      showToast('Profile update submitted! Saved as Pending Approval for Admin.', 'info');
      return;
    }

    // Direct update for Candidate/Job Seeker profiles
    setData(prev => {
      const newProfile = {
        ...(prev.profile || {}),
        ...updatedFields
      };

      try {
        const storedMap = JSON.parse(localStorage.getItem('jobconnect_user_profiles') || '{}');
        if (newProfile.email) {
          storedMap[newProfile.email] = newProfile;
          localStorage.setItem('jobconnect_user_profiles', JSON.stringify(storedMap));
        }
      } catch (e) {}

      return {
        ...prev,
        profile: newProfile
      };
    });

    const token = localStorage.getItem('jobconnect_token');
    if (token) {
      try {
        await apiFetch('/api/users/profile', {
          method: 'PUT',
          body: JSON.stringify(updatedFields)
        });
      } catch (e) {
        console.error('Failed to sync profile with MySQL:', e);
      }
    }

    showToast('Profile updated successfully!', 'success');
  };

  const uploadResume = async (file) => {
    if (!file) return { success: false, message: 'No file selected.' };

    // Validate file extension
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const fileName = file.name || '';
    const lastDotIdx = fileName.lastIndexOf('.');
    if (lastDotIdx === -1) {
      showToast('Invalid file format. Please upload a .pdf, .doc, or .docx file.', 'error');
      return { success: false, message: 'Missing file extension.' };
    }
    const ext = fileName.substring(lastDotIdx).toLowerCase();
    if (!validExtensions.includes(ext)) {
      showToast('Invalid file format. Only .pdf, .doc, and .docx files are allowed.', 'error');
      return { success: false, message: 'Invalid file format.' };
    }

    // Validate size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      showToast('File size exceeds 5MB limit. Please select a smaller document.', 'error');
      return { success: false, message: 'File exceeds 5MB limit.' };
    }

    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onerror = () => {
        showToast('Error reading the selected file. Please try again.', 'error');
        resolve({ success: false, message: 'Error reading file.' });
      };

      reader.onload = async () => {
        const base64Data = reader.result;
        const token = localStorage.getItem('jobconnect_token');

        try {
          let uploadSuccess = false;

          if (token) {
            const res = await apiFetch('/api/users/resume', {
              method: 'POST',
              body: JSON.stringify({
                fileName,
                fileSize: file.size,
                fileType: file.type,
                fileData: base64Data
              })
            });

            const resData = await res.json().catch(() => null);
            if (res.ok && resData?.success) {
              uploadSuccess = true;
            } else {
              // Fallback to update profile
              const putRes = await apiFetch('/api/users/profile', {
                method: 'PUT',
                body: JSON.stringify({
                  resume_name: fileName,
                  resumeName: fileName
                })
              });
              uploadSuccess = putRes.ok;
            }
          } else {
            uploadSuccess = true;
          }

          if (uploadSuccess) {
            // Update local profile state and storage
            setData(prev => {
              const updatedProfile = {
                ...(prev.profile || {}),
                resumeName: fileName,
                resumeUploadDate: 'Just now'
              };

              try {
                const storedMap = JSON.parse(localStorage.getItem('jobconnect_user_profiles') || '{}');
                if (updatedProfile.email) {
                  storedMap[updatedProfile.email] = updatedProfile;
                  localStorage.setItem('jobconnect_user_profiles', JSON.stringify(storedMap));
                }
              } catch (e) {}

              return {
                ...prev,
                profile: updatedProfile
              };
            });

            showToast(`Resume uploaded: ${fileName}`, 'success');
            resolve({ success: true, fileName });
          } else {
            showToast('Failed to upload resume to server. Please try again.', 'error');
            resolve({ success: false, message: 'Server upload failed.' });
          }
        } catch (err) {
          console.error('Error in uploadResume:', err);
          showToast('Network error while uploading resume.', 'error');
          resolve({ success: false, message: err.message });
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const approveProfileRequest = async (requestId) => {
    const isAdmin = data.currentUserRole === 'admin' || data.currentUser?.role === 'admin';
    if (!isAdmin) {
      showToast('Only Super Administrators can approve profile requests.', 'error');
      return;
    }

    const req = (data.profileRequests || []).find(r => String(r.id) === String(requestId));
    if (!req) {
      showToast('Profile request not found.', 'error');
      return;
    }

    // Prevent HR users from approving their own requests
    const adminId = data.currentUser?.id || data.currentUser?._id;
    if (String(req.user_id) === String(adminId) || req.userEmail === data.currentUser?.email) {
      showToast('Forbidden: You are strictly prohibited from approving your own profile request.', 'error');
      return;
    }

    const approvedAt = new Date().toISOString();
    setData(prev => {
      const updatedRequests = (prev.profileRequests || []).map(r => {
        if (String(r.id) === String(requestId)) {
          return { ...r, status: 'Approved', reviewed_at: approvedAt };
        }
        return r;
      });

      const targetEmail = req.userEmail;
      const proposed = req.proposed_data || req.proposedData || {};

      try {
        const storedMap = JSON.parse(localStorage.getItem('jobconnect_user_profiles') || '{}');
        if (targetEmail) {
          storedMap[targetEmail] = {
            ...(storedMap[targetEmail] || req.current_data || {}),
            ...proposed
          };
          localStorage.setItem('jobconnect_user_profiles', JSON.stringify(storedMap));
        }
      } catch (e) {}

      let updatedProfile = prev.profile;
      if (prev.profile?.email === targetEmail) {
        updatedProfile = {
          ...prev.profile,
          ...proposed,
          company: proposed.company || proposed.company_name || prev.profile?.company
        };
      }

      const updatedUsers = (prev.users || []).map(u => {
        if (u.email === targetEmail) {
          const comp = proposed.company || proposed.company_name || u.company;
          return {
            ...u,
            name: proposed.name || u.name,
            phone: proposed.phone || u.phone,
            company: comp,
            company_name: comp,
            location: proposed.location || u.location,
            title: proposed.title || u.title
          };
        }
        return u;
      });

      const hrNotif = {
        id: `n-${Date.now()}`,
        title: 'HR Profile Changes Approved',
        text: `Super Admin approved profile updates for ${req.userName}. Official credentials are now active in MySQL.`,
        time: 'Just now',
        type: 'hr'
      };

      return {
        ...prev,
        profileRequests: updatedRequests,
        profile: updatedProfile,
        users: updatedUsers,
        notifications: [hrNotif, ...(prev.notifications || [])]
      };
    });

    const token = localStorage.getItem('jobconnect_token');
    if (token) {
      try {
        const res = await apiFetch(`/api/users/profile-requests/${encodeURIComponent(requestId)}/approve`, {
          method: 'PUT'
        });
        if (res.ok) {
          fetchUsers();
          const reqRes = await apiFetch('/api/users/profile-requests');
          const reqData = await reqRes.json().catch(() => null);
          if (reqData && reqData.success && Array.isArray(reqData.data)) {
            setData(p => ({ ...p, profileRequests: reqData.data }));
          }
        }
      } catch (e) {
        console.error('Failed to sync approval to MySQL:', e);
      }
    }

    showToast(`Approved profile request for ${req.userName}! Updated in MySQL.`, 'success');
  };

  const rejectProfileRequest = async (requestId, reason = 'Changes could not be verified by platform administrator.') => {
    const isAdmin = data.currentUserRole === 'admin' || data.currentUser?.role === 'admin';
    if (!isAdmin) {
      showToast('Only Super Administrators can reject profile requests.', 'error');
      return;
    }

    const req = (data.profileRequests || []).find(r => String(r.id) === String(requestId));
    if (!req) {
      showToast('Profile request not found.', 'error');
      return;
    }

    const rejectedAt = new Date().toISOString();
    setData(prev => {
      const updatedRequests = (prev.profileRequests || []).map(r => {
        if (String(r.id) === String(requestId)) {
          return { ...r, status: 'Rejected', admin_notes: reason, reviewed_at: rejectedAt };
        }
        return r;
      });

      const hrNotif = {
        id: `n-${Date.now()}`,
        title: 'HR Profile Request Rejected',
        text: `Super Admin rejected profile changes for ${req.userName} (${reason}). Existing credentials were kept unchanged.`,
        time: 'Just now',
        type: 'hr'
      };

      return {
        ...prev,
        profileRequests: updatedRequests,
        notifications: [hrNotif, ...(prev.notifications || [])]
      };
    });

    const token = localStorage.getItem('jobconnect_token');
    if (token) {
      try {
        const res = await apiFetch(`/api/users/profile-requests/${encodeURIComponent(requestId)}/reject`, {
          method: 'PUT',
          body: JSON.stringify({ reason })
        });
        if (res.ok) {
          fetchUsers();
          const reqRes = await apiFetch('/api/users/profile-requests');
          const reqData = await reqRes.json().catch(() => null);
          if (reqData && reqData.success && Array.isArray(reqData.data)) {
            setData(p => ({ ...p, profileRequests: reqData.data }));
          }
        }
      } catch (e) {
        console.error('Failed to sync rejection to MySQL:', e);
      }
    }

    showToast(`Profile request for ${req.userName} rejected. Existing profile unchanged.`, 'info');
  };

  const addSkill = (skill) => {
    setData(prev => {
      const currentSkills = prev.profile?.skills || [];
      if (currentSkills.includes(skill)) return prev;
      const updatedSkills = [...currentSkills, skill];
      const newProfile = { ...prev.profile, skills: updatedSkills };

      try {
        const storedMap = JSON.parse(localStorage.getItem('jobconnect_user_profiles') || '{}');
        if (newProfile.email) {
          storedMap[newProfile.email] = newProfile;
          localStorage.setItem('jobconnect_user_profiles', JSON.stringify(storedMap));
        }
      } catch (e) {}

      const token = localStorage.getItem('jobconnect_token');
      if (token) {
        apiFetch('/api/users/profile', {
          method: 'PUT',
          body: JSON.stringify({ skills: updatedSkills })
        }).catch(() => {});
      }

      return {
        ...prev,
        profile: newProfile
      };
    });
    showToast(`Added ${skill} to skills!`, "success");
  };

  const removeSkill = (skill) => {
    setData(prev => {
      const updatedSkills = (prev.profile?.skills || []).filter(s => s !== skill);
      const newProfile = { ...prev.profile, skills: updatedSkills };

      try {
        const storedMap = JSON.parse(localStorage.getItem('jobconnect_user_profiles') || '{}');
        if (newProfile.email) {
          storedMap[newProfile.email] = newProfile;
          localStorage.setItem('jobconnect_user_profiles', JSON.stringify(storedMap));
        }
      } catch (e) {}

      const token = localStorage.getItem('jobconnect_token');
      if (token) {
        apiFetch('/api/users/profile', {
          method: 'PUT',
          body: JSON.stringify({ skills: updatedSkills })
        }).catch(() => {});
      }

      return {
        ...prev,
        profile: newProfile
      };
    });
    showToast(`Removed ${skill}`, "info");
  };

  const addEducation = (edu) => {
    setData(prev => {
      const updatedEdu = [...(prev.profile?.education || []), edu];
      const newProfile = { ...prev.profile, education: updatedEdu };
      try {
        const storedMap = JSON.parse(localStorage.getItem('jobconnect_user_profiles') || '{}');
        if (newProfile.email) {
          storedMap[newProfile.email] = newProfile;
          localStorage.setItem('jobconnect_user_profiles', JSON.stringify(storedMap));
        }
      } catch (e) {}

      const token = localStorage.getItem('jobconnect_token');
      if (token) {
        apiFetch('/api/users/profile', {
          method: 'PUT',
          body: JSON.stringify({ education: updatedEdu })
        }).catch(() => {});
      }

      return { ...prev, profile: newProfile };
    });
    showToast(`Added "${edu.degree}" to Education!`, "success");
  };

  const removeEducation = (index) => {
    setData(prev => {
      const updatedEdu = (prev.profile?.education || []).filter((_, i) => i !== index);
      const newProfile = { ...prev.profile, education: updatedEdu };
      try {
        const storedMap = JSON.parse(localStorage.getItem('jobconnect_user_profiles') || '{}');
        if (newProfile.email) {
          storedMap[newProfile.email] = newProfile;
          localStorage.setItem('jobconnect_user_profiles', JSON.stringify(storedMap));
        }
      } catch (e) {}

      const token = localStorage.getItem('jobconnect_token');
      if (token) {
        apiFetch('/api/users/profile', {
          method: 'PUT',
          body: JSON.stringify({ education: updatedEdu })
        }).catch(() => {});
      }

      return { ...prev, profile: newProfile };
    });
    showToast("Education entry removed", "info");
  };

  const addExperience = (exp) => {
    setData(prev => {
      const updatedExp = [...(prev.profile?.experience || []), exp];
      const newProfile = { ...prev.profile, experience: updatedExp };
      try {
        const storedMap = JSON.parse(localStorage.getItem('jobconnect_user_profiles') || '{}');
        if (newProfile.email) {
          storedMap[newProfile.email] = newProfile;
          localStorage.setItem('jobconnect_user_profiles', JSON.stringify(storedMap));
        }
      } catch (e) {}

      const token = localStorage.getItem('jobconnect_token');
      if (token) {
        apiFetch('/api/users/profile', {
          method: 'PUT',
          body: JSON.stringify({ experience: updatedExp })
        }).catch(() => {});
      }

      return { ...prev, profile: newProfile };
    });
    showToast(`Added "${exp.position}" to Experience!`, "success");
  };

  const removeExperience = (index) => {
    setData(prev => {
      const updatedExp = (prev.profile?.experience || []).filter((_, i) => i !== index);
      const newProfile = { ...prev.profile, experience: updatedExp };
      try {
        const storedMap = JSON.parse(localStorage.getItem('jobconnect_user_profiles') || '{}');
        if (newProfile.email) {
          storedMap[newProfile.email] = newProfile;
          localStorage.setItem('jobconnect_user_profiles', JSON.stringify(storedMap));
        }
      } catch (e) {}

      const token = localStorage.getItem('jobconnect_token');
      if (token) {
        apiFetch('/api/users/profile', {
          method: 'PUT',
          body: JSON.stringify({ experience: updatedExp })
        }).catch(() => {});
      }

      return { ...prev, profile: newProfile };
    });
    showToast("Experience entry removed", "info");
  };

  const addProject = (proj) => {
    setData(prev => {
      const updatedProj = [...(prev.profile?.projects || []), proj];
      const newProfile = { ...prev.profile, projects: updatedProj };
      try {
        const storedMap = JSON.parse(localStorage.getItem('jobconnect_user_profiles') || '{}');
        if (newProfile.email) {
          storedMap[newProfile.email] = newProfile;
          localStorage.setItem('jobconnect_user_profiles', JSON.stringify(storedMap));
        }
      } catch (e) {}

      const token = localStorage.getItem('jobconnect_token');
      if (token) {
        apiFetch('/api/users/profile', {
          method: 'PUT',
          body: JSON.stringify({ projects: updatedProj })
        }).catch(() => {});
      }

      return { ...prev, profile: newProfile };
    });
    showToast(`Added "${proj.title}" to Featured Projects!`, "success");
  };

  const removeProject = (index) => {
    setData(prev => {
      const updatedProj = (prev.profile?.projects || []).filter((_, i) => i !== index);
      const newProfile = { ...prev.profile, projects: updatedProj };
      try {
        const storedMap = JSON.parse(localStorage.getItem('jobconnect_user_profiles') || '{}');
        if (newProfile.email) {
          storedMap[newProfile.email] = newProfile;
          localStorage.setItem('jobconnect_user_profiles', JSON.stringify(storedMap));
        }
      } catch (e) {}

      const token = localStorage.getItem('jobconnect_token');
      if (token) {
        apiFetch('/api/users/profile', {
          method: 'PUT',
          body: JSON.stringify({ projects: updatedProj })
        }).catch(() => {});
      }

      return { ...prev, profile: newProfile };
    });
    showToast("Project removed", "info");
  };

  const registerNewUser = (user) => {
    setData(prev => {
      const existing = prev.users || [];
      if (existing.some(u => u.email === user.email)) {
        return prev;
      }
      return {
        ...prev,
        users: [...existing, user]
      };
    });
  };

  const loginUserSuccess = (user, role, token) => {
    // Clear any stale toast state after login
    clearToasts();
    if (token) {
      localStorage.setItem('jobconnect_token', token);
    }
    // Strictly bind role to user.role from MySQL (preventing any parameter-based spoofing)
    const verifiedRole = user.role === 'user' ? 'seeker' : user.role;
    const userProfile = getProfileForUser(user);
    setData(prev => ({
      ...prev,
      currentUserRole: verifiedRole,
      currentUser: user,
      profile: userProfile
    }));
    setTimeout(() => {
      fetchJobs();
      fetchApplications();
      fetchSavedJobs();
      fetchUsers();
    }, 50);
  };

  const logout = () => {
    clearToasts();
    localStorage.removeItem('jobconnect_token');
    setData(prev => ({
      ...prev,
      currentUser: null,
      currentUserRole: null,
      profile: null
    }));
    try {
      const state = JSON.parse(localStorage.getItem('jobconnect_state')) || {};
      state.currentUser = null;
      state.currentUserRole = null;
      state.profile = null;
      localStorage.setItem('jobconnect_state', JSON.stringify(state));
    } catch (e) {}
    showToast('Logged out successfully', 'info', 3000);
    setTimeout(() => {
      fetchJobs();
      fetchApplications();
    }, 50);
  };

  return (
    <AuthContext.Provider value={{
      data,
      toasts,
      showToast,
      clearToasts,
      removeToast,
      switchRole,
      resetAllData,
      applyForJob,
      toggleSaveJob,
      postNewJob,
      fetchJobs,
      fetchApplications,
      fetchSavedJobs,
      fetchUsers,
      updateApplicationStatus,
      approveJob,
      rejectJob,
      deleteJob,
      toggleUserStatus,
      addSkill,
      removeSkill,
      addEducation,
      removeEducation,
      addExperience,
      removeExperience,
      addProject,
      removeProject,
      registerNewUser,
      loginUserSuccess,
      updateProfile,
      uploadResume,
      approveProfileRequest,
      rejectProfileRequest,
      calculateProfileCompleteness,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
