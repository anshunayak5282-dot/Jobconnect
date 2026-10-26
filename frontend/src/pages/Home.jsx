import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from '../router';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { ToastContainer } from '../components/common/ToastContainer';
import { SeekerDashboard } from '../components/seeker/SeekerDashboard';
import { HrDashboard } from '../components/hr/HrDashboard';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { JobDetailModal } from '../components/modals/JobDetailModal';
import { PostJobModal } from '../components/modals/PostJobModal';
import { CandidateDetailModal } from '../components/modals/CandidateDetailModal';
import { EditProfileModal } from '../components/modals/EditProfileModal';
import { RejectProfileModal } from '../components/modals/RejectProfileModal';
import { calculateProfileCompleteness } from '../utils/profileUtils';
import { matchesJobId } from '../utils/jobUtils';

export function Home({ initialTab }) {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const {
    data,
    toasts,
    showToast,
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
    uploadResume,
    logout
  } = useAuth();

  // Modal display states
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [rejectProfileModalData, setRejectProfileModalData] = useState(null);
  const [rejectReasonText, setRejectReasonText] = useState('');
  const [selectedJobDetail, setSelectedJobDetail] = useState(null);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [candidateModalData, setCandidateModalData] = useState(null);

  // Form states
  const [coverLetter, setCoverLetter] = useState('');
  const [editProfileForm, setEditProfileForm] = useState({
    name: '',
    title: '',
    company: '',
    location: '',
    phone: '',
    about: ''
  });

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

  // Seeker active sub-tab ('explore' | 'applications' | 'saved' | 'profile') synchronized with route pathname
  const getTabFromPath = (path) => {
    if (path === '/dashboard' || path === '/jobs') return 'explore';
    if (path === '/applications') return 'applications';
    if (path === '/saved' || path === '/saved-jobs') return 'saved';
    if (path === '/profile' || path === '/my-profile') return 'profile';
    return initialTab || 'explore';
  };

  const [seekerTab, setSeekerTabState] = useState(() => getTabFromPath(routeLocation.pathname));

  useEffect(() => {
    const tab = getTabFromPath(routeLocation.pathname);
    setSeekerTabState(tab);
  }, [routeLocation.pathname, initialTab]);

  const handleSetSeekerTab = (tab) => {
    setSeekerTabState(tab);
    if (tab === 'explore') {
      navigate('/dashboard');
    } else if (tab === 'applications') {
      navigate('/applications');
    } else if (tab === 'saved') {
      navigate('/saved');
    } else if (tab === 'profile') {
      navigate('/profile');
    }
  };

  // Search & Filter state
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [expFilters, setExpFilters] = useState([]);
  const [minSalary, setMinSalary] = useState(0);
  const [sortBy, setSortBy] = useState('newest');

  // HR filters
  const [hrJobFilter, setHrJobFilter] = useState('all');
  const [hrStatusFilter, setHrStatusFilter] = useState('all');

  // Derive active role strictly from authenticated MySQL user role to prevent spoofing
  const currentRole = useMemo(() => {
    const dbRole = data.currentUser?.role;
    if (dbRole === 'user') return 'seeker';
    if (dbRole === 'hr') return 'hr';
    if (dbRole === 'admin') return 'admin';
    return data.currentUserRole || 'seeker';
  }, [data.currentUser?.role, data.currentUserRole]);

  // Profile Completeness calculation
  const profileCompleteness = useMemo(() => {
    return calculateProfileCompleteness(data.profile);
  }, [data.profile]);

  // Seeker user stats
  const activeUserEmail = (data.currentUser?.email || data.profile?.email || '').toLowerCase().trim();
  const activeUserId = data.currentUser?.id || data.currentUser?._id;
  const myApplications = useMemo(() => {
    if (!activeUserEmail && !activeUserId) return [];
    return (data.applications || []).filter((a) => {
      const email = (a.applicantEmail || a.applicant?.email || a.applicant_email || '').toLowerCase().trim();
      const matchesEmail = Boolean(activeUserEmail && email && email === activeUserEmail);
      const applicantId = a.applicantId || a.applicant?.id || a.applicant_id;
      const matchesId = Boolean(activeUserId && applicantId && String(applicantId) === String(activeUserId));
      return matchesEmail || matchesId;
    });
  }, [data.applications, activeUserEmail, activeUserId]);

  useEffect(() => {
    if (seekerTab === 'applications' && fetchApplications) {
      fetchApplications();
    }
  }, [seekerTab, fetchApplications]);

  useEffect(() => {
    if (seekerTab === 'saved' && fetchSavedJobs) {
      fetchSavedJobs();
    }
  }, [seekerTab, fetchSavedJobs]);

  useEffect(() => {
    if ((currentRole === 'hr' || currentRole === 'admin') && fetchApplications) {
      fetchApplications();
    }
    if (currentRole === 'admin' && fetchUsers) {
      fetchUsers();
    }
  }, [currentRole, fetchApplications, fetchUsers]);

  const savedJobs = useMemo(() => {
    return (data.jobs || []).filter((j) =>
      (data.savedJobIds || []).some((id) => matchesJobId(id, j.id))
    );
  }, [data.jobs, data.savedJobIds]);

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
          j.companyName === 'ABC Technologies' ||
          j.postedBy === 'HR - Priya Sharma' ||
          String(j.posted_by) === '2'
        );
      }

      // 2. If explicitly created by this authenticated HR user, ALWAYS include it
      const matchesCreatorId =
        hrId && (String(j.posted_by) === String(hrId) || String(j.postedBy) === String(hrId));
      if (matchesCreatorId) return true;

      const matchesCreatorEmail =
        hrEmail && j.postedByEmail && j.postedByEmail.toLowerCase() === hrEmail;
      if (matchesCreatorEmail) return true;

      const matchesCreatorName =
        hrName && (j.postedBy === `HR - ${hrName}` || j.postedBy === hrName || j.postedByName === hrName);
      if (matchesCreatorName) return true;

      // 3. For newly registered HR accounts, STRICTLY ISOLATE demo vacancies
      const isDemoJob =
        j.postedBy === 'HR - Priya Sharma' ||
        String(j.posted_by) === '2' ||
        ((j.company === 'ABC Technologies' || j.companyName === 'ABC Technologies') && (j.id === 'job-1' || j.id === 1 || j.id === 'job-6' || j.id === 6));

      if (isDemoJob) return false;

      // Match jobs under this HR's company (only if company is non-empty)
      const comp = j.company || j.companyName;
      const matchesCompany =
        myCompany &&
        comp &&
        comp.toLowerCase().trim() === myCompany.toLowerCase().trim();

      return Boolean(matchesCompany);
    });
  }, [data.jobs, isDemoHR, hrId, hrEmail, hrName, myCompany]);

  const hrActiveJobs = useMemo(() => hrJobs.filter((j) => j.status === 'Approved'), [hrJobs]);
  const hrJobIds = useMemo(() => hrJobs.map((j) => String(j.id).replace('job-', '')), [hrJobs]);
  const hrAllApps = useMemo(
    () => (data.applications || []).filter((a) => hrJobIds.includes(String(a.jobId).replace('job-', ''))),
    [data.applications, hrJobIds]
  );
  const hrShortlisted = useMemo(
    () => hrAllApps.filter((a) => ['Shortlisted', 'Interview'].includes(a.status)),
    [hrAllApps]
  );
  const hrSelected = useMemo(
    () => hrAllApps.filter((a) => a.status === 'Selected'),
    [hrAllApps]
  );

  const hrFilteredApps = useMemo(() => {
    let list = hrAllApps;
    if (hrJobFilter !== 'all') {
      list = list.filter((a) => matchesJobId(a.jobId, hrJobFilter));
    }
    if (hrStatusFilter !== 'all') {
      list = list.filter((a) => a.status === hrStatusFilter);
    }
    return list;
  }, [hrAllApps, hrJobFilter, hrStatusFilter]);

  // Admin computations
  const adminPendingJobs = useMemo(() => (data.jobs || []).filter((j) => j.status === 'Pending'), [data.jobs]);
  const adminSeekers = useMemo(() => (data.users || []).filter((u) => u.role === 'user'), [data.users]);
  const adminHrs = useMemo(() => (data.users || []).filter((u) => u.role === 'hr'), [data.users]);
  const adminPendingProfileRequests = useMemo(
    () => (data.profileRequests || []).filter((r) => r.status === 'Pending'),
    [data.profileRequests]
  );

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

  // 5-stage stepper definition
  const stages = useMemo(() => ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected'], []);

  // Filtered jobs calculation
  const filteredJobs = useMemo(() => {
    let list = (data.jobs || []).filter((j) => j.status === 'Approved');

    if (keyword.trim()) {
      const q = keyword.toLowerCase().trim();
      list = list.filter(
        (j) =>
          (j.title && j.title.toLowerCase().includes(q)) ||
          ((j.company || j.companyName) && (j.company || j.companyName).toLowerCase().includes(q)) ||
          (Array.isArray(j.skills) ? j.skills : (j.skills ? String(j.skills).split(',') : [])).some((s) => s.toLowerCase().includes(q)) ||
          (j.description && j.description.toLowerCase().includes(q))
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

  // Handlers
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
    const skills = Array.isArray(job.skills)
      ? job.skills
      : job.skills
      ? String(job.skills).split(',').map((s) => s.trim())
      : [];
    setCoverLetter(
      `I am excited to apply for ${job.title} at ${job.company || job.companyName}. My background in ${skills.slice(0, 3).join(', ')} aligns well with your team's objectives.`
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

  const previewResume = (name, customResumeDoc, customTitle, customLocation) => {
    const candidateName = name || data.profile?.name || 'Candidate';
    const resumeDoc = customResumeDoc || (data.profile?.email === data.currentUser?.email ? data.profile?.resumeName : null) || `${candidateName.replace(/\s+/g, '_')}_Resume.pdf`;
    const title = customTitle || data.profile?.title || 'Job Seeker';
    const loc = customLocation || data.profile?.location || 'India';
    alert(
      `[JobConnect PDF Viewer Simulation]\n\nCandidate: ${candidateName}\nResume Document: ${resumeDoc}\nTitle: ${title}\nLocation: ${loc}\nStatus: Verified by JobConnect.`
    );
  };

  const handleUploadResume = async (file) => {
    if (uploadResume && file) {
      await uploadResume(file);
    }
  };

  const openCandidateDetail = (email) => {
    if (!email) return;
    if (email === data.profile?.email) {
      setCandidateModalData(data.profile);
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('jobconnect_token') : null;
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch(`/api/users/profile/${encodeURIComponent(email)}`, { headers })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          const user = resData.data;
          setCandidateModalData({
            name: user.name || 'Candidate',
            email: user.email,
            phone: user.phone || 'Not provided',
            location: user.location || 'India',
            about: user.about || 'Candidate looking for relevant opportunities.',
            skills: user.skills ? (Array.isArray(user.skills) ? user.skills : user.skills.split(',').map((s) => s.trim())) : ['General Tech'],
            education: user.education || [],
            experience: user.experience || [],
            projects: user.projects || []
          });
        } else {
          const app = (data.applications || []).find((a) => (a.applicantEmail || a.applicant?.email || '').toLowerCase() === email.toLowerCase());
          setCandidateModalData({
            name: app?.applicantName || app?.applicant?.name || 'Candidate',
            email: email,
            phone: app?.applicantPhone || app?.applicant?.phone || 'Not provided',
            location: app?.applicantLocation || app?.applicant?.location || 'India',
            about: app?.coverLetter || 'Candidate looking for relevant opportunities.',
            skills: ['General Tech'],
            education: [],
            experience: [],
            projects: []
          });
        }
      })
      .catch(() => {
        const app = (data.applications || []).find((a) => (a.applicantEmail || a.applicant?.email || '').toLowerCase() === email.toLowerCase());
        setCandidateModalData({
          name: app?.applicantName || app?.applicant?.name || 'Candidate',
          email: email,
          phone: app?.applicantPhone || app?.applicant?.phone || 'Not provided',
          location: app?.applicantLocation || app?.applicant?.location || 'India',
          about: app?.coverLetter || 'Candidate looking for relevant opportunities.',
          skills: ['General Tech'],
          education: [],
          experience: [],
          projects: []
        });
      });
  };

  const handleLogoutClick = () => {
    if (logout) {
      logout();
    }
    navigate('/login');
  };

  const handleOpenEditProfile = () => {
    setEditProfileForm({
      name: data.profile?.name || data.currentUser?.name || '',
      title: data.profile?.title || (currentRole === 'hr' ? 'HR Talent Acquisition' : 'Job Seeker'),
      company: myCompany || '',
      location: data.profile?.location || '',
      phone: data.profile?.phone || '',
      about: data.profile?.about || ''
    });
    setShowEditProfileModal(true);
  };

  const handleReviseProfileRequest = (request) => {
    const prop = request.proposed_data || {};
    setEditProfileForm({
      name: prop.name || data.profile?.name || data.currentUser?.name || '',
      title: prop.title || data.profile?.title || 'HR Talent Acquisition',
      company: prop.company || prop.company_name || myCompany || '',
      location: prop.location || data.profile?.location || '',
      phone: prop.phone || data.profile?.phone || '',
      about: prop.about || data.profile?.about || ''
    });
    setShowEditProfileModal(true);
  };

  return (
    <div className="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* ================= MAIN HEADER NAVBAR ================= */}
      <Navbar
        currentRole={currentRole}
        userInitials={userInitials}
        currentUser={data.currentUser}
        profile={data.profile}
        seekerTab={seekerTab}
        setSeekerTab={handleSetSeekerTab}
        myApplicationsCount={myApplications.length}
        savedJobsCount={savedJobs.length}
        adminPendingCount={adminPendingJobs.length}
        notifications={data.notifications}
        onOpenEditProfile={handleOpenEditProfile}
        onLogout={handleLogoutClick}
      />

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* VIEW 1: JOB SEEKER VIEWS */}
        {currentRole === 'seeker' && (
          <SeekerDashboard
            seekerTab={seekerTab}
            setSeekerTab={handleSetSeekerTab}
            filteredJobs={filteredJobs}
            allJobs={data.jobs}
            keyword={keyword}
            setKeyword={setKeyword}
            location={location}
            setLocation={setLocation}
            jobType={jobType}
            setJobType={setJobType}
            expFilters={expFilters}
            handleExpCheckboxChange={handleExpCheckboxChange}
            minSalary={minSalary}
            setMinSalary={setMinSalary}
            sortBy={sortBy}
            setSortBy={setSortBy}
            clearAllFilters={clearAllFilters}
            savedJobIds={data.savedJobIds}
            applications={data.applications}
            profile={data.profile}
            currentUser={data.currentUser}
            profileCompleteness={profileCompleteness}
            userInitials={userInitials}
            myApplications={myApplications}
            savedJobs={savedJobs}
            stages={stages}
            onToggleSave={toggleSaveJob}
            onOpenJobDetail={handleOpenJobDetail}
            onOpenEditProfileModal={handleOpenEditProfile}
            previewResume={previewResume}
            uploadResume={uploadResume}
            simulateUploadResume={handleUploadResume}
            updateProfile={updateProfile}
            addSkill={addSkill}
            removeSkill={removeSkill}
            addEducation={addEducation}
            removeEducation={removeEducation}
            addExperience={addExperience}
            removeExperience={removeExperience}
            addProject={addProject}
            removeProject={removeProject}
            showToast={showToast}
          />
        )}

        {/* VIEW 2: HR / RECRUITER VIEWS */}
        {currentRole === 'hr' && (
          <HrDashboard
            myCompany={myCompany}
            currentUser={data.currentUser}
            latestHrProfileRequest={latestHrProfileRequest}
            onOpenEditProfile={handleOpenEditProfile}
            onOpenPostJob={() => {
              setPostForm((prev) => ({ ...prev, company: myCompany || prev.company }));
              setShowPostJobModal(true);
            }}
            onReviseProfileRequest={handleReviseProfileRequest}
            hrJobs={hrJobs}
            hrActiveJobs={hrActiveJobs}
            hrAllApps={hrAllApps}
            hrShortlisted={hrShortlisted}
            hrSelected={hrSelected}
            hrFilteredApps={hrFilteredApps}
            hrJobFilter={hrJobFilter}
            setHrJobFilter={setHrJobFilter}
            hrStatusFilter={hrStatusFilter}
            setHrStatusFilter={setHrStatusFilter}
            updateApplicationStatus={updateApplicationStatus}
            onDeleteJob={deleteJob}
            previewResume={previewResume}
            openCandidateDetail={openCandidateDetail}
          />
        )}

        {/* VIEW 3: ADMIN VIEWS */}
        {currentRole === 'admin' && (
          <AdminDashboard
            adminSeekers={adminSeekers}
            adminHrs={adminHrs}
            adminPendingJobs={adminPendingJobs}
            adminPendingProfileRequests={adminPendingProfileRequests}
            totalApplications={(data.applications || []).length}
            currentUserId={data.currentUser?.id}
            onApproveJob={approveJob}
            onRejectJob={rejectJob}
            onApproveProfileRequest={approveProfileRequest}
            onOpenRejectProfileModal={(req) => {
              setRejectProfileModalData(req);
              setRejectReasonText('Unable to verify company registration and corporate domain.');
            }}
            users={data.users}
            onToggleUserStatus={toggleUserStatus}
          />
        )}
      </main>

      {/* ================= FOOTER ================= */}
      <Footer />

      {/* ================= MODAL 1: JOB DETAIL ================= */}
      <JobDetailModal
        job={selectedJobDetail}
        onClose={() => setSelectedJobDetail(null)}
        applications={data.applications}
        profile={data.profile}
        profileCompleteness={profileCompleteness}
        coverLetter={coverLetter}
        setCoverLetter={setCoverLetter}
        onApply={handleApplySubmit}
        onRedirectToProfile={() => {
          setSelectedJobDetail(null);
          handleSetSeekerTab('profile');
        }}
      />

      {/* ================= MODAL 2: POST JOB MODAL ================= */}
      <PostJobModal
        show={showPostJobModal}
        onClose={() => setShowPostJobModal(false)}
        postForm={postForm}
        setPostForm={setPostForm}
        onSubmit={handlePostJobSubmit}
      />

      {/* ================= MODAL 3: CANDIDATE DETAIL MODAL ================= */}
      <CandidateDetailModal
        candidate={candidateModalData}
        onClose={() => setCandidateModalData(null)}
      />

      {/* ================= MODAL 4: EDIT PROFILE MODAL ================= */}
      <EditProfileModal
        show={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        currentRole={currentRole}
        latestHrProfileRequest={latestHrProfileRequest}
        editProfileForm={editProfileForm}
        setEditProfileForm={setEditProfileForm}
        onSubmit={handleSaveProfile}
      />

      {/* ================= MODAL 5: REJECT PROFILE REQUEST MODAL ================= */}
      <RejectProfileModal
        requestData={rejectProfileModalData}
        onClose={() => setRejectProfileModalData(null)}
        rejectReasonText={rejectReasonText}
        setRejectReasonText={setRejectReasonText}
        onConfirmReject={(id, reason) => {
          rejectProfileRequest(id, reason);
          setRejectProfileModalData(null);
        }}
      />

      {/* ================= TOAST CONTAINER ================= */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default Home;
