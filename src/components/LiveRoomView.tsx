import React, { useState, useEffect, useRef } from 'react';
import { useOrbit } from '../context/OrbitContext';
import { Send, Radio, BarChart3, MessageSquare } from 'lucide-react';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  type: 'message' | 'reaction' | 'system';
}

interface RoomPoll {
  question: string;
  options: { text: string; votes: number }[];
  totalVotes: number;
}

const MOCK_PARTICIPANTS = [
  { id: 'usr_me', name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
  { id: 'usr_2', name: 'Maya Lin', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
  { id: 'usr_3', name: 'Devin Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
  { id: 'usr_4', name: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80' },
  { id: 'usr_5', name: 'Kai Tanaka', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
];

export const LiveRoomView: React.FC<{ roomId: string; onClose: () => void }> = ({ roomId, onClose }) => {
  const { items, currentUser } = useOrbit();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Find the item associated with this room
  const roomItem = items.find(i => i.activeRoom?.id === roomId);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'sys_1',
      userId: 'system',
      userName: 'Orbit',
      userAvatar: '',
      text: '🎉 Room is now live! Everyone can react, chat, and vote in real-time.',
      timestamp: '2026-09-24T11:00:00.000Z',
      type: 'system',
    },
    {
      id: 'msg_1',
      userId: 'usr_2',
      userName: 'Maya Lin',
      userAvatar: MOCK_PARTICIPANTS[1].avatar,
      text: 'Hey everyone! Let\'s watch this together and discuss.',
      timestamp: '2026-09-24T11:02:00.000Z',
      type: 'message',
    },
    {
      id: 'msg_2',
      userId: 'usr_3',
      userName: 'Devin Vance',
      userAvatar: MOCK_PARTICIPANTS[2].avatar,
      text: 'This is going to be so good 🔥',
      timestamp: '2026-09-24T11:03:00.000Z',
      type: 'message',
    },
  ]);

  const [messageInput, setMessageInput] = useState('');
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [roomPoll, setRoomPoll] = useState<RoomPoll>({
    question: 'Should we try making this ourselves this weekend?',
    options: [
      { text: 'Absolutely yes!', votes: 3 },
      { text: 'Maybe next week', votes: 1 },
      { text: 'Just watching for fun', votes: 2 },
    ],
    totalVotes: 6,
  });
  const [hasVoted, setHasVoted] = useState(false);
  const [showPoll, setShowPoll] = useState(true);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Simulated incoming messages
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMessages = [
        '😂 That part was hilarious',
        'Wait, rewind that — did you see the technique?',
        'This is giving me ideas for our next challenge',
        '🤯 Mind blown by this edit',
        'We should definitely try this approach',
      ];
      const randomUser = MOCK_PARTICIPANTS[Math.floor(Math.random() * (MOCK_PARTICIPANTS.length - 1)) + 1];
      const newMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        userId: randomUser.id,
        userName: randomUser.name,
        userAvatar: randomUser.avatar,
        text: randomMessages[Math.floor(Math.random() * randomMessages.length)],
        timestamp: new Date().toISOString(),
        type: 'message',
      };
      setChatMessages(prev => [...prev.slice(-50), newMsg]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    const msg: ChatMessage = {
      id: `msg_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.displayName,
      userAvatar: currentUser.avatarUrl,
      text: messageInput.trim(),
      timestamp: new Date().toISOString(),
      type: 'message',
    };
    setChatMessages(prev => [...prev, msg]);
    setMessageInput('');
  };

  const reactionIdRef = useRef(0);

  const triggerReaction = (emoji: string) => {
    reactionIdRef.current += 1;
    const id = reactionIdRef.current;
    const x = 20 + ((id * 37) % 60);
    setFloatingReactions(prev => [...prev, { id, emoji, x }]);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== id));
    }, 2000);
  };

  const voteOnPoll = (index: number) => {
    if (hasVoted) return;
    setRoomPoll(prev => {
      const updated = { ...prev };
      updated.options = prev.options.map((opt, i) =>
        i === index ? { ...opt, votes: opt.votes + 1 } : opt
      );
      updated.totalVotes = prev.totalVotes + 1;
      return updated;
    });
    setHasVoted(true);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'var(--color-ink)',
        display: 'flex',
        flexDirection: 'column',
        color: '#FFF',
      }}
    >
      {/* Room Header */}
      <div
        style={{
          padding: '14px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(19, 34, 56, 0.95)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#FF4444',
              animation: 'pulse 1.5s infinite',
              boxShadow: '0 0 8px #FF4444',
            }}
          />
          <div>
            <h3 style={{ fontSize: '15px', margin: 0, color: '#FFF' }}>
              {roomItem?.activeRoom?.title || 'Live Discussion Room'}
            </h3>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              Around: {roomItem?.title || 'Shared Content'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Participant Avatars */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {MOCK_PARTICIPANTS.slice(0, 4).map((p, i) => (
              <img
                key={p.id}
                src={p.avatar}
                alt={p.name}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: '2px solid var(--color-ink)',
                  objectFit: 'cover',
                  marginLeft: i === 0 ? 0 : '-8px',
                  zIndex: 10 - i,
                }}
              />
            ))}
            <span style={{ marginLeft: '8px', fontSize: '12px', fontWeight: 700, color: 'var(--color-live-cyan)' }}>
              {MOCK_PARTICIPANTS.length} live
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(255, 68, 68, 0.2)',
              color: '#FF4444',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            Leave Room
          </button>
        </div>
      </div>

      {/* Main Content Area: Media + Chat side by side on desktop, stacked on mobile */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Media / Content Side */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            minWidth: 0,
          }}
        >
          {/* Content thumbnail / video placeholder */}
          {roomItem?.thumbnailUrl ? (
            <img
              src={roomItem.thumbnailUrl}
              alt={roomItem.title}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '32px', color: 'rgba(255,255,255,0.5)' }}>
              <Radio size={48} style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '16px' }}>Live Discussion Room</p>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>Chat and react in real-time with your circle</p>
            </div>
          )}

          {/* Floating Reactions Overlay */}
          {floatingReactions.map(r => (
            <div
              key={r.id}
              style={{
                position: 'absolute',
                bottom: '60px',
                left: `${r.x}%`,
                fontSize: '28px',
                animation: 'floatUp 2s ease-out forwards',
                pointerEvents: 'none',
                zIndex: 50,
              }}
            >
              {r.emoji}
            </div>
          ))}

          {/* Reaction Bar at bottom of media */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '12px',
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {['🔥', '😂', '🤯', '❤️', '🤝', '👏'].map(emoji => (
              <button
                key={emoji}
                onClick={() => triggerReaction(emoji)}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.15s ease, background-color 0.15s ease',
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Chat & Poll Sidebar */}
        <div
          style={{
            width: '340px',
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(19, 34, 56, 0.9)',
          }}
        >
          {/* Sidebar Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              onClick={() => setShowPoll(false)}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '12px',
                fontWeight: 700,
                color: !showPoll ? 'var(--color-live-cyan)' : 'rgba(255,255,255,0.5)',
                borderBottom: !showPoll ? '2px solid var(--color-live-cyan)' : '2px solid transparent',
              }}
            >
              <MessageSquare size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Chat
            </button>
            <button
              onClick={() => setShowPoll(true)}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '12px',
                fontWeight: 700,
                color: showPoll ? 'var(--color-signal-orange)' : 'rgba(255,255,255,0.5)',
                borderBottom: showPoll ? '2px solid var(--color-signal-orange)' : '2px solid transparent',
              }}
            >
              <BarChart3 size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Live Poll
            </button>
          </div>

          {/* Chat View */}
          {!showPoll && (
            <>
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                {chatMessages.map(msg => (
                  <div key={msg.id} style={{ marginBottom: '10px' }}>
                    {msg.type === 'system' ? (
                      <div style={{ textAlign: 'center', padding: '8px', fontSize: '12px', color: 'var(--color-live-cyan)', backgroundColor: 'rgba(23, 182, 200, 0.1)', borderRadius: 'var(--radius-sm)' }}>
                        {msg.text}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <img
                          src={msg.userAvatar}
                          alt={msg.userName}
                          style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                        />
                        <div>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'baseline' }}>
                            <strong style={{ fontSize: '12px', color: msg.userId === currentUser.id ? 'var(--color-live-cyan)' : 'rgba(255,255,255,0.9)' }}>
                              {msg.userName}
                            </strong>
                            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.4', margin: '2px 0 0' }}>{msg.text}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form
                onSubmit={sendMessage}
                style={{
                  padding: '10px 12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  gap: '8px',
                }}
              >
                <input
                  type="text"
                  placeholder="Say something..."
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    fontSize: '13px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFF',
                    borderRadius: 'var(--radius-full)',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--color-live-cyan)',
                    color: '#FFF',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Send size={14} />
                </button>
              </form>
            </>
          )}

          {/* Live Poll View */}
          {showPoll && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', color: '#FFF', marginBottom: '4px' }}>
                  {roomPoll.question}
                </h4>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                  {roomPoll.totalVotes} votes • {hasVoted ? 'You voted' : 'Tap to vote'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {roomPoll.options.map((opt, idx) => {
                  const pct = roomPoll.totalVotes > 0 ? Math.round((opt.votes / roomPoll.totalVotes) * 100) : 0;
                  return (
                    <button
                      key={idx}
                      onClick={() => voteOnPoll(idx)}
                      disabled={hasVoted}
                      style={{
                        position: 'relative',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        textAlign: 'left',
                        overflow: 'hidden',
                        cursor: hasVoted ? 'default' : 'pointer',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          bottom: 0,
                          width: `${pct}%`,
                          backgroundColor: 'rgba(255, 156, 74, 0.2)',
                          transition: 'width 0.4s ease',
                        }}
                      />
                      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', zIndex: 1, fontSize: '13px', color: '#FFF' }}>
                        <span>{opt.text}</span>
                        <span style={{ fontWeight: 700, color: 'var(--color-signal-orange)' }}>{pct}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
