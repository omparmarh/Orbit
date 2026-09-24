import React, { useState } from 'react';
import { useOrbit } from '../context/OrbitContext';
import { Search, Sparkles, Trophy, Users, Flame, ExternalLink, ArrowRight, Compass } from 'lucide-react';

const TOPIC_CHANNELS = [
  { id: 'all', label: '🔥 All Trending', icon: '🔥' },
  { id: 'tech', label: '🤖 AI & Tech', icon: '🤖' },
  { id: 'creative', label: '🎨 Visual Arts', icon: '🎨' },
  { id: 'culinary', label: '🍜 Culinary Lab', icon: '🍜' },
  { id: 'cinema', label: '🎬 Film & Sound', icon: '🎬' },
  { id: 'books', label: '📚 Lore & Books', icon: '📚' }
];

export const DiscoverView: React.FC = () => {
  const { items, circles, setSelectedItemId, setIsIntakeOpen, setPendingIntake } = useOrbit();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter items based on search and category
  const filteredItems = items.filter(item => {
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.circleName && item.circleName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    if (!matchesSearch) return false;

    if (activeCategory === 'all') return true;
    if (activeCategory === 'tech') return item.tags?.includes('tech') || item.title.toLowerCase().includes('ai') || item.title.toLowerCase().includes('model');
    if (activeCategory === 'creative') return item.tags?.includes('creative') || item.tags?.includes('design') || item.title.toLowerCase().includes('color');
    if (activeCategory === 'culinary') return item.reasonTag === 'Recipe' || item.caption.toLowerCase().includes('coffee') || item.caption.toLowerCase().includes('food');
    if (activeCategory === 'cinema') return item.tags?.includes('cinema') || item.caption.toLowerCase().includes('film') || item.sourcePlatform === 'YouTube';
    return true;
  });

  const handleAnswerPrompt = () => {
    setPendingIntake({
      id: `intake_${Date.now()}`,
      url: 'https://youtube.com/shorts/weekly-prompt',
      title: 'Weekly Prompt: The Single Most Inspiring 30s Clip',
      sourcePlatform: 'YouTube',
      status: 'READY',
      rightsStatus: 'LINK_ONLY',
      thumbnailUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80'
    });
    setIsIntakeOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Search Header */}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Search items, circles, creators, or topics (#design, AI)..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px 12px 44px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface-card)',
            fontSize: '14px',
            color: 'var(--color-ink)',
            boxShadow: 'var(--shadow-sm)'
          }}
        />
        <Search
          size={18}
          color="var(--color-text-muted)"
          style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--color-text-muted)'
            }}
          >
            CLEAR
          </button>
        )}
      </div>

      {/* Topic Channels Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {TOPIC_CHANNELS.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              fontWeight: activeCategory === cat.id ? 700 : 500,
              backgroundColor: activeCategory === cat.id ? 'var(--color-action-blue)' : 'var(--color-surface-card)',
              color: activeCategory === cat.id ? '#FFF' : 'var(--color-text-primary)',
              border: activeCategory === cat.id ? '1px solid var(--color-action-blue)' : '1px solid var(--color-border)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all var(--transition-fast)'
            }}
          >
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Cold-Start Weekly Editorial Prompt Feature */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(255, 156, 74, 0.12) 100%)',
          border: '1px solid rgba(37, 99, 235, 0.25)',
          borderRadius: 'var(--radius-xl)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="badge badge-orange" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={12} /> WEEKLY EDITORIAL DROP #14
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            4 days left to answer
          </span>
        </div>
        <h3 style={{ fontSize: '17px', color: 'var(--color-ink)' }}>
          "What is one 30-second video that completely altered how you look at your craft or curiosity?"
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>
          Orbit seeds focused group discussions every Monday. Share a short clip, add your annotation, and get featured in the circle highlight reel!
        </p>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
          <button
            className="btn-primary"
            onClick={handleAnswerPrompt}
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            Answer Weekly Prompt <ArrowRight size={14} />
          </button>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            82 circle members have responded
          </span>
        </div>
      </div>

      {/* Featured Community Challenges */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy size={18} color="var(--color-signal-orange)" /> Trending Challenges
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--color-action-blue)', fontWeight: 600 }}>
            Collaborative Streaks
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          <div className="orbit-card" style={{ backgroundColor: 'var(--color-surface-card)', borderLeft: '4px solid var(--color-signal-orange)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span className="badge badge-orange">Try It Challenge</span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Closes Sunday</span>
            </div>
            <h4 style={{ fontSize: '15px', marginBottom: '6px', color: 'var(--color-ink)' }}>
              15-Second Espresso Dialing-In
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '12px', lineHeight: '1.4' }}>
              Record your extraction shot, grind setting, and crema result. Vote for best clarity!
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                24 submissions
              </span>
              <button
                className="btn-secondary"
                onClick={handleAnswerPrompt}
                style={{ fontSize: '12px', padding: '4px 10px' }}
              >
                Submit Clip
              </button>
            </div>
          </div>

          <div className="orbit-card" style={{ backgroundColor: 'var(--color-surface-card)', borderLeft: '4px solid var(--color-action-blue)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span className="badge badge-blue">Prediction Vote</span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>2 days left</span>
            </div>
            <h4 style={{ fontSize: '15px', marginBottom: '6px', color: 'var(--color-ink)' }}>
              Open-Weights Video Model SOTA by Q4?
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '12px', lineHeight: '1.4' }}>
              Vote with your circle and debate in the live room on Friday.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                142 votes recorded
              </span>
              <button
                className="btn-secondary"
                onClick={() => alert('Vote recorded! View results in the Live Room.')}
                style={{ fontSize: '12px', padding: '4px 10px' }}
              >
                Vote Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Curated Circles to Join */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={18} color="var(--color-action-blue)" /> Discover Curated Circles
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Focused Interest Hubs
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {circles.map(c => (
            <div
              key={c.id}
              className="orbit-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px',
                backgroundColor: 'var(--color-surface-card)'
              }}
            >
              <img
                src={c.avatarUrl}
                alt={c.name}
                style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: '14px', marginBottom: '2px', color: 'var(--color-ink)' }}>
                  {c.name}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c.description}
                </p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    <Users size={11} style={{ display: 'inline', marginRight: '3px' }} />
                    {c.memberCount} members
                  </span>
                  {c.activeStreakDays && (
                    <span style={{ fontSize: '11px', color: 'var(--color-signal-orange)', fontWeight: 600 }}>
                      🔥 {c.activeStreakDays}d streak
                    </span>
                  )}
                </div>
              </div>
              <button
                className="btn-secondary"
                onClick={() => alert(`Joined "${c.name}"! New items will appear in your home feed.`)}
                style={{ fontSize: '12px', padding: '6px 12px', flexShrink: 0 }}
              >
                Join
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Discovery Items Feed / Grid */}
      <div>
        <h3 style={{ fontSize: '16px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Flame size={18} color="var(--color-signal-orange)" /> Curated Discoveries ({filteredItems.length})
        </h3>

        {filteredItems.length === 0 ? (
          <div className="orbit-card" style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
            <p>No content matching your current filter.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="orbit-card orbit-card-interactive"
                onClick={() => setSelectedItemId(item.id)}
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  backgroundColor: 'var(--color-surface-card)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {item.thumbnailUrl && (
                  <div style={{ position: 'relative', height: '170px', backgroundColor: '#000' }}>
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {item.reasonTag && (
                      <span
                        className="badge badge-orange"
                        style={{ position: 'absolute', top: '10px', left: '10px' }}
                      >
                        {item.reasonTag}
                      </span>
                    )}
                    {item.sourcePlatform && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '10px',
                          right: '10px',
                          backgroundColor: 'rgba(19, 34, 56, 0.85)',
                          color: '#FFF',
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-full)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <ExternalLink size={10} /> {item.sourcePlatform}
                      </span>
                    )}
                  </div>
                )}
                <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '15px', marginBottom: '4px', color: 'var(--color-ink)' }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.4', marginBottom: '10px' }}>
                      {item.caption.slice(0, 100)}...
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-action-blue)', fontWeight: 600 }}>
                      in {item.circleName || 'Public'}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      🔥 {item.reactionsCount} • {item.commentsCount} comments
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
