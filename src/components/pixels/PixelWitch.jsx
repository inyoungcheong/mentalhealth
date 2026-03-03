import React from 'react';
import '../../styles/pixelart.css';

export default function PixelWitch({ x = 300, visible = true, scale = 1.5 }) {
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
      <img 
        src="/intro/aira_new.png" 
        alt="Aira" 
        style={{ width: '64px', height: 'auto', display: 'block' }} 
      />
    </div>
  );
}

export function WitchSprite({ style = {} }) {
  return (
    <div style={{ position: 'relative', width: 64, height: 64, imageRendering: 'pixelated', ...style }}>
      <img 
        src="/intro/aira_new.png" 
        alt="Aira" 
        style={{ width: '100%', height: '100%', display: 'block' }} 
      />
    </div>
  );
}

export function ChibiWitchSprite() {
  return (
    <div style={{ position: 'relative', width: 32, height: 32, imageRendering: 'pixelated' }}>
      <img 
        src="/intro/aira_new.png" 
        alt="Aira Chibi" 
        style={{ width: '100%', height: '100%', display: 'block' }} 
      />
    </div>
  );
}
