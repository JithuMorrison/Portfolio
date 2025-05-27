import { Link } from 'react-scroll';

export default function Footer() {
  return (
    <footer>
      <div className="main-container">
        <div className="footer-content">
          <div className="logo">CS PORTFOLIO</div>
          <div className="footer-links">
            <Link to="about" smooth={true} duration={500}>About</Link>
            <Link to="projects" smooth={true} duration={500}>Projects</Link>
            <Link to="contact" smooth={true} duration={500}>Contact</Link>
            <a href="#">Resume</a>
          </div>
          <div className="copyright">
            &copy; 2023 Computer Science Student Portfolio. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}