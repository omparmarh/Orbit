import React, { useState } from 'react';
import { useOrbit } from '../context/OrbitContext';
import { CreateRoomModal } from './CreateRoomModal';
import { Radio, Users, Sparkles, Plus, Clock, ExternalLink, Flame } from 'lucide-react';

export const RoomsView: React.FC = () => {
  const { items, setSelectedRoomId } = useOrbit();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'watch' | 'debate'>('all');

  const liveItems = items.filter(i => i.activeRoom);

  // Scheduled rooms seed
  const scheduledRooms = [
    {
      id: 'sched_1',
      title: 'Midnight Lo-Fi Video Synthesis Jam',
      circleName: 'Creative Code & AI Art',
      startTime: 'Tonight at 9:00 PM',
      hosts: ['Alex Chen', 'Priya Sharma'],
      interestedCount: 18,
      tags: ['Creative', 'WatchParty']
    },
    {
      id: 'sched_2',
      title: 'Debate: Next-Gen Camera Sensory vs Computational Framing',
      circleName: 'Film Aesthetics',
      startTime: 'Tomorrow at 6:30 PM',
      hosts: ['Maya Lin'],
      interestedCount: 24,
      tags: ['Debate', 'Cinema']
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Live Rooms Hero Launchpad */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(23, 182, 200, 0.15) 0%, rgba(19, 34, 56, 0.9) 100%)',
          border: '1px solid rgba(23, 182, 200, 0.3)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-live-cyan)',
                boxShadow: '0 0 8px var(--color-live-cyan)',
                animation: 'pulse 1.5s infinite'
              }}
            />
            <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-live-cyan)', letterSpacing: '0.05em' }}>
              Synchronized Watch & Debate
            </span>
          </div>
          <h2 style={{ fontSize: '20px', color: '#FFF', marginBottom: '6px' }}>
            Never watch alone. Sync clips with your circle.
          </h2>
          <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', maxWidth: '420px', lineHeight: '1.4' }}>
            Drop short videos into real-time rooms with floating reactions, synchronized playback, and live hot-take polls.
          </p>
        </div>
        <button
          className="btn-live"
          onClick={() => setIsCreateOpen(true)}
          style={{ whiteSpace: 'nowrap', padding: '12px 20px', fontSize: '14px', flexShrink: 0 }}
        >
          <Plus size={16} /> Host Live Room
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {[
          { key: 'all', label: 'All Live Sessions' },
          { key: 'watch', label: '🎬 Watch Parties' },
          { key: 'debate', label: '🔥 Debates & Polls' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterType(tab.key as any)}
            className="badge"
            style={{
              padding: '8px 14px',
              fontSize: '12px',
              cursor: 'pointer',
              backgroundColor: filterType === tab.key ? 'var(--color-live-cyan)' : 'var(--color-surface-card)',
              color: filterType === tab.key ? '#FFF' : 'var(--color-text-primary)',
              border: '1px solid var(--color-border)',
              fontWeight: filterType === tab.key ? 700 : 500
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Live Now Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={16} color="var(--color-live-cyan)" /> Live Right Now ({liveItems.length})
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            Real-time sync enabled
          </span>
        </div>

        {liveItems.length === 0 ? (
          <div
            className="orbit-card"
            style={{
              textAlign: 'center',
              padding: '36px 20px',
              backgroundColor: 'var(--color-surface-card)',
              border: '1px dashed var(--color-border)'
            }}
          >
            <Radio size={32} color="var(--color-text-muted)" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '15px', marginBottom: '4px' }}>No rooms currently active</h4>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
              Be the first to start a live watch room for your circle!
            </p>
            <button className="btn-live" onClick={() => setIsCreateOpen(true)} style={{ margin: '0 auto' }}>
              <Plus size={14} /> Start Room
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {liveItems.map(item => (
              <div
                key={item.id}
                className="orbit-card"
                style={{
                  borderLeft: '4px solid var(--color-live-cyan)',
                  backgroundColor: 'var(--color-surface-card)',
                  transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-live">LIVE NOW</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      in <strong style={{ color: 'var(--color-ink)' }}>{item.circleName || 'Public'}</strong>
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-live-cyan)', fontSize: '12px', fontWeight: 700 }}>
                    <Users size={14} />
                    <span>{item.activeRoom?.activeParticipantsCount} discussing</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '14px' }}>
                  {item.thumbnailUrl && (
                    <div
                      style={{
                        width: '90px',
                        height: '90px',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        backgroundColor: '#000',
                        flexShrink: 0
                      }}
                    >
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '4px', color: 'var(--color-ink)' }}>
                      {item.activeRoom?.title || item.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.4', marginBottom: '6px' }}>
                      Focus clip: "{item.title}"
                    </p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {item.tags?.map(tag => (
                        <span key={tag} style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Join Actions */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--color-border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-signal-orange)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      <Flame size={14} /> Hot discussion
                    </span>
                    {item.sourcePlatform && (
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ExternalLink size={11} /> {item.sourcePlatform}
                      </span>
                    )}
                  </div>
                  <button
                    className="btn-live"
                    onClick={() => setSelectedRoomId(item.activeRoom!.id)}
                    style={{ padding: '6px 16px', fontSize: '13px' }}
                  >
                    Enter Live Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Scheduled Rooms */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} color="var(--color-action-blue)" /> Scheduled Circle Watch Parties
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            RSVP for notification
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
          {scheduledRooms.map(room => (
            <div key={room.id} className="orbit-card" style={{ backgroundColor: 'var(--color-surface-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span className="badge" style={{ backgroundColor: 'var(--color-action-blue-light)', color: 'var(--color-action-blue)' }}>
                  {room.circleName}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-signal-orange)' }}>
                  {room.startTime}
                </span>
              </div>
              <h4 style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--color-ink)' }}>
                {room.title}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                Hosted by {room.hosts.join(', ')} • {room.interestedCount} members RSVP’d
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {room.tags.map(t => (
                    <span key={t} className="badge" style={{ fontSize: '10px' }}>
                      #{t}
                    </span>
                  ))}
                </div>
                <button
                  className="btn-secondary"
                  onClick={() => alert(`You have RSVP’d to "${room.title}". You will get a notification when it begins!`)}
                  style={{ fontSize: '12px', padding: '4px 10px' }}
                >
                  <Sparkles size={12} /> RSVP
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Creation Modal */}
      <CreateRoomModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};
