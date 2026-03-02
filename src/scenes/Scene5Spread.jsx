import React, { useState } from 'react';
import ChatBubble from '../components/ChatBubble';
import { spendLua } from '../services/luaService';

const SPREADS = {
  oneCard: {
    name: '원카드',
    cards: 1,
    luaCost: 1,
    positions: ['현재'],
    pros: '지금 이 순간의 핵심만 딱 보여줘. 가장 직관적이야.',
    cons: '맥락이 필요하면 쓰리카드가 더 나아.',
  },
  threeCard: {
    name: '쓰리카드',
    cards: 3,
    luaCost: 3,
    positions: ['과거', '현재', '미래'],
    pros: '흐름이 보여. 과거→현재→미래로 이야기가 이어져.',
    cons: '복잡한 얽힘은 더 깊은 스프레드가 필요해.',
  },
};

const EXAMPLE_REPORT_URL = 'https://tarotjourney-6763a.web.app/report/7laMB2A2HpceMZygy5Xc';

// phases: select → confirm → spending → done
export default function Scene5Spread({ question, coreIssue, luaBalance, onLuaSpent, onNext }) {
  const [selected, setSelected] = useState(null);
  const [bubbleDone, setBubbleDone] = useState(false);
  const [phase, setPhase] = useState('select');
  const [spending, setSpending] = useState(false);
  const [spendError, setSpendError] = useState('');

  async function handleConfirm() {
    if (!selected || spending) return;
    const s = SPREADS[selected];

    if (luaBalance < s.luaCost) {
      setSpendError('루나가 부족해. 충전해줄래?');
      return;
    }

    setSpending(true);
    setSpendError('');
    try {
      const { lua } = await spendLua(s.luaCost);
      onLuaSpent?.(lua);
      onNext?.({ spreadType: selected, spreadName: s.name, positions: s.positions, cardCount: s.cards });
    } catch {
      setSpendError('루나 차감 실패. 다시 시도해봐.');
      setSpending(false);
    }
  }

  const font = "'Outfit', sans-serif";

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

      {/* Luna balance display */}
      {bubbleDone && (
        <div style={{ fontFamily: font, fontSize: '14px', fontWeight: 600, color: '#e8d4ff' }}>
          보유 루나: <span style={{ color: '#ffd700' }}>♦ {luaBalance}</span>
        </div>
      )}

      {bubbleDone && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 400 }}>
          {Object.entries(SPREADS).map(([key, s]) => {
            const isSelected = selected === key;
            const canAfford = luaBalance >= s.luaCost;
            return (
              <button
                key={key}
                onClick={() => { setSelected(key); setSpendError(''); }}
                style={{
                  background: isSelected ? 'rgba(107,45,139,0.4)' : 'rgba(107,45,139,0.12)',
                  border: `2px solid ${isSelected ? '#ffd700' : '#6b2d8b'}`,
                  padding: '16px 18px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  opacity: canAfford ? 1 : 0.55,
                }}
              >
                {/* Title + cost */}
                <div style={{
                  fontFamily: font, fontSize: '16px', fontWeight: 600,
                  color: isSelected ? '#ffd700' : '#f0e6ff',
                  marginBottom: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span>
                    {isSelected && <span style={{ color: '#ffd700' }}>▶ </span>}
                    {s.name}
                    <span style={{ fontSize: '13px', fontWeight: 400, color: '#c8a8e8', marginLeft: 8 }}>({s.cards}장)</span>
                  </span>
                  <span style={{
                    fontSize: '13px', fontWeight: 600,
                    color: canAfford ? '#ffd700' : '#c08080',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '4px 10px',
                    border: `1px solid ${canAfford ? '#ffd700' : '#c06060'}`,
                  }}>
                    ♦ {s.luaCost}루나
                  </span>
                </div>

                {/* Positions */}
                <div style={{
                  fontFamily: font, fontSize: '13px', fontWeight: 500,
                  color: 'rgba(230,210,255,0.95)',
                  marginBottom: 14, lineHeight: 1.6,
                }}>
                  {s.positions.join(' · ')}
                </div>

                {/* Pros / Cons - clearer labels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: font, fontSize: '12px', fontWeight: 700, color: '#6bc96b', flexShrink: 0, minWidth: 36 }}>장점</span>
                    <span style={{ fontFamily: font, fontSize: '14px', fontWeight: 500, color: '#e8f5e8', lineHeight: 1.6 }}>{s.pros}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: font, fontSize: '12px', fontWeight: 700, color: '#e88a8a', flexShrink: 0, minWidth: 36 }}>단점</span>
                    <span style={{ fontFamily: font, fontSize: '14px', fontWeight: 500, color: 'rgba(255,200,200,0.95)', lineHeight: 1.6 }}>{s.cons}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Example link - below spread options */}
      {bubbleDone && (
        <a
          href={EXAMPLE_REPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: font, fontSize: '12px', fontWeight: 500,
            color: 'rgba(232,192,96,0.9)',
            textDecoration: 'underline',
            textUnderlineOffset: 2,
          }}
        >
          예시
        </a>
      )}

      {/* Confirm button */}
      {selected && bubbleDone && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 4 }}>
          {luaBalance >= SPREADS[selected].luaCost ? (
            <button
              className="pixel-btn gold"
              onClick={handleConfirm}
              disabled={spending}
              style={{ fontSize: '11px', padding: '12px 24px' }}
            >
              {spending
                ? '처리 중...'
                : `♦ ${SPREADS[selected].luaCost}루나로 ${SPREADS[selected].name} 시작`}
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{
                fontFamily: font, fontSize: '14px', fontWeight: 500, color: '#e8a0a0',
                textAlign: 'center', lineHeight: 1.8,
                border: '1px solid #c06060', padding: '14px 18px',
              }}>
                루나가 없어.<br />
                아이라는 루나를 먹고 살아.<br />
                충전해줄래?
              </div>
              <button
                className="pixel-btn"
                onClick={() => {/* TODO: 결제 플로우 */}}
                style={{ fontSize: '10px', padding: '10px 20px', width: '100%' }}
              >
                ♦ 루나 충전하기
              </button>
            </div>
          )}

          {spendError && (
            <div style={{ fontFamily: font, fontSize: '13px', fontWeight: 500, color: '#e8a0a0', textAlign: 'center' }}>
              {spendError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
