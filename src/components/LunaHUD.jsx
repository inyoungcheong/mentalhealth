import React, { useState, useEffect, useRef } from 'react';

// Always-visible Luna balance badge.
// Animates count up/down when balance changes.
// balance = null → hidden (not yet logged in)
// onLogout → called when user clicks 로그아웃
export default function LunaHUD({ balance, onLogout }) {
  const [display, setDisplay] = useState(0);
  const [glow, setGlow] = useState('none'); // 'gain' | 'spend' | 'none'
  const [open, setOpen] = useState(false);
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
    <>
      {/* Badge (clickable) */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed',
          top: 12, right: 12,
          zIndex: 9000,
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'rgba(12, 4, 26, 0.92)',
          border: `1px solid ${isSpend ? '#c06060' : isGain ? '#ffd700' : open ? '#9b4fc4' : '#4a2d6b'}`,
          borderRadius: 4,
          padding: '5px 11px',
          boxShadow: isGain
            ? '0 0 18px rgba(255,215,0,0.65), 0 0 40px rgba(255,215,0,0.18)'
            : isSpend
            ? '0 0 10px rgba(192,96,96,0.4)'
            : open
            ? '0 0 12px rgba(107,45,139,0.5)'
            : '0 2px 8px rgba(0,0,0,0.55)',
          transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
          fontFamily: "'Press Start 2P'",
          userSelect: 'none',
          cursor: 'pointer',
        }}
      >
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
      </div>

      {/* Popup panel */}
      {open && (
        <>
          {/* Backdrop (click to close) */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 8999 }}
          />
          <div style={{
            position: 'fixed',
            top: 44, right: 12,
            zIndex: 9001,
            background: 'rgba(10, 4, 24, 0.97)',
            border: '1px solid #4a2d6b',
            borderRadius: 4,
            padding: '14px 16px',
            display: 'flex', flexDirection: 'column', gap: 10,
            minWidth: 160,
            boxShadow: '0 4px 24px rgba(0,0,0,0.7)',
            fontFamily: "'Press Start 2P'",
            animation: 'lua-panel-in 0.18s ease',
          }}>
            {/* Balance row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 8, borderBottom: '1px solid rgba(107,45,139,0.3)' }}>
              <span style={{ fontSize: '9px', color: '#ffd700' }}>♦</span>
              <span style={{ fontSize: '11px', color: '#fff' }}>{display}</span>
              <span style={{ fontSize: '7px', color: '#9b6abb', marginLeft: 2 }}>루나</span>
            </div>

            {/* Recharge (locked) */}
            <button
              disabled
              style={{
                fontFamily: "'Press Start 2P'",
                fontSize: '7px',
                background: 'rgba(107,45,139,0.08)',
                border: '1px solid #2a1a4a',
                color: '#5a3a7a',
                padding: '7px 10px',
                cursor: 'not-allowed',
                textAlign: 'left',
                lineHeight: 1.7,
              }}
            >
              루나 충전<br />
              <span style={{ fontSize: '6px', color: '#3a2050' }}>(준비 중)</span>
            </button>

            {/* Logout */}
            <button
              onClick={() => { setOpen(false); onLogout?.(); }}
              style={{
                fontFamily: "'Press Start 2P'",
                fontSize: '7px',
                background: 'rgba(180,60,60,0.1)',
                border: '1px solid #5a2020',
                color: '#c08080',
                padding: '7px 10px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              로그아웃
            </button>
          </div>
        </>
      )}

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
        @keyframes lua-panel-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
