import React, { useState, useEffect } from 'react';
import { OrbitProvider, useOrbit } from './context/OrbitContext';
import { useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ShareIntakeModal } from './components/ShareIntakeModal';
import { CreateCircleModal } from './components/CreateCircleModal';
import { CircleDetailView } from './components/CircleDetailView';
import { ItemDetailModal } from './components/ItemDetailModal';
import { LiveRoomView } from './components/LiveRoomView';
import { RoomsView } from './components/RoomsView';
import { DiscoverView } from './components/DiscoverView';
import { ProfileView } from './components/ProfileView';
import SplashScreen from './components/SplashScreen';
import AuthScreen from './components/AuthScreen';
import { Flame, MessageSquare, ExternalLink, Plus, Bookmark } from 'lucide-react';
import type { Circle } from './types/orbit';

const MainContent: React.FC = () => {
  const { activeTab, items, circles, votePoll, reactToItem, toggleStreakPause, selectedItemId, setSelectedItemId, selectedRoomId, setSelectedRoomId, savedItemIds, toggleBookmark } = useOrbit();
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const [isCreateCircleOpen, setIsCreateCircleOpen] = useState(false);

  const selectedItem = items.find(i => i.id === selectedItemId);

  return (
    <main style={{ flex: 1, paddingBottom: '80px', maxWidth: '680px', margin: '0 auto', width: '100%', padding: '16px' }}>
      {/* Tab Header Banner */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '22px', textTransform: 'capitalize' }}>
            {activeTab === 'home' && 'Your Social Feed'}
            {activeTab === 'discover' && 'Discover & Trends'}
            {activeTab === 'rooms' && 'Active Video Rooms'}
            {activeTab === 'circles' && 'Your Circles'}
            {activeTab === 'profile' && 'Your Profile'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            {activeTab === 'home' && 'Shared short video content, votes & challenges from your circles.'}
            {activeTab === 'discover' && 'Explore topic channels, creator drops, and interest feeds.'}
            {activeTab === 'rooms' && 'Join synchronized discussion & watch rooms in real-time.'}
            {activeTab === 'circles' && 'Persistent interest groups with collaborative streaks and memories.'}
            {activeTab === 'profile' && 'Manage your contributions, collections, streaks & privacy.'}
          </p>
        </div>
        {activeTab === 'circles' && (
          <button className="btn-primary" onClick={() => setIsCreateCircleOpen(true)} style={{ padding: '8px 14px', fontSize: '12px' }}>
            <Plus size={14} /> Create Circle
          </button>
        )}
      </div>

      {/* HOME FEED VIEW */}
      {activeTab === 'home' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {items.map(item => (
            <article
              key={item.id}
              className="orbit-card orbit-card-interactive"
              onClick={() => setSelectedItemId(item.id)}
              style={{ cursor: 'pointer' }}
            >
              {/* Card Header: Creator & Circle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={item.creator.avatarUrl}
                    alt={item.creator.displayName}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '14px', display: 'block', color: 'var(--color-ink)' }}>
                      {item.creator.displayName}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      shared to <strong style={{ color: 'var(--color-action-blue)' }}>{item.circleName || 'Public'}</strong>
                    </span>
                  </div>
                </div>
                {item.reasonTag && (
                  <span className="badge badge-orange">
                    {item.reasonTag}
                  </span>
                )}
              </div>

              {/* Title & Caption */}
              <h3 style={{ fontSize: '16px', marginBottom: '6px' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '12px', lineHeight: '1.4' }}>
                {item.caption}
              </p>

              {/* Link / Media Preview */}
              {item.thumbnailUrl && (
                <div
                  style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    marginBottom: '12px',
                    height: '240px',
                    backgroundColor: '#000'
                  }}
                >
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
                  />
                  {item.sourcePlatform && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'rgba(19, 34, 56, 0.85)',
                        backdropFilter: 'blur(4px)',
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

                  {/* Active room banner overlay if present */}
                  {item.activeRoom && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '12px',
                        right: '12px',
                        backgroundColor: 'rgba(23, 182, 200, 0.95)',
                        color: '#FFF',
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge badge-live" style={{ backgroundColor: '#FFF', color: 'var(--color-live-cyan)' }}>
                          LIVE ROOM
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>
                          {item.activeRoom.activeParticipantsCount} watching & discussing now
                        </span>
                      </div>
                      <button
                        className="btn-secondary"
                        onClick={() => setSelectedRoomId(item.activeRoom!.id)}
                        style={{ padding: '4px 12px', fontSize: '12px', backgroundColor: '#FFF', color: 'var(--color-ink)' }}
                      >
                        Join Room
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* POLL INTERACTION widget */}
              {item.poll && (
                <div style={{ backgroundColor: 'var(--color-surface)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '13px', marginBottom: '10px', color: 'var(--color-ink)' }}>{item.poll.question}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {item.poll.options.map(opt => {
                      const percentage = item.poll!.totalVotes > 0 ? Math.round((opt.votes / item.poll!.totalVotes) * 100) : 0;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => votePoll(item.id, opt.id)}
                          style={{
                            position: 'relative',
                            padding: '10px 14px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border)',
                            backgroundColor: 'var(--color-surface-card)',
                            textAlign: 'left',
                            overflow: 'hidden'
                          }}
                        >
                          <div
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              bottom: 0,
                              width: `${percentage}%`,
                              backgroundColor: 'var(--color-action-blue-light)',
                              transition: 'width 0.4s ease'
                            }}
                          />
                          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', zIndex: 1, fontSize: '13px' }}>
                            <span>{opt.text}</span>
                            <span style={{ fontWeight: 700, color: 'var(--color-action-blue)' }}>{percentage}% ({opt.votes})</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Card Footer Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => reactToItem(item.id, 'fire')}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-secondary)' }}
                  >
                    <Flame size={16} color="var(--color-signal-orange)" />
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.reactionsCount}</span>
                  </button>
                  <button
                    onClick={() => setSelectedItemId(item.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-secondary)' }}
                  >
                    <MessageSquare size={16} />
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.commentsCount} replies</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(item.id);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: savedItemIds.includes(item.id) ? 'var(--color-signal-orange)' : 'var(--color-text-secondary)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    title={savedItemIds.includes(item.id) ? 'Saved' : 'Save for later'}
                  >
                    <Bookmark size={16} fill={savedItemIds.includes(item.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                {item.sourceUrl && (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ fontSize: '12px', color: 'var(--color-action-blue)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                  >
                    Open Original <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* DISCOVER VIEW */}
      {activeTab === 'discover' && <DiscoverView />}

      {/* ROOMS VIEW */}
      {activeTab === 'rooms' && <RoomsView />}

      {/* CIRCLES VIEW */}
      {activeTab === 'circles' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {circles.map(c => (
            <div key={c.id} className="orbit-card">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <img src={c.avatarUrl} alt={c.name} style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                <div>
                  <h3 style={{ fontSize: '15px' }}>{c.name}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{c.memberCount} members</span>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>{c.description}</p>
              
              {/* Responsible streak indicator from Section 5 */}
              {c.activeStreakDays !== undefined && c.activeStreakDays > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-surface)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-signal-orange)' }}>
                    🔥 {c.activeStreakDays}-day streak {c.streakPaused ? '(Paused)' : ''}
                  </span>
                  <button
                    onClick={() => toggleStreakPause(c.id)}
                    style={{ fontSize: '11px', color: 'var(--color-text-muted)', textDecoration: 'underline' }}
                  >
                    {c.streakPaused ? 'Resume' : 'Pause Streak'}
                  </button>
                </div>
              )}

              <button
                className="btn-secondary"
                onClick={() => setSelectedCircle(c)}
                style={{ width: '100%', justifyContent: 'center', fontSize: '13px' }}
              >
                View Circle Feed
              </button>
            </div>
          ))}
        </div>
      )}

      {/* PROFILE VIEW */}
      {activeTab === 'profile' && <ProfileView />}

      {/* Global Modals & Overlays */}
      {selectedCircle && (
        <CircleDetailView circle={selectedCircle} onClose={() => setSelectedCircle(null)} />
      )}
      {selectedItem && (
        <ItemDetailModal item={selectedItem} onClose={() => setSelectedItemId(null)} />
      )}
      {selectedRoomId && (
        <LiveRoomView roomId={selectedRoomId} onClose={() => setSelectedRoomId(null)} />
      )}
      <CreateCircleModal isOpen={isCreateCircleOpen} onClose={() => setIsCreateCircleOpen(false)} />
    </main>
  );
};

export const App: React.FC = () => {
  const { session, loading } = useAuth();
  const [splashDone, setSplashDone] = useState(false);

  // Show splash once per session
  useEffect(() => {
    const seen = sessionStorage.getItem('orbit_splash_seen');
    if (seen) setSplashDone(true);
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('orbit_splash_seen', '1');
    setSplashDone(true);
  };

  if (!splashDone) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Still loading auth state
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#070d1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid rgba(23,182,200,0.2)', borderTop: '3px solid #17b6c8', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Not authenticated - show auth screen
  if (!session) {
    return <AuthScreen />;
  }

  // Authenticated - show main app
  return (
    <OrbitProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-surface)' }}>
        <Header />
        <MainContent />
        <Navigation />
        <ShareIntakeModal />
      </div>
    </OrbitProvider>
  );
};

export default App;
