import React, { useState } from 'react';
import ChatBubble from '../components/ChatBubble';

export default function Scene4Analysis({ coreIssue, deeperHook, onNext }) {
  const lines = [
    '어때? 타로가 듣고 싶던 대답을 줬니?',
    '나랑 좀 더 이야기 나눠 볼래?',
    '아이라는 타로의 에너지를 읽고 네 마음을 들으면서 리딩을 해. 타로가 갖는 에너지와 네 마음 속의 이야기가 맞닿으면, 뭔가 보이기 시작할 거야.',
  ];

  const [lineIdx, setLineIdx] = useState(0);

  function handleBubbleDone() {
    if (lineIdx < lines.length - 1) {
      setTimeout(() => setLineIdx(l => l + 1), 700);
    }
  }

  function handleProceed() {
    onNext?.();
  }

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #0d0020 0%, #1a0a2e 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 24, padding: 24,
    }}>
      <ChatBubble
        key={lineIdx}
        text={lines[lineIdx]}
        speaker="witch"
        onDone={handleBubbleDone}
        style={{ maxWidth: 360, textAlign: 'left' }}
      />

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {lines.map((_, i) => (
          <div key={i} style={{
            width: 8, height: 8,
            background: i <= lineIdx ? '#ffd700' : 'rgba(255,215,0,0.2)',
            border: '1px solid #ffd700',
            transition: 'background 0.3s',
          }} />
        ))}
        {lineIdx >= lines.length - 1 && (
          <button
            className="pixel-btn gold"
            onClick={handleProceed}
            style={{ marginLeft: 12, fontSize: '11px', padding: '8px 16px' }}
          >
            다음 ▶
          </button>
        )}
      </div>
    </div>
  );
}
