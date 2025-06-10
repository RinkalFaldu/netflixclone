import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Plus, Check } from 'lucide-react';
import { TrendingMovie } from '../../types/movie';

interface HeroSectionProps {
  movie: TrendingMovie;
  isInWatchlist?: boolean;
  onAddToWatchlist?: (movieId: string) => void;
  onRemoveFromWatchlist?: (movieId: string) => void;
}

export function HeroSection({
  movie,
  isInWatchlist = false,
  onAddToWatchlist,
  onRemoveFromWatchlist
}: HeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const backdropUrl = movie.backdropPath || 'https://images.pexels.com/photos/1632039/pexels-photo-1632039.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  
  return (
    <div className="relative w-full h-[70vh] min-h-[30rem]">
      {/* Backdrop image */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={backdropUrl} 
          alt={movie.title}
          className={`w-full h-full object-cover object-center transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/40 to-netflix-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-black/90 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full px-4 md:px-12 pb-24 md:pb-32 max-w-3xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
          {movie.title}
        </h1>
        
        <div className="flex items-center text-sm text-gray-300 mb-4 space-x-4">
          <span className="text-green-500 font-semibold">{movie.voteAverage.toFixed(1)} Rating</span>
          <span>{new Date(movie.releaseDate).getFullYear()}</span>
        </div>
        
        <p className="text-gray-300 text-base md:text-lg mb-6 line-clamp-3 md:line-clamp-4">
          {movie.overview}
        </p>
        
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to={`/movie/${movie.id}`}
            className="flex items-center bg-white hover:bg-white/90 text-black font-semibold px-6 py-2 rounded transition"
          >
            <Play size={20} className="mr-2" />
            Play
          </Link>
          
          <Link
            to={`/movie/${movie.id}`}
            className="flex items-center bg-gray-600/80 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded transition"
          >
            <Info size={20} className="mr-2" />
            More Info
          </Link>
          
          {isInWatchlist ? (
            <button
              onClick={() => onRemoveFromWatchlist && onRemoveFromWatchlist(movie.id)}
              className="flex items-center bg-gray-800/80 hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded transition"
              title="Remove from My List"
            >
              <Check size={20} className="mr-2 text-netflix-red" />
              Remove from List
            </button>
          ) : (
            <button
              onClick={() => onAddToWatchlist && onAddToWatchlist(movie.id)}
              className="flex items-center bg-gray-800/80 hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded transition"
              title="Add to My List"
            >
              <Plus size={20} className="mr-2" />
              Add to My List
            </button>
          )}
        </div>
      </div>
    </div>
  );
}