import { useState } from 'react';
import { ThumbsUp, ThumbsDown, AlertTriangle, Star } from 'lucide-react';
import { Review } from '../../types/review';
import { cn } from '../../utils/cn';

interface ReviewCardProps {
  review: Review;
  userReaction?: 'like' | 'dislike' | null;
  onReact?: (reviewId: string, type: 'like' | 'dislike') => void;
  currentUserId?: string;
}

export function ReviewCard({ review, userReaction, onReact, currentUserId }: ReviewCardProps) {
  const [showSpoiler, setShowSpoiler] = useState(false);
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 10 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={cn(
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
        )}
      />
    ));
  };
  
  return (
    <div className="bg-netflix-black/50 border border-netflix-gray/20 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-netflix-gray overflow-hidden mr-3">
            {review.userAvatar ? (
              <img src={review.userAvatar} alt={review.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-medium">
                {review.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div>
            <p className="font-medium">{review.username}</p>
            <div className="flex items-center mt-1">
              {renderStars(review.rating)}
              <span className="ml-2 text-sm text-gray-400">{review.rating}/10</span>
            </div>
          </div>
        </div>
        
        <span className="text-sm text-gray-400">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      {review.spoilerWarning && !showSpoiler ? (
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-md p-4 mb-3">
          <div className="flex items-center mb-2">
            <AlertTriangle size={16} className="text-yellow-400 mr-2" />
            <span className="text-yellow-400 font-medium">Spoiler Warning</span>
          </div>
          <p className="text-gray-300 mb-3">This review contains spoilers.</p>
          <button
            onClick={() => setShowSpoiler(true)}
            className="text-netflix-red hover:underline text-sm"
          >
            Show Review
          </button>
        </div>
      ) : (
        <div className="mb-4">
          <p className="text-gray-300 leading-relaxed">{review.content}</p>
        </div>
      )}
      
      {currentUserId && currentUserId !== review.userId && (
        <div className="flex items-center justify-between pt-3 border-t border-netflix-gray/20">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onReact && onReact(review.id, 'like')}
              className={cn(
                "flex items-center space-x-1 px-3 py-1 rounded transition",
                userReaction === 'like'
                  ? "bg-green-600/20 text-green-400"
                  : "hover:bg-netflix-gray/20 text-gray-400"
              )}
            >
              <ThumbsUp size={16} />
              <span>{review.likes}</span>
            </button>
            
            <button
              onClick={() => onReact && onReact(review.id, 'dislike')}
              className={cn(
                "flex items-center space-x-1 px-3 py-1 rounded transition",
                userReaction === 'dislike'
                  ? "bg-red-600/20 text-red-400"
                  : "hover:bg-netflix-gray/20 text-gray-400"
              )}
            >
              <ThumbsDown size={16} />
              <span>{review.dislikes}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}