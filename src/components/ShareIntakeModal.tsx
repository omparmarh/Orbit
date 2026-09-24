import React, { useState } from 'react';
import { useOrbit } from '../context/OrbitContext';
import { X, Sparkles, ShieldCheck } from 'lucide-react';
import { PollCreator } from './PollCreator';
import type { PollData } from './PollCreator';
import { ChallengeCreator } from './ChallengeCreator';
import type { ChallengeData } from './ChallengeCreator';
import type { OrbitItem, RightsStatus } from '../types/orbit';

export const ShareIntakeModal: React.FC = () => {
  const { isIntakeOpen, setIsIntakeOpen, circles, addItem, currentUser } = useOrbit();
  
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedCircleId, setSelectedCircleId] = useState(circles[0]?.id || '');
  const [reasonTag, setReasonTag] = useState<'Must Watch' | 'Try This' | 'Debate' | 'Weekend Idea' | 'Recipe' | 'Memory'>('Must Watch');
  const [kind, setKind] = useState<'link' | 'poll' | 'challenge' | 'original'>('link');
  
  // Simulated intake resolving state
  const [isResolving, setIsResolving] = useState(false);
  const [resolvedMetadata, setResolvedMetadata] = useState<{
    sourcePlatform: 'Instagram' | 'TikTok' | 'YouTube' | 'Other';
    thumbnailUrl: string;
    rightsStatus: RightsStatus;
  } | null>(null);

  // Poll & Challenge state
  const [pollData, setPollData] = useState<PollData>({
    question: '',
    options: ['', ''],
  });
  const [challengeData, setChallengeData] = useState<ChallengeData>({
    title: '',
    description: '',
    type: 'try_it',
    rules: ['Share your result'],
    closesAt: '',
  });

  if (!isIntakeOpen) return null;

  const handleResolveUrl = () => {
    if (!url.trim()) return;
    setIsResolving(true);
    
    setTimeout(() => {
      let platform: 'Instagram' | 'TikTok' | 'YouTube' | 'Other' = 'Other';
      if (url.includes('instagram.com')) platform = 'Instagram';
      else if (url.includes('tiktok.com')) platform = 'TikTok';
      else if (url.includes('youtube.com') || url.includes('youtu.be')) platform = 'YouTube';

      setResolvedMetadata({
        sourcePlatform: platform,
        thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        rightsStatus: 'LINK_ONLY'
      });
      if (!title) setTitle(platform === 'Instagram' ? 'Viral Short Reel Idea' : 'Shared Video Item');
      setIsResolving(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCircle = circles.find(c => c.id === selectedCircleId);

    const newItem: OrbitItem = {
      id: `item_${Date.now()}`,
      creator: currentUser,
      kind: kind,
      sourceUrl: url || undefined,
      sourcePlatform: resolvedMetadata?.sourcePlatform || 'Original',
      title: kind === 'challenge' ? (challengeData.title || title || 'New Challenge') : (title || 'Shared Content Item'),
      caption: caption,
      reasonTag: reasonTag,
      thumbnailUrl: resolvedMetadata?.thumbnailUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      visibility: 'circle',
      circleId: selectedCircleId,
      circleName: selectedCircle?.name || 'General Circle',
      rightsStatus: resolvedMetadata?.rightsStatus || 'USER_LICENSED',
      createdAt: new Date().toISOString(),
      commentsCount: 0,
      reactionsCount: 1,
      // Attach poll data if poll kind
      ...(kind === 'poll' && pollData.question ? {
        poll: {
          id: `poll_${Date.now()}`,
          question: pollData.question,
          options: pollData.options.filter(o => o.trim()).map((text, i) => ({
            id: `opt_${i}`,
            text,
            votes: 0,
            votedUserIds: [],
          })),
          totalVotes: 0,
          closesAt: pollData.closesAt || undefined,
        }
      } : {}),
      // Attach challenge data if challenge kind
      ...(kind === 'challenge' && challengeData.title ? {
        challenge: {
          id: `ch_${Date.now()}`,
          title: challengeData.title,
          description: challengeData.description,
          type: challengeData.type,
          rules: challengeData.rules.filter(r => r.trim()),
          closesAt: challengeData.closesAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          submissions: [],
        }
      } : {}),
    };

    addItem(newItem);
    setIsIntakeOpen(false);
    // Reset form
    setUrl('');
    setTitle('');
    setCaption('');
    setResolvedMetadata(null);
    setPollData({ question: '', options: ['', ''] });
    setChallengeData({ title: '', description: '', type: 'try_it', rules: ['Share your result'], closesAt: '' });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(19, 34, 56, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
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
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: 'var(--color-surface-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="var(--color-action-blue)" />
              Share to Orbit
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Turn external short video links into group discussions & activities
            </p>
          </div>
          <button onClick={() => setIsIntakeOpen(false)} style={{ color: 'var(--color-text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Responsible retention reminder note */}
        <div
          style={{
            backgroundColor: 'var(--color-action-blue-light)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: 'var(--color-action-blue)'
          }}
        >
          <ShieldCheck size={18} />
          <span>Orbit respects platform terms. External links preserve source attribution & link back.</span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Content Kind tabs */}
          <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--color-surface)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
            {(['link', 'poll', 'challenge', 'original'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setKind(t)}
                style={{
                  flex: 1,
                  padding: '6px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  backgroundColor: kind === t ? 'var(--color-surface-card)' : 'transparent',
                  color: kind === t ? 'var(--color-action-blue)' : 'var(--color-text-secondary)',
                  boxShadow: kind === t ? 'var(--shadow-sm)' : 'none'
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* URL input for Link intake */}
          {kind === 'link' && (
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Paste Instagram, TikTok or YouTube Link
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="url"
                  placeholder="https://www.instagram.com/reel/..."
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleResolveUrl}
                  disabled={isResolving || !url.trim()}
                >
                  {isResolving ? 'Resolving...' : 'Check Link'}
                </button>
              </div>
            </div>
          )}

          {/* Resolved metadata card */}
          {resolvedMetadata && kind === 'link' && (
            <div
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                backgroundColor: 'var(--color-surface)'
              }}
            >
              <img
                src={resolvedMetadata.thumbnailUrl}
                alt="Thumbnail"
                style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
              />
              <div>
                <span className="badge badge-blue">{resolvedMetadata.sourcePlatform}</span>
                <span className="badge badge-mint" style={{ marginLeft: '6px' }}>
                  {resolvedMetadata.rightsStatus}
                </span>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  Metadata resolved safely with source attribution intact.
                </p>
              </div>
            </div>
          )}

          {/* Poll Creator Widget */}
          {kind === 'poll' && (
            <PollCreator value={pollData} onChange={setPollData} />
          )}

          {/* Challenge Creator Widget */}
          {kind === 'challenge' && (
            <ChallengeCreator value={challengeData} onChange={setChallengeData} />
          )}

          {/* Common fields: Title, Caption, Reason Tag, Circle */}
          {kind !== 'poll' && kind !== 'challenge' && (
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Title / Prompt
              </label>
              <input
                type="text"
                placeholder="What is this item about?"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Note / Context for your friends
            </label>
            <textarea
              rows={2}
              placeholder="Add your thoughts or a question to kick off conversation..."
              value={caption}
              onChange={e => setCaption(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Reason Tag
              </label>
              <select
                value={reasonTag}
                onChange={e => setReasonTag(e.target.value as any)}
                style={{ width: '100%' }}
              >
                <option value="Must Watch">Must Watch ⚡</option>
                <option value="Try This">Try This 🎯</option>
                <option value="Debate">Debate 🔥</option>
                <option value="Weekend Idea">Weekend Idea 💡</option>
                <option value="Recipe">Recipe 🍳</option>
                <option value="Memory">Memory 📸</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Share to Circle
              </label>
              <select
                value={selectedCircleId}
                onChange={e => setSelectedCircleId(e.target.value)}
                style={{ width: '100%' }}
              >
                {circles.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsIntakeOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Publish to Orbit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
