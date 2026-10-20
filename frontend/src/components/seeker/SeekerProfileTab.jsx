import React, { useState, useEffect } from 'react';

export function SeekerProfileTab({
  profile = {},
  currentUser = {},
  profileCompleteness = 0,
  userInitials = 'U',
  onOpenEditProfileModal,
  previewResume,
  simulateUploadResume,
  updateProfile,
  addSkill,
  removeSkill,
  addEducation,
  removeEducation,
  addExperience,
  removeExperience,
  addProject,
  removeProject,
  showToast
}) {
  // Summary editor state
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [summaryText, setSummaryText] = useState(profile?.about || '');

  // Technical skills state
  const [newSkillText, setNewSkillText] = useState('');

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
    setSummaryText(profile?.about || '');
  }, [profile?.about]);

  const handleSaveSummary = () => {
    if (updateProfile) {
      updateProfile({ about: summaryText });
    }
    setIsEditingSummary(false);
  };

  const handleAddEducationSubmit = (e) => {
    e.preventDefault();
    if (!eduForm.degree.trim() || !eduForm.institution.trim()) {
      showToast && showToast('Please enter both Degree and Institution.', 'error');
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
      showToast && showToast('Please enter Position and Company name.', 'error');
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
      showToast && showToast('Please enter a Project Title.', 'error');
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

  const skillsList = Array.isArray(profile?.skills)
    ? profile.skills
    : profile?.skills
    ? String(profile.skills).split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
              {userInitials}
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-3">{profile?.name || 'Candidate'}</h2>
            <p className="text-xs font-bold text-indigo-600">{profile?.title || 'Job Seeker'}</p>
            <p className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              </svg>
              {profile?.location || 'Location Not Set'}
            </p>

            <button
              onClick={onOpenEditProfileModal}
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
                  {profileCompleteness}% ({profileCompleteness === 100 ? 'Complete - Applications Active' : 'Incomplete - 100% Required'})
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
                <span>{profile?.email || 'No email registered'}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span>{profile?.phone || 'Phone not set'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h3 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center justify-between">
              <span>Active Resume</span>
              <span className="text-xs text-emerald-600 font-semibold">{profile?.resumeName ? 'Verified' : 'Optional'}</span>
            </h3>

            {profile?.resumeName ? (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-rose-500 text-white font-black text-xs flex items-center justify-center">PDF</span>
                  <div className="text-xs">
                    <p className="font-bold text-slate-800 truncate max-w-[150px]">{profile.resumeName}</p>
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
                onClick={() => previewResume(profile?.name)}
                className="flex-1 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition"
              >
                Preview
              </button>
            </div>
          </div>
        </div>

        {/* Right Column Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Card */}
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
                      setSummaryText(profile?.about || '');
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
                {profile?.about ? (
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {profile.about}
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

          {/* Technical Skills Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900">Technical Skills</h3>
              <span className="text-xs text-slate-400">{skillsList.length} skills listed</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {skillsList.length === 0 ? (
                <span className="text-xs text-slate-400 italic py-1">
                  No technical skills listed yet. Add your programming languages and tools below!
                </span>
              ) : (
                skillsList.map((skill) => (
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
                <p className="text-[11px] text-slate-400">{(profile?.education || []).length} qualifications recorded</p>
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
              {(profile?.education || []).length === 0 ? (
                <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                  <p className="text-xs text-slate-500 font-medium">No education history added yet.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Click "+ Add Education" above to list your college or degree.</p>
                </div>
              ) : (
                (profile?.education || []).map((edu, idx) => (
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
                <p className="text-[11px] text-slate-400">{(profile?.experience || []).length} positions recorded</p>
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
              {(profile?.experience || []).length === 0 ? (
                <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                  <p className="text-xs text-slate-500 font-medium">No previous work experience listed yet.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Click "+ Add Experience" above to highlight your internships or full-time roles.</p>
                </div>
              ) : (
                (profile?.experience || []).map((exp, idx) => (
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
                <p className="text-[11px] text-slate-400">{(profile?.projects || []).length} projects showcased</p>
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
              {(profile?.projects || []).length === 0 ? (
                <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl col-span-2">
                  <p className="text-xs text-slate-500 font-medium">No featured projects added yet.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Click "+ Add Project" above to showcase your work to recruiters.</p>
                </div>
              ) : (
                (profile?.projects || []).map((proj, idx) => (
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
  );
}
