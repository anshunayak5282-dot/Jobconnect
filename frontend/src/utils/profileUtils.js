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

// Returns user profile data, checking demo defaults and stored custom profiles
export const getProfileForUser = (user) => {
  if (!user || !user.email) return null;
  if (user.email === 'ankit.dev@example.com') {
    return demoAnkitProfile;
  }

  try {
    const storedMap = JSON.parse(localStorage.getItem('jobconnect_user_profiles') || '{}');
    if (storedMap[user.email]) {
      return storedMap[user.email];
    }
  } catch (e) {}

  return {
    name: user.name || (user.role === 'hr' ? 'HR Recruiter' : 'Candidate'),
    email: user.email,
    phone: user.phone || '',
    company: user.company || user.company_name || '',
    location: user.location || '',
    title: user.title || (user.role === 'hr' ? 'HR Recruiter' : 'Candidate'),
    about: user.about || '',
    skills: Array.isArray(user.skills)
      ? user.skills
      : user.skills
      ? user.skills.split(',').map((s) => s.trim())
      : [],
    education: user.education || [],
    experience: user.experience || [],
    projects: user.projects || [],
    resumeName: user.resume_name || null,
    resumeUploadDate: user.resume_name ? 'Active' : null
  };
};
