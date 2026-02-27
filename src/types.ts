
export type TemplateType = 'sphere' | 'flower';

export interface ParticleConfig {
  color: string;
  template: TemplateType;
  expansion: number; // 0 to 1
  position: { x: number; y: number };
}

export interface HandData {
  isOpen: boolean;
  distance: number;
  position: { x: number; y: number; z: number };
}
