import React, { useState, useEffect } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import ChatBubble from '../components/ChatBubble';
import { WitchSprite } from '../components/pixels/PixelWitch';

// Detect in-app browsers that block Google OAuth
const isInAppBrowser = /kakaotalk|instagram|fban|fbav|line\/|micromessenger/i.test(
  typeof navigator !== 'undefined' ? navigator.userAgent : ''
);
const isAndroid = /android/i.test(typeof navigator !== 'undefined' ? navigator.userAgent : '');

export default function Scene4Analysis({ onNext }) {
  const lines = [
    '질문이 전해졌어.',
    '카드를 펼치기 전에 먼저 로그인해줘.',
    '여정을 기록해둘게.',
  ];

  const [lineIdx, setLineIdx] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [urlCopied, setUrlCopied] = useState(false);

  function handleBubbleDone() {
    if (lineIdx < lines.length - 1) {
      setTimeout(() => setLineIdx(l => l + 1), 700);
    } else {
      setTimeout(() => setShowLogin(true), 500);
    }
  }

  async function handleGoogleLogin() {
    setLoginLoading(true);
    setLoginError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onNext?.(result.user);
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setLoginError('로그인 실패. 다시 시도해줘.');
      }
      setLoginLoading(false);
    }
  }

  function handleOpenExternal() {
    const url = window.location.href;
    if (isAndroid) {
      // Android: try to open in Chrome via intent scheme
      window.location.href =
        `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;` +
        `package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url)};end`;
    } else {
      // iOS / other: copy URL and show instruction
      navigator.clipboard?.writeText(url).catch(() => {});
      setUrlCopied(true);
    }
  }

  return (
    <div style={{
      width: '100%', minHeight: '100%',
      background: 'linear-gradient(180deg, #0d0020 0%, #1a0a2e 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 20, padding: '40px 20px',
      boxSizing: 'border-box',
    }}>
      {/* Witch */}
      <div style={{
        transform: 'scale(2.5)', transformOrigin: 'bottom center',
        imageRendering: 'pixelated',
        animation: 'idle-bob 1.4s ease-in-out infinite',
        marginBottom: 20,
      }}>
        <WitchSprite />
      </div>

      {/* Chat */}
      <ChatBubble
        key={lineIdx}
        text={lines[lineIdx]}
        speaker="witch"
        onDone={handleBubbleDone}
        style={{ maxWidth: 340, textAlign: 'left' }}
      />

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 8 }}>
        {lines.map((_, i) => (
          <div key={i} style={{
            width: 8, height: 8,
            background: i <= lineIdx ? '#ffd700' : 'rgba(255,215,0,0.2)',
            border: '1px solid #ffd700',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      {/* Login section */}
      {showLogin && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          background: 'rgba(107,45,139,0.2)',
          border: '2px solid #6b2d8b',
          padding: '16px 20px',
          animation: 'appear-pop 0.5s ease forwards',
          maxWidth: 320,
        }}>
          {isInAppBrowser ? (
            /* KakaoTalk / in-app browser: Google OAuth blocked */
            <>
              <div style={{
                fontFamily: "'Press Start 2P'", fontSize: 'var(--px-xs)', color: '#ff9f43',
                textAlign: 'center', lineHeight: 2,
              }}>
                ⚠ 카카오톡 브라우저에서는<br />구글 로그인이 지원되지 않아
              </div>
              <div style={{
                fontFamily: "'Press Start 2P'", fontSize: 'var(--px-xs)', color: '#c5a3f5',
                textAlign: 'center', lineHeight: 2,
              }}>
                {isAndroid
                  ? 'Chrome으로 열기 버튼을 눌러줘'
                  : "주소를 복사한 뒤 Safari에서 열어줘"}
              </div>
              <button
                className="pixel-btn gold"
                onClick={handleOpenExternal}
                style={{ fontSize: 'var(--px-sm)' }}
              >
                {isAndroid
                  ? '🌐 Chrome으로 열기'
                  : urlCopied ? '✓ 주소 복사됨!' : '📋 주소 복사하기'}
              </button>
              {!isAndroid && urlCopied && (
                <div style={{ fontFamily: "'Press Start 2P'", fontSize: 'var(--px-xs)', color: '#c5a3f5', textAlign: 'center', lineHeight: 2 }}>
                  Safari 주소창에 붙여넣기 후 이동해줘
                </div>
              )}
            </>
          ) : (
            /* Normal login */
            <>
              <div style={{
                fontFamily: "'Press Start 2P'", fontSize: 'var(--px-xs)', color: '#c5a3f5',
                textAlign: 'center', lineHeight: 1.8,
              }}>
                여정을 기록하려면<br />로그인이 필요해
              </div>
              <button
                className="pixel-btn gold"
                onClick={handleGoogleLogin}
                disabled={loginLoading}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                {loginLoading ? <span>로그인 중...</span> : <span>🔑 Google로 계속하기</span>}
              </button>
              {loginError && (
                <div style={{ fontFamily: "'Press Start 2P'", fontSize: 'var(--px-xs)', color: '#ff6b6b' }}>
                  {loginError}
                </div>
              )}
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes idle-bob {
          0%, 100% { transform: scale(2.5) translateY(0); }
          50% { transform: scale(2.5) translateY(-4px); }
        }
        @keyframes appear-pop {
          0% { transform: scale(0.8) translateY(10px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
