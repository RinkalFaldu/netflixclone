import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getWatchlist, removeFromWatchlist } from '../services/watchlist';
import { WatchlistItem } from '../types/movie';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { MovieCard } from '../components/movies/MovieCard';
import { Clock, X, Plus } from 'lucide-react';

export default function WatchlistPage() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    document.title = 'My List - NetflixSocial';
    
    return () => {
      document.title = 'NetflixSocial - Share Movies With Friends';
    };
  }, []);
  
  // Fetch watchlist
  useEffect(() => {
    if (!user) return;
    
    const fetchWatchlist = async () => {
      try {
        setLoading(true);
        const items = await getWatchlist(user.id);
        setWatchlist(items);
      } catch (err) {
        setError('Failed to load watchlist');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWatchlist();
  }, [user]);
  
  // Handle removing from watchlist
  const handleRemoveFromWatchlist = async (itemId: string) => {
    if (!user) return;
    
    try {
      await removeFromWatchlist(user.id, itemId);
      setWatchlist(watchlist.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Failed to remove from watchlist:', err);
    }
  };
  
  // Handle sharing movie
  const handleShareMovie = (movie: any) => {
    console.log('Share movie:', movie);
    // This would open a modal to share with friends in a real implementation
    alert(`Feature coming soon: Share "${movie.title}" with your friends!`);
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">My List</h1>
      <p className="text-gray-400 mb-8">Movies and shows you want to watch</p>
      
      {error && (
        <div className="bg-error-dark/20 border border-error-dark text-white px-4 py-3 rounded mb-8">
          {error}
        </div>
      )}
      
      {watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {watchlist.map(item => (
            <div key={item.id} className="relative group">
              <MovieCard 
                movie={item.movie}
                onShare={() => handleShareMovie(item.movie)}
              />
              
              <button
                onClick={() => handleRemoveFromWatchlist(item.id)}
                className="absolute top-2 right-2 bg-black/70 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-netflix-red transition-all duration-300"
                title="Remove from My List"
              >
                <X size={16} />
              </button>
              
              <div className="absolute bottom-0 left-0 bg-black/70 text-xs px-2 py-1 rounded-tr-md flex items-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Clock size={12} className="mr-1" />
                Added {new Date(item.addedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-netflix-gray/20 rounded-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-netflix-gray/10 rounded-full mb-4">
            <Plus size={32} className="text-netflix-red" />
          </div>
          
          <h3 className="text-xl font-semibold mb-2">Your list is empty</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Click the "+" button on any movie or show to add it to your list for later.
          </p>
          
          <Link 
            to="/" 
            className="inline-flex items-center bg-netflix-red hover:bg-netflix-red/90 text-white px-6 py-2 rounded transition"
          >
            Browse titles
          </Link>
        </div>
      )}
    </div>
  );
}