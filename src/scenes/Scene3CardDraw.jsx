import React, { useState, useCallback, useRef } from 'react';
import TarotCard from '../components/TarotCard';
import ChatBubble from '../components/ChatBubble';
import OracleTable, { CardDeckStack } from '../components/OracleTable';
import CoinToss from '../components/CoinToss';
import { drawRandomCard } from '../data/tarotCards';
import { generateFreeReadingWithInputs } from '../data/freeReading';
import { initFreeTierReading, generateDeepReading } from '../services/geminiService';
import { playCardDraw } from '../utils/sound';

// phases: table → loading → card-reveal → verdict → answer → done | daily-limit
const POSITIVE_TIERS = new Set(['great_fortune', 'fortune']);

export default function Scene3CardDraw({ question, categoryId = 'general', user, onNext }) {
  const [phase, setPhase] = useState('table');
  const [card, setCard] = useState(null);
  const [hexagram, setHexagram] = useState(null);
  const [hexLines, setHexLines] = useState([]);
  const [cardDrawn, setCardDrawn] = useState(false);
  const [hexagramDone, setHexagramDone] = useState(false);
  const [freeResult, setFreeResult] = useState(null);
  const [readingId, setReadingId] = useState(null);
  const [dailyLimitExceeded, setDailyLimitExceeded] = useState(false);
  const [answerDone, setAnswerDone] = useState(false);
  const deepReadingPromiseRef = useRef(null);

  const handleDrawCard = useCallback(() => {
    if (cardDrawn) return;
    playCardDraw();
    setCard(drawRandomCard());
    setCardDrawn(true);
  }, [cardDrawn]);

  const handleHexagramComplete = useCallback((result) => {
    setHexagram(result.hexagram);
    setHexLines(result.lines);
    setHexagramDone(true);
  }, []);

  // When both card + hexagram ready → run template + server checks
  React.useEffect(() => {
    if (!cardDrawn || !hexagramDone || !card || !hexagram) return;
    setPhase('loading');

    (async () => {
      // 1. Template reading (instant, client-side, no LLM)
      const hexagramResult = { hexagram, lines: hexLines };
      const fr = generateFreeReadingWithInputs(categoryId, question, card, hexagramResult);
      setFreeResult(fr);

      // 2. Daily limit check (server-side, requires login)
      let rid = null;
      if (user) {
        try {
          const res = await initFreeTierReading({
            categoryId,
            questionText: question,
            cardId: card.id,
            isReversed: card.isReversed,
            hexagramNumber: hexagram.number,
          });
          if (!res.allowed) {
            setDailyLimitExceeded(true);
            setPhase('daily-limit');
            return;
          }
          rid = res.readingId;
          setReadingId(rid);
        } catch (err) {
          // Function not yet deployed — proceed without readingId
          console.warn('[initFreeTierReading] not available:', err.message);
        }
      }

      // 3. Fire deep reading in background (non-blocking)
      if (rid && user) {
        deepReadingPromiseRef.current = generateDeepReading({
          readingId: rid,
          card: { ...card, depth: card.depth || null },
          hexagram,
          categoryId,
          questionText: question,
        }).catch(err => {
          console.warn('[generateDeepReading] failed:', err.message);
          return null;
        });
      }

      // 4. Minimum loading display
      await new Promise(r => setTimeout(r, 1800));

      setPhase('card-reveal');
      setTimeout(() => setPhase('verdict'), 1000);
    })();
  }, [cardDrawn, hexagramDone]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleProceed() {
    onNext?.({
      card,
      hexagram,
      freeResult,
      readingId,
      deepReadingPromise: deepReadingPromiseRef.current,
    });
  }

  const isPositive = freeResult ? POSITIVE_TIERS.has(freeResult.fortune.tier) : true;
  const verdictColor = freeResult
    ? (isPositive ? '#e8c040' : freeResult.fortune.tier === 'neutral' ? '#c5a3f5' : '#c06060')
    : '#e8c040';

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

      {/* Stars */}
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

      {/* TABLE PHASE */}
      {phase === 'table' && (
        <OracleTable>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: 'var(--px-xs)', color: '#c5a3f5', textAlign: 'center', marginBottom: 16, letterSpacing: 1 }}>
            카드를 뽑고 동전을 6번 던져주세요
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '0 16px', alignItems: 'start', width: '100%' }}>
            {/* Card */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{ fontFamily: "'Press Start 2P'", fontSize: 'var(--px-xs)', color: '#e8c040', letterSpacing: 2, borderBottom: '1px solid rgba(232,192,64,0.3)', paddingBottom: 4, width: '100%', textAlign: 'center' }}>
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
                <div style={{ fontFamily: "'Press Start 2P'", fontSize: 'var(--px-xs)', color: '#e8c040', textAlign: 'center', lineHeight: 1.8 }}>
                  {card.korName}
                  {card.isReversed && <div style={{ fontSize: 'var(--px-2xs)', color: '#c08080', marginTop: 2 }}>역방향</div>}
                </div>
              )}
            </div>
            {/* Divider */}
            <div style={{ background: 'rgba(107,45,139,0.4)', alignSelf: 'stretch' }} />
            {/* Coins */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{ fontFamily: "'Press Start 2P'", fontSize: 'var(--px-xs)', color: '#e8c040', letterSpacing: 2, borderBottom: '1px solid rgba(232,192,64,0.3)', paddingBottom: 4, width: '100%', textAlign: 'center' }}>
                주역
              </div>
              <CoinToss onComplete={handleHexagramComplete} disabled={hexagramDone} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 14, fontFamily: "'Press Start 2P'", fontSize: 'var(--px-xs)' }}>
            <span style={{ color: cardDrawn ? '#5a9e3a' : 'rgba(255,255,255,0.2)' }}>
              {cardDrawn ? '✓ 카드 완료' : '○ 카드 대기'}
            </span>
            <span style={{ color: hexagramDone ? '#5a9e3a' : 'rgba(255,255,255,0.2)' }}>
              {hexagramDone ? '✓ 주역 완료' : '○ 주역 대기'}
            </span>
          </div>
        </OracleTable>
      )}

      {/* LOADING */}
      {phase === 'loading' && card && (
        <OracleTable>
          <OracleLoadingPhase card={card} />
        </OracleTable>
      )}

      {/* DAILY LIMIT EXCEEDED */}
      {phase === 'daily-limit' && (
        <div style={{ textAlign: 'center', maxWidth: 380, padding: '20px 0' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🌙</div>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: 'var(--px-md)', color: '#c5a3f5', lineHeight: 2, marginBottom: 8 }}>
            오늘의 무료 리딩을 이미 사용했어.
          </div>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: 'var(--px-sm)', color: '#9b7fc4', lineHeight: 2, marginBottom: 24 }}>
            내일 자정 이후에 다시 만나자.
          </div>
          <a href="/" style={{ fontFamily: "'Press Start 2P'", fontSize: 'var(--px-sm)', color: '#ffd700', textDecoration: 'none', border: '1px solid #ffd700', padding: '10px 20px' }}>
            ↩ 홈으로
          </a>
        </div>
      )}

      {/* CARD-REVEAL + VERDICT + ANSWER */}
      {(phase === 'card-reveal' || phase === 'verdict' || phase === 'answer' || phase === 'done') && card && hexagram && freeResult && (
        <>
          {/* Card + Hexagram display */}
          <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap', width: '100%', maxWidth: 560 }}>
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
                <div style={{ fontSize: 'var(--px-xs)', color: 'rgba(197,163,245,0.7)' }}>{hexagram.description}</div>
              </div>
            </div>
          </div>

          {/* Verdict (fortune label + message) */}
          {(phase === 'verdict' || phase === 'answer' || phase === 'done') && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, animation: 'verdictAppear 0.6s cubic-bezier(0.34,1.5,0.64,1) forwards' }}>
              <div style={{ fontSize: 48, lineHeight: 1, filter: `drop-shadow(0 0 16px ${verdictColor})` }}>
                {freeResult.fortune.emoji}
              </div>
              <div style={{
                fontFamily: "'Press Start 2P'", fontSize: 'var(--px-sm)',
                color: verdictColor, letterSpacing: 2,
                border: `2px solid ${verdictColor}`,
                padding: '8px 14px',
                background: `rgba(${isPositive ? '232,192,64' : '192,96,96'},0.08)`,
                maxWidth: 320, textAlign: 'center', lineHeight: 1.6,
              }}>
                {freeResult.fortune.label}
              </div>
              <div style={{ fontFamily: "'Press Start 2P'", fontSize: 'var(--px-sm)', color: '#c5a3f5', textAlign: 'center', maxWidth: 340, lineHeight: 2, marginTop: 4 }}>
                {freeResult.fortune.message}
              </div>
              {phase === 'verdict' && <VerdictTimer onDone={() => setPhase('answer')} />}
            </div>
          )}

          {/* Card interpretation via ChatBubble */}
          {(phase === 'answer' || phase === 'done') && (
            <div style={{ width: '100%', maxWidth: 540 }}>
              <ChatBubble
                key="free-answer"
                text={freeResult.summary.cardSection}
                speaker="witch"
                onDone={() => { setAnswerDone(true); setPhase('done'); }}
              />
            </div>
          )}

          {/* Proceed button */}
          {phase === 'done' && answerDone && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, animation: 'verdictAppear 0.5s ease forwards' }}>
              <button
                className="pixel-btn gold"
                onClick={handleProceed}
                style={{ fontSize: '12px', padding: '12px 24px' }}
              >
                결과 전체 보기 ▶
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

