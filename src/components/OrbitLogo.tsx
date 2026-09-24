import React from 'react';

export const OrbitLogo: React.FC<{ size?: number; showText?: boolean }> = ({ size = 32, showText = true }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <img
        src="/orbit-logo.jpg"
        alt="Orbit"
        width={size}
        height={size}
        style={{
          borderRadius: `${size * 0.22}px`,
          objectFit: 'cover',
          flexShrink: 0,
          boxShadow: '0 0 12px rgba(23,182,200,0.35)',
        }}
      />
      {showText && (
        <span
          style={{
            fontWeight: 800,
            fontSize: size * 0.7,
            letterSpacing: '-0.5px',
            background: 'linear-gradient(135deg, #17b6c8, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textTransform: 'uppercase',
          }}
        >
          ORBIT
        </span>
      )}
    </div>
  );
};
