import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MovieCard } from './MovieCard';
import { Movie } from '../../types/movie';
import { cn } from '../../utils/cn';

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  onAddToWatchlist?: (movieId: string) => void;
  onRemoveFromWatchlist?: (movieId: string) => void;
  onShare?: (movie: Movie) => void;
  watchlistItems?: string[];
}

export function MovieCarousel({
  title,
  movies,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  onShare,
  watchlistItems = []
}: MovieCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  const scrollAmount = 800;
  
  const handleScroll = () => {
    if (!carouselRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
  };
  
  const scrollLeft = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };
  
  const scrollRight = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };
  
  return (
    <div className="mb-10">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 px-4">{title}</h2>
      
      <div className="relative group">
        {/* Left Arrow */}
        <button 
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-1 rounded-full",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            !showLeftArrow && "invisible"
          )}
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
        
        {/* Movies Carousel */}
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto pb-4 scrollbar-hide snap-x"
          onScroll={handleScroll}
        >
          {movies.map(movie => (
            <div 
              key={movie.id} 
              className="flex-none w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px] px-2 snap-start"
            >
              <MovieCard 
                movie={movie} 
                isInWatchlist={watchlistItems.includes(movie.id)}
                onAddToWatchlist={onAddToWatchlist}
                onRemoveFromWatchlist={onRemoveFromWatchlist}
                onShare={onShare}
              />
            </div>
          ))}
        </div>
        
        {/* Right Arrow */}
        <button 
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-1 rounded-full",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            !showRightArrow && "invisible"
          )}
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}