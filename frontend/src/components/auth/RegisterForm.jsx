import React from 'react';

export function RegisterForm({
  regRole,
  setRegRole,
  regName,
  setRegName,
  regCompany,
  setRegCompany,
  regEmail,
  setRegEmail,
  regPhone,
  setRegPhone,
  regPassword,
  setRegPassword,
  regConfirmPassword,
  setRegConfirmPassword,
  agreeTerms,
  setAgreeTerms,
  isSubmitting,
  onSubmit
}) {
  return (
    <form onSubmit={onSubmit} autoComplete="off" className="space-y-3.5 text-xs">
      <div>
        <label className="block font-bold text-slate-700 mb-1">I want to register as:</label>
        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2">
          <label className="cursor-pointer">
            <input
              type="radio"
              name="regRole"
              value="user"
              checked={regRole === 'user'}
              onChange={(e) => setRegRole(e.target.value)}
              className="peer sr-only"
            />
            <div className="p-2 rounded-xl border border-slate-200 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 text-center font-bold text-slate-700 peer-checked:text-indigo-700 transition">
              👤 Job Seeker (Candidate)
            </div>
          </label>
          <label className="cursor-pointer">
            <input
              type="radio"
              name="regRole"
              value="hr"
              checked={regRole === 'hr'}
              onChange={(e) => setRegRole(e.target.value)}
              className="peer sr-only"
            />
            <div className="p-2 rounded-xl border border-slate-200 peer-checked:border-purple-600 peer-checked:bg-purple-50 text-center font-bold text-slate-700 peer-checked:text-purple-700 transition">
              💼 HR / Recruiter
            </div>
          </label>
        </div>
      </div>

      <div>
        <label className="block font-bold text-slate-700 mb-1">Full Legal Name *</label>
        <input
          type="text"
          name="reg_fullname"
          autoComplete="off"
          required
          value={regName}
          onChange={(e) => setRegName(e.target.value)}
          placeholder="e.g. Rahul Sharma"
          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
        />
      </div>

      {regRole === 'hr' && (
        <div>
          <label className="block font-bold text-slate-700 mb-1">Company / Organization *</label>
          <input
            type="text"
            name="reg_company"
            autoComplete="off"
            required
            value={regCompany}
            onChange={(e) => setRegCompany(e.target.value)}
            placeholder="e.g. Acme Technologies Inc."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>
      )}

      <div>
        <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"></path>
            </svg>
          </span>
          <input
            type="email"
            name="reg_email"
            autoComplete="off"
            required
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
            placeholder="rahul@example.com"
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>
      </div>

      <div>
        <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
          </span>
          <input
            type="tel"
            name="reg_mobile_phone"
            autoComplete="off"
            required
            value={regPhone}
            onChange={(e) => setRegPhone(e.target.value)}
            placeholder="e.g. +91 98765 43210"
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Password *</label>
          <input
            type="password"
            name="reg_user_password"
            autoComplete="new-password"
            required
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            placeholder="Min 6 characters"
            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>
        <div>
          <label className="block font-bold text-slate-700 mb-1">Confirm Password *</label>
          <input
            type="password"
            name="reg_user_confirm_password"
            autoComplete="new-password"
            required
            value={regConfirmPassword}
            onChange={(e) => setRegConfirmPassword(e.target.value)}
            placeholder="Repeat password"
            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>
      </div>

      <label className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-600 pt-1">
        <input
          type="checkbox"
          required
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          className="rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
        />
        <span>I agree to the JobConnect Terms of Service, Privacy Policy, and candidate verification standards.</span>
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 disabled:opacity-75"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Creating Account in MySQL...</span>
          </>
        ) : (
          <>
            <span>Create Free Account</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
