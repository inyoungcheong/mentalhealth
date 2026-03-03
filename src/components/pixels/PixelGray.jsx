import React from 'react';
import '../../styles/pixelart.css';

// Pixel art Gray character — cool silver-haired boy, blunt oracle
// Side-swept long bangs, half-lidded steel-blue eyes, dark charcoal jacket
export default function PixelGray({ style = {} }) {
  return (
    <div style={{
      imageRendering: 'pixelated',
      display: 'inline-block',
      ...style,
    }}>
      <GraySprite />
    </div>
  );
}

const P = {
  hairBase:   '#b8bcc8',
  hairDark:   '#6e7280',
  hairLight:  '#d8dce8',
  hairBang:   '#9ca0ae',
  skin:       '#f0dcc0',
  skinShadow: '#d4b898',
  eyes:       '#5a8aaa',
  eyeLid:     '#3a4a5a',
  eyeShine:   '#ffffff',
  brow:       '#8a8e9a',
  jacket:     '#2a2e3a',
  jacketMid:  '#363c4a',
  jacketLight:'#4a5060',
  collar:     '#3a4050',
  shirt:      '#e8e4d8',
  pants:      '#1e2228',
  shoes:      '#1a1a1a',
  shoesTip:   '#0a0a0a',
  skin2:      '#e8ccaa',
};

