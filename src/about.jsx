import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function About({ isMobile }) {
  const aboutVisualRef = useRef(null);
  let frameId;
  const glowIntensity = useRef(0);

  useEffect(() => {
    if (!aboutVisualRef.current) return;
  
    const container = aboutVisualRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
  
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(width+340, height+340);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
  
    // Sun core
    const geometry = new THREE.IcosahedronGeometry(1.5, 3);
    const material = new THREE.MeshPhongMaterial({
      color: 0xff9933,
      emissive: 0xff6600,
      emissiveIntensity: 0.5,
      shininess: 100,
      specular: 0xffffee,
      wireframe: false,
      transparent: true,
      opacity: 0.98
    });
    const sunMesh = new THREE.Mesh(geometry, material);
    scene.add(sunMesh);

    // Corona with layered spheres for better glow
    const coronaLayers = [];
    const coronaColors = [0xff8800, 0xff6600, 0xff4400];
    const coronaOpacities = [0.05, 0.03, 0.02];
    const coronaSizes = [2.2, 2.5, 3.0];
    
    coronaColors.forEach((color, i) => {
      const coronaGeometry = new THREE.SphereGeometry(coronaSizes[i], 32, 32);
      const coronaMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: coronaOpacities[i],
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      });
      const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
      sunMesh.add(corona);
      coronaLayers.push(corona);
    });
  
    // Particle system for solar flares
    const particleCount = 300;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Random position in a sphere around the sun
      const radius = 2 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      sizes[i] = 0.1 + Math.random() * 0.2;
      speeds[i] = 0.005 + Math.random() * 0.01;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffaa55,
      size: 0.15,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    sunMesh.add(particleSystem);
  
    // Plane model
    let plane;
    const loader = new GLTFLoader();
    loader.load('/glbs/jet.glb', (gltf) => {
      plane = gltf.scene;
      plane.scale.set(0.02, 0.02, 0.02);
      scene.add(plane);
    }, undefined, (error) => {
      console.error('Error loading model:', error);
    });
  
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    const sunLight = new THREE.DirectionalLight(0xffaa77, 1.5);
    sunLight.position.set(1, 1, 1);
    scene.add(sunLight);
    
    // Sun glow light
    const pointLight = new THREE.PointLight(0xff6600, 2, 10);
    pointLight.position.copy(sunMesh.position);
    sunMesh.add(pointLight);
  
    camera.position.z = 8;
  
    // Interaction variables
    let scrollY = 0;
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2(0, 0);
    let isHovered = false;
    let isColliding = false;

    const handleMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
  
    const animate = () => {
      frameId = requestAnimationFrame(animate);
  
      // Smooth sun rotation
      sunMesh.rotation.x += 0.003;
      sunMesh.rotation.y += 0.005;

      // Gentle corona pulse
      const pulse = 0.05 * Math.sin(Date.now() * 0.001) + 1;
      coronaLayers.forEach(layer => {
        layer.scale.set(pulse, pulse, pulse);
      });
      
      // Particle animation
      const particlePositions = particles.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const speed = speeds[i];
        
        // Move particles outward
        particlePositions[i3] *= 1 + speed;
        particlePositions[i3 + 1] *= 1 + speed;
        particlePositions[i3 + 2] *= 1 + speed;
        
        // Reset particles that move too far
        const distance = Math.sqrt(
          particlePositions[i3] ** 2 + 
          particlePositions[i3 + 1] ** 2 + 
          particlePositions[i3 + 2] ** 2
        );
        
        if (distance > 5) {
          const radius = 2 + Math.random() * 0.5;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          
          particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
          particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          particlePositions[i3 + 2] = radius * Math.cos(phi);
        }
      }
      particles.attributes.position.needsUpdate = true;

      // Plane animation (lemniscate curve)
      if (plane) {
        const t = Date.now() * 0.0008;
        const a = 7.5;
        
        // Lemniscate of Bernoulli parametric equations
        const denom = 1 + Math.sin(t) * Math.sin(t);
        const x = (a * Math.cos(t)) / denom;
        const y = (a * Math.sin(t) * Math.cos(t)) / denom;
        
        plane.position.x = x;
        plane.position.y = y + (scrollY * 0.015 - 6);
        
        // Calculate direction for orientation
        const nextT = t + 0.01;
        const nextX = (a * Math.cos(nextT)) / (1 + Math.sin(nextT) * Math.sin(nextT));
        const nextY = (a * Math.sin(nextT) * Math.cos(nextT)) / (1 + Math.sin(nextT) * Math.sin(nextT));
        
        const direction = new THREE.Vector3(nextX - x, nextY - y, 0).normalize();
        const up = new THREE.Vector3(0, 0, 1);
        const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0), 
          direction
        );
        const baseRotation = new THREE.Quaternion().setFromAxisAngle(up, Math.PI / 2);
        targetQuaternion.multiply(baseRotation);
        
        plane.quaternion.slerp(targetQuaternion, 0.1);
        
        // Check collision with sun
        const distance = sunMesh.position.distanceTo(plane.position);
        isColliding = distance < 3;
      }

      // Update sun position based on scroll
      sunMesh.position.y = scrollY * 0.015 - 6;

      // Hover detection
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(sunMesh);
      isHovered = intersects.length > 0;
      
      // Smooth glow intensity changes
      const targetGlow = isHovered ? 1 : (isColliding ? 0.2 : 0);
      glowIntensity.current += (targetGlow - glowIntensity.current) * 0.1;
      
      // Apply glow effects
      const glowEffect = glowIntensity.current;
      if (glowEffect > 0) {
        material.emissiveIntensity = 0.5 + glowEffect * 0.5;
        pointLight.intensity = 2 + glowEffect * 3;
        
        if (isColliding) {
          // Reddish flare during collision
          material.emissive.setHex(0xff9933);
          pointLight.color.setHex(0xff9933);
          coronaLayers.forEach(layer => {
            layer.material.color.setHex(0xffaa55);
            layer.material.opacity = coronaOpacities[coronaLayers.indexOf(layer)] * (2 + glowEffect);
          });
        } else {
          // Yellowish glow on hover
          material.emissive.setHex(0xff9933);
          pointLight.color.setHex(0xff9933);
          coronaLayers.forEach(layer => {
            layer.material.color.setHex(0xffaa55);
            layer.material.opacity = coronaOpacities[coronaLayers.indexOf(layer)] * (1 + glowEffect * 2);
          });
        }
      } else {
        // Reset to default
        material.emissiveIntensity = 0.5;
        pointLight.intensity = 2;
        material.emissive.setHex(0xff6600);
        pointLight.color.setHex(0xff6600);
        coronaLayers.forEach((layer, i) => {
          layer.material.color.setHex(coronaColors[i]);
          layer.material.opacity = coronaOpacities[i];
        });
      }

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
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
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