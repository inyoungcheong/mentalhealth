import React, { useState, useEffect } from 'react';
import TarotCard from '../components/TarotCard';
import ChatBubble from '../components/ChatBubble';
import { drawRandomCard } from '../data/tarotCards';
import { readCard } from '../services/geminiService';
import { appendCard, appendAnswer } from '../services/firestoreService';

const LOADING_MSGS = [
  '카드를 읽는 중...',
  '당신의 질문에 귀 기울이고 있어...',
  '카드가 무슨 말을 하는지 들여다보고 있어...',
  '이 순간의 에너지를 감지하고 있어...',
  '패턴 속에서 실마리를 찾고 있어...',
  '카드와 질문 사이의 연결을 읽고 있어...',
  '카드를 한 번 유심히 살펴봐봐... 재미있는 디테일이 있을 거야.',
  '카드 속 인물이나 상징이 눈에 띄어?',
  '지금 이 카드가 네게 뭔가 말하는 것 같지 않아?',
  '이미지 속에서 눈에 띄는 게 있어?',
  '카드의 색감이나 분위기가 어떤 느낌을 줘?',
];

export default function Scene6Reading({ sessionId, question, coreIssue, oracleAnswer, spreadName, positions, cardCount, onNext }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [drawnCards, setDrawnCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [reading, setReading] = useState('');
  const [nextQuestion, setNextQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [phase, setPhase] = useState('draw'); // draw | reading | answering
  const [loading, setLoading] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [readingBubbleDone, setReadingBubbleDone] = useState(false);
  const [questionBubbleDone, setQuestionBubbleDone] = useState(false);
  const [allCards, setAllCards] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Random loading messages while API is loading
  useEffect(() => {
    if (!loading) return;
    const pickRandom = () => Math.floor(Math.random() * LOADING_MSGS.length);
    setLoadingMsgIdx(pickRandom());
    const t = setInterval(() => setLoadingMsgIdx(pickRandom()), 2400);
    return () => clearInterval(t);
  }, [loading]);

  async function handleDrawCard() {
    if (currentIdx >= cardCount) return;

    // Draw card immediately so animation can show the actual card
    const card = drawRandomCard(allCards.map(c => c.card?.id).filter(Boolean));
    setCurrentCard(card);
    setIsFlipping(true);
    setPhase('reading');
    setReadingBubbleDone(false);
    setQuestionBubbleDone(false);
    setLoadingMsgIdx(0);
    setLoading(true);

    // Flip animation runs for 1.4s
    setTimeout(() => setIsFlipping(false), 1400);

    try {
      const result = await readCard({
        position: currentIdx,
        positionLabel: positions[currentIdx],
        card,
        previousContext: drawnCards,
        question,
        coreIssue: coreIssue || '',
        allAnswers: allCards.map(c => ({ positionLabel: c.positionLabel, answer: c.userAnswer })),
        oracleAnswer: oracleAnswer || '',
      });
      setReading(result.reading);
      setNextQuestion(result.nextQuestion || '이 상황에서 어떤 선택이 가장 어렵게 느껴져?');
      setSuggestions(result.suggestions || []);

      if (sessionId) {
        await appendCard(sessionId, {
          card, position: currentIdx, positionLabel: positions[currentIdx], reading: result.reading,
          question: result.nextQuestion,
        });
      }
    } catch (err) {
      const fallback = card.isReversed ? card.reversed : card.upright;
      setReading(`${card.korName}: ${fallback}`);
      setNextQuestion('이것이 지금 네 상황에서 어떻게 느껴져?');
    } finally {
      setLoading(false);
    }
  }

  async function handleAnswer() {
    if (!userAnswer.trim()) return;

    if (sessionId) {
      await appendAnswer(sessionId, {
        cardIndex: currentIdx,
        question: nextQuestion,
        answer: userAnswer,
      });
    }

    const newCard = { card: currentCard, positionLabel: positions[currentIdx], reading, userAnswer };
    const newAllCards = [...allCards, newCard];
    setAllCards(newAllCards);
    setDrawnCards([...drawnCards, { card: currentCard, positionLabel: positions[currentIdx], reading }]);
    setUserAnswer('');

    const nextIdx = currentIdx + 1;
    if (nextIdx >= cardCount) {
      onNext?.({ cards: newAllCards });
    } else {
      setCurrentIdx(nextIdx);
      setCurrentCard(null);
      setReading('');
      setNextQuestion('');
      setSuggestions([]);
      setPhase('draw');
    }
  }

  const progress = (currentIdx / cardCount) * 100;

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #0d0020, #1a0a2e)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      padding: '12px 16px',
      gap: 10,
      overflowY: 'auto',
      boxSizing: 'border-box',
    }}>
      {/* Header */}
      <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{
          fontFamily: "'Press Start 2P'", fontSize: '8px', color: '#ffd700',
          display: 'flex', justifyContent: 'space-between',
        }}>
          <span>{spreadName}</span>
          <span>{currentIdx}/{cardCount}</span>
        </div>
        <div style={{ width: '100%', height: 6, background: 'rgba(255,215,0,0.15)', border: '1px solid #6b2d8b' }}>
          <div style={{
            height: '100%', background: '#ffd700',
            width: `${progress}%`, transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* Previous cards summary */}
      {drawnCards.length > 0 && (
        <div style={{
          display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center',
          width: '100%', maxWidth: 420,
        }}>
          {drawnCards.map((dc, i) => (
            <div key={i} style={{
              background: 'rgba(107,45,139,0.2)', border: '1px solid #6b2d8b',
              padding: '3px 6px',
              fontFamily: "'Press Start 2P'", fontSize: '8px', color: '#d4b8f0',
              textAlign: 'center',
            }}>
              <div style={{ color: '#ffd700' }}>{dc.positionLabel}</div>
              <div>{dc.card.korName}</div>
            </div>
          ))}
        </div>
      )}

      {/* Current position label */}
      <div style={{
        fontFamily: "'Press Start 2P'", fontSize: '9px',
        color: '#c5a3f5', textAlign: 'center',
      }}>
        {positions[currentIdx]} ({currentIdx + 1}/{cardCount})
      </div>

      {/* Draw phase */}
      {phase === 'draw' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ cursor: 'pointer' }} onClick={handleDrawCard}>
            <TarotCard faceDown={true} size="lg" glowing />
          </div>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: '10px', color: '#e0b8ff' }}>
            카드를 클릭해서 뽑아
          </div>
        </div>
      )}

      {/* Reading phase */}
      {phase === 'reading' && currentCard && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: '100%', maxWidth: 400 }}>
          {/* Card with flip animation */}
          <div style={{
            animation: isFlipping ? 'cardFlipReveal 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' : 'none',
          }}>
            <TarotCard card={currentCard} faceDown={false} size="md" glowing />
          </div>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: '7px', color: '#ffd700' }}>
            {currentCard.korName} {currentCard.isReversed ? '(역방향)' : ''}
          </div>

          {loading && (
            <div style={{
              fontFamily: "'Press Start 2P'", fontSize: '10px', color: '#e0b8ff',
              textAlign: 'center', lineHeight: 2, maxWidth: 300,
              animation: 'msgFadeIn 0.4s ease',
              key: loadingMsgIdx,
            }}>
              {LOADING_MSGS[loadingMsgIdx]}
            </div>
          )}

          {!loading && reading && (
            <>
              <ChatBubble
                text={reading}
                speaker="witch"
                onDone={() => setReadingBubbleDone(true)}
                style={{ maxWidth: 360 }}
              />

              {readingBubbleDone && nextQuestion && (
                <ChatBubble
                  key={nextQuestion}
                  text={nextQuestion}
                  speaker="witch"
                  onDone={() => setQuestionBubbleDone(true)}
                  style={{ maxWidth: 360 }}
                />
              )}

              {/* Button appears after question is fully shown */}
              {questionBubbleDone && (
                <button
                  className="pixel-btn gold"
                  onClick={() => setPhase('answering')}
                  style={{ fontSize: '10px', padding: '10px 22px', marginTop: 4 }}
                >
                  답변하기 ▶
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Answering phase */}
      {phase === 'answering' && currentCard && (
        <div style={{
          width: '100%', maxWidth: 420,
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {/* Card context reminder */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(107,45,139,0.15)',
            border: '1px solid #6b2d8b',
            padding: '8px 12px',
          }}>
            <TarotCard card={currentCard} faceDown={false} size="sm" />
            <div>
              <div style={{ fontFamily: "'Press Start 2P'", fontSize: '7px', color: '#ffd700', marginBottom: 3 }}>
                {positions[currentIdx]}
              </div>
              <div style={{ fontFamily: "'Press Start 2P'", fontSize: '9px', color: '#d4b8f0' }}>
                {currentCard.korName} {currentCard.isReversed ? '(역방향)' : ''}
              </div>
            </div>
          </div>

          {/* Question — ChatBubble (consistent with reading phase) */}
          <ChatBubble
            text={nextQuestion}
            speaker="witch"
            autoType={false}
            style={{ maxWidth: 380 }}
          />

          {/* Suggestion chips */}
          {suggestions.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setUserAnswer(s)}
                  style={{
                    fontFamily: "'Press Start 2P'",
                    fontSize: '7px',
                    background: userAnswer === s ? 'rgba(155,75,196,0.4)' : 'rgba(107,45,139,0.2)',
                    border: `1px solid ${userAnswer === s ? '#9b4fc4' : '#6b2d8b'}`,
                    color: userAnswer === s ? '#f0e6ff' : '#c5a3f5',
                    padding: '6px 10px',
                    cursor: 'pointer',
                    lineHeight: 1.6,
                    transition: 'all 0.15s',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Answer textarea */}
          <textarea
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            placeholder="솔직하게 답해봐..."
            autoFocus
            style={{
              fontFamily: "'Press Start 2P'", fontSize: '8px',
              background: 'rgba(27,10,46,0.8)', border: '1px solid #6b2d8b',
              color: '#f0e6ff', padding: '10px', resize: 'none', height: 80,
              outline: 'none', lineHeight: 1.8, width: '100%',
              boxSizing: 'border-box',
            }}
          />

          <button
            className="pixel-btn gold"
            onClick={handleAnswer}
            disabled={!userAnswer.trim()}
            style={{ fontSize: '10px' }}
          >
            {currentIdx + 1 < cardCount ? `▶ 다음 카드로 (${currentIdx + 2}/${cardCount})` : '✓ 리딩 완료'}
          </button>
        </div>
      )}

      <style>{`
        @keyframes cardFlipReveal {
          0%   { transform: rotateY(-90deg) scale(0.85); opacity: 0.2; }
          35%  { transform: rotateY(-15deg) scale(1.04); opacity: 0.9; }
          65%  { transform: rotateY(5deg)  scale(1.02); opacity: 1; }
          100% { transform: rotateY(0deg)  scale(1);    opacity: 1; }
        }
        @keyframes msgFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
