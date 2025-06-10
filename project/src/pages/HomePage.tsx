import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useMovies } from '../hooks/useMovies';
import { useAuth } from '../hooks/useAuth';
import { HeroSection } from '../components/movies/HeroSection';
import { MovieCarousel } from '../components/movies/MovieCarousel';
import { MovieCard } from '../components/movies/MovieCard';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { Movie } from '../types/movie';
import { addToWatchlist, removeFromWatchlist, isInWatchlist, getWatchlist } from '../services/watchlist';

export function HomePage() {
  const location = useLocation();
  const { trending, popular, topRated, loading, searchMoviesList } = useMovies();
  const { user } = useAuth();
  
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [watchlistItems, setWatchlistItems] = useState<string[]>([]);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);
  
  // Get search query from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('search');
    
    if (query) {
      setIsSearching(true);
      searchMoviesList(query)
        .then(results => {
          setSearchResults(results);
          setIsSearching(false);
        })
        .catch(error => {
          console.error('Search error:', error);
          setIsSearching(false);
        });
    } else {
      setSearchResults([]);
    }
  }, [location.search, searchMoviesList]);
  
  // Fetch watchlist items if user is logged in
  useEffect(() => {
    if (user) {
      setLoadingWatchlist(true);
      getWatchlist(user.id)
        .then(items => {
          setWatchlistItems(items.map(item => item.movieId));
        })
        .catch(error => {
          console.error('Failed to fetch watchlist:', error);
        })
        .finally(() => {
          setLoadingWatchlist(false);
        });
    } else {
      setWatchlistItems([]);
      setLoadingWatchlist(false);
    }
  }, [user]);
  
  // Handle adding to watchlist
  const handleAddToWatchlist = async (movieId: string) => {
    if (!user) return;
    
    try {
      const movie = [...trending, ...popular, ...topRated].find(m => m.id === movieId);
      if (!movie) return;
      
      await addToWatchlist(user.id, movieId, movie);
      setWatchlistItems(prev => [...prev, movieId]);
    } catch (error) {
      console.error('Failed to add to watchlist:', error);
    }
  };
  
  // Handle removing from watchlist
  const handleRemoveFromWatchlist = async (movieId: string) => {
    if (!user) return;
    
    try {
      const watchlist = await getWatchlist(user.id);
      const item = watchlist.find(item => item.movieId === movieId);
      if (!item) return;
      
      await removeFromWatchlist(user.id, item.id);
      setWatchlistItems(prev => prev.filter(id => id !== movieId));
    } catch (error) {
      console.error('Failed to remove from watchlist:', error);
    }
  };
  
  // Handle sharing movie
  const handleShareMovie = (movie: Movie) => {
    console.log('Share movie:', movie);
    // This would open a modal to share with friends in a real implementation
    alert(`Feature coming soon: Share "${movie.title}" with your friends!`);
  };
  
  if (loading || loadingWatchlist) {
    return <LoadingScreen />;
  }
  
  const searchQuery = new URLSearchParams(location.search).get('search');
  
  return (
    <div className="pb-8">
      {!searchQuery && trending.length > 0 && (
        <HeroSection 
          movie={trending[0]} 
          isInWatchlist={watchlistItems.includes(trending[0].id)}
          onAddToWatchlist={handleAddToWatchlist}
          onRemoveFromWatchlist={handleRemoveFromWatchlist}
        />
      )}
      
      <div className="mt-6 px-4">
        {searchQuery ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              Search Results for "{searchQuery}"
            </h2>
            
            {isSearching ? (
              <div className="flex justify-center my-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-netflix-red"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {searchResults.map(movie => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    isInWatchlist={watchlistItems.includes(movie.id)}
                    onAddToWatchlist={handleAddToWatchlist}
                    onRemoveFromWatchlist={handleRemoveFromWatchlist}
                    onShare={handleShareMovie}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center my-12">
                <p className="text-xl text-gray-400">No results found for "{searchQuery}"</p>
                <p className="mt-2 text-gray-500">Try different keywords or check your spelling</p>
              </div>
            )}
          </>
        ) : (
          <>
            <MovieCarousel 
              title="Trending Now" 
              movies={trending}
              watchlistItems={watchlistItems}
              onAddToWatchlist={handleAddToWatchlist}
              onRemoveFromWatchlist={handleRemoveFromWatchlist}
              onShare={handleShareMovie}
            />
            
            <MovieCarousel 
              title="Popular Movies" 
              movies={popular}
              watchlistItems={watchlistItems}
              onAddToWatchlist={handleAddToWatchlist}
              onRemoveFromWatchlist={handleRemoveFromWatchlist}
              onShare={handleShareMovie}
            />
            
            <MovieCarousel 
              title="Top Rated" 
              movies={topRated}
              watchlistItems={watchlistItems}
              onAddToWatchlist={handleAddToWatchlist}
              onRemoveFromWatchlist={handleRemoveFromWatchlist}
              onShare={handleShareMovie}
            />
          </>
        )}
      </div>
    </div>
  );
}