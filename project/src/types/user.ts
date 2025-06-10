export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  username: string;
  avatar?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUsername: string;
  fromAvatar?: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  type: 'added-movie' | 'recommended-movie' | 'became-friends';
  data: {
    movieId?: string;
    movieTitle?: string;
    friendId?: string;
    friendName?: string;
  };
  createdAt: string;
}