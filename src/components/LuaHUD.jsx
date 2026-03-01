import React from 'react';

export default function LuaHUD({ luaBalance }) {
  if (luaBalance === null || luaBalance === undefined) return null;
  const isEmpty = luaBalance === 0;
  return (
    <div style={{
      position: 'absolute', top: 8, right: 10, zIndex: 100,
      fontFamily: "'Press Start 2P', monospace", fontSize: '9px',
      color: isEmpty ? '#ff6b6b' : '#ffd700',
      background: 'rgba(0,0,20,0.7)',
      padding: '5px 10px',
      border: `1px solid ${isEmpty ? '#ff6b6b44' : '#ffd70033'}`,
      pointerEvents: 'none',
      letterSpacing: 1,
    }}>
      ♦ {luaBalance} 루나
    </div>
  );
}
