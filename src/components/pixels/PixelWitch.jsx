import React from 'react';
import '../../styles/pixelart.css';

// Aira — deep magenta hair, metallic tiara, violet eyes, near-black robe, no hat
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

/* Aira palette — K-pop demon-hunter mystical */
const A = {
  // Deep magenta hair
  hair:        '#bb2649',
  hairDark:    '#851b35',
  hairLight:   '#d83060',
  // Metallic tiara
  tiara:       '#a8b4c4',
  tiaraMoon:   '#c0ccd8',
  tiaraGem:    '#b878f0',
  // Face
  skin:        '#f0d8c0',
  skinShadow:  '#d4b898',
  eyes:        '#8050cc',  // violet
  eyeGlow:     '#b878f0',
  eyePupil:    '#18082a',
  blush:       'rgba(220,150,160,0.30)',
  mouth:       '#c07878',
  // Near-black robe
  robe:        '#100820',
  robeMid:     '#1a1038',
  robeLight:   '#281848',
  robeDark:    '#08040e',
  cloakIn:     '#08040e',
  trim:        '#c8a030',
  trimLight:   '#e8c050',
  belt:        '#0e0820',
  beltBuckle:  '#c8a030',
  hands:       '#f0d8c0',
  shoes:       '#1a1028',
  shoesTip:    '#281840',
  spark1:      '#e8c050',
  spark2:      '#c090f0',
  spark3:      '#80d0ff',
  crystalGlow: '#c898ff',
};

