import React, { useEffect, useRef } from 'react';
import '../../styles/pixelart.css';

// Pixel art child character
// Uses CSS div drawing for crisp pixel look
export default function PixelChild({ x = 60, animate = 'idle', onWalkDone, scale = 1.5 }) {
  const ref = useRef(null);

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
      <ChildSprite walking={animate === 'walk'} />
    </div>
  );
}

/* Lospec-style palette: muted, cohesive */
const PALETTE = {
  skin: '#e8c4a0',
  skinShadow: '#c9a882',
  hair: '#4a3828',
  eyes: '#2a2a2a',
  mouth: '#a85a5a',
  shirt: '#4a6a9a',
  shirtBorder: '#3a5a8a',
  pants: '#2a3a5a',
  shoes: '#2a2018',
};

export function ChildSprite({ walking = false, style = {} }) {
  return (
    <div style={{ position: 'relative', width: 20, height: 36, imageRendering: 'pixelated', ...style }}>
      {/* Hair */}
      <div style={{ position: 'absolute', top: 0, left: 4, width: 12, height: 3, background: PALETTE.hair }} />
      {/* Face */}
      <div style={{ position: 'absolute', top: 2, left: 2, width: 16, height: 12, background: PALETTE.skin, border: `1px solid ${PALETTE.skinShadow}` }} />
      {/* Eyes */}
      <div style={{ position: 'absolute', top: 5, left: 4, width: 3, height: 3, background: PALETTE.eyes }} />
      <div style={{ position: 'absolute', top: 5, left: 13, width: 3, height: 3, background: PALETTE.eyes }} />
      {/* Mouth */}
      <div style={{ position: 'absolute', top: 10, left: 7, width: 6, height: 2, background: PALETTE.mouth }} />
      {/* Neck */}
      <div style={{ position: 'absolute', top: 14, left: 7, width: 6, height: 3, background: PALETTE.skin }} />
      {/* Body (shirt) */}
      <div style={{ position: 'absolute', top: 17, left: 2, width: 16, height: 10, background: PALETTE.shirt, border: `1px solid ${PALETTE.shirtBorder}` }} />
      {/* Left arm */}
      <div style={{
        position: 'absolute', top: 17, left: 0, width: 3, height: 8, background: PALETTE.skin,
        transformOrigin: 'top center',
        animation: walking ? 'armSwing 0.3s ease-in-out infinite alternate' : 'none',
      }} />
      {/* Right arm */}
      <div style={{
        position: 'absolute', top: 17, right: 0, width: 3, height: 8, background: PALETTE.skin,
        transformOrigin: 'top center',
        animation: walking ? 'armSwing 0.3s ease-in-out infinite alternate-reverse' : 'none',
      }} />
      {/* Pants */}
      <div style={{ position: 'absolute', top: 27, left: 2, width: 6, height: 6, background: PALETTE.pants }} />
      <div style={{ position: 'absolute', top: 27, left: 12, width: 6, height: 6, background: PALETTE.pants }} />
      {/* Left leg */}
      <div style={{
        position: 'absolute', top: 27, left: 2, width: 6, height: 6, background: PALETTE.pants,
        transformOrigin: 'top center',
        animation: walking ? 'legSwingL 0.3s ease-in-out infinite alternate' : 'none',
      }} />
      {/* Right leg */}
      <div style={{
        position: 'absolute', top: 27, right: 2, width: 6, height: 6, background: PALETTE.pants,
        transformOrigin: 'top center',
        animation: walking ? 'legSwingR 0.3s ease-in-out infinite alternate' : 'none',
      }} />
      {/* Shoes */}
      <div style={{ position: 'absolute', top: 33, left: 1, width: 7, height: 3, background: PALETTE.shoes }} />
      <div style={{ position: 'absolute', top: 33, right: 1, width: 7, height: 3, background: PALETTE.shoes }} />

      <style>{`
        @keyframes armSwing { from { transform: rotate(-20deg); } to { transform: rotate(20deg); } }
        @keyframes legSwingL { from { transform: rotate(-15deg); } to { transform: rotate(15deg); } }
        @keyframes legSwingR { from { transform: rotate(15deg); } to { transform: rotate(-15deg); } }
      `}</style>
    </div>
  );
}
