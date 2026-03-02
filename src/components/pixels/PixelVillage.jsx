import React from 'react';

// Pixel village - Tarot Journey style
// Warm twilight sky, mystical stone buildings, glowing lanterns, enchanted forest

export default function PixelVillage({ children, style = {} }) {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      imageRendering: 'pixelated',
      ...style,
    }}>
      {/* ===== SKY - soft twilight gradient (cohesive warm tones) ===== */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '58%',
        background: 'linear-gradient(180deg, #1e1538 0%, #2d1f4a 20%, #4a2d5a 40%, #6b3d4a 65%, #d4895a 85%, #f0c890 100%)',
      }} />

      {/* ===== STARS - warm white/gold tones (no green) ===== */}
      {[
        [8,4],[40,8],[90,3],[130,12],[180,5],[220,9],[270,3],[310,14],[360,6],[400,10],[450,4],
        [25,20],[75,16],[160,22],[240,18],[320,20],[430,15],
      ].map(([sx, sy], i) => (
        <div key={i} style={{
          position: 'absolute', left: sx, top: sy,
          width: i % 3 === 0 ? 2 : 1, height: i % 3 === 0 ? 2 : 1,
          background: i % 3 === 0 ? '#fff8e8' : '#f8ecd8',
          opacity: 0.6 + (i % 3) * 0.15,
          animation: `starTwinkle ${1.5 + (i % 4) * 0.4}s ease-in-out infinite ${(i % 5) * 0.3}s`,
        }} />
      ))}

      {/* ===== MOON - soft cream with gentle glow ===== */}
      <div style={{
        position: 'absolute', top: 14, right: 70,
        width: 28, height: 28,
        background: 'radial-gradient(circle at 35% 35%, #fff8e8, #f5e6c8)',
        borderRadius: '50%',
        boxShadow: '0 0 12px rgba(255,245,220,0.6), 0 0 24px rgba(248,232,200,0.25)',
      }} />
      {/* Moon crescent - softer overlap */}
      <div style={{
        position: 'absolute', top: 16, right: 76,
        width: 20, height: 20,
        background: '#2d1f4a',
        borderRadius: '50%',
        opacity: 0.6,
      }} />

      {/* ===== DISTANT MOUNTAINS - softer silhouettes ===== */}
      <div style={{
        position: 'absolute', bottom: '42%', left: 0, right: 0, height: 60,
        background: '#251a3a',
        clipPath: 'polygon(0% 100%, 5% 30%, 12% 60%, 20% 10%, 28% 50%, 38% 20%, 48% 55%, 55% 15%, 65% 45%, 75% 5%, 85% 40%, 92% 20%, 100% 50%, 100% 100%)',
      }} />
      <div style={{
        position: 'absolute', bottom: '42%', left: 0, right: 0, height: 45,
        background: '#2d2045',
        clipPath: 'polygon(0% 100%, 8% 40%, 18% 70%, 30% 25%, 42% 65%, 52% 30%, 62% 60%, 72% 20%, 82% 55%, 92% 35%, 100% 60%, 100% 100%)',
      }} />

      {/* ===== MYSTICAL BUILDINGS - warmer, cohesive palette ===== */}
      <ArcanaBuilding x={20}  h={85}  w={38} color="#2d2048" roofColor="#1e1538" windows={2} accent="#7a5ab0" />
      <ArcanaBuilding x={80}  h={105} w={46} color="#352250" roofColor="#251a40" windows={3} accent="#8a6ac0" />
      <ArcanaBuilding x={170} h={92}  w={42} color="#2d2048" roofColor="#1e1538" windows={2} accent="#6a4a98" />
      <ArcanaBuilding x={268} h={115} w={52} color="#3d2858" roofColor="#2a1f48" windows={4} accent="#9a7ad0" />
      <ArcanaBuilding x={368} h={98}  w={46} color="#322248" roofColor="#221838" windows={3} accent="#7a5ab0" />
      <ArcanaBuilding x={438} h={88}  w={40} color="#2d2048" roofColor="#1e1538" windows={2} accent="#6a4a98" />

      {/* ===== GROUND - mystical forest floor (deeper, richer greens) ===== */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '46%',
        background: '#152518',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '38%',
        background: '#1e3820',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%',
        background: '#284828',
      }} />
      {/* Grass highlight - softer edge */}
      <div style={{
        position: 'absolute', bottom: '28%', left: 0, right: 0, height: 4,
        background: 'linear-gradient(180deg, rgba(80,140,60,0.4), transparent)',
      }} />

      {/* ===== COBBLESTONE PATH ===== */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '22%',
        background: '#3a3028',
      }} />
      <div style={{
        position: 'absolute', bottom: '22%', left: 0, right: 0, height: 3,
        background: '#6a5a48',
      }} />
      {/* Cobblestones - offset rows */}
      {[10, 58, 106, 154, 202, 250, 298, 346, 394, 442].map((x, i) => (
        <React.Fragment key={x}>
          <div style={{
            position: 'absolute', bottom: 18, left: x,
            width: 36, height: 14,
            background: i % 2 === 0 ? '#4a4038' : '#524840',
            border: '1px solid #2a2018',
            borderRadius: 2,
          }} />
          <div style={{
            position: 'absolute', bottom: 6, left: x + 18,
            width: 36, height: 14,
            background: i % 2 === 0 ? '#524840' : '#4a4038',
            border: '1px solid #2a2018',
            borderRadius: 2,
          }} />
        </React.Fragment>
      ))}

      {/* ===== ENCHANTED TREES ===== */}
      <EnchantedTree x={10}  bottom={50} size={1.0} />
      <EnchantedTree x={55}  bottom={54} size={1.2} />
      <EnchantedTree x={345} bottom={52} size={1.1} />
      <EnchantedTree x={415} bottom={50} size={0.9} />

      {/* ===== MAGIC LANTERN POSTS ===== */}
      <MagicLantern x={188} />
      <MagicLantern x={328} />

      {/* ===== FIREFLIES - warm amber glow (matches sky) ===== */}
      {[70, 130, 290, 390].map((fx, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: fx, bottom: `${55 + (i % 3) * 8}%`,
          width: 3, height: 3,
          background: '#f8e8a0',
          borderRadius: '50%',
          boxShadow: '0 0 6px rgba(248,232,160,0.8)',
          animation: `firefly ${2 + i * 0.5}s ease-in-out infinite ${i * 0.7}s`,
        }} />
      ))}

      {children}

      <style>{`
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes firefly {
          0%, 100% { opacity: 0; transform: translateY(0px) translateX(0px); }
          25% { opacity: 1; transform: translateY(-8px) translateX(4px); }
          50% { opacity: 0.8; transform: translateY(-14px) translateX(-3px); }
          75% { opacity: 0.5; transform: translateY(-6px) translateX(6px); }
        }
        @keyframes lanternGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(255,200,80,0.6), 0 0 16px rgba(255,160,40,0.3); }
          50% { box-shadow: 0 0 14px rgba(255,200,80,0.9), 0 0 28px rgba(255,160,40,0.5); }
        }
      `}</style>
    </div>
  );
}

