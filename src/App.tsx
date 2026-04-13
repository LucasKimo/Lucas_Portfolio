import { useEffect, useRef, useState } from "react";
import WaveBackground from "./WaveBackground";
import Header from "./components/Header";
import HeroSection from "./sections/HeroSection";
import ProjectsSection from "./sections/ProjectsSection";
import MilestoneSection from "./sections/MilestoneSection";
import SkillsSection from "./sections/SkillsSection";
import AboutSection from "./sections/AboutSection";
import Footer from "./sections/Footer";

export default function App() {
  const smoothScrollViewportRef = useRef<HTMLDivElement | null>(null);
  const smoothScrollShellRef = useRef<HTMLElement | null>(null);
  const smoothScrollContentRef = useRef<HTMLDivElement | null>(null);
  const heroProgressCurrentRef = useRef(0);
  const heroProgressTargetRef = useRef(0);
  const heroProgressVelocityRef = useRef(0);
  const heroProgressLastTimeRef = useRef<number | null>(null);
  const smoothScrollCurrentRef = useRef(0);
  const smoothScrollTargetRef = useRef(0);
  const smoothScrollVelocityRef = useRef(0);
  const smoothScrollLastTimeRef = useRef<number | null>(null);
  const headerLastScrollYRef = useRef(0);
  const cursorTopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [heroScrollProgress, setHeroScrollProgress] = useState(0);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [isCursorAtTop, setIsCursorAtTop] = useState(false);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  // Smooth scroll
  useEffect(() => {
    const viewport = smoothScrollViewportRef.current;
    const shell = smoothScrollShellRef.current;
    const content = smoothScrollContentRef.current;

    if (!viewport || !shell || !content) return;

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
      const displacement = smoothScrollTargetRef.current - smoothScrollCurrentRef.current;
      const springForce = displacement * stiffness;
      const dampingForce = -smoothScrollVelocityRef.current * damping;
      const acceleration = springForce + dampingForce;
      smoothScrollVelocityRef.current += acceleration * deltaTime;
      smoothScrollCurrentRef.current += smoothScrollVelocityRef.current * deltaTime;
      const isSettled =
        Math.abs(smoothScrollTargetRef.current - smoothScrollCurrentRef.current) < 0.1 &&
        Math.abs(smoothScrollVelocityRef.current) < 0.1;
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

    const resizeObserver = new ResizeObserver(() => updateBodyHeight());
    resizeObserver.observe(shell);
    window.addEventListener("scroll", syncViewportTarget, { passive: true });
    window.addEventListener("resize", updateBodyHeight);
    mediaQuery.addEventListener("change", handleReducedMotionChange);

    return () => {
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", syncViewportTarget);
      window.removeEventListener("resize", updateBodyHeight);
      mediaQuery.removeEventListener("change", handleReducedMotionChange);
      smoothScrollLastTimeRef.current = null;
      content.style.transform = "";
      document.body.style.minHeight = "";
    };
  }, []);

  // Hero scroll progress
  useEffect(() => {
    let frameId = 0;
    const stiffness = 100;
    const damping = 28;

    const animateScrollProgress = (timestamp: number) => {
      frameId = 0;
      const lastTimestamp = heroProgressLastTimeRef.current ?? timestamp;
      const deltaTime = Math.min((timestamp - lastTimestamp) / 1000, 0.064);
      heroProgressLastTimeRef.current = timestamp;
      const displacement = heroProgressTargetRef.current - heroProgressCurrentRef.current;
      const springForce = displacement * stiffness;
      const dampingForce = -heroProgressVelocityRef.current * damping;
      const acceleration = springForce + dampingForce;
      heroProgressVelocityRef.current += acceleration * deltaTime;
      heroProgressCurrentRef.current += heroProgressVelocityRef.current * deltaTime;
      heroProgressCurrentRef.current = Math.min(Math.max(heroProgressCurrentRef.current, 0), 1);
      const isSettled =
        Math.abs(heroProgressTargetRef.current - heroProgressCurrentRef.current) < 0.0015 &&
        Math.abs(heroProgressVelocityRef.current) < 0.0015;
      if (isSettled) {
        heroProgressCurrentRef.current = heroProgressTargetRef.current;
        heroProgressVelocityRef.current = 0;
        heroProgressLastTimeRef.current = null;
      }
      setHeroScrollProgress((currentProgress) => {
        if (Math.abs(currentProgress - heroProgressCurrentRef.current) < 0.0005) return currentProgress;
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

    syncScrollTarget();
    window.addEventListener("scroll", syncScrollTarget, { passive: true });
    window.addEventListener("resize", syncScrollTarget);

    return () => {
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
      heroProgressLastTimeRef.current = null;
      window.removeEventListener("scroll", syncScrollTarget);
      window.removeEventListener("resize", syncScrollTarget);
    };
  }, []);

  // Header visibility
  useEffect(() => {
    const projectsStartRef = { current: Infinity };

    const calcProjectsStart = () => {
      const projectsSection = document.getElementById("projects");
      if (projectsSection) {
        projectsStartRef.current = projectsSection.offsetTop - 96;
      }
    };

    calcProjectsStart();
    window.addEventListener("resize", calcProjectsStart);

    const updateHeaderVisibility = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - headerLastScrollYRef.current;
      const isInOtherSections = currentScrollY >= projectsStartRef.current;

      setIsScrolledPastHero(isInOtherSections && currentScrollY > 0);

      if (!isInOtherSections || currentScrollY <= 0) {
        if (headerHideTimerRef.current !== null) {
          clearTimeout(headerHideTimerRef.current);
          headerHideTimerRef.current = null;
        }
        setIsHeaderHidden(false);
      } else if (scrollDelta > 2) {
        if (headerHideTimerRef.current !== null) {
          clearTimeout(headerHideTimerRef.current);
          headerHideTimerRef.current = null;
        }
        setIsHeaderHidden(true);
      } else if (scrollDelta < -2) {
        setIsHeaderHidden(false);
        if (headerHideTimerRef.current !== null) {
          clearTimeout(headerHideTimerRef.current);
        }
        headerHideTimerRef.current = setTimeout(() => {
          setIsHeaderHidden(true);
          headerHideTimerRef.current = null;
        }, 1500);
      }

      headerLastScrollYRef.current = currentScrollY;
    };

    updateHeaderVisibility();
    window.addEventListener("scroll", updateHeaderVisibility, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateHeaderVisibility);
      window.removeEventListener("resize", calcProjectsStart);
      if (headerHideTimerRef.current !== null) {
        clearTimeout(headerHideTimerRef.current);
      }
    };
  }, []);

  // Cursor at top (reveals header when mouse near top edge)
  useEffect(() => {
    const handleGlobalMouseMove = (e: globalThis.MouseEvent) => {
      if (e.clientY < 50) {
        if (cursorTopTimerRef.current !== null) {
          clearTimeout(cursorTopTimerRef.current);
          cursorTopTimerRef.current = null;
        }
        setIsCursorAtTop(true);
      } else if (isCursorAtTop) {
        if (cursorTopTimerRef.current === null) {
          cursorTopTimerRef.current = setTimeout(() => {
            setIsCursorAtTop(false);
            cursorTopTimerRef.current = null;
          }, 1000);
        }
      }
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      if (cursorTopTimerRef.current !== null) {
        clearTimeout(cursorTopTimerRef.current);
      }
    };
  }, [isCursorAtTop]);

  return (
    <>
      <WaveBackground src="/background.png" />
      <div ref={smoothScrollViewportRef} className="smooth-scroll-viewport">
        <main ref={smoothScrollShellRef} className="portfolio-shell">
          <Header isHeaderHidden={isHeaderHidden} isCursorAtTop={isCursorAtTop} isScrolledPastHero={isScrolledPastHero} />
          <div ref={smoothScrollContentRef} className="smooth-scroll-content">
            <HeroSection heroScrollProgress={heroScrollProgress} />
            <ProjectsSection />
            <MilestoneSection />
            <SkillsSection />
            <AboutSection />
            <Footer />
          </div>
        </main>
      </div>
    </>
  );
}
