export interface Recommendation {
  id: string;
  fromUserId: string;
  fromUsername: string;
  fromUserAvatar?: string;
  toUserId: string;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'accepted' | 'declined' | 'watched';
  createdAt: string;
  viewedAt?: string;
}

export interface PersonalizedRecommendation {
  movieId: string;
  score: number;
  reasons: string[];
  basedOn: {
    type: 'genre' | 'actor' | 'director' | 'similar_users' | 'trending';
    data: any;
  }[];
}