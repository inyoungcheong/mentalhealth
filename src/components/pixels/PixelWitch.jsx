import React from 'react';
import '../../styles/pixelart.css';

// Pixel art witch - Zelda + Arcana Village style
// Elegant mystical oracle with deep violet robes, silver hair, glowing amber eyes
export default function PixelWitch({ x = 300, visible = true, scale = 1.5 }) {
  if (!visible) return null;
  return (
    <div style={{
      position: 'absolute',
      bottom: 28,
      left: x,
      imageRendering: 'pixelated',
      transform: `scale(${scale}) scaleX(-1)`,
      transformOrigin: 'bottom center',
      animation: 'idle-bob 1.4s ease-in-out infinite',
    }}>
      <WitchSprite />
    </div>
  );
}

/* Arcana Village oracle palette: deep violet, silver, warm gold */
const P = {
  hatBase:    '#2a1a4a',
  hatMid:     '#3d2a6a',
  hatLight:   '#5a3d8a',
  hatBrim:    '#1a0f30',
  hatBand:    '#c8a030',
  hairBase:   '#c8c0d8',
  hairDark:   '#8a80a0',
  hairLight:  '#e8e0f0',
  skin:       '#f0d8c0',
  skinShadow: '#d4b898',
  eyes:       '#d4a020',
  eyeGlow:    '#ffe080',
  eyePupil:   '#2a1a08',
  mouth:      '#c07878',
  robe:       '#3a2060',
  robeMid:    '#4a2878',
  robeDark:   '#251540',
  robeLight:  '#6040a0',
  trim:       '#c8a030',
  trimLight:  '#e8c050',
  sash:       '#8a2040',
  sashLight:  '#b03060',
  cloakIn:    '#1a0f30',
  hands:      '#f0d8c0',
  staff:      '#7a5a30',
  staffDark:  '#4a3818',
  crystal:    '#a060e0',
  crystalGlow:'#d090ff',
  shoes:      '#1a1028',
  shoesTip:   '#2a1a40',
  spark1:     '#e8c050',
  spark2:     '#c090f0',
  spark3:     '#80d0ff',
};

