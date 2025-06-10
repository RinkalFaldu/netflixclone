import { createContext, useState, useEffect, ReactNode } from 'react';
import { Movie, MovieDetails, TrendingMovie } from '../types/movie';
import { fetchTrending, fetchMovieDetails, searchMovies } from '../services/tmdb';

interface MovieContextType {
  trending: TrendingMovie[];
  popular: Movie[];
  topRated: Movie[];
  loading: boolean;
  error: string | null;
  getMovieDetails: (id: string) => Promise<MovieDetails>;
  searchMoviesList: (query: string) => Promise<Movie[]>;
}

export const MovieContext = createContext<MovieContextType>({
  trending: [],
  popular: [],
  topRated: [],
  loading: false,
  error: null,
  getMovieDetails: async () => ({} as MovieDetails),
  searchMoviesList: async () => [],
});

interface MovieProviderProps {
  children: ReactNode;
}

export function MovieProvider({ children }: MovieProviderProps) {
  const [trending, setTrending] = useState<TrendingMovie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch initial movie data
  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        
        const trendingMovies = await fetchTrending();
        setTrending(trendingMovies);
        
        // In a real app, we would fetch different categories
        // For this mock, we'll use the same data with slight modifications
        setPopular(trendingMovies.map(movie => ({ 
          id: movie.id,
          title: movie.title,
          posterPath: movie.posterPath,
          releaseDate: movie.releaseDate,
          voteAverage: movie.voteAverage,
        })));
        
        setTopRated(trendingMovies.slice().reverse().map(movie => ({ 
          id: movie.id,
          title: movie.title,
          posterPath: movie.posterPath,
          releaseDate: movie.releaseDate,
          voteAverage: movie.voteAverage + 1 > 10 ? 10 : movie.voteAverage + 1, // Higher ratings for "top rated"
        })));
      } catch (err) {
        setError('Failed to fetch movies');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMovies();
  }, []);
  
  // Function to get movie details
  const getMovieDetails = async (id: string): Promise<MovieDetails> => {
    try {
      return await fetchMovieDetails(id);
    } catch (err) {
      setError('Failed to fetch movie details');
      console.error(err);
      throw err;
    }
  };
  
  // Function to search movies
  const searchMoviesList = async (query: string): Promise<Movie[]> => {
    try {
      return await searchMovies(query);
    } catch (err) {
      setError('Failed to search movies');
      console.error(err);
      throw err;
    }
  };
  
  return (
    <MovieContext.Provider
      value={{
        trending,
        popular,
        topRated,
        loading,
        error,
        getMovieDetails,
        searchMoviesList,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}