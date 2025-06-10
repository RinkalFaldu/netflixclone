import { Recommendation, PersonalizedRecommendation } from '../types/recommendation';
import { Movie } from '../types/movie';

// Mock recommendations data
const mockRecommendations: Record<string, Recommendation[]> = {};
const mockPersonalizedRecs: Record<string, PersonalizedRecommendation[]> = {};

// Send a movie recommendation to a friend
export async function sendRecommendation(
  fromUserId: string,
  fromUsername: string,
  fromUserAvatar: string | undefined,
  toUserId: string,
  movieId: string,
  movieTitle: string,
  moviePoster: string,
  message: string,
  priority: 'low' | 'medium' | 'high' = 'medium'
): Promise<Recommendation> {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const newRecommendation: Recommendation = {
    id: `rec-${Math.random().toString(36).substring(2, 9)}`,
    fromUserId,
    fromUsername,
    fromUserAvatar,
    toUserId,
    movieId,
    movieTitle,
    moviePoster,
    message,
    priority,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  if (!mockRecommendations[toUserId]) {
    mockRecommendations[toUserId] = [];
  }
  
  mockRecommendations[toUserId].push(newRecommendation);
  return newRecommendation;
}

// Get recommendations for a user
export async function getUserRecommendations(userId: string): Promise<Recommendation[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return (mockRecommendations[userId] || [])
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Update recommendation status
export async function updateRecommendationStatus(
  recommendationId: string,
  status: 'accepted' | 'declined' | 'watched'
): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  Object.values(mockRecommendations).forEach(recommendations => {
    const rec = recommendations.find(r => r.id === recommendationId);
    if (rec) {
      rec.status = status;
      if (status === 'accepted' || status === 'declined') {
        rec.viewedAt = new Date().toISOString();
      }
    }
  });
}

// Generate personalized recommendations
export async function generatePersonalizedRecommendations(
  userId: string,
  watchlist: any[],
  friends: any[]
): Promise<PersonalizedRecommendation[]> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock personalized recommendations based on user data
  const recommendations: PersonalizedRecommendation[] = [
    {
      movieId: '7',
      score: 0.95,
      reasons: ['Based on your love for sci-fi movies', 'Highly rated by similar users'],
      basedOn: [
        { type: 'genre', data: { genre: 'Science Fiction' } },
        { type: 'similar_users', data: { similarity: 0.8 } }
      ]
    },
    {
      movieId: '8',
      score: 0.88,
      reasons: ['Trending among your friends', 'Similar to movies in your watchlist'],
      basedOn: [
        { type: 'trending', data: { friendsWatching: 3 } },
        { type: 'similar_users', data: { similarity: 0.7 } }
      ]
    },
    {
      movieId: '9',
      score: 0.82,
      reasons: ['Features actors you like', 'Critically acclaimed'],
      basedOn: [
        { type: 'actor', data: { actor: 'Ryan Gosling' } },
        { type: 'genre', data: { genre: 'Drama' } }
      ]
    }
  ];
  
  mockPersonalizedRecs[userId] = recommendations;
  return recommendations;
}