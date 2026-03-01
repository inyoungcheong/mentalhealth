import React from 'react';

/**
 * Arcana Valley inspired oracle table - beautiful and sophisticated
 * Warm earth tones with mystical accents
 */
export default function OracleTable({ children, style = {} }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 600,
        minHeight: 240,
        background: `
          repeating-linear-gradient(
            90deg,
            #5a4a38 0px,
            #6b5a48 1px,
            #5a4a38 2px,
            #4a3a28 3px
          )
        `,
        border: '4px solid #d4a574',
        borderRadius: 8,
        boxShadow: `
          inset 0 2px 8px rgba(212, 165, 116, 0.15),
          inset 0 -2px 8px rgba(0, 0, 0, 0.4),
          0 12px 32px rgba(0, 0, 0, 0.5),
          0 0 24px rgba(212, 165, 116, 0.1)
        `,
        padding: '28px 24px',
        imageRendering: 'pixelated',
        ...style,
      }}
    >
      {/* Decorative top border */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, transparent 0%, rgba(212, 165, 116, 0.4) 50%, transparent 100%)',
        borderRadius: '8px 8px 0 0',
        pointerEvents: 'none',
      }} />
      
      {/* Corner ornaments */}
      <div style={{
        position: 'absolute',
        top: -4, left: -4,
        width: 12, height: 12,
        border: '2px solid #d4a574',
        borderRadius: '50%',
        opacity: 0.6,
      }} />
      <div style={{
        position: 'absolute',
        top: -4, right: -4,
        width: 12, height: 12,
        border: '2px solid #d4a574',
        borderRadius: '50%',
        opacity: 0.6,
      }} />
      <div style={{
        position: 'absolute',
        bottom: -4, left: -4,
        width: 12, height: 12,
        border: '2px solid #d4a574',
        borderRadius: '50%',
        opacity: 0.6,
      }} />
      <div style={{
        position: 'absolute',
        bottom: -4, right: -4,
        width: 12, height: 12,
        border: '2px solid #d4a574',
        borderRadius: '50%',
        opacity: 0.6,
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
        width: 110,
        height: 150,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        ...style,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(1.08) translateY(-4px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {[...Array(numCards)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: i * 4,
            left: i * 3,
            width: 110,
            height: 145,
            background: `linear-gradient(135deg, #1a1428 0%, #2a1f3d 50%, #1a1428 100%)`,
            border: '2px solid #d4a574',
            borderRadius: '4px',
            boxShadow: `
              2px 4px 0 rgba(0, 0, 0, 0.4),
              inset 0 1px 2px rgba(212, 165, 116, 0.1),
              0 0 8px rgba(212, 165, 116, 0.15)
            `,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.15s, box-shadow 0.2s',
          }}
        >
          {i === numCards - 1 && (
            <span style={{ 
              fontSize: 28, 
              color: '#d4a574',
              filter: 'drop-shadow(0 0 4px rgba(212, 165, 116, 0.4))',
              animation: 'glow-pulse 2s ease-in-out infinite',
            }}>✦</span>
          )}
        </div>
      ))}
      {!disabled && (
        <div style={{
          position: 'absolute',
          bottom: -28,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Outfit', sans-serif",
          fontSize: '14px',
          fontWeight: 600,
          color: '#c8927a',
          whiteSpace: 'nowrap',
          letterSpacing: '0.05em',
          textShadow: '0 0 4px rgba(200, 146, 122, 0.3)',
        }}>
          탭해서 뽑기
        </div>
      )}
    </div>
  );
}