export function GraySprite({ style = {} }) {
  return (
    <div style={{ position: 'relative', width: 28, height: 54, imageRendering: 'pixelated', ...style }}>

      {/* ===== HAIR — back layer ===== */}
      {/* Back of head */}
      <div style={{ position: 'absolute', top: 2, left: 4, width: 20, height: 14, background: P.hairDark }} />
      {/* Side hair left */}
      <div style={{ position: 'absolute', top: 4, left: 2, width: 4, height: 18, background: P.hairDark }} />
      {/* Side hair right */}
      <div style={{ position: 'absolute', top: 4, right: 2, width: 4, height: 14, background: P.hairDark }} />

      {/* ===== HEAD ===== */}
      <div style={{ position: 'absolute', top: 4, left: 5, width: 18, height: 14, background: P.skin }} />
      {/* Cheek shadows */}
      <div style={{ position: 'absolute', top: 10, left: 5, width: 2, height: 4, background: P.skinShadow, opacity: 0.35 }} />
      <div style={{ position: 'absolute', top: 10, right: 5, width: 2, height: 4, background: P.skinShadow, opacity: 0.35 }} />

      {/* ===== EYES — half-lidded, cool expression ===== */}
      {/* Eye base */}
      <div style={{ position: 'absolute', top: 9, left: 8, width: 5, height: 3, background: P.eyes }} />
      <div style={{ position: 'absolute', top: 9, left: 15, width: 5, height: 3, background: P.eyes }} />
      {/* Heavy top lid — makes them look sleepy/cool */}
      <div style={{ position: 'absolute', top: 9, left: 8, width: 5, height: 1, background: P.eyeLid }} />
      <div style={{ position: 'absolute', top: 9, left: 15, width: 5, height: 1, background: P.eyeLid }} />
      {/* Pupil */}
      <div style={{ position: 'absolute', top: 10, left: 10, width: 2, height: 2, background: '#1a2a38' }} />
      <div style={{ position: 'absolute', top: 10, left: 17, width: 2, height: 2, background: '#1a2a38' }} />
      {/* Shine */}
      <div style={{ position: 'absolute', top: 10, left: 10, width: 1, height: 1, background: P.eyeShine, opacity: 0.7 }} />
      <div style={{ position: 'absolute', top: 10, left: 17, width: 1, height: 1, background: P.eyeShine, opacity: 0.7 }} />

      {/* ===== EYEBROWS — thin, flat, cool ===== */}
      <div style={{ position: 'absolute', top: 7, left: 8, width: 5, height: 1, background: P.brow }} />
      <div style={{ position: 'absolute', top: 7, left: 15, width: 5, height: 1, background: P.brow }} />

      {/* Nose */}
      <div style={{ position: 'absolute', top: 14, left: 13, width: 2, height: 2, background: P.skinShadow }} />

      {/* Mouth — very slight smirk (asymmetric) */}
      <div style={{ position: 'absolute', top: 17, left: 12, width: 4, height: 1, background: '#c08888' }} />
      <div style={{ position: 'absolute', top: 16, left: 15, width: 1, height: 1, background: '#c08888', opacity: 0.6 }} />

      {/* ===== HAIR — front/bangs layer (over face) ===== */}
      {/* Main top hair */}
      <div style={{ position: 'absolute', top: 2, left: 5, width: 18, height: 5, background: P.hairBase }} />
      <div style={{ position: 'absolute', top: 3, left: 6, width: 16, height: 3, background: P.hairLight, opacity: 0.5 }} />
      {/* Side-swept bang: falls to the left, covers left forehead/eye-top */}
      <div style={{ position: 'absolute', top: 4, left: 3, width: 10, height: 4, background: P.hairBase }} />
      <div style={{ position: 'absolute', top: 5, left: 3, width: 8, height: 3, background: P.hairBang }} />
      <div style={{ position: 'absolute', top: 6, left: 3, width: 6, height: 4, background: P.hairBang }} />
      {/* Bang tip drape — hangs over left side */}
      <div style={{ position: 'absolute', top: 7, left: 3, width: 4, height: 3, background: P.hairDark, opacity: 0.8 }} />
      {/* Right side — shorter, tucked back */}
      <div style={{ position: 'absolute', top: 4, right: 3, width: 5, height: 3, background: P.hairBase, opacity: 0.7 }} />

      {/* ===== NECK ===== */}
      <div style={{ position: 'absolute', top: 18, left: 10, width: 8, height: 4, background: P.skin }} />

      {/* ===== JACKET COLLAR ===== */}
      <div style={{ position: 'absolute', top: 20, left: 4, width: 20, height: 3, background: P.collar }} />
      {/* Open collar V-line */}
      <div style={{ position: 'absolute', top: 22, left: 12, width: 4, height: 4, background: P.shirt,
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />

      {/* ===== JACKET BODY ===== */}
      <div style={{ position: 'absolute', top: 22, left: 2, width: 24, height: 20, background: P.jacket }} />
      {/* Center seam */}
      <div style={{ position: 'absolute', top: 22, left: 13, width: 1, height: 20, background: P.jacketMid }} />
      {/* Light sheen left */}
      <div style={{ position: 'absolute', top: 23, left: 4, width: 4, height: 16, background: P.jacketLight, opacity: 0.15 }} />
      {/* Side darks */}
      <div style={{ position: 'absolute', top: 22, left: 2, width: 3, height: 20, background: '#1a1e26' }} />
      <div style={{ position: 'absolute', top: 22, right: 2, width: 3, height: 20, background: '#1a1e26' }} />

      {/* ===== SLEEVES (rolled-up cuffs) ===== */}
      {/* Left sleeve */}
      <div style={{ position: 'absolute', top: 22, left: -2, width: 6, height: 14, background: P.jacket }} />
      <div style={{ position: 'absolute', top: 34, left: -2, width: 7, height: 3, background: P.jacketLight }} />
      {/* Left forearm (skin — rolled sleeve) */}
      <div style={{ position: 'absolute', top: 36, left: -1, width: 5, height: 6, background: P.skin2 }} />
      {/* Right sleeve */}
      <div style={{ position: 'absolute', top: 22, right: -2, width: 6, height: 14, background: P.jacket }} />
      <div style={{ position: 'absolute', top: 34, right: -2, width: 7, height: 3, background: P.jacketLight }} />
      {/* Right forearm (skin) */}
      <div style={{ position: 'absolute', top: 36, right: -1, width: 5, height: 6, background: P.skin2 }} />

      {/* ===== PANTS ===== */}
      <div style={{ position: 'absolute', top: 42, left: 4, width: 8, height: 10, background: P.pants }} />
      <div style={{ position: 'absolute', top: 42, left: 16, width: 8, height: 10, background: P.pants }} />
      {/* Seam highlight */}
      <div style={{ position: 'absolute', top: 42, left: 12, width: 4, height: 10, background: '#14181e' }} />

      {/* ===== SHOES ===== */}
      <div style={{ position: 'absolute', top: 50, left: 3, width: 9, height: 4, background: P.shoes }} />
      <div style={{ position: 'absolute', top: 51, left: 2, width: 3, height: 2, background: P.shoesTip }} />
      <div style={{ position: 'absolute', top: 50, right: 3, width: 9, height: 4, background: P.shoes }} />
      <div style={{ position: 'absolute', top: 51, right: 2, width: 3, height: 2, background: P.shoesTip }} />

      {/* ===== TAROT CARD in hand (left) ===== */}
      <div style={{
        position: 'absolute', top: 34, left: -10, width: 8, height: 11,
        background: P.skin,
        border: '1px solid #3a3040',
      }}>
        <div style={{
          position: 'absolute', top: 1, left: 1, width: 6, height: 9,
          background: '#2a1a4a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '5px',
        }}>
          <span style={{ color: '#c8a030' }}>✦</span>
        </div>
      </div>

      <style>{`
        @keyframes grayBlink {
          0%, 92%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.15); }
        }
      `}</style>
    </div>
  );
}

// ── Chibi Gray — silver side-swept hair, half-lids, dark jacket ─────────────
const G = {
  hairBase: '#b8bcc8', hairDark: '#6e7280', hairBang: '#9ca0ae',
  skin: '#f0dcc0', skinShadow: '#d4b898',
  eye: '#5a8aaa', eyeLid: '#3a4a5a', eyeShine: '#ffffff',
  jacket: '#2a2e3a', jacketLight: '#4a5060',
  shirt: '#e8e4d8', pants: '#1e2228', shoes: '#1a1a1a',
};

export function ChibiGraySprite() {
  return (
    <div style={{ position: 'relative', width: 14, height: 22, imageRendering: 'pixelated' }}>
      {/* Hair back */}
      <div style={{ position: 'absolute', top: 0, left: 2, width: 10, height: 4, background: G.hairBase }} />
      {/* Side-swept bang (left) */}
      <div style={{ position: 'absolute', top: 2, left: 2, width: 6, height: 3, background: G.hairBang }} />
      <div style={{ position: 'absolute', top: 4, left: 2, width: 4, height: 2, background: G.hairDark, opacity: 0.7 }} />
      {/* Head */}
      <div style={{ position: 'absolute', top: 2, left: 2, width: 10, height: 8, background: G.skin }} />
      {/* Eyes — half-lidded cool expression */}
      <div style={{ position: 'absolute', top: 5, left: 4,  width: 2, height: 2, background: G.eye }} />
      <div style={{ position: 'absolute', top: 5, left: 8,  width: 2, height: 2, background: G.eye }} />
      <div style={{ position: 'absolute', top: 5, left: 4,  width: 2, height: 1, background: G.eyeLid }} />
      <div style={{ position: 'absolute', top: 5, left: 8,  width: 2, height: 1, background: G.eyeLid }} />
      <div style={{ position: 'absolute', top: 5, left: 4,  width: 1, height: 1, background: G.eyeShine, opacity: 0.55 }} />
      <div style={{ position: 'absolute', top: 5, left: 8,  width: 1, height: 1, background: G.eyeShine, opacity: 0.55 }} />
      {/* Smirk (asymmetric) */}
      <div style={{ position: 'absolute', top: 8, left: 6,  width: 3, height: 1, background: '#c08888' }} />
      <div style={{ position: 'absolute', top: 7, left: 8,  width: 1, height: 1, background: '#c08888', opacity: 0.5 }} />
      {/* V-collar / shirt */}
      <div style={{ position: 'absolute', top: 9, left: 5,  width: 4, height: 3, background: G.shirt, clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }} />
      {/* Jacket body */}
      <div style={{ position: 'absolute', top: 10, left: 3, width: 8, height: 5, background: G.jacket }} />
      <div style={{ position: 'absolute', top: 10, left: 3, width: 1, height: 5, background: '#1a1e26' }} />
      <div style={{ position: 'absolute', top: 10, left: 10,width: 1, height: 5, background: '#1a1e26' }} />
      <div style={{ position: 'absolute', top: 11, left: 4, width: 2, height: 3, background: G.jacketLight, opacity: 0.15 }} />
      {/* Arms */}
      <div style={{ position: 'absolute', top: 10, left: 1, width: 2, height: 4, background: G.jacket }} />
      <div style={{ position: 'absolute', top: 10, left: 11,width: 2, height: 4, background: G.jacket }} />
      {/* Forearms (rolled sleeves) */}
      <div style={{ position: 'absolute', top: 13, left: 1, width: 2, height: 2, background: G.skin }} />
      <div style={{ position: 'absolute', top: 13, left: 11,width: 2, height: 2, background: G.skin }} />
      {/* Pants */}
      <div style={{ position: 'absolute', top: 15, left: 4, width: 2, height: 4, background: G.pants }} />
      <div style={{ position: 'absolute', top: 15, left: 8, width: 2, height: 4, background: G.pants }} />
      {/* Shoes */}
      <div style={{ position: 'absolute', top: 18, left: 3, width: 3, height: 3, background: G.shoes }} />
      <div style={{ position: 'absolute', top: 18, left: 8, width: 3, height: 3, background: G.shoes }} />
      {/* Tarot card in hand */}
      <div style={{ position: 'absolute', top: 12, left: -4, width: 5, height: 7, background: '#2a1a4a', border: '1px solid #c8a030', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4px' }}>
        <span style={{ color: '#c8a030' }}>✦</span>
      </div>
    </div>
  );
}
