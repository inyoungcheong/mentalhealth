import React, { useState } from 'react';
import '../styles/pixelart.css';

function getCardImageUrl(card) {
  if (!card) return null;
  const suitMap = { cups: 'cups', wands: 'wands', swords: 'swords', pentacles: 'pents' };
  if (card.suit === 'major') {
    return `/cards/maj${String(card.id).padStart(2, '0')}.jpg`;
  }
  const prefix = suitMap[card.suit];
  if (!prefix) return null;
  return `/cards/${prefix}${String(card.number).padStart(2, '0')}.jpg`;
}

export default function TarotCard({ card, faceDown = true, size = 'md', onClick, glowing = false }) {
  const [flipped, setFlipped] = useState(!faceDown);
  const [flipping, setFlipping] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const sizes = {
    sm: { w: 72, h: 120, fs: '7px', namePad: '3px 4px' },
    md: { w: 96, h: 160, fs: '8px', namePad: '5px 5px' },
    lg: { w: 120, h: 200, fs: '9px', namePad: '6px 6px' },
  };
  const { w, h, fs, namePad } = sizes[size] || sizes.md;

  const imgUrl = getCardImageUrl(card);

  function handleClick() {
    if (!faceDown || flipped) { onClick?.(); return; }
    setFlipping(true);
    setTimeout(() => {
      setFlipped(true);
      setFlipping(false);
      onClick?.();
    }, 300);
  }

  const isFaceUp = flipped && !faceDown && card;

  return (
    <div
      onClick={handleClick}
      className={flipping ? 'card-flip' : ''}
      style={{
        width: w,
        height: h,
        cursor: 'pointer',
        position: 'relative',
        imageRendering: 'pixelated',
        border: glowing ? '2px solid #ffd700' : '2px solid #3d2a00',
        boxShadow: glowing
          ? '0 0 12px #ffd700, 4px 4px 0 rgba(0,0,0,0.4)'
          : '4px 4px 0 rgba(0,0,0,0.4)',
        transition: 'box-shadow 0.3s',
        userSelect: 'none',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Card Back */}
      {(!isFaceUp) && (
        <div style={{
          width: '100%', height: '100%',
          background: '#1a0a2e',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 6,
        }}>
          <div style={{
            position: 'absolute', inset: 4,
            border: '1px solid #ffd700',
            pointerEvents: 'none',
          }} />
          <div style={{ fontSize: 20, color: '#ffd700' }}>✦</div>
          <div style={{ fontSize: '6px', color: '#9b4fc4', fontFamily: "'Press Start 2P'" }}>
            TAROT
          </div>
        </div>
      )}

      {/* Card Face — image */}
      {isFaceUp && imgUrl && !imgFailed && (
        <div style={{ width: '100%', height: '100%', position: 'relative', background: '#1a0a2e' }}>
          <img
            src={imgUrl}
            alt={card.korName}
            onError={() => setImgFailed(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transform: card.isReversed ? 'rotate(180deg)' : 'none',
            }}
          />
          {/* Name overlay at bottom */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
            padding: namePad,
            paddingTop: '14px',
            fontFamily: "'Press Start 2P'",
            fontSize: fs,
            color: '#ffd700',
            textAlign: 'center',
            lineHeight: 1.5,
            wordBreak: 'keep-all',
          }}>
            {card.korName}
          </div>
          {/* Reversed indicator */}
          {card.isReversed && (
            <div style={{
              position: 'absolute', top: 3, left: 0, right: 0,
              fontFamily: "'Press Start 2P'", fontSize: '5px',
              color: '#ff8c8c', textAlign: 'center',
            }}>역</div>
          )}
        </div>
      )}

      {/* Card Face — fallback (no image or load error) */}
      {isFaceUp && (imgFailed || !imgUrl) && (
        <FallbackCardFace card={card} w={w} h={h} fs={fs} />
      )}
    </div>
  );
}

function FallbackCardFace({ card, fs }) {
  const SUIT_SYMBOLS = { major: '★', wands: '🔥', cups: '💧', swords: '⚔', pentacles: '⬡' };
  const SUIT_COLORS = {
    major:     { bg: '#1a0a2e', accent: '#ffd700', text: '#f0e6ff' },
    wands:     { bg: '#3d1a00', accent: '#ff8c00', text: '#fff3e0' },
    cups:      { bg: '#001a3d', accent: '#64b5f6', text: '#e3f2fd' },
    swords:    { bg: '#1a1a2e', accent: '#b0bec5', text: '#eceff1' },
    pentacles: { bg: '#0d2a1a', accent: '#66bb6a', text: '#e8f5e9' },
  };
  const colors = SUIT_COLORS[card.suit] || SUIT_COLORS.major;
  return (
    <div style={{
      width: '100%', height: '100%',
      background: colors.bg,
      display: 'flex', flexDirection: 'column',
      padding: '6px 4px',
      transform: card.isReversed ? 'rotate(180deg)' : 'none',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: '6px', color: colors.accent,
        fontFamily: "'Press Start 2P'", marginBottom: 4,
      }}>
        <span>{card.number !== undefined ? card.number : ''}</span>
        <span>{SUIT_SYMBOLS[card.suit]}</span>
      </div>
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
      }}>
        {SUIT_SYMBOLS[card.suit]}
      </div>
      <div style={{
        fontSize: fs, color: colors.text,
        fontFamily: "'Press Start 2P'",
        textAlign: 'center', lineHeight: 1.5, wordBreak: 'break-word',
      }}>
        {card.korName}
      </div>
    </div>
  );
}

// Deck of stacked cards for visual effect
export function CardDeck({ count = 5, onDraw }) {
  return (
    <div style={{ position: 'relative', width: 96, height: 170 }} onClick={onDraw}>
      {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: i * 2, left: i * 2,
          width: 96, height: 160,
          background: '#1a0a2e',
          border: '2px solid #ffd700',
          boxShadow: '2px 2px 0 rgba(0,0,0,0.4)',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 4, border: '1px solid #ffd700' }} />
          {i === count - 1 && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, color: '#ffd700',
            }}>✦</div>
          )}
        </div>
      ))}
    </div>
  );
}
