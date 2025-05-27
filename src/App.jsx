import { useState, useEffect } from 'react';
import ThreeScene from './3scene';
import Navbar from './navbar';
import Hero from './hero';
import About from './about';
import Projects from './profile';
import Contact from './contact';
import Footer from './footer';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app">
      <ThreeScene isMobile={isMobile} />
      <Navbar />
      <main>
        <Hero />
        <About isMobile={isMobile} />
        <Projects isMobile={isMobile} />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;