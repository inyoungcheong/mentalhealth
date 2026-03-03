import React from 'react';
import '../../styles/pixelart.css';

// Aira — character2.png: tall witch hat, teal hair, green eyes, purple dress, staff
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
      <AiraSprite />
    </div>
  );
}

/* Aira palette — character2.png */
const A = {
  // Witch hat
  hat:       '#2a0850',
  hatMid:    '#380a68',
  hatLight:  '#4a1480',
  hatBrim:   '#1e0640',
  hatStar:   '#ffd700',
  // Teal hair
  hair:      '#28b09a',
  hairDark:  '#1a7868',
  hairLight: '#48c8b0',
  // Face
  skin:       '#f5dfc0',
  skinShadow: '#d4b090',
  blush:      'rgba(255,130,130,0.55)',
  eyes:       '#24b848',
  eyeDark:    '#0a6e28',
  eyeHL:      '#e0fff0',
  mouth:      '#d08888',
  brow:       '#1a8868',
  // Dress
  dress:      '#5a1888',
  dressLight: '#7228a8',
  dressDark:  '#3a0860',
  trim:       '#ffd700',
  // Accessories
  hands:     '#f5dfc0',
  boots:     '#1a0830',
  staff:     '#5a3010',
  staffOrb:  '#70e8c8',
};

