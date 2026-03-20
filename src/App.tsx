import { ArrowLeft, BriefcaseBusiness, FileText, Github, Linkedin } from "lucide-react";
import { useState } from "react";

type LinkItem = {
  href: string;
  label: string;
  icon: typeof FileText;
};

const primaryLinks: LinkItem[] = [
  {
    href: "../public/resume.pdf",
    label: "Resume",
    icon: FileText,
  },
  {
    href: "https://github.com/LucasKimo",
    label: "GitHub",
    icon: Github
  },
  {
    href: "https://www.linkedin.com/in/lucas-eunsu-kim",
    label: "LinkedIn",
    icon: Linkedin
  }
];

const petals = Array.from({ length: 18 }, (_, index) => index);
const fireflies = Array.from({ length: 12 }, (_, index) => index);

export default function App() {
  const [showProjectPage, setShowProjectPage] = useState(false);

  return (
    <main className="page-shell">
      <div className="firefly-field" aria-hidden="true">
        {fireflies.map((firefly) => (
          <span
            key={firefly}
            className={`firefly firefly-${firefly + 1}`}
          />
        ))}
      </div>

      <div className="petal-field" aria-hidden="true">
        {petals.map((petal) => (
          <span
            key={petal}
            className={`petal petal-${petal + 1}`}
          />
        ))}
      </div>

      {showProjectPage ? (
        <section className="project-page">
          <h1>Project</h1>
          <button
            className="profile-link profile-button"
            type="button"
            onClick={() => setShowProjectPage(false)}
          >
            <ArrowLeft aria-hidden="true" size={18} strokeWidth={1.75} />
            <span>Home</span>
          </button>
        </section>
      ) : (
        <section className="hero-card">
          <h1>Lucas Kim</h1>
          <p className="subtitle">
            # Curious Software Engineer
          </p>

          <nav className="link-row" aria-label="Profile links">
            {primaryLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                className="profile-link"
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
              >
                <Icon aria-hidden="true" size={18} strokeWidth={1.75} />
                <span>{label}</span>
              </a>
            ))}

            <button
              className="profile-link profile-button"
              type="button"
              onClick={() => setShowProjectPage(true)}
            >
              <BriefcaseBusiness aria-hidden="true" size={18} strokeWidth={1.75} />
              <span>Project</span>
            </button>
          </nav>
        </section>
      )}
    </main>
  );
}
