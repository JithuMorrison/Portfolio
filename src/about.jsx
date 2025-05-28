import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function About({ isMobile }) {
  const aboutVisualRef = useRef(null);

  useEffect(() => {
    if (!aboutVisualRef.current) return;
  
    const container = aboutVisualRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
  
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width+340, height+340);
    container.appendChild(renderer.domElement);
  
    const geometry = new THREE.IcosahedronGeometry(1.5, 1);
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
  
    let plane;
    const loader = new GLTFLoader();
    loader.load('/glbs/jet.glb', (gltf) => {
      plane = gltf.scene;
      plane.scale.set(0.02, 0.02, 0.02); // Adjust size if needed
      scene.add(plane);
    }, undefined, (error) => {
      console.error('Error loading model:', error);
    });
  
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
  
    camera.position.z = 8;
  
    // Store scroll position
    let scrollY = 0;
  
    const animate = () => {
      requestAnimationFrame(animate);
  
      mesh.rotation.x += 0.005;
      mesh.rotation.y += 0.01;

      if(plane){
        // Create infinity symbol path movement
        const t = Date.now() * 0.001;
        const a = 7; // Width of the infinity symbol
        const b = 5; // Height of the infinity symbol
        
        // Calculate current and next positions
        const currentX = a * Math.sin(t) / (1 + Math.pow(Math.cos(t), 2));
        const currentY = b * Math.sin(t) * Math.cos(t) / (1 + Math.pow(Math.cos(t), 2)) + (scrollY * 0.017 - 7);
        const nextT = t + 0.01;
        const nextX = a * Math.sin(nextT) / (1 + Math.pow(Math.cos(nextT), 2));
        const nextY = b * Math.sin(nextT) * Math.cos(nextT) / (1 + Math.pow(Math.cos(nextT), 2)) + (scrollY * 0.017 - 7);
        
        // Update position
        plane.position.x = currentX;
        plane.position.y = currentY;
        
        // Calculate direction vector and target quaternion
        const direction = new THREE.Vector3(nextX - currentX, nextY - currentY, 0).normalize();
        const up = new THREE.Vector3(0, 0, 1);
        const targetQuaternion = new THREE.Quaternion();
        targetQuaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
        
        // Apply base rotation
        const baseRotation = new THREE.Quaternion().setFromAxisAngle(up, Math.PI / 2);
        targetQuaternion.multiply(baseRotation);
        
        // Add tilt for downward movement
        if (nextY < currentY) {
          const tiltAxis = new THREE.Vector3(1, 0, 0);
          const tiltQuaternion = new THREE.Quaternion().setFromAxisAngle(tiltAxis, Math.PI / 4);
          targetQuaternion.multiply(tiltQuaternion);
        }
        
        // Smoothly interpolate rotation
        plane.quaternion.slerp(targetQuaternion, 0.1);
      }

      // Update mesh Y position based on scroll
      mesh.position.y = scrollY * 0.017 - 7; // Adjust scroll sensitivity here

      renderer.render(scene, camera);
    };
    animate();
  
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
  
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
  
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animate);
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