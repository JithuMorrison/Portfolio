import { useEffect, useState } from 'react';

export default function FinText() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 16000); // 10 seconds

    return () => clearTimeout(timer); // Cleanup
  }, []);

  return (
    <section className="bero">
      <div className="main-container">
        <div className="hero-content">
          <h1>Did You Like It? Wanna see my main portfolio?</h1>
          <p>
            I'm a passionate Computer Science student specializing in web development, 3D graphics, and AI. I build immersive digital experiences that push boundaries.
          </p>

          {showButton && (
            <a className='cta-button' href="https://yourportfolio.com">
              View my portfolio
            </a>
          )}
        </div>
      </div>
    </section>
  );
}