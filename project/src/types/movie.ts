export interface Movie {
  id: string;
  title: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
}

export interface TrendingMovie extends Movie {
  backdropPath: string | null;
  overview: string;
}

export interface MovieDetails extends TrendingMovie {
  genres: { id: number; name: string }[];
  runtime: number;
  tagline: string;
  status: string;
  cast: {
    id: string;
    name: string;
    character: string;
    profilePath: string | null;
  }[];
  similar: Movie[];
}

export interface WatchlistItem {
  id: string;
  userId: string;
  movieId: string;
  movie: Movie;
  addedAt: string;
}

export interface MovieSuggestion {
  id: string;
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  movieId: string;
  movie: Movie;
  message: string;
  createdAt: string;
  seen: boolean;
}