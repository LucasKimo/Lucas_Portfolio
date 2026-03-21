import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
} from "react";
import {
  ArrowRight,
  ArrowUpRight,
  FileText,
  Github,
  Linkedin,
  type LucideIcon,
} from "lucide-react";
import HoverRollLink from "./HoverRollLink";
import WaveBackground from "./WaveBackground";

const navigationItems = ["Projects", "Archive", "Skills", "About"];
const socialLinks = [
  {
    href: "https://github.com/LucasKimo",
    label: "GitHub",
    icon: Github,
  },
  {
    href: "https://www.linkedin.com/in/lucas-eunsu-kim",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "/resume.pdf",
    label: "Resume",
    icon: FileText,
  },
] satisfies Array<{
  href: string;
  label: string;
  icon: LucideIcon;
}>;

type ContactSwitcherStyle = CSSProperties & Record<`--${string}`, string>;

export default function App() {
  const switcherRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLAnchorElement | null>(null);
  const roundButtonRef = useRef<HTMLAnchorElement | null>(null);
  const [isContactSwapped, setIsContactSwapped] = useState(false);
  const [isArrowBehind, setIsArrowBehind] = useState(false);
  const [contactMetrics, setContactMetrics] = useState({
    pillWidth: 154,
    roundWidth: 64,
    height: 64,
    overlap: 17,
  });

  useLayoutEffect(() => {
    const switcher = switcherRef.current;
    const contact = contactRef.current;
    const roundButton = roundButtonRef.current;

    if (!switcher || !contact || !roundButton) {
      return;
    }

    const updateMetrics = () => {
      const overlapValue = getComputedStyle(switcher)
        .getPropertyValue("--contact-overlap")
        .trim();
      const parsedOverlap = Number.parseFloat(overlapValue);

      setContactMetrics({
        pillWidth: contact.offsetWidth,
        roundWidth: roundButton.offsetWidth,
        height: Math.max(contact.offsetHeight, roundButton.offsetHeight),
        overlap: Number.isFinite(parsedOverlap) ? parsedOverlap : 17,
      });
    };

    updateMetrics();

    const resizeObserver = new ResizeObserver(() => {
      updateMetrics();
    });

    resizeObserver.observe(switcher);
    resizeObserver.observe(contact);
    resizeObserver.observe(roundButton);
    window.addEventListener("resize", updateMetrics);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateMetrics);
    };
  }, []);

  const contactSwitcherStyle: ContactSwitcherStyle = {
    "--contact-pill-width": `${contactMetrics.pillWidth}px`,
    "--round-button-width": `${contactMetrics.roundWidth}px`,
    "--contact-switcher-height": `${contactMetrics.height}px`,
    "--contact-pill-shift": isContactSwapped
      ? `${contactMetrics.roundWidth - contactMetrics.overlap}px`
      : "0px",
    "--round-button-shift": isContactSwapped
      ? `${-(contactMetrics.pillWidth - contactMetrics.overlap)}px`
      : "0px",
  };

  const handleContactBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsContactSwapped(false);
    }
  };

  const handleContactEnter = () => {
    setIsArrowBehind(true);
    setIsContactSwapped(true);
  };

  const handleContactLeave = () => {
    setIsContactSwapped(false);
  };

  const handleRoundButtonTransitionEnd = (propertyName: string) => {
    if (propertyName === "transform" && !isContactSwapped) {
      setIsArrowBehind(false);
    }
  };

  return (
    <main className="portfolio-shell">
      <WaveBackground src="/background.png" />

      <header className="topbar">
        <a className="brand-mark" href="#home" aria-label="Lucas Kim home">
          LUCAS KIM
        </a>
        <nav className="main-nav" aria-label="Primary">
          {navigationItems.map((item) => (
            <HoverRollLink
              key={item}
              text={item}
              href={`#${item.toLowerCase()}`}
              className="main-nav-link"
              enableWipe
            />
          ))}
        </nav>
        <div className="topbar-actions">
          <a className="locale-switch" href="#contact">
            EN
          </a>
          <div
            ref={switcherRef}
            className={`contact-switcher${isContactSwapped ? " is-swapped" : ""}${isArrowBehind ? " is-arrow-behind" : ""}`}
            style={contactSwitcherStyle}
            onPointerEnter={handleContactEnter}
            onPointerLeave={handleContactLeave}
            onFocus={handleContactEnter}
            onBlur={handleContactBlur}
          >
            <a
              ref={contactRef}
              className="contact-pill"
              href="mailto:lucaseunsu.kim@gmail.com"
            >
              Contact Me
            </a>
            <a
              ref={roundButtonRef}
              className="round-button"
              href="mailto:lucaseunsu.kim@gmail.com"
              aria-label="Send an email"
              onTransitionEnd={(event) => {
                handleRoundButtonTransitionEnd(event.propertyName);
              }}
            >
              <ArrowRight aria-hidden="true" size={18} strokeWidth={2} />
            </a>
          </div>
        </div>
      </header>
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
                <Icon
                  className="text-link-icon"
                  aria-hidden="true"
                  size={16}
                  strokeWidth={2}
                />
                <span>{label}</span>
                <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2} />
              </a>
            ))}
          </div>
        </div>
        <div
          className="name-lockup"
          aria-label="Lucas Kim portfolio"
        >
          <h1>
            {["LUCAS", "KIM"].map((word, wordIndex) => (
              <span key={wordIndex} className="name-line">
                {word}
              </span>
            ))}
          </h1>
        </div>
      </section>
      
    </main>
  );
}
