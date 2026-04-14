import type { ReactNode } from "react";

const aboutRows: { label: string; value: ReactNode }[] = [
  { label: "Based in",      value: "Brisbane, Australia, open to relocation" },
  { label: "Languages",     value: "Korean (native), English (fluent)" },
  { label: "Studies",       value: "Majored in Computer Science, Bachelor of IT @ QUT" },
  { label: "Off the clock", value: <>Amateur boxing, Football, Music, Drawing, Editing my YouTube vlog videos, Exploring the nature around the world.<br /><a href="https://www.youtube.com/@Dr.Babamba" target="_blank" rel="noopener noreferrer" className="about-yt-link">Check out my YouTube channel here!</a></> },
  { label: "Also me",       value: "I'm currently serving food and make drinks at a restaurant. I make sure people have a good time at my restaurant." },
  { label: "How colleagues describe me", value: "Fun to work with, Calm under pressure, Always happy, Critical thinker, Passionate to learn new skills" },
];

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
          <p className="about-bio">
            I've always been a creative person who is curious about how things work.<br />
            I'm eager to surprise people with innovative tools and solve their problems.<br />
            I challenge myself by training in an amateur boxing team with athletes and exploring nature.
          </p>
        </div>
      </div>
    </section>
  );
}
