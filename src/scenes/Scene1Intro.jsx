import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { initUserLua } from '../services/luaService';

// ✦ sparkle positions — matched to star hints in the watercolor
const SPARKLES = [
  { top: '8%',  left: '82%', sz: 14, del: 0,    c: '#ffd700' },
  { top: '10%', left: '14%', sz: 10, del: 0.6,  c: '#ffd700' },
  { top: '5%',  left: '52%', sz:  8, del: 1.1,  c: '#c5a3f5' },
  { top: '15%', left: '32%', sz: 11, del: 0.3,  c: '#ffd700' },
  { top: '12%', left: '70%', sz:  9, del: 0.9,  c: '#c5a3f5' },
  { top: '20%', left: '91%', sz:  7, del: 1.5,  c: '#ffd700' },
  { top: '3%',  left: '38%', sz:  6, del: 2.0,  c: '#c5a3f5' },
  { top: '18%', left: '6%',  sz:  8, del: 0.7,  c: '#ffd700' },
  { top: '7%',  left: '60%', sz:  6, del: 1.3,  c: '#c5a3f5' },
];

// floating magic dust in the forest
const DUST = [
  { top: '38%', left: '18%', dur: 5.2, del: 0.0, c: '#c5a3f5' },
  { top: '55%', left: '76%', dur: 4.8, del: 0.8, c: '#ffd700' },
  { top: '68%', left: '36%', dur: 6.1, del: 1.4, c: '#a0c8e8' },
  { top: '44%', left: '62%', dur: 4.5, del: 0.3, c: '#c5a3f5' },
  { top: '72%', left: '50%', dur: 5.8, del: 1.9, c: '#ffd700' },
  { top: '80%', left: '24%', dur: 4.3, del: 0.6, c: '#c5a3f5' },
  { top: '42%', left: '88%', dur: 5.5, del: 1.1, c: '#a0c8e8' },
  { top: '62%', left: '8%',  dur: 6.3, del: 0.4, c: '#ffd700' },
  { top: '50%', left: '44%', dur: 4.9, del: 1.7, c: '#c5a3f5' },
  { top: '76%', left: '66%', dur: 5.1, del: 2.2, c: '#a0c8e8' },
  { top: '33%', left: '55%', dur: 4.6, del: 0.2, c: '#ffd700' },
  { top: '85%', left: '42%', dur: 5.7, del: 1.6, c: '#c5a3f5' },
];

