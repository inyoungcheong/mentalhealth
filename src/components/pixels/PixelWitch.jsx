import React, { useState, useEffect } from 'react';
import '../../styles/pixelart.css';

export default function PixelWitch({ x = 300, visible = true, scale = 1.8 }) {
  const [effect, setEffect] = useState('none');

  useEffect(() => {
    const interval = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.8) {
        setEffect(rand > 0.9 ? 'sparkle' : 'smile');
        setTimeout(() => setEffect('none'), 2000);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;
  return (
    <div style={{
      position: 'absolute',
      bottom: 28,
      left: x,
      imageRendering: 'pixelated',
      transform: `scale(${scale})`,
      transformOrigin: 'bottom center',
      animation: 'idle-bob 1.4s ease-in-out infinite',
    }}>
      <WitchSprite effect={effect} />
    </div>
  );
}

export function WitchSprite({ style = {}, effect = 'none' }) {
  return (
    <div style={{ position: 'relative', width: 80, height: 80, imageRendering: 'pixelated', ...style }}>
      <img 
        src="/intro/aira_v5.png" 
        alt="Aira" 
        style={{ width: '100%', height: '100%', display: 'block' }} 
      />
      {effect === 'sparkle' && <div className="pixel-sparkle" />}
      {effect === 'smile' && <div className="pixel-smile-overlay" />}
      <style>{`
        .pixel-sparkle {
          position: absolute; top: 10%; right: 10%; width: 20px; height: 20px;
          background: radial-gradient(circle, #fff 10%, transparent 70%);
          animation: sparkleAnim 0.8s ease-in-out infinite;
        }
        @keyframes sparkleAnim { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1.2); } }
        .pixel-smile-overlay {
          position: absolute; top: 45%; left: 40%; width: 20%; height: 10%;
          border-bottom: 2px solid #ff99aa; border-radius: 50%;
        }
      `}</style>
    </div>
  );
}

export function ChibiWitchSprite() {
  return (
    <div style={{ position: 'relative', width: 56, height: 56, imageRendering: 'pixelated' }}>
      <img 
        src="/intro/aira_v5.png" 
        alt="Aira Chibi" 
        style={{ width: '100%', height: '100%', display: 'block' }} 
      />
    </div>
  );
}
