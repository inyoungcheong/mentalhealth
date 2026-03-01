import React, { useEffect, useRef } from 'react';
import '../../styles/pixelart.css';

// Pixel art child character - Tarot Journey unique style
// A mystical traveler with a hooded cloak, deep blue/purple tones
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

/* Tarot Journey palette: mystical traveler tones */
const PALETTE = {
  skin:        '#f5d5b0',
  skinShadow:  '#d4b08c',
  hair:        '#4a3a2a', // Dark brown hair
  hairDark:    '#2a1a0a',
  eyes:        '#4a90e2', // Bright blue eyes
  eyeShine:    '#ffffff',
  mouth:       '#d48c8c',
  cloak:       '#2c1a4d', // Deep purple cloak
  cloakDark:   '#1a0a2d',
  cloakLight:  '#4a2a6d',
  tunic:       '#3a3a3a', // Dark grey inner tunic
  tunicDark:   '#1a1a1a',
  belt:        '#c0c0c0', // Silver belt
  beltBuckle:  '#ffd700', // Gold buckle
  pants:       '#2a2a2a', // Charcoal pants
  boots:       '#3a2a1a', // Dark brown boots
  bootsDark:   '#1a0a00',
  bag:         '#5a3a1a', // Leather satchel
};

export function ChildSprite({ walking = false, style = {} }) {
  const legLAnim = walking ? 'childLegL 0.38s ease-in-out infinite alternate' : 'none';
  const legRAnim = walking ? 'childLegR 0.38s ease-in-out infinite alternate' : 'none';
  const armLAnim = walking ? 'childArmL 0.38s ease-in-out infinite alternate' : 'none';
  const armRAnim = walking ? 'childArmR 0.38s ease-in-out infinite alternate' : 'none';

  return (
    <div style={{ position: 'relative', width: 24, height: 42, imageRendering: 'pixelated', ...style }}>

      {/* === HAIR === */}
      <div style={{ position: 'absolute', top: 2, left: 5, width: 14, height: 5, background: PALETTE.hair }} />
      <div style={{ position: 'absolute', top: 3, left: 4, width: 16, height: 3, background: PALETTE.hairDark }} />

      {/* === HEAD === */}
      <div style={{ position: 'absolute', top: 4, left: 5, width: 14, height: 12, background: PALETTE.skin }} />
      
      {/* === EYES === */}
      <div style={{ position: 'absolute', top: 8, left: 7, width: 3, height: 3, background: PALETTE.eyes }} />
      <div style={{ position: 'absolute', top: 8, left: 14, width: 3, height: 3, background: PALETTE.eyes }} />
      {/* Eye shine */}
      <div style={{ position: 'absolute', top: 8, left: 8, width: 1, height: 1, background: PALETTE.eyeShine }} />
      <div style={{ position: 'absolute', top: 8, left: 15, width: 1, height: 1, background: PALETTE.eyeShine }} />
      
      {/* Nose */}
      <div style={{ position: 'absolute', top: 12, left: 11, width: 2, height: 1, background: PALETTE.skinShadow }} />
      {/* Mouth */}
      <div style={{ position: 'absolute', top: 14, left: 10, width: 4, height: 1, background: PALETTE.mouth }} />

      {/* === HOODED CLOAK === */}
      {/* Hood top */}
      <div style={{ position: 'absolute', top: 0, left: 4, width: 16, height: 4, background: PALETTE.cloak }} />
      <div style={{ position: 'absolute', top: 1, left: 3, width: 18, height: 3, background: PALETTE.cloakDark }} />
      {/* Hood sides */}
      <div style={{ position: 'absolute', top: 4, left: 3, width: 3, height: 12, background: PALETTE.cloak }} />
      <div style={{ position: 'absolute', top: 4, left: 18, width: 3, height: 12, background: PALETTE.cloak }} />
      
      {/* Cloak body */}
      <div style={{ position: 'absolute', top: 16, left: 3, width: 18, height: 15, background: PALETTE.cloak }} />
      <div style={{ position: 'absolute', top: 17, left: 4, width: 16, height: 13, background: PALETTE.cloakLight, opacity: 0.3 }} />
      
      {/* === INNER TUNIC & BELT === */}
      <div style={{ position: 'absolute', top: 18, left: 8, width: 8, height: 10, background: PALETTE.tunic }} />
      <div style={{ position: 'absolute', top: 26, left: 8, width: 8, height: 2, background: PALETTE.belt }} />
      <div style={{ position: 'absolute', top: 26, left: 11, width: 2, height: 2, background: PALETTE.beltBuckle }} />

      {/* === ARMS === */}
      <div style={{
        position: 'absolute', top: 18, left: 1, width: 4, height: 10, background: PALETTE.cloak,
        transformOrigin: 'top center', animation: armLAnim,
      }} />
      <div style={{
        position: 'absolute', top: 27, left: 1, width: 4, height: 3, background: PALETTE.skin,
        transformOrigin: 'top center', animation: armLAnim,
      }} />
      <div style={{
        position: 'absolute', top: 18, right: 1, width: 4, height: 10, background: PALETTE.cloak,
        transformOrigin: 'top center', animation: armRAnim,
      }} />
      <div style={{
        position: 'absolute', top: 27, right: 1, width: 4, height: 3, background: PALETTE.skin,
        transformOrigin: 'top center', animation: armRAnim,
      }} />

      {/* === PANTS === */}
      <div style={{
        position: 'absolute', top: 31, left: 6, width: 5, height: 6, background: PALETTE.pants,
        transformOrigin: 'top center', animation: legLAnim,
      }} />
      <div style={{
        position: 'absolute', top: 31, left: 13, width: 5, height: 6, background: PALETTE.pants,
        transformOrigin: 'top center', animation: legRAnim,
      }} />

      {/* === BOOTS === */}
      <div style={{
        position: 'absolute', top: 36, left: 5, width: 7, height: 6, background: PALETTE.boots,
        transformOrigin: 'top center', animation: legLAnim,
      }} />
      <div style={{
        position: 'absolute', top: 36, left: 12, width: 7, height: 6, background: PALETTE.boots,
        transformOrigin: 'top center', animation: legRAnim,
      }} />

      {/* === SATCHEL === */}
      <div style={{ position: 'absolute', top: 22, left: 18, width: 6, height: 8, background: PALETTE.bag, border: `1px solid ${PALETTE.bootsDark}`, borderRadius: 1 }} />
      <div style={{ position: 'absolute', top: 24, left: 19, width: 4, height: 1, background: PALETTE.beltBuckle }} />

      <style>{`
        @keyframes childArmL  { from { transform: rotate(-15deg); } to { transform: rotate(15deg); } }
        @keyframes childArmR  { from { transform: rotate(15deg);  } to { transform: rotate(-15deg); } }
        @keyframes childLegL  { from { transform: rotate(-12deg); } to { transform: rotate(12deg); } }
        @keyframes childLegR  { from { transform: rotate(12deg);  } to { transform: rotate(-12deg); } }
      `}</style>
    </div>
  );
}