export function AiraSprite({ style = {} }) {
  return (
    <div style={{ position: 'relative', width: 20, height: 44, imageRendering: 'pixelated', ...style }}>

      {/* ── TEAL HAIR (back layer — behind hat + head) ── */}
      <div style={{ position: 'absolute', top: 8,  left: -1, width: 5, height: 34, background: A.hairDark }} />
      <div style={{ position: 'absolute', top: 8,  left:  0, width: 4, height: 32, background: A.hair }} />
      <div style={{ position: 'absolute', top: 8,  right: -1, width: 5, height: 32, background: A.hairDark }} />
      <div style={{ position: 'absolute', top: 8,  right:  0, width: 4, height: 30, background: A.hair }} />
      {/* Crown hair visible under hat brim */}
      <div style={{ position: 'absolute', top: 8,  left: 3, width: 14, height: 5, background: A.hair }} />
      <div style={{ position: 'absolute', top: 9,  left: 5, width:  9, height: 3, background: A.hairLight, opacity: 0.32 }} />

      {/* ── WITCH HAT ── */}
      {/* Tip */}
      <div style={{ position: 'absolute', top: 0, left: 9, width: 2, height: 2, background: A.hat }} />
      {/* Cone — widens row by row */}
      <div style={{ position: 'absolute', top: 2, left: 8, width:  4, height: 2, background: A.hat }} />
      <div style={{ position: 'absolute', top: 4, left: 7, width:  6, height: 2, background: A.hat }} />
      <div style={{ position: 'absolute', top: 6, left: 6, width:  8, height: 2, background: A.hatMid }} />
      <div style={{ position: 'absolute', top: 8, left: 5, width: 10, height: 2, background: A.hatMid }} />
      {/* Sheen on left edge of cone */}
      <div style={{ position: 'absolute', top: 2, left: 9, width: 1, height: 8, background: A.hatLight, opacity: 0.35 }} />
      {/* Brim */}
      <div style={{ position: 'absolute', top: 9, left: 2, width: 16, height: 3, background: A.hatBrim }} />
      <div style={{ position: 'absolute', top: 9, left: 3, width: 14, height: 1, background: A.hatMid, opacity: 0.55 }} />
      {/* Gold star decoration */}
      <div style={{ position: 'absolute', top: 7, left: 3, fontSize: '5px', color: A.hatStar, lineHeight: 1 }}>★</div>

      {/* ── HEAD ── */}
      <div style={{ position: 'absolute', top: 12, left: 3, width: 14, height: 12, background: A.skin }} />
      {/* Side shadows */}
      <div style={{ position: 'absolute', top: 16, left:  3, width: 2, height: 6, background: A.skinShadow, opacity: 0.28 }} />
      <div style={{ position: 'absolute', top: 16, right: 3, width: 2, height: 6, background: A.skinShadow, opacity: 0.28 }} />
      {/* Blush — round rosy cheeks */}
      <div style={{ position: 'absolute', top: 19, left:  3, width: 4, height: 2, background: A.blush }} />
      <div style={{ position: 'absolute', top: 19, right: 3, width: 4, height: 2, background: A.blush }} />

      {/* Eyes — large round bright green */}
      <div style={{ position: 'absolute', top: 15, left:  4, width: 5, height: 5, background: A.eyes }} />
      <div style={{ position: 'absolute', top: 15, right: 4, width: 5, height: 5, background: A.eyes }} />
      {/* Eye dark center */}
      <div style={{ position: 'absolute', top: 16, left:  5, width: 3, height: 3, background: A.eyeDark }} />
      <div style={{ position: 'absolute', top: 16, right: 5, width: 3, height: 3, background: A.eyeDark }} />
      {/* Eye highlights */}
      <div style={{ position: 'absolute', top: 15, left:  4, width: 2, height: 2, background: A.eyeHL }} />
      <div style={{ position: 'absolute', top: 15, right: 4, width: 2, height: 2, background: A.eyeHL }} />
      <div style={{ position: 'absolute', top: 17, left:  6, width: 1, height: 1, background: 'rgba(200,255,220,0.5)' }} />
      <div style={{ position: 'absolute', top: 17, right: 6, width: 1, height: 1, background: 'rgba(200,255,220,0.5)' }} />
      {/* Eyebrows */}
      <div style={{ position: 'absolute', top: 13, left:  4, width: 5, height: 1, background: A.brow, opacity: 0.85 }} />
      <div style={{ position: 'absolute', top: 13, right: 4, width: 5, height: 1, background: A.brow, opacity: 0.85 }} />
      {/* Nose */}
      <div style={{ position: 'absolute', top: 20, left: 9, width: 2, height: 1, background: A.skinShadow, opacity: 0.5 }} />
      {/* Mouth — knowing smile */}
      <div style={{ position: 'absolute', top: 22, left: 6, width: 8, height: 1, background: A.mouth, opacity: 0.8 }} />
      <div style={{ position: 'absolute', top: 21, right: 6, width: 1, height: 1, background: A.mouth, opacity: 0.45 }} />

      {/* Front bang — teal, covers left of forehead */}
      <div style={{ position: 'absolute', top: 12, left: 3, width: 6, height: 5, background: A.hairDark, opacity: 0.92 }} />
      <div style={{ position: 'absolute', top: 12, left: 4, width: 4, height: 4, background: A.hair }} />
      <div style={{ position: 'absolute', top: 14, left: 5, width: 3, height: 2, background: A.hairLight, opacity: 0.22 }} />

      {/* ── NECK ── */}
      <div style={{ position: 'absolute', top: 24, left: 7, width: 6, height: 3, background: A.skin }} />

      {/* ── DRESS BODY ── */}
      <div style={{ position: 'absolute', top: 26, left: 3, width: 14, height: 10, background: A.dress }} />
      {/* Gold neckline */}
      <div style={{ position: 'absolute', top: 26, left: 3, width: 14, height: 1, background: A.trim }} />
      {/* Dress sheen */}
      <div style={{ position: 'absolute', top: 28, left: 5, width: 4, height: 7, background: A.dressLight, opacity: 0.2 }} />
      {/* Center seam shadow */}
      <div style={{ position: 'absolute', top: 27, left: 9, width: 2, height: 9, background: A.dressDark, opacity: 0.3 }} />

      {/* ── ARMS (dress sleeves) ── */}
      <div style={{ position: 'absolute', top: 26, left:  0, width: 4, height: 8, background: A.dress }} />
      <div style={{ position: 'absolute', top: 26, right: 0, width: 4, height: 8, background: A.dress }} />
      {/* Cuff trim */}
      <div style={{ position: 'absolute', top: 33, left:  0, width: 4, height: 1, background: A.trim, opacity: 0.6 }} />
      <div style={{ position: 'absolute', top: 33, right: 0, width: 4, height: 1, background: A.trim, opacity: 0.6 }} />
      {/* Hands */}
      <div style={{ position: 'absolute', top: 34, left:  0, width: 4, height: 3, background: A.hands }} />
      <div style={{ position: 'absolute', top: 34, right: 0, width: 4, height: 3, background: A.hands }} />

      {/* ── STAFF (left side, teal orb) ── */}
      <div style={{ position: 'absolute', top:  9, left: -4, width: 2, height: 30, background: A.staff }} />
      {/* Staff orb */}
      <div style={{ position: 'absolute', top:  3, left: -8, width: 8, height: 8, background: A.staffOrb,
        borderRadius: '50%', boxShadow: '0 0 5px rgba(112,232,200,0.7)' }} />
      <div style={{ position: 'absolute', top:  5, left: -6, width: 4, height: 3, background: '#c8fff4', opacity: 0.5,
        borderRadius: '50%' }} />

      {/* ── SKIRT FLARE ── */}
      <div style={{ position: 'absolute', top: 36, left: 1, width: 18, height: 5, background: A.dress,
        clipPath: 'polygon(3% 0%, 97% 0%, 100% 100%, 0% 100%)' }} />
      <div style={{ position: 'absolute', top: 36, left: 1, width: 18, height: 1, background: A.trim, opacity: 0.5 }} />

      {/* ── BOOTS ── */}
      <div style={{ position: 'absolute', top: 41, left:  4, width: 5, height: 3, background: A.boots }} />
      <div style={{ position: 'absolute', top: 41, right: 4, width: 5, height: 3, background: A.boots }} />

      {/* Floating sparkle */}
      <div style={{ position: 'absolute', top: 14, right: -5, fontSize: '6px', color: A.hatStar,
        animation: 'sparkle 1.8s ease-in-out infinite', filter: 'drop-shadow(0 0 2px #ffd700)' }}>✦</div>
    </div>
  );
}

// Single sprite used for both map and dialog — just scale/crop differs
export function WitchSprite({ style = {} }) { return <AiraSprite style={style} />; }
export function ChibiWitchSprite() { return <AiraSprite />; }
