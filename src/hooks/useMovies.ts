import { useContext } from 'react';
import { MovieContext } from '../context/MovieContext';

export function useMovies() {
  const context = useContext(MovieContext);
  
  if (context === undefined) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  
  return context;
}