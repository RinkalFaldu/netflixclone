import { WatchlistItem } from '../types/movie';

// Mock watchlist data
const mockWatchlist: Record<string, WatchlistItem[]> = {};

// Add a movie to watchlist
export async function addToWatchlist(userId: string, movieId: string, movie: any): Promise<WatchlistItem> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Create new watchlist item
  const newItem: WatchlistItem = {
    id: `watchlist-${Math.random().toString(36).substring(2, 9)}`,
    userId,
    movieId,
    movie,
    addedAt: new Date().toISOString()
  };
  
  // Initialize user's watchlist if it doesn't exist
  if (!mockWatchlist[userId]) {
    mockWatchlist[userId] = [];
  }
  
  // Check if the movie is already in the watchlist
  const existingItem = mockWatchlist[userId].find(item => item.movieId === movieId);
  if (existingItem) {
    throw new Error('Movie already in watchlist');
  }
  
  // Add to watchlist
  mockWatchlist[userId].push(newItem);
  
  return newItem;
}

// Remove a movie from watchlist
export async function removeFromWatchlist(userId: string, itemId: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check if user's watchlist exists
  if (!mockWatchlist[userId]) {
    throw new Error('Watchlist not found');
  }
  
  // Find item index
  const itemIndex = mockWatchlist[userId].findIndex(item => item.id === itemId);
  if (itemIndex === -1) {
    throw new Error('Watchlist item not found');
  }
  
  // Remove item
  mockWatchlist[userId].splice(itemIndex, 1);
}

// Get user's watchlist
export async function getWatchlist(userId: string): Promise<WatchlistItem[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Return user's watchlist or empty array if it doesn't exist
  return mockWatchlist[userId] || [];
}

// Check if a movie is in the user's watchlist
export async function isInWatchlist(userId: string, movieId: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Check if user's watchlist exists
  if (!mockWatchlist[userId]) {
    return false;
  }
  
  // Check if movie is in watchlist
  return mockWatchlist[userId].some(item => item.movieId === movieId);
}