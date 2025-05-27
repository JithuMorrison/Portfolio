import { Link } from 'react-scroll';

export default function Hero() {
  return (
    <section className="hero">
      <div className="main-container">
        <div className="hero-content">
          <h1>Innovating Through Code & Creativity</h1>
          <p>I'm a passionate Computer Science student specializing in web development, 3D graphics, and AI. I build immersive digital experiences that push boundaries.</p>
          <Link to="projects" smooth={true} duration={500} className="cta-button">View My Work</Link>
          <div className="social-links">
            <a href="#"><i className="fab fa-github"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
    </section>
  );
}