import { Link } from 'react-scroll';

export default function Navbar() {
  return (
    <nav>
      <div className="logo">CS PORTFOLIO</div>
      <div className="nav-links">
        <Link to="about" smooth={true} duration={500}>About</Link>
        <Link to="projects" smooth={true} duration={500}>Projects</Link>
        <Link to="contact" smooth={true} duration={500}>Contact</Link>
      </div>
    </nav>
  );
}