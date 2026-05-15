import { Github, Linkedin, FileText, type LucideIcon } from "lucide-react";

export const navigationItems = ["Projects", "Milestone", "Skills", "About"] as const;

export const socialLinks = [
  { href: "https://github.com/LucasKimo", label: "GitHub", icon: Github },
  { href: "https://www.linkedin.com/in/lucas-eunsu-kim", label: "LinkedIn", icon: Linkedin },
  { href: "/EunsuKim_resume.pdf", label: "Resume", icon: FileText },
] satisfies Array<{ href: string; label: string; icon: LucideIcon }>;

export const featuredProjects = [
  {
    id: "futurescope",
    name: "Future Scope",
    roleTitle: "Full-stack Developer",
    region: "Brisbane",
    scope: "2025 Code Network Winter Hackathon",
    timeline: "2025 - Present",
    summary: "Code Network Hackathon Winner | AI-powered roadmap generator web app",
    bullets: [
      "An interactive AI-powered (OpenAI API) web application",
      "Enables users to reflect on their skills and experience, and identify future steps to achieve their goals",
      "Motivates users to achieve their goals through gamification features",
    ],
    tags: ["JavaScript", "React.js", "Node.js", "OpenAI API", "PostgreSQL", "AWS"],
    image: "/FS.png",
    link: null,
  },
  {
    id: "power-platform-library",
    name: "Library System",
    roleTitle: "Power Platform Consultant",
    region: "Brisbane",
    scope: "DynamX Institute Internship",
    timeline: "2026",
    summary: "Power Platform Library System | Enterprise library management built on Microsoft Power Platform",
    bullets: [
      "Built a full library management system using Power Apps as the primary interface for staff and patrons",
      "Automated book loan, return, and overdue notification workflows with Power Automate",
      "Managed structured library data and relationships using Microsoft Dataverse",
      "Delivered a public-facing catalogue and reservation portal via Power Pages",
    ],
    tags: ["Power Apps", "Power Automate", "Dataverse", "Power Pages"],
    image: "/Power.png",
    link: "https://github.com/LucasKimo/PowerPlatform-LibrarySystem",
  },
  {
    id: "bionauts",
    name: "Bionauts",
    roleTitle: "Frontend Developer",
    region: "Brisbane",
    scope: "QUT",
    timeline: "2025",
    summary: "Bionauts | Primary and Secondary Nature Education Institute",
    bullets: [
      "Users can book nature adventures and access the resources they need",
      "Users can connect and communicate with each other through Social Network feature",
      "Authorised users can post adventures",
      "Users can view up‑to‑date announcements, stories, and event recaps from Bionauts. "
    ],
    tags: ["JavaScript", "React.js", "Bootstrap", "Node.js"],
    image: "/bionauts.png",
    link: null,
  },
] as const;

export const milestones = [
  { year: "2026", title: "Power Platform Fundamentals", category: "Certification", organization: "Microsoft", details: ["Power Platform", "Power Apps", "Power Automate", "Power Pages", "Dataverse", "Power BI"], link: "https://learn.microsoft.com/api/credentials/share/en-us/15097636/2FB9F4B39ABE15DB?sharingId=B1ABECB15B13FB17" },
  { year: "2025", title: "Bachelor of IT", category: "Education", organization: "Queensland University of Technology", details: ["Computer Science Major"], link: "/Bachelor.pdf" },
  { year: "2025", title: "Front-end Developer", category: "Experience", organization: "Bionauts, QUT", details: ["JavaScript", "React.js", "Bootstrap", "Node.js"], link: null },
  { year: "2025", title: "Future Scope", category: "Award", organization: "Code Network Hackathon, QUT", details: ["JavaScript", "React.js", "Node.js", "AWS", "Docker", "OpenAI API"], link: "https://www.qut.edu.au/about/faculty-of-science/insights/hacking-ambition-into-action-code-networks-2025-winter-hackathon" },
  { year: "2025", title: "Azure Data Fundamentals", category: "Certification", organization: "Microsoft", details: ["Azure", "Databricks", "Power BI", "Cloud", "Cosmos DB", "SQL"], link: "https://www.credly.com/badges/e33a9d27-e67a-4af0-bcb2-f4b543b2102d" },
  { year: "2025", title: "Azure AI Fundamentals", category: "Certification", organization: "Microsoft", details: ["Azure", "Bot Service", "Machine Learning", "Cognitive Services", "AI"], link: "https://www.credly.com/badges/dbceeab4-7a7e-470c-9881-b9b5a725b47a" },
  { year: "2024", title: "Executive Deans' Award", category: "Award", organization: "Queensland University of Technology", details: ["QUT Executive Deans' Commendation for Academic Excellence"], link: "/Executive_Deans.pdf" },
  { year: "2024", title: "Diploma in IT", category: "Education", organization: "Queensland University of Technology", details: ["Python", "C#", "App Development", "SQL"], link: "/Diploma.pdf" },
] as const;

export const skillCategories = [
  { label: "Programming Languages", skills: ["JavaScript", "TypeScript", "Java", "Python", "C", "C#", "HTML", "CSS", "SQL"] },
  { label: "Frameworks & Libraries", skills: ["React.js", "Bootstrap", "Vite", "Node.js", "Express.js", "React Native", "Swift", "Tailwind CSS", "Sklearn", "Keras", "TensorFlow", "Pandas", "NumPy", "Matplotlib", "Seaborn"] },
  { label: "Tools & Platforms", skills: ["AWS", "Azure", "Linux", "Microsoft Power Platform", "Vercel", "Docker", "Vite", "Git", "GitHub", "API", "VS Code", "Intellij", "Google Colab", "Jupyter Notebook", "Ubuntu", "Claude AI", "CRM"] },
  { label: "Databases", skills: ["PostgreSQL", "MySQL", "SQLite", "Azure Cosmos DB", "Maria DB", "Microsoft Dataverse"] },
] as const;
