import { useState, useEffect, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';
import ThreeScene from './3scene';
import Navbar from './navbar';
import Hero from './hero';
import About from './about';
import Projects from './profile';
import Contact from './contact';
import Footer from './footer';
import FinText from './finaltext';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showContent, setShowContent] = useState(false);
  const [fadeProgress, setFadeProgress] = useState(1);
  const skyboxRef = useRef(null);
  const buttonRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (showContent) return; // Skip if content is already shown

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    skyboxRef.current.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Load skybox model
    const loader = new GLTFLoader();
    loader.load(
      '/glbs/skybox.glb', // Path to your 3D skybox .glb file
      (gltf) => {
        const skyboxModel = gltf.scene;
        skyboxModel.scale.set(1, 1, 1); // Scale up the skybox
        scene.add(skyboxModel);
        
        // Position camera inside the skybox
        camera.position.z = 5;
        
        // Add orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 1;
        controls.maxDistance = 10;
        controls.maxPolarAngle = Math.PI;
        controlsRef.current = controls;
      },
      undefined,
      (error) => {
        console.error('Error loading 3D skybox:', error);
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (skyboxRef.current && renderer.domElement) {
        try {
          skyboxRef.current.removeChild(renderer.domElement);
        } catch (error) {
          console.warn("Error removing renderer DOM element:", error);
        }
        renderer.dispose();
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
    };
  }, [showContent]);

  const handleEnterClick = () => {
    // Start fade out animation
    const fadeDuration = 2000; // 2 seconds
    const startTime = Date.now();
    
    const fadeOut = () => {
      const elapsed = Date.now() - startTime;
      const progress = 1 - (elapsed / fadeDuration);
      
      if (progress > 0) {
        setFadeProgress(progress);
        requestAnimationFrame(fadeOut);
      } else {
        setFadeProgress(0);
        setShowContent(true);
      }
    };
    
    fadeOut();
  };

  if (!showContent) {
    return (
      <div
        className="skybox-container"
        ref={skyboxRef}
        style={{ opacity: fadeProgress, transition: 'opacity 0.2s ease-out' }}
      >
        <button 
          ref={buttonRef}
          className="enter-button"
          onClick={handleEnterClick}
          style={{ opacity: fadeProgress }}
        >
          Enter Portfolio
        </button>
        <style jsx>{`
          .skybox-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            background: #000;
            pointer-events: ${fadeProgress === 0 ? 'none' : 'auto'};
          }
          .enter-button {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 15px 30px;
            font-size: 1.5rem;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 2px solid white;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 1001;
          }
          .enter-button:hover {
            background: rgba(255, 255, 255, 0.4);
            transform: translate(-50%, -50%) scale(1.05);
          }
        `}</style>
      </div>
    );
  }  

  return (
    <div className="app">
      <ThreeScene isMobile={isMobile} />
      <Navbar />
      <main>
        <Hero />
        <About isMobile={isMobile} />
        <Projects isMobile={isMobile} />
        <Contact />
        <FinText />
      </main>
      <Footer />
    </div>
  );
}

export default App;