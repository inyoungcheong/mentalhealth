import React, { useState } from 'react';
import { throwCoins, getLineSymbol, hexagramFromLines } from '../data/iching';
import { playCoinToss } from '../utils/sound';

/**
 * I Ching coin toss - 3 coins × 6 throws.
 * User taps to roll each line. Returns { hexagram, lines } on complete.
 */
export default function CoinToss({ onComplete, disabled }) {
  const [lines, setLines] = useState([]);
  const [rolling, setRolling] = useState(false);
  const [coinDisplay, setCoinDisplay] = useState([null, null, null]);

  const isDone = lines.length >= 6;

  async function rollNext() {
    if (lines.length >= 6 || rolling || disabled) return;
    playCoinToss();
    setRolling(true);

    // Animate coins flipping
    for (let i = 0; i < 6; i++) {
      setCoinDisplay([
        Math.random() < 0.5 ? 'H' : 'T',
        Math.random() < 0.5 ? 'H' : 'T',
        Math.random() < 0.5 ? 'H' : 'T',
      ]);
      await new Promise(r => setTimeout(r, 60));
    }

    const lineValue = throwCoins();
    const newLines = [...lines, lineValue];
    setLines(newLines);
    setRolling(false);

    if (newLines.length >= 6) {
      const result = hexagramFromLines(newLines);
      setTimeout(() => onComplete?.(result), 600);
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
    }}>
      {/* 3 coins */}
      <div
        onClick={isDone || rolling || disabled ? undefined : rollNext}
        style={{
          display: 'flex',
          gap: 8,
          cursor: isDone || rolling || disabled ? 'default' : 'pointer',
          padding: 8,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={rolling ? 'dice-shake' : ''}
            style={{
              width: 32,
              height: 32,
              background: rolling ? '#e8c040' : '#ffd700',
              border: '2px solid #b8860b',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontFamily: "'Press Start 2P'",
              color: '#3d2a00',
              boxShadow: '2px 2px 0 #8b6914',
              imageRendering: 'pixelated',
            }}
          >
            {coinDisplay[i] ?? '?'}
          </div>
        ))}
      </div>

      {/* Progress: 6 lines */}
      <div style={{
        background: 'rgba(26,10,46,0.6)',
        border: '1px solid #6b2d8b',
        padding: '8px 12px',
        minWidth: 120,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}>
        {lines.length === 0 && !rolling && (
          <div style={{ fontSize: '7px', color: '#9b4fc4', textAlign: 'center' }}>
            탭해서 던지기
          </div>
        )}
        {lines.slice().reverse().map((line, i) => (
          <div
            key={i}
            style={{
              fontSize: '8px',
              color: (line === 6 || line === 9) ? '#ffd700' : '#c5a3f5',
              letterSpacing: 1,
              textAlign: 'center',
            }}
          >
            {getLineSymbol(line)}
          </div>
        ))}
        {lines.length > 0 && lines.length < 6 && !rolling && (
          <div style={{ fontSize: '6px', color: '#6b2d8b', textAlign: 'center' }}>
            {6 - lines.length}번 더
          </div>
        )}
      </div>

      {isDone && (
        <div style={{ fontSize: '6px', color: '#5a9e3a' }}>
          ✓ 완료
        </div>
      )}
    </div>
  );
}
