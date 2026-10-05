export const initialData = {
  currentUserRole: 'seeker', // 'seeker', 'hr', 'admin'
  
  profile: {
    name: "Ankit Kumar",
    email: "ankit.dev@example.com",
    phone: "+91 98765 43210",
    location: "Ranchi, Jharkhand",
    about: "Proactive Full-Stack Software Developer passionate about high-performance web applications with React, Node.js, and MongoDB. Solved 350+ DSA problems with strong fundamentals in REST APIs and system design.",
    title: "Full Stack MERN Developer",
    experienceYears: "Fresher (6 mos internship)",
    skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "MongoDB", "Git", "Tailwind CSS"],
    education: [
      { degree: "B.Tech in Computer Science & Engineering", institution: "Birla Institute of Technology (BIT)", year: 2025 },
      { degree: "Senior Secondary (XII - Science)", institution: "Delhi Public School, Ranchi", year: 2021 }
    ],
    experience: [
      {
        company: "TechNova Labs",
        position: "Full Stack Intern",
        startDate: "Jan 2025",
        endDate: "Present",
        description: "Built scalable REST API microservices using Node.js and MongoDB. Designed responsive dashboard components in React."
      }
    ],
    projects: [
      {
        title: "JobConnect Recruitment Portal",
        description: "Enterprise candidate matching system with JWT authentication, role guards, and live application pipeline.",
        technologies: ["React", "Node.js", "Express", "MongoDB"],
        link: "https://github.com/example/jobconnect"
      },
      {
        title: "DevMetrics Cloud Dashboard",
        description: "Real-time telemetry and monitoring tool for microservices with WebSocket live charts.",
        technologies: ["React", "Tailwind", "Node.js"],
        link: "https://github.com/example/devmetrics"
      }
    ],
    resumeName: "Ankit_Kumar_FullStack_Resume.pdf",
    resumeUploadDate: "Oct 2026"
  },

  jobs: [
    {
      id: "job-1",
      title: "Junior Web Developer",
      company: "ABC Technologies",
      location: "Ranchi",
      salaryMin: 3,
      salaryMax: 5,
      experience: "Fresher",
      jobType: "Full Time",
      skills: ["HTML", "CSS", "JavaScript", "React"],
      deadline: "2026-11-15",
      status: "Approved",
      postedBy: "HR - Priya Sharma",
      description: "We are seeking a motivated Junior Web Developer in Ranchi to create interactive web interfaces, implement responsive designs, and integrate backend REST APIs with React.",
      createdAt: "2026-10-01"
    },
    {
      id: "job-2",
      title: "Full Stack MERN Engineer",
      company: "InnovateX Solutions",
      location: "Bengaluru",
      salaryMin: 8,
      salaryMax: 14,
      experience: "1-3 Years",
      jobType: "Full Time",
      skills: ["React", "Node.js", "MongoDB", "Express", "TypeScript"],
      deadline: "2026-11-20",
      status: "Approved",
      postedBy: "HR - Rohit Verma",
      description: "Join our core product team building high-scale SaaS products. Deep knowledge of Mongoose schemas, token-based authentication, and state management required.",
      createdAt: "2026-10-02"
    },
    {
      id: "job-3",
      title: "Frontend React Developer (Remote)",
      company: "CloudScale India",
      location: "Remote",
      salaryMin: 6,
      salaryMax: 10,
      experience: "Fresher",
      jobType: "Full Time",
      skills: ["React", "Tailwind CSS", "JavaScript", "Redux"],
      deadline: "2026-11-25",
      status: "Approved",
      postedBy: "HR - Priya Sharma",
      description: "Work remotely on modern UI design systems. Craft pixel-perfect micro-interactions and integrate GraphQL and REST endpoints.",
      createdAt: "2026-10-03"
    },
    {
      id: "job-4",
      title: "Backend Node.js & Database Specialist",
      company: "DataMatrix Corp",
      location: "Hyderabad",
      salaryMin: 12,
      salaryMax: 18,
      experience: "3-5 Years",
      jobType: "Full Time",
      skills: ["Node.js", "MongoDB", "Express", "Docker", "AWS"],
      deadline: "2026-12-01",
      status: "Approved",
      postedBy: "HR - Amit Sen",
      description: "Lead the backend architecture, optimize MongoDB queries and aggregation pipelines, and maintain high throughput APIs.",
      createdAt: "2026-10-04"
    },
    {
      id: "job-5",
      title: "Web Development Intern",
      company: "NexGen Labs",
      location: "Ranchi",
      salaryMin: 2,
      salaryMax: 3.5,
      experience: "Fresher",
      jobType: "Internship",
      skills: ["HTML", "CSS", "JavaScript"],
      deadline: "2026-10-30",
      status: "Approved",
      postedBy: "HR - Priya Sharma",
      description: "Hands-on internship for college graduates or final-year students looking to gain production experience in frontend web technologies.",
      createdAt: "2026-10-04"
    },
    {
      id: "job-6",
      title: "DevOps & Cloud Engineer",
      company: "ABC Technologies",
      location: "Bengaluru",
      salaryMin: 10,
      salaryMax: 16,
      experience: "1-3 Years",
      jobType: "Full Time",
      skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
      deadline: "2026-11-10",
      status: "Pending", // Needs Admin Approval!
      postedBy: "HR - Priya Sharma",
      description: "Build robust continuous deployment pipelines, automate infrastructure as code, and monitor production reliability.",
      createdAt: "2026-10-05"
    },
    {
      id: "job-7",
      title: "UI/UX & Product Design Specialist",
      company: "PixelCraft Studios",
      location: "Pune",
      salaryMin: 5,
      salaryMax: 9,
      experience: "1-3 Years",
      jobType: "Contract",
      skills: ["Figma", "HTML", "CSS", "Design Systems"],
      deadline: "2026-11-05",
      status: "Pending", // Needs Admin Approval!
      postedBy: "HR - Neha Kapoor",
      description: "Design intuitive user flows and high-fidelity mockups for enterprise web applications.",
      createdAt: "2026-10-05"
    }
  ],

  applications: [
    {
      id: "app-101",
      jobId: "job-1",
      applicantName: "Ankit Kumar",
      applicantEmail: "ankit.dev@example.com",
      applicantPhone: "+91 98765 43210",
      applicantLocation: "Ranchi",
      resumeUrl: "Ankit_Kumar_FullStack_Resume.pdf",
      coverLetter: "I am thrilled to apply for the Junior Web Developer role at ABC Technologies. With strong skills in React, JavaScript, and Node.js, and being based locally in Ranchi, I can immediately contribute to your client delivery roadmap.",
      status: "Under Review",
      appliedAt: "2026-10-03"
    },
    {
      id: "app-102",
      jobId: "job-3",
      applicantName: "Ankit Kumar",
      applicantEmail: "ankit.dev@example.com",
      applicantPhone: "+91 98765 43210",
      applicantLocation: "Ranchi",
      resumeUrl: "Ankit_Kumar_FullStack_Resume.pdf",
      coverLetter: "I have built multiple responsive web projects with Tailwind CSS and React. I am excited to work remotely with CloudScale India.",
      status: "Applied",
      appliedAt: "2026-10-04"
    },
    {
      id: "app-103",
      jobId: "job-1",
      applicantName: "Sneha Roy",
      applicantEmail: "sneha.roy@example.com",
      applicantPhone: "+91 94321 88990",
      applicantLocation: "Ranchi",
      resumeUrl: "Sneha_Roy_Frontend_Resume.pdf",
      coverLetter: "Passionate developer with 1 year experience building clean UI interfaces and responsive components.",
      status: "Shortlisted",
      appliedAt: "2026-10-02"
    },
    {
      id: "app-104",
      jobId: "job-2",
      applicantName: "Rahul Mehta",
      applicantEmail: "rahul.m@example.com",
      applicantPhone: "+91 91234 56789",
      applicantLocation: "Bengaluru",
      resumeUrl: "Rahul_Mehta_MERN.pdf",
      coverLetter: "2 years hands-on experience in MERN stack microservices, caching, and database indexing.",
      status: "Interview",
      appliedAt: "2026-10-01"
    }
  ],

  savedJobIds: ["job-2", "job-5"],

  users: [
    { id: "u-1", name: "Ankit Kumar", email: "ankit.dev@example.com", role: "user", status: "Active", joined: "2026-09-15" },
    { id: "u-2", name: "Sneha Roy", email: "sneha.roy@example.com", role: "user", status: "Active", joined: "2026-09-20" },
    { id: "u-3", name: "Rahul Mehta", email: "rahul.m@example.com", role: "user", status: "Active", joined: "2026-09-22" },
    { id: "u-4", name: "Priya Sharma", email: "priya.hr@abctech.com", role: "hr", company: "ABC Technologies", status: "Active", joined: "2026-08-10" },
    { id: "u-5", name: "Rohit Verma", email: "rohit@innovatex.io", role: "hr", company: "InnovateX Solutions", status: "Active", joined: "2026-08-14" },
    { id: "u-6", name: "Super Administrator", email: "admin@jobconnect.io", role: "admin", status: "Active", joined: "2026-01-01" }
  ],

  notifications: [
    { id: "n-1", title: "New Job Match", text: "ABC Technologies posted 'Junior Web Developer' in Ranchi.", time: "10 mins ago", type: "job" },
    { id: "n-2", title: "Application Under Review", text: "ABC Technologies updated your application status to Under Review.", time: "2 hrs ago", type: "status" },
    { id: "n-3", title: "Job Awaiting Approval", text: "DevOps & Cloud Engineer submitted by Priya Sharma.", time: "Yesterday", type: "admin" }
  ]
};
