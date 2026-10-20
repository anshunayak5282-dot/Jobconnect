import React from 'react';

export function LoginForm({
  loginRole,
  setLoginRole,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  showLoginPassword,
  setShowLoginPassword,
  rememberMe,
  setRememberMe,
  isSubmitting,
  onSubmit,
  onForgotPassword
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 text-xs">
      <div>
        <label className="block font-bold text-slate-700 mb-1.5">Sign in as:</label>
        <div className="grid grid-cols-3 gap-2">
          <label className="cursor-pointer">
            <input
              type="radio"
              name="loginRole"
              value="seeker"
              checked={loginRole === 'seeker'}
              onChange={(e) => setLoginRole(e.target.value)}
              className="peer sr-only"
            />
            <div className="p-2 rounded-xl border border-slate-200 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 text-center font-bold text-slate-700 peer-checked:text-indigo-700 transition">
              User
            </div>
          </label>
          <label className="cursor-pointer">
            <input
              type="radio"
              name="loginRole"
              value="hr"
              checked={loginRole === 'hr'}
              onChange={(e) => setLoginRole(e.target.value)}
              className="peer sr-only"
            />
            <div className="p-2 rounded-xl border border-slate-200 peer-checked:border-purple-600 peer-checked:bg-purple-50 text-center font-bold text-slate-700 peer-checked:text-purple-700 transition">
              HR Recruiter
            </div>
          </label>
          <label className="cursor-pointer">
            <input
              type="radio"
              name="loginRole"
              value="admin"
              checked={loginRole === 'admin'}
              onChange={(e) => setLoginRole(e.target.value)}
              className="peer sr-only"
            />
            <div className="p-2 rounded-xl border border-slate-200 peer-checked:border-rose-600 peer-checked:bg-rose-50 text-center font-bold text-slate-700 peer-checked:text-rose-700 transition">
              Super Admin
            </div>
          </label>
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block font-bold text-slate-700 mb-1">Email Address</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"></path>
            </svg>
          </span>
          <input
            type="email"
            name="email"
            autoComplete="username email"
            required
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="name@company.com"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="font-bold text-slate-700">Password</label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </span>
          <input
            type={showLoginPassword ? 'text' : 'password'}
            name="password"
            autoComplete="current-password"
            required
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
          <button
            type="button"
            onClick={() => setShowLoginPassword(!showLoginPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />
          <span>Keep me signed in for 30 days</span>
        </label>
      </div>

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
            <span>Authenticating with JWT...</span>
          </>
        ) : (
          <>
            <span>Sign In to JobConnect</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
