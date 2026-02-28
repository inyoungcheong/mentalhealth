import React, { useEffect, useState } from 'react';
import { ChildSprite } from '../components/pixels/PixelChild';

export default function Scene1Intro({ onNext }) {
  const [phase, setPhase] = useState('fade-in'); // fade-in | appear | text | done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('appear'), 800);
    const t2 = setTimeout(() => setPhase('text'), 2200);
    const t3 = setTimeout(() => setPhase('done'), 4500);
    const t4 = setTimeout(() => onNext?.(), 5200);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#ffffff',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative',
      opacity: phase === 'fade-in' ? 0 : 1,
      transition: 'opacity 0.8s ease',
    }}>
      {/* Title */}
      <div style={{
        position: 'absolute', top: 60,
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '14px',
        color: '#1a0a2e',
        letterSpacing: 2,
        opacity: phase === 'text' || phase === 'done' ? 1 : 0,
        transition: 'opacity 0.6s ease',
        textAlign: 'center',
      }}>
        <div>TAROT</div>
        <div style={{ color: '#6b2d8b', marginTop: 8 }}>JOURNEY</div>
      </div>

      {/* Subtitle */}
      <div style={{
        position: 'absolute', top: 110,
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '7px',
        color: '#888',
        opacity: phase === 'done' ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}>
        당신의 이야기를 찾아서
      </div>

      {/* Pixel child character - center */}
      <div style={{
        opacity: phase === 'appear' || phase === 'text' || phase === 'done' ? 1 : 0,
        transform: phase === 'appear' || phase === 'text' || phase === 'done'
          ? 'scale(1) translateY(0)' : 'scale(0.5) translateY(30px)',
        transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        imageRendering: 'pixelated',
      }}>
        <div style={{ transform: 'scale(3)', transformOrigin: 'bottom center' }}>
          <ChildSprite />
        </div>
      </div>

      {/* Sparkles */}
      {(phase === 'text' || phase === 'done') && (
        <>
          <div style={{ position: 'absolute', top: '35%', left: '30%', fontSize: 16, color: '#ffd700', animation: 'sparkle 1.5s infinite' }}>✦</div>
          <div style={{ position: 'absolute', top: '40%', right: '28%', fontSize: 12, color: '#c084fc', animation: 'sparkle 2s infinite 0.5s' }}>★</div>
          <div style={{ position: 'absolute', top: '55%', left: '22%', fontSize: 10, color: '#ffd700', animation: 'sparkle 1.8s infinite 0.3s' }}>✦</div>
        </>
      )}

      {/* Loading dots */}
      <div style={{
        position: 'absolute', bottom: 40,
        fontFamily: "'Press Start 2P'", fontSize: '8px', color: '#aaa',
        opacity: phase === 'done' ? 1 : 0, transition: 'opacity 0.4s',
      }}>
        <span className="loading-dot">.</span>
        <span className="loading-dot">.</span>
        <span className="loading-dot">.</span>
      </div>

      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}
