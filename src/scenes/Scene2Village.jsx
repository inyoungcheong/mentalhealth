import React, { useEffect, useState, useRef, useMemo } from 'react';
import PixelVillage from '../components/pixels/PixelVillage';
import { ChildSprite } from '../components/pixels/PixelChild';
import { WitchSprite } from '../components/pixels/PixelWitch';
import ChatBubble from '../components/ChatBubble';

// ── 신규 방문자 메시지 (2개 중 랜덤) ──────────────────────────────────────
const FIRST_VISIT_MESSAGES = [
  {
    greeting: '어머, 처음 보는 기운이네.',
    body: '여기까지 찾아온 건 우연이 아니야. 별이 너를 이쪽으로 이끈 거지.',
    gift: '첫 방문 선물로 루나 3개를 줄게. 이걸로 더 깊은 이야기를 들을 수 있어.',
    cta: '자, 무엇이 궁금해서 왔어?',
  },
  {
    greeting: '…느껴져. 처음 오는 사람 특유의 기운.',
    body: '긴장하지 마. 나는 아이라, 이 골짜기의 리더야. 카드가 너한테 할 말이 있나 봐 — 여기까지 끌려온 거잖아.',
    gift: '환영의 의미로 루나 3개. 나중에 쓸 데가 있을 거야.',
    cta: '그래서, 뭐가 알고 싶어?',
  },
];

// ── 재방문자 메시지 풀 ──────────────────────────────────────────────────────
const RETURN_REGULAR = [
  '또 왔네. …좋아, 기다리고 있었어.',
  '왔구나. 오늘은 카드가 좀 술렁이더라 — 네 기운을 느낀 모양이야.',
  '어, 반가워. 지난번 리딩 이후로 뭔가 달라진 거 있어?',
  '벌써 또? …농담이야. 자주 올수록 카드가 더 솔직해져.',
  '이 정도면 단골이라고 불러도 되겠는데?',
  '또 온 거 보니까 지난번에 내가 한 말이 맞긴 했나 보네.',
  '…아, 네 기운이 달라졌어. 무슨 일이 있었지?',
  '별이 네 이름을 다시 불러줬어. 오늘은 어떤 이야기가 펼쳐질까.',
  '카드를 섞고 있었는데, 네가 올 거라는 느낌이 들더라.',
  '잘 왔어. 여기는 언제든 네 자리가 있으니까.',
  '돌아왔구나. 오늘은 좋은 카드가 나올 것 같은 예감이야.',
  '보고 싶었어. …카드가 그랬다는 뜻이야.',
];

const RETURN_LONG_ABSENCE = [
  '오랜만이야. 그동안 잘 지냈어? 카드가 네 빈자리를 느끼고 있었어.',
  '어머, 살아있었구나. …농담이야. 다시 와줘서 고마워.',
];

const RETURN_NIGHT = [
  '이 시간에 왔다는 건… 잠이 안 오거나, 마음에 뭔가가 걸려있거나. 맞지?',
  '밤에 뽑는 카드가 더 솔직한 법이야. 좋은 타이밍에 왔어.',
];

function pickFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── 질문 프롬프트 (랜덤 선택) ─────────────────────────────────────────────────
const QUESTION_PROMPTS = [
  '지금 가장 마음에 걸리는 게 뭐야?',
  '만약 카드가 뭐든 대답해줄 수 있다면 — 뭘 물을래?',
  '지금 네 마음을 가장 무겁게 하는 질문이 뭐야?',
  '뭐가 알고 싶어? 카드는 준비됐어.',
  '요즘 가장 생각이 많은 게 뭐야?',
  '지금 결정하지 못하고 있는 게 있어?',
];

// ── 예시 질문 (클릭 시 입력란 채우기) ──────────────────────────────────────────
const EXAMPLE_QUESTIONS = [
  '그 사람 마음을 도대체 모르겠어. 우리 잘될 수 있을까?',
  '나 이번에 명예퇴직 대상자는 아니겠지?',
  '이 일 계속해야 할지 그만둬야 할지 모르겠어.',
];

function buildChatLines(isNew, lastVisitAt) {
  if (isNew) {
    const msg = pickFrom(FIRST_VISIT_MESSAGES);
    return [msg.greeting, msg.body, msg.gift, msg.cta];
  }

  const hour = new Date().getHours();
  const daysSince = lastVisitAt
    ? Math.floor((Date.now() - new Date(lastVisitAt)) / (1000 * 60 * 60 * 24))
    : 0;

  let greeting;
  if (hour >= 22 || hour < 5) {
    greeting = pickFrom(RETURN_NIGHT);
  } else if (daysSince >= 7) {
    greeting = pickFrom(RETURN_LONG_ABSENCE);
  } else {
    greeting = pickFrom(RETURN_REGULAR);
  }

  return [greeting, '오늘은 무엇이 궁금해서 왔어?'];
}

