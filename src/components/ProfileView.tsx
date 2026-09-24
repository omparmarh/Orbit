import React, { useState } from 'react';
import { useOrbit } from '../context/OrbitContext';
import {
  Flame,
  Moon,
  ShieldCheck,
  Bookmark,
  Clock,
  Download,
  PauseCircle,
  PlayCircle
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, circles, items, toggleStreakPause, setSelectedItemId, savedItemIds, toggleBookmark } = useOrbit();
  const [activeSubTab, setActiveSubTab] = useState<'streaks' | 'wellbeing' | 'saved' | 'safety'>('streaks');

  // Digital Wellbeing settings state
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('08:00');
  const [digestMode, setDigestMode] = useState<'realtime' | 'daily_batch' | 'weekly'>('daily_batch');
  const [contentFilterLevel, setContentFilterLevel] = useState<'strict' | 'balanced' | 'open'>('balanced');
  const [streakFreezesRemaining, setStreakFreezesRemaining] = useState(2);

  // Filter user's saved items or shared items
  const userItems = items.filter(i => i.creator.id === currentUser.id);
  const savedItems = items.filter(i => savedItemIds.includes(i.id));

  const handleUseFreeze = () => {
    if (streakFreezesRemaining > 0) {
      setStreakFreezesRemaining(prev => prev - 1);
      alert('Streak Freeze activated! Your streak is safely protected for the next 48 hours with zero penalty.');
    } else {
      alert('No streak freezes remaining this month. Orbit replenishes 2 freezes every month.');
    }
  };

  const handleExportData = () => {
    const dataToExport = {
      user: currentUser,
      circlesJoined: circles.map(c => ({ id: c.id, name: c.name, streak: c.activeStreakDays })),
      wellbeingSettings: {
        quietHours: { enabled: quietHoursEnabled, start: quietStart, end: quietEnd },
        digestMode,
        contentFilterLevel
      },
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orbit_export_${currentUser.handle}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Profile Card Header */}
      <div
        className="orbit-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '28px 20px',
          backgroundColor: 'var(--color-surface-card)',
          position: 'relative'
        }}
      >
        <div style={{ position: 'relative', marginBottom: '14px' }}>
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.displayName}
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--color-action-blue)',
              boxShadow: 'var(--shadow-md)'
            }}
          />
          <span
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: 'var(--color-signal-orange)',
              color: '#FFF',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 6px rgba(0,0,0,0.3)'
            }}
          >
            🔥
          </span>
        </div>

        <h2 style={{ fontSize: '20px', color: 'var(--color-ink)', marginBottom: '2px' }}>
          {currentUser.displayName}
        </h2>
        <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
          @{currentUser.handle} • Member since {new Date(currentUser.joinedAt).getFullYear()}
        </span>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', maxWidth: '420px', lineHeight: '1.4', marginBottom: '16px' }}>
          {currentUser.bio || 'Curating short-form video discoveries across design, culinary arts, and generative tech.'}
        </p>

        {/* Interests Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '18px' }}>
          {currentUser.interests.map(interest => (
            <span
              key={interest}
              className="badge"
              style={{ backgroundColor: 'var(--color-surface)', fontSize: '11px' }}
            >
              #{interest}
            </span>
          ))}
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            maxWidth: '400px',
            justifyContent: 'space-around',
            padding: '12px 0',
            borderTop: '1px solid var(--color-border)',
            borderBottom: '1px solid var(--color-border)'
          }}
        >
          <div>
            <strong style={{ display: 'block', fontSize: '17px', color: 'var(--color-ink)' }}>
              {circles.length}
            </strong>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Circles</span>
          </div>
          <div style={{ borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)', padding: '0 24px' }}>
            <strong style={{ display: 'block', fontSize: '17px', color: 'var(--color-signal-orange)' }}>
              🔥 5 Days
            </strong>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Streak</span>
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '17px', color: 'var(--color-ink)' }}>
              {userItems.length}
            </strong>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Shared</span>
          </div>
        </div>
      </div>

      {/* Profile Section Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
        {[
          { key: 'streaks', label: '🔥 Responsible Streaks', icon: Flame },
          { key: 'wellbeing', label: '🌙 Quiet Hours & Wellbeing', icon: Moon },
          { key: 'saved', label: '🔖 Saved & Favorites', icon: Bookmark },
          { key: 'safety', label: '🛡️ Safety & Data Export', icon: ShieldCheck }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveSubTab(tab.key as any)}
            className="badge"
            style={{
              padding: '8px 14px',
              fontSize: '12px',
              cursor: 'pointer',
              backgroundColor: activeSubTab === tab.key ? 'var(--color-action-blue)' : 'var(--color-surface-card)',
              color: activeSubTab === tab.key ? '#FFF' : 'var(--color-text-primary)',
              border: '1px solid var(--color-border)',
              fontWeight: activeSubTab === tab.key ? 700 : 500,
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SUBTAB 1: RESPONSIBLE STREAKS DASHBOARD */}
      {activeSubTab === 'streaks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Guilt-Free Streak Banner */}
          <div
            style={{
              backgroundColor: 'rgba(255, 156, 74, 0.1)',
              border: '1px solid rgba(255, 156, 74, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start'
            }}
          >
            <Flame size={24} color="var(--color-signal-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '14px', color: 'var(--color-signal-orange)', marginBottom: '4px' }}>
                Orbit No-Guilt Streak Policy
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>
                Social connections should inspire, not cause dread. Orbit lets you pause your streaks for vacations, exams, or digital rest periods without losing your cumulative record.
              </p>
            </div>
          </div>

          {/* Freeze Bank */}
          <div className="orbit-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-surface-card)' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Streak Protection
              </span>
              <h4 style={{ fontSize: '15px', color: 'var(--color-ink)', marginTop: '2px' }}>
                {streakFreezesRemaining} Streak Freezes Left this Month
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                Protects all circle streaks automatically if you're offline.
              </p>
            </div>
            <button
              className="btn-secondary"
              onClick={handleUseFreeze}
              disabled={streakFreezesRemaining === 0}
              style={{ fontSize: '12px', padding: '6px 14px' }}
            >
              Use Freeze Now
            </button>
          </div>

          {/* Circle Streaks List */}
          <div>
            <h4 style={{ fontSize: '14px', marginBottom: '10px', color: 'var(--color-ink)' }}>
              Active Circle Streaks
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {circles.map(c => (
                <div
                  key={c.id}
                  className="orbit-card"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    backgroundColor: 'var(--color-surface-card)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={c.avatarUrl}
                      alt={c.name}
                      style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                    />
                    <div>
                      <h5 style={{ fontSize: '14px', color: 'var(--color-ink)' }}>{c.name}</h5>
                      <span style={{ fontSize: '12px', color: 'var(--color-signal-orange)', fontWeight: 600 }}>
                        🔥 {c.activeStreakDays || 0}-day streak {c.streakPaused ? '(PAUSED)' : ''}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleStreakPause(c.id)}
                    className="btn-secondary"
                    style={{
                      fontSize: '12px',
                      padding: '6px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {c.streakPaused ? (
                      <>
                        <PlayCircle size={14} color="var(--color-action-blue)" /> Resume
                      </>
                    ) : (
                      <>
                        <PauseCircle size={14} color="var(--color-text-muted)" /> Pause Streak
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: DIGITAL WELLBEING & QUIET HOURS */}
      {activeSubTab === 'wellbeing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Mindful Daily Tracker */}
          <div className="orbit-card" style={{ backgroundColor: 'var(--color-surface-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> Screen Time Today
              </span>
              <span className="badge badge-blue">Within Mindful Range</span>
            </div>
            <h3 style={{ fontSize: '22px', color: 'var(--color-ink)', marginBottom: '4px' }}>
              18 Minutes Active
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              Daily target: Under 45 minutes. Orbit is designed for high-value connection, not endless scroll trance.
            </p>
            <div style={{ height: '6px', borderRadius: '3px', backgroundColor: 'var(--color-surface)', overflow: 'hidden' }}>
              <div style={{ width: '40%', height: '100%', backgroundColor: 'var(--color-action-blue)' }} />
            </div>
          </div>

          {/* Quiet Hours Configuration */}
          <div className="orbit-card" style={{ backgroundColor: 'var(--color-surface-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h4 style={{ fontSize: '15px', color: 'var(--color-ink)' }}>Scheduled Quiet Hours</h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  Silence non-critical notifications while you sleep or focus.
                </p>
              </div>
              <input
                type="checkbox"
                checked={quietHoursEnabled}
                onChange={e => setQuietHoursEnabled(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-action-blue)', cursor: 'pointer' }}
              />
            </div>

            {quietHoursEnabled && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--color-border)' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                    Starts At
                  </label>
                  <input
                    type="time"
                    value={quietStart}
                    onChange={e => setQuietStart(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-primary)'
                    }}
                  />
                </div>
                <span style={{ color: 'var(--color-text-muted)', paddingTop: '16px' }}>to</span>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                    Ends At
                  </label>
                  <input
                    type="time"
                    value={quietEnd}
                    onChange={e => setQuietEnd(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-primary)'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Digest Delivery Options */}
          <div className="orbit-card" style={{ backgroundColor: 'var(--color-surface-card)' }}>
            <h4 style={{ fontSize: '15px', color: 'var(--color-ink)', marginBottom: '4px' }}>
              Notification Batching & Digests
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
              Bundle non-urgent reactions and circle drops to reduce phone interruptions.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { key: 'daily_batch', label: 'Daily Evening Digest (8:00 PM)', desc: 'Recommended: 1 clean summary of all circle activity.' },
                { key: 'weekly', label: 'Weekly Sunday Digest', desc: 'Minimalist: Only critical live room invites ping instantly.' },
                { key: 'realtime', label: 'Real-time Pings', desc: 'Deliver replies and reactions as they happen.' }
              ].map(opt => (
                <label
                  key={opt.key}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: digestMode === opt.key ? 'var(--color-action-blue-light)' : 'var(--color-surface)',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="digest"
                    checked={digestMode === opt.key}
                    onChange={() => setDigestMode(opt.key as any)}
                    style={{ marginTop: '2px', accentColor: 'var(--color-action-blue)' }}
                  />
                  <div>
                    <strong style={{ fontSize: '13px', display: 'block', color: 'var(--color-ink)' }}>
                      {opt.label}
                    </strong>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      {opt.desc}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: SAVED & BOOKMARKS */}
      {activeSubTab === 'saved' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h4 style={{ fontSize: '15px', color: 'var(--color-ink)' }}>
            Bookmarked Short Clips ({savedItems.length})
          </h4>

          {savedItems.length === 0 ? (
            <div
              className="orbit-card"
              style={{
                textAlign: 'center',
                padding: '36px 20px',
                backgroundColor: 'var(--color-surface-card)',
                color: 'var(--color-text-muted)'
              }}
            >
              <Bookmark size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                No saved clips yet. Tap the bookmark icon on any clip in your Home feed or Discover to save it for later!
              </p>
            </div>
          ) : (
            savedItems.map(item => (
              <div
                key={item.id}
                className="orbit-card orbit-card-interactive"
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: 'var(--color-surface-card)'
                }}
              >
                {item.thumbnailUrl && (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    onClick={() => setSelectedItemId(item.id)}
                    style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', cursor: 'pointer' }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => setSelectedItemId(item.id)}>
                  <h5 style={{ fontSize: '14px', marginBottom: '2px', color: 'var(--color-ink)' }}>
                    {item.title}
                  </h5>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    From {item.circleName || 'Public'} • {item.sourcePlatform || 'Orbit'}
                  </span>
                </div>
                <button
                  className="btn-secondary"
                  onClick={e => {
                    e.stopPropagation();
                    toggleBookmark(item.id);
                  }}
                  style={{ fontSize: '11px', padding: '4px 10px' }}
                >
                  Unsave
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* SUBTAB 4: SAFETY, MODERATION & DATA EXPORT */}
      {activeSubTab === 'safety' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Content Filtering Level */}
          <div className="orbit-card" style={{ backgroundColor: 'var(--color-surface-card)' }}>
            <h4 style={{ fontSize: '15px', color: 'var(--color-ink)', marginBottom: '4px' }}>
              Content Sensitivity & Safety
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              Choose how rigorously external clips with unverified claims are flagged.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[
                { key: 'strict', label: '🛡️ Strict', desc: 'High review threshold' },
                { key: 'balanced', label: '⚖️ Balanced', desc: 'Standard circle rules' },
                { key: 'open', label: '🌐 Open', desc: 'Full exploration' }
              ].map(lvl => (
                <button
                  key={lvl.key}
                  type="button"
                  onClick={() => setContentFilterLevel(lvl.key as any)}
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: contentFilterLevel === lvl.key ? '2px solid var(--color-action-blue)' : '1px solid var(--color-border)',
                    backgroundColor: contentFilterLevel === lvl.key ? 'var(--color-action-blue-light)' : 'var(--color-surface)',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <strong style={{ fontSize: '12px', display: 'block', color: 'var(--color-ink)' }}>
                    {lvl.label}
                  </strong>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                    {lvl.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Privacy & Blocked Accounts */}
          <div className="orbit-card" style={{ backgroundColor: 'var(--color-surface-card)' }}>
            <h4 style={{ fontSize: '15px', color: 'var(--color-ink)', marginBottom: '4px' }}>
              Privacy & Circle Discretion
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
              All private circle discussions are encrypted and never shown in public feeds.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>
                Allow profile discovery in search
              </span>
              <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', accentColor: 'var(--color-action-blue)' }} />
            </div>
          </div>

          {/* Data Export (GDPR / Ownership) */}
          <div className="orbit-card" style={{ backgroundColor: 'var(--color-surface-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '15px', color: 'var(--color-ink)', marginBottom: '2px' }}>
                  Export Your Data Bundle
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  Download a JSON archive of your circles, shared clips, notes, and wellbeing logs.
                </p>
              </div>
              <button
                className="btn-secondary"
                onClick={handleExportData}
                style={{ fontSize: '12px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={14} /> Export JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
