import React from 'react';

/**
 * Wood table surface for oracle reading.
 * Pixel-style wood grain, subtle shadow.
 */
export default function OracleTable({ children, style = {} }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 560,
        minHeight: 200,
        background: `
          repeating-linear-gradient(
            90deg,
            #3d2817 0px,
            #4a3320 2px,
            #3d2817 4px
          )
        `,
        border: '3px solid #2d1a0a',
        boxShadow: `
          inset 0 2px 4px rgba(255,255,255,0.08),
          inset 0 -2px 4px rgba(0,0,0,0.3),
          0 8px 0 #1a0f05,
          0 12px 24px rgba(0,0,0,0.5)
        `,
        borderRadius: 4,
        padding: '20px 16px',
        imageRendering: 'pixelated',
        ...style,
      }}
    >
      {/* Table edge highlight */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, height: 4,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)',
        borderRadius: '4px 4px 0 0',
        pointerEvents: 'none',
      }} />
      {children}
    </div>
  );
}

/**
 * Card deck stack - tap to draw
 * count: number of visible cards (4 = full, 3 = one drawn)
 */
export function CardDeckStack({ onClick, disabled, count = 4, style = {} }) {
  const numCards = disabled ? 3 : count;
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        position: 'relative',
        width: 96,
        height: 134,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'transform 0.2s',
        ...style,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(1.05)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {[...Array(numCards)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: i * 3,
            left: i * 2,
            width: 96,
            height: 128,
            background: 'linear-gradient(145deg, #1a0a2e 0%, #2d1a4e 100%)',
            border: '2px solid #ffd700',
            boxShadow: '2px 2px 0 rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.15s',
          }}
        >
          {i === numCards - 1 && (
            <span style={{ fontSize: 24, color: '#ffd700' }}>✦</span>
          )}
        </div>
      ))}
      {!disabled && (
        <div style={{
          position: 'absolute',
          bottom: -20,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Press Start 2P'",
          fontSize: '7px',
          color: '#c5a3f5',
          whiteSpace: 'nowrap',
        }}>
          탭해서 뽑기
        </div>
      )}
    </div>
  );
}