// phases: walking | witch-appear | chat | done
export default function Scene2Village({ isNew, lastVisitAt, onNext }) {
  const [childX, setChildX] = useState(-60);
  const [phase, setPhase] = useState('walking');
  const [chatLines, setChatLines] = useState([]);
  const [lineIdx, setLineIdx] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [question, setQuestion] = useState('');
  const [inputError, setInputError] = useState('');
  const inputRef = useRef(null);
  const questionPrompt = useMemo(() => pickFrom(QUESTION_PROMPTS), []);

  // Walk child in
  useEffect(() => {
    const t1 = setTimeout(() => setChildX(120), 100);
    const t2 = setTimeout(() => setPhase('witch-appear'), 2800);
    return () => [t1, t2].forEach(clearTimeout);
  }, []);

  // After witch appears, build chat lines and start
  useEffect(() => {
    if (phase === 'witch-appear') {
      const t = setTimeout(() => {
        setChatLines(buildChatLines(isNew, lastVisitAt));
        setLineIdx(0);
        setPhase('chat');
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [phase, isNew, lastVisitAt]);

  function handleBubbleDone() {
    if (lineIdx < chatLines.length - 1) {
      setTimeout(() => setLineIdx(l => l + 1), 600);
    } else {
      setTimeout(() => setShowInput(true), 400);
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
          transformOrigin: 'bottom center',
          imageRendering: 'pixelated',
          transition: isWalking ? 'left 2.5s linear' : 'none',
        }}>
          <ChildSprite walking={isWalking} showBack={phase === 'chat' || phase === 'witch-appear'} />
        </div>

        {/* Witch character */}
        {phase !== 'walking' && (
          <div style={{
            position: 'absolute',
            bottom: 28,
            right: 100,
            transform: 'scale(2)',
            transformOrigin: 'bottom right',
            imageRendering: 'pixelated',
            opacity: phase === 'witch-appear' ? 0 : 1,
            transition: 'opacity 0.5s ease',
            animation: 'idle-bob 1.4s ease-in-out infinite',
          }}>
            <WitchSprite />
          </div>
        )}

        {/* Chat bubble */}
        {phase === 'chat' && lineIdx < chatLines.length && (
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            height: '40vh',
            background: 'rgba(255,255,255,0.98)',
            borderTop: '4px solid #6b2d8b',
            padding: '24px 32px',
            boxShadow: '0 -8px 24px rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{
              fontFamily: "'Press Start 2P'", fontSize: '12px',
              color: '#6b2d8b', marginBottom: 12, fontWeight: 'bold'
            }}>아이라</div>
            <ChatBubble
              key={lineIdx}
              text={chatLines[lineIdx]}
              speaker="witch"
              onDone={handleBubbleDone}
              style={{ border: 'none', background: 'transparent', padding: 0, boxShadow: 'none' }}
            />
          </div>
        )}

        {/* Question input */}
        {showInput && (
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            background: 'rgba(255,255,255,0.98)',
            border: '3px solid #6b2d8b',
            borderBottom: 'none',
            padding: '20px 24px',
            boxShadow: '0 -4px 12px rgba(0,0,0,0.4)',
            maxHeight: '50vh',
            overflowY: 'auto',
            zIndex: 1000,
          }}>
            <div style={{
              fontFamily: "'Press Start 2P'", fontSize: '11px',
              color: '#2d1a4e', marginBottom: 10, lineHeight: 1.8,
            }}>
              {questionPrompt} <span style={{ color: '#999', fontSize: '9px' }}>(100자 이내)</span>
            </div>
            {/* 예시 질문 chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
              {EXAMPLE_QUESTIONS.map((eq, i) => (
                <button
                  key={i}
                  onClick={() => { setQuestion(eq); setInputError(''); inputRef.current?.focus(); }}
                  style={{
                    fontFamily: "'Press Start 2P'", fontSize: '7px',
                    background: question === eq ? 'rgba(107,45,139,0.15)' : 'rgba(107,45,139,0.06)',
                    border: `1px solid ${question === eq ? '#6b2d8b' : '#c8aae0'}`,
                    color: '#4a2d6b', padding: '4px 8px',
                    cursor: 'pointer', lineHeight: 1.7, textAlign: 'left',
                  }}
                >
                  {eq}
                </button>
              ))}
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
                style={{ flex: 1, fontSize: '15px', resize: 'none', lineHeight: 1.8 }}
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
              <div style={{
                fontFamily: "'Press Start 2P'", fontSize: '10px',
                color: '#c84040', marginTop: 6,
              }}>
                {inputError}
              </div>
            )}
            <div style={{
              fontFamily: "'Press Start 2P'", fontSize: '10px',
              color: '#aaa', marginTop: 6, textAlign: 'right',
            }}>
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
