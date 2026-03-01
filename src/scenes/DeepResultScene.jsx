import React from 'react';
import TarotCard from '../components/TarotCard';

const font = "'Press Start 2P', monospace";

export default function DeepResultScene({ card, question, fullText, coreIssue, onRestart }) {
  const paragraphs = fullText
    ? fullText.split(/\n\n+/).filter(p => p.trim())
    : [];

  return (
    <div style={{
      width: '100%', minHeight: '100%',
      background: 'linear-gradient(180deg, #0d0612 0%, #150a1a 60%, #1a0d20 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      padding: '28px 16px 72px',
      gap: 0,
      overflowY: 'auto',
      boxSizing: 'border-box',
    }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 'var(--px-xs)', color: 'rgba(197,163,245,0.5)', fontFamily: font, letterSpacing: 3, marginBottom: 8 }}>
          ✨ 심층 리딩
        </div>
        <div style={{ fontSize: 'var(--px-md)', color: 'rgba(180,140,220,0.85)', fontFamily: font, lineHeight: 2, maxWidth: 480 }}>
          "{question}"
        </div>
      </div>

      {/* Card */}
      {card && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <TarotCard card={card} faceDown={false} size="md" />
          <div style={{ fontFamily: font, fontSize: 'var(--px-xs)', color: '#e8c040', textAlign: 'center' }}>
            {card.korName}
            {card.isReversed && <div style={{ fontSize: 'var(--px-2xs)', color: '#c08080', marginTop: 2 }}>역방향</div>}
          </div>
        </div>
      )}

      {/* Full reading */}
      <div style={{
        width: '100%', maxWidth: 560,
        border: '1px solid #6b2d8b',
        background: 'rgba(42,10,70,0.5)',
        padding: '22px 24px',
        marginBottom: 28,
        boxSizing: 'border-box',
      }}>
        <div style={{ fontFamily: font, fontSize: 'var(--px-xs)', color: '#c5a3f5', letterSpacing: 2, marginBottom: 18 }}>
          ✦ 아이라의 리딩
        </div>
        {paragraphs.length > 0 ? (
          paragraphs.map((p, i) => (
            <div
              key={i}
              style={{
                fontFamily: font, fontSize: 'var(--px-sm)', color: '#f0e6ff',
                lineHeight: 2.2, marginBottom: i < paragraphs.length - 1 ? 18 : 0,
              }}
            >
              {p}
            </div>
          ))
        ) : (
          <div style={{ fontFamily: font, fontSize: 'var(--px-sm)', color: '#9b7fc4', lineHeight: 2 }}>
            리딩을 불러오는 중...
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ width: '100%', maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <a
          href="/history"
          style={{
            display: 'block', textAlign: 'center',
            fontFamily: font, fontSize: '12px',
            background: 'rgba(107,45,139,0.2)', border: '1px solid #6b2d8b',
            color: '#c5a3f5', padding: '14px 20px',
            textDecoration: 'none',
          }}
        >
          📖 기록 보기
        </a>
        <button
          onClick={onRestart}
          style={{
            fontFamily: font, fontSize: '12px',
            background: 'transparent', border: '1px solid #3d1a6e',
            color: '#6b5080', padding: '14px 20px',
            cursor: 'pointer',
          }}
        >
          ↩ 다시 점보기
        </button>
      </div>
    </div>
  );
}
