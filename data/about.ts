export interface WorkExperience {
  company: string
  location: string
  role: string
  period: string
  highlights: string[]
  tech: string[]
}

export interface Resume {
  name: string
  title: string
  email: string
  linkedin: string
  github: string
  languages: string[]
  tools: string[]
  versionControl: string[]
  currentlyLearning: string[]
  projectManagement: string[]
  communication: string[]
  experience: WorkExperience[]
  education: { institution: string; degree: string; location: string }[]
}

export const RESUME: Resume = {
  name: "Mbi Enow Leonard Appelgryn",
  title: "Software Engineer",
  email: "mbiapplegryn@gmail.com",
  linkedin: "linkedin.com/in/leonard-appelgryn",
  github: "github.com/kaptaincs3",
  languages: ["JavaScript / TypeScript", "SQL", "HTML5", "CSS3"],
  tools: ["React", "Next.js", "React Native", "Redux", "Tailwind CSS", "AWS", "Zustand", "Expo", "React Query", "Prisma", "PostgreSQL", "Zod", "Redis"],
  versionControl: ["Git"],
  currentlyLearning: ["Go", "AWS"],
  projectManagement: ["ClickUp", "Trello", "Notion"],
  communication: ["Slack"],
  experience: [
    {
      company: "Global Bush Travel",
      location: "Douala, Cameroon",
      role: "Full Stack Engineer",
      period: "Nov 2025 - Present",
      highlights: [
        "Engineered 8 end-to-end booking modules (flights, hotels, transfers, car rentals, airport lounge, e-SIM, insurance, visa) on a production Next.js 16 platform, scaling the agency's digital services to international markets",
        "Architected a unified, secure payment system integrating MTN Mobile Money and Orange Money with server-side price verification across all modules, eliminating client-side price tampering",
        "Designed a sessionless pre-payment booking pattern for 4 modules (e-SIM, insurance, visa, airport lounge), where booking records and prices are locked server-side before payment is processed",
        "Implemented CSRF double-submit cookie protection, Upstash rate limiting, and reCAPTCHA v3 on sensitive endpoints, alongside a standardized payment error system with 14 error codes and EN/FR translations",
        "Delivered full EN/FR internationalization (next-intl) across 80+ API routes and 50+ component libraries, with Zustand global state management and React Query for server-state caching",
      ],
      tech: ["TypeScript", "Next.js", "Tailwind CSS", "Zustand", "React Query", "Prisma", "PostgreSQL", "Redis", "Zod"],
    },
    {
      company: "OneMarket",
      location: "Douala, Cameroon",
      role: "Mobile Dev Intern",
      period: "Aug 2025 - Oct 2025",
      highlights: [
        "Implemented a user feedback/chat system, increasing user engagement by 20%",
        "Fixed UI and crash bugs, reducing crash reports by 10%",
        "Streamlined admin-user feedback loop, cutting average response time by 5%",
      ],
      tech: ["JavaScript", "React", "React Native", "Redux", "Expo"],
    },
    {
      company: "Tech Chantier",
      location: "Buea, Cameroon",
      role: "FrontEnd Engineer",
      period: "Oct 2023 - Feb 2025",
      highlights: [
        "Enhanced and deployed a POS web app, boosting sales by 25%, user satisfaction by 30%, and reducing operational costs by 15%",
        "Optimized transactions by 50% and cut bug reports by 60% through rigorous testing",
        "Executed a receipt module, reducing checkout time by 40% and improving transaction accuracy by 25%",
        "Developed a digital platform connecting donors with those in need, increasing successful donations by 30% and donor-recipient connections by 50%",
      ],
      tech: ["JavaScript", "TypeScript", "React", "Next.js", "React Native", "Redux", "Zustand", "Expo", "Tailwind CSS"],
    },
    {
      company: "ProGuide",
      location: "Buea, Cameroon",
      role: "FrontEnd Lead",
      period: "May 2023 - Jan 2025",
      highlights: [
        "Led frontend development, integrating gamified lessons and AI-driven recommendations, resulting in a 60% increase in student engagement and a 35% boost in course completion rates",
        "Applied AI-powered insights for personalized assessments, leading to a 50% reduction in grading time and a 30% improvement in student performance",
        "Developed a Progressive Web App (PWA) for offline access, cutting load times by 50%, reducing bounce rates by 30%, and increasing user retention by 45%",
      ],
      tech: ["TypeScript", "Next.js", "Tailwind CSS", "Zod", "Redux"],
    },
  ],
  education: [
    {
      institution: "University of Buea",
      location: "Buea, Cameroon",
      degree: "B.Eng Computer Engineering",
    },
  ],
}
