import { useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { featuredProjects } from "../data";

export default function ProjectsSection() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const cursorRef = useRef<HTMLDivElement | null>(null);

  const activeProject = featuredProjects[activeProjectIndex];

  const handleProjectSelect = (index: number) => {
    if (index === activeProjectIndex) return;
    setActiveProjectIndex(index);
  };

  const handleVisualMouseMove = (e: MouseEvent) => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  };

  const handleVisualMouseEnter = () => {
    cursorRef.current?.classList.add("is-visible");
  };

  const handleVisualMouseLeave = () => {
    cursorRef.current?.classList.remove("is-visible");
  };

  return (
    <>
      {createPortal(
        <div ref={cursorRef} className="visual-cursor">VIEW</div>,
        document.body
      )}
      <section className="projects-section" id="projects" aria-labelledby="projects-title">
        <div className="projects-topbar">
          <p className="projects-eyebrow" id="projects-title">Selected Work</p>
          <nav className="project-switcher" aria-label="Project switcher">
            {featuredProjects.map((project, index) => (
              <button
                key={project.id}
                type="button"
                className={`project-switch-link${index === activeProjectIndex ? " is-active" : ""}`}
                onClick={() => handleProjectSelect(index)}
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
          onMouseMove={handleVisualMouseMove}
          onMouseEnter={handleVisualMouseEnter}
          onMouseLeave={handleVisualMouseLeave}
        >
          <div className="featured-project-visual" aria-hidden="true">
            <div className="visual-single-card">
              <img
                src={activeProject.image}
                alt=""
                draggable={false}
                style={{
                  width: "100%",
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
    </>
  );
}
