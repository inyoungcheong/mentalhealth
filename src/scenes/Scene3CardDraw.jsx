import React, { useState, useCallback } from 'react';
import TarotCard from '../components/TarotCard';
import ChatBubble from '../components/ChatBubble';
import OracleTable, { CardDeckStack } from '../components/OracleTable';
import CoinToss from '../components/CoinToss';
import { drawRandomCard } from '../data/tarotCards';
import { oracleReading } from '../services/geminiService';
import { playCardDraw } from '../utils/sound';

// phases: table → (user draws card + rolls coins) → loading → card-reveal → verdict → answer → hook → done

export default function Scene3CardDraw({ question, onNext }) {
  const [phase, setPhase] = useState('table');
  const [card, setCard] = useState(null);
  const [hexagram, setHexagram] = useState(null);
  const [hexLines, setHexLines] = useState([]);
  const [cardDrawn, setCardDrawn] = useState(false);
  const [hexagramDone, setHexagramDone] = useState(false);
  const [verdict, setVerdict] = useState('');
  const [verdictText, setVerdictText] = useState('');
  const [answer, setAnswer] = useState('');
  const [coreIssue, setCoreIssue] = useState('');
  const [deeperHook, setDeeperHook] = useState('');
  const [answerDone, setAnswerDone] = useState(false);
  const [hookDone, setHookDone] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);

  const handleDrawCard = useCallback(() => {
    if (cardDrawn) return;
    playCardDraw();
    const drawn = drawRandomCard();
    setCard(drawn);
    setCardDrawn(true);
  }, [cardDrawn]);

  const handleHexagramComplete = useCallback((result) => {
    setHexagram(result.hexagram);
    setHexLines(result.lines);
    setHexagramDone(true);
  }, []);

  // When both ready, run API
  React.useEffect(() => {
    if (!cardDrawn || !hexagramDone || !card || !hexagram) return;
    setPhase('loading');

    (async () => {
      const [result] = await Promise.all([
        oracleReading({ card, hexagram, question }).catch((_err) => {
          setApiFailed(true);
          return {
            verdict: '흉',
            verdictText: '알 수 없어',
            answer: `${card.korName}이 지금 이 상황의 에너지를 보여주고 있어.`,
            coreIssue: '이 질문 뒤에 더 깊은 무언가가 있어.',
            deeperHook: '이 질문 뒤에는 더 큰 이야기가 있어. 나와 함께 들여다볼래?',
          };
        }),
        new Promise(r => setTimeout(r, 1800)),
      ]);

      setVerdict(result.verdict);
      setVerdictText(result.verdictText);
      setAnswer(result.answer);
      setCoreIssue(result.coreIssue);
      setDeeperHook(result.deeperHook);
      setPhase('card-reveal');
      setTimeout(() => setPhase('verdict'), 1000);
    })();
  }, [cardDrawn, hexagramDone, card, hexagram, question]);

  function handleProceed() {
    onNext?.({ card, hexagram, verdict, answer, coreIssue, deeperHook });
  }

  const isGil = verdict === '길';

  return (
    <div style={{
      width: '100%', minHeight: '100%',
      background: 'linear-gradient(180deg, #0d0612 0%, #150a1a 40%, #1a0d20 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      padding: '20px 16px 40px',
      gap: 20,
      overflowY: 'auto',
      boxSizing: 'border-box',
    }}>

      {/* Subtle stars */}
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${(i * 47 + 3) % 90}%`,
          left: `${(i * 59 + 5) % 98}%`,
          width: 2, height: 2, background: '#c5a3f5',
          opacity: 0.15 + (i % 3) * 0.08,
          animation: `sparkle ${2.5 + (i % 2) * 0.5}s infinite ${(i * 0.3)}s`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <div style={{ fontSize: 'var(--px-sm)', color: 'rgba(197,163,245,0.5)', fontFamily: "'Press Start 2P'", letterSpacing: 3, marginBottom: 4 }}>
          ✦ 오늘의 점괘 ✦
        </div>
        <div style={{ fontSize: 'var(--px-md)', color: 'rgba(180,140,220,0.85)', fontFamily: "'Press Start 2P'", lineHeight: 1.8 }}>
          "{question}"
        </div>
      </div>

      {/* TABLE PHASE: User draws card + rolls coins */}
      {phase === 'table' && (
        <OracleTable>
          {/* Instruction */}
          <div style={{
            fontFamily: "'Press Start 2P'",
            fontSize: 'var(--px-xs)',
            color: '#c5a3f5',
            textAlign: 'center',
            marginBottom: 16,
            letterSpacing: 1,
          }}>
            카드를 뽑고 동전을 6번 던져주세요
          </div>

          {/* Two-column grid — equal width */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1px 1fr',
            gap: '0 16px',
            alignItems: 'start',
            width: '100%',
          }}>
            {/* Left: Card deck */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{
                fontFamily: "'Press Start 2P'", fontSize: 'var(--px-xs)',
                color: '#e8c040', letterSpacing: 2,
                borderBottom: '1px solid rgba(232,192,64,0.3)',
                paddingBottom: 4, width: '100%', textAlign: 'center',
              }}>
                타로
              </div>
              {!cardDrawn ? (
                <CardDeckStack onClick={handleDrawCard} disabled={false} />
              ) : (
                <div style={{ animation: 'cardSlideFromDeck 0.6s cubic-bezier(0.34,1.2,0.64,1) forwards' }}>
                  <TarotCard card={card} faceDown={false} size="md" glowing />
                </div>
              )}
              {cardDrawn && (
                <div style={{
                  fontFamily: "'Press Start 2P'", fontSize: 'var(--px-xs)',
                  color: '#e8c040', textAlign: 'center', lineHeight: 1.8,
                }}>
                  {card.korName}
                  {card.isReversed && (
                    <div style={{ fontSize: 'var(--px-2xs)', color: '#c08080', marginTop: 2 }}>역방향</div>
                  )}
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ background: 'rgba(107,45,139,0.4)', alignSelf: 'stretch' }} />

            {/* Right: Coins */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{
                fontFamily: "'Press Start 2P'", fontSize: 'var(--px-xs)',
                color: '#e8c040', letterSpacing: 2,
                borderBottom: '1px solid rgba(232,192,64,0.3)',
                paddingBottom: 4, width: '100%', textAlign: 'center',
              }}>
                주역
              </div>
              <CoinToss
                onComplete={handleHexagramComplete}
                disabled={hexagramDone}
              />
            </div>
          </div>

          {/* Done indicators */}
          <div style={{
            display: 'flex', justifyContent: 'space-around',
            marginTop: 14,
            fontFamily: "'Press Start 2P'", fontSize: 'var(--px-xs)',
          }}>
            <span style={{ color: cardDrawn ? '#5a9e3a' : 'rgba(255,255,255,0.2)' }}>
              {cardDrawn ? '✓ 카드 완료' : '○ 카드 대기'}
            </span>
            <span style={{ color: hexagramDone ? '#5a9e3a' : 'rgba(255,255,255,0.2)' }}>
              {hexagramDone ? '✓ 주역 완료' : '○ 주역 대기'}
            </span>
          </div>
        </OracleTable>
      )}

      {/* LOADING phase (brief, after both ready) */}
      {phase === 'loading' && (
        <OracleTable>
          <OracleLoadingPhase card={card} />
        </OracleTable>
      )}

      {/* CARD-REVEAL + VERDICT + READING */}
      {phase !== 'table' && phase !== 'loading' && card && hexagram && (
        <>
          <div style={{
            display: 'flex', gap: 28, alignItems: 'flex-start',
            justifyContent: 'center', flexWrap: 'wrap',
            width: '100%', maxWidth: 560,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ animation: phase === 'card-reveal' ? 'cardRevealFlip 0.6s ease forwards' : 'none' }}>
                <TarotCard card={card} faceDown={false} size="lg" glowing />
              </div>
              <div style={{ fontFamily: "'Press Start 2P'", fontSize: 'var(--px-sm)', color: '#e8c040', textAlign: 'center' }}>
                {card.korName}
                {card.isReversed && <div style={{ fontSize: 'var(--px-xs)', color: '#c08080', marginTop: 2 }}>역방향</div>}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <HexagramDisplay lines={hexLines} />
              <div style={{ fontFamily: "'Press Start 2P'", fontSize: 'var(--px-sm)', color: '#c5a3f5', textAlign: 'center', lineHeight: 1.8, maxWidth: 130 }}>
                <div style={{ color: '#e8c040', marginBottom: 2 }}>{hexagram.korName}</div>
                <div style={{ fontSize: 'var(--px-xs)', color: 'rgba(197,163,245,0.7)' }}>
                  {hexagram.description}
                </div>
              </div>
            </div>
          </div>

          {(phase === 'verdict' || phase === 'answer' || phase === 'hook' || phase === 'done') && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              animation: 'verdictAppear 0.6s cubic-bezier(0.34,1.5,0.64,1) forwards',
            }}>
              <div style={{
                fontFamily: "'Press Start 2P'",
                fontSize: 56,
                color: isGil ? '#e8c040' : '#c06060',
                filter: isGil
                  ? 'drop-shadow(0 0 16px #e8c040) drop-shadow(0 0 32px rgba(232,192,64,0.35))'
                  : 'drop-shadow(0 0 16px #c06060) drop-shadow(0 0 32px rgba(192,96,96,0.35))',
                lineHeight: 1,
              }}>
                {verdict || '?'}
              </div>
              <div style={{
                fontFamily: "'Press Start 2P'", fontSize: 'var(--px-sm)',
                color: isGil ? '#e8c040' : '#c08080',
                letterSpacing: 2,
                border: `2px solid ${isGil ? '#e8c040' : '#c06060'}`,
                padding: '8px 14px',
                background: isGil ? 'rgba(232,192,64,0.08)' : 'rgba(192,96,96,0.08)',
                maxWidth: 320,
                textAlign: 'center',
                lineHeight: 1.6,
              }}>
                {verdictText}
              </div>
              {phase === 'verdict' && <VerdictTimer onDone={() => setPhase('answer')} />}
            </div>
          )}

          {(phase === 'answer' || phase === 'hook' || phase === 'done') && answer && (
            <div style={{ width: '100%', maxWidth: 540 }}>
              <ChatBubble
                key="oracle-answer"
                text={answer}
                speaker="witch"
                onDone={() => { setAnswerDone(true); setPhase('hook'); }}
              />
            </div>
          )}

          {(phase === 'hook' || phase === 'done') && answerDone && deeperHook && (
            <div style={{ width: '100%', maxWidth: 540 }}>
              <ChatBubble
                key="oracle-hook"
                text={deeperHook}
                speaker="witch"
                onDone={() => { setHookDone(true); setPhase('done'); }}
              />
            </div>
          )}

          {phase === 'done' && hookDone && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              animation: 'verdictAppear 0.5s ease forwards',
            }}>
              {apiFailed && (
                <div style={{
                  fontFamily: "'Press Start 2P'", fontSize: 'var(--px-xs)', color: '#c08080',
                  textAlign: 'center', marginBottom: 6, lineHeight: 1.6,
                }}>
                  ⚠ 점괘 API 연결 실패. 기본 문구가 표시됨.
                </div>
              )}
              <button
                className="pixel-btn gold"
                onClick={handleProceed}
                style={{ fontSize: '12px', padding: '12px 24px' }}
              >
                더 깊이 들어가볼래? ▶
              </button>
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes cardRevealFlip {
          0%   { transform: scaleX(0.04); opacity: 0.6; }
          45%  { transform: scaleX(0.04); }
          100% { transform: scaleX(1);    opacity: 1; }
        }
        @keyframes verdictAppear {
          0%   { opacity: 0; transform: scale(0.6) translateY(10px); }
          100% { opacity: 1; transform: scale(1)   translateY(0); }
        }
        @keyframes readingPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes cardSlideFromDeck {
          0%   { opacity: 0; transform: translate(-40px, -30px) scale(0.6) rotate(-8deg); }
          50%  { opacity: 1; transform: translate(-10px, -8px) scale(1.05) rotate(2deg); }
          100% { opacity: 1; transform: translate(0, 0) scale(1) rotate(0deg); }
        }
        @keyframes hexLineIn {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const ORACLE_LOADING_MSGS = [
  '점을 보는 중...',
  '카드와 괘를 읽고 있어...',
  '카드를 한 번 유심히 살펴봐봐... 재미있는 디테일이 있을 거야.',
  '이 순간의 에너지를 감지하고 있어...',
  '질문에 귀 기울이고 있어...',
];

function OracleLoadingPhase({ card }) {
  const [msgIdx, setMsgIdx] = React.useState(0);
  React.useEffect(() => {
    const pickRandom = () => Math.floor(Math.random() * ORACLE_LOADING_MSGS.length);
    setMsgIdx(pickRandom());
    const t = setInterval(() => setMsgIdx(pickRandom()), 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 20 }}>
      <div style={{ animation: 'readingPulse 1.2s ease infinite' }}>
        <TarotCard card={card} faceDown={false} size="lg" glowing />
      </div>
      <div style={{ fontFamily: "'Press Start 2P'", fontSize: 'var(--px-sm)', color: '#9b4fc4', textAlign: 'center', maxWidth: 280 }}>
        {ORACLE_LOADING_MSGS[msgIdx]}
      </div>
    </div>
  );
}

function VerdictTimer({ onDone }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, []);
  return null;
}

function HexagramDisplay({ lines }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column-reverse', gap: 4,
      background: 'rgba(26,10,46,0.5)',
      border: '1px solid #5a3d6b',
      padding: '10px 14px',
      width: 72,
    }}>
      {lines.map((line, i) => {
        const isYang = line === 7 || line === 9;
        const isChanging = line === 6 || line === 9;
        return (
          <div key={i} style={{
            display: 'flex', gap: 3, alignItems: 'center',
            animation: `hexLineIn 0.25s ease forwards ${i * 0.1}s`,
            opacity: 0,
          }}>
            {isYang ? (
              <div style={{
                height: 4, flex: 1,
                background: isChanging ? '#e8c040' : '#9b7bb8',
                boxShadow: isChanging ? '0 0 4px #e8c040' : 'none',
              }} />
            ) : (
              <>
                <div style={{ height: 4, flex: 1, background: isChanging ? '#c08080' : '#5a3d6b' }} />
                <div style={{ width: 6 }} />
                <div style={{ height: 4, flex: 1, background: isChanging ? '#c08080' : '#5a3d6b' }} />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
