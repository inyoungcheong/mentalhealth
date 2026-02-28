import React from 'react';

// Pixel village background using CSS
// 480 × 200 game area (bottom part of screen)

export default function PixelVillage({ children, style = {} }) {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      ...style,
    }}>
      {/* Sky */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '55%',
        background: 'linear-gradient(180deg, #87ceeb 0%, #b0e0f8 70%, #c8eeff 100%)',
      }} />

      {/* Sun */}
      <div style={{
        position: 'absolute', top: 20, right: 80,
        width: 30, height: 30,
        background: '#ffd700',
        borderRadius: '50%',
        boxShadow: '0 0 12px #ffd700, 0 0 24px rgba(255,215,0,0.4)',
        imageRendering: 'pixelated',
      }} />

      {/* Clouds */}
      <Cloud x={60} y={30} />
      <Cloud x={240} y={18} />
      <Cloud x={380} y={35} />

      {/* Far background buildings */}
      <Building x={30} y="30%" h={80} w={40} color="#c8a87a" roofColor="#8b6914" windows={2} />
      <Building x={100} y="25%" h={100} w={50} color="#d4a373" roofColor="#6b4f28" windows={3} />
      <Building x={180} y="28%" h={90} w={45} color="#b8997a" roofColor="#7a5a30" windows={2} />
      <Building x={280} y="22%" h={110} w={55} color="#c4956a" roofColor="#5a3a18" windows={4} />
      <Building x={380} y="26%" h={95} w={48} color="#d0a87a" roofColor="#7a5828" windows={3} />
      <Building x={440} y="30%" h={85} w={42} color="#ba9070" roofColor="#6a4820" windows={2} />

      {/* Ground */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
        background: '#5a9e3a',
      }} />

      {/* Path / road */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '25%',
        background: '#8b6914',
      }} />

      {/* Path stones */}
      {[20, 80, 140, 200, 260, 320, 380, 440].map(x => (
        <div key={x} style={{
          position: 'absolute', bottom: 12, left: x,
          width: 40, height: 12,
          background: '#a07820',
          border: '1px solid #7a5a10',
          imageRendering: 'pixelated',
        }} />
      ))}

      {/* Trees */}
      <PixelTree x={15} bottom={48} />
      <PixelTree x={60} bottom={52} />
      <PixelTree x={350} bottom={50} />
      <PixelTree x={420} bottom={48} />

      {/* Lamp post */}
      <LampPost x={200} />
      <LampPost x={340} />

      {children}
    </div>
  );
}

function Cloud({ x, y }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      <div style={{
        display: 'flex', gap: 0,
      }}>
        <div style={{ width: 16, height: 10, background: '#fff', borderRadius: '50%', marginTop: 4 }} />
        <div style={{ width: 22, height: 16, background: '#fff', borderRadius: '50%' }} />
        <div style={{ width: 18, height: 12, background: '#fff', borderRadius: '50%', marginTop: 2 }} />
        <div style={{ width: 14, height: 9, background: '#fff', borderRadius: '50%', marginTop: 5 }} />
      </div>
      <div style={{ width: 60, height: 8, background: '#fff', marginTop: -4 }} />
    </div>
  );
}

function Building({ x, y, h, w, color, roofColor, windows = 2 }) {
  return (
    <div style={{
      position: 'absolute', left: x, bottom: `calc(45% - 4px)`,
      width: w, height: h,
      background: color,
      border: '1px solid rgba(0,0,0,0.2)',
      imageRendering: 'pixelated',
    }}>
      {/* Roof */}
      <div style={{
        position: 'absolute', top: -12, left: -4, right: -4,
        height: 14,
        background: roofColor,
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      }} />
      {/* Windows */}
      {Array.from({ length: windows }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: 15 + i * 22,
          left: '50%', transform: 'translateX(-50%)',
          width: 10, height: 12,
          background: 'rgba(255,220,100,0.7)',
          border: '1px solid rgba(0,0,0,0.3)',
        }} />
      ))}
      {/* Door */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: 12, height: 18,
        background: '#5a3010',
        border: '1px solid #3d2008',
      }} />
    </div>
  );
}

function PixelTree({ x, bottom }) {
  return (
    <div style={{
      position: 'absolute', left: x, bottom, imageRendering: 'pixelated',
    }}>
      {/* Trunk */}
      <div style={{
        width: 8, height: 18,
        background: '#6b4226',
        marginLeft: 10,
      }} />
      {/* Foliage - 3 layers */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: 28, height: 16,
        background: '#2d7a2d',
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      }} />
      <div style={{
        position: 'absolute', top: 10, left: -2,
        width: 32, height: 18,
        background: '#3a9e3a',
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      }} />
      <div style={{
        position: 'absolute', top: 20, left: -4,
        width: 36, height: 20,
        background: '#4ab04a',
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      }} />
    </div>
  );
}

function LampPost({ x }) {
  return (
    <div style={{
      position: 'absolute', left: x, bottom: 28, imageRendering: 'pixelated',
    }}>
      {/* Post */}
      <div style={{ width: 4, height: 50, background: '#4a4a6a', marginLeft: 6 }} />
      {/* Lamp head */}
      <div style={{
        position: 'absolute', top: 0, left: 2,
        width: 12, height: 8,
        background: '#ffd700',
        border: '2px solid #b8860b',
        boxShadow: '0 0 6px rgba(255,215,0,0.5)',
      }} />
    </div>
  );
}
