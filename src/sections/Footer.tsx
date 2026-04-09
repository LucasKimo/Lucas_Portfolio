import { socialLinks } from "../data";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <a className="footer-brand" href="/">
          LUCAS KIM
        </a>
        <nav className="footer-links" aria-label="Footer links">
          {socialLinks.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              className="footer-link"
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
            >
              <Icon aria-hidden="true" size={16} strokeWidth={2} />
              <span>{label}</span>
            </a>
          ))}
        </nav>
        <p className="footer-copy">© {year} Lucas Kim. All rights reserved.</p>
      </div>
    </footer>
  );
}
