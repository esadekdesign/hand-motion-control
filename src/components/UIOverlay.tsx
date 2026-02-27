import React from 'react';
import { TemplateType, ParticleConfig } from '../types';
import { Circle, Flower, Disc, User, Zap, Palette } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  config: ParticleConfig;
  setConfig: React.Dispatch<React.SetStateAction<ParticleConfig>>;
  isTracking: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const UIOverlay: React.FC<Props> = ({ config, setConfig, isTracking, videoRef }) => {
  const templates: { id: TemplateType; icon: any; label: string }[] = [
    { id: 'sphere', icon: Circle, label: 'Sphere' },
    { id: 'flower', icon: Flower, label: 'Flower' },
  ];

  const colors = [
    '#00ffcc', // Green turquoise
    '#ff0055', // Vibrant Pink
    '#ffff00'  // Vibrant Yellow
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex flex-col justify-between p-8 font-display">
      {/* Top Section */}
      <div className="flex justify-between items-start">
        {/* Left: Title & Status */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl pointer-events-auto shadow-2xl">
          <h1 className="text-4xl font-bold text-white tracking-tighter mb-1">Hand</h1>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Motion Control</p>
          
          <div className="mt-6 flex items-center gap-3">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isTracking ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" : "bg-red-400 animate-pulse"
            )} />
            <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
              {isTracking ? "Live Tracking" : "Searching..."}
            </span>
          </div>

          {/* Expansion Meter */}
          <div className="mt-4 w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300 ease-out"
              style={{ width: `${config.expansion * 100}%`, opacity: isTracking ? 1 : 0.2 }}
            />
          </div>
        </div>

        {/* Right: Camera & Appearance Stack */}
        <div className="flex flex-col items-end gap-4 pointer-events-auto">
          {/* Camera Container */}
          <div className="bg-black/60 backdrop-blur-2xl border border-white/20 p-1 rounded-2xl shadow-2xl overflow-hidden">
            <video
              ref={videoRef}
              className="w-48 h-36 rounded-xl object-cover grayscale brightness-110 contrast-125"
              playsInline
              muted
            />
          </div>

          {/* Appearance Panel */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-2xl w-full max-w-[200px]">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Palette size={14} className="text-white/40" />
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Appearance</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setConfig(prev => ({ ...prev, color: c }))}
                    className={cn(
                      "w-7 h-7 rounded-full border-2 transition-all duration-500 hover:scale-125",
                      config.color === c ? "border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              
              <button
                onClick={() => {
                  setConfig(prev => ({ ...prev, expansion: 1 }));
                  setTimeout(() => setConfig(prev => ({ ...prev, expansion: 0 })), 800);
                }}
                className="mt-2 w-full py-3 bg-white/5 hover:bg-white/10 text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded-xl border border-white/10 transition-all active:scale-95"
              >
                Test Pulse
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-end">
        {/* Left: Instructions */}
        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/5 pointer-events-auto">
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mb-2">Interaction Guide</p>
          <ul className="text-xs text-white/60 space-y-1">
            <li>• Open/Close hand to expand/contract</li>
            <li>• Move hand to move object (X/Y)</li>
            <li>• Live gesture tracking active</li>
          </ul>
        </div>

        {/* Right: Template Controls */}
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 p-2 rounded-[2.5rem] pointer-events-auto flex gap-3 shadow-2xl">
          {templates.map((t) => {
            const Icon = t.icon;
            const active = config.template === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setConfig(prev => ({ ...prev, template: t.id }))}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-16 rounded-[1.8rem] transition-all duration-700 group relative overflow-hidden",
                  active 
                    ? "bg-white text-black shadow-2xl scale-110" 
                    : "text-white/40 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={18} className={cn("mb-1 transition-all duration-700", active ? "scale-110" : "group-hover:scale-110")} />
                <span className="text-[8px] font-bold uppercase tracking-widest">{t.label}</span>
                {active && (
                  <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UIOverlay;
