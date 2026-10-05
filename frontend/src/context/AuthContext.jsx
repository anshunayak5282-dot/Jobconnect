import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialData } from '../data/initialData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const local = localStorage.getItem('jobconnect_state');
    return local ? JSON.parse(local) : initialData;
  });

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('jobconnect_state', JSON.stringify(data));
  }, [data]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const switchRole = (role) => {
    setData(prev => ({ ...prev, currentUserRole: role }));
    showToast(`Switched simulation role to ${role === 'seeker' ? 'Candidate' : role === 'hr' ? 'HR Recruiter' : 'Super Admin'}`, 'info');
  };

  const resetAllData = () => {
    setData(initialData);
    showToast("Reset all platform state back to seed data", "info");
  };

  const applyForJob = (jobId, coverLetter) => {
    const job = data.jobs.find(j => j.id === jobId);
    if (!job) return;

    const newApp = {
      id: `app-${Date.now()}`,
      jobId,
      applicantName: data.profile.name,
      applicantEmail: data.profile.email,
      applicantPhone: data.profile.phone,
      applicantLocation: data.profile.location,
      resumeUrl: data.profile.resumeName,
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

    showToast(`Application submitted for ${job.title}!`, 'success');
  };

  const toggleSaveJob = (jobId) => {
    setData(prev => {
      const exists = prev.savedJobIds.includes(jobId);
      const updated = exists 
        ? prev.savedJobIds.filter(id => id !== jobId)
        : [...prev.savedJobIds, jobId];
      
      showToast(exists ? "Removed from saved jobs" : "Saved to your bookmarks!", exists ? "info" : "success");
      return { ...prev, savedJobIds: updated };
    });
  };

  const postNewJob = (jobData) => {
    const newJob = {
      id: `job-${Date.now()}`,
      ...jobData,
      status: 'Pending', // Sent to Admin
      postedBy: 'HR - Priya Sharma',
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

    showToast("Job submitted! Awaiting Super Admin approval.", "info");
  };

  const updateApplicationStatus = (appId, status) => {
    setData(prev => {
      const app = prev.applications.find(a => a.id === appId);
      const updatedApps = prev.applications.map(a => a.id === appId ? { ...a, status } : a);
      const newNotif = {
        id: `n-${Date.now()}`,
        title: "Candidate Pipeline Updated",
        text: `${app ? app.applicantName : 'Candidate'} status changed to ${status}.`,
        time: "Just now",
        type: "status"
      };

      return {
        ...prev,
        applications: updatedApps,
        notifications: [newNotif, ...prev.notifications]
      };
    });

    showToast(`Candidate status updated to "${status}"!`, 'success');
  };

  const approveJob = (jobId) => {
    setData(prev => {
      const job = prev.jobs.find(j => j.id === jobId);
      const updatedJobs = prev.jobs.map(j => j.id === jobId ? { ...j, status: 'Approved' } : j);
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

    showToast("Job opening verified and published live!", "success");
  };

  const rejectJob = (jobId) => {
    setData(prev => ({
      ...prev,
      jobs: prev.jobs.map(j => j.id === jobId ? { ...j, status: 'Rejected' } : j)
    }));
    showToast("Job rejected", "info");
  };

  const toggleUserStatus = (userId) => {
    setData(prev => {
      const updatedUsers = prev.users.map(u => 
        u.id === userId ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
      );
      return { ...prev, users: updatedUsers };
    });
    showToast("User account status toggled", "info");
  };

  const addSkill = (skill) => {
    setData(prev => {
      if (prev.profile.skills.includes(skill)) return prev;
      return {
        ...prev,
        profile: { ...prev.profile, skills: [...prev.profile.skills, skill] }
      };
    });
    showToast(`Added ${skill} to skills!`, "success");
  };

  const removeSkill = (skill) => {
    setData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        skills: prev.profile.skills.filter(s => s !== skill)
      }
    }));
    showToast(`Removed ${skill}`, "info");
  };

  return (
    <AuthContext.Provider value={{
      data,
      toasts,
      showToast,
      switchRole,
      resetAllData,
      applyForJob,
      toggleSaveJob,
      postNewJob,
      updateApplicationStatus,
      approveJob,
      rejectJob,
      toggleUserStatus,
      addSkill,
      removeSkill
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
