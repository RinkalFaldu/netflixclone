import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getActivityFeed } from '../services/friends';
import { ActivityItem } from '../types/user';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { FilmIcon, Activity, LogOut, User as UserIcon, Settings } from 'lucide-react';
import { cn } from '../utils/cn';

export default function ProfilePage() {
  const { user, signOut, updateProfile } = useAuth();
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    document.title = 'Profile - NetflixSocial';
    
    return () => {
      document.title = 'NetflixSocial - Share Movies With Friends';
    };
  }, []);
  
  // Set username from user data
  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);
  
  // Fetch activity feed
  useEffect(() => {
    if (!user) return;
    
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const activityItems = await getActivityFeed(user.id);
        setActivity(activityItems);
      } catch (err) {
        setError('Failed to load activity feed');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivity();
  }, [user]);
  
  // Handle save profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setIsSaving(true);
      await updateProfile({ username });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Please sign in</h2>
          <p className="text-gray-400 mb-4">You must be logged in to view your profile</p>
          <Link to="/login" className="text-netflix-red hover:underline">
            Go to login
          </Link>
        </div>
      </div>
    );
  }
  
  // Mock activity items for demo
  const mockActivity: ActivityItem[] = [
    {
      id: 'activity-1',
      userId: 'friend-1',
      username: 'Chris',
      type: 'added-movie',
      data: {
        movieId: '1',
        movieTitle: 'Dune: Part Two'
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
    },
    {
      id: 'activity-2',
      userId: 'friend-2',
      username: 'Jessica',
      type: 'recommended-movie',
      data: {
        movieId: '3',
        movieTitle: 'Poor Things'
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 hours ago
    },
    {
      id: 'activity-3',
      userId: user.id,
      username: 'You',
      type: 'became-friends',
      data: {
        friendId: 'friend-1',
        friendName: 'Chris'
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
    },
    {
      id: 'activity-4',
      userId: 'friend-3',
      username: 'Michael',
      type: 'added-movie',
      data: {
        movieId: '6',
        movieTitle: 'Barbie'
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() // 2 days ago
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Profile</h1>
        
        {error && (
          <div className="bg-error-dark/20 border border-error-dark text-white px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-netflix-black/50 border border-netflix-gray/20 rounded-lg p-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-netflix-gray mb-4 flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <UserIcon size={40} className="text-white" />
                  )}
                </div>
                
                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="w-full">
                    <div className="mb-4">
                      <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                        Username
                      </label>
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 bg-netflix-gray/20 border border-netflix-gray/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-netflix-red"
                        required
                      />
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setUsername(user.username);
                        }}
                        className="px-3 py-1 border border-netflix-gray/30 rounded text-white hover:bg-netflix-gray/20 transition"
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                      
                      <button
                        type="submit"
                        className={cn(
                          "bg-netflix-red hover:bg-netflix-red/90 text-white px-4 py-1 rounded transition",
                          isSaving && "opacity-50 cursor-not-allowed"
                        )}
                        disabled={isSaving}
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold mb-1">{user.username}</h2>
                    <p className="text-gray-400 mb-4">{user.email}</p>
                    
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm text-netflix-red hover:underline mb-6"
                    >
                      Edit Profile
                    </button>
                  </>
                )}
              </div>
              
              <div className="border-t border-netflix-gray/20 pt-4 mt-4">
                <nav className="space-y-2">
                  <Link 
                    to="/watchlist" 
                    className="flex items-center py-2 px-3 rounded hover:bg-netflix-gray/10 transition"
                  >
                    <FilmIcon size={18} className="mr-3" />
                    My List
                  </Link>
                  
                  <Link 
                    to="/friends" 
                    className="flex items-center py-2 px-3 rounded hover:bg-netflix-gray/10 transition"
                  >
                    <UserIcon size={18} className="mr-3" />
                    Friends
                  </Link>
                  
                  <button 
                    onClick={signOut}
                    className="flex items-center py-2 px-3 rounded hover:bg-netflix-gray/10 transition w-full text-left"
                  >
                    <LogOut size={18} className="mr-3" />
                    Sign Out
                  </button>
                </nav>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-netflix-black/50 border border-netflix-gray/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Activity size={20} className="mr-2" />
                Recent Activity
              </h2>
              
              <div className="space-y-4">
                {mockActivity.length > 0 ? (
                  mockActivity.map(item => (
                    <div key={item.id} className="border-b border-netflix-gray/10 pb-4 last:border-b-0">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-netflix-gray mr-3 flex-shrink-0 overflow-hidden">
                          <div className="w-full h-full flex items-center justify-center text-white">
                            {item.username === 'You' ? 'Y' : item.username.charAt(0)}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm">
                            <span className="font-medium">{item.username}</span>
                            {' '}
                            {item.type === 'added-movie' && (
                              <>
                                added <Link to={`/movie/${item.data.movieId}`} className="text-netflix-red hover:underline">{item.data.movieTitle}</Link> to their list
                              </>
                            )}
                            
                            {item.type === 'recommended-movie' && (
                              <>
                                recommended <Link to={`/movie/${item.data.movieId}`} className="text-netflix-red hover:underline">{item.data.movieTitle}</Link> to you
                              </>
                            )}
                            
                            {item.type === 'became-friends' && (
                              <>
                                became friends with <span className="text-netflix-red">{item.data.friendName}</span>
                              </>
                            )}
                          </div>
                          
                          <p className="text-gray-400 text-xs mt-1">
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}