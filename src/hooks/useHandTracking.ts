import { useEffect, useRef, useState } from 'react';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

export const useHandTracking = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [expansion, setExpansion] = useState(0);
  const [handPosition, setHandPosition] = useState({ x: 0, y: 0 });
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    const onResults = (results: Results) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        setIsTracking(true);
        
        const landmarks = results.multiHandLandmarks[0];
        const palmBase = landmarks[0];
        
        // Calculate expansion
        const fingerTips = [4, 8, 12, 16, 20];
        let avgDist = 0;
        fingerTips.forEach(index => {
          const tip = landmarks[index];
          const dx = tip.x - palmBase.x;
          const dy = tip.y - palmBase.y;
          avgDist += Math.sqrt(dx * dx + dy * dy);
        });
        avgDist /= fingerTips.length;
        const normalizedExpansion = Math.min(Math.max((avgDist - 0.1) / 0.3, 0), 1);
        setExpansion(prev => prev * 0.8 + normalizedExpansion * 0.2);

        // Calculate position (map 0..1 to -5..5 for X, -4..4 for Y)
        // We mirror X because the camera is usually mirrored for the user
        const targetX = (0.5 - palmBase.x) * 12; 
        const targetY = (0.5 - palmBase.y) * 8;
        
        setHandPosition(prev => ({
          x: prev.x * 0.8 + targetX * 0.2,
          y: prev.y * 0.8 + targetY * 0.2
        }));
      } else {
        setIsTracking(false);
      }
    };

    hands.onResults(onResults);

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current && hands) {
          try {
            await hands.send({ image: videoRef.current });
          } catch (e) {
            console.error("Hands send error", e);
          }
        }
      },
      width: 640,
      height: 480,
    });

    camera.start().catch(err => console.error("Camera start error", err));

    return () => {
      camera.stop();
      hands.close();
    };
  }, []);

  return { videoRef, expansion, handPosition, isTracking };
};
