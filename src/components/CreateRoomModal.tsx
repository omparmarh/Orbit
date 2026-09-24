import React, { useState } from 'react';
import { useOrbit } from '../context/OrbitContext';
import { X, Radio, Sparkles, Video, Users } from 'lucide-react';
import type { OrbitItem } from '../types/orbit';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomCreated?: (roomId: string) => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose, onRoomCreated }) => {
  const { items, circles, setSelectedRoomId, addItem, currentUser } = useOrbit();

  const [roomTitle, setRoomTitle] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string>(items[0]?.id || '');
  const [selectedCircleId, setSelectedCircleId] = useState<string>(circles[0]?.id || '');
  const [roomType, setRoomType] = useState<'watch_party' | 'debate' | 'quick_drop'>('watch_party');
  const [initialPollQuestion, setInitialPollQuestion] = useState('');

  if (!isOpen) return null;

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomTitle.trim()) return;

    const roomId = `room_${Date.now()}`;
    const targetItem = items.find(i => i.id === selectedItemId);
    const targetCircle = circles.find(c => c.id === selectedCircleId);

    // If an existing item is selected, update it or add a new room item
    if (targetItem) {
      targetItem.activeRoom = {
        id: roomId,
        itemId: targetItem.id,
        circleId: targetItem.circleId,
        title: roomTitle,
        type: roomType === 'debate' ? 'discussion' : 'live_watch',
        state: 'active',
        activeParticipantsCount: 1,
        startsAt: new Date().toISOString()
      };
    } else {
      // Create a brand new discussion item
      const newItemId = `item_${Date.now()}`;
      const newItem: OrbitItem = {
        id: newItemId,
        title: roomTitle,
        caption: `Live ${roomType.replace('_', ' ')} room in ${targetCircle?.name || 'Public'}.`,
        kind: 'original',
        circleId: selectedCircleId,
        circleName: targetCircle?.name || 'General',
        creator: currentUser,
        createdAt: new Date().toISOString(),
        tags: ['live', roomType],
        sourcePlatform: 'Original',
        visibility: 'circle',
        rightsStatus: 'USER_LICENSED',
        reactionsCount: 1,
        commentsCount: 0,
        activeRoom: {
          id: roomId,
          itemId: newItemId,
          circleId: selectedCircleId,
          title: roomTitle,
          type: roomType === 'debate' ? 'discussion' : 'live_watch',
          state: 'active',
          activeParticipantsCount: 1,
          startsAt: new Date().toISOString()
        }
      };
      addItem(newItem);
    }

    onClose();
    if (onRoomCreated) {
      onRoomCreated(roomId);
    } else {
      setSelectedRoomId(roomId);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(19, 34, 56, 0.75)',
        backdropFilter: 'blur(6px)',
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
          backgroundColor: 'var(--color-surface-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(23, 182, 200, 0.15)',
                color: 'var(--color-live-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Radio size={18} />
            </span>
            <div>
              <h3 style={{ fontSize: '18px', color: 'var(--color-ink)' }}>Start a Live Room</h3>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Host synchronized watch parties, real-time debates, or quick reactions.
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleCreateRoom} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Room Title */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
              Room Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Breaking Down the New Diffusion Model Drop"
              value={roomTitle}
              onChange={e => setRoomTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Room Type Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
              Format & Vibe
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[
                { type: 'watch_party', icon: Video, label: 'Watch Party', desc: 'Sync playback & reacts' },
                { type: 'debate', icon: Sparkles, label: 'Live Debate', desc: 'Timed hot takes & polls' },
                { type: 'quick_drop', icon: Users, label: 'Circle Lounge', desc: 'Casual drop-in chat' }
              ].map(opt => {
                const Icon = opt.icon;
                const isSelected = roomType === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setRoomType(opt.type as any)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--color-live-cyan)' : '1px solid var(--color-border)',
                      backgroundColor: isSelected ? 'rgba(23, 182, 200, 0.08)' : 'var(--color-surface)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <Icon size={18} color={isSelected ? 'var(--color-live-cyan)' : 'var(--color-text-secondary)'} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: isSelected ? 'var(--color-live-cyan)' : 'var(--color-text-primary)' }}>
                      {opt.label}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content to Watch/Discuss */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
              Base Content Item
            </label>
            <select
              value={selectedItemId}
              onChange={e => setSelectedItemId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                fontSize: '13px'
              }}
            >
              {items.map(item => (
                <option key={item.id} value={item.id}>
                  {item.title} ({item.circleName || 'Public'})
                </option>
              ))}
            </select>
          </div>

          {/* Circle Audience */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
              Host in Circle
            </label>
            <select
              value={selectedCircleId}
              onChange={e => setSelectedCircleId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                fontSize: '13px'
              }}
            >
              {circles.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.memberCount} members)
                </option>
              ))}
            </select>
          </div>

          {/* Optional Starter Poll */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
              Starter Hot Take Poll (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Will this replace standard workflows this year?"
              value={initialPollQuestion}
              onChange={e => setInitialPollQuestion(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                fontSize: '13px'
              }}
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-live"
              style={{ flex: 2, justifyContent: 'center', fontSize: '14px' }}
            >
              <Radio size={16} /> Go Live Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
