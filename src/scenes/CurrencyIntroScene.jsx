import React, { useState } from 'react';
import { consumeLuaAndCreateSession } from '../services/luaService';

const SPREADS = [
  { key: 'oneCard',     label: '1괘',        cost: 1, cards: 1,  desc: '아이라가 카드 하나에 집중해 깊이 파고들어. 핵심만, 날카롭게.', positions: ['현재'] },
  { key: 'threeCard',   label: '쓰리카드',   cost: 3, cards: 3,  desc: '과거·현재·미래의 흐름을 읽어. 지금이 어디서 왔고 어디로 가는지.', positions: ['과거', '현재', '미래'] },
  { key: 'celticCross', label: '셀틱 크로스', cost: 5, cards: 10, desc: '10장으로 상황의 전체 지도를 그려. 가장 깊고 넓은 리딩.',
    positions: ['현재 상황', '도전/장애', '근거/기반', '과거', '가능성', '가까운 미래', '당신의 태도', '외부 영향', '희망과 두려움', '결과'],
  },
];

export default function CurrencyIntroScene({ question, luaBalance, deeperHook, onNext }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCharge, setShowCharge] = useState(false);

  async function handleSelect(spread) {
    if (luaBalance < spread.cost) {
      setShowCharge(true);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await consumeLuaAndCreateSession({ spreadType: spread.key, question });
      const { ok, luaAfter, sessionId, cost, reason } = res.data;
      if (!ok) {
        if (reason === 'insufficient-lua') setShowCharge(true);
        else setError('오류가 발생했어. 잠시 후 다시 시도해줘.');
        setLoading(false);
        return;
      }
      onNext?.({
        sessionId,
        luaAfter,
        cost,
        spreadType: spread.key,
        spreadName: spread.label,
        positions: spread.positions,
        cardCount: spread.cards,
      });
    } catch (e) {
      setError('연결에 실패했어. 다시 시도해줘.');
      setLoading(false);
    }
  }

  const font = "'Press Start 2P', monospace";

  return (
    <div style={{
      width: '100%', minHeight: '100%',
      background: 'linear-gradient(180deg, #0d0020, #1a0a2e)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '32px 20px 48px', boxSizing: 'border-box', gap: 20,
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', fontFamily: font }}>
        <div style={{ fontSize: 'var(--px-md)', color: '#ffd700', letterSpacing: 2, marginBottom: 8 }}>
          ✦ 더 깊이 볼까? ✦
        </div>
        <div style={{ fontSize: 'var(--px-sm)', color: '#9b7fc4', lineHeight: 2, maxWidth: 320 }}>
          {deeperHook || '아이라가 직접 카드를 짚어줄게.'}
        </div>
        <div style={{ fontSize: 'var(--px-xs)', color: '#6b5080', lineHeight: 2, maxWidth: 300, marginTop: 8 }}>
          방금 본 건 빠른 점술이었어.<br />
          여기서부턴 아이라가 네 질문 안으로 들어가.
        </div>
      </div>

      {/* Lua explanation */}
      <div style={{
        background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.25)',
        padding: '14px 18px', maxWidth: 380, width: '100%', boxSizing: 'border-box',
        fontFamily: font,
      }}>
        <div style={{ fontSize: 'var(--px-sm)', color: '#ffd700', marginBottom: 10, letterSpacing: 1 }}>
          루나(♦) 안내
        </div>
        <div style={{ fontSize: 'var(--px-sm)', color: '#c5a3f5', lineHeight: 2.2 }}>
          모든 방문자에게 첫 방문 시 <span style={{ color: '#ffd700' }}>3루나</span>가 지급돼.<br />
          지금 보유: <span style={{ color: luaBalance === 0 ? '#ff6b6b' : '#ffd700' }}>♦ {luaBalance} 루나</span>
        </div>
      </div>

      {/* Spread options */}
      <div style={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontFamily: font, fontSize: 'var(--px-sm)', color: '#9b7fc4', letterSpacing: 1, marginBottom: 4 }}>
          스프레드를 선택해
        </div>
        {SPREADS.map(s => {
          const canAfford = luaBalance >= s.cost;
          return (
            <button
              key={s.key}
              onClick={() => !loading && handleSelect(s)}
              disabled={loading}
              style={{
                background: canAfford ? 'rgba(107,45,139,0.2)' : 'rgba(60,60,60,0.2)',
                border: `2px solid ${canAfford ? '#6b2d8b' : '#444'}`,
                padding: '14px 16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.15s',
              }}
            >
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontFamily: font, marginBottom: 6,
              }}>
                <span style={{ fontSize: 'var(--px-md)', color: canAfford ? '#f0e6ff' : '#888' }}>
                  {s.label}
                  <span style={{ fontSize: 'var(--px-sm)', color: '#9b7fc4', marginLeft: 8 }}>
                    ({s.cards}장)
                  </span>
                </span>
                <span style={{
                  fontSize: 'var(--px-sm)',
                  color: canAfford ? '#ffd700' : '#666',
                  background: canAfford ? 'rgba(255,215,0,0.1)' : 'rgba(80,80,80,0.2)',
                  padding: '3px 8px', border: `1px solid ${canAfford ? '#ffd70055' : '#55555555'}`,
                }}>
                  ♦ {s.cost} 루나
                </span>
              </div>
              <div style={{
                fontFamily: font, fontSize: 'var(--px-xs)',
                color: canAfford ? 'rgba(197,163,245,0.8)' : '#555',
                lineHeight: 2,
              }}>
                {s.desc}
              </div>
              {!canAfford && (
                <div style={{ fontFamily: font, fontSize: 'var(--px-xs)', color: '#ff6b6b', marginTop: 6 }}>
                  루나 부족 ({s.cost - luaBalance} 루나 더 필요)
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div style={{ fontFamily: font, fontSize: 'var(--px-sm)', color: '#ff6b6b', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {/* Insufficient lua modal */}
      {showCharge && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
        }}
          onClick={() => setShowCharge(false)}
        >
          <div
            style={{
              background: '#1a0a2e', border: '2px solid #6b2d8b',
              padding: '28px 24px', maxWidth: 320, width: '90%',
              fontFamily: font, textAlign: 'center',
              display: 'flex', flexDirection: 'column', gap: 16,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: '20px', color: '#ffd700' }}>♦</div>
            <div style={{ fontSize: 'var(--px-md)', color: '#f0e6ff', lineHeight: 2 }}>
              앗. 루나가 부족하네.
            </div>
            <div style={{ fontSize: 'var(--px-sm)', color: '#9b7fc4', lineHeight: 2 }}>
              루나 충전은 준비 중이야.<br />
              조금만 기다려줘.
            </div>
            <button
              className="pixel-btn secondary"
              onClick={() => setShowCharge(false)}
              style={{ fontSize: 'var(--px-sm)', alignSelf: 'center' }}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,20,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
        }}>
          <div style={{ fontFamily: font, fontSize: 'var(--px-md)', color: '#c5a3f5' }}>
            루나를 사용하는 중
            <span className="loading-dot">.</span>
            <span className="loading-dot">.</span>
            <span className="loading-dot">.</span>
          </div>
        </div>
      )}
    </div>
  );
}
