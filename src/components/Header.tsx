import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
} from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import HoverRollLink from "../HoverRollLink";
import { navigationItems } from "../data";

type ContactSwitcherStyle = CSSProperties & Record<`--${string}`, string>;

interface HeaderProps {
  isHeaderHidden: boolean;
  isCursorAtTop: boolean;
  isScrolledPastHero: boolean;
}

export default function Header({ isHeaderHidden, isCursorAtTop, isScrolledPastHero }: HeaderProps) {
  const switcherRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLAnchorElement | null>(null);
  const roundButtonRef = useRef<HTMLAnchorElement | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

    if (!switcher || !contact || !roundButton) return;

    const updateMetrics = () => {
      const overlapValue = getComputedStyle(switcher).getPropertyValue("--contact-overlap").trim();
      const parsedOverlap = Number.parseFloat(overlapValue);

      setContactMetrics({
        pillWidth: contact.offsetWidth,
        roundWidth: roundButton.offsetWidth,
        height: Math.max(contact.offsetHeight, roundButton.offsetHeight),
        overlap: Number.isFinite(parsedOverlap) ? parsedOverlap : 17,
      });
    };

    updateMetrics();

    const resizeObserver = new ResizeObserver(() => updateMetrics());
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
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const handleMenuOpen = () => setIsMenuOpen(true);
  const handleMenuClose = () => setIsMenuOpen(false);

  const makeMobileNavHandler = (sectionId: string, path: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setIsMenuOpen(false);
    document.body.style.overflow = "";
    const section = document.getElementById(sectionId);
    if (!section) return;
    window.history.replaceState(null, "", path);
    requestAnimationFrame(() => {
      const top = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: "smooth" });
    });
  };

  const handleBrandClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.history.pushState(null, "", "/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSectionLinkClick =
    (sectionId: string, path: string) =>
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      const section = document.getElementById(sectionId);
      if (!section) return;
      const contentEl = document.querySelector<HTMLElement>(".smooth-scroll-content");
      const transform = contentEl ? getComputedStyle(contentEl).transform : "none";
      // m42 is the Y translation of the spring scroll transform (negative when scrolled down).
      // When smooth scroll is disabled (mobile/touch), the transform is identity so m42 = 0.
      const m42 = transform !== "none" ? new DOMMatrix(transform).m42 : 0;
      const sectionTop = m42 < 0
        ? section.getBoundingClientRect().top - m42
        : section.getBoundingClientRect().top + window.scrollY;
      window.history.replaceState(null, "", path);
      window.scrollTo({ top: sectionTop, behavior: "smooth" });
    };

  const handleProjectsLinkClick = handleSectionLinkClick("projects", "/projects");
  const handleArchiveLinkClick = handleSectionLinkClick("archive", "/archive");
  const handleSkillsLinkClick = handleSectionLinkClick("skills", "/skills");
  const handleAboutLinkClick = handleSectionLinkClick("about", "/about");

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

  return (
    <>
      <header className={`topbar${isHeaderHidden && !isCursorAtTop ? " is-hidden" : ""}${isScrolledPastHero ? " is-blurred" : ""}`}>
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
              <HoverRollLink key={item} text={item} href="/projects" onClick={handleProjectsLinkClick} className="main-nav-link" enableWipe />
            ) : item === "Milestone" ? (
              <HoverRollLink key={item} text={item} href="/archive" onClick={handleArchiveLinkClick} className="main-nav-link" enableWipe />
            ) : item === "Skills" ? (
              <HoverRollLink key={item} text={item} href="/skills" onClick={handleSkillsLinkClick} className="main-nav-link" enableWipe />
            ) : (
              <HoverRollLink key={item} text={item} href="/about" onClick={handleAboutLinkClick} className="main-nav-link" enableWipe />
            )
          )}
        </nav>
        <div className="topbar-actions">
          <div
            ref={switcherRef}
            className={`contact-switcher${isContactSwapped ? " is-swapped" : ""}${isArrowBehind ? " is-arrow-behind" : ""}`}
            style={contactSwitcherStyle}
            onPointerEnter={handleContactEnter}
            onPointerLeave={handleContactLeave}
            onFocus={handleContactEnter}
            onBlur={handleContactBlur}
          >
            <a ref={contactRef} className="contact-pill" href="mailto:eunsukim1180@gmail.com">
              Contact Me
            </a>
            <a
              ref={roundButtonRef}
              className="round-button"
              href="mailto:eunsukim1180@gmail.com"
              aria-label="Send an email"
              onTransitionEnd={(event) => handleRoundButtonTransitionEnd(event.propertyName)}
            >
              <ArrowRight aria-hidden="true" size={18} strokeWidth={2} />
            </a>
          </div>
        </div>
        <button
          className="menu-button"
          onClick={handleMenuOpen}
          aria-label="Open navigation menu"
          aria-expanded={isMenuOpen}
        >
          <Menu size={22} strokeWidth={2} aria-hidden="true" />
        </button>
      </header>

      <div
        className={`mobile-menu${isMenuOpen ? " is-open" : ""}`}
        aria-hidden={!isMenuOpen}
        aria-label="Navigation menu"
      >
        <div className="mobile-menu-top">
          <a className="brand-mark" href="/" onClick={handleBrandClick}>
            LUCAS KIM
          </a>
          <button
            className="menu-close-button"
            onClick={handleMenuClose}
            aria-label="Close navigation menu"
          >
            <X size={22} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
        <nav className="mobile-menu-nav" aria-label="Mobile primary navigation">
          <a className="mobile-menu-link" href="/projects" onClick={makeMobileNavHandler("projects", "/projects")}>Projects</a>
          <a className="mobile-menu-link" href="/archive" onClick={makeMobileNavHandler("archive", "/archive")}>Milestone</a>
          <a className="mobile-menu-link" href="/skills" onClick={makeMobileNavHandler("skills", "/skills")}>Skills</a>
          <a className="mobile-menu-link" href="/about" onClick={makeMobileNavHandler("about", "/about")}>About</a>
        </nav>
        <a className="mobile-menu-contact" href="mailto:eunsukim1180@gmail.com">
          Contact Me
          <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
        </a>
      </div>
    </>
  );
}
