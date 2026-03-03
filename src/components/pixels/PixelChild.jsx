import React, { useEffect, useRef } from 'react';
import '../../styles/pixelart.css';

// Protagonist — character2.png: fluffy amber hair, large warm eyes, beige cloak
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

/* Protagonist palette — character2.png */
const C = {
  // Fluffy amber hair
  hair:       '#c87838',
  hairDark:   '#9a5c28',
  hairLight:  '#e8a848',
  // Face
  skin:       '#f5d5b0',
  skinShadow: '#d4b08c',
  blush:      'rgba(210,120,90,0.5)',
  eyes:       '#b07830',
  eyeDark:    '#6a4818',
  eyeHL:      '#fff8e0',
  mouth:      '#c07878',
  // Beige cloak
  coat:       '#e8d5c4',
  coatDark:   '#c4a888',
  coatLight:  '#f5ede0',
  pants:      '#5a4a38',
  boots:      '#3a2a1a',
  hand:       '#f5d5b0',
};

export function ChildSprite({ walking = false, showBack = false, style = {} }) {
  const legLAnim = walking ? 'childLegL 0.3s ease-in-out infinite alternate' : 'none';
  const legRAnim = walking ? 'childLegR 0.3s ease-in-out infinite alternate 0.15s' : 'none';
  const armLAnim = walking ? 'childArmL 0.3s ease-in-out infinite alternate' : 'none';
  const armRAnim = walking ? 'childArmR 0.3s ease-in-out infinite alternate 0.15s' : 'none';
  const bobAnim  = walking ? 'childWalkBob 0.3s ease-in-out infinite alternate' : 'none';

  if (showBack) {
    return (
      <div style={{ position: 'relative', width: 22, height: 36, imageRendering: 'pixelated', animation: bobAnim, ...style }}>
        {/* Fluffy hair back */}
        <div style={{ position: 'absolute', top: 0, left: 1, width: 20, height: 10, background: C.hairDark }} />
        <div style={{ position: 'absolute', top: 0, left: 2, width: 18, height:  8, background: C.hair }} />
        <div style={{ position: 'absolute', top: 0, left: 5, width: 12, height:  5, background: C.hairLight, opacity: 0.38 }} />
        <div style={{ position: 'absolute', top: 3, left: -1, width: 5, height:  9, background: C.hair }} />
        <div style={{ position: 'absolute', top: 3, right:-1, width: 5, height:  9, background: C.hair }} />
        {/* Head back */}
        <div style={{ position: 'absolute', top: 7, left: 3, width: 16, height: 12, background: C.skin }} />
        {/* Coat back */}
        <div style={{ position: 'absolute', top: 19, left: 4, width: 14, height: 13, background: C.coat }} />
        <div style={{ position: 'absolute', top: 20, left: 6, width: 5,  height: 11, background: C.coatLight, opacity: 0.18 }} />
        <div style={{ position: 'absolute', top: 19, left: 4, width: 2,  height: 13, background: C.coatDark }} />
        <div style={{ position: 'absolute', top: 19, right:4, width: 2,  height: 13, background: C.coatDark }} />
        <div style={{ position: 'absolute', top: 19, left: 10,width: 2,  height: 13, background: C.coatDark, opacity: 0.4 }} />
        {/* Arms */}
        <div style={{ position: 'absolute', top: 20, left:  0, width: 4, height: 10, background: C.coat, transformOrigin: 'top right',  animation: armLAnim }} />
        <div style={{ position: 'absolute', top: 20, right: 0, width: 4, height: 10, background: C.coat, transformOrigin: 'top left',   animation: armRAnim }} />
        {/* Legs */}
        <div style={{ position: 'absolute', top: 32, left:  6, width: 4, height: 3, background: C.pants, transformOrigin: 'top center', animation: legLAnim }} />
        <div style={{ position: 'absolute', top: 32, left: 12, width: 4, height: 3, background: C.pants, transformOrigin: 'top center', animation: legRAnim }} />
        <div style={{ position: 'absolute', top: 33, left:  5, width: 5, height: 3, background: C.boots, transformOrigin: 'top center', animation: legLAnim }} />
        <div style={{ position: 'absolute', top: 33, left: 12, width: 5, height: 3, background: C.boots, transformOrigin: 'top center', animation: legRAnim }} />
        <style>{`
          @keyframes childArmL    { from { transform: rotate(-18deg); } to { transform: rotate(18deg); } }
          @keyframes childArmR    { from { transform: rotate(18deg);  } to { transform: rotate(-18deg); } }
          @keyframes childLegL    { from { transform: rotate(-15deg); } to { transform: rotate(15deg); } }
          @keyframes childLegR    { from { transform: rotate(15deg);  } to { transform: rotate(-15deg); } }
          @keyframes childWalkBob { from { transform: translateY(0);  } to { transform: translateY(-2px); } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: 22, height: 36, imageRendering: 'pixelated', animation: bobAnim, ...style }}>

      {/* ── FLUFFY AMBER HAIR (back layer — very poofy) ── */}
      {/* Main poof — layered rows to simulate roundness */}
      <div style={{ position: 'absolute', top: 1, left: 4,  width: 14, height: 2, background: C.hairDark }} />
      <div style={{ position: 'absolute', top: 0, left: 2,  width: 18, height: 5, background: C.hairDark }} />
      <div style={{ position: 'absolute', top: 0, left: 3,  width: 16, height: 4, background: C.hair }} />
      <div style={{ position: 'absolute', top: 1, left: 5,  width: 12, height: 3, background: C.hairLight, opacity: 0.4 }} />
      {/* Side puffs — extra fluffy wisps */}
      <div style={{ position: 'absolute', top: 3, left: -1, width: 6,  height: 10, background: C.hairDark }} />
      <div style={{ position: 'absolute', top: 3, left:  0, width: 5,  height:  9, background: C.hair }} />
      <div style={{ position: 'absolute', top: 3, right:-1, width: 6,  height: 10, background: C.hairDark }} />
      <div style={{ position: 'absolute', top: 3, right: 0, width: 5,  height:  9, background: C.hair }} />
      {/* Bottom of hair at head level */}
      <div style={{ position: 'absolute', top: 5, left: 2,  width: 18, height: 5, background: C.hair }} />
      <div style={{ position: 'absolute', top: 5, left: 4,  width: 14, height: 3, background: C.hairLight, opacity: 0.25 }} />

      {/* ── HEAD ── */}
      <div style={{ position: 'absolute', top: 7, left: 3, width: 16, height: 12, background: C.skin }} />
      {/* Cheek shadows */}
      <div style={{ position: 'absolute', top: 12, left:  3, width: 2, height: 5, background: C.skinShadow, opacity: 0.22 }} />
      <div style={{ position: 'absolute', top: 12, right: 3, width: 2, height: 5, background: C.skinShadow, opacity: 0.22 }} />
      {/* Rosy blush — warm cheeks */}
      <div style={{ position: 'absolute', top: 14, left:  3, width: 4, height: 2, background: C.blush }} />
      <div style={{ position: 'absolute', top: 14, right: 3, width: 4, height: 2, background: C.blush }} />

      {/* Eyes — large round warm amber */}
      <div style={{ position: 'absolute', top: 10, left:  5, width: 5, height: 5, background: C.eyes }} />
      <div style={{ position: 'absolute', top: 10, right: 5, width: 5, height: 5, background: C.eyes }} />
      {/* Dark center */}
      <div style={{ position: 'absolute', top: 11, left:  6, width: 3, height: 3, background: C.eyeDark }} />
      <div style={{ position: 'absolute', top: 11, right: 6, width: 3, height: 3, background: C.eyeDark }} />
      {/* Highlights — double dot sparkle */}
      <div style={{ position: 'absolute', top: 10, left:  5, width: 2, height: 2, background: C.eyeHL }} />
      <div style={{ position: 'absolute', top: 10, right: 5, width: 2, height: 2, background: C.eyeHL }} />
      <div style={{ position: 'absolute', top: 12, left:  7, width: 1, height: 1, background: 'rgba(255,248,220,0.55)' }} />
      <div style={{ position: 'absolute', top: 12, right: 7, width: 1, height: 1, background: 'rgba(255,248,220,0.55)' }} />
      {/* Eyebrows — gentle, slightly arched */}
      <div style={{ position: 'absolute', top: 8, left:  5, width: 5, height: 1, background: C.hairDark, opacity: 0.8 }} />
      <div style={{ position: 'absolute', top: 8, right: 5, width: 5, height: 1, background: C.hairDark, opacity: 0.8 }} />
      {/* Nose */}
      <div style={{ position: 'absolute', top: 15, left: 10, width: 2, height: 1, background: C.skinShadow, opacity: 0.5 }} />
      {/* Mouth — gentle open smile */}
      <div style={{ position: 'absolute', top: 17, left: 7,  width: 8, height: 1, background: C.mouth, opacity: 0.85 }} />
      <div style={{ position: 'absolute', top: 16, left:  6, width: 1, height: 1, background: C.mouth, opacity: 0.45 }} />
      <div style={{ position: 'absolute', top: 16, right: 6, width: 1, height: 1, background: C.mouth, opacity: 0.45 }} />

      {/* ── NECK ── */}
      <div style={{ position: 'absolute', top: 19, left: 8, width: 6, height: 3, background: C.skin }} />

      {/* ── BEIGE CLOAK BODY ── */}
      <div style={{ position: 'absolute', top: 21, left: 4, width: 14, height: 12, background: C.coat }} />
      {/* Sheen */}
      <div style={{ position: 'absolute', top: 22, left: 6, width: 5, height:  9, background: C.coatLight, opacity: 0.2 }} />
      {/* Edge darks */}
      <div style={{ position: 'absolute', top: 21, left:  4, width: 2, height: 12, background: C.coatDark }} />
      <div style={{ position: 'absolute', top: 21, right: 4, width: 2, height: 12, background: C.coatDark }} />
      {/* Clasp/brooch */}
      <div style={{ position: 'absolute', top: 24, left: 9, width: 4, height: 2, background: '#c8a060', borderRadius: 1 }} />

      {/* ── ARMS ── */}
      <div style={{
        position: 'absolute', top: 22, left: 0, width: 4, height: 10, background: C.coat,
        transformOrigin: 'top center', animation: armLAnim,
      }} />
      <div style={{
        position: 'absolute', top: 22, right: 0, width: 4, height: 10, background: C.coat,
        transformOrigin: 'top center', animation: armRAnim,
      }} />
      {/* Hands */}
      <div style={{
        position: 'absolute', top: 31, left: 0, width: 4, height: 2, background: C.hand,
        transformOrigin: 'top center', animation: armLAnim,
      }} />
      <div style={{
        position: 'absolute', top: 31, right: 0, width: 4, height: 2, background: C.hand,
        transformOrigin: 'top center', animation: armRAnim,
      }} />

      {/* ── PANTS ── */}
      <div style={{
        position: 'absolute', top: 33, left:  6, width: 4, height: 2, background: C.pants,
        transformOrigin: 'top center', animation: legLAnim,
      }} />
      <div style={{
        position: 'absolute', top: 33, left: 12, width: 4, height: 2, background: C.pants,
        transformOrigin: 'top center', animation: legRAnim,
      }} />

      {/* ── BOOTS ── */}
      <div style={{
        position: 'absolute', top: 33, left:  5, width: 5, height: 3, background: C.boots,
        transformOrigin: 'top center', animation: legLAnim,
      }} />
      <div style={{
        position: 'absolute', top: 33, right: 5, width: 5, height: 3, background: C.boots,
        transformOrigin: 'top center', animation: legRAnim,
      }} />

      <style>{`
        @keyframes childArmL    { from { transform: rotate(-18deg); } to { transform: rotate(18deg); } }
        @keyframes childArmR    { from { transform: rotate(18deg);  } to { transform: rotate(-18deg); } }
        @keyframes childLegL    { from { transform: rotate(-15deg); } to { transform: rotate(15deg); } }
        @keyframes childLegR    { from { transform: rotate(15deg);  } to { transform: rotate(-15deg); } }
        @keyframes childWalkBob { from { transform: translateY(0);  } to { transform: translateY(-2px); } }
      `}</style>
    </div>
  );
}

// Single sprite for both map and dialog
export function ChibiChildSprite({ walking = false }) { return <ChildSprite walking={walking} />; }
