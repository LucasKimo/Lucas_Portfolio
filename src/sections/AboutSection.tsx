const aboutRows = [
  { label: "Based in",      value: "Brisbane, Australia, open to relocation" },
  { label: "Languages",     value: "Korean (native), English (fluent)" },
  { label: "Studies",       value: "Majored in Computer Science, Bachelor of IT @ QUT" },
  { label: "Off the clock", value: "Amateur boxing, football, music, drawing, editing my YouTube vlog videos, exploring the nature around the world" },
  { label: "Also me",       value: "I won a hackathon, earned the Executive Dean's Award, and make sure people have a good time at my restaurant." },
] as const;

export default function AboutSection() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="section-header">
        <p className="section-eyebrow" id="about-title">Nice to meet you</p>
      </div>
      <h2 className="about-heading">Beyond the portfolio</h2>
      <div className="about-layout">
        <div className="about-photo" aria-hidden="true">
          <img src="/Me.JPG" alt="" className="about-photo-img" />
        </div>
        <div className="about-info">
          {aboutRows.map(({ label, value }) => (
            <div key={label} className="about-info-row">
              <span className="about-info-label">{label}</span>
              <span className="about-info-value">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
