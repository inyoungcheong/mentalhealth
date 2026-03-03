import React from 'react';

// Pixel village - Pacific Northwest Forest atmosphere
// Dense conifers, misty mountains, starry twilight, cabin glow

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
      {/* ===== SKY - Pacific NW twilight: deep indigo → purple → warm horizon ===== */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '48%',
        background: 'linear-gradient(180deg, #0d1428 0%, #1a2540 20%, #2a3058 45%, #3d3a6a 70%, #5a4a6a 85%, #8a6a5a 95%, #c8a878 100%)',
      }} />

      {/* ===== STARS - cool white, more numerous ===== */}
      {[
        [6,2],[25,5],[55,3],[95,6],[140,4],[185,8],[230,3],[275,7],[320,5],[365,4],[410,9],[455,3],
        [18,14],[65,18],[120,12],[200,16],[280,14],[350,20],[420,15],
      ].map(([sx, sy], i) => (
        <div key={i} style={{
          position: 'absolute', left: sx, top: sy,
          width: i % 3 === 0 ? 2 : 1, height: i % 3 === 0 ? 2 : 1,
          background: i % 3 === 0 ? '#e8f0ff' : '#c8d8f0',
          opacity: 0.5 + (i % 3) * 0.2,
          animation: `starTwinkle ${1.5 + (i % 4) * 0.4}s ease-in-out infinite ${(i % 5) * 0.3}s`,
        }} />
      ))}

      {/* ===== MOON + sparkles ===== */}
      <div style={{
        position: 'absolute', top: 8, right: '8%',
        width: 38, height: 38,
        background: 'radial-gradient(circle at 40% 40%, #fffef8, #f5ecd8, #e8dcc8)',
        borderRadius: '50%',
        boxShadow: '0 0 18px rgba(255,248,235,0.7), 0 0 36px rgba(240,230,210,0.35)',
      }} />
      {[
        { top: 4, right: 'calc(8% - 6px)', size: 9, delay: 0 },
        { top: 14, right: 'calc(8% - 18px)', size: 7, delay: 0.4 },
        { top: 24, right: 'calc(8% - 10px)', size: 6, delay: 0.8 },
        { top: 8, right: 'calc(8% + 34px)', size: 7, delay: 0.2 },
        { top: 20, right: 'calc(8% + 30px)', size: 6, delay: 0.6 },
      ].map((s, i) => (
        <div key={i} style={{
          position: 'absolute', top: s.top, right: s.right,
          fontSize: s.size, color: '#e8f0ff', opacity: 0.85,
          textShadow: '0 0 5px #e8f0ff',
          animation: `starTwinkle ${1.8 + (i % 3) * 0.3}s ease-in-out infinite ${s.delay}s`,
          pointerEvents: 'none',
        }}>✦</div>
      ))}

      {/* ===== MISTY MOUNTAINS - layered blue-grey, PNW depth ===== */}
      <div style={{
        position: 'absolute', bottom: '35%', left: 0, right: 0, height: 52,
        background: '#2a3548',
        clipPath: 'polygon(0% 100%, 4% 40%, 12% 60%, 22% 25%, 35% 50%, 48% 30%, 62% 55%, 75% 28%, 88% 45%, 100% 60%, 100% 100%)',
      }} />
      <div style={{
        position: 'absolute', bottom: '35%', left: 0, right: 0, height: 38,
        background: '#3a4558',
        clipPath: 'polygon(0% 100%, 8% 55%, 18% 72%, 30% 42%, 45% 62%, 58% 48%, 70% 68%, 85% 52%, 100% 58%, 100% 100%)',
      }} />
      <div style={{
        position: 'absolute', bottom: '35%', left: 0, right: 0, height: 24,
        background: '#4a5568',
        clipPath: 'polygon(0% 100%, 15% 70%, 40% 85%, 60% 65%, 85% 78%, 100% 70%, 100% 100%)',
      }} />

      {/* ===== DENSE CONIFERS - silhouettes, PNW forest ===== */}
      <ConiferRow />
      <ConiferRow offset={12} scale={0.9} />
      <ConiferRow offset={24} scale={1.1} />

      {/* ===== CABIN / BUILDINGS - warm glow (PNW lodge) ===== */}
      <ArcanaBuilding x="5%"  h={68}  w={30} color="#3a3528" roofColor="#2a2518" windows={2} accent="#e8c060" />
      <ArcanaBuilding x="28%" h={82}  w={38} color="#423a2a" roofColor="#302818" windows={3} accent="#f0d070" />
      <ArcanaBuilding x="55%" h={76}  w={34} color="#3a3528" roofColor="#2a2518" windows={2} accent="#e0b858" />
      <ArcanaBuilding x="78%" h={64}  w={28} color="#383228" roofColor="#252018" windows={2} accent="#d8b050" />

      {/* ===== FOREST FLOOR - deep mossy greens ===== */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '52%',
        background: '#0f1a12',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '42%',
        background: '#142218',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
        background: '#1a2e20',
      }} />
      <div style={{
        position: 'absolute', bottom: '30%', left: 0, right: 0, height: 4,
        background: '#243a28',
      }} />

      {/* ===== PATH - forest trail, darker ===== */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '65%', height: '16%',
        background: '#2a2820',
        borderTop: '2px solid #3a3528',
      }} />
      {[20, 32, 44, 56, 68, 80].map((pct, i) => (
        <React.Fragment key={i}>
          <div style={{
            position: 'absolute', bottom: '4%', left: `${pct}%`,
            width: '7%', height: '9%',
            background: i % 2 === 0 ? '#352e28' : '#3a3228',
            border: '1px solid #252018',
            borderRadius: 2,
          }} />
          <div style={{
            position: 'absolute', bottom: '1%', left: `${pct + 5}%`,
            width: '7%', height: '9%',
            background: i % 2 === 0 ? '#3a3228' : '#352e28',
            border: '1px solid #252018',
            borderRadius: 2,
          }} />
        </React.Fragment>
      ))}

      {/* ===== FOREGROUND CONIFERS ===== */}
      <ConiferTree x="2%"  bottom="20%" size={1.0} />
      <ConiferTree x="16%" bottom="22%" size={1.2} />
      <ConiferTree x="74%" bottom="21%" size={1.05} />
      <ConiferTree x="90%" bottom="19%" size={0.9} />

      {/* ===== LANTERNS (warm cabin light) ===== */}
      <MagicLantern x="38%" />
      <MagicLantern x="62%" />

      {/* ===== MIST / FOG - subtle PNW atmosphere ===== */}
      <div style={{
        position: 'absolute', bottom: '12%', left: 0, right: 0, height: '25%',
        background: 'linear-gradient(0deg, rgba(40,55,70,0.25) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* ===== FIREFLIES (cooler tint) ===== */}
      {[60, 140, 280, 400].map((fx, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: fx, bottom: `${52 + (i % 3) * 10}%`,
          width: 3, height: 3,
          background: '#e8f0c0',
          borderRadius: '50%',
          boxShadow: '0 0 6px rgba(220,240,180,0.7)',
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
      position: 'absolute', left: x, bottom: '18%',
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

// Dense conifer row — PNW forest silhouette
function ConiferRow({ offset = 0, scale = 1 }) {
  const h = 28 * scale;
  return (
    <>
      {[5, 18, 32, 48, 62, 78, 92].map((pct, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${pct}%`, bottom: `calc(38% + ${offset}px)`,
          width: Math.round(14 * scale), height: Math.round(h),
          background: i % 2 === 0 ? '#0d1820' : '#121c28',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          border: '1px solid #1a2835',
        }} />
      ))}
    </>
  );
}

// Single conifer — tall fir/spruce silhouette
function ConiferTree({ x, bottom, size = 1 }) {
  const s = size;
  return (
    <div style={{
      position: 'absolute', left: x, bottom, imageRendering: 'pixelated',
      transform: 'translateX(-50%)',
    }}>
      {/* Trunk - dark */}
      <div style={{
        width: Math.round(6 * s), height: Math.round(28 * s),
        background: '#1a1810',
        marginLeft: Math.round(10 * s),
      }} />
      {/* Foliage - layered triangles, dark blue-green PNW */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: Math.round(28 * s), height: Math.round(14 * s),
        background: '#0f1e18',
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      }} />
      <div style={{
        position: 'absolute', top: Math.round(10 * s), left: Math.round(-2 * s),
        width: Math.round(32 * s), height: Math.round(16 * s),
        background: '#142820',
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      }} />
      <div style={{
        position: 'absolute', top: Math.round(22 * s), left: Math.round(-4 * s),
        width: Math.round(36 * s), height: Math.round(18 * s),
        background: '#182e26',
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      }} />
    </div>
  );
}

function MagicLantern({ x }) {
  return (
    <div style={{
      position: 'absolute', left: x, bottom: '6%', transform: 'translateX(-50%)',
      imageRendering: 'pixelated',
    }}>
      {/* Post */}
      <div style={{ width: 4, height: 54, background: '#5a4a78', marginLeft: 7 }} />
      {/* Post base */}
      <div style={{ position: 'absolute', bottom: 0, left: 4, width: 10, height: 4, background: '#4a3a68' }} />
      {/* Post top curl */}
      <div style={{ position: 'absolute', top: 0, left: 5, width: 8, height: 6, background: '#5a4a78', borderRadius: '50% 50% 0 0' }} />
      {/* Lantern housing */}
      <div style={{
        position: 'absolute', top: -4, left: 2,
        width: 14, height: 18,
        background: '#3a2a58',
        border: '2px solid #9070d0',
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