function ArcanaBuilding({ x, h, w, color, roofColor, windows = 2, accent }) {
  return (
    <div style={{
      position: 'absolute', left: x, bottom: 'calc(46% - 2px)',
      width: w, height: h,
      background: color,
      imageRendering: 'pixelated',
    }}>
      {/* Roof - pointed */}
      <div style={{
        position: 'absolute', top: -16, left: -6, right: -6,
        height: 18,
        background: roofColor,
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      }} />
      {/* Roof accent */}
      <div style={{
        position: 'absolute', top: -14, left: -4, right: -4,
        height: 14,
        background: accent,
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        opacity: 0.3,
      }} />
      {/* Spire tip */}
      <div style={{
        position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)',
        width: 4, height: 8,
        background: accent,
        opacity: 0.8,
      }} />
      {/* Windows - warm amber glow */}
      {Array.from({ length: windows }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: 12 + i * 24,
          left: '50%', transform: 'translateX(-50%)',
          width: 10, height: 14,
          background: 'rgba(255,230,180,0.6)',
          border: `1px solid rgba(255,210,120,0.5)`,
          boxShadow: `0 0 6px rgba(255,220,150,0.5)`,
        }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 1, height: '100%', background: accent, opacity: 0.5 }} />
          <div style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', width: '100%', height: 1, background: accent, opacity: 0.5 }} />
        </div>
      ))}
      {/* Arched door */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: 14, height: 20,
        background: roofColor,
        border: `1px solid ${accent}`,
        borderRadius: '50% 50% 0 0',
      }} />
      <div style={{
        position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)',
        width: 8, height: 12,
        background: accent,
        borderRadius: '50% 50% 0 0',
        opacity: 0.2,
      }} />
    </div>
  );
}

