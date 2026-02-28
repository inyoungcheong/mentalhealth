import React, { useState, useEffect } from 'react';
import { generateHexagram, getLineSymbol } from '../data/iching';

// I Ching coin toss visualization
export default function DiceRoll({ onComplete }) {
  const [phase, setPhase] = useState('idle'); // idle | rolling | done
  const [currentLine, setCurrentLine] = useState(0);
  const [lines, setLines] = useState([]);
  const [result, setResult] = useState(null);
  const [coinFaces, setCoinFaces] = useState([null, null, null]);

  function startRoll() {
    if (phase !== 'idle') return;
    setPhase('rolling');
    setLines([]);
    setCurrentLine(0);
    rollNextLine(0, []);
  }

  function rollNextLine(lineIdx, prevLines) {
    if (lineIdx >= 6) {
      // All lines done
      const hexData = generateHexagram();
      // Use the lines we generated
      const finalResult = {
        ...hexData,
        lines: prevLines,
      };
      setResult(finalResult);
      setPhase('done');
      setTimeout(() => onComplete?.(finalResult), 800);
      return;
    }

    // Animate coin flip
    let count = 0;
    const coinInterval = setInterval(() => {
      setCoinFaces([
        Math.random() < 0.5 ? 'H' : 'T',
        Math.random() < 0.5 ? 'H' : 'T',
        Math.random() < 0.5 ? 'H' : 'T',
      ]);
      count++;
      if (count > 8) {
        clearInterval(coinInterval);
        const c1 = Math.random() < 0.5 ? 3 : 2;
        const c2 = Math.random() < 0.5 ? 3 : 2;
        const c3 = Math.random() < 0.5 ? 3 : 2;
        const sum = c1 + c2 + c3;
        const newCoins = [c1 === 3 ? 'H' : 'T', c2 === 3 ? 'H' : 'T', c3 === 3 ? 'H' : 'T'];
        setCoinFaces(newCoins);
        const newLines = [...prevLines, sum];
        setLines(newLines);
        setCurrentLine(lineIdx + 1);
        setTimeout(() => rollNextLine(lineIdx + 1, newLines), 500);
      }
    }, 80);
  }

  const lineDisplay = lines.slice().reverse(); // I Ching shows bottom-up, we show top-down

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      fontFamily: "'Press Start 2P', monospace",
      color: '#1a0a2e',
    }}>
      {/* Coins */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
        {coinFaces.map((face, i) => (
          <div key={i} style={{
            width: 36, height: 36,
            background: phase === 'rolling' ? '#f0c040' : '#ffd700',
            border: '2px solid #b8860b',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px',
            fontFamily: "'Press Start 2P'",
            color: '#3d2a00',
            boxShadow: '2px 2px 0 #8b6914',
            transition: 'background 0.1s',
            imageRendering: 'pixelated',
          }}>
            {face || '?'}
          </div>
        ))}
      </div>

      {/* Hexagram lines (displayed as they're rolled) */}
      <div style={{
        background: '#f9f5ff', border: '2px solid #6b2d8b',
        padding: '10px 16px', minWidth: 160, minHeight: 120,
        display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4,
      }}>
        {phase === 'idle' && (
          <div style={{ fontSize: '8px', color: '#888', textAlign: 'center' }}>
            동전 3개 × 6회
          </div>
        )}
        {lineDisplay.map((line, i) => (
          <div key={i} style={{
            fontSize: '10px', color: (line === 6 || line === 9) ? '#c84040' : '#1a0a2e',
            letterSpacing: 2, textAlign: 'center',
          }}>
            {getLineSymbol(line)}
            {(line === 6 || line === 9) && <span style={{ color: '#c84040', fontSize: '7px', marginLeft: 4 }}>변</span>}
          </div>
        ))}
        {phase === 'rolling' && currentLine < 6 && (
          <div style={{ fontSize: '8px', color: '#6b2d8b', textAlign: 'center', marginTop: 4 }}>
            {currentLine + 1}번째 효...
          </div>
        )}
      </div>

      {/* Result */}
      {result && phase === 'done' && (
        <div style={{
          fontSize: '8px', textAlign: 'center', color: '#2d1a4e',
          padding: '8px', background: '#ede7f6', border: '1px solid #9b4fc4',
          maxWidth: 200,
        }}>
          <div style={{ color: '#6b2d8b', marginBottom: 4 }}>
            {result.hexagram.chinese} {result.hexagram.korName}
          </div>
          <div style={{ fontSize: '7px', lineHeight: 1.8, color: '#444' }}>
            {result.hexagram.description}
          </div>
        </div>
      )}

      {/* Button */}
      {phase === 'idle' && (
        <button className="pixel-btn" onClick={startRoll} style={{ marginTop: 4 }}>
          ▶ 주사위 던지기
        </button>
      )}
      {phase === 'rolling' && (
        <div style={{ fontSize: '8px', color: '#6b2d8b' }}>
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
        </div>
      )}
    </div>
  );
}
