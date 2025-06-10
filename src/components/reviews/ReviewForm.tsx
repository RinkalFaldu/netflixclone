import { useState } from 'react';
import { Star, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ReviewFormProps {
  movieTitle: string;
  onSubmit: (rating: number, content: string, spoilerWarning: boolean) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ReviewForm({ movieTitle, onSubmit, onCancel, isSubmitting = false }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [spoilerWarning, setSpoilerWarning] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && content.trim()) {
      onSubmit(rating, content.trim(), spoilerWarning);
    }
  };
  
  const renderStars = () => {
    return Array.from({ length: 10 }, (_, i) => {
      const starValue = i + 1;
      const isActive = starValue <= (hoveredRating || rating);
      
      return (
        <button
          key={i}
          type="button"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          className="focus:outline-none"
        >
          <Star
            size={24}
            className={cn(
              "transition-colors",
              isActive ? 'text-yellow-400 fill-current' : 'text-gray-600 hover:text-yellow-400'
            )}
          />
        </button>
      );
    });
  };
  
  return (
    <div className="bg-netflix-black/50 border border-netflix-gray/20 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Write a Review for "{movieTitle}"</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Rating *
          </label>
          <div className="flex items-center space-x-1">
            {renderStars()}
            <span className="ml-3 text-gray-400">
              {rating > 0 ? `${rating}/10` : 'Select a rating'}
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="review-content" className="block text-sm font-medium text-gray-300 mb-2">
            Review *
          </label>
          <textarea
            id="review-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts about this movie..."
            className="w-full px-4 py-3 bg-netflix-gray/20 border border-netflix-gray/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-netflix-red resize-none"
            rows={6}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={spoilerWarning}
              onChange={(e) => setSpoilerWarning(e.target.checked)}
              className="mr-3 rounded border-netflix-gray/30 bg-netflix-gray/20 text-netflix-red focus:ring-netflix-red"
            />
            <div className="flex items-center">
              <AlertTriangle size={16} className="text-yellow-400 mr-2" />
              <span className="text-sm">This review contains spoilers</span>
            </div>
          </label>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-netflix-gray/30 rounded text-white hover:bg-netflix-gray/20 transition"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={rating === 0 || !content.trim() || isSubmitting}
            className={cn(
              "bg-netflix-red hover:bg-netflix-red/90 text-white px-6 py-2 rounded transition",
              (rating === 0 || !content.trim() || isSubmitting) && "opacity-50 cursor-not-allowed"
            )}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
}