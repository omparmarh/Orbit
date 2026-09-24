import React, { useState } from 'react';
import { useOrbit } from '../context/OrbitContext';
import { X, ExternalLink, MessageSquare, ShieldAlert, Send, Bookmark, Trophy } from 'lucide-react';
import type { OrbitItem, Comment } from '../types/orbit';
import { SubmitChallengeModal } from './SubmitChallengeModal';

export const ItemDetailModal: React.FC<{ item: OrbitItem; onClose: () => void }> = ({ item, onClose }) => {
  const { reactToItem, addComment, setSelectedRoomId, currentUser, savedItemIds, toggleBookmark } = useOrbit();
  
  const [commentText, setCommentText] = useState('');
  const [isSubmitChallengeOpen, setIsSubmitChallengeOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c_1',
      itemId: item.id,
      author: {
        id: 'usr_2',
        displayName: 'Maya Lin',
        handle: '@maya_cooks',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
      },
      body: 'I tried making this version last night! Adding extra smoked garlic totally levels it up.',
      createdAt: '2026-09-24T09:00:00Z',
      reactionsCount: 3
    },
    {
      id: 'c_2',
      itemId: item.id,
      author: {
        id: 'usr_3',
        displayName: 'Devin Vance',
        handle: '@devin_ai',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      },
      body: 'Should we schedule a Weekend Chef cooking challenge around this?',
      createdAt: '2026-09-24T09:15:00Z',
      reactionsCount: 5
    }
  ]);
  const [reported, setReported] = useState(false);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      itemId: item.id,
      author: {
        id: currentUser.id,
        displayName: currentUser.displayName,
        handle: currentUser.handle,
        avatarUrl: currentUser.avatarUrl
      },
      body: commentText.trim(),
      createdAt: new Date().toISOString(),
      reactionsCount: 0
    };

    setComments(prev => [...prev, newComment]);
    addComment(item.id, commentText);
    setCommentText('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(19, 34, 56, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 950,
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
          maxWidth: '680px',
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--color-surface-card)',
          borderRadius: 'var(--radius-xl)',
          padding: 0,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--color-surface)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={item.creator.avatarUrl}
              alt={item.creator.displayName}
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <strong style={{ fontSize: '14px', display: 'block', color: 'var(--color-ink)' }}>
                {item.creator.displayName}
              </strong>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                {item.circleName ? `Shared to ${item.circleName}` : 'Public Orbit'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {item.reasonTag && <span className="badge badge-orange">{item.reasonTag}</span>}
            <button
              onClick={() => toggleBookmark(item.id)}
              style={{
                color: savedItemIds.includes(item.id) ? 'var(--color-signal-orange)' : 'var(--color-text-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
              title={savedItemIds.includes(item.id) ? 'Saved to Bookmarks' : 'Bookmark this clip'}
            >
              <Bookmark size={18} fill={savedItemIds.includes(item.id) ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={() => setReported(!reported)}
              style={{ color: reported ? 'var(--color-signal-orange)' : 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
              title="Report Content"
            >
              <ShieldAlert size={18} />
            </button>
            <button onClick={onClose} style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {/* Title & Caption */}
          <h2 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--color-ink)' }}>{item.title}</h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
            {item.caption}
          </p>

          {/* Media / Video Preview Box */}
          {item.thumbnailUrl && (
            <div
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                backgroundColor: '#000',
                marginBottom: '16px',
                maxHeight: '340px'
              }}
            >
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                style={{ width: '100%', height: '340px', objectFit: 'cover' }}
              />
              {item.sourcePlatform && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(19, 34, 56, 0.9)',
                    color: '#FFF',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ExternalLink size={12} />
                  <span>{item.sourcePlatform}</span>
                </div>
              )}
            </div>
          )}

          {/* Open Original Source Attribution Banner (Section 14) */}
          {item.sourceUrl && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-action-blue-light)',
                border: '1px solid var(--color-action-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-action-blue)' }}>
                <ExternalLink size={16} />
                <span>Original short video published on {item.sourcePlatform || 'external platform'}</span>
              </div>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '12px', textDecoration: 'none' }}
              >
                Watch on Original App
              </a>
            </div>
          )}

          {/* Reaction Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: '12px',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '20px'
            }}
          >
            {[
              { type: 'fire', emoji: '🔥', label: 'Fire' },
              { type: 'laugh', emoji: '😂', label: 'Funny' },
              { type: 'mindblown', emoji: '🤯', label: 'Mindblown' },
              { type: 'heart', emoji: '❤️', label: 'Love' },
              { type: 'agree', emoji: '🤝', label: 'Agree' }
            ].map(r => (
              <button
                key={r.type}
                onClick={() => reactToItem(item.id, r.type as any)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  transition: 'transform var(--transition-fast)'
                }}
              >
                <span style={{ fontSize: '20px' }}>{r.emoji}</span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  {r.label}
                </span>
              </button>
            ))}
          </div>

          {/* Challenge Section if item is a challenge */}
          {item.challenge && (
            <div
              style={{
                backgroundColor: 'rgba(255, 156, 74, 0.08)',
                border: '1px solid rgba(255, 156, 74, 0.3)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge badge-orange" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Trophy size={12} /> Community Challenge
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Closes {new Date(item.challenge.closesAt).toLocaleDateString()}
                </span>
              </div>
              <h3 style={{ fontSize: '15px', color: 'var(--color-ink)', marginBottom: '4px' }}>
                {item.challenge.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                {item.challenge.description}
              </p>

              {item.challenge.rules && item.challenge.rules.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                    Rules:
                  </span>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    {item.challenge.rules.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 156, 74, 0.2)', paddingTop: '10px' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  {item.challenge.submissions?.length || 0} community entries
                </span>
                <button
                  className="btn-primary"
                  onClick={() => setIsSubmitChallengeOpen(true)}
                  style={{
                    fontSize: '12px',
                    padding: '6px 14px',
                    backgroundColor: 'var(--color-signal-orange)',
                    borderColor: 'var(--color-signal-orange)'
                  }}
                >
                  <Trophy size={14} /> Submit Entry
                </button>
              </div>
            </div>
          )}

          {/* Room CTA if active or start room */}
          {item.activeRoom ? (
            <div
              style={{
                backgroundColor: 'var(--color-live-cyan-light)',
                border: '1px solid var(--color-live-cyan)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}
            >
              <div>
                <span className="badge badge-live">Live Room Active</span>
                <h4 style={{ fontSize: '14px', marginTop: '4px' }}>{item.activeRoom.title}</h4>
              </div>
              <button
                className="btn-live"
                onClick={() => {
                  onClose();
                  setSelectedRoomId(item.activeRoom!.id);
                }}
              >
                Join Live Discussion
              </button>
            </div>
          ) : (
            <button
              className="btn-secondary"
              onClick={() => {
                onClose();
                setSelectedRoomId(`room_${Date.now()}`);
              }}
              style={{ width: '100%', justifyContent: 'center', marginBottom: '20px', padding: '10px' }}
            >
              <MessageSquare size={16} /> Start a Watch & Debate Room for this item
            </button>
          )}

          {/* Threaded Comments Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '15px' }}>Group Replies & Discussion ({comments.length})</h3>
            {comments.map(c => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface)'
                }}
              >
                <img
                  src={c.author.avatarUrl}
                  alt={c.author.displayName}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '13px', color: 'var(--color-ink)' }}>{c.author.displayName}</strong>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-primary)', lineHeight: '1.4' }}>{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comment Input Footer */}
        <form
          onSubmit={handlePostComment}
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            display: 'flex',
            gap: '8px'
          }}
        >
          <input
            type="text"
            placeholder="Write a reply or add context..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', fontSize: '13px' }}
          />
          <button type="submit" className="btn-primary" disabled={!commentText.trim()} style={{ padding: '10px 16px' }}>
            <Send size={14} /> Send
          </button>
        </form>
      </div>

      <SubmitChallengeModal
        item={item}
        isOpen={isSubmitChallengeOpen}
        onClose={() => setIsSubmitChallengeOpen(false)}
      />
    </div>
  );
};
