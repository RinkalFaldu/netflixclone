export interface Review {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  movieId: string;
  movieTitle: string;
  rating: number; // 1-10
  content: string;
  spoilerWarning: boolean;
  likes: number;
  dislikes: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    [key: number]: number; // rating -> count
  };
}

export interface UserReaction {
  id: string;
  userId: string;
  reviewId: string;
  type: 'like' | 'dislike';
  createdAt: string;
}