export default function Scene1Intro({ user, authLoaded, onNext }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGoogleLogin() {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      const { isNew, lastVisitAt, lua } = await initUserLua();
      onNext?.({ isNew, lastVisitAt, lua });
    } catch {
      setError('로그인 실패. 다시 시도해봐.');
      setLoading(false);
    }
  }

  async function handleEnter() {
    setLoading(true);
    try {
      const { isNew, lastVisitAt, lua } = await initUserLua();
      onNext?.({ isNew, lastVisitAt, lua });
    } catch {
      setError('오류가 발생했어. 다시 시도해봐.');
      setLoading(false);
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>

      {/* ── 1. Background image — breathe animation ── */}
      <div style={{
        position: 'absolute', inset: 0,
        animation: 'bgBreathe 12s ease-in-out infinite',
        transformOrigin: 'center 60%',
      }}>
        <img
          src="/intro/intro_bg.jpg"
          alt=""
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 40%',
            filter: 'brightness(0.58) saturate(0.82)',
            display: 'block',
          }}
        />
      </div>

      {/* ── 2. Purple atmosphere overlay ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(160deg, rgba(48,8,90,0.52) 0%, rgba(22,4,55,0.38) 50%, rgba(10,2,35,0.58) 100%)',
      }} />

      {/* ── 3. Moon glow — upper-center matching image ── */}
      <div style={{
        position: 'absolute', top: '8%', left: '50%',
        transform: 'translateX(-50%)',
        width: 120, height: 120, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(240,220,255,0.28) 0%, rgba(180,120,255,0.14) 45%, transparent 70%)',
        animation: 'moonGlow 5s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 2,
      }} />

      {/* ── 4. Sparkles ── */}
      {SPARKLES.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', top: s.top, left: s.left,
          fontSize: s.sz, color: s.c,
          textShadow: '0 0 10px currentColor',
          animation: `sparkle ${2.1 + i * 0.13}s ease-in-out ${s.del}s infinite alternate`,
          pointerEvents: 'none', zIndex: 3,
        }}>✦</div>
      ))}

      {/* ── 5. Floating dust particles ── */}
      {DUST.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', top: p.top, left: p.left,
          width: 3, height: 3, borderRadius: '50%',
          background: p.c,
          boxShadow: `0 0 5px ${p.c}`,
          animation: `dustDrift ${p.dur}s ease-in-out ${p.del}s infinite`,
          pointerEvents: 'none', zIndex: 3,
        }} />
      ))}

      {/* ── 6. Title: TAROT JOURNEY ── */}
      <div style={{
        position: 'absolute',
        top: '16%',
        left: '50%', transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 10,
        width: '100%',
        pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 'clamp(38px, 9vw, 60px)',
          fontWeight: 700,
          color: '#ffffff',
          textShadow: '0 0 32px rgba(200,150,255,0.75), 0 0 64px rgba(140,60,220,0.4), 0 2px 14px rgba(0,0,0,0.95)',
          letterSpacing: '0.14em',
          lineHeight: 1.05,
        }}>
          TAROT
        </div>
        <div style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 'clamp(30px, 7vw, 48px)',
          fontWeight: 600,
          color: '#e8d4ff',
          textShadow: '0 0 26px rgba(200,160,255,0.55), 0 2px 12px rgba(0,0,0,0.95)',
          letterSpacing: '0.3em',
          marginTop: 2,
        }}>
          JOURNEY
        </div>
        <div style={{
          fontFamily: "'Press Start 2P'",
          fontSize: '9px',
          color: 'rgba(210, 185, 255, 0.65)',
          letterSpacing: '0.18em',
          marginTop: 18,
          textShadow: '0 0 8px rgba(180,140,255,0.45)',
        }}>
          당신의 이야기를 찾아서
        </div>
      </div>

      {/* ── 7. Login / Enter button ── */}
      <div style={{
        position: 'absolute',
        bottom: 52,
        left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        width: 'min(88%, 300px)',
        zIndex: 10,
      }}>
        {!authLoaded && (
          <div style={{
            fontFamily: "'Press Start 2P'", fontSize: '8px',
            color: 'rgba(197,163,245,0.55)', letterSpacing: 3,
            animation: 'sparkle 1.4s ease-in-out infinite alternate',
          }}>···</div>
        )}

        {authLoaded && !user && (
          <button
            className="pixel-btn gold"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{ fontSize: '11px', padding: '14px 24px', width: '100%' }}
          >
            {loading ? '입장 중...' : '✦ Google로 입장하기'}
          </button>
        )}

        {authLoaded && user && (
          <button
            className="pixel-btn gold"
            onClick={handleEnter}
            disabled={loading}
            style={{ fontSize: '11px', padding: '14px 24px', width: '100%' }}
          >
            {loading ? '입장 중...' : '✦ 들어가기'}
          </button>
        )}

        {error && (
          <div style={{
            fontFamily: "'Press Start 2P'", fontSize: '8px',
            color: '#c08080', textAlign: 'center', lineHeight: 1.8,
          }}>{error}</div>
        )}
      </div>

      {/* ── 8. Vignette ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 42%, transparent 28%, rgba(0,0,0,0.78) 100%)',
        zIndex: 4,
      }} />

      <style>{`
        @keyframes bgBreathe {
          0%, 100% { transform: scale(1.00); }
          50%       { transform: scale(1.04); }
        }
        @keyframes moonGlow {
          0%, 100% { opacity: 0.6; transform: translateX(-50%) scale(1.0); }
          50%       { opacity: 1.0; transform: translateX(-50%) scale(1.2); }
        }
        @keyframes sparkle {
          from { opacity: 0.15; transform: scale(0.75); }
          to   { opacity: 1.00; transform: scale(1.25); }
        }
        @keyframes dustDrift {
          0%   { transform: translateY(0px)   translateX(0px);  opacity: 0; }
          15%  { opacity: 0.75; }
          85%  { opacity: 0.45; }
          100% { transform: translateY(-22px) translateX(7px);  opacity: 0; }
        }
      `}</style>
    </div>
  );
}
