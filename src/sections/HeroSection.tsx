import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { socialLinks } from "../data";

type NameLockupStyle = CSSProperties & Record<`--${string}`, string>;

interface HeroSectionProps {
  heroScrollProgress: number;
}

export default function HeroSection({ heroScrollProgress }: HeroSectionProps) {
  const nameLockupStyle: NameLockupStyle = {
    "--hero-scroll-progress": heroScrollProgress.toFixed(3),
  };

  return (
    <section className="hero-layout" id="home">
      <div className="hero-copy-block">
        <p className="eyebrow">Software engineer | based in brisbane</p>
        <p className="hero-statement">
          Bridging the gap between real-world problems and digital solutions.
          Delivering clean, high-impact experiences that users truly value.
        </p>
        <div className="hero-links" aria-label="Profile links">
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
      <div className="name-lockup" aria-label="Lucas Kim portfolio" style={nameLockupStyle}>
        <h1>
          {["LUCAS", "KIM"].map((word, wordIndex) => (
            <span key={wordIndex} className="name-line">
              {word}
            </span>
          ))}
        </h1>
      </div>
    </section>
  );
}
