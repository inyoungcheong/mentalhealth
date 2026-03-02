import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { initUserLua } from '../services/luaService';
import PixelVillage from '../components/pixels/PixelVillage';

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
      <PixelVillage>

        {/* ARCANA VALLEY title */}
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
            fontSize: 'clamp(36px, 8.5vw, 56px)',
            fontWeight: 700,
            color: '#ffffff',
            textShadow: '0 0 24px rgba(255,255,255,0.4), 0 2px 12px rgba(0,0,0,0.8)',
            letterSpacing: '0.12em',
            lineHeight: 1.1,
          }}>
            ARCANA
          </div>
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(28px, 6.5vw, 44px)',
            fontWeight: 600,
            color: '#f0e8ff',
            textShadow: '0 0 20px rgba(240,232,255,0.35), 0 2px 10px rgba(0,0,0,0.8)',
            letterSpacing: '0.2em',
            marginTop: 4,
          }}>
            VALLEY
          </div>
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '14px',
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.85)',
            letterSpacing: '0.2em',
            marginTop: 16,
            textShadow: '0 1px 6px rgba(0,0,0,0.9)',
          }}>
            당신의 이야기를 찾아서
          </div>
        </div>

        {/* Decorative stars */}
        {[
          { top: '11%', left: '14%', size: 14, delay: 0 },
          { top: '8%',  left: '78%', size: 10, delay: 0.6 },
          { top: '20%', left: '58%', size: 8,  delay: 1.1 },
          { top: '14%', left: '34%', size: 11, delay: 0.3 },
          { top: '22%', left: '82%', size: 9,  delay: 0.9 },
          { top: '6%',  left: '50%', size: 7,  delay: 1.5 },
        ].map((s, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: s.top, left: s.left,
            fontSize: s.size,
            color: i % 2 === 0 ? '#ffd700' : '#c5a3f5',
            opacity: 0.75,
            textShadow: '0 0 8px currentColor',
            animation: `star-twinkle 2.2s ease-in-out ${s.delay}s infinite alternate`,
            pointerEvents: 'none',
            zIndex: 10,
          }}>✦</div>
        ))}

        {/* Login / Enter button area */}
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
              animation: 'star-twinkle 1.4s ease-in-out infinite alternate',
            }}>
              ···
            </div>
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
            }}>
              {error}
            </div>
          )}
        </div>
      </PixelVillage>

      <style>{`
        @keyframes star-twinkle {
          from { opacity: 0.3; transform: scale(0.85); }
          to   { opacity: 1;   transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
