import React, { useEffect, useRef, useState } from 'react';
import '../../styles/pixelart.css';

export default function PixelChild({ x = 60, animate = 'idle', onWalkDone, scale = 1.8, showBack = false }) {
  const ref = useRef(null);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setBlink(true);
        setTimeout(() => setBlink(false), 150);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (animate === 'walk' && ref.current) {
      const el = ref.current;
      el.style.transition = 'left 2.5s linear';
      el.style.left = `${x}px`;
      const handler = () => onWalkDone?.();
      el.addEventListener('transitionend', handler, { once: true });
      return () => el.removeEventListener('transitionend', handler);
    }
  }, [animate, x]);

  return (
    <div ref={ref} style={{
      position: 'absolute',
      bottom: 30,
      left: x,
      imageRendering: 'pixelated',
      transform: `scale(${scale})`,
      transformOrigin: 'bottom center',
    }}>
      <ChildSprite walking={animate === 'walk'} showBack={showBack} blink={blink} />
    </div>
  );
}

export function ChildSprite({ walking = false, showBack = false, blink = false, style = {} }) {
  const bobAnim = walking ? 'childWalkBob 0.3s ease-in-out infinite alternate' : 'none';
  const imgSrc = showBack ? '/intro/protagonist_back_v5.png' : '/intro/protagonist_front_v5.png';

  return (
    <div style={{ 
      position: 'relative', 
      width: 80, 
      height: 80, 
      imageRendering: 'pixelated', 
      animation: bobAnim, 
      ...style 
    }}>
      <img 
        src={imgSrc} 
        alt="Protagonist" 
        style={{ width: '100%', height: '100%', display: 'block' }} 
      />
      {!showBack && blink && <div className="pixel-blink-overlay" />}
      <style>{`
        @keyframes childWalkBob { from { transform: translateY(0); } to { transform: translateY(-4px); } }
        .pixel-blink-overlay {
          position: absolute; top: 35%; left: 25%; width: 50%; height: 10%;
          background: #f5e1d2; /* Skin tone color to simulate closed eyes */
        }
      `}</style>
    </div>
  );
}

export function ChibiChildSprite({ showBack = false }) {
  const imgSrc = showBack ? '/intro/protagonist_back_v5.png' : '/intro/protagonist_front_v5.png';
  return (
    <div style={{ position: 'relative', width: 56, height: 56, imageRendering: 'pixelated' }}>
      <img 
        src={imgSrc} 
        alt="Protagonist Chibi" 
        style={{ width: '100%', height: '100%', display: 'block' }} 
      />
    </div>
  );
}