const LOADING_MSGS = [
  '점을 보는 중...',
  '카드와 괘를 읽고 있어...',
  '카드를 한 번 유심히 살펴봐봐...',
  '이 순간의 에너지를 감지하고 있어...',
  '질문에 귀 기울이고 있어...',
];

function OracleLoadingPhase({ card }) {
  const [msgIdx, setMsgIdx] = React.useState(0);
  React.useEffect(() => {
    const pick = () => Math.floor(Math.random() * LOADING_MSGS.length);
    setMsgIdx(pick());
    const t = setInterval(() => setMsgIdx(pick()), 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 20 }}>
      <div style={{ animation: 'readingPulse 1.2s ease infinite' }}>
        <TarotCard card={card} faceDown={false} size="lg" glowing />
      </div>
      <div style={{ fontFamily: "'Press Start 2P'", fontSize: 'var(--px-sm)', color: '#9b4fc4', textAlign: 'center', maxWidth: 280 }}>
        {LOADING_MSGS[msgIdx]}
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
    <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 4, background: 'rgba(26,10,46,0.5)', border: '1px solid #5a3d6b', padding: '10px 14px', width: 72 }}>
      {lines.map((line, i) => {
        const isYang = line === 7 || line === 9;
        const isChanging = line === 6 || line === 9;
        return (
          <div key={i} style={{ display: 'flex', gap: 3, alignItems: 'center', animation: `hexLineIn 0.25s ease forwards ${i * 0.1}s`, opacity: 0 }}>
            {isYang ? (
              <div style={{ height: 4, flex: 1, background: isChanging ? '#e8c040' : '#9b7bb8', boxShadow: isChanging ? '0 0 4px #e8c040' : 'none' }} />
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
