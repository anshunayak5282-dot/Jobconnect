import React from 'react';
import { HrHeader } from './HrHeader';
import { HrProfileRequestBanner } from './HrProfileRequestBanner';
import { HrMetrics } from './HrMetrics';
import { HrJobOpenings } from './HrJobOpenings';
import { HrPipeline } from './HrPipeline';

export function HrDashboard({
  myCompany,
  currentUser,
  latestHrProfileRequest,
  onOpenEditProfile,
  onOpenPostJob,
  onReviseProfileRequest,
  hrJobs,
  hrActiveJobs,
  hrAllApps,
  hrShortlisted,
  hrSelected,
  hrFilteredApps,
  hrJobFilter,
  setHrJobFilter,
  hrStatusFilter,
  setHrStatusFilter,
  updateApplicationStatus,
  onDeleteJob,
  previewResume,
  openCandidateDetail
}) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <HrHeader
        companyName={myCompany}
        onOpenEditProfile={onOpenEditProfile}
        onOpenPostJob={onOpenPostJob}
      />

      {/* HR Profile Modification Status Banner */}
      <HrProfileRequestBanner
        request={latestHrProfileRequest}
        myCompany={myCompany}
        currentUser={currentUser}
        onRevise={onReviseProfileRequest}
      />

      {/* Recruiter Metrics */}
      <HrMetrics
        totalJobs={hrJobs.length}
        activeJobs={hrActiveJobs.length}
        applicationsCount={hrAllApps.length}
        shortlistedCount={hrShortlisted.length}
        selectedCount={hrSelected.length}
      />

      {/* HR Sub-sections: Job Openings & Candidate Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <HrJobOpenings
            hrJobs={hrJobs}
            applications={hrAllApps}
            hrJobFilter={hrJobFilter}
            setHrJobFilter={setHrJobFilter}
            myCompany={myCompany}
            onOpenPostJob={onOpenPostJob}
            onDeleteJob={onDeleteJob}
          />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <HrPipeline
            hrFilteredApps={hrFilteredApps}
            hrJobs={hrJobs}
            hrJobFilter={hrJobFilter}
            setHrJobFilter={setHrJobFilter}
            hrStatusFilter={hrStatusFilter}
            setHrStatusFilter={setHrStatusFilter}
            myCompany={myCompany}
            updateApplicationStatus={updateApplicationStatus}
            previewResume={previewResume}
            openCandidateDetail={openCandidateDetail}
          />
        </div>
      </div>
    </div>
  );
}
