import type { User, Circle, OrbitItem, OrbitNotification } from '../types/orbit';

export const CURRENT_USER: User = {
  id: 'usr_me',
  email: 'alex@orbit.app',
  handle: '@alex_orbit',
  displayName: 'Alex Chen',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  bio: 'Exploring short video ideas & group challenges 🚀',
  interests: ['Tech & AI', 'Cooking & Recipes', 'Fitness Challenges', 'Travel & Vibes'],
  joinedAt: '2026-09-01T10:00:00Z',
};

export const INITIAL_INTERESTS = [
  'Tech & AI',
  'Cooking & Recipes',
  'Fitness Challenges',
  'Travel & Vibes',
  'Campus Life',
  'Cinema & Memes',
  'Design & Art',
  'Music & Beats'
];

export const INITIAL_CIRCLES: Circle[] = [
  {
    id: 'circle_1',
    name: 'Weekend Chefs 🍳',
    description: 'We turn viral food Reels into real Sunday cooking sessions.',
    visibility: 'discoverable',
    ownerId: 'usr_me',
    rules: ['Post food proof by Sunday evening', 'Be nice with recipe tweaks'],
    avatarUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=200&q=80',
    memberCount: 14,
    activeStreakDays: 5,
    streakPaused: false
  },
  {
    id: 'circle_2',
    name: 'Campus Debates 🎓',
    description: 'Hot takes on campus events, trending polls, and video breakdowns.',
    visibility: 'discoverable',
    ownerId: 'usr_2',
    rules: ['Cite sources for claims', 'Respect all opinions'],
    avatarUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=200&q=80',
    memberCount: 42,
    activeStreakDays: 12,
    streakPaused: false
  },
  {
    id: 'circle_3',
    name: 'Tech & AI Innovators 🤖',
    description: 'Sharing break-through AI demos, code snippets, and tech reels.',
    visibility: 'discoverable',
    ownerId: 'usr_3',
    rules: ['No spam', 'Highlight original creator attribution'],
    avatarUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80',
    memberCount: 88,
    activeStreakDays: 3,
    streakPaused: false
  },
  {
    id: 'circle_4',
    name: 'Wanderlust Trips ✈️',
    description: 'Saved travel Reels, trip itinerary votes, and hostel spot reviews.',
    visibility: 'invite_only',
    ownerId: 'usr_me',
    rules: ['Tag locations clearly', 'Add budget estimates'],
    avatarUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=200&q=80',
    memberCount: 8,
    activeStreakDays: 0,
    streakPaused: true
  },
  {
    id: 'circle_5',
    name: 'Morning Routine Crew 🌅',
    description: 'Daily 7 AM accountability challenges, workout reels, and streak checks.',
    visibility: 'discoverable',
    ownerId: 'usr_4',
    rules: ['Daily check-in before 9 AM'],
    avatarUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=200&q=80',
    memberCount: 29,
    activeStreakDays: 21,
    streakPaused: false
  },
  {
    id: 'circle_6',
    name: 'Indie Film & Edits 🎬',
    description: 'Deconstructing video editing tricks, camera transitions, and audio syncs.',
    visibility: 'discoverable',
    ownerId: 'usr_5',
    rules: ['Detailed feedback welcome'],
    avatarUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=200&q=80',
    memberCount: 53,
    activeStreakDays: 4,
    streakPaused: false
  }
];

