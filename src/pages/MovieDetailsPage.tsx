import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Plus, Check, Share2, X, Star, MessageSquare, ThumbsUp } from 'lucide-react';
import { useMovies } from '../hooks/useMovies';
import { useAuth } from '../hooks/useAuth';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { MovieCard } from '../components/movies/MovieCard';
import { ReviewCard } from '../components/reviews/ReviewCard';
import { ReviewForm } from '../components/reviews/ReviewForm';
import { MovieDetails } from '../types/movie';
import { Review } from '../types/review';
import { addToWatchlist, removeFromWatchlist, isInWatchlist, getWatchlist } from '../services/watchlist';
import { getMovieReviews, addReview, reactToReview, getUserReaction, getReviewStats } from '../services/reviews';
import { getFriends } from '../services/friends';
import { sendRecommendation } from '../services/recommendations';
import { Friend } from '../types/user';
import { cn } from '../utils/cn';

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { getMovieDetails } = useMovies();
  const { user } = useAuth();
  
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [shareMessage, setShareMessage] = useState('');
  const [shareSending, setShareSending] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  
  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<any>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [userReactions, setUserReactions] = useState<Record<string, 'like' | 'dislike'>>({});
  
  // Fetch movie details
  useEffect(() => {
    if (!id) return;
    
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const details = await getMovieDetails(id);
        setMovie(details);
        
        document.title = `${details.title} - NetflixSocial`;
      } catch (err) {
        setError('Failed to load movie details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovieDetails();
    
    return () => {
      document.title = 'NetflixSocial - Share Movies With Friends';
    };
  }, [id, getMovieDetails]);
  
  // Check if movie is in watchlist
  useEffect(() => {
    if (!user || !id) return;
    
    const checkWatchlist = async () => {
      try {
        const isInList = await isInWatchlist(user.id, id);
        setInWatchlist(isInList);
      } catch (err) {
        console.error('Failed to check watchlist:', err);
      }
    };
    
    checkWatchlist();
  }, [user, id]);
  
  // Fetch friends list
  useEffect(() => {
    if (!user) return;
    
    const fetchFriends = async () => {
      try {
        const friendsList = await getFriends(user.id);
        setFriends(friendsList);
      } catch (err) {
        console.error('Failed to fetch friends:', err);
      }
    };
    
    fetchFriends();
  }, [user]);
  
  // Fetch reviews and stats
  useEffect(() => {
    if (!id) return;
    
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const [movieReviews, stats] = await Promise.all([
          getMovieReviews(id),
          getReviewStats(id)
        ]);
        
        setReviews(movieReviews);
        setReviewStats(stats);
        
        // Fetch user reactions for each review
        if (user) {
          const reactions: Record<string, 'like' | 'dislike'> = {};
          for (const review of movieReviews) {
            const reaction = await getUserReaction(user.id, review.id);
            if (reaction) {
              reactions[review.id] = reaction.type;
            }
          }
          setUserReactions(reactions);
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      } finally {
        setReviewsLoading(false);
      }
    };
    
    fetchReviews();
  }, [id, user]);
  
  // Handle adding to watchlist
  const handleAddToWatchlist = async () => {
    if (!user || !movie) return;
    
    try {
      await addToWatchlist(user.id, movie.id, {
        id: movie.id,
        title: movie.title,
        posterPath: movie.posterPath,
        releaseDate: movie.releaseDate,
        voteAverage: movie.voteAverage
      });
      
      setInWatchlist(true);
    } catch (err) {
      console.error('Failed to add to watchlist:', err);
    }
  };
  
  // Handle removing from watchlist
  const handleRemoveFromWatchlist = async () => {
    if (!user || !movie) return;
    
    try {
      const watchlist = await getWatchlist(user.id);
      const item = watchlist.find(item => item.movieId === movie.id);
      
      if (item) {
        await removeFromWatchlist(user.id, item.id);
        setInWatchlist(false);
      }
    } catch (err) {
      console.error('Failed to remove from watchlist:', err);
    }
  };
  
  // Handle friend selection for sharing
  const toggleFriendSelection = (friendId: string) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter(id => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };
  
  // Handle share submission
  const handleShareSubmit = async () => {
    if (!movie || !user || selectedFriends.length === 0) return;
    
    setShareSending(true);
    
    try {
      // Send recommendations to selected friends
      for (const friendId of selectedFriends) {
        const friend = friends.find(f => f.friendId === friendId);
        if (friend) {
          await sendRecommendation(
            user.id,
            user.username,
            user.avatar,
            friendId,
            movie.id,
            movie.title,
            movie.posterPath || '',
            shareMessage || `Check out this movie!`,
            'medium'
          );
        }
      }
      
      setShareSuccess(true);
      
      // Reset and close after showing success
      setTimeout(() => {
        setSelectedFriends([]);
        setShareMessage('');
        setShareSuccess(false);
        setShowShareModal(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to send recommendations:', error);
    } finally {
      setShareSending(false);
    }
  };
  
  // Handle review submission
  const handleReviewSubmit = async (rating: number, content: string, spoilerWarning: boolean) => {
    if (!user || !movie) return;
    
    try {
      const newReview = await addReview(
        user.id,
        user.username,
        user.avatar,
        movie.id,
        movie.title,
        rating,
        content,
        spoilerWarning
      );
      
      setReviews([newReview, ...reviews]);
      setShowReviewForm(false);
      
      // Refresh stats
      const stats = await getReviewStats(movie.id);
      setReviewStats(stats);
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };
  
  // Handle review reaction
  const handleReviewReaction = async (reviewId: string, type: 'like' | 'dislike') => {
    if (!user) return;
    
    try {
      await reactToReview(user.id, reviewId, type);
      
      // Update local state
      setUserReactions(prev => ({ ...prev, [reviewId]: type }));
      
      // Update review counts
      setReviews(reviews.map(review => {
        if (review.id === reviewId) {
          const currentReaction = userReactions[reviewId];
          let newLikes = review.likes;
          let newDislikes = review.dislikes;
          
          // Remove previous reaction
          if (currentReaction === 'like') newLikes--;
          if (currentReaction === 'dislike') newDislikes--;
          
          // Add new reaction
          if (type === 'like') newLikes++;
          if (type === 'dislike') newDislikes++;
          
          return { ...review, likes: newLikes, dislikes: newDislikes };
        }
        return review;
      }));
    } catch (error) {
      console.error('Failed to react to review:', error);
    }
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Error Loading Movie</h2>
          <p className="text-gray-400 mb-4">{error || 'Movie not found'}</p>
          <Link to="/" className="text-netflix-red hover:underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }
  
  const userHasReviewed = reviews.some(review => review.userId === user?.id);
  
  return (
    <div className="pb-12">
      {/* Hero section with backdrop */}
      <div className="relative h-[70vh] min-h-[30rem]">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={movie.backdropPath || 'https://images.pexels.com/photos/1632039/pexels-photo-1632039.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
            alt={movie.title}
            className="w-full h-full object-cover object-center"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/40 to-netflix-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-netflix-black/90 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end h-full px-4 md:px-12 pb-12 md:pb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 animate-fade-in">
            {movie.title}
          </h1>
          
          {movie.tagline && (
            <p className="text-gray-300 text-xl italic mb-4">{movie.tagline}</p>
          )}
          
          <div className="flex flex-wrap items-center text-sm text-gray-300 mb-4 gap-x-4 gap-y-2">
            <span className="text-green-500 font-semibold">{movie.voteAverage.toFixed(1)} Rating</span>
            {reviewStats && reviewStats.totalReviews > 0 && (
              <span className="flex items-center">
                <Star size={16} className="text-yellow-400 mr-1" />
                {reviewStats.averageRating.toFixed(1)} ({reviewStats.totalReviews} reviews)
              </span>
            )}
            <span>{new Date(movie.releaseDate).getFullYear()}</span>
            <span>{movie.runtime} min</span>
            <div className="flex flex-wrap gap-2">
              {movie.genres.map(genre => (
                <span 
                  key={genre.id}
                  className="bg-netflix-gray/30 px-2 py-1 rounded-sm text-xs"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
          
          <p className="text-gray-300 text-base md:text-lg mb-6">
            {movie.overview}
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <button
              className="flex items-center bg-white hover:bg-white/90 text-black font-semibold px-6 py-2 rounded transition"
            >
              <Play size={20} className="mr-2" />
              Play
            </button>
            
            {user && (
              <>
                {inWatchlist ? (
                  <button
                    onClick={handleRemoveFromWatchlist}
                    className="flex items-center bg-gray-800/80 hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded transition"
                  >
                    <Check size={20} className="mr-2 text-netflix-red" />
                    Remove from List
                  </button>
                ) : (
                  <button
                    onClick={handleAddToWatchlist}
                    className="flex items-center bg-gray-800/80 hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded transition"
                  >
                    <Plus size={20} className="mr-2" />
                    Add to My List
                  </button>
                )}
                
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center bg-gray-800/80 hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded transition"
                >
                  <Share2 size={20} className="mr-2" />
                  Recommend to Friends
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="mt-12 px-4 md:px-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center">
            <MessageSquare size={24} className="mr-2" />
            Reviews
            {reviewStats && (
              <span className="ml-2 text-gray-400">({reviewStats.totalReviews})</span>
            )}
          </h2>
          
          {user && !userHasReviewed && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-netflix-red hover:bg-netflix-red/90 text-white px-4 py-2 rounded transition"
            >
              Write Review
            </button>
          )}
        </div>
        
        {showReviewForm && (
          <div className="mb-8">
            <ReviewForm
              movieTitle={movie.title}
              onSubmit={handleReviewSubmit}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        )}
        
        {reviewsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-netflix-red"></div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map(review => (
              <ReviewCard
                key={review.id}
                review={review}
                userReaction={userReactions[review.id]}
                onReact={handleReviewReaction}
                currentUserId={user?.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-netflix-gray/20 rounded-lg">
            <MessageSquare size={32} className="text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400">No reviews yet. Be the first to review this movie!</p>
          </div>
        )}
      </div>
      
      {/* Cast section */}
      <div className="mt-12 px-4 md:px-12">
        <h2 className="text-2xl font-semibold mb-6">Cast</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movie.cast.map(person => (
            <div key={person.id} className="text-center">
              <div className="aspect-square rounded-full overflow-hidden mb-2">
                <img 
                  src={person.profilePath || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-medium">{person.name}</p>
              <p className="text-sm text-gray-400">{person.character}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Similar movies section */}
      <div className="mt-12 px-4 md:px-12">
        <h2 className="text-2xl font-semibold mb-6">Similar Movies</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movie.similar.slice(0, 6).map(similarMovie => (
            <MovieCard 
              key={similarMovie.id} 
              movie={similarMovie} 
            />
          ))}
        </div>
      </div>
      
      {/* Share modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-netflix-black border border-netflix-gray/30 rounded-lg w-full max-w-lg p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Recommend "{movie.title}"</h3>
              <button 
                onClick={() => {
                  if (!shareSending) {
                    setShowShareModal(false);
                    setSelectedFriends([]);
                    setShareMessage('');
                    setShareSuccess(false);
                  }
                }}
                className="text-gray-400 hover:text-white"
                disabled={shareSending}
              >
                <X size={24} />
              </button>
            </div>
            
            {shareSuccess ? (
              <div className="py-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-dark/20 text-success mb-4">
                  <Check size={32} />
                </div>
                <p className="text-xl font-medium">Successfully recommended!</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select friends to recommend to:
                  </label>
                  
                  {friends.length > 0 ? (
                    <div className="max-h-48 overflow-y-auto border border-netflix-gray/30 rounded-md divide-y divide-netflix-gray/30">
                      {friends.map(friend => (
                        <div 
                          key={friend.id}
                          className={cn(
                            "flex items-center p-3 cursor-pointer transition",
                            selectedFriends.includes(friend.friendId)
                              ? "bg-netflix-red/10"
                              : "hover:bg-netflix-gray/10"
                          )}
                          onClick={() => toggleFriendSelection(friend.friendId)}
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-netflix-gray overflow-hidden">
                            {friend.avatar ? (
                              <img src={friend.avatar} alt={friend.username} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white">
                                {friend.username.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          
                          <span className="ml-3">{friend.username}</span>
                          
                          <div className="ml-auto">
                            <div 
                              className={cn(
                                "w-5 h-5 rounded-full border",
                                selectedFriends.includes(friend.friendId)
                                  ? "bg-netflix-red border-netflix-red"
                                  : "border-white"
                              )}
                            >
                              {selectedFriends.includes(friend.friendId) && (
                                <Check size={16} className="text-white" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-netflix-gray/30 rounded-md">
                      <p className="text-gray-400">You haven't added any friends yet</p>
                      <Link to="/friends" className="text-netflix-red hover:underline mt-2 inline-block">
                        Find friends
                      </Link>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Add a message (optional):
                  </label>
                  <textarea
                    value={shareMessage}
                    onChange={(e) => setShareMessage(e.target.value)}
                    placeholder="Check out this movie!"
                    className="w-full px-3 py-2 bg-netflix-gray/20 border border-netflix-gray/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-netflix-red"
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleShareSubmit}
                    disabled={selectedFriends.length === 0 || shareSending}
                    className={cn(
                      "bg-netflix-red hover:bg-netflix-red/90 text-white font-semibold px-6 py-2 rounded transition",
                      (selectedFriends.length === 0 || shareSending) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {shareSending ? 'Sending...' : 'Send Recommendation'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}