import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from '../router';
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

export function Home() {
  const navigate = useNavigate();
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

  // Seeker active sub-tab ('explore' | 'applications' | 'saved' | 'profile')
  const [seekerTab, setSeekerTab] = useState('explore');

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
  const activeUserEmail = data.currentUser?.email || data.profile?.email;
  const myApplications = useMemo(() => {
    return (data.applications || []).filter(
      (a) => a.applicantEmail === activeUserEmail
    );
  }, [data.applications, activeUserEmail]);

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
        setSeekerTab={setSeekerTab}
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
            setSeekerTab={setSeekerTab}
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
            simulateUploadResume={simulateUploadResume}
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
          setSeekerTab('profile');
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
