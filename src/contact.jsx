import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function Contact() {
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const animationRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth , window.innerHeight); // Smaller size for better performance
    rendererRef.current = renderer;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Load 3D model
    const loader = new GLTFLoader();
    loader.load(
      '/glbs/spaceship.glb',
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.1, 0.1, 0.1);
        model.position.x = -10; // Start off screen to the left
        model.position.y = -10; // Initial Y position (lower on screen)
        scene.add(model);
        modelRef.current = model;
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
      }
    );

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      if (modelRef.current) {
        // Move model from left to right
        modelRef.current.position.x += 0.05;
        if (modelRef.current.position.x > 10) {
          modelRef.current.position.x = -10;
        }

        modelRef.current.rotation.y -= 0.005;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle scroll
    const handleScroll = () => {
      if (modelRef.current) {
        const scrollY = window.scrollY;
        // Start from lower position and move up with scroll
        modelRef.current.position.y = -24 + (scrollY * 0.01);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth , window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <section id="contact" className="contact">
      <div className="main-container">
        <h2 className="section-title">Get In Touch</h2>
        <div className="contact-container">
          <div className="contact-info">
            <h3>Let's Build Something Amazing</h3>
            <p>I'm currently available for freelance work, internships, and collaborative projects. If you have an idea you'd like to discuss or just want to say hello, feel free to reach out!</p>
            <div className="contact-details">
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>student@university.edu</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>Tech City, Innovation State</span>
              </div>
            </div>
          </div>
          <div className="contact-form">
            <form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" required></textarea>
              </div>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Canvas for 3D model */}
      <canvas 
        ref={canvasRef} 
        className="floating-3d-asset"
        style={{
          position: 'fixed',
          right: '50px',
          bottom: '100px',
          width: '300px',
          height: '300px',
          zIndex: -1,
          opacity: 1
        }}
      />
    </section>
  );
}