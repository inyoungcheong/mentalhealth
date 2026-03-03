import React, { useState, useEffect } from 'react';
import { checkDailyOracle, spendLua } from '../services/luaService';

const TIERS = [
  {
    key: 'oracle',
    name: '간단 점괘',
    cost: 0,
    label: '무료 (하루 1회)',
    desc: '타로 1장 + 주역 1괘로 아이라가 짧고 직접적인 팩폭 답변을 줄게.',
    tag: '점쟁이 팩폭',
  },
  {
    key: 'oneCard',
    name: '아이라 상담',
    cost: 1,
    label: '♦ 1루나',
    desc: '카드 1장을 더 깊이 읽어줄게. 너의 이야기를 들은 후 아이라만의 개인화된 리포트가 나와.',
    tag: '개인화 리딩',
  },
  {
    key: 'threeCard',
    name: '심층 상담',
    cost: 3,
    label: '♦ 3루나',
    desc: '과거·현재·미래 3장으로 상황의 흐름 전체를 읽어줄게. 아이라와 대화하며 완성하는 깊은 리딩.',
    tag: '심층 분석',
  },
];

export default function SceneTierSelect({ question, luaBalance, onNext, onLuaSpent, mode = 'all' }) {
  const [oracleChecking, setOracleChecking] = useState(true);
  const [oracleAvailable, setOracleAvailable] = useState(false);
  const [selected, setSelected] = useState(null);
  const [spending, setSpending] = useState(false);
  const [spendError, setSpendError] = useState('');

  useEffect(() => {
    checkDailyOracle()
      .then(({ allowed }) => setOracleAvailable(allowed))
      .catch(() => setOracleAvailable(true)) // fail open
      .finally(() => setOracleChecking(false));
  }, []);

  function isEnabled(tier) {
    if (tier.key === 'oracle') return oracleAvailable;
    return luaBalance >= tier.cost;
  }

  function disabledReason(tier) {
    if (tier.key === 'oracle') return '오늘 이미 봤어. 내일 다시 별이 뜨면.';
    return `루나 부족 (현재 ♦${luaBalance ?? 0})`;
  }

  async function handleConfirm() {
    if (!selected || spending) return;
    const tier = TIERS.find(t => t.key === selected);
    if (!tier || !isEnabled(tier)) return;

    if (tier.cost === 0) {
      onNext?.({ tier: tier.key });
      return;
    }

    setSpending(true);
    setSpendError('');
    try {
      const { lua } = await spendLua(tier.cost);
      onLuaSpent?.(lua);
      onNext?.({ tier: tier.key });
    } catch {
      setSpendError('루나 차감 실패. 다시 시도해봐.');
      setSpending(false);
    }
  }

  const visibleTiers = mode === 'paid-only'
    ? TIERS.filter(t => t.cost > 0)
    : TIERS;

  const font = "'Press Start 2P'";

  if (oracleChecking && mode !== 'paid-only') {
    return (
      <div style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(180deg, #0d0020, #1a0a2e)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontFamily: font, fontSize: '8px', color: 'rgba(197,163,245,0.5)', letterSpacing: 2 }}>···</div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #0d0020, #1a0a2e)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      gap: 14, padding: '20px 16px 28px',
      overflowY: 'auto',
      boxSizing: 'border-box',
    }}>
      {/* Question */}
      <div style={{
        fontFamily: "'Outfit', sans-serif", fontSize: '13px',
        color: 'rgba(220,200,255,0.9)', textAlign: 'center',
        lineHeight: 1.6, maxWidth: 400,
        borderBottom: '1px solid rgba(107,45,139,0.4)',
        paddingBottom: 12, width: '100%',
      }}>
        "{question}"
      </div>

      <div style={{ fontFamily: font, fontSize: '9px', color: '#c5a3f5' }}>
        어떤 리딩을 원해?
      </div>

      {/* Tier cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 400 }}>
        {visibleTiers.map(tier => {
          const enabled = isEnabled(tier);
          const isSelected = selected === tier.key;
          return (
            <button
              key={tier.key}
              onClick={() => { if (enabled) { setSelected(tier.key); setSpendError(''); } }}
              disabled={!enabled}
              style={{
                background: isSelected
                  ? 'rgba(107,45,139,0.45)'
                  : enabled ? 'rgba(107,45,139,0.12)' : 'rgba(30,10,50,0.5)',
                border: `2px solid ${isSelected ? '#ffd700' : enabled ? '#6b2d8b' : '#3a1a5a'}`,
                padding: '14px 16px',
                cursor: enabled ? 'pointer' : 'not-allowed',
                textAlign: 'left',
                transition: 'all 0.2s',
                opacity: enabled ? 1 : 0.5,
              }}
            >
              {/* Header row */}
              <div style={{
                fontFamily: font, fontSize: '11px',
                color: isSelected ? '#ffd700' : enabled ? '#f0e6ff' : '#7a5a9a',
                marginBottom: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span>
                  {isSelected && <span style={{ color: '#ffd700' }}>▶ </span>}
                  {tier.name}
                </span>
                <span style={{
                  fontSize: '9px',
                  color: enabled
                    ? (tier.cost === 0 ? '#6bc96b' : '#ffd700')
                    : '#c08080',
                  background: 'rgba(0,0,0,0.3)',
                  padding: '2px 8px',
                  border: `1px solid ${enabled ? (tier.cost === 0 ? '#6bc96b' : '#ffd700') : '#c06060'}`,
                }}>
                  {tier.label}
                </span>
              </div>

              {/* Tag */}
              <div style={{
                fontFamily: font, fontSize: '7px',
                color: isSelected ? '#ffd700' : '#9b6bbf',
                marginBottom: 6,
              }}>
                [{tier.tag}]
              </div>

              {/* Description */}
              <div style={{
                fontFamily: font, fontSize: '8px',
                color: enabled ? 'rgba(220,190,255,0.9)' : 'rgba(150,120,180,0.6)',
                lineHeight: 1.9,
              }}>
                {tier.desc}
              </div>

              {/* Disabled reason */}
              {!enabled && (
                <div style={{
                  fontFamily: font, fontSize: '7px',
                  color: '#c08080', marginTop: 8, lineHeight: 1.8,
                }}>
                  ✕ {disabledReason(tier)}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Confirm button */}
      {selected && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <button
            className="pixel-btn gold"
            onClick={handleConfirm}
            disabled={spending}
            style={{ fontSize: '11px', padding: '12px 28px' }}
          >
            {spending
              ? '처리 중...'
              : TIERS.find(t => t.key === selected)?.cost > 0
                ? `♦ ${TIERS.find(t => t.key === selected)?.cost}루나로 시작`
                : '시작하기 ▶'}
          </button>
          {spendError && (
            <div style={{ fontFamily: font, fontSize: '7px', color: '#c08080', textAlign: 'center' }}>
              {spendError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
