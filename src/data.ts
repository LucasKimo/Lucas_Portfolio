import { Github, Linkedin, FileText, type LucideIcon } from "lucide-react";

export const navigationItems = ["Projects", "Milestone", "Skills", "About"] as const;

export const socialLinks = [
  { href: "https://github.com/LucasKimo", label: "GitHub", icon: Github },
  { href: "https://www.linkedin.com/in/lucas-eunsu-kim", label: "LinkedIn", icon: Linkedin },
  { href: "/resume.pdf", label: "Resume", icon: FileText },
] satisfies Array<{ href: string; label: string; icon: LucideIcon }>;

export const featuredProjects = [
  {
    id: "futurescope",
    name: "Future Scope",
    roleTitle: "Team Leader",
    region: "Brisbane",
    scope: "2025 Code Network Hackathon",
    timeline: "2025 - Present",
    summary: "2025 Code Network Winter Hackathon Winner | AI-powered roadmap generator web app",
    bullets: [
      "Led design system governance across multiple product and dev teams",
      "Reduced design-to-dev friction through clear documentation and UX standards",
      "Facilitated stakeholder alignment in complex, multi-team environments",
    ],
    tags: ["JavaScript", "React", "Node.js", "OpenAI API", "PostgreSQL", "AWS"],
    image: "/FS.png",
  },
  {
    id: "bionauts",
    name: "Bionauts",
    roleTitle: "Frontend Developer",
    region: "Brisbane",
    scope: "QUT",
    timeline: "2025",
    summary: "Redesigning internal risk intelligence tools for faster decision-making in regulated workflows.",
    bullets: [
      "Built modular dashboard patterns for analysts and ops teams",
      "Introduced progressive disclosure for dense legal and compliance data",
      "Improved workflow completion speed through guided interaction architecture",
    ],
    tags: ["JavaScript", "React", "Bootstrap", "Node.js"],
    image: "/bionauts.png",
  },
  {
    id: "planary",
    name: "Planary",
    roleTitle: "Full-stack Developer",
    region: "Brisbane",
    scope: "Personal Project",
    timeline: "2025 - Present",
    summary: "Shaping conversational-care products that help clinical teams monitor patients at scale.",
    bullets: [
      "Designed triage experiences balancing clarity, urgency, and trust",
      "Created reusable voice-assistant interaction patterns for care journeys",
      "Aligned product, data, and clinical stakeholders around measurable UX outcomes",
    ],
    tags: ["HEALTHTECH", "VOICE", "PATIENTCARE"],
    image: "/FS.png",
  },
] as const;

export const archiveProjects = [
  { year: "Present", title: "Planary", location: "Personal", details: ["React", "TypeScript", "PostgreSQL"], link: null },
  { year: "2025", title: "Bachelor of IT", location: "Queensland University of Technology", details: ["Computer Science", "GPA: 5.5"], link: "https://github.com/LucasKimo" },
  { year: "2025", title: "Bionauts", location: "Queensland University of Technology", details: ["React", "Bootstrap", "Node.js"], link: "https://github.com/LucasKimo" },
  { year: "2025", title: "Future Scope", location: "Code Network Hackathon, QUT", details: ["JavaScript", "React", "Node.js", "AWS", "OpenAI API"], link: "https://github.com/LucasKimo" },
  { year: "2024", title: "Diploma in IT", location: "Queensland University of Technology", details: ["Python", "C#", "App Development", "SQL"], link: "https://github.com/LucasKimo" },
] as const;

export const skillCategories = [
  { label: "Languages", skills: ["JavaScript", "TypeScript", "Python", "HTML", "CSS", "SQL"] },
  { label: "Frameworks & Libraries", skills: ["React", "Node.js", "Express", "Bootstrap", "Tailwind CSS"] },
  { label: "Tools & Platforms", skills: ["Git", "GitHub", "Figma", "VS Code", "AWS", "Vercel"] },
  { label: "Databases", skills: ["PostgreSQL", "MySQL", "Firebase", "SQLite"] },
] as const;
