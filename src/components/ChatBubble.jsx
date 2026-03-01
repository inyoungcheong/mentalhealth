import React, { useEffect, useState } from 'react';

// Typing effect chat bubble with Arcana Valley aesthetic
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
    witch: { bg: 'rgba(26, 20, 40, 0.96)', text: '#e8d5c4', border: '#c8927a' },
    child: { bg: 'rgba(42, 31, 61, 0.96)', text: '#e8d5c4', border: '#7a9b8e' },
    system: { bg: 'rgba(212, 165, 116, 0.12)', text: '#d4a574', border: '#d4a574' },
  };

  const c = colors[speaker] || colors.witch;

  return (
    <div style={{
      position: 'relative',
      padding: '18px 22px',
      background: c.bg,
      border: `2px solid ${c.border}`,
      borderRadius: 6,
      fontFamily: "'Outfit', sans-serif",
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: '1.8',
      letterSpacing: '0.01em',
      color: c.text,
      maxWidth: '600px',
      boxShadow: `0 8px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(212, 165, 116, 0.1)`,
      imageRendering: 'pixelated',
      ...style,
    }}>
      {/* Smooth arrow pointer */}
      <div style={{
        position: 'absolute',
        bottom: -12,
        ...(speaker === 'witch' ? { right: 24 } : { left: 24 }),
        width: 0,
        height: 0,
        borderLeft: '10px solid transparent',
        borderRight: '10px solid transparent',
        borderTop: `12px solid ${c.border}`,
      }} />
      <div style={{
        position: 'absolute',
        bottom: -9,
        ...(speaker === 'witch' ? { right: 26 } : { left: 26 }),
        width: 0,
        height: 0,
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderTop: `10px solid ${c.bg}`,
      }} />

      <span>{displayed}</span>
      {!done && <span className="typing-cursor" />}
    </div>
  );
}
