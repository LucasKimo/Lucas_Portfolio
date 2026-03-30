import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
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
const featuredProjects = [
  {
    id: "futurescope",
    name: "Future Scope",
    roleTitle: "Team Leader",
    region: "Brisbane",
    scope: "2025 Code Network Hackathon",
    timeline: "2025 - Present",
    summary:
      "2025 Code Network Winter Hackathon Winner | AI-powered roadmap generator web app",
    bullets: [
      "Led design system governance across multiple product and dev teams",
      "Reduced design-to-dev friction through clear documentation and UX standards",
      "Facilitated stakeholder alignment in complex, multi-team environments",
    ],
    tags: ["JavaScript", "React", "Node.js", "OpenAI API", "PostgreSQL", "AWS"],
    image: "/FS.png"
  },
  {
    id: "bionauts",
    name: "Bionauts",
    roleTitle: "Frontend Developer",
    region: "Brisbane",
    scope: "QUT",
    timeline: "2025",
    summary:
      "Redesigning internal risk intelligence tools for faster decision-making in regulated workflows.",
    bullets: [
      "Built modular dashboard patterns for analysts and ops teams",
      "Introduced progressive disclosure for dense legal and compliance data",
      "Improved workflow completion speed through guided interaction architecture",
    ],
    tags: ["JavaScript", "React", "Bootstrap", "Node.js"],
    image: '/FS.png'
  },
  {
    id: "planary",
    name: "Planary",
    roleTitle: "Full-stack Developer",
    region: "Brisbane",
    scope: "Personal Project",
    timeline: "2025 - Present",
    summary:
      "Shaping conversational-care products that help clinical teams monitor patients at scale.",
    bullets: [
      "Designed triage experiences balancing clarity, urgency, and trust",
      "Created reusable voice-assistant interaction patterns for care journeys",
      "Aligned product, data, and clinical stakeholders around measurable UX outcomes",
    ],
    tags: ["HEALTHTECH", "VOICE", "PATIENTCARE"],
    image: "/FS.png"
  },
] as const;

type ContactSwitcherStyle = CSSProperties & Record<`--${string}`, string>;
type NameLockupStyle = CSSProperties & Record<`--${string}`, string>;

