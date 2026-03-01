import React from 'react';
import TarotCard from '../components/TarotCard';
import { BLUR_PLACEHOLDER } from '../data/readingTemplates';

const font = "'Press Start 2P', monospace";

const TIER_COLORS = {
  great_fortune: '#e8c040',
  fortune: '#7dff7d',
  neutral: '#c5a3f5',
  caution: '#ff9f43',
  misfortune: '#c06060',
};

export default function FreeResultScene({
  card,
  hexagram,
  freeResult,
  readingId,
  deepPreview,     // null while loading, string when deep reading arrives
  user,
  onSelectTier,    // ({ tier: '330' | '990' }) => void
}) {
  if (!freeResult) return null;

  const { fortune, summary, bridge, synergy } = freeResult;
  const fortuneColor = TIER_COLORS[fortune.tier] || '#c5a3f5';
  const isPositive = fortune.tier === 'great_fortune' || fortune.tier === 'fortune';

  // Build blurred placeholder lines for visual height estimation
  const blurLines = deepPreview
    ? null
    : ['', '', '', ''].map((_, i) => (
        <div key={i} style={{
          height: 16, borderRadius: 2, marginBottom: 10,
          background: 'rgba(197,163,245,0.15)',
          width: i % 2 === 0 ? '92%' : '78%',
        }} />
      ));

  return (
    <div style={{
      width: '100%', minHeight: '100%',
      background: 'linear-gradient(180deg, #0d0612 0%, #150a1a 60%, #1a0d20 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 16px 60px',
      gap: 0,
      overflowY: 'auto',
      boxSizing: 'border-box',
    }}>

      {/* ── 헤더 ── */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 'var(--px-xs)', color: 'rgba(197,163,245,0.5)', fontFamily: font, letterSpacing: 3, marginBottom: 6 }}>
          ✦ 오늘의 점괘 ✦
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          border: `1px solid ${fortuneColor}44`,
          padding: '8px 16px',
          background: `rgba(${isPositive ? '232,192,64' : '107,45,139'},0.06)`,
        }}>
          <span style={{ fontSize: 24 }}>{fortune.emoji}</span>
          <span style={{ fontFamily: font, fontSize: 'var(--px-sm)', color: fortuneColor, letterSpacing: 2 }}>
            {fortune.label}
          </span>
          <span style={{ fontFamily: font, fontSize: 'var(--px-xs)', color: '#9b7fc4' }}>
            {fortune.score}점
          </span>
        </div>
      </div>

      {/* ── 카드 + 괘 ── */}
      <div style={{
        display: 'flex', gap: 24, alignItems: 'flex-start',
        justifyContent: 'center', flexWrap: 'wrap',
        width: '100%', maxWidth: 540, marginBottom: 20,
      }}>
        {card && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <TarotCard card={card} faceDown={false} size="md" />
            <div style={{ fontFamily: font, fontSize: 'var(--px-xs)', color: '#e8c040', textAlign: 'center' }}>
              {card.korName}
              {card.isReversed && <div style={{ fontSize: 'var(--px-2xs)', color: '#c08080', marginTop: 2 }}>역방향</div>}
            </div>
          </div>
        )}
        {hexagram && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            border: '1px solid #3d1a6e', padding: '14px 18px',
            background: 'rgba(26,10,46,0.5)',
          }}>
            <div style={{ fontSize: 32, lineHeight: 1 }}>{hexagram.unicode || '☰'}</div>
            <div style={{ fontFamily: font, fontSize: 'var(--px-xs)', color: '#e8c040', textAlign: 'center' }}>
              {hexagram.korName}
            </div>
            <div style={{ fontFamily: font, fontSize: 'var(--px-2xs)', color: '#9b7fc4', textAlign: 'center', maxWidth: 120, lineHeight: 1.8 }}>
              {hexagram.meaning}
            </div>
          </div>
        )}
      </div>

      {/* ── 템플릿 해석 ── */}
      <div style={{
        width: '100%', maxWidth: 560,
        border: '1px solid #3d1a6e',
        background: 'rgba(27,10,46,0.5)',
        padding: '18px 20px',
        marginBottom: 20,
        boxSizing: 'border-box',
      }}>
        {/* 길흉 메시지 */}
        <div style={{ fontFamily: font, fontSize: 'var(--px-sm)', color: fortuneColor, lineHeight: 2, marginBottom: 14 }}>
          {fortune.message}
        </div>

        {/* 카드 해석 */}
        <div style={{ fontFamily: font, fontSize: 'var(--px-sm)', color: '#f0e6ff', lineHeight: 2, marginBottom: 14 }}>
          {summary.cardSection}
        </div>

        {/* 브릿지 + 괘 해석 */}
        <div style={{ borderTop: '1px solid #3d1a6e', paddingTop: 12, marginBottom: 14 }}>
          <span style={{ fontFamily: font, fontSize: 'var(--px-sm)', color: '#c5a3f5', lineHeight: 2 }}>
            {summary.bridgeAndHex}
          </span>
        </div>

        {/* 시너지 */}
        <div style={{ fontFamily: font, fontSize: 'var(--px-xs)', color: '#9b7fc4', lineHeight: 2, borderTop: '1px solid #3d1a6e', paddingTop: 10 }}>
          {summary.synergyMessage}
        </div>
      </div>

      {/* ── AI 심층 리딩 미리보기 ── */}
      <div style={{
        width: '100%', maxWidth: 560,
        border: '1px solid #6b2d8b',
        background: 'rgba(42,10,70,0.5)',
        padding: '18px 20px',
        marginBottom: 24,
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ fontFamily: font, fontSize: 'var(--px-xs)', color: '#c5a3f5', letterSpacing: 2, marginBottom: 14 }}>
          ✨ AI 심층 리딩 미리보기
        </div>

        {/* 미리보기 내용 (LLM 응답 전: 로딩 애니메이션) */}
        {!deepPreview ? (
          <div>
            <div style={{ fontFamily: font, fontSize: 'var(--px-xs)', color: '#9b7fc4', lineHeight: 2, marginBottom: 12 }}>
              {BLUR_PLACEHOLDER.loading}
            </div>
            {blurLines}
          </div>
        ) : (
          <div>
            {/* 앞 2문단 — 선명하게 */}
            <div style={{ fontFamily: font, fontSize: 'var(--px-sm)', color: '#f0e6ff', lineHeight: 2, marginBottom: 16 }}>
              {deepPreview}
            </div>
            {/* 나머지 — 블러 */}
            <div style={{
              fontFamily: font, fontSize: 'var(--px-sm)', color: '#c5a3f5', lineHeight: 2,
              filter: 'blur(5px)',
              userSelect: 'none',
              pointerEvents: 'none',
              opacity: 0.7,
            }}>
              이 카드가 드러내는 더 깊은 이야기가 있어. 당신이 아직 인식하지 못한 패턴이 여기서 움직이고 있고, 그것이 지금의 상황을 만들어가고 있는 힘이야. 두려움과 욕망이 교차하는 지점에서 진짜 선택이 시작돼. 이 에너지를 어떻게 받아들이느냐가 앞으로 6개월의 방향을 바꿀 수 있어.
            </div>
            {/* 그라데이션 마스크 */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: 80,
              background: 'linear-gradient(transparent, rgba(42,10,70,0.95))',
            }} />
          </div>
        )}
      </div>

      {/* ── CTA 버튼 ── */}
      <div style={{
        width: '100%', maxWidth: 560,
        display: 'flex', flexDirection: 'column', gap: 12,
        boxSizing: 'border-box',
      }}>
        <button
          className="pixel-btn gold"
          onClick={() => onSelectTier?.({ tier: '330' })}
          style={{ fontSize: '12px', padding: '14px 20px', width: '100%' }}
        >
          ✨ 전체 심층 리딩 보기 — 330원
        </button>
        <button
          className="pixel-btn"
          onClick={() => onSelectTier?.({ tier: '990' })}
          style={{ fontSize: '12px', padding: '14px 20px', width: '100%', background: 'rgba(107,45,139,0.3)', borderColor: '#6b2d8b', color: '#c5a3f5' }}
        >
          🔮 쓰리카드 깊은 상담 — 990원
        </button>
      </div>

      {/* 로그인 안내 (비로그인 유저) */}
      {!user && (
        <div style={{ fontFamily: font, fontSize: 'var(--px-xs)', color: '#6b5080', textAlign: 'center', marginTop: 16, lineHeight: 2 }}>
          결제하려면 로그인이 필요해.
        </div>
      )}
    </div>
  );
}
