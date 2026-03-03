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
    <div style={{ position: 'relative', width: 64, height: 64, imageRendering: 'pixelated', ...style }}>
      <img 
        src="/intro/gray_new.png" 
        alt="Gray" 
        style={{ width: '100%', height: '100%', display: 'block' }} 
      />
    </div>
  );
}

export function ChibiGraySprite() {
  return (
    <div style={{ position: 'relative', width: 32, height: 32, imageRendering: 'pixelated' }}>
      <img 
        src="/intro/gray_new.png" 
        alt="Gray Chibi" 
        style={{ width: '100%', height: '100%', display: 'block' }} 
      />
    </div>
  );
}
