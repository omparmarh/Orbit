import React, { useState } from 'react';
import { useOrbit } from '../context/OrbitContext';
import { X, Trophy, UploadCloud, Video, CheckCircle2 } from 'lucide-react';
import type { OrbitItem } from '../types/orbit';

interface SubmitChallengeModalProps {
  item: OrbitItem;
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitChallengeModal: React.FC<SubmitChallengeModalProps> = ({ item, isOpen, onClose }) => {
  const { submitChallenge } = useOrbit();
  const [contentUrl, setContentUrl] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !item.challenge) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitChallenge(item.id, {
      contentUrl: contentUrl.trim() || undefined,
      note: note.trim() || undefined
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(19, 34, 56, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        className="orbit-card"
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: 'var(--color-surface-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 156, 74, 0.15)',
                color: 'var(--color-signal-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Trophy size={18} />
            </span>
            <div>
              <h3 style={{ fontSize: '17px', color: 'var(--color-ink)' }}>Submit Challenge Entry</h3>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                {item.challenge.title}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '32px 16px' }}>
            <CheckCircle2 size={48} color="#22C55E" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '18px', color: 'var(--color-ink)', marginBottom: '4px' }}>
              Entry Submitted!
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              Your submission is now live for circle voting. Keep the streak alive!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Rules reminder */}
            {item.challenge.rules && item.challenge.rules.length > 0 && (
              <div style={{ backgroundColor: 'var(--color-surface)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
                  Challenge Rules
                </span>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                  {item.challenge.rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Your Clip URL (TikTok, Instagram, YouTube Shorts, or link)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="url"
                  placeholder="https://..."
                  value={contentUrl}
                  onChange={e => setContentUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                    fontSize: '13px'
                  }}
                />
                <Video size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Add your Notes or Take
              </label>
              <textarea
                rows={3}
                placeholder="Share your method, recipe, or reasoning behind this entry..."
                value={note}
                onChange={e => setNote(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  fontSize: '13px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={{ flex: 2, justifyContent: 'center', backgroundColor: 'var(--color-signal-orange)', borderColor: 'var(--color-signal-orange)' }}
              >
                <UploadCloud size={16} /> Submit Entry
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
