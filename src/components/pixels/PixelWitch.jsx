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
      transform: `scale(${scale}) scaleX(-1)`, // facing left (toward child)
      transformOrigin: 'bottom center',
      animation: 'idle-bob 1.4s ease-in-out infinite',
    }}>
      <WitchSprite />
    </div>
  );
}

/* Lospec-style palette: muted purples, gold, skin */
const PALETTE = {
  hatDark: '#3a2a5a',
  hatMid: '#5a4a7a',
  hatLight: '#6a5a8a',
  hairDark: '#3a2a5a',
  hairLight: '#8a7aa8',
  skin: '#e8d4c8',
  skinShadow: '#c9b8a8',
  eyes: '#2a5a4a',
  pupils: '#1a2a22',
  nose: '#c9a898',
  mouth: '#a85a5a',
  robe: '#5a4a7a',
  robeBorder: '#4a3a6a',
  robeSkirt: '#4a3a6a',
  robeFlare: '#3a2a5a',
  gold: '#c9a227',
  cardBg: '#1a1528',
  shoes: '#2a2a2a',
  sparkle: '#c9a227',
  sparkleAlt: '#8a7aa8',
};

export function WitchSprite({ style = {} }) {
  return (
    <div style={{ position: 'relative', width: 24, height: 46, imageRendering: 'pixelated', ...style }}>
      {/* Hat - wide brim */}
      <div style={{ position: 'absolute', top: 0, left: 1, width: 22, height: 3, background: PALETTE.hatDark }} />
      {/* Hat body - tall and pointy */}
      <div style={{ position: 'absolute', top: 0, left: 8, width: 8, height: 3, background: PALETTE.hatMid }} />
      <div style={{ position: 'absolute', top: -4, left: 9, width: 6, height: 5, background: PALETTE.hatMid }} />
      <div style={{ position: 'absolute', top: -8, left: 10, width: 4, height: 5, background: PALETTE.hatLight }} />
      <div style={{ position: 'absolute', top: -12, left: 11, width: 2, height: 5, background: PALETTE.hatDark }} />
      {/* Hat star */}
      <div style={{ position: 'absolute', top: -6, left: 10, width: 4, height: 4, background: PALETTE.gold, clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} />

      {/* Hair - flowing purple */}
      <div style={{ position: 'absolute', top: 2, left: 0, width: 4, height: 14, background: PALETTE.hairDark }} />
      <div style={{ position: 'absolute', top: 2, right: 0, width: 4, height: 14, background: PALETTE.hairDark }} />
      <div style={{ position: 'absolute', top: 4, left: 1, width: 3, height: 12, background: PALETTE.hairLight }} />
      <div style={{ position: 'absolute', top: 4, right: 1, width: 3, height: 12, background: PALETTE.hairLight }} />

      {/* Face */}
      <div style={{ position: 'absolute', top: 3, left: 5, width: 14, height: 12, background: PALETTE.skin, border: `1px solid ${PALETTE.skinShadow}` }} />

      {/* Eyes - green witch eyes */}
      <div style={{ position: 'absolute', top: 6, left: 7, width: 3, height: 3, background: PALETTE.eyes }} />
      <div style={{ position: 'absolute', top: 6, left: 14, width: 3, height: 3, background: PALETTE.eyes }} />
      {/* Pupils */}
      <div style={{ position: 'absolute', top: 7, left: 8, width: 1, height: 2, background: PALETTE.pupils }} />
      <div style={{ position: 'absolute', top: 7, left: 15, width: 1, height: 2, background: PALETTE.pupils }} />

      {/* Nose */}
      <div style={{ position: 'absolute', top: 9, left: 11, width: 2, height: 2, background: PALETTE.nose }} />

      {/* Mouth - smirk */}
      <div style={{ position: 'absolute', top: 12, left: 8, width: 8, height: 2, background: PALETTE.mouth }} />
      <div style={{ position: 'absolute', top: 13, left: 14, width: 2, height: 1, background: PALETTE.mouth }} />

      {/* Neck */}
      <div style={{ position: 'absolute', top: 15, left: 8, width: 8, height: 3, background: PALETTE.skin }} />

      {/* Robe body */}
      <div style={{ position: 'absolute', top: 18, left: 2, width: 20, height: 14, background: PALETTE.robe, border: `1px solid ${PALETTE.robeBorder}` }} />
      {/* Robe center decoration */}
      <div style={{ position: 'absolute', top: 20, left: 11, width: 2, height: 10, background: PALETTE.gold }} />

      {/* Sleeves */}
      <div style={{ position: 'absolute', top: 18, left: 0, width: 3, height: 10, background: PALETTE.robeBorder }} />
      <div style={{ position: 'absolute', top: 18, right: 0, width: 3, height: 10, background: PALETTE.robeBorder }} />

      {/* Hands holding a card */}
      <div style={{ position: 'absolute', top: 28, left: 0, width: 4, height: 4, background: PALETTE.skin }} />
      <div style={{ position: 'absolute', top: 28, right: 0, width: 4, height: 4, background: PALETTE.skin }} />

      {/* Mini tarot card in hand */}
      <div style={{
        position: 'absolute', top: 22, left: -4, width: 8, height: 12,
        background: PALETTE.cardBg, border: `1px solid ${PALETTE.gold}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '6px',
      }}>
        <span style={{ color: PALETTE.gold }}>✦</span>
      </div>

      {/* Skirt flare */}
      <div style={{ position: 'absolute', top: 32, left: 0, width: 24, height: 10, background: PALETTE.robeSkirt }} />
      <div style={{ position: 'absolute', top: 36, left: -2, width: 28, height: 6, background: PALETTE.robeFlare }} />

      {/* Shoes */}
      <div style={{ position: 'absolute', top: 42, left: 2, width: 8, height: 4, background: PALETTE.shoes }} />
      <div style={{ position: 'absolute', top: 42, right: 2, width: 8, height: 4, background: PALETTE.shoes }} />
      {/* Pointy shoe tips */}
      <div style={{ position: 'absolute', top: 43, left: 0, width: 3, height: 2, background: PALETTE.shoes }} />
      <div style={{ position: 'absolute', top: 43, right: 0, width: 3, height: 2, background: PALETTE.shoes }} />

      {/* Magic sparkles around witch */}
      <div style={{
        position: 'absolute', top: -2, right: 22,
        width: 6, height: 6,
        color: PALETTE.sparkle, fontSize: '6px',
        animation: 'sparkle 1.5s ease-in-out infinite',
      }}>✦</div>
      <div style={{
        position: 'absolute', top: 10, right: 24,
        width: 4, height: 4,
        color: PALETTE.sparkleAlt, fontSize: '5px',
        animation: 'sparkle 2s ease-in-out infinite 0.5s',
      }}>★</div>
    </div>
  );
}
