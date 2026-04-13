import { ArrowUpRight } from "lucide-react";
import { archiveProjects } from "../data";

export default function MilestoneSection() {
  return (
    <section className="archive-section" id="archive" aria-labelledby="archive-title">
      <div className="section-header">
        <p className="section-eyebrow" id="archive-title">Milestone</p>
        
      </div>
      <table className="archive-table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Title</th>
            <th>Category</th>
            <th>Organization</th>
            <th>Details</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {archiveProjects.map((project) => (
            <tr key={`${project.year}-${project.title}`}>
              <td className="archive-year">{project.year}</td>
              <td className="archive-name">{project.title}</td>
              <td className="archive-category">{project.category}</td>
              <td className="archive-built-at">{project.organization}</td>
              <td className="archive-tags">
                {project.details.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </td>
              <td className="archive-link">
                {project.link ? (
                  <a href={project.link} target="_blank" rel="noreferrer" aria-label={`View ${project.title} on GitHub`}>
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
