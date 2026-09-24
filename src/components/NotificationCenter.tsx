import React, { useState } from 'react';
import { useOrbit } from '../context/OrbitContext';
import { X, Bell, BellOff, Check, Flame, MessageSquare, Users, Trophy, Mail } from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  reply: <MessageSquare size={16} color="var(--color-action-blue)" />,
  reaction: <Flame size={16} color="var(--color-signal-orange)" />,
  room_start: <Users size={16} color="var(--color-live-cyan)" />,
  challenge_due: <Trophy size={16} color="var(--color-signal-orange)" />,
  invite: <Mail size={16} color="var(--color-action-blue)" />,
};

export const NotificationCenter: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationsAsRead } = useOrbit();
  const [quietHours, setQuietHours] = useState(false);
  const [digestMode, setDigestMode] = useState<'realtime' | 'hourly' | 'daily'>('realtime');

  if (!isOpen) return null;

  const unread = notifications.filter(n => !n.read);
  const read = notifications.filter(n => n.read);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(19, 34, 56, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          backgroundColor: 'var(--color-surface-card)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.25s ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell size={20} color="var(--color-action-blue)" />
            <h2 style={{ fontSize: '18px', margin: 0 }}>Activity Center</h2>
            {unread.length > 0 && (
              <span className="badge badge-orange">{unread.length} new</span>
            )}
          </div>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Controls Bar */}
        <div
          style={{
            padding: '12px 20px',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          {/* Quiet Hours Toggle */}
          <button
            onClick={() => setQuietHours(!quietHours)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: quietHours ? 'var(--color-signal-orange-light)' : 'var(--color-surface-card)',
              color: quietHours ? 'var(--color-signal-orange)' : 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            {quietHours ? <BellOff size={14} /> : <Bell size={14} />}
            {quietHours ? 'Quiet Mode On' : 'Quiet Hours'}
          </button>

          {/* Digest Frequency Selector */}
          <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--color-surface-card)', padding: '3px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)' }}>
            {(['realtime', 'hourly', 'daily'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setDigestMode(mode)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  backgroundColor: digestMode === mode ? 'var(--color-action-blue)' : 'transparent',
                  color: digestMode === mode ? '#FFF' : 'var(--color-text-muted)',
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Quiet Hours Active Banner */}
        {quietHours && (
          <div
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--color-signal-orange-light)',
              fontSize: '12px',
              color: 'var(--color-signal-orange)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <BellOff size={14} />
            Notifications are paused. You&apos;ll get a digest when quiet hours end.
          </div>
        )}

        {/* Notification List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {/* Mark all read */}
          {unread.length > 0 && (
            <button
              onClick={markNotificationsAsRead}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--color-action-blue)',
                marginBottom: '16px',
              }}
            >
              <Check size={14} /> Mark all as read
            </button>
          )}

          {/* Unread Section */}
          {unread.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                New Activity
              </h4>
              {unread.map(n => (
                <div
                  key={n.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-action-blue-light)',
                    marginBottom: '8px',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img
                      src={n.actor.avatarUrl}
                      alt={n.actor.displayName}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', backgroundColor: 'var(--color-surface-card)', borderRadius: '50%', padding: '2px' }}>
                      {ICON_MAP[n.type] || <Bell size={12} />}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', lineHeight: '1.4', color: 'var(--color-ink)' }}>
                      <strong>{n.actor.displayName}</strong> {n.message}
                    </p>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px', display: 'block' }}>
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Read Section */}
          {read.length > 0 && (
            <div>
              <h4 style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                Earlier
              </h4>
              {read.map(n => (
                <div
                  key={n.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '6px',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img
                      src={n.actor.avatarUrl}
                      alt={n.actor.displayName}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', opacity: 0.8 }}
                    />
                    <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', backgroundColor: 'var(--color-surface-card)', borderRadius: '50%', padding: '2px' }}>
                      {ICON_MAP[n.type] || <Bell size={12} />}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', lineHeight: '1.4', color: 'var(--color-text-secondary)' }}>
                      <strong>{n.actor.displayName}</strong> {n.message}
                    </p>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px', display: 'block' }}>
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {notifications.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--color-text-muted)' }}>
              <Bell size={32} style={{ marginBottom: '8px', opacity: 0.4 }} />
              <p style={{ fontSize: '14px' }}>No activity yet. Share something to get the conversation started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
