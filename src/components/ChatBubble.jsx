import React, { useEffect, useState } from 'react';

// Typing effect chat bubble
export default function ChatBubble({ text, speaker = 'witch', onDone, autoType = true, style = {} }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) return;
    setDisplayed('');
    setDone(false);
    if (!autoType) {
      setDisplayed(text);
      setDone(true);
      onDone?.();
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
        onDone?.();
        return;
      }
      setDisplayed(text.slice(0, i + 1));
      i++;
    }, 40);
    return () => clearInterval(interval);
  }, [text]);

  const colors = {
    witch: { bg: 'rgba(45,26,78,0.95)', text: '#f0e6ff', border: '#9b4fc4' },
    child: { bg: 'rgba(255,255,255,0.95)', text: '#1a1a2e', border: '#3a7bd5' },
    system: { bg: 'rgba(255,253,231,0.97)', text: '#3d2a00', border: '#ffd700' },
  };

  const c = colors[speaker] || colors.witch;

  return (
    <div style={{
      position: 'relative',
      padding: '14px 18px',
      background: c.bg,
      border: `2px solid ${c.border}`,
      borderRadius: 0,
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '13px',
      lineHeight: '2',
      color: c.text,
      maxWidth: '560px',
      boxShadow: `4px 4px 0 rgba(0,0,0,0.3)`,
      imageRendering: 'pixelated',
      ...style,
    }}>
      {/* Pixel arrow — witch: bottom-right, child/system: bottom-left */}
      <div style={{
        position: 'absolute',
        bottom: -10,
        ...(speaker === 'witch' ? { right: 20 } : { left: 20 }),
        width: 0,
        height: 0,
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderTop: `10px solid ${c.border}`,
      }} />
      <div style={{
        position: 'absolute',
        bottom: -7,
        ...(speaker === 'witch' ? { right: 22 } : { left: 22 }),
        width: 0,
        height: 0,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderTop: `8px solid ${c.bg}`,
      }} />

      <span>{displayed}</span>
      {!done && <span className="typing-cursor" />}
    </div>
  );
}
