import React, { useState } from 'react';
import ChatBubble from '../components/ChatBubble';

const SPREADS = {
  threeCard: {
    name: '쓰리카드',
    cards: 3,
    positions: ['과거', '현재', '미래'],
    pros: '빠르고 핵심이 명확해. 상황의 흐름을 잡는 데 최고야.',
    cons: '복잡하게 얽힌 층위는 표면만 보일 수 있어.',
  },
  celticCross: {
    name: '켈틱 크로스',
    cards: 10,
    positions: ['현재 상황', '도전/장애', '근거/기반', '과거', '가능성', '가까운 미래', '당신의 태도', '외부 영향', '희망과 두려움', '결과'],
    pros: '숨겨진 층위, 외부 영향, 내면까지 전부 드러내. 가장 입체적인 읽기.',
    cons: '10장이라 시간이 걸려. 진지하게 파고들 준비가 필요해.',
  },
};

export default function Scene5Spread({ question, coreIssue, onNext }) {
  const [selected, setSelected] = useState(null);
  const [bubbleDone, setBubbleDone] = useState(false);

  function handleConfirm() {
    if (!selected) return;
    const s = SPREADS[selected];
    onNext?.({ spreadType: selected, spreadName: s.name, positions: s.positions, cardCount: s.cards });
  }

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #0d0020, #1a0a2e)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      gap: 14, padding: '20px 16px',
      overflowY: 'auto',
      boxSizing: 'border-box',
    }}>
      <ChatBubble
        text="어떤 방식으로 읽어볼까?"
        speaker="witch"
        onDone={() => setBubbleDone(true)}
        style={{ maxWidth: 340 }}
      />

      {bubbleDone && (
        <>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 10,
            width: '100%', maxWidth: 400,
          }}>
            {Object.entries(SPREADS).map(([key, s]) => {
              const isSelected = selected === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelected(key)}
                  style={{
                    background: isSelected ? 'rgba(107,45,139,0.4)' : 'rgba(107,45,139,0.12)',
                    border: `2px solid ${isSelected ? '#ffd700' : '#6b2d8b'}`,
                    padding: '14px 16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                  }}
                >
                  {/* Title */}
                  <div style={{
                    fontFamily: "'Press Start 2P'", fontSize: 'var(--px-md)',
                    color: isSelected ? '#ffd700' : '#f0e6ff',
                    marginBottom: 10,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    {isSelected && <span style={{ color: '#ffd700' }}>▶ </span>}
                    {s.name}
                    <span style={{ fontSize: 'var(--px-sm)', color: '#9b7fc4' }}>({s.cards}장)</span>
                  </div>

                  {/* Positions */}
                  <div style={{
                    fontFamily: "'Press Start 2P'", fontSize: 'var(--px-sm)',
                    color: 'rgba(197,163,245,0.7)',
                    marginBottom: 12, lineHeight: 1.8,
                  }}>
                    {s.positions.join(' · ')}
                  </div>

                  {/* Pros / Cons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{
                        fontFamily: "'Press Start 2P'", fontSize: 'var(--px-sm)',
                        color: '#4caf50', flexShrink: 0,
                      }}>▲</span>
                      <span style={{
                        fontFamily: "'Press Start 2P'", fontSize: 'var(--px-sm)',
                        color: '#c5e8c5', lineHeight: 1.8,
                      }}>{s.pros}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{
                        fontFamily: "'Press Start 2P'", fontSize: 'var(--px-sm)',
                        color: '#ff8c8c', flexShrink: 0,
                      }}>▼</span>
                      <span style={{
                        fontFamily: "'Press Start 2P'", fontSize: 'var(--px-sm)',
                        color: 'rgba(255,140,140,0.8)', lineHeight: 1.8,
                      }}>{s.cons}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {selected && (
            <button
              className="pixel-btn gold"
              onClick={handleConfirm}
              style={{ fontSize: 'var(--px-md)', padding: '12px 24px', marginTop: 4 }}
            >
              ✓ {SPREADS[selected].name}으로 시작해
            </button>
          )}
        </>
      )}
    </div>
  );
}
