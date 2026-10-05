import React from 'react';

export const FilterSidebar = ({
  expFilters,
  setExpFilters,
  minSalary,
  setMinSalary,
  onClear
}) => {
  const toggleExp = (exp) => {
    if (expFilters.includes(exp)) {
      setExpFilters(expFilters.filter(e => e !== exp));
    } else {
      setExpFilters([...expFilters, exp]);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm sticky top-28">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          Filter Vacancies
        </h3>
        <button onClick={onClear} className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800">
          Clear
        </button>
      </div>

      {/* Experience */}
      <div className="mt-4">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Experience</label>
        <div className="space-y-1.5 text-xs text-slate-600">
          {[
            { label: 'Fresher (0 - 1 yrs)', val: 'Fresher' },
            { label: 'Junior (1 - 3 yrs)', val: '1-3 Years' },
            { label: 'Mid-Senior (3 - 5 yrs)', val: '3-5 Years' }
          ].map(item => (
            <label key={item.val} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={expFilters.includes(item.val)}
                onChange={() => toggleExp(item.val)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Min Salary */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Min Salary</label>
          <span className="text-xs font-bold text-indigo-600">₹{minSalary} LPA</span>
        </div>
        <input
          type="range"
          min="0"
          max="25"
          step="1"
          value={minSalary}
          onChange={(e) => setMinSalary(Number(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>₹0</span>
          <span>₹12L</span>
          <span>₹25L+</span>
        </div>
      </div>

      {/* Admin Verified Note */}
      <div className="mt-6 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-[11px] text-indigo-900 leading-relaxed">
        <p className="font-bold flex items-center gap-1">
          ✓ Admin Verified Jobs Only
        </p>
        <p className="mt-1 text-slate-600">All listed vacancies are verified by platform super admins.</p>
      </div>
    </div>
  );
};
