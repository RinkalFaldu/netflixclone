import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Plus, Check, Heart, Share2 } from 'lucide-react';
import { Movie } from '../../types/movie';
import { cn } from '../../utils/cn';

interface MovieCardProps {
  movie: Movie;
  isInWatchlist?: boolean;
  onAddToWatchlist?: (movieId: string) => void;
  onRemoveFromWatchlist?: (movieId: string) => void;
  onShare?: (movie: Movie) => void;
  layout?: 'grid' | 'row';
}

export function MovieCard({
  movie,
  isInWatchlist = false,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  onShare,
  layout = 'grid'
}: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Use a placeholder image if poster is not available
  const posterUrl = movie.posterPath || 'https://images.pexels.com/photos/8892/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-md transition-all duration-300",
        layout === 'grid' ? "w-full" : "w-full md:w-1/2 lg:w-1/3 p-2",
        isHovered ? "scale-105 z-10 shadow-xl" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/movie/${movie.id}`} className="block relative aspect-[2/3]">
        <img 
          src={posterUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover rounded-md transition-opacity"
          loading="lazy"
        />
        
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        )}>
          <div className="absolute bottom-0 w-full p-3">
            <h3 className="text-white font-semibold text-base md:text-lg truncate">{movie.title}</h3>
            
            <div className="flex items-center text-sm text-gray-300 mt-1">
              <span>{new Date(movie.releaseDate).getFullYear()}</span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                {movie.voteAverage.toFixed(1)}
              </span>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <Link 
                to={`/movie/${movie.id}`} 
                className="flex items-center bg-white text-black rounded-full px-3 py-1 text-sm font-medium hover:bg-netflix-red hover:text-white transition-colors"
              >
                <Play size={14} className="mr-1" /> Play
              </Link>
              
              <div className="flex items-center space-x-2">
                {isInWatchlist ? (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      if (onRemoveFromWatchlist) onRemoveFromWatchlist(movie.id);
                    }}
                    className="bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors"
                    title="Remove from My List"
                  >
                    <Check size={16} className="text-netflix-red" />
                  </button>
                ) : (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      if (onAddToWatchlist) onAddToWatchlist(movie.id);
                    }}
                    className="bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors"
                    title="Add to My List"
                  >
                    <Plus size={16} />
                  </button>
                )}
                
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    if (onShare) onShare(movie);
                  }}
                  className="bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors"
                  title="Share with friends"
                >
                  <Share2 size={16} />
                </button>
                
                <button 
                  className="bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors"
                  title="Like"
                >
                  <Heart size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}