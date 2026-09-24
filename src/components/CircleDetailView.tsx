import React, { useState } from 'react';
import { useOrbit } from '../context/OrbitContext';
import { X, Flame, Share2, PlusCircle, Sparkles, FolderHeart, Check, UserPlus, QrCode } from 'lucide-react';
import type { Circle, Collection } from '../types/orbit';

export const CircleDetailView: React.FC<{ circle: Circle; onClose: () => void }> = ({ circle, onClose }) => {
  const { items, toggleStreakPause, setIsIntakeOpen } = useOrbit();
  const [activeTab, setActiveTab] = useState<'feed' | 'collections' | 'members' | 'rules'>('feed');
  const [inviteCopied, setInviteCopied] = useState(false);
  const [isJoined, setIsJoined] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);

  // Mock collections for this circle
  const [collections] = useState<Collection[]>([
    {
      id: 'col_1',
      circleId: circle.id,
      ownerId: 'usr_me',
      title: 'Top Saved Recipes 🍳',
      description: 'Shared 15-minute ramen and brunch ideas',
      visibility: 'circle',
      createdAt: '2026-09-20T10:00:00Z',
      items: [
        {
          id: 'ci_1',
          itemId: 'item_1',
          title: 'Smoky Garlic Butter Ramen',
          thumbnailUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
          addedBy: 'Maya Lin',
          addedAt: '2026-09-24T08:30:00Z'
        }
      ]
    },
    {
      id: 'col_2',
      circleId: circle.id,
      ownerId: 'usr_me',
      title: 'Weekend Cooking Challenges 🏆',
      description: 'Weekly recap videos and vote results',
      visibility: 'circle',
      createdAt: '2026-09-18T10:00:00Z',
      items: []
    }
  ]);

  const circleItems = items.filter(i => i.circleId === circle.id);

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(`https://orbit.app/join/circle/${circle.id}`);
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(19, 34, 56, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 900,
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
          maxWidth: '660px',
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--color-surface-card)',
          borderRadius: 'var(--radius-xl)',
          padding: 0,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Banner Header */}
        <div
          style={{
            position: 'relative',
            height: '150px',
            backgroundColor: 'var(--color-ink)',
            backgroundImage: `url(${circle.avatarUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '16px'
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(19, 34, 56, 0.7)'
            }}
          />

          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: '#FFF',
              borderRadius: '50%',
              padding: '6px',
              zIndex: 2
            }}
          >
            <X size={20} />
          </button>

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img
                src={circle.avatarUrl}
                alt={circle.name}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-md)',
                  objectFit: 'cover',
                  border: '3px solid #FFF'
                }}
              />
              <div>
                <h2 style={{ fontSize: '20px', color: '#FFF', margin: 0 }}>{circle.name}</h2>
                <span className="badge badge-blue" style={{ marginTop: '4px' }}>
                  {circle.visibility.replace('_', ' ')} • {circle.memberCount + (isJoined ? 1 : 0)} members
                </span>
              </div>
            </div>

            <button
              className={isJoined ? 'btn-secondary' : 'btn-primary'}
              onClick={() => setIsJoined(!isJoined)}
              style={{ padding: '8px 16px', fontSize: '13px', backgroundColor: isJoined ? '#FFF' : 'var(--color-action-blue)', color: isJoined ? 'var(--color-ink)' : '#FFF' }}
            >
              {isJoined ? <><Check size={14} /> Joined</> : <><UserPlus size={14} /> Join Circle</>}
            </button>
          </div>
        </div>

        {/* Responsible Streak Controls Banner (Section 5 Guardrails) */}
        {circle.activeStreakDays !== undefined && circle.activeStreakDays > 0 && (
          <div
            style={{
              backgroundColor: 'var(--color-signal-orange-light)',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--color-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={18} color="var(--color-signal-orange)" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ink)' }}>
                {circle.activeStreakDays}-day Group Activity Streak {circle.streakPaused ? '(Paused for break)' : ''}
              </span>
            </div>
            <button
              className="btn-secondary"
              onClick={() => toggleStreakPause(circle.id)}
              style={{ padding: '4px 12px', fontSize: '11px' }}
            >
              {circle.streakPaused ? 'Resume Streak' : 'Pause Streak (No Shame/Loss)'}
            </button>
          </div>
        )}

        {/* View Navigation Tabs & Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--color-border)',
            padding: '8px 16px',
            backgroundColor: 'var(--color-surface)'
          }}
        >
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['feed', 'collections', 'members', 'rules'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  backgroundColor: activeTab === tab ? 'var(--color-action-blue)' : 'transparent',
                  color: activeTab === tab ? '#FFF' : 'var(--color-text-secondary)'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" onClick={() => setShowQrModal(true)} style={{ padding: '6px 10px', fontSize: '12px' }}>
              <QrCode size={14} />
            </button>
            <button className="btn-secondary" onClick={handleCopyInvite} style={{ padding: '6px 12px', fontSize: '12px' }}>
              <Share2 size={14} /> {inviteCopied ? 'Link Copied!' : 'Invite'}
            </button>
            <button className="btn-primary" onClick={() => setIsIntakeOpen(true)} style={{ padding: '6px 12px', fontSize: '12px' }}>
              <PlusCircle size={14} /> Post Item
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {activeTab === 'feed' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {circleItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--color-text-muted)' }}>
                  <Sparkles size={32} style={{ marginBottom: '8px', color: 'var(--color-action-blue)' }} />
                  <p style={{ fontSize: '14px' }}>No items shared in this circle yet.</p>
                  <button className="btn-primary" onClick={() => setIsIntakeOpen(true)} style={{ marginTop: '12px' }}>
                    Share First Reel or Poll
                  </button>
                </div>
              ) : (
                circleItems.map(item => (
                  <div key={item.id} className="orbit-card">
                    <span className="badge badge-orange" style={{ marginBottom: '8px' }}>
                      {item.reasonTag || 'Item'}
                    </span>
                    <h4 style={{ fontSize: '15px', marginBottom: '4px' }}>{item.title}</h4>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{item.caption}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'collections' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '14px' }}>Shared Circle Collections</h4>
                <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '11px' }}>
                  + New Collection
                </button>
              </div>
              {collections.map(col => (
                <div key={col.id} className="orbit-card" style={{ backgroundColor: 'var(--color-surface)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <FolderHeart size={20} color="var(--color-action-blue)" />
                    <div>
                      <h5 style={{ fontSize: '14px' }}>{col.title}</h5>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{col.description}</p>
                    </div>
                  </div>
                  {col.items.length > 0 && (
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                      {col.items.map(ci => (
                        <div key={ci.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--color-surface-card)', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
                          {ci.thumbnailUrl && <img src={ci.thumbnailUrl} alt={ci.title} style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} />}
                          <span style={{ fontSize: '12px', fontWeight: 600 }}>{ci.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'members' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Members & Roles</h4>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="Owner" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                  <div>
                    <strong style={{ fontSize: '14px', display: 'block' }}>Alex Chen (You)</strong>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Circle Owner</span>
                  </div>
                </div>
                <span className="badge badge-blue">Owner</span>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '4px' }}>Circle Community Guidelines</h4>
              {circle.rules.map((rule, i) => (
                <div key={i} style={{ padding: '10px 14px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', fontSize: '13px' }}>
                  <strong>{i + 1}.</strong> {rule}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* QR Code Invite Overlay Modal */}
      {showQrModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="orbit-card" style={{ width: '100%', maxWidth: '320px', textAlign: 'center', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Invite to {circle.name}</h3>
            <div style={{ backgroundColor: '#FFF', padding: '16px', borderRadius: 'var(--radius-md)', display: 'inline-block', marginBottom: '16px' }}>
              <QrCode size={160} color="#132238" />
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>Scan with camera to join this Orbit Circle instantly</p>
            <button className="btn-secondary" onClick={() => setShowQrModal(false)} style={{ width: '100%', justifyContent: 'center' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
