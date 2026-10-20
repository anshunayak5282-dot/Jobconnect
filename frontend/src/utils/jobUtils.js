// Normalizes job ID by stripping 'job-' prefix if present
export const normalizeJobId = (id) => {
  if (id === null || id === undefined) return '';
  return String(id).replace('job-', '');
};

// Checks if two job IDs match, accounting for string vs number and 'job-' prefix
export const matchesJobId = (id1, id2) => {
  if (id1 === id2) return true;
  return normalizeJobId(id1) === normalizeJobId(id2);
};

// Formats salary display (e.g. ₹4–8 LPA)
export const formatSalaryRange = (min, max) => {
  if (!min && !max) return 'Competitive';
  return `₹${min}–${max} LPA`;
};
