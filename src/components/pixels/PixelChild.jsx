import React, { useEffect, useRef } from 'react';
import '../../styles/pixelart.css';

// Scholar protagonist — dark navy coat, visible brown hair, notebook
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

/* Scholar traveler palette — navy, warm neutrals */
const C = {
  skin:         '#f5d5b0',
  skinShadow:   '#d4b08c',
  hair:         '#3a2a1a',   // natural dark brown
  hairDark:     '#1c1008',
  hairLight:    '#584030',
  eyes:         '#485e6a',   // steel blue-grey (tired)
  eyeShine:     '#88a0b0',
  mouth:        '#b88080',
  coat:         '#1a2240',   // dark navy
  coatDark:     '#0e1428',
  coatLight:    '#263060',
  coatSeam:     '#1e2848',
  button:       '#8898a8',   // silver
  collar:       '#d0d0e0',   // white shirt collar
  pants:        '#242434',   // dark charcoal
  boots:        '#2a1a0a',
  bootsDark:    '#140a04',
  notebook:     '#c8a060',   // warm leather
  notebookEdge: '#906030',
  notebookLine: '#705040',
  hand:         '#f5d5b0',
};

export function ChildSprite({ walking = false, showBack = false, style = {} }) {
  const legLAnim = walking ? 'childLegL 0.3s ease-in-out infinite alternate' : 'none';
  const legRAnim = walking ? 'childLegR 0.3s ease-in-out infinite alternate 0.15s' : 'none';
  const armLAnim = walking ? 'childArmL 0.3s ease-in-out infinite alternate' : 'none';
  const armRAnim = walking ? 'childArmR 0.3s ease-in-out infinite alternate 0.15s' : 'none';
  const bobAnim  = walking ? 'childWalkBob 0.3s ease-in-out infinite alternate' : 'none';

  if (showBack) {
    return (
      <div style={{ position: 'relative', width: 24, height: 42, imageRendering: 'pixelated', animation: bobAnim, ...style }}>
        {/* Hair back */}
        <div style={{ position: 'absolute', top: 0, left: 6,  width: 12, height: 6, background: C.hair }} />
        <div style={{ position: 'absolute', top: 0, left: 8,  width: 8,  height: 4, background: C.hairLight, opacity: 0.35 }} />
        {/* Side strands */}
        <div style={{ position: 'absolute', top: 3, left: 4,  width: 3,  height: 6, background: C.hairDark }} />
        <div style={{ position: 'absolute', top: 3, right: 4, width: 3,  height: 5, background: C.hairDark }} />
        {/* Head back */}
        <div style={{ position: 'absolute', top: 4, left: 5,  width: 14, height: 11, background: C.skin }} />
        {/* Coat back */}
        <div style={{ position: 'absolute', top: 15, left: 5, width: 14, height: 17, background: C.coat }} />
        <div style={{ position: 'absolute', top: 16, left: 6, width: 4,  height: 14, background: C.coatLight, opacity: 0.18 }} />
        <div style={{ position: 'absolute', top: 15, left: 5, width: 2,  height: 17, background: C.coatDark }} />
        <div style={{ position: 'absolute', top: 15, left: 17,width: 2,  height: 17, background: C.coatDark }} />
        {/* Center back seam */}
        <div style={{ position: 'absolute', top: 15, left: 11,width: 2,  height: 17, background: C.coatSeam, opacity: 0.5 }} />
        {/* Arms */}
        <div style={{ position: 'absolute', top: 16, left: 1,  width: 5, height: 10, background: C.coat, transformOrigin: 'top right',  animation: 'childArmLBack 0.3s ease-in-out infinite alternate' }} />
        <div style={{ position: 'absolute', top: 16, right: 1, width: 5, height: 10, background: C.coat, transformOrigin: 'top left',   animation: 'childArmRBack 0.3s ease-in-out infinite alternate 0.15s' }} />
        {/* Legs */}
        <div style={{ position: 'absolute', top: 32, left: 7,  width: 4,  height: 5,  background: C.pants, transformOrigin: 'top center', animation: legLAnim }} />
        <div style={{ position: 'absolute', top: 32, left: 13, width: 4,  height: 5,  background: C.pants, transformOrigin: 'top center', animation: legRAnim }} />
        <div style={{ position: 'absolute', top: 36, left: 6,  width: 6,  height: 6,  background: C.boots, transformOrigin: 'top center', animation: legLAnim }} />
        <div style={{ position: 'absolute', top: 36, left: 12, width: 6,  height: 6,  background: C.boots, transformOrigin: 'top center', animation: legRAnim }} />
        <style>{`
          @keyframes childArmLBack { from { transform: rotate(-22deg); } to { transform: rotate(22deg); } }
          @keyframes childArmRBack { from { transform: rotate(22deg);  } to { transform: rotate(-22deg); } }
          @keyframes childLegL     { from { transform: rotate(-18deg); } to { transform: rotate(18deg); } }
          @keyframes childLegR     { from { transform: rotate(18deg);  } to { transform: rotate(-18deg); } }
          @keyframes childWalkBob  { from { transform: translateY(0);  } to { transform: translateY(-3px); } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: 24, height: 42, imageRendering: 'pixelated', animation: bobAnim, ...style }}>

      {/* === HAIR — natural dark brown, no hood === */}
      <div style={{ position: 'absolute', top: 0, left:  6, width: 12, height: 6, background: C.hair }} />
      <div style={{ position: 'absolute', top: 0, left:  8, width:  8, height: 4, background: C.hairLight, opacity: 0.38 }} />
      {/* Side strands */}
      <div style={{ position: 'absolute', top: 3, left:  4, width:  3, height: 8, background: C.hairDark }} />
      <div style={{ position: 'absolute', top: 3, right: 4, width:  3, height: 7, background: C.hairDark }} />
      {/* Forelock tuft */}
      <div style={{ position: 'absolute', top: 3, left: 9, width: 4,  height: 3, background: C.hair }} />

      {/* === HEAD === */}
      <div style={{ position: 'absolute', top: 4, left: 5, width: 14, height: 12, background: C.skin }} />
      {/* Subtle jaw shadow */}
      <div style={{ position: 'absolute', top: 13, left: 5, width: 14, height: 2, background: C.skinShadow, opacity: 0.25 }} />

      {/* === EYES — steel blue-grey, tired === */}
      <div style={{ position: 'absolute', top: 8, left:  7, width: 3, height: 3, background: C.eyes }} />
      <div style={{ position: 'absolute', top: 8, left: 14, width: 3, height: 3, background: C.eyes }} />
      {/* Eye shine */}
      <div style={{ position: 'absolute', top: 8, left:  8, width: 1, height: 1, background: C.eyeShine }} />
      <div style={{ position: 'absolute', top: 8, left: 15, width: 1, height: 1, background: C.eyeShine }} />
      {/* Undereye shadow (tired) */}
      <div style={{ position: 'absolute', top: 11, left:  7, width: 3, height: 1, background: C.skinShadow, opacity: 0.45 }} />
      <div style={{ position: 'absolute', top: 11, left: 14, width: 3, height: 1, background: C.skinShadow, opacity: 0.45 }} />
      {/* Eyebrows — slightly furrowed, flat */}
      <div style={{ position: 'absolute', top: 6, left:  7, width: 4, height: 1, background: C.hairDark }} />
      <div style={{ position: 'absolute', top: 6, left: 13, width: 4, height: 1, background: C.hairDark }} />

      {/* Nose */}
      <div style={{ position: 'absolute', top: 12, left: 11, width: 2, height: 1, background: C.skinShadow }} />
      {/* Mouth — neutral, slight weariness */}
      <div style={{ position: 'absolute', top: 14, left: 9, width: 6, height: 1, background: C.mouth, opacity: 0.75 }} />
      {/* Downturned corners */}
      <div style={{ position: 'absolute', top: 15, left: 9,  width: 1, height: 1, background: C.skinShadow, opacity: 0.4 }} />
      <div style={{ position: 'absolute', top: 15, left: 14, width: 1, height: 1, background: C.skinShadow, opacity: 0.4 }} />

      {/* === WHITE SHIRT COLLAR (visible above coat) === */}
      <div style={{ position: 'absolute', top: 14, left: 9, width: 6, height: 4, background: C.collar }} />
      <div style={{ position: 'absolute', top: 15, left: 11,width: 2, height: 4, background: '#b0b0c8', opacity: 0.6 }} />

      {/* === DARK NAVY COAT — slim silhouette === */}
      <div style={{ position: 'absolute', top: 16, left: 5, width: 14, height: 17, background: C.coat }} />
      {/* Sheen */}
      <div style={{ position: 'absolute', top: 17, left: 6, width: 4,  height: 14, background: C.coatLight, opacity: 0.18 }} />
      {/* Edge darks */}
      <div style={{ position: 'absolute', top: 16, left:  5, width: 2, height: 17, background: C.coatDark }} />
      <div style={{ position: 'absolute', top: 16, left: 17, width: 2, height: 17, background: C.coatDark }} />
      {/* Silver buttons */}
      <div style={{ position: 'absolute', top: 18, left: 11, width: 2, height: 2, background: C.button, borderRadius: '50%' }} />
      <div style={{ position: 'absolute', top: 23, left: 11, width: 2, height: 2, background: C.button, borderRadius: '50%' }} />
      <div style={{ position: 'absolute', top: 28, left: 11, width: 2, height: 2, background: C.button, borderRadius: '50%' }} />

      {/* === ARMS === */}
      {/* Left arm */}
      <div style={{
        position: 'absolute', top: 17, left: 1, width: 5, height: 10, background: C.coat,
        transformOrigin: 'top center', animation: armLAnim,
      }} />
      <div style={{
        position: 'absolute', top: 26, left: 2, width: 4, height: 3, background: C.hand,
        transformOrigin: 'top center', animation: armLAnim,
      }} />
      {/* Right arm */}
      <div style={{
        position: 'absolute', top: 17, right: 1, width: 5, height: 10, background: C.coat,
        transformOrigin: 'top center', animation: armRAnim,
      }} />
      <div style={{
        position: 'absolute', top: 26, right: 2, width: 4, height: 3, background: C.hand,
        transformOrigin: 'top center', animation: armRAnim,
      }} />
      {/* Leather notebook in right hand */}
      <div style={{
        position: 'absolute', top: 22, right: -4, width: 6, height: 9,
        background: C.notebook, border: `1px solid ${C.notebookEdge}`, borderRadius: 1,
        transformOrigin: 'top center', animation: armRAnim,
      }} />
      {/* Notebook lines */}
      <div style={{ position: 'absolute', top: 24, right: -3, width: 4, height: 1, background: C.notebookLine, opacity: 0.7, animation: armRAnim, transformOrigin: 'top center' }} />
      <div style={{ position: 'absolute', top: 26, right: -3, width: 4, height: 1, background: C.notebookLine, opacity: 0.7, animation: armRAnim, transformOrigin: 'top center' }} />
      <div style={{ position: 'absolute', top: 28, right: -3, width: 3, height: 1, background: C.notebookLine, opacity: 0.5, animation: armRAnim, transformOrigin: 'top center' }} />

      {/* === PANTS (peeking below coat hem) === */}
      <div style={{
        position: 'absolute', top: 33, left: 7, width: 4, height: 4, background: C.pants,
        transformOrigin: 'top center', animation: legLAnim,
      }} />
      <div style={{
        position: 'absolute', top: 33, left: 13, width: 4, height: 4, background: C.pants,
        transformOrigin: 'top center', animation: legRAnim,
      }} />

      {/* === BOOTS === */}
      <div style={{
        position: 'absolute', top: 36, left: 6, width: 6, height: 6, background: C.boots,
        transformOrigin: 'top center', animation: legLAnim,
      }} />
      <div style={{
        position: 'absolute', top: 36, left: 12, width: 6, height: 6, background: C.boots,
        transformOrigin: 'top center', animation: legRAnim,
      }} />

      <style>{`
        @keyframes childArmL    { from { transform: rotate(-18deg); } to { transform: rotate(18deg); } }
        @keyframes childArmR    { from { transform: rotate(18deg);  } to { transform: rotate(-18deg); } }
        @keyframes childLegL    { from { transform: rotate(-15deg); } to { transform: rotate(15deg); } }
        @keyframes childLegR    { from { transform: rotate(15deg);  } to { transform: rotate(-15deg); } }
        @keyframes childWalkBob { from { transform: translateY(0);  } to { transform: translateY(-3px); } }
      `}</style>
    </div>
  );
}

// ── Chibi map sprite — big head, stubby body, cute proportions ───────────────
const CH = {
  skin: '#f5d5b0', hair: '#3a2010', hairDark: '#1c1008',
  coat: '#1e2850', coatDark: '#0e1428', coatLight: '#2e3870',
  collar: '#d8d8ec', pants: '#242434', boots: '#2a1a0a',
  eye: '#485e6a', eyeShine: '#cce0f0', mouth: '#c08888',
};

export function ChibiChildSprite({ walking = false }) {
  const bob  = walking ? 'chibiBob 0.28s ease-in-out infinite alternate' : 'none';
  const legL = walking ? 'chibLegL 0.28s ease-in-out infinite alternate' : 'none';
  const legR = walking ? 'chibLegR 0.28s ease-in-out infinite alternate 0.14s' : 'none';
  return (
    <div style={{ position: 'relative', width: 14, height: 22, imageRendering: 'pixelated', animation: bob }}>
      {/* Hair */}
      <div style={{ position: 'absolute', top: 0, left: 2, width: 10, height: 4, background: CH.hair }} />
      <div style={{ position: 'absolute', top: 1, left: 3, width: 7, height: 2, background: CH.hairDark, opacity: 0.4 }} />
      {/* Head */}
      <div style={{ position: 'absolute', top: 2, left: 2, width: 10, height: 8, background: CH.skin }} />
      {/* Eyes */}
      <div style={{ position: 'absolute', top: 5, left: 4,  width: 2, height: 2, background: CH.eye }} />
      <div style={{ position: 'absolute', top: 5, left: 8,  width: 2, height: 2, background: CH.eye }} />
      <div style={{ position: 'absolute', top: 5, left: 4,  width: 1, height: 1, background: CH.eyeShine, opacity: 0.8 }} />
      <div style={{ position: 'absolute', top: 5, left: 8,  width: 1, height: 1, background: CH.eyeShine, opacity: 0.8 }} />
      {/* Mouth */}
      <div style={{ position: 'absolute', top: 8, left: 5,  width: 3, height: 1, background: CH.mouth }} />
      {/* Collar */}
      <div style={{ position: 'absolute', top: 9, left: 5,  width: 4, height: 2, background: CH.collar }} />
      {/* Body/coat */}
      <div style={{ position: 'absolute', top: 10, left: 3, width: 8, height: 5, background: CH.coat }} />
      <div style={{ position: 'absolute', top: 10, left: 3, width: 1, height: 5, background: CH.coatDark }} />
      <div style={{ position: 'absolute', top: 10, left: 10,width: 1, height: 5, background: CH.coatDark }} />
      <div style={{ position: 'absolute', top: 11, left: 4, width: 2, height: 3, background: CH.coatLight, opacity: 0.2 }} />
      {/* Arms */}
      <div style={{ position: 'absolute', top: 10, left: 1, width: 2, height: 4, background: CH.coat }} />
      <div style={{ position: 'absolute', top: 10, left: 11,width: 2, height: 4, background: CH.coat }} />
      {/* Legs */}
      <div style={{ position: 'absolute', top: 15, left: 4, width: 2, height: 4, background: CH.pants, transformOrigin: 'top center', animation: legL }} />
      <div style={{ position: 'absolute', top: 15, left: 8, width: 2, height: 4, background: CH.pants, transformOrigin: 'top center', animation: legR }} />
      {/* Boots */}
      <div style={{ position: 'absolute', top: 18, left: 3, width: 3, height: 3, background: CH.boots, transformOrigin: 'top center', animation: legL }} />
      <div style={{ position: 'absolute', top: 18, left: 8, width: 3, height: 3, background: CH.boots, transformOrigin: 'top center', animation: legR }} />
      <style>{`
        @keyframes chibiBob  { from { transform: translateY(0);   } to { transform: translateY(-2px); } }
        @keyframes chibLegL  { from { transform: rotate(-14deg);  } to { transform: rotate(14deg);  } }
        @keyframes chibLegR  { from { transform: rotate(14deg);   } to { transform: rotate(-14deg); } }
      `}</style>
    </div>
  );
}
