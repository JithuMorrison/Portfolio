import { Link } from 'react-scroll';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function Hero() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth < 768 ? 1 : 300 / 300,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      window.innerWidth < 768 ? 250 : window.innerWidth,
      window.innerWidth < 768 ? 250 : window.innerHeight
    );
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Model loader
    const loader = new GLTFLoader();
    let model;

    // Load your model - replace with your actual model path
    loader.load(
      '/glbs/blackhole.glb',
      (gltf) => {
        model = gltf.scene;
        model.scale.set(1, 1, 1);
        model.position.set(0, 0, 0);
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
        
        // Fallback cube if model fails to load
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshStandardMaterial({ 
          color: 0x6f42c1,
          metalness: 0.6,
          roughness: 0.2
        });
        model = new THREE.Mesh(geometry, material);
        scene.add(model);
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (model) {
        model.rotation.x = 3.3;
      }
      
      if(window.scrollY > 3500){
        if (model) {
          if(model.position.z < 4.18){
            model.position.z += 0.005;
          }
          model.rotation.y += 0.005; // Adjust rotation speed here
        }
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth < 768 ? 250 : 300;
      const height = window.innerWidth < 768 ? 250 : 300;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };    
  }, []);

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
        
        {/* 3D Model Container */}
        <div className="hero-3d-asset" ref={mountRef}></div>
      </div>
    </section>
  );
}