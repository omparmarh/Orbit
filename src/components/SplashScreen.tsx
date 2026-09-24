import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'intro' | 'logo' | 'text' | 'exit'>('intro');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('logo'), 200);
    const t2 = setTimeout(() => setPhase('text'), 900);
    const t3 = setTimeout(() => setPhase('exit'), 2600);
    const t4 = setTimeout(() => onComplete(), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#070d1a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        opacity: phase === 'exit' ? 0 : 1,
        transition: 'opacity 0.6s ease',
      }}
    >
      {/* Animated background glow */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(23,182,200,0.12) 0%, transparent 70%)',
        animation: 'pulse-glow 2s ease-in-out infinite',
      }} />

      {/* Orbit rings animation */}
      <div style={{
        position: 'relative',
        width: '160px',
        height: '160px',
        transform: phase === 'logo' || phase === 'text' || phase === 'exit' ? 'scale(1)' : 'scale(0.3)',
        opacity: phase === 'intro' ? 0 : 1,
        transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease',
        marginBottom: '32px',
      }}>
        {/* Logo image */}
        <img
          src="/orbit-logo.jpg"
          alt="Orbit"
          style={{ width: '160px', height: '160px', borderRadius: '36px', objectFit: 'cover', boxShadow: '0 0 60px rgba(23,182,200,0.5)' }}
        />
        {/* Spinning ring */}
        <div style={{
          position: 'absolute',
          inset: '-20px',
          borderRadius: '50%',
          border: '2px solid transparent',
          borderTop: '2px solid rgba(23,182,200,0.7)',
          borderRight: '2px solid rgba(23,182,200,0.3)',
          animation: 'spin 1.5s linear infinite',
        }} />
        <div style={{
          position: 'absolute',
          inset: '-36px',
          borderRadius: '50%',
          border: '1.5px solid transparent',
          borderBottom: '1.5px solid rgba(99,102,241,0.6)',
          borderLeft: '1.5px solid rgba(99,102,241,0.2)',
          animation: 'spin-reverse 2s linear infinite',
        }} />
      </div>

      {/* Text */}
      <div style={{
        textAlign: 'center',
        opacity: phase === 'text' || phase === 'exit' ? 1 : 0,
        transform: phase === 'text' || phase === 'exit' ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}>
        <h1 style={{
          fontSize: '42px',
          fontWeight: 800,
          letterSpacing: '-1px',
          background: 'linear-gradient(135deg, #17b6c8 0%, #a78bfa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '8px',
        }}>
          Orbit
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          Your social universe
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          to { transform: rotate(-360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
