import { useState, useEffect } from 'react';
import { useHandTracking } from './hooks/useHandTracking';
import ParticleCanvas from './components/ParticleCanvas';
import UIOverlay from './components/UIOverlay';
import { ParticleConfig } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const { videoRef, expansion, handPosition, isTracking } = useHandTracking();
  const [config, setConfig] = useState<ParticleConfig>({
    color: '#00ffcc',
    template: 'sphere',
    expansion: 0,
    position: { x: 0, y: 0 },
  });

  // Sync expansion and position from hand tracking to config
  useEffect(() => {
    setConfig(prev => ({ 
      ...prev, 
      expansion,
      position: handPosition
    }));
  }, [expansion, handPosition]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* System Status Indicator */}
      <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2 pointer-events-none">
        <div className={cn("w-1.5 h-1.5 rounded-full", isTracking ? "bg-emerald-500" : "bg-red-500 animate-pulse")} />
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
          {isTracking ? "Live Tracking" : "Searching for Hand..."}
        </span>
      </div>

      {/* 3D Scene */}
      <ParticleCanvas config={config} />

      {/* UI Overlay */}
      <UIOverlay 
        config={config} 
        setConfig={setConfig} 
        isTracking={isTracking} 
        videoRef={videoRef}
      />

      {/* Vignette effect */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-[5]" />
    </div>
  );
}
