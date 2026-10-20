import React from 'react';
import { AdminHeader } from './AdminHeader';
import { AdminMetrics } from './AdminMetrics';
import { AdminJobModeration } from './AdminJobModeration';
import { AdminProfileModeration } from './AdminProfileModeration';
import { AdminUserDirectory } from './AdminUserDirectory';

export function AdminDashboard({
  adminSeekers = [],
  adminHrs = [],
  adminPendingJobs = [],
  adminPendingProfileRequests = [],
  totalApplications = 0,
  currentUserId,
  onApproveJob,
  onRejectJob,
  onApproveProfileRequest,
  onOpenRejectProfileModal,
  users = [],
  onToggleUserStatus
}) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Admin Header Banner */}
      <AdminHeader />

      {/* Admin Metrics Cards */}
      <AdminMetrics
        seekersCount={adminSeekers.length}
        hrsCount={adminHrs.length}
        pendingJobsCount={adminPendingJobs.length}
        pendingProfileRequestsCount={adminPendingProfileRequests.length}
        applicationsCount={totalApplications}
      />

      {/* Job Moderation & Approval Queue */}
      <AdminJobModeration
        pendingJobs={adminPendingJobs}
        onApproveJob={onApproveJob}
        onRejectJob={onRejectJob}
      />

      {/* HR Recruiter Profile Verification & Approval Queue */}
      <AdminProfileModeration
        pendingProfileRequests={adminPendingProfileRequests}
        currentUserId={currentUserId}
        onApproveProfileRequest={onApproveProfileRequest}
        onOpenRejectModal={onOpenRejectProfileModal}
      />

      {/* User & Employer Directory */}
      <AdminUserDirectory
        users={users}
        onToggleUserStatus={onToggleUserStatus}
      />
    </div>
  );
}
