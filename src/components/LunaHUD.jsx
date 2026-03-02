import React, { useState, useEffect, useRef } from 'react';

// Always-visible Luna balance badge.
// Animates count up/down when balance changes.
// balance = null → hidden (not yet logged in)
export default function LunaHUD({ balance }) {
  const [display, setDisplay] = useState(0);
  const [glow, setGlow] = useState('none'); // 'gain' | 'spend' | 'none'
  const prevRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (balance === null || balance === undefined) return;

    const prev = prevRef.current;
    prevRef.current = balance;

    // First real value after null: no animation, just show
    if (prev === null) {
      setDisplay(balance);
      return;
    }

    if (prev === balance) return;

    // Animate from prev to balance
    if (animRef.current) clearInterval(animRef.current);
    const isGain = balance > prev;
    setGlow(isGain ? 'gain' : 'spend');

    const steps = Math.abs(balance - prev);
    const stepMs = Math.min(240, Math.max(80, 600 / steps));
    let current = prev;

    animRef.current = setInterval(() => {
      current += isGain ? 1 : -1;
      setDisplay(current);
      if (current === balance) {
        clearInterval(animRef.current);
        setTimeout(() => setGlow('none'), 700);
      }
    }, stepMs);

    return () => clearInterval(animRef.current);
  }, [balance]);

  if (balance === null || balance === undefined) return null;

  const isGain = glow === 'gain';
  const isSpend = glow === 'spend';

  return (
    <div style={{
      position: 'fixed',
      top: 12, right: 12,
      zIndex: 9000,
      display: 'flex', alignItems: 'center', gap: 5,
      background: 'rgba(12, 4, 26, 0.92)',
      border: `1px solid ${isSpend ? '#c06060' : isGain ? '#ffd700' : '#4a2d6b'}`,
      borderRadius: 4,
      padding: '5px 11px',
      boxShadow: isGain
        ? '0 0 18px rgba(255,215,0,0.65), 0 0 40px rgba(255,215,0,0.18)'
        : isSpend
        ? '0 0 10px rgba(192,96,96,0.4)'
        : '0 2px 8px rgba(0,0,0,0.55)',
      transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
      fontFamily: "'Press Start 2P'",
      userSelect: 'none',
      pointerEvents: 'none',
    }}>
      <span style={{
        fontSize: '9px',
        color: isSpend ? '#c08080' : '#ffd700',
        transition: 'color 0.3s',
        animation: isGain ? 'lua-gem-pulse 0.35s ease' : 'none',
      }}>♦</span>
      <span style={{
        fontSize: '11px',
        color: isSpend ? '#c08080' : '#ffffff',
        transition: 'color 0.3s',
        minWidth: 14,
        textAlign: 'center',
        animation: isGain ? 'lua-num-pop 0.3s ease' : 'none',
      }}>{display}</span>

      <style>{`
        @keyframes lua-gem-pulse {
          0%   { transform: scale(1);   color: #ffd700; }
          45%  { transform: scale(1.7); color: #fff; }
          100% { transform: scale(1);   color: #ffd700; }
        }
        @keyframes lua-num-pop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
