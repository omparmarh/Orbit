import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Circle, OrbitItem, OrbitNotification, ShareIntake } from '../types/orbit';
import { CURRENT_USER, INITIAL_CIRCLES, INITIAL_ITEMS, INITIAL_NOTIFICATIONS } from '../data/seedData';
import { playPopSound, playVoteSound, playChimeSound } from '../utils/sound';

type Tab = 'home' | 'discover' | 'rooms' | 'circles' | 'profile';

interface OrbitContextType {
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  circles: Circle[];
  items: OrbitItem[];
  notifications: OrbitNotification[];
  unreadNotificationsCount: number;
  markNotificationsAsRead: () => void;
  
  // Intake modal state
  isIntakeOpen: boolean;
  setIsIntakeOpen: (open: boolean) => void;
  pendingIntake: ShareIntake | null;
  setPendingIntake: (intake: ShareIntake | null) => void;

  // Bookmarks / Saved state
  savedItemIds: string[];
  toggleBookmark: (itemId: string) => void;

  // Actions
  addCircle: (circle: Circle) => void;
  addItem: (item: OrbitItem) => void;
  votePoll: (itemId: string, optionId: string) => void;
  reactToItem: (itemId: string, reactionType: 'fire' | 'laugh' | 'mindblown' | 'heart' | 'agree') => void;
  addComment: (itemId: string, text: string) => void;
  toggleStreakPause: (circleId: string) => void;
  submitChallenge: (itemId: string, submission: { note?: string; contentUrl?: string }) => void;
  
  // Selected detail item/room view state
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
  selectedRoomId: string | null;
  setSelectedRoomId: (id: string | null) => void;
}

const OrbitContext = createContext<OrbitContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CIRCLES: 'orbit_circles_v1',
  ITEMS: 'orbit_items_v1',
  SAVED: 'orbit_saved_v1',
  NOTIFICATIONS: 'orbit_notifications_v1'
};

export const OrbitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [activeTab, setActiveTab] = useState<Tab>('home');

  // Hydrate from localStorage or fallback to seeds
  const [circles, setCircles] = useState<Circle[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CIRCLES);
      return stored ? JSON.parse(stored) : INITIAL_CIRCLES;
    } catch {
      return INITIAL_CIRCLES;
    }
  });

  const [items, setItems] = useState<OrbitItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ITEMS);
      return stored ? JSON.parse(stored) : INITIAL_ITEMS;
    } catch {
      return INITIAL_ITEMS;
    }
  });

  const [savedItemIds, setSavedItemIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVED);
      return stored ? JSON.parse(stored) : [INITIAL_ITEMS[0]?.id || 'item_1'];
    } catch {
      return [INITIAL_ITEMS[0]?.id || 'item_1'];
    }
  });

  const [notifications, setNotifications] = useState<OrbitNotification[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CIRCLES, JSON.stringify(circles));
    } catch { /* ignore quota errors */ }
  }, [circles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    } catch { /* ignore */ }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(savedItemIds));
    } catch { /* ignore */ }
  }, [savedItemIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch { /* ignore */ }
  }, [notifications]);
  
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [pendingIntake, setPendingIntake] = useState<ShareIntake | null>(null);
  
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleBookmark = (itemId: string) => {
    playVoteSound();
    setSavedItemIds(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        playChimeSound();
        return [...prev, itemId];
      }
    });
  };

  const addCircle = (newCircle: Circle) => {
    playChimeSound();
    setCircles(prev => [newCircle, ...prev]);
  };

  const addItem = (newItem: OrbitItem) => {
    playChimeSound();
    setItems(prev => [newItem, ...prev]);
  };

  const votePoll = (itemId: string, optionId: string) => {
    playVoteSound();
    setItems(prev => prev.map(item => {
      if (item.id !== itemId || !item.poll) return item;
      const updatedOptions = item.poll.options.map(opt => {
        const hasVoted = opt.votedUserIds.includes(currentUser.id);
        if (opt.id === optionId) {
          return {
            ...opt,
            votes: hasVoted ? opt.votes : opt.votes + 1,
            votedUserIds: hasVoted ? opt.votedUserIds : [...opt.votedUserIds, currentUser.id]
          };
        }
        return opt;
      });
      return {
        ...item,
        poll: {
          ...item.poll,
          options: updatedOptions,
          totalVotes: item.poll.totalVotes + 1
        }
      };
    }));
  };

  const reactToItem = (itemId: string, _reactionType: 'fire' | 'laugh' | 'mindblown' | 'heart' | 'agree') => {
    playPopSound();
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          reactionsCount: item.reactionsCount + 1
        };
      }
      return item;
    }));
  };

  const addComment = (itemId: string, _text: string) => {
    playPopSound();
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          commentsCount: item.commentsCount + 1
        };
      }
      return item;
    }));
  };

  const toggleStreakPause = (circleId: string) => {
    playVoteSound();
    setCircles(prev => prev.map(c => {
      if (c.id === circleId) {
        return { ...c, streakPaused: !c.streakPaused };
      }
      return c;
    }));
  };

  const submitChallenge = (itemId: string, submission: { note?: string; contentUrl?: string }) => {
    playChimeSound();
    setItems(prev => prev.map(item => {
      if (item.id !== itemId || !item.challenge) return item;
      const newSubmission = {
        id: `sub_${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.displayName,
        userAvatar: currentUser.avatarUrl,
        contentUrl: submission.contentUrl,
        note: submission.note,
        submittedAt: new Date().toISOString(),
        upvotes: 1
      };
      return {
        ...item,
        challenge: {
          ...item.challenge,
          submissions: [newSubmission, ...(item.challenge.submissions || [])]
        }
      };
    }));
  };

  return (
    <OrbitContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        activeTab,
        setActiveTab,
        circles,
        items,
        notifications,
        unreadNotificationsCount,
        markNotificationsAsRead,
        isIntakeOpen,
        setIsIntakeOpen,
        pendingIntake,
        setPendingIntake,
        savedItemIds,
        toggleBookmark,
        addCircle,
        addItem,
        votePoll,
        reactToItem,
        addComment,
        toggleStreakPause,
        submitChallenge,
        selectedItemId,
        setSelectedItemId,
        selectedRoomId,
        setSelectedRoomId
      }}
    >
      {children}
    </OrbitContext.Provider>
  );
};

export const useOrbit = () => {
  const context = useContext(OrbitContext);
  if (!context) {
    throw new Error('useOrbit must be used within an OrbitProvider');
  }
  return context;
};