export default function App() {
  const smoothScrollViewportRef = useRef<HTMLDivElement | null>(null);
  const smoothScrollShellRef = useRef<HTMLElement | null>(null);
  const smoothScrollContentRef = useRef<HTMLDivElement | null>(null);
  const switcherRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLAnchorElement | null>(null);
  const roundButtonRef = useRef<HTMLAnchorElement | null>(null);
  const heroProgressCurrentRef = useRef(0);
  const heroProgressTargetRef = useRef(0);
  const heroProgressVelocityRef = useRef(0);
  const heroProgressLastTimeRef = useRef<number | null>(null);
  const smoothScrollCurrentRef = useRef(0);
  const smoothScrollTargetRef = useRef(0);
  const smoothScrollVelocityRef = useRef(0);
  const smoothScrollLastTimeRef = useRef<number | null>(null);
  const headerLastScrollYRef = useRef(0);
  const [heroScrollProgress, setHeroScrollProgress] = useState(0);
  const [isContactSwapped, setIsContactSwapped] = useState(false);
  const [isArrowBehind, setIsArrowBehind] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [contactMetrics, setContactMetrics] = useState({
    pillWidth: 154,
    roundWidth: 64,
    height: 64,
    overlap: 17,
  });
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

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

  useEffect(() => {
    const viewport = smoothScrollViewportRef.current;
    const shell = smoothScrollShellRef.current;
    const content = smoothScrollContentRef.current;

    if (!viewport || !shell || !content) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (mediaQuery.matches) {
      document.body.style.minHeight = "";
      content.style.transform = "";
      return;
    }

    let frameId = 0;
    const stiffness = 92;
    const damping = 22;

    const updateBodyHeight = () => {
      document.body.style.minHeight = `${shell.offsetHeight}px`;
    };

    const animateViewport = (timestamp: number) => {
      frameId = 0;

      const lastTimestamp = smoothScrollLastTimeRef.current ?? timestamp;
      const deltaTime = Math.min((timestamp - lastTimestamp) / 1000, 0.064);
      smoothScrollLastTimeRef.current = timestamp;

      const displacement =
        smoothScrollTargetRef.current - smoothScrollCurrentRef.current;
      const springForce = displacement * stiffness;
      const dampingForce = -smoothScrollVelocityRef.current * damping;
      const acceleration = springForce + dampingForce;

      smoothScrollVelocityRef.current += acceleration * deltaTime;
      smoothScrollCurrentRef.current +=
        smoothScrollVelocityRef.current * deltaTime;

      const isSettled =
        Math.abs(
          smoothScrollTargetRef.current - smoothScrollCurrentRef.current
        ) < 0.1 && Math.abs(smoothScrollVelocityRef.current) < 0.1;

      if (isSettled) {
        smoothScrollCurrentRef.current = smoothScrollTargetRef.current;
        smoothScrollVelocityRef.current = 0;
        smoothScrollLastTimeRef.current = null;
      }

      content.style.transform = `translate3d(0, ${-smoothScrollCurrentRef.current}px, 0)`;

      if (!isSettled) {
        frameId = window.requestAnimationFrame(animateViewport);
      }
    };

    const syncViewportTarget = () => {
      smoothScrollTargetRef.current = window.scrollY;

      if (frameId === 0) {
        smoothScrollLastTimeRef.current = null;
        frameId = window.requestAnimationFrame(animateViewport);
      }
    };

    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        if (frameId !== 0) {
          window.cancelAnimationFrame(frameId);
          frameId = 0;
        }

        smoothScrollCurrentRef.current = window.scrollY;
        smoothScrollTargetRef.current = window.scrollY;
        smoothScrollVelocityRef.current = 0;
        smoothScrollLastTimeRef.current = null;
        content.style.transform = "";
        document.body.style.minHeight = "";
        return;
      }

      updateBodyHeight();
      smoothScrollCurrentRef.current = window.scrollY;
      smoothScrollTargetRef.current = window.scrollY;
      content.style.transform = `translate3d(0, ${-window.scrollY}px, 0)`;
      syncViewportTarget();
    };

    updateBodyHeight();
    smoothScrollCurrentRef.current = window.scrollY;
    smoothScrollTargetRef.current = window.scrollY;
    content.style.transform = `translate3d(0, ${-window.scrollY}px, 0)`;

    const resizeObserver = new ResizeObserver(() => {
      updateBodyHeight();
    });

    resizeObserver.observe(shell);
    window.addEventListener("scroll", syncViewportTarget, { passive: true });
    window.addEventListener("resize", updateBodyHeight);
    mediaQuery.addEventListener("change", handleReducedMotionChange);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      resizeObserver.disconnect();
      window.removeEventListener("scroll", syncViewportTarget);
      window.removeEventListener("resize", updateBodyHeight);
      mediaQuery.removeEventListener("change", handleReducedMotionChange);

      smoothScrollLastTimeRef.current = null;
      content.style.transform = "";
      document.body.style.minHeight = "";
    };
  }, []);

  useEffect(() => {
    let frameId = 0;
    const stiffness = 100;
    const damping = 28;

    const animateScrollProgress = (timestamp: number) => {
      frameId = 0;

      const lastTimestamp = heroProgressLastTimeRef.current ?? timestamp;
      const deltaTime = Math.min((timestamp - lastTimestamp) / 1000, 0.064);
      heroProgressLastTimeRef.current = timestamp;

      const displacement =
        heroProgressTargetRef.current - heroProgressCurrentRef.current;
      const springForce = displacement * stiffness;
      const dampingForce = -heroProgressVelocityRef.current * damping;
      const acceleration = springForce + dampingForce;

      heroProgressVelocityRef.current += acceleration * deltaTime;
      heroProgressCurrentRef.current +=
        heroProgressVelocityRef.current * deltaTime;

      heroProgressCurrentRef.current = Math.min(
        Math.max(heroProgressCurrentRef.current, 0),
        1
      );

      const isSettled =
        Math.abs(heroProgressTargetRef.current - heroProgressCurrentRef.current) <
          0.0015 && Math.abs(heroProgressVelocityRef.current) < 0.0015;

      if (isSettled) {
        heroProgressCurrentRef.current = heroProgressTargetRef.current;
        heroProgressVelocityRef.current = 0;
        heroProgressLastTimeRef.current = null;
      }

      setHeroScrollProgress((currentProgress) => {
        if (Math.abs(currentProgress - heroProgressCurrentRef.current) < 0.0005) {
          return currentProgress;
        }

        return heroProgressCurrentRef.current;
      });

      if (!isSettled) {
        frameId = window.requestAnimationFrame(animateScrollProgress);
      }
    };

    const syncScrollTarget = () => {
      const maxScroll = Math.max(window.innerHeight * 0.95, 1);
      heroProgressTargetRef.current = Math.min(window.scrollY / maxScroll, 1);

      if (frameId === 0) {
        heroProgressLastTimeRef.current = null;
        frameId = window.requestAnimationFrame(animateScrollProgress);
      }
    };

    const handleScroll = () => {
      syncScrollTarget();
    };

    syncScrollTarget();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      heroProgressLastTimeRef.current = null;

      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    const projectsStartRef = { current: Infinity }; // ← use object ref pattern

    const calcProjectsStart = () => {
      const projectsSection = document.getElementById("projects");
      if (projectsSection) {
        projectsStartRef.current =
          projectsStartRef.current = projectsSection.offsetTop - 96;
      }
    };

    calcProjectsStart();
    window.addEventListener("resize", calcProjectsStart);

    const updateHeaderVisibility = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - headerLastScrollYRef.current;
      const isInOtherSections = currentScrollY >= projectsStartRef.current; // ← reads updated value

      if (!isInOtherSections || currentScrollY <= 0) {
        setIsHeaderHidden(false);
      } else if (scrollDelta > 2) {
        setIsHeaderHidden(true);
      } else if (scrollDelta < -2) {
        setIsHeaderHidden(false);
      }

      headerLastScrollYRef.current = currentScrollY;
    };

    updateHeaderVisibility();
    window.addEventListener("scroll", updateHeaderVisibility, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateHeaderVisibility);
      window.removeEventListener("resize", calcProjectsStart);
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

  const nameLockupStyle: NameLockupStyle = {
    "--hero-scroll-progress": heroScrollProgress.toFixed(3),
  };

  const activeProject = featuredProjects[activeProjectIndex];

  const handleProjectSelect = (index: number) => {
    if (index === activeProjectIndex) {
      return;
    }

    setActiveProjectIndex(index);
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

  const handleBrandClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.history.pushState(null, "", "/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProjectsLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const projectsSection = document.getElementById("projects");

    if (!projectsSection) {
      return;
    }

    const projectsTop = projectsSection.getBoundingClientRect().top + window.scrollY;
    window.history.replaceState(null, "", "/projects");
    window.scrollTo({ top: projectsTop, behavior: "smooth" });
  };

  return (
    <>
      <WaveBackground src="/background.png" />
      <div ref={smoothScrollViewportRef} className="smooth-scroll-viewport">
        <main ref={smoothScrollShellRef} className="portfolio-shell">
          <header className={`topbar${isHeaderHidden ? " is-hidden" : ""}`}>
            <a
              className="brand-mark"
              href="/"
              aria-label="Lucas Kim home"
              onClick={handleBrandClick}
            >
              LUCAS KIM
            </a>
            <nav className="main-nav" aria-label="Primary">
              {navigationItems.map((item) =>
                item === "Projects" ? (
                  <HoverRollLink
                    key={item}
                    text={item}
                    href="/projects"
                    onClick={handleProjectsLinkClick}
                    className="main-nav-link"
                    enableWipe
                  />
                ) : (
                  <HoverRollLink
                    key={item}
                    text={item}
                    href={`/${item.toLowerCase()}`}
                    className="main-nav-link"
                    enableWipe
                  />
                )
              )}
            </nav>
            <div className="topbar-actions">
              <a className="locale-switch" href="/contact">
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
                  href="mailto:eunsukim1180@gmail.com"
                >
                  Contact Me
                </a>
                <a
                  ref={roundButtonRef}
                  className="round-button"
                  href="mailto:eunsukim1180@gmail.com"
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
          <div ref={smoothScrollContentRef} className="smooth-scroll-content">
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
                style={nameLockupStyle}
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
            <section className="projects-section" id="projects" aria-labelledby="projects-title">
              <div className="projects-topbar">
                <p className="projects-eyebrow" id="projects-title">Selected Work</p>
                <nav className="project-switcher" aria-label="Project switcher">
                  {featuredProjects.map((project, index) => (
                    <button
                      key={project.id}
                      type="button"
                      className={`project-switch-link${index === activeProjectIndex ? " is-active" : ""}`}
                      onClick={() => {
                        handleProjectSelect(index);
                      }}
                    >
                      {project.name}
                    </button>
                  ))}
                </nav>
                <a className="projects-all-link" href="/projects">
                  See All Projects <span aria-hidden="true">→</span>
                </a>
              </div>

              <article
                key={activeProject.id}
                className="featured-project"
              >
                <div className="featured-project-visual" aria-hidden="true">
                  <div className="visual-single-card">
                    <img
                      src={activeProject.image}
                      alt=""
                      draggable={false}
                      style={{ width: "100%",
                              height: "100%", 
                              objectFit: "contain", 
                              display: "block",
                              objectPosition: "-60px center",
                             }}
                    />
                  </div>
                </div>

                <div className="featured-project-copy">
                  <div className="featured-project-content">
                    <p className="featured-project-meta">
                      {activeProject.region} • {activeProject.scope} • {activeProject.timeline}
                    </p>
                    <h3>{activeProject.name} • {activeProject.roleTitle}</h3>
                    <p className="featured-project-summary">{activeProject.summary}</p>
                    <ul className="featured-project-bullets">
                      {activeProject.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="featured-project-tags" aria-label="Project tags">
                    {activeProject.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}















