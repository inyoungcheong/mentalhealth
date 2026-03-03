import React from 'react';
import '../../styles/pixelart.css';

// Gray — character2.png: short silver/white spiky hair, dark navy jacket, half-lidded cool eyes
export default function PixelGray({ style = {} }) {
  return (
    <div style={{ imageRendering: 'pixelated', display: 'inline-block', ...style }}>
      <GraySprite />
    </div>
  );
}

const G = {
  // Silver hair
  hair:       '#c0c8d8',
  hairDark:   '#7a8090',
  hairLight:  '#e0e8f8',
  hairBang:   '#9aa0b0',
  // Face
  skin:       '#f0dcc0',
  skinShadow: '#d4b898',
  eyes:       '#4878a0',
  eyeLid:     '#283848',
  eyeHL:      '#c8e8ff',
  mouth:      '#b08888',
  brow:       '#7a8090',
  // Jacket
  jacket:     '#181c28',
  jacketMid:  '#222838',
  jacketLight:'#343c52',
  collar:     '#e8e4d8',
  pants:      '#141820',
  shoes:      '#0e1018',
};

export function GraySprite({ style = {} }) {
  return (
    <div style={{ position: 'relative', width: 20, height: 34, imageRendering: 'pixelated', ...style }}>

      {/* ── HAIR (back layer) ── */}
      <div style={{ position: 'absolute', top: 0, left: 2, width: 16, height: 8, background: G.hairDark }} />
      <div style={{ position: 'absolute', top: 0, left: 3, width: 14, height: 6, background: G.hair }} />
      <div style={{ position: 'absolute', top: 0, left: 5, width:  9, height: 3, background: G.hairLight, opacity: 0.45 }} />
      {/* Side hair */}
      <div style={{ position: 'absolute', top: 2, left:  0, width: 3, height: 12, background: G.hairDark }} />
      <div style={{ position: 'absolute', top: 2, right: 0, width: 3, height: 10, background: G.hairDark }} />
      {/* Spiky top — characteristic for character2 Gray */}
      <div style={{ position: 'absolute', top: 0, left: 6, width: 3, height: 2, background: G.hairLight, opacity: 0.7 }} />
      <div style={{ position: 'absolute', top: 0, left: 11, width: 3, height: 2, background: G.hairLight, opacity: 0.6 }} />
      {/* Side-swept bang — falls left */}
      <div style={{ position: 'absolute', top: 2, left: 2, width: 9, height: 5, background: G.hair }} />
      <div style={{ position: 'absolute', top: 4, left: 2, width: 7, height: 4, background: G.hairBang }} />
      <div style={{ position: 'absolute', top: 5, left: 2, width: 5, height: 3, background: G.hairDark, opacity: 0.75 }} />
      {/* Right side — shorter, tucked */}
      <div style={{ position: 'absolute', top: 2, right: 2, width: 4, height: 3, background: G.hair, opacity: 0.75 }} />

      {/* ── HEAD ── */}
      <div style={{ position: 'absolute', top: 2, left: 2, width: 16, height: 12, background: G.skin }} />
      {/* Cheek shadows */}
      <div style={{ position: 'absolute', top: 8,  left:  2, width: 2, height: 4, background: G.skinShadow, opacity: 0.25 }} />
      <div style={{ position: 'absolute', top: 8,  right: 2, width: 2, height: 4, background: G.skinShadow, opacity: 0.25 }} />

      {/* Eyes — half-lidded, cool steel blue */}
      <div style={{ position: 'absolute', top: 6,  left:  4, width: 5, height: 3, background: G.eyes }} />
      <div style={{ position: 'absolute', top: 6,  right: 4, width: 5, height: 3, background: G.eyes }} />
      {/* Half-lid (darker top strip) */}
      <div style={{ position: 'absolute', top: 6,  left:  4, width: 5, height: 1, background: G.eyeLid }} />
      <div style={{ position: 'absolute', top: 6,  right: 4, width: 5, height: 1, background: G.eyeLid }} />
      {/* Pupils */}
      <div style={{ position: 'absolute', top: 7,  left:  6, width: 2, height: 2, background: '#0a1820' }} />
      <div style={{ position: 'absolute', top: 7,  right: 6, width: 2, height: 2, background: '#0a1820' }} />
      {/* Highlights */}
      <div style={{ position: 'absolute', top: 7,  left:  4, width: 2, height: 1, background: G.eyeHL }} />
      <div style={{ position: 'absolute', top: 7,  right: 4, width: 2, height: 1, background: G.eyeHL }} />
      {/* Brows — upward-curving, cocky */}
      <div style={{ position: 'absolute', top: 5,  left:  4, width: 5, height: 1, background: G.brow, opacity: 0.9 }} />
      <div style={{ position: 'absolute', top: 4,  left:  7, width: 2, height: 1, background: G.brow, opacity: 0.55 }} />
      <div style={{ position: 'absolute', top: 5,  right: 4, width: 5, height: 1, background: G.brow, opacity: 0.9 }} />
      <div style={{ position: 'absolute', top: 4,  right: 7, width: 2, height: 1, background: G.brow, opacity: 0.55 }} />
      {/* Nose */}
      <div style={{ position: 'absolute', top: 10, left: 9, width: 2, height: 1, background: G.skinShadow, opacity: 0.4 }} />
      {/* Mouth — confident smirk */}
      <div style={{ position: 'absolute', top: 12, left: 6, width: 7, height: 1, background: G.mouth, opacity: 0.75 }} />
      <div style={{ position: 'absolute', top: 11, left: 6, width: 1, height: 1, background: G.mouth, opacity: 0.5 }} />

      {/* ── NECK ── */}
      <div style={{ position: 'absolute', top: 14, left: 7, width: 6, height: 3, background: G.skin }} />

      {/* ── JACKET COLLAR / shirt visible ── */}
      <div style={{ position: 'absolute', top: 15, left: 8, width: 4, height: 4, background: G.collar,
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />

      {/* ── JACKET BODY ── */}
      <div style={{ position: 'absolute', top: 17, left: 3, width: 14, height: 13, background: G.jacket }} />
      {/* Lapels */}
      <div style={{ position: 'absolute', top: 17, left:  4, width: 3, height: 5, background: G.jacketMid }} />
      <div style={{ position: 'absolute', top: 17, right: 4, width: 3, height: 5, background: G.jacketMid }} />
      {/* Sheen */}
      <div style={{ position: 'absolute', top: 18, left:  5, width: 4, height: 10, background: G.jacketLight, opacity: 0.14 }} />
      {/* Edge darks */}
      <div style={{ position: 'absolute', top: 17, left:  3, width: 2, height: 13, background: '#0e1018' }} />
      <div style={{ position: 'absolute', top: 17, right: 3, width: 2, height: 13, background: '#0e1018' }} />

      {/* ── ARMS ── */}
      <div style={{ position: 'absolute', top: 17, left:  0, width: 4, height: 11, background: G.jacket }} />
      <div style={{ position: 'absolute', top: 17, right: 0, width: 4, height: 11, background: G.jacket }} />
      {/* Hands */}
      <div style={{ position: 'absolute', top: 27, left:  0, width: 4, height: 3, background: G.skin }} />
      <div style={{ position: 'absolute', top: 27, right: 0, width: 4, height: 3, background: G.skin }} />

      {/* ── PANTS ── */}
      <div style={{ position: 'absolute', top: 30, left:  5, width: 4, height: 3, background: G.pants }} />
      <div style={{ position: 'absolute', top: 30, left: 11, width: 4, height: 3, background: G.pants }} />

      {/* ── SHOES ── */}
      <div style={{ position: 'absolute', top: 31, left:  4, width: 5, height: 3, background: G.shoes }} />
      <div style={{ position: 'absolute', top: 31, left: 11, width: 5, height: 3, background: G.shoes }} />
    </div>
  );
}

// Single sprite for both map and dialog
export function ChibiGraySprite() { return <GraySprite />; }
