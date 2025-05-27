import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Projects({ isMobile }) {
  const projectRefs = [useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    const projects = [
      { ref: projectRefs[0], color: 0xff4d4d, shape: 'sphere' },
      { ref: projectRefs[1], color: 0xf9cb28, shape: 'torus' },
      { ref: projectRefs[2], color: 0x00a8ff, shape: 'box' }
    ];

    const cleanups = projects.map((project) => {
      if (!project.ref.current) return;

      const container = project.ref.current;
      const width = container.clientWidth;
      const height = container.clientHeight;

      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);

      // Create shape
      let geometry;
      switch(project.shape) {
        case 'sphere':
          geometry = new THREE.SphereGeometry(1.5, 32, 32);
          break;
        case 'torus':
          geometry = new THREE.TorusGeometry(1.5, 0.5, 16, 32);
          break;
        case 'box':
          geometry = new THREE.BoxGeometry(2, 2, 2);
          break;
      }

      const material = new THREE.MeshPhongMaterial({
        color: project.color,
        emissive: project.color,
        emissiveIntensity: 0.2,
        shininess: 100,
        wireframe: false,
        transparent: true,
        opacity: 0.9
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Lights
      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);

      camera.position.z = 5;

      // Animation
      let animationId;
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.01;
        renderer.render(scene, camera);
      };
      animate();

      // Handle resize
      const handleResize = () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
        container.removeChild(renderer.domElement);
      };
    });

    return () => cleanups.forEach(cleanup => cleanup && cleanup());
  }, [isMobile, projectRefs]);

  return (
    <section id="projects" className="projects">
      <div className="main-container">
        <h2 className="section-title">Featured Projects</h2>
        <div className="projects-grid">
          <div className="project-card">
            <div className="project-image" ref={projectRefs[0]}></div>
            <div className="project-info">
              <h3>Quantum Simulation Platform</h3>
              <p>A web-based quantum computing simulator with interactive 3D visualizations of quantum states and algorithms.</p>
              <div className="project-tags">
                <div className="project-tag">Three.js</div>
                <div className="project-tag">Quantum Computing</div>
                <div className="project-tag">WebGL</div>
              </div>
              <div className="project-links">
                <a href="#"><i className="fas fa-external-link-alt"></i> Live Demo</a>
                <a href="#"><i className="fab fa-github"></i> GitHub</a>
              </div>
            </div>
          </div>
          <div className="project-card">
            <div className="project-image" ref={projectRefs[1]}></div>
            <div className="project-info">
              <h3>Neural Network Visualizer</h3>
              <p>Interactive 3D visualization tool for understanding neural network architectures and training processes.</p>
              <div className="project-tags">
                <div className="project-tag">TensorFlow.js</div>
                <div className="project-tag">Three.js</div>
                <div className="project-tag">AI</div>
              </div>
              <div className="project-links">
                <a href="#"><i className="fas fa-external-link-alt"></i> Live Demo</a>
                <a href="#"><i className="fab fa-github"></i> GitHub</a>
              </div>
            </div>
          </div>
          <div className="project-card">
            <div className="project-image" ref={projectRefs[2]}></div>
            <div className="project-info">
              <h3>Procedural Planet Generator</h3>
              <p>Real-time procedural planet generation with customizable terrain, atmospheres, and ecosystems.</p>
              <div className="project-tags">
                <div className="project-tag">WebGL</div>
                <div className="project-tag">Procedural Generation</div>
                <div className="project-tag">GLSL</div>
              </div>
              <div className="project-links">
                <a href="#"><i className="fas fa-external-link-alt"></i> Live Demo</a>
                <a href="#"><i className="fab fa-github"></i> GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}