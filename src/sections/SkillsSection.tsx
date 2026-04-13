import { skillCategories } from "../data";

export default function SkillsSection() {
  return (
    <section className="skills-section" id="skills" aria-labelledby="skills-title">
      <div className="section-header">
        <p className="section-eyebrow" id="skills-title">Skills</p>
      </div>
      <div className="skills-grid">
        {skillCategories.map((category) => (
          <div key={category.label} className="skill-category">
            <p className="skill-category-label">{category.label}</p>
            <ul className="skill-list">
              {category.skills.map((skill) => (
                <li key={skill} className="skill-item">{skill}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