function EnchantedTree({ x, bottom, size = 1 }) {
  const s = size;
  return (
    <div style={{
      position: 'absolute', left: x, bottom, imageRendering: 'pixelated',
    }}>
      {/* Trunk */}
      <div style={{
        width: Math.round(9 * s), height: Math.round(22 * s),
        background: '#3a2810',
        marginLeft: Math.round(12 * s),
        borderRadius: '2px 2px 0 0',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: Math.round(13 * s),
        width: Math.round(3 * s), height: Math.round(18 * s),
        background: '#5a4020',
        opacity: 0.5,
      }} />
      {/* Foliage layers - dark mystical green */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: Math.round(32 * s), height: Math.round(18 * s),
        background: '#1a4a20',
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      }} />
      <div style={{
        position: 'absolute', top: Math.round(12 * s), left: Math.round(-3 * s),
        width: Math.round(38 * s), height: Math.round(20 * s),
        background: '#1e5828',
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      }} />
      <div style={{
        position: 'absolute', top: Math.round(24 * s), left: Math.round(-5 * s),
        width: Math.round(44 * s), height: Math.round(22 * s),
        background: '#246830',
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      }} />
      {/* Magic glow - soft warm tint */}
      <div style={{
        position: 'absolute', top: Math.round(8 * s), left: Math.round(8 * s),
        width: Math.round(16 * s), height: Math.round(16 * s),
        background: 'radial-gradient(circle, rgba(200,180,120,0.2) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />
      {/* Glowing orbs - warm amber */}
      <div style={{
        position: 'absolute', top: Math.round(18 * s), left: Math.round(6 * s),
        width: Math.round(4 * s), height: Math.round(4 * s),
        background: '#e8c860',
        borderRadius: '50%',
        boxShadow: `0 0 ${Math.round(4 * s)}px rgba(232,200,96,0.8)`,
        opacity: 0.85,
      }} />
      <div style={{
        position: 'absolute', top: Math.round(22 * s), left: Math.round(22 * s),
        width: Math.round(3 * s), height: Math.round(3 * s),
        background: '#f0d878',
        borderRadius: '50%',
        boxShadow: `0 0 ${Math.round(3 * s)}px rgba(240,216,120,0.7)`,
        opacity: 0.75,
      }} />
    </div>
  );
}

function MagicLantern({ x }) {
  return (
    <div style={{
      position: 'absolute', left: x, bottom: 26, imageRendering: 'pixelated',
    }}>
      {/* Post */}
      <div style={{ width: 4, height: 54, background: '#4a3a60', marginLeft: 7 }} />
      {/* Post base */}
      <div style={{ position: 'absolute', bottom: 0, left: 4, width: 10, height: 4, background: '#3a2a50' }} />
      {/* Post top curl */}
      <div style={{ position: 'absolute', top: 0, left: 5, width: 8, height: 6, background: '#4a3a60', borderRadius: '50% 50% 0 0' }} />
      {/* Lantern housing */}
      <div style={{
        position: 'absolute', top: -4, left: 2,
        width: 14, height: 18,
        background: '#2a1a40',
        border: '2px solid #8060c0',
        borderRadius: 3,
      }} />
      {/* Lantern glow */}
      <div style={{
        position: 'absolute', top: -2, left: 4,
        width: 10, height: 14,
        background: 'rgba(255,200,80,0.85)',
        borderRadius: 2,
        animation: 'lanternGlow 2s ease-in-out infinite',
      }} />
      {/* Flame */}
      <div style={{
        position: 'absolute', top: 1, left: 7,
        width: 4, height: 8,
        background: '#fff8c0',
        borderRadius: '50% 50% 30% 30%',
        opacity: 0.9,
      }} />
      {/* Ground light pool */}
      <div style={{
        position: 'absolute', bottom: -6, left: -6,
        width: 26, height: 8,
        background: 'radial-gradient(ellipse, rgba(255,200,80,0.25) 0%, transparent 70%)',
      }} />
    </div>
  );
}
