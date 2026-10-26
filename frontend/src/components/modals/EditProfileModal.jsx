import React from 'react';

export function EditProfileModal({
  show,
  onClose,
  currentRole,
  latestHrProfileRequest,
  editProfileForm,
  setEditProfileForm,
  onSubmit
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fade-in p-4 sm:p-6 sm:p-8">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 gap-2">
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 break-words">
              {currentRole === 'hr' ? 'Edit Recruiter Profile' : 'Edit Profile Details'}
            </h3>
            <p className="text-xs text-slate-500 break-words mt-0.5">
              {currentRole === 'hr'
                ? 'Proposed modifications will be submitted for Super Admin verification and approval.'
                : 'Update your details to be saved in MySQL.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold shrink-0 p-1"
          >
            ✕
          </button>
        </div>

        {currentRole === 'hr' && latestHrProfileRequest?.status === 'Pending' && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
            <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="break-words">
              <strong>Notice:</strong> You currently have a pending profile request. Submitting this form will update your pending request for Super Admin review.
            </span>
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-4 space-y-4 text-xs">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2.5 sm:gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{currentRole === 'hr' ? 'Submit for Admin Approval' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
