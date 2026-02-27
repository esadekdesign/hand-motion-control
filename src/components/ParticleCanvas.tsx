import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { TemplateType, ParticleConfig } from '../types';
import { 
  generateSpherePoints, 
  generateFlowerPoints, 
  TEMPLATE_POINTS 
} from '../constants';

interface Props {
  config: ParticleConfig;
}

const ParticleCanvas: React.FC<Props> = ({ config }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const configRef = useRef(config);
  const targetPointsRef = useRef<Float32Array | null>(null);
  
  // Update ref on every render to avoid stale closures in animation loop
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const targetPoints = useMemo(() => {
    switch (config.template) {
      case 'sphere': return generateSpherePoints(TEMPLATE_POINTS);
      case 'flower': return generateFlowerPoints(TEMPLATE_POINTS);
      default: return generateSpherePoints(TEMPLATE_POINTS);
    }
  }, [config.template]);

  // Update target points ref when template changes
  useEffect(() => {
    targetPointsRef.current = targetPoints;
  }, [targetPoints]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup
    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Clear container before adding new renderer to prevent duplication
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // Geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(TEMPLATE_POINTS * 3);
    // Initialize with current target points
    const initialPoints = targetPointsRef.current || targetPoints;
    for(let i = 0; i < TEMPLATE_POINTS * 3; i++) {
      positions[i] = initialPoints[i];
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Create a circular texture for particles
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);

    // Material
    const material = new THREE.PointsMaterial({
      size: 0.08,
      color: new THREE.Color(config.color),
      transparent: true,
      opacity: 0.6,
      map: texture,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const sceneData = { scene, camera, renderer, points, geometry, material };

    // Animation loop
    let animationId: number;
    let prevExpansion = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      const { points, geometry, material, renderer, scene, camera } = sceneData;
      const currentConfig = configRef.current;
      const currentTargetPoints = targetPointsRef.current;
      
      if (!currentTargetPoints) return;

      // Update object position based on hand position
      points.position.x = currentConfig.position.x;
      points.position.y = currentConfig.position.y;

      // Static rotation (no auto-rotate)
      points.rotation.y = 0;
      points.rotation.x = 0;

      // Detect expansion direction
      const isExpanding = currentConfig.expansion > prevExpansion;
      const lerpFactor = isExpanding ? 0.25 : 0.08; // Faster expansion, slower smooth contraction
      const expansionFactor = 1 + currentConfig.expansion * 6; // Increased multiplier for drama
      const scatterAmount = isExpanding ? currentConfig.expansion * 0.8 : 0; // Scatter only when expanding

      // Update positions with lerp towards target and expansion
      const currentPositions = geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < TEMPLATE_POINTS * 3; i++) {
        // Add random scatter/jitter during expansion for dramatic effect
        const jitter = (Math.random() - 0.5) * scatterAmount;
        const target = currentTargetPoints[i] * expansionFactor + jitter;
        
        // Smoothly move towards target
        currentPositions[i] += (target - currentPositions[i]) * lerpFactor;
      }
      
      prevExpansion = currentConfig.expansion;
      geometry.attributes.position.needsUpdate = true;
      material.color.set(currentConfig.color);
      
      // Dynamic point size based on expansion
      material.size = 0.04 + currentConfig.expansion * 0.08;
      
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      material.dispose();
      geometry.dispose();
      texture.dispose();
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []); // Run only once on mount

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 bg-black">
      <div className="absolute bottom-4 right-4 text-[8px] text-white/10 pointer-events-none uppercase tracking-widest">
        Engine: Three.js / Particles: {TEMPLATE_POINTS} / Template: {config.template}
      </div>
    </div>
  );
};

export default ParticleCanvas;
