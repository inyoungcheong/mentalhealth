import React, { useEffect, useState, useRef } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import PixelVillage from '../components/pixels/PixelVillage';
import { ChildSprite } from '../components/pixels/PixelChild';
import { WitchSprite } from '../components/pixels/PixelWitch';
import ChatBubble from '../components/ChatBubble';

const isInAppBrowser = /kakaotalk|instagram|fban|fbav|line\/|micromessenger/i.test(
  typeof navigator !== 'undefined' ? navigator.userAgent : ''
);
const isAndroid = /android/i.test(typeof navigator !== 'undefined' ? navigator.userAgent : '');

const WITCH_LINES = [
  '어, 이 마을엔 처음 오는 얼굴이네.',
  '나는 아이라야. 타로를 읽는 마녀지.',
  '지금 네 눈빛이... 뭔가 복잡해 보이는데.',
  '지금 가장 마음에 걸리는 게 뭐야?',
];

const RETURNING_WITCH_LINES = [
  '돌아왔군.',
  '이번엔 어떤 질문을 들고 왔어?',
];

export default function Scene2Village({ currentUser, onNext }) {
  const [childX, setChildX] = useState(-60);
  // phases: walking | gate | witch-appear | chat | question | done
  const [phase, setPhase] = useState('walking');
  const [lineIdx, setLineIdx] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [question, setQuestion] = useState('');
  const [inputError, setInputError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [urlCopied, setUrlCopied] = useState(false);
  const [loggedUser, setLoggedUser] = useState(currentUser || null);
  const inputRef = useRef(null);

  const isReturning = !!loggedUser;
  const witchLines = isReturning ? RETURNING_WITCH_LINES : WITCH_LINES;

  // Walk child in → gate or skip to witch if already logged in
  useEffect(() => {
    const t1 = setTimeout(() => setChildX(120), 100);
    const t2 = setTimeout(() => {
      // auth.currentUser is synchronous and always reflects the true current state
      const authedUser = auth.currentUser;
      if (authedUser) {
        setLoggedUser(authedUser);
        setPhase('witch-appear');
      } else {
        setPhase('gate');
      }
    }, 2800);
    return () => [t1, t2].forEach(clearTimeout);
  }, []);

  // After witch appears, start chat
  useEffect(() => {
    if (phase === 'witch-appear') {
      const t = setTimeout(() => setPhase('chat'), 1000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  async function handleGoogleLogin() {
    setLoginLoading(true);
    setLoginError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setLoggedUser(result.user);
      setPhase('witch-appear');
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
      window.location.href =
        `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;` +
        `package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url)};end`;
    } else {
      navigator.clipboard?.writeText(url).catch(() => {});
      setUrlCopied(true);
    }
  }

  function handleBubbleDone() {
    if (lineIdx < witchLines.length - 1) {
      setTimeout(() => setLineIdx(l => l + 1), 600);
    } else {
      setTimeout(() => setShowInput(true), 500);
      if (inputRef.current) inputRef.current.focus();
    }
  }

  function handleSubmit() {
    if (question.trim().length < 2) {
      setInputError('2자 이상 입력해줘!');
      return;
    }
    setInputError('');
    setShowInput(false);
    setPhase('done');
    setTimeout(() => onNext?.(question.trim(), loggedUser), 800);
  }

  const isWalking = phase === 'walking';
  const font = "'Press Start 2P', monospace";

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <PixelVillage>

        {/* Child character */}
        <div style={{
          position: 'absolute',
          bottom: 28,
          left: childX,
          transform: 'scale(2)',
          transformOrigin: 'bottom left',
          imageRendering: 'pixelated',
          transition: isWalking ? 'left 2.5s linear' : 'none',
        }}>
          <ChildSprite walking={isWalking} />
        </div>

        {/* Witch character */}
        {phase !== 'walking' && phase !== 'gate' && (
          <div style={{
            position: 'absolute',
            bottom: 26,
            right: 80,
            transform: 'scale(2) scaleX(-1)',
            transformOrigin: 'bottom right',
            imageRendering: 'pixelated',
            opacity: phase === 'witch-appear' ? 0 : 1,
            transition: 'opacity 0.5s ease',
            animation: 'idle-bob 1.4s ease-in-out infinite',
          }}>
            <WitchSprite />
          </div>
        )}

        {/* Gate — login overlay */}
        {phase === 'gate' && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(0deg, rgba(8,0,18,0.92) 0%, rgba(8,0,18,0.5) 55%, transparent 100%)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'flex-end',
            padding: '0 20px 44px',
            animation: 'fadeInUp 0.9s ease forwards',
          }}>
            <div style={{ textAlign: 'center', fontFamily: font, maxWidth: 360 }}>
              <div style={{ fontSize: '22px', color: '#ffd700', marginBottom: 10, letterSpacing: 10 }}>✦ ✦ ✦</div>
              <div style={{ fontSize: 'var(--px-md)', color: '#f0e6ff', lineHeight: 1.8, marginBottom: 6, letterSpacing: 2 }}>
                Arcana Valley
              </div>
              <div style={{ fontSize: 'var(--px-sm)', color: '#9b7fc4', lineHeight: 2.2, marginBottom: 26 }}>
                아이라의 마을에 들어가려면<br />로그인이 필요해
              </div>

              {isInAppBrowser ? (
                <>
                  <div style={{ fontSize: 'var(--px-xs)', color: '#ff9f43', lineHeight: 2, marginBottom: 10 }}>
                    ⚠ 카카오톡 브라우저에서는<br />구글 로그인이 지원되지 않아
                  </div>
                  <div style={{ fontSize: 'var(--px-xs)', color: '#c5a3f5', lineHeight: 2, marginBottom: 12 }}>
                    {isAndroid ? 'Chrome으로 열기 버튼을 눌러줘' : '주소를 복사한 뒤 Safari에서 열어줘'}
                  </div>
                  <button
                    className="pixel-btn gold"
                    onClick={handleOpenExternal}
                    style={{ fontSize: 'var(--px-sm)' }}
                  >
                    {isAndroid ? '🌐 Chrome으로 열기' : urlCopied ? '✓ 주소 복사됨!' : '📋 주소 복사하기'}
                  </button>
                  {!isAndroid && urlCopied && (
                    <div style={{ fontSize: 'var(--px-xs)', color: '#c5a3f5', marginTop: 8 }}>
                      Safari 주소창에 붙여넣기 후 이동해줘
                    </div>
                  )}
                </>
              ) : (
                <>
                  <button
                    className="pixel-btn gold"
                    onClick={handleGoogleLogin}
                    disabled={loginLoading}
                    style={{ fontSize: 'var(--px-sm)', minWidth: 200 }}
                  >
                    {loginLoading ? '로그인 중...' : '🔑 Google로 입장하기'}
                  </button>
                  {loginError && (
                    <div style={{ fontSize: 'var(--px-xs)', color: '#ff6b6b', marginTop: 10 }}>
                      {loginError}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Chat bubble (witch) */}
        {phase === 'chat' && lineIdx < witchLines.length && (
          <div style={{
            position: 'absolute',
            bottom: 160,
            right: 40,
            maxWidth: '60%',
          }}>
            <ChatBubble
              key={lineIdx}
              text={witchLines[lineIdx]}
              speaker="witch"
              onDone={handleBubbleDone}
            />
          </div>
        )}

        {/* Question input */}
        {showInput && (
          <div style={{
            position: 'absolute',
            bottom: 40,
            left: '50%', transform: 'translateX(-50%)',
            width: 'min(90%, 600px)',
            background: 'rgba(255,255,255,0.97)',
            border: '2px solid #6b2d8b',
            padding: '16px 18px',
            boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
          }}>
            <div style={{
              fontFamily: font, fontSize: 'var(--px-md)', color: '#2d1a4e', marginBottom: 10, lineHeight: 1.8,
            }}>
              지금 가장 마음에 걸리는 게 뭐야? (100자 이내)
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <textarea
                ref={inputRef}
                className="pixel-input"
                maxLength={100}
                value={question}
                onChange={e => { setQuestion(e.target.value); setInputError(''); }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
                }}
                placeholder="여기에 입력... (Shift+Enter로 줄바꿈)"
                autoFocus
                rows={3}
                style={{ flex: 1, fontSize: 'var(--px-md)', resize: 'none', lineHeight: 1.8 }}
              />
              <button
                className="pixel-btn"
                onClick={handleSubmit}
                style={{ fontSize: 'var(--px-md)', padding: '8px 14px', alignSelf: 'flex-end' }}
              >
                ▶
              </button>
            </div>
            {inputError && (
              <div style={{ fontFamily: font, fontSize: 'var(--px-sm)', color: '#c84040', marginTop: 6 }}>
                {inputError}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 6 }}>
              <div style={{ fontFamily: font, fontSize: 'var(--px-xs)', color: '#aaa', lineHeight: 1.9 }}>
                예: "이 선택을 해도 될까?" "지금 이 관계는 어떻게 되는 거야?"
              </div>
              <div style={{ fontFamily: font, fontSize: 'var(--px-sm)', color: '#aaa', flexShrink: 0, marginLeft: 8 }}>
                {question.length}/100
              </div>
            </div>
          </div>
        )}

      </PixelVillage>

      <style>{`
        @keyframes idle-bob {
          0%, 100% { transform: scale(2) scaleX(-1) translateY(0px); }
          50% { transform: scale(2) scaleX(-1) translateY(-4px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
