export interface Notification {
  id: string;
  userId: string;
  type: 'friend_request' | 'movie_recommendation' | 'review_like' | 'new_friend_activity' | 'system';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

export interface NotificationSettings {
  friendRequests: boolean;
  movieRecommendations: boolean;
  reviewLikes: boolean;
  friendActivity: boolean;
  systemUpdates: boolean;
  emailNotifications: boolean;
}