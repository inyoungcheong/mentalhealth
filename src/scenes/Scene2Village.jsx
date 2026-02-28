import React, { useEffect, useState, useRef } from 'react';
import PixelVillage from '../components/pixels/PixelVillage';
import { ChildSprite } from '../components/pixels/PixelChild';
import { WitchSprite } from '../components/pixels/PixelWitch';
import ChatBubble from '../components/ChatBubble';

const WITCH_LINES = [
  '어, 이 마을엔 처음 오는 얼굴이네.',
  '나는 루나야. 타로를 읽는 마녀지.',
  '지금 네 눈빛이... 뭔가 복잡해 보이는데.',
  '지금 가장 마음에 걸리는 게 뭐야?',
];

export default function Scene2Village({ onNext }) {
  const [childX, setChildX] = useState(-60);
  const [phase, setPhase] = useState('walking'); // walking | witch-appear | chat | question | done
  const [lineIdx, setLineIdx] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [question, setQuestion] = useState('');
  const [inputError, setInputError] = useState('');
  const inputRef = useRef(null);

  // Walk child in
  useEffect(() => {
    const t1 = setTimeout(() => setChildX(120), 100);
    const t2 = setTimeout(() => {
      setPhase('witch-appear');
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

  function handleBubbleDone() {
    if (lineIdx < WITCH_LINES.length - 1) {
      setTimeout(() => setLineIdx(l => l + 1), 600);
    } else {
      // Last line - show input
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
    setTimeout(() => onNext?.(question.trim()), 800);
  }

  const isWalking = phase === 'walking';

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
        {phase !== 'walking' && (
          <div style={{
            position: 'absolute',
            bottom: 26,
            right: 80,
            transform: 'scale(2) scaleX(-1)',
            transformOrigin: 'bottom right',
            imageRendering: 'pixelated',
            opacity: phase === 'witch-appear' ? 0 : 1,
            transition: 'opacity 0.5s ease, transform 0.5s ease',
            animation: 'idle-bob 1.4s ease-in-out infinite',
          }}>
            <WitchSprite />
          </div>
        )}

        {/* Chat bubble (witch) */}
        {phase === 'chat' && lineIdx < WITCH_LINES.length && (
          <div style={{
            position: 'absolute',
            bottom: 160,
            right: 40,
            maxWidth: '60%',
          }}>
            <ChatBubble
              key={lineIdx}
              text={WITCH_LINES[lineIdx]}
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
              fontFamily: "'Press Start 2P'", fontSize: '12px', color: '#2d1a4e', marginBottom: 10, lineHeight: 1.8,
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
                style={{
                  flex: 1,
                  fontSize: '12px',
                  resize: 'none',
                  lineHeight: 1.8,
                }}
              />
              <button
                className="pixel-btn"
                onClick={handleSubmit}
                style={{ fontSize: '12px', padding: '8px 14px', alignSelf: 'flex-end' }}
              >
                ▶
              </button>
            </div>
            {inputError && (
              <div style={{ fontFamily: "'Press Start 2P'", fontSize: '10px', color: '#c84040', marginTop: 6 }}>
                {inputError}
              </div>
            )}
            <div style={{ fontFamily: "'Press Start 2P'", fontSize: '10px', color: '#aaa', marginTop: 6, textAlign: 'right' }}>
              {question.length}/100
            </div>
          </div>
        )}
      </PixelVillage>

      <style>{`
        @keyframes idle-bob {
          0%, 100% { transform: scale(2) scaleX(-1) translateY(0px); }
          50% { transform: scale(2) scaleX(-1) translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
