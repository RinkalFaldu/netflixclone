import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Eye, Clock, AlertCircle } from 'lucide-react';
import { Recommendation } from '../../types/recommendation';
import { cn } from '../../utils/cn';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onUpdateStatus?: (id: string, status: 'accepted' | 'declined' | 'watched') => void;
}

export function RecommendationCard({ recommendation, onUpdateStatus }: RecommendationCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleStatusUpdate = async (status: 'accepted' | 'declined' | 'watched') => {
    if (!onUpdateStatus) return;
    
    setIsUpdating(true);
    try {
      await onUpdateStatus(recommendation.id, status);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 border-red-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'low': return 'text-green-400 border-green-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <Check size={16} className="text-green-400" />;
      case 'declined': return <X size={16} className="text-red-400" />;
      case 'watched': return <Eye size={16} className="text-blue-400" />;
      default: return <Clock size={16} className="text-yellow-400" />;
    }
  };
  
  return (
    <div className="bg-netflix-black/50 border border-netflix-gray/20 rounded-lg p-4">
      <div className="flex items-start space-x-4">
        {/* Movie Poster */}
        <Link to={`/movie/${recommendation.movieId}`} className="flex-shrink-0">
          <img
            src={recommendation.moviePoster}
            alt={recommendation.movieTitle}
            className="w-20 h-30 object-cover rounded-md hover:scale-105 transition-transform"
          />
        </Link>
        
        {/* Content */}
        <div className="flex-grow">
          <div className="flex items-start justify-between mb-2">
            <div>
              <Link 
                to={`/movie/${recommendation.movieId}`}
                className="text-lg font-semibold hover:text-netflix-red transition"
              >
                {recommendation.movieTitle}
              </Link>
              
              <div className="flex items-center mt-1 space-x-3">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-netflix-gray overflow-hidden mr-2">
                    {recommendation.fromUserAvatar ? (
                      <img 
                        src={recommendation.fromUserAvatar} 
                        alt={recommendation.fromUsername} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-xs">
                        {recommendation.fromUsername.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-400">
                    Recommended by {recommendation.fromUsername}
                  </span>
                </div>
                
                <div className={cn(
                  "px-2 py-1 border rounded-full text-xs",
                  getPriorityColor(recommendation.priority)
                )}>
                  {recommendation.priority} priority
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {getStatusIcon(recommendation.status)}
              <span className="text-sm text-gray-400 capitalize">
                {recommendation.status}
              </span>
            </div>
          </div>
          
          {recommendation.message && (
            <div className="bg-netflix-gray/10 rounded-md p-3 mb-3">
              <p className="text-gray-300 text-sm italic">"{recommendation.message}"</p>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {new Date(recommendation.createdAt).toLocaleDateString()}
            </span>
            
            {recommendation.status === 'pending' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleStatusUpdate('declined')}
                  disabled={isUpdating}
                  className="flex items-center px-3 py-1 bg-gray-600/50 hover:bg-gray-600 text-white text-sm rounded transition"
                >
                  <X size={14} className="mr-1" />
                  Decline
                </button>
                
                <button
                  onClick={() => handleStatusUpdate('accepted')}
                  disabled={isUpdating}
                  className="flex items-center px-3 py-1 bg-netflix-red hover:bg-netflix-red/90 text-white text-sm rounded transition"
                >
                  <Check size={14} className="mr-1" />
                  Accept
                </button>
              </div>
            )}
            
            {recommendation.status === 'accepted' && (
              <button
                onClick={() => handleStatusUpdate('watched')}
                disabled={isUpdating}
                className="flex items-center px-3 py-1 bg-blue-600/50 hover:bg-blue-600 text-white text-sm rounded transition"
              >
                <Eye size={14} className="mr-1" />
                Mark as Watched
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}