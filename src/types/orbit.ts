export type ContentKind = 'link' | 'original' | 'poll' | 'challenge' | 'question';

export type RightsStatus = 'LINK_ONLY' | 'USER_LICENSED' | 'PARTNER_LICENSED' | 'RESTRICTED' | 'REMOVED';

export interface User {
  id: string;
  email: string;
  handle: string;
  displayName: string;
  avatarUrl: string;
  bio?: string;
  interests: string[];
  joinedAt: string;
}

export interface Circle {
  id: string;
  name: string;
  description: string;
  visibility: 'private' | 'invite_only' | 'discoverable';
  ownerId: string;
  rules: string[];
  avatarUrl: string;
  memberCount: number;
  activeStreakDays?: number;
  streakPaused?: boolean;
}

export interface CircleMember {
  circleId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  votedUserIds: string[];
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  closesAt?: string;
}

export interface CollectionItem {
  id: string;
  itemId: string;
  title: string;
  thumbnailUrl?: string;
  addedBy: string;
  addedAt: string;
}

export interface Collection {
  id: string;
  circleId?: string;
  ownerId: string;
  title: string;
  description?: string;
  visibility: 'circle' | 'private' | 'public';
  items: CollectionItem[];
  createdAt: string;
}

export interface ChallengeSubmission {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  contentUrl?: string;
  note?: string;
  submittedAt: string;
  upvotes: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'try_it' | 'vote' | 'predict' | 'remix';
  rules: string[];
  closesAt: string;
  submissions: ChallengeSubmission[];
}

export interface Room {
  id: string;
  itemId: string;
  circleId?: string;
  title: string;
  type: 'discussion' | 'live_watch' | 'challenge_room';
  state: 'active' | 'scheduled' | 'ended';
  activeParticipantsCount: number;
  startsAt: string;
  endsAt?: string;
}

export interface Comment {
  id: string;
  itemId: string;
  author: {
    id: string;
    displayName: string;
    handle: string;
    avatarUrl: string;
  };
  body: string;
  createdAt: string;
  parentId?: string;
  reactionsCount: number;
}

export interface Reaction {
  id: string;
  targetId: string;
  userId: string;
  type: 'fire' | 'laugh' | 'mindblown' | 'heart' | 'agree';
}

export interface OrbitItem {
  id: string;
  creator: User;
  kind: ContentKind;
  sourceUrl?: string;
  sourcePlatform?: 'Instagram' | 'TikTok' | 'YouTube' | 'Original' | 'Orbit Prompt' | 'Other';
  title: string;
  caption: string;
  reasonTag?: 'Must Watch' | 'Try This' | 'Debate' | 'Weekend Idea' | 'Recipe' | 'Memory';
  thumbnailUrl?: string;
  mediaUrl?: string;
  visibility: 'circle' | 'friends' | 'public';
  circleId?: string;
  circleName?: string;
  rightsStatus: RightsStatus;
  createdAt: string;
  commentsCount: number;
  reactionsCount: number;
  activeRoom?: Room;
  poll?: Poll;
  challenge?: Challenge;
  tags?: string[];
}

export interface OrbitNotification {
  id: string;
  recipientId: string;
  actor: {
    displayName: string;
    avatarUrl: string;
  };
  type: 'reply' | 'reaction' | 'room_start' | 'challenge_due' | 'invite';
  title: string;
  message: string;
  targetItemId?: string;
  targetRoomId?: string;
  read: boolean;
  createdAt: string;
}

export interface ShareIntake {
  id: string;
  url: string;
  sourcePlatform: 'Instagram' | 'TikTok' | 'YouTube' | 'Other';
  title?: string;
  thumbnailUrl?: string;
  status: 'PENDING' | 'READY' | 'NEEDS_REVIEW' | 'FAILED';
  rightsStatus: RightsStatus;
  canonicalUrl?: string;
}
