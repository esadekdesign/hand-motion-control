import * as THREE from 'three';

export const TEMPLATE_POINTS = 5000;

export const generateSpherePoints = (count: number) => {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(-1 + (2 * i) / count);
    const theta = Math.sqrt(count * Math.PI) * phi;
    const r = 2.0;
    
    points[i * 3] = r * Math.cos(theta) * Math.sin(phi);
    points[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
    points[i * 3 + 2] = r * Math.cos(phi);
  }
  return points;
};

export const generateFlowerPoints = (count: number) => {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = Math.random() * Math.PI * 2;
    const p = Math.random() * Math.PI;
    const k = 5; // petals
    const r = Math.sin(k * t) * 2.5;
    
    const x = r * Math.cos(t) * Math.sin(p);
    const y = r * Math.sin(t) * Math.sin(p);
    const z = r * Math.cos(p) * 0.3;
    
    points[i * 3] = x;
    points[i * 3 + 1] = y;
    points[i * 3 + 2] = z;
  }
  return points;
};
