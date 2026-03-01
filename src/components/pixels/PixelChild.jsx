import React, { useEffect, useRef } from 'react';
import '../../styles/pixelart.css';

// Pixel art child character - Zelda + Arcana Village style
// Warm adventurous hero with green tunic, golden hair, elf ears
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

/* Zelda + Arcana Village palette: warm hero tones */
const PALETTE = {
  skin:        '#f2c896',
  skinShadow:  '#d4a070',
  skinDeep:    '#b88050',
  hair:        '#d4901a',
  hairDark:    '#8a5a08',
  eyes:        '#2a7a3a',
  eyeShine:    '#90e0a8',
  mouth:       '#c87070',
  tunic:       '#4a9a3a',
  tunicDark:   '#2a6a1a',
  tunicLight:  '#70ba50',
  belt:        '#7a5018',
  beltBuckle:  '#e8c040',
  pants:       '#d4b858',
  pantsDark:   '#a89040',
  boots:       '#5a3818',
  bootsDark:   '#3a2008',
  bootsLight:  '#7a5030',
  bag:         '#8a6828',
};

export function ChildSprite({ walking = false, style = {} }) {
  const legLAnim = walking ? 'childLegL 0.38s ease-in-out infinite alternate' : 'none';
  const legRAnim = walking ? 'childLegR 0.38s ease-in-out infinite alternate' : 'none';
  const armLAnim = walking ? 'childArmL 0.38s ease-in-out infinite alternate' : 'none';
  const armRAnim = walking ? 'childArmR 0.38s ease-in-out infinite alternate' : 'none';

  return (
    <div style={{ position: 'relative', width: 24, height: 42, imageRendering: 'pixelated', ...style }}>

      {/* === HAIR === */}
      <div style={{ position: 'absolute', top: 0, left: 4, width: 16, height: 3, background: PALETTE.hairDark }} />
      <div style={{ position: 'absolute', top: 0, left: 5, width: 14, height: 2, background: PALETTE.hair }} />
      {/* Side tufts */}
      <div style={{ position: 'absolute', top: 2, left: 2, width: 3, height: 7, background: PALETTE.hair }} />
      <div style={{ position: 'absolute', top: 2, left: 19, width: 3, height: 6, background: PALETTE.hair }} />
      {/* Fringe */}
      <div style={{ position: 'absolute', top: 3, left: 6, width: 5, height: 2, background: PALETTE.hair }} />
      <div style={{ position: 'absolute', top: 3, left: 13, width: 4, height: 2, background: PALETTE.hairDark }} />

      {/* === HEAD === */}
      <div style={{ position: 'absolute', top: 2, left: 4, width: 16, height: 13, background: PALETTE.skin }} />
      {/* Cheek blush */}
      <div style={{ position: 'absolute', top: 9, left: 4, width: 3, height: 2, background: '#f0a0a0', opacity: 0.45 }} />
      <div style={{ position: 'absolute', top: 9, left: 17, width: 3, height: 2, background: '#f0a0a0', opacity: 0.45 }} />
      {/* Elf ear left */}
      <div style={{ position: 'absolute', top: 6, left: 2, width: 3, height: 5, background: PALETTE.skin }} />
      <div style={{ position: 'absolute', top: 5, left: 2, width: 2, height: 2, background: PALETTE.skin }} />
      {/* Elf ear right */}
      <div style={{ position: 'absolute', top: 6, left: 19, width: 3, height: 5, background: PALETTE.skin }} />
      <div style={{ position: 'absolute', top: 5, left: 20, width: 2, height: 2, background: PALETTE.skin }} />

      {/* === EYES === */}
      <div style={{ position: 'absolute', top: 7, left: 7, width: 3, height: 3, background: PALETTE.eyes }} />
      <div style={{ position: 'absolute', top: 7, left: 14, width: 3, height: 3, background: PALETTE.eyes }} />
      {/* Eye shine */}
      <div style={{ position: 'absolute', top: 7, left: 8, width: 1, height: 1, background: PALETTE.eyeShine }} />
      <div style={{ position: 'absolute', top: 7, left: 15, width: 1, height: 1, background: PALETTE.eyeShine }} />
      {/* Eyebrows */}
      <div style={{ position: 'absolute', top: 5, left: 7, width: 4, height: 1, background: PALETTE.hairDark }} />
      <div style={{ position: 'absolute', top: 5, left: 13, width: 4, height: 1, background: PALETTE.hairDark }} />
      {/* Nose */}
      <div style={{ position: 'absolute', top: 11, left: 11, width: 2, height: 1, background: PALETTE.skinShadow }} />
      {/* Mouth */}
      <div style={{ position: 'absolute', top: 13, left: 9, width: 6, height: 2, background: PALETTE.mouth }} />

      {/* === NECK === */}
      <div style={{ position: 'absolute', top: 15, left: 9, width: 6, height: 3, background: PALETTE.skin }} />

      {/* === GREEN TUNIC === */}
      <div style={{ position: 'absolute', top: 18, left: 4, width: 16, height: 11, background: PALETTE.tunic }} />
      {/* Tunic highlight */}
      <div style={{ position: 'absolute', top: 19, left: 5, width: 4, height: 7, background: PALETTE.tunicLight, opacity: 0.38 }} />
      {/* Tunic shadow */}
      <div style={{ position: 'absolute', top: 18, left: 4, width: 2, height: 11, background: PALETTE.tunicDark }} />
      <div style={{ position: 'absolute', top: 18, left: 18, width: 2, height: 11, background: PALETTE.tunicDark }} />
      {/* Belt */}
      <div style={{ position: 'absolute', top: 26, left: 4, width: 16, height: 3, background: PALETTE.belt }} />
      {/* Belt buckle */}
      <div style={{ position: 'absolute', top: 26, left: 10, width: 4, height: 3, background: PALETTE.beltBuckle }} />

      {/* === ARMS === */}
      <div style={{
        position: 'absolute', top: 18, left: 1, width: 4, height: 10, background: PALETTE.tunic,
        transformOrigin: 'top center', animation: armLAnim,
      }} />
      <div style={{
        position: 'absolute', top: 27, left: 1, width: 4, height: 3, background: PALETTE.skin,
        transformOrigin: 'top center', animation: armLAnim,
      }} />
      <div style={{
        position: 'absolute', top: 18, right: 1, width: 4, height: 10, background: PALETTE.tunic,
        transformOrigin: 'top center', animation: armRAnim,
      }} />
      <div style={{
        position: 'absolute', top: 27, right: 1, width: 4, height: 3, background: PALETTE.skin,
        transformOrigin: 'top center', animation: armRAnim,
      }} />

      {/* === TUNIC SKIRT FLARE === */}
      <div style={{ position: 'absolute', top: 29, left: 3, width: 18, height: 4, background: PALETTE.tunicDark }} />
      <div style={{ position: 'absolute', top: 29, left: 4, width: 16, height: 3, background: PALETTE.tunic }} />

      {/* === PANTS/TIGHTS === */}
      <div style={{
        position: 'absolute', top: 32, left: 4, width: 7, height: 5, background: PALETTE.pants,
        transformOrigin: 'top center', animation: legLAnim,
      }} />
      <div style={{
        position: 'absolute', top: 32, left: 13, width: 7, height: 5, background: PALETTE.pants,
        transformOrigin: 'top center', animation: legRAnim,
      }} />

      {/* === BOOTS === */}
      <div style={{
        position: 'absolute', top: 36, left: 3, width: 8, height: 6, background: PALETTE.boots,
        transformOrigin: 'top center', animation: legLAnim,
      }} />
      <div style={{
        position: 'absolute', top: 36, left: 13, width: 8, height: 6, background: PALETTE.boots,
        transformOrigin: 'top center', animation: legRAnim,
      }} />
      {/* Boot highlight */}
      <div style={{ position: 'absolute', top: 37, left: 4, width: 3, height: 1, background: PALETTE.bootsLight }} />
      <div style={{ position: 'absolute', top: 37, left: 14, width: 3, height: 1, background: PALETTE.bootsLight }} />

      {/* === SATCHEL === */}
      <div style={{ position: 'absolute', top: 22, left: -2, width: 5, height: 6, background: PALETTE.bag, border: `1px solid ${PALETTE.hairDark}`, borderRadius: 1 }} />
      <div style={{ position: 'absolute', top: 23, left: -1, width: 3, height: 1, background: PALETTE.beltBuckle }} />

      <style>{`
        @keyframes childArmL  { from { transform: rotate(-18deg); } to { transform: rotate(18deg); } }
        @keyframes childArmR  { from { transform: rotate(18deg);  } to { transform: rotate(-18deg); } }
        @keyframes childLegL  { from { transform: rotate(-14deg); } to { transform: rotate(14deg); } }
        @keyframes childLegR  { from { transform: rotate(14deg);  } to { transform: rotate(-14deg); } }
      `}</style>
    </div>
  );
}
