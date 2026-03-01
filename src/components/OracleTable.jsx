import React from 'react';

/**
 * Arcana Village inspired oracle table - Zelda + mystical oracle aesthetic
 * Deep violet velvet cloth with gold trim, rune ornaments
 */
export default function OracleTable({ children, style = {} }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 600,
        minHeight: 240,
        /* Deep violet velvet cloth - Arcana Village oracle table */
        background: `
          radial-gradient(ellipse at 50% 0%, rgba(140, 80, 220, 0.18) 0%, transparent 55%),
          radial-gradient(ellipse at 50% 100%, rgba(80, 20, 120, 0.2) 0%, transparent 55%),
          repeating-linear-gradient(
            90deg,
            #2a1848 0px,
            #311a50 1px,
            #2a1848 2px,
            #221440 3px
          )
        `,
        border: '3px solid #c8a030',
        borderRadius: 10,
        boxShadow: `
          inset 0 2px 12px rgba(160, 100, 255, 0.1),
          inset 0 -3px 12px rgba(0, 0, 0, 0.5),
          0 0 0 1px rgba(200, 160, 48, 0.3),
          0 14px 40px rgba(0, 0, 0, 0.65),
          0 0 36px rgba(100, 40, 180, 0.18)
        `,
        padding: '28px 24px',
        imageRendering: 'pixelated',
        ...style,
      }}
    >
      {/* Top shimmer line */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, transparent 0%, rgba(200, 160, 48, 0.7) 50%, transparent 100%)',
        borderRadius: '10px 10px 0 0',
        pointerEvents: 'none',
      }} />
      {/* Bottom shimmer line */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(200, 160, 48, 0.3) 50%, transparent 100%)',
        borderRadius: '0 0 10px 10px',
        pointerEvents: 'none',
      }} />
      {/* Inner border glow */}
      <div style={{
        position: 'absolute',
        inset: 5,
        border: '1px solid rgba(160, 100, 255, 0.15)',
        borderRadius: 6,
        pointerEvents: 'none',
      }} />

      {/* Corner star ornaments */}
      {[
        { top: -6, left: -6 },
        { top: -6, right: -6 },
        { bottom: -6, left: -6 },
        { bottom: -6, right: -6 },
      ].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute', ...pos,
          width: 14, height: 14,
          background: '#c8a030',
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          opacity: 0.9,
          filter: 'drop-shadow(0 0 3px rgba(200,160,48,0.5))',
        }} />
      ))}

      {/* Side rune marks */}
      <div style={{
        position: 'absolute', top: '50%', left: 9, transform: 'translateY(-50%)',
        fontSize: '11px', color: 'rgba(200,160,48,0.45)',
        fontFamily: 'serif', lineHeight: 1, userSelect: 'none',
      }}>✦</div>
      <div style={{
        position: 'absolute', top: '50%', right: 9, transform: 'translateY(-50%)',
        fontSize: '11px', color: 'rgba(200,160,48,0.45)',
        fontFamily: 'serif', lineHeight: 1, userSelect: 'none',
      }}>✦</div>

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
            background: `linear-gradient(135deg, #1a0f30 0%, #2a1848 50%, #1a0f30 100%)`,
            border: '2px solid #c8a030',
            borderRadius: '4px',
            boxShadow: `
              2px 4px 0 rgba(0, 0, 0, 0.4),
              inset 0 1px 2px rgba(200, 160, 48, 0.12),
              0 0 8px rgba(200, 160, 48, 0.18)
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
              color: '#c8a030',
              filter: 'drop-shadow(0 0 5px rgba(200, 160, 48, 0.5))',
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
          color: '#e8c060',
          whiteSpace: 'nowrap',
          letterSpacing: '0.05em',
          textShadow: '0 0 6px rgba(200, 160, 48, 0.4)',
        }}>
          탭해서 뽑기
        </div>
      )}
    </div>
  );
}
