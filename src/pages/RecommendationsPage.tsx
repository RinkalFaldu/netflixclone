import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserRecommendations, updateRecommendationStatus } from '../services/recommendations';
import { Recommendation } from '../types/recommendation';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { RecommendationCard } from '../components/recommendations/RecommendationCard';
import { Film, Inbox, CheckCircle, XCircle, Eye } from 'lucide-react';

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'declined' | 'watched'>('all');
  
  useEffect(() => {
    document.title = 'Recommendations - NetflixSocial';
    
    return () => {
      document.title = 'NetflixSocial - Share Movies With Friends';
    };
  }, []);
  
  // Fetch recommendations
  useEffect(() => {
    if (!user) return;
    
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const userRecommendations = await getUserRecommendations(user.id);
        setRecommendations(userRecommendations);
      } catch (err) {
        setError('Failed to load recommendations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [user]);
  
  // Handle status update
  const handleStatusUpdate = async (recommendationId: string, status: 'accepted' | 'declined' | 'watched') => {
    try {
      await updateRecommendationStatus(recommendationId, status);
      
      setRecommendations(recommendations.map(rec => 
        rec.id === recommendationId 
          ? { ...rec, status, viewedAt: new Date().toISOString() }
          : rec
      ));
    } catch (error) {
      console.error('Failed to update recommendation status:', error);
    }
  };
  
  // Filter recommendations
  const filteredRecommendations = recommendations.filter(rec => {
    if (filter === 'all') return true;
    return rec.status === filter;
  });
  
  const getFilterIcon = (filterType: string) => {
    switch (filterType) {
      case 'pending': return <Inbox size={16} />;
      case 'accepted': return <CheckCircle size={16} />;
      case 'declined': return <XCircle size={16} />;
      case 'watched': return <Eye size={16} />;
      default: return <Film size={16} />;
    }
  };
  
  const getFilterCount = (filterType: string) => {
    if (filterType === 'all') return recommendations.length;
    return recommendations.filter(rec => rec.status === filterType).length;
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Movie Recommendations</h1>
        <p className="text-gray-400 mb-8">Movies recommended by your friends</p>
        
        {error && (
          <div className="bg-error-dark/20 border border-error-dark text-white px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(['all', 'pending', 'accepted', 'declined', 'watched'] as const).map(filterType => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                filter === filterType
                  ? 'bg-netflix-red text-white'
                  : 'bg-netflix-gray/20 text-gray-300 hover:bg-netflix-gray/30'
              }`}
            >
              {getFilterIcon(filterType)}
              <span className="capitalize">{filterType}</span>
              <span className="bg-black/20 px-2 py-1 rounded-full text-xs">
                {getFilterCount(filterType)}
              </span>
            </button>
          ))}
        </div>
        
        {/* Recommendations List */}
        {filteredRecommendations.length > 0 ? (
          <div className="space-y-4">
            {filteredRecommendations.map(recommendation => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                onUpdateStatus={handleStatusUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-netflix-gray/20 rounded-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-netflix-gray/10 rounded-full mb-4">
              <Film size={32} className="text-netflix-red" />
            </div>
            
            <h3 className="text-xl font-semibold mb-2">
              {filter === 'all' ? 'No recommendations yet' : `No ${filter} recommendations`}
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {filter === 'all' 
                ? 'When friends recommend movies to you, they\'ll appear here.'
                : `You don't have any ${filter} recommendations at the moment.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}