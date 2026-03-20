import { ArrowUpRight } from "lucide-react";

const navigationItems = ["Projects", "Archive", "About", "Contact"];

const socialLinks = [
  {
    href: "https://github.com/LucasKimo",
    label: "GitHub",
  },
  {
    href: "https://www.linkedin.com/in/lucas-eunsu-kim",
    label: "LinkedIn",
  },
  {
    href: "/resume.pdf",
    label: "Resume",
  },
];

export default function App() {
  return (
    <main className="portfolio-shell">
      <div className="background-orb orb-left" aria-hidden="true" />
      <div className="background-orb orb-top" aria-hidden="true" />
      <div className="background-orb orb-right" aria-hidden="true" />
      <div className="background-grid" aria-hidden="true" />

      <header className="topbar">
        <a className="brand-mark" href="#home" aria-label="Lucas Kim home">
          LUCAS KIM
        </a>

        <nav className="main-nav" aria-label="Primary">
          {navigationItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}>
              {item}
            </a>
          ))}
        </nav>

        <div className="topbar-actions">
          <a className="locale-switch" href="#contact">
            EN
          </a>
          <a className="contact-pill" href="mailto:lucaseunsu.kim@gmail.com">
            Contact Me
          </a>
          <a
            className="round-button"
            href="mailto:lucaseunsu.kim@gmail.com"
            aria-label="Send an email"
          >
            <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2} />
          </a>
        </div>
      </header>

      <section className="hero-layout" id="home">
        <div className="hero-copy-block">
          <p className="eyebrow">Software engineer based in Brisbane</p>
          <p className="hero-statement">
            Transforming ideas into polished digital products. Building calm,
            reliable experiences that people actually enjoy using.
          </p>
          <div className="hero-links" aria-label="Profile links">
            {socialLinks.map(({ href, label }) => (
              <a
                key={label}
                className="text-link"
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
              >
                <span>{label}</span>
                <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2} />
              </a>
            ))}
          </div>
        </div>

        <div className="name-lockup" aria-label="Lucas Kim portfolio">
          <h1>
            <span className="name-line">LUCAS</span>
            <span className="name-line">KIM</span>
          </h1>
        </div>
      </section>
    </main>
  );
}
