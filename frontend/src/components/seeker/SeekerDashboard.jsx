import React from 'react';
import { ExploreJobsTab } from './ExploreJobsTab';
import { MyApplicationsTab } from './MyApplicationsTab';
import { SavedJobsTab } from './SavedJobsTab';
import { SeekerProfileTab } from './SeekerProfileTab';

export function SeekerDashboard({
  seekerTab,
  setSeekerTab,
  filteredJobs,
  allJobs = [],
  keyword,
  setKeyword,
  location,
  setLocation,
  jobType,
  setJobType,
  expFilters,
  handleExpCheckboxChange,
  minSalary,
  setMinSalary,
  sortBy,
  setSortBy,
  clearAllFilters,
  savedJobIds,
  applications,
  profile,
  currentUser,
  profileCompleteness,
  userInitials,
  myApplications,
  savedJobs,
  stages,
  onToggleSave,
  onOpenJobDetail,
  onOpenEditProfileModal,
  previewResume,
  uploadResume,
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
  return (
    <div className="space-y-8 animate-fade-in">
      {seekerTab === 'explore' && (
        <ExploreJobsTab
          filteredJobs={filteredJobs}
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
          savedJobIds={savedJobIds}
          applications={applications}
          profile={profile}
          profileCompleteness={profileCompleteness}
          onToggleSave={onToggleSave}
          onOpenJobDetail={onOpenJobDetail}
          onRedirectToProfile={() => setSeekerTab('profile')}
        />
      )}

      {seekerTab === 'applications' && (
        <MyApplicationsTab
          myApplications={myApplications}
          jobs={allJobs.length > 0 ? allJobs : filteredJobs}
          stages={stages}
          onOpenJobDetail={onOpenJobDetail}
          onFindJobs={() => setSeekerTab('explore')}
        />
      )}

      {seekerTab === 'saved' && (
        <SavedJobsTab
          savedJobs={savedJobs}
          profileCompleteness={profileCompleteness}
          onToggleSave={onToggleSave}
          onOpenJobDetail={onOpenJobDetail}
          onRedirectToProfile={() => setSeekerTab('profile')}
        />
      )}

      {seekerTab === 'profile' && (
        <SeekerProfileTab
          profile={profile}
          currentUser={currentUser}
          profileCompleteness={profileCompleteness}
          userInitials={userInitials}
          onOpenEditProfileModal={onOpenEditProfileModal}
          previewResume={previewResume}
          uploadResume={uploadResume}
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
    </div>
  );
}
