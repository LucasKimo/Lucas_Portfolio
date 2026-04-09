import { ArrowUpRight } from "lucide-react";
import { archiveProjects } from "../data";

export default function MilestoneSection() {
  return (
    <section className="archive-section" id="archive" aria-labelledby="archive-title">
      <div className="section-header">
        <p className="section-eyebrow" id="archive-title">Milestone</p>
        <p className="section-sub">A collection of things I've built over the years.</p>
      </div>
      <table className="archive-table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Project</th>
            <th>Built At</th>
            <th>Built With</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {archiveProjects.map((project) => (
            <tr key={`${project.year}-${project.name}`}>
              <td className="archive-year">{project.year}</td>
              <td className="archive-name">{project.name}</td>
              <td className="archive-built-at">{project.builtAt}</td>
              <td className="archive-tags">
                {project.builtWith.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </td>
              <td className="archive-link">
                {project.link ? (
                  <a href={project.link} target="_blank" rel="noreferrer" aria-label={`View ${project.name} on GitHub`}>
                    <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
                  </a>
                ) : (
                  <span className="archive-link-empty">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
