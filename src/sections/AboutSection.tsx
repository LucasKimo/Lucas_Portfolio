import { ArrowUpRight } from "lucide-react";
import { socialLinks } from "../data";

export default function AboutSection() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="section-header">
        <p className="section-eyebrow" id="about-title">About</p>
      </div>
      <div className="about-layout">
        <div className="about-copy">
          <h2 className="about-heading">Hey, I'm Lucas.</h2>
          <p>
            I'm a software engineer based in Brisbane, Australia, with a passion for building
            clean, high-impact digital experiences. I bridge the gap between real-world problems
            and elegant technical solutions.
          </p>
          <p>
            Currently studying at QUT and working on projects that range from hackathon wins
            to personal tools I actually use. I care deeply about user experience, code quality,
            and shipping things that matter.
          </p>
          <p>
            Outside of code, I'm into design, music, and exploring what's possible at the
            intersection of technology and creativity.
          </p>
          <div className="about-links">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                className="text-link"
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
              >
                <Icon className="text-link-icon" aria-hidden="true" size={16} strokeWidth={2} />
                <span>{label}</span>
                <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2} />
              </a>
            ))}
          </div>
        </div>
        <div className="about-photo" aria-hidden="true">
          <div className="about-photo-placeholder" />
        </div>
      </div>
    </section>
  );
}
