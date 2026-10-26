import { demoAnkitProfile } from '../data/initialData';

// Calculates candidate profile completeness (0-100%)
export const calculateProfileCompleteness = (p) => {
  if (!p) return 0;
  let score = 0;
  if (p.name && String(p.name).trim()) score += 20;
  if (p.email && String(p.email).trim()) score += 20;
  if (p.phone && String(p.phone).trim()) score += 15;
  if (p.location && String(p.location).trim()) score += 15;
  if (p.title && String(p.title).trim()) score += 10;
  if (p.about && String(p.about).trim()) score += 10;
  const hasSkills = Array.isArray(p.skills)
    ? p.skills.length > 0
    : Boolean(p.skills && String(p.skills).trim());
  if (hasSkills) score += 10;
  return Math.min(score, 100);
};

// Returns user profile data, prioritizing database fields and falling back gracefully
export const getProfileForUser = (user) => {
  if (!user || !user.email) return null;
  const isAnkit = (user.email || '').toLowerCase() === 'ankit.dev@example.com';
  const defaults = isAnkit ? demoAnkitProfile : {};

  const skills = user.skills
    ? (Array.isArray(user.skills) ? user.skills : String(user.skills).split(',').map((s) => s.trim()).filter(Boolean))
    : (defaults.skills || []);

  const education = user.education !== undefined && user.education !== null
    ? (Array.isArray(user.education) ? user.education : (typeof user.education === 'string' ? JSON.parse(user.education) : []))
    : (defaults.education || []);

  const experience = user.experience !== undefined && user.experience !== null
    ? (Array.isArray(user.experience) ? user.experience : (typeof user.experience === 'string' ? JSON.parse(user.experience) : []))
    : (defaults.experience || []);

  const projects = user.projects !== undefined && user.projects !== null
    ? (Array.isArray(user.projects) ? user.projects : (typeof user.projects === 'string' ? JSON.parse(user.projects) : []))
    : (defaults.projects || []);

  const resume = user.resume_name || user.resumeName || defaults.resumeName || null;

  return {
    name: user.name || defaults.name || (user.role === 'hr' ? 'HR Recruiter' : 'Candidate'),
    email: user.email,
    phone: user.phone !== null && user.phone !== undefined ? user.phone : (defaults.phone || ''),
    company: user.company || user.company_name || defaults.company || '',
    location: user.location !== null && user.location !== undefined ? user.location : (defaults.location || ''),
    title: user.title || defaults.title || (user.role === 'hr' ? 'HR Recruiter' : 'Candidate'),
    about: user.about !== null && user.about !== undefined ? user.about : (defaults.about || ''),
    skills,
    education,
    experience,
    projects,
    resumeName: resume,
    resumeUploadDate: resume ? 'Active' : null
  };
};