export function WitchSprite({ style = {} }) {
  return (
    <div style={{ position: 'relative', width: 28, height: 58, imageRendering: 'pixelated', ...style }}>

      {/* ===== LONG MAGENTA HAIR — behind everything ===== */}
      {/* Left cascade — extends slightly beyond sprite edge */}
      <div style={{ position: 'absolute', top: 1, left: -2, width: 10, height: 52, background: A.hairDark }} />
      <div style={{ position: 'absolute', top: 1, left: -1, width: 8,  height: 50, background: A.hair }} />
      <div style={{ position: 'absolute', top: 4, left:  0, width: 3,  height: 42, background: A.hairLight, opacity: 0.4 }} />
      {/* Right cascade */}
      <div style={{ position: 'absolute', top: 1, right: -2, width: 10, height: 50, background: A.hairDark }} />
      <div style={{ position: 'absolute', top: 1, right: -1, width: 8,  height: 48, background: A.hair }} />
      <div style={{ position: 'absolute', top: 4, right:  0, width: 3,  height: 40, background: A.hairLight, opacity: 0.35 }} />
      {/* Crown — fills center top so crescent moon has hair behind it */}
      <div style={{ position: 'absolute', top: 0, left: 6, width: 16, height: 12, background: A.hair }} />
      <div style={{ position: 'absolute', top: 0, left: 9, width: 10, height:  5, background: A.hairLight, opacity: 0.28 }} />

      {/* ===== TIARA — metallic crescent crown ===== */}
      <div style={{ position: 'absolute', top: 10, left: 5, width: 18, height: 2, background: A.tiara, boxShadow: '0 0 4px rgba(195,210,255,0.7)' }} />
      {/* Side gems */}
      <div style={{ position: 'absolute', top: 9, left:  7, width: 2, height: 2, background: A.tiaraGem, borderRadius: 1, boxShadow: '0 0 3px rgba(178,120,255,0.85)' }} />
      <div style={{ position: 'absolute', top: 9, left: 19, width: 2, height: 2, background: A.tiaraGem, borderRadius: 1, boxShadow: '0 0 3px rgba(178,120,255,0.85)' }} />
      {/* Crescent moon — silver circle + hair-colored "bite" offset right */}
      <div style={{ position: 'absolute', top: 6, left: 11, width: 5, height: 6, background: A.tiaraMoon, borderRadius: '50%', boxShadow: '0 0 5px rgba(210,225,255,0.9)' }} />
      <div style={{ position: 'absolute', top: 5, left: 13, width: 5, height: 6, background: A.hair,     borderRadius: '50%' }} />

      {/* ===== FACE ===== */}
      <div style={{ position: 'absolute', top: 12, left:  5, width: 18, height: 15, background: A.skin }} />
      {/* Side shadows */}
      <div style={{ position: 'absolute', top: 18, left:  5, width: 3, height: 5, background: A.skinShadow, opacity: 0.35 }} />
      <div style={{ position: 'absolute', top: 18, left: 20, width: 3, height: 5, background: A.skinShadow, opacity: 0.35 }} />
      {/* Blush */}
      <div style={{ position: 'absolute', top: 22, left:  6, width: 3, height: 2, background: A.blush, borderRadius: 1 }} />
      <div style={{ position: 'absolute', top: 22, left: 19, width: 3, height: 2, background: A.blush, borderRadius: 1 }} />

      {/* === EYES — violet glow === */}
      <div style={{ position: 'absolute', top: 17, left:  8, width: 4, height: 4, background: A.eyes, boxShadow: `0 0 6px ${A.eyeGlow}, 0 0 2px ${A.eyeGlow}` }} />
      <div style={{ position: 'absolute', top: 18, left:  9, width: 2, height: 2, background: A.eyePupil }} />
      <div style={{ position: 'absolute', top: 17, left: 10, width: 1, height: 1, background: A.eyeGlow, opacity: 0.9 }} />
      <div style={{ position: 'absolute', top: 17, left: 16, width: 4, height: 4, background: A.eyes, boxShadow: `0 0 6px ${A.eyeGlow}, 0 0 2px ${A.eyeGlow}` }} />
      <div style={{ position: 'absolute', top: 18, left: 17, width: 2, height: 2, background: A.eyePupil }} />
      <div style={{ position: 'absolute', top: 17, left: 18, width: 1, height: 1, background: A.eyeGlow, opacity: 0.9 }} />
      {/* Eyebrows — sharp arch */}
      <div style={{ position: 'absolute', top: 15, left:  8, width: 5, height: 1, background: A.hairDark, transform: 'rotate(-5deg)' }} />
      <div style={{ position: 'absolute', top: 15, left: 15, width: 5, height: 1, background: A.hairDark, transform: 'rotate(5deg)'  }} />
      {/* Nose */}
      <div style={{ position: 'absolute', top: 23, left: 13, width: 2, height: 2, background: A.skinShadow }} />
      {/* Smirk — asymmetric (left side slightly higher) */}
      <div style={{ position: 'absolute', top: 25, left: 10, width: 2, height: 1, background: A.mouth, opacity: 0.9 }} />
      <div style={{ position: 'absolute', top: 26, left: 12, width: 4, height: 1, background: A.mouth }} />
      <div style={{ position: 'absolute', top: 25, left: 16, width: 1, height: 1, background: A.mouth, opacity: 0.6 }} />

      {/* ===== ASYMMETRIC BANG — covers left eye partially (renders after eyes) ===== */}
      <div style={{ position: 'absolute', top: 11, left:  4, width: 8, height: 11, background: A.hairDark, opacity: 0.93 }} />
      <div style={{ position: 'absolute', top: 11, left:  5, width: 6, height:  9, background: A.hair }} />
      {/* Tapered bang tip */}
      <div style={{ position: 'absolute', top: 18, left:  6, width: 4, height:  4, background: A.hairDark, opacity: 0.65 }} />

      {/* ===== NECK ===== */}
      <div style={{ position: 'absolute', top: 27, left: 10, width: 8, height: 4, background: A.skin }} />

      {/* ===== ROBE COLLAR ===== */}
      <div style={{ position: 'absolute', top: 28, left: 5, width: 18, height: 5, background: A.robeMid }} />
      <div style={{ position: 'absolute', top: 28, left: 5, width: 18, height: 2, background: A.trim }} />
      {/* V-neck opening */}
      <div style={{ position: 'absolute', top: 29, left: 12, width: 4, height: 7, background: A.cloakIn, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />

      {/* ===== ROBE BODY ===== */}
      <div style={{ position: 'absolute', top: 31, left: 3, width: 22, height: 18, background: A.robe }} />
      {/* Sheen */}
      <div style={{ position: 'absolute', top: 32, left: 5, width: 5, height: 14, background: A.robeLight, opacity: 0.18 }} />
      {/* Edge darks */}
      <div style={{ position: 'absolute', top: 31, left:  3, width: 3, height: 18, background: A.robeDark }} />
      <div style={{ position: 'absolute', top: 31, left: 22, width: 3, height: 18, background: A.robeDark }} />
      {/* Center gold trim line */}
      <div style={{ position: 'absolute', top: 31, left: 13, width: 2, height: 18, background: A.trim }} />
      {/* Subtle robe texture lines */}
      <div style={{ position: 'absolute', top: 34, left:  7, width: 1, height: 7, background: A.robeLight, opacity: 0.22, transform: 'rotate(12deg)' }} />
      <div style={{ position: 'absolute', top: 38, left: 11, width: 1, height: 6, background: A.robeLight, opacity: 0.18, transform: 'rotate(12deg)' }} />

      {/* ===== BELT + TAROT HOLSTER ===== */}
      <div style={{ position: 'absolute', top: 40, left: 3, width: 22, height: 3, background: A.belt }} />
      <div style={{ position: 'absolute', top: 40, left: 11, width: 6, height: 3, background: A.beltBuckle, opacity: 0.75 }} />
      {/* Holster strap */}
      <div style={{ position: 'absolute', top: 38, left: 1, width: 2, height: 7, background: A.trim, opacity: 0.65 }} />
      {/* Holster */}
      <div style={{ position: 'absolute', top: 40, left: -8, width: 7, height: 9, background: A.robeDark, border: `1px solid ${A.trim}` }} />
      <div style={{ position: 'absolute', top: 41, left: -7, fontSize: '4px', color: A.trimLight, lineHeight: 1 }}>✦</div>

      {/* ===== SLEEVES ===== */}
      <div style={{ position: 'absolute', top: 31, left: -1, width: 7, height: 14, background: A.robeDark }} />
      <div style={{ position: 'absolute', top: 32, left:  0, width: 5, height: 12, background: A.robe }} />
      <div style={{ position: 'absolute', top: 43, left: -3, width: 9, height: 2, background: A.trim }} />
      {/* Left hand */}
      <div style={{ position: 'absolute', top: 45, left: 0, width: 5, height: 4, background: A.hands }} />
      {/* Tarot card in left hand */}
      <div style={{
        position: 'absolute', top: 41, left: -13, width: 8, height: 11,
        background: A.robeDark, border: `1px solid ${A.trimLight}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '5px', boxShadow: `0 0 6px rgba(200,160,48,0.45)`,
      }}>
        <span style={{ color: A.trimLight }}>★</span>
      </div>
      {/* Right sleeve */}
      <div style={{ position: 'absolute', top: 31, right: -1, width: 7, height: 14, background: A.robeDark }} />
      <div style={{ position: 'absolute', top: 32, right:  0, width: 5, height: 12, background: A.robe }} />
      <div style={{ position: 'absolute', top: 43, right: -3, width: 9, height: 2, background: A.trim }} />
      {/* Right hand */}
      <div style={{ position: 'absolute', top: 45, right: 0, width: 5, height: 4, background: A.hands }} />

      {/* ===== ROBE SKIRT ===== */}
      <div style={{ position: 'absolute', top: 49, left: 0,  width: 28, height: 6, background: A.robeMid }} />
      <div style={{ position: 'absolute', top: 53, left: -2, width: 32, height: 4, background: A.robe }} />
      <div style={{ position: 'absolute', top: 55, left: -2, width: 32, height: 2, background: A.trim }} />

      {/* ===== SHOES ===== */}
      <div style={{ position: 'absolute', top: 55, left:  2, width: 9, height: 3, background: A.shoes }} />
      <div style={{ position: 'absolute', top: 56, left:  0, width: 3, height: 2, background: A.shoesTip }} />
      <div style={{ position: 'absolute', top: 55, right: 2, width: 9, height: 3, background: A.shoes }} />
      <div style={{ position: 'absolute', top: 56, right: 0, width: 3, height: 2, background: A.shoesTip }} />

      {/* ===== MAGIC SPARKLES ===== */}
      <div style={{ position: 'absolute', top: 3,  right: -5, color: A.spark1, fontSize: '8px', animation: 'sparkle 1.6s ease-in-out infinite',        filter: `drop-shadow(0 0 3px ${A.spark1})` }}>✦</div>
      <div style={{ position: 'absolute', top: 15, right: -9, color: A.spark2, fontSize: '6px', animation: 'sparkle 2.2s ease-in-out infinite 0.4s',   filter: `drop-shadow(0 0 3px ${A.spark2})` }}>★</div>
      <div style={{ position: 'absolute', top: 31, right: -7, color: A.spark3, fontSize: '5px', animation: 'sparkle 1.9s ease-in-out infinite 0.8s',   filter: `drop-shadow(0 0 3px ${A.spark3})` }}>◆</div>
      <div style={{ position: 'absolute', top: 22, left:  -6, color: A.crystalGlow, fontSize: '4px', animation: 'sparkle 2.0s ease-in-out infinite 0.6s', filter: `drop-shadow(0 0 2px ${A.crystalGlow})` }}>✦</div>
    </div>
  );
}

// ── Chibi Aira — pointy hat, round face, tiny dress ─────────────────────────
const W = {
  hatDark: '#2a0a5a', hatMid: '#4a1880', hatBrim: '#5a20a0',
  skin: '#f0dcc0', hair: '#1a0818', hairAccent: '#3a1030',
  eye: '#6030b0', eyeShine: '#e0d0ff',
  dress: '#4a1070', dressMid: '#6a1a98', dressLight: '#8a30b8',
  boots: '#1a0830', mouth: '#c088a0',
  spark: '#c5a3f5', gold: '#ffd700',
};

export function ChibiWitchSprite() {
  return (
    <div style={{ position: 'relative', width: 16, height: 26, imageRendering: 'pixelated' }}>
      {/* Hat tip */}
      <div style={{ position: 'absolute', top: 0, left: 6, width: 4, height: 5, background: W.hatDark, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
      {/* Hat body */}
      <div style={{ position: 'absolute', top: 4, left: 4, width: 8, height: 3, background: W.hatDark }} />
      {/* Hat star */}
      <div style={{ position: 'absolute', top: 5, left: 7, width: 1, height: 1, background: W.gold, boxShadow: '0 0 3px #ffd700' }} />
      {/* Hat brim */}
      <div style={{ position: 'absolute', top: 6, left: 1, width: 14, height: 2, background: W.hatBrim }} />
      {/* Hair sides */}
      <div style={{ position: 'absolute', top: 8, left: 1, width: 2, height: 6, background: W.hair }} />
      <div style={{ position: 'absolute', top: 8, left: 13,width: 2, height: 6, background: W.hair }} />
      {/* Head */}
      <div style={{ position: 'absolute', top: 8, left: 3, width: 10, height: 7, background: W.skin }} />
      {/* Eyes */}
      <div style={{ position: 'absolute', top: 11, left: 5, width: 2, height: 2, background: W.eye }} />
      <div style={{ position: 'absolute', top: 11, left: 9, width: 2, height: 2, background: W.eye }} />
      <div style={{ position: 'absolute', top: 11, left: 5, width: 1, height: 1, background: W.eyeShine, opacity: 0.7 }} />
      <div style={{ position: 'absolute', top: 11, left: 9, width: 1, height: 1, background: W.eyeShine, opacity: 0.7 }} />
      {/* Smile */}
      <div style={{ position: 'absolute', top: 14, left: 6, width: 3, height: 1, background: W.mouth }} />
      <div style={{ position: 'absolute', top: 13, left: 8, width: 1, height: 1, background: W.mouth, opacity: 0.6 }} />
      {/* Dress body */}
      <div style={{ position: 'absolute', top: 15, left: 3, width: 10, height: 6, background: W.dress }} />
      {/* Dress shimmer */}
      <div style={{ position: 'absolute', top: 16, left: 5, width: 2, height: 4, background: W.dressLight, opacity: 0.3 }} />
      {/* Dress flare */}
      <div style={{ position: 'absolute', top: 19, left: 1, width: 14, height: 4, background: W.dress, clipPath: 'polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)' }} />
      {/* Arms */}
      <div style={{ position: 'absolute', top: 15, left: 1, width: 2, height: 5, background: W.dress }} />
      <div style={{ position: 'absolute', top: 15, left: 13,width: 2, height: 5, background: W.dress }} />
      {/* Hands */}
      <div style={{ position: 'absolute', top: 19, left: 0, width: 2, height: 2, background: W.skin }} />
      <div style={{ position: 'absolute', top: 19, left: 14,width: 2, height: 2, background: W.skin }} />
      {/* Boots */}
      <div style={{ position: 'absolute', top: 22, left: 4, width: 3, height: 3, background: W.boots }} />
      <div style={{ position: 'absolute', top: 22, left: 9, width: 3, height: 3, background: W.boots }} />
      {/* Sparkle */}
      <div style={{ position: 'absolute', top: 14, left: -4, color: W.spark, fontSize: '6px', animation: 'sparkle 1.8s ease-in-out infinite', filter: 'drop-shadow(0 0 3px #c5a3f5)' }}>✦</div>
    </div>
  );
}
