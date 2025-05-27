import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function About({ isMobile }) {
  const aboutVisualRef = useRef(null);

  useEffect(() => {
    if (!aboutVisualRef.current) return;

    const container = aboutVisualRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Create floating 3D model
    const geometry = new THREE.IcosahedronGeometry(3, 1);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00a8ff,
      emissive: 0x0044ff,
      emissiveIntensity: 0.5,
      shininess: 100,
      wireframe: false,
      transparent: true,
      opacity: 0.9
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Add the moving plane
    const planeGeometry = new THREE.PlaneGeometry(5, 5);
    const planeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff4d4d,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 4;
    scene.add(plane);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    camera.position.z = 8;

    // Animation
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      mesh.rotation.x += 0.005;
      mesh.rotation.y += 0.01;

      // Animate the plane
      plane.rotation.x += 0.002;
      plane.rotation.y += 0.003;
      plane.position.x = Math.sin(Date.now() * 0.001) * 2;
      plane.position.y = Math.cos(Date.now() * 0.001) * 2;

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
  }, [isMobile]);

  return (
    <section id="about" className="about">
      <div className="main-container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <div className="about-text">
            <h3>Turning Ideas into Interactive Reality</h3>
            <p>I'm a final-year Computer Science student at Prestigious University with a passion for creating cutting-edge digital experiences. My journey in tech began when I built my first website at 15, and since then I've been obsessed with the intersection of design and technology.</p>
            <p>Specializing in full-stack development and 3D graphics, I love pushing the boundaries of what's possible in web applications. My work combines technical precision with artistic vision to create memorable user experiences.</p>
            <div className="skills">
              <div className="skill">JavaScript</div>
              <div className="skill">Three.js</div>
              <div className="skill">React</div>
              <div className="skill">Node.js</div>
              <div className="skill">Python</div>
              <div className="skill">WebGL</div>
              <div className="skill">GLSL</div>
              <div className="skill">Machine Learning</div>
            </div>
          </div>
          <div className="about-visual" ref={aboutVisualRef}></div>
        </div>
      </div>
    </section>
  );
}