// TMDB API service with mock data for prototype

import { Movie, TrendingMovie, MovieDetails } from '../types/movie';

// Mock data for trending movies
const mockTrendingMovies: TrendingMovie[] = [
  {
    id: '1',
    title: 'Dune: Part Two',
    overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    posterPath: 'https://images.pexels.com/photos/2395249/pexels-photo-2395249.jpeg?auto=compress&cs=tinysrgb&w=600',
    backdropPath: 'https://images.pexels.com/photos/1632039/pexels-photo-1632039.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    releaseDate: '2024-03-01',
    voteAverage: 8.5
  },
  {
    id: '2',
    title: 'Oppenheimer',
    overview: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    posterPath: 'https://images.pexels.com/photos/266526/pexels-photo-266526.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    backdropPath: 'https://images.pexels.com/photos/585759/pexels-photo-585759.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    releaseDate: '2023-07-21',
    voteAverage: 8.3
  },
  {
    id: '3',
    title: 'Poor Things',
    overview: 'The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter.',
    posterPath: 'https://images.pexels.com/photos/5417664/pexels-photo-5417664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    backdropPath: 'https://images.pexels.com/photos/4288235/pexels-photo-4288235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    releaseDate: '2023-12-08',
    voteAverage: 8.0
  },
  {
    id: '4',
    title: 'The Batman',
    overview: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city\'s hidden corruption and question his family\'s involvement.',
    posterPath: 'https://images.pexels.com/photos/7991268/pexels-photo-7991268.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    backdropPath: 'https://images.pexels.com/photos/1720374/pexels-photo-1720374.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    releaseDate: '2022-03-04',
    voteAverage: 7.8
  },
  {
    id: '5',
    title: 'Everything Everywhere All at Once',
    overview: 'An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led.',
    posterPath: 'https://images.pexels.com/photos/3923549/pexels-photo-3923549.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    backdropPath: 'https://images.pexels.com/photos/924133/pexels-photo-924133.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    releaseDate: '2022-03-25',
    voteAverage: 8.4
  },
  {
    id: '6',
    title: 'Barbie',
    overview: 'Barbie suffers a crisis that leads her to question her world and her existence.',
    posterPath: 'https://images.pexels.com/photos/4145354/pexels-photo-4145354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    backdropPath: 'https://images.pexels.com/photos/3689859/pexels-photo-3689859.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    releaseDate: '2023-07-21',
    voteAverage: 7.2
  }
];

// Mock function to fetch trending movies
export async function fetchTrending(): Promise<TrendingMovie[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockTrendingMovies;
}

// Mock function to fetch movie details
export async function fetchMovieDetails(id: string): Promise<MovieDetails> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const movie = mockTrendingMovies.find(m => m.id === id);
  
  if (!movie) {
    throw new Error('Movie not found');
  }
  
  // Create mock detailed information
  return {
    ...movie,
    genres: [
      { id: 1, name: 'Action' },
      { id: 2, name: 'Sci-Fi' },
      { id: 3, name: 'Drama' }
    ],
    runtime: 120 + Math.floor(Math.random() * 60),
    tagline: 'Every legend has a beginning.',
    status: 'Released',
    cast: [
      { 
        id: '101', 
        name: 'Emma Stone', 
        character: 'Bella Baxter',
        profilePath: 'https://images.pexels.com/photos/573299/pexels-photo-573299.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' 
      },
      { 
        id: '102', 
        name: 'Ryan Gosling', 
        character: 'Mark Calisto',
        profilePath: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' 
      },
      { 
        id: '103', 
        name: 'Zendaya', 
        character: 'Ava Rivers',
        profilePath: 'https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' 
      },
      { 
        id: '104', 
        name: 'John Doe', 
        character: 'The Stranger',
        profilePath: 'https://images.pexels.com/photos/810775/pexels-photo-810775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' 
      }
    ],
    similar: mockTrendingMovies
      .filter(m => m.id !== id)
      .map(m => ({
        id: m.id,
        title: m.title,
        posterPath: m.posterPath,
        releaseDate: m.releaseDate,
        voteAverage: m.voteAverage
      }))
  };
}

// Mock function to search movies
export async function searchMovies(query: string): Promise<Movie[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filter movies based on query
  return mockTrendingMovies
    .filter(movie => 
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.overview.toLowerCase().includes(query.toLowerCase())
    )
    .map(movie => ({
      id: movie.id,
      title: movie.title,
      posterPath: movie.posterPath,
      releaseDate: movie.releaseDate,
      voteAverage: movie.voteAverage
    }));
}