export function WitchSprite({ style = {} }) {
  return (
    <div style={{ position: 'relative', width: 28, height: 58, imageRendering: 'pixelated', ...style }}>

      {/* ===== STAFF (behind body) ===== */}
      <div style={{ position: 'absolute', top: 8, left: -6, width: 3, height: 44, background: P.staff }} />
      <div style={{ position: 'absolute', top: 8, left: -5, width: 1, height: 44, background: P.staffDark, opacity: 0.5 }} />
      <div style={{ position: 'absolute', top: 2, left: -9, width: 9, height: 9, background: P.crystal, borderRadius: '50%', boxShadow: `0 0 4px ${P.crystalGlow}` }} />
      <div style={{ position: 'absolute', top: 3, left: -8, width: 3, height: 3, background: P.crystalGlow, borderRadius: '50%', opacity: 0.7 }} />

      {/* ===== HAT ===== */}
      <div style={{ position: 'absolute', top: 12, left: 0, width: 28, height: 4, background: P.hatBrim }} />
      <div style={{ position: 'absolute', top: 13, left: 1, width: 26, height: 2, background: P.hatMid }} />
      <div style={{ position: 'absolute', top: 11, left: 6, width: 16, height: 2, background: P.hatBand }} />
      <div style={{ position: 'absolute', top: 8, left: 8, width: 12, height: 5, background: P.hatMid }} />
      <div style={{ position: 'absolute', top: 4, left: 9, width: 10, height: 5, background: P.hatMid }} />
      <div style={{ position: 'absolute', top: 1, left: 10, width: 8, height: 4, background: P.hatLight }} />
      <div style={{ position: 'absolute', top: -2, left: 11, width: 6, height: 4, background: P.hatLight }} />
      <div style={{ position: 'absolute', top: -5, left: 12, width: 4, height: 4, background: P.hatBase }} />
      <div style={{ position: 'absolute', top: -8, left: 13, width: 2, height: 4, background: P.hatBase }} />
      <div style={{ position: 'absolute', top: 0, left: 10, width: 5, height: 5, background: P.trimLight,
        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} />

      {/* ===== HAIR ===== */}
      <div style={{ position: 'absolute', top: 14, left: 0, width: 5, height: 18, background: P.hairDark }} />
      <div style={{ position: 'absolute', top: 14, left: 1, width: 4, height: 16, background: P.hairBase }} />
      <div style={{ position: 'absolute', top: 16, left: 1, width: 2, height: 14, background: P.hairLight, opacity: 0.6 }} />
      <div style={{ position: 'absolute', top: 14, right: 0, width: 5, height: 16, background: P.hairDark }} />
      <div style={{ position: 'absolute', top: 14, right: 1, width: 4, height: 14, background: P.hairBase }} />
      <div style={{ position: 'absolute', top: 15, left: 5, width: 3, height: 5, background: P.hairBase }} />
      <div style={{ position: 'absolute', top: 15, left: 20, width: 3, height: 4, background: P.hairBase }} />

      {/* ===== FACE ===== */}
      <div style={{ position: 'absolute', top: 15, left: 5, width: 18, height: 14, background: P.skin }} />
      <div style={{ position: 'absolute', top: 20, left: 5, width: 3, height: 5, background: P.skinShadow, opacity: 0.4 }} />
      <div style={{ position: 'absolute', top: 20, left: 20, width: 3, height: 5, background: P.skinShadow, opacity: 0.4 }} />
      {/* Glowing amber eyes */}
      <div style={{ position: 'absolute', top: 19, left: 8, width: 4, height: 4, background: P.eyes, boxShadow: `0 0 3px ${P.eyeGlow}` }} />
      <div style={{ position: 'absolute', top: 19, left: 16, width: 4, height: 4, background: P.eyes, boxShadow: `0 0 3px ${P.eyeGlow}` }} />
      <div style={{ position: 'absolute', top: 20, left: 9, width: 2, height: 2, background: P.eyePupil }} />
      <div style={{ position: 'absolute', top: 20, left: 17, width: 2, height: 2, background: P.eyePupil }} />
      <div style={{ position: 'absolute', top: 19, left: 9, width: 1, height: 1, background: P.eyeGlow, opacity: 0.9 }} />
      <div style={{ position: 'absolute', top: 19, left: 17, width: 1, height: 1, background: P.eyeGlow, opacity: 0.9 }} />
      {/* Eyebrows */}
      <div style={{ position: 'absolute', top: 17, left: 8, width: 5, height: 1, background: P.hairDark }} />
      <div style={{ position: 'absolute', top: 16, left: 11, width: 2, height: 1, background: P.hairDark }} />
      <div style={{ position: 'absolute', top: 17, left: 15, width: 5, height: 1, background: P.hairDark }} />
      <div style={{ position: 'absolute', top: 16, left: 15, width: 2, height: 1, background: P.hairDark }} />
      {/* Nose */}
      <div style={{ position: 'absolute', top: 24, left: 13, width: 2, height: 2, background: P.skinShadow }} />
      {/* Mouth */}
      <div style={{ position: 'absolute', top: 27, left: 10, width: 8, height: 2, background: P.mouth }} />
      <div style={{ position: 'absolute', top: 28, left: 16, width: 3, height: 1, background: P.mouth }} />

      {/* ===== NECK ===== */}
      <div style={{ position: 'absolute', top: 29, left: 10, width: 8, height: 4, background: P.skin }} />

      {/* ===== ROBE COLLAR ===== */}
      <div style={{ position: 'absolute', top: 30, left: 5, width: 18, height: 5, background: P.robeMid }} />
      <div style={{ position: 'absolute', top: 30, left: 5, width: 18, height: 2, background: P.trim }} />
      <div style={{ position: 'absolute', top: 31, left: 12, width: 4, height: 6, background: P.cloakIn,
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />

      {/* ===== ROBE BODY ===== */}
      <div style={{ position: 'absolute', top: 33, left: 2, width: 24, height: 16, background: P.robe }} />
      <div style={{ position: 'absolute', top: 34, left: 4, width: 5, height: 12, background: P.robeLight, opacity: 0.25 }} />
      <div style={{ position: 'absolute', top: 33, left: 2, width: 3, height: 16, background: P.robeDark }} />
      <div style={{ position: 'absolute', top: 33, left: 23, width: 3, height: 16, background: P.robeDark }} />
      <div style={{ position: 'absolute', top: 33, left: 13, width: 2, height: 16, background: P.trim }} />
      {/* Sash */}
      <div style={{ position: 'absolute', top: 40, left: 2, width: 24, height: 4, background: P.sash }} />
      <div style={{ position: 'absolute', top: 41, left: 3, width: 22, height: 2, background: P.sashLight, opacity: 0.5 }} />
      <div style={{ position: 'absolute', top: 39, left: 11, width: 6, height: 6, background: P.sash, border: `1px solid ${P.sashLight}` }} />

      {/* ===== SLEEVES ===== */}
      <div style={{ position: 'absolute', top: 33, left: -2, width: 7, height: 14, background: P.robeDark }} />
      <div style={{ position: 'absolute', top: 34, left: -1, width: 5, height: 12, background: P.robe }} />
      <div style={{ position: 'absolute', top: 45, left: -3, width: 9, height: 2, background: P.trim }} />
      <div style={{ position: 'absolute', top: 47, left: -1, width: 5, height: 4, background: P.hands }} />
      <div style={{ position: 'absolute', top: 33, right: -2, width: 7, height: 14, background: P.robeDark }} />
      <div style={{ position: 'absolute', top: 34, right: -1, width: 5, height: 12, background: P.robe }} />
      <div style={{ position: 'absolute', top: 45, right: -3, width: 9, height: 2, background: P.trim }} />
      <div style={{ position: 'absolute', top: 47, right: -1, width: 5, height: 4, background: P.hands }} />

      {/* Mini tarot card */}
      <div style={{
        position: 'absolute', top: 40, left: -8, width: 7, height: 10,
        background: P.cloakIn, border: `1px solid ${P.trim}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '5px',
      }}>
        <span style={{ color: P.trimLight }}>✦</span>
      </div>

      {/* ===== ROBE SKIRT ===== */}
      <div style={{ position: 'absolute', top: 49, left: 0, width: 28, height: 6, background: P.robeMid }} />
      <div style={{ position: 'absolute', top: 53, left: -2, width: 32, height: 4, background: P.robe }} />
      <div style={{ position: 'absolute', top: 55, left: -2, width: 32, height: 2, background: P.trim }} />

      {/* ===== SHOES ===== */}
      <div style={{ position: 'absolute', top: 55, left: 2, width: 9, height: 3, background: P.shoes }} />
      <div style={{ position: 'absolute', top: 56, left: 0, width: 3, height: 2, background: P.shoesTip }} />
      <div style={{ position: 'absolute', top: 55, right: 2, width: 9, height: 3, background: P.shoes }} />
      <div style={{ position: 'absolute', top: 56, right: 0, width: 3, height: 2, background: P.shoesTip }} />

      {/* ===== MAGIC SPARKLES ===== */}
      <div style={{
        position: 'absolute', top: 5, right: -4,
        color: P.spark1, fontSize: '7px',
        animation: 'sparkle 1.6s ease-in-out infinite',
        filter: `drop-shadow(0 0 2px ${P.spark1})`,
      }}>✦</div>
      <div style={{
        position: 'absolute', top: 18, right: -8,
        color: P.spark2, fontSize: '5px',
        animation: 'sparkle 2.2s ease-in-out infinite 0.4s',
        filter: `drop-shadow(0 0 2px ${P.spark2})`,
      }}>★</div>
      <div style={{
        position: 'absolute', top: 35, right: -6,
        color: P.spark3, fontSize: '4px',
        animation: 'sparkle 1.9s ease-in-out infinite 0.8s',
        filter: `drop-shadow(0 0 2px ${P.spark3})`,
      }}>◆</div>
    </div>
  );
}
