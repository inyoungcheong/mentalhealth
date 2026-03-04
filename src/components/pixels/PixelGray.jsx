import React from 'react';
import '../../styles/pixelart.css';

export default function PixelGray({ style = {} }) {
  return (
    <div style={{
      imageRendering: 'pixelated',
      display: 'inline-block',
      ...style,
    }}>
      <GraySprite />
    </div>
  );
}

export function GraySprite({ style = {} }) {
  return (
    <div style={{ position: 'relative', width: 80, height: 80, imageRendering: 'pixelated', ...style }}>
      <img 
        src="/intro/gray_dot_v4.png" 
        alt="Gray" 
        style={{ width: '100%', height: '100%', display: 'block' }} 
      />
    </div>
  );
}

export function ChibiGraySprite() {
  return (
    <div style={{ position: 'relative', width: 56, height: 56, imageRendering: 'pixelated' }}>
      <img 
        src="/intro/gray_dot_v4.png" 
        alt="Gray Chibi" 
        style={{ width: '100%', height: '100%', display: 'block' }} 
      />
    </div>
  );
}