export const INITIAL_ITEMS: OrbitItem[] = [
  {
    id: 'item_1',
    creator: {
      id: 'usr_2',
      email: 'maya@orbit.app',
      handle: '@maya_cooks',
      displayName: 'Maya Lin',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      interests: ['Cooking & Recipes'],
      joinedAt: '2026-08-10T10:00:00Z'
    },
    kind: 'link',
    sourceUrl: 'https://www.instagram.com/reel/C3x9Lk-oP12/',
    sourcePlatform: 'Instagram',
    title: 'Smoky Garlic Butter Ramen (15 Min Recipe)',
    caption: 'Should our Weekend Chefs circle try making this version this Saturday?',
    reasonTag: 'Recipe',
    thumbnailUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    visibility: 'circle',
    circleId: 'circle_1',
    circleName: 'Weekend Chefs 🍳',
    rightsStatus: 'LINK_ONLY',
    createdAt: '2026-09-24T08:30:00Z',
    commentsCount: 6,
    reactionsCount: 18,
    activeRoom: {
      id: 'room_1',
      itemId: 'item_1',
      circleId: 'circle_1',
      title: 'Ramen Recipe Debate & Prep Session',
      type: 'live_watch',
      state: 'active',
      activeParticipantsCount: 5,
      startsAt: '2026-09-24T08:35:00Z'
    }
  },
  {
    id: 'item_2',
    creator: CURRENT_USER,
    kind: 'poll',
    title: 'Next Destination for Winter Break Trip?',
    caption: 'Vote between Kyoto or Reykjavik for our Wanderlust trip!',
    reasonTag: 'Weekend Idea',
    visibility: 'circle',
    circleId: 'circle_4',
    circleName: 'Wanderlust Trips ✈️',
    rightsStatus: 'USER_LICENSED',
    createdAt: '2026-09-23T14:15:00Z',
    commentsCount: 12,
    reactionsCount: 24,
    poll: {
      id: 'poll_1',
      question: 'Where should Wanderlust Crew go for 5 days?',
      options: [
        { id: 'opt_1', text: 'Kyoto, Japan (Food & Temples)', votes: 8, votedUserIds: ['usr_me'] },
        { id: 'opt_2', text: 'Reykjavik, Iceland (Northern Lights)', votes: 5, votedUserIds: [] },
        { id: 'opt_3', text: 'Lisbon, Portugal (Coastline)', votes: 3, votedUserIds: [] }
      ],
      totalVotes: 16
    }
  },
  {
    id: 'item_3',
    creator: {
      id: 'usr_3',
      email: 'devin@orbit.app',
      handle: '@devin_ai',
      displayName: 'Devin Vance',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      interests: ['Tech & AI'],
      joinedAt: '2026-07-20T10:00:00Z'
    },
    kind: 'challenge',
    title: '3-Day AI Prompting Challenge',
    caption: 'Create a fully working browser app using only 3 prompts and share your screen recording below.',
    reasonTag: 'Must Watch',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    visibility: 'public',
    circleId: 'circle_3',
    circleName: 'Tech & AI Innovators 🤖',
    rightsStatus: 'USER_LICENSED',
    createdAt: '2026-09-22T09:00:00Z',
    commentsCount: 14,
    reactionsCount: 45,
    challenge: {
      id: 'ch_1',
      title: '3-Day AI Prompting Challenge',
      description: 'Build an interactive tool using web stack in under 3 prompts!',
      type: 'try_it',
      rules: ['Share working preview or video', 'Attach prompts used'],
      closesAt: '2026-09-27T23:59:59Z',
      submissions: [
        {
          id: 'sub_1',
          userId: 'usr_me',
          userName: 'Alex Chen',
          userAvatar: CURRENT_USER.avatarUrl,
          note: 'Built a 3D orbital audio visualizer in 2 prompts!',
          submittedAt: '2026-09-23T18:00:00Z',
          upvotes: 12
        }
      ]
    }
  }
];

export const INITIAL_NOTIFICATIONS: OrbitNotification[] = [
  {
    id: 'notif_1',
    recipientId: 'usr_me',
    actor: {
      displayName: 'Maya Lin',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
    },
    type: 'room_start',
    title: 'Live Room Started',
    message: 'started a live discussion room in Weekend Chefs 🍳',
    targetItemId: 'item_1',
    targetRoomId: 'room_1',
    read: false,
    createdAt: '2026-09-24T08:35:00Z'
  },
  {
    id: 'notif_2',
    recipientId: 'usr_me',
    actor: {
      displayName: 'Devin Vance',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    type: 'reaction',
    title: 'Upvoted your challenge submission',
    message: 'liked your entry in 3-Day AI Prompting Challenge',
    targetItemId: 'item_3',
    read: true,
    createdAt: '2026-09-23T19:12:00Z'
  }
];
