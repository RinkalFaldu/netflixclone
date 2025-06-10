import { Review, ReviewStats, UserReaction } from '../types/review';

// Mock reviews data
const mockReviews: Record<string, Review[]> = {};
const mockReactions: UserReaction[] = [];

// Get reviews for a movie
export async function getMovieReviews(movieId: string): Promise<Review[]> {
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockReviews[movieId] || [];
}

// Add a review
export async function addReview(
  userId: string,
  username: string,
  userAvatar: string | undefined,
  movieId: string,
  movieTitle: string,
  rating: number,
  content: string,
  spoilerWarning: boolean
): Promise<Review> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newReview: Review = {
    id: `review-${Math.random().toString(36).substring(2, 9)}`,
    userId,
    username,
    userAvatar,
    movieId,
    movieTitle,
    rating,
    content,
    spoilerWarning,
    likes: 0,
    dislikes: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  if (!mockReviews[movieId]) {
    mockReviews[movieId] = [];
  }
  
  mockReviews[movieId].push(newReview);
  return newReview;
}

// Get review statistics for a movie
export async function getReviewStats(movieId: string): Promise<ReviewStats> {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const reviews = mockReviews[movieId] || [];
  
  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: {}
    };
  }
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  
  const ratingDistribution: { [key: number]: number } = {};
  reviews.forEach(review => {
    ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
  });
  
  return {
    totalReviews: reviews.length,
    averageRating,
    ratingDistribution
  };
}

// React to a review (like/dislike)
export async function reactToReview(
  userId: string,
  reviewId: string,
  type: 'like' | 'dislike'
): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Remove existing reaction if any
  const existingReactionIndex = mockReactions.findIndex(
    reaction => reaction.userId === userId && reaction.reviewId === reviewId
  );
  
  if (existingReactionIndex !== -1) {
    mockReactions.splice(existingReactionIndex, 1);
  }
  
  // Add new reaction
  const newReaction: UserReaction = {
    id: `reaction-${Math.random().toString(36).substring(2, 9)}`,
    userId,
    reviewId,
    type,
    createdAt: new Date().toISOString()
  };
  
  mockReactions.push(newReaction);
  
  // Update review counts
  Object.values(mockReviews).forEach(reviews => {
    const review = reviews.find(r => r.id === reviewId);
    if (review) {
      // Recalculate likes and dislikes
      const reactions = mockReactions.filter(r => r.reviewId === reviewId);
      review.likes = reactions.filter(r => r.type === 'like').length;
      review.dislikes = reactions.filter(r => r.type === 'dislike').length;
    }
  });
}

// Get user's reaction to a review
export async function getUserReaction(userId: string, reviewId: string): Promise<UserReaction | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return mockReactions.find(
    reaction => reaction.userId === userId && reaction.reviewId === reviewId
  ) || null;
}