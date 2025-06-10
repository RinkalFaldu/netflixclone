import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getFriends, getFriendRequests, acceptFriendRequest, declineFriendRequest, sendFriendRequest, removeFriend } from '../services/friends';
import { Friend, FriendRequest } from '../types/user';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { UserPlus, Check, X, Search, Users, UserMinus, AlertCircle } from 'lucide-react';
import { cn } from '../utils/cn';

export default function FriendsPage() {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendEmail, setFriendEmail] = useState('');
  const [addFriendStatus, setAddFriendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [addFriendError, setAddFriendError] = useState('');
  
  useEffect(() => {
    document.title = 'Friends - NetflixSocial';
    
    return () => {
      document.title = 'NetflixSocial - Share Movies With Friends';
    };
  }, []);
  
  // Fetch friends and friend requests
  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const [friendsList, requestsList] = await Promise.all([
          getFriends(user.id),
          getFriendRequests(user.id)
        ]);
        
        setFriends(friendsList);
        setFriendRequests(requestsList);
      } catch (err) {
        setError('Failed to load friends data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  // Filter friends based on search term
  const filteredFriends = friends.filter(friend => 
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle accepting friend request
  const handleAcceptFriendRequest = async (requestId: string) => {
    if (!user) return;
    
    try {
      await acceptFriendRequest(requestId);
      
      // Update local state
      const acceptedRequest = friendRequests.find(req => req.id === requestId);
      
      if (acceptedRequest) {
        // Add to friends list
        const newFriend: Friend = {
          id: `friend-${Math.random().toString(36).substring(2, 9)}`,
          userId: user.id,
          friendId: acceptedRequest.fromUserId,
          username: acceptedRequest.fromUsername,
          avatar: acceptedRequest.fromAvatar,
          status: 'accepted',
          createdAt: new Date().toISOString()
        };
        
        setFriends([...friends, newFriend]);
        
        // Remove from requests
        setFriendRequests(friendRequests.filter(req => req.id !== requestId));
      }
    } catch (err) {
      console.error('Failed to accept friend request:', err);
    }
  };
  
  // Handle declining friend request
  const handleDeclineFriendRequest = async (requestId: string) => {
    try {
      await declineFriendRequest(requestId);
      
      // Remove from requests
      setFriendRequests(friendRequests.filter(req => req.id !== requestId));
    } catch (err) {
      console.error('Failed to decline friend request:', err);
    }
  };
  
  // Handle removing friend
  const handleRemoveFriend = async (friendId: string) => {
    if (!user) return;
    
    try {
      await removeFriend(user.id, friendId);
      
      // Remove from friends list
      setFriends(friends.filter(friend => friend.friendId !== friendId));
    } catch (err) {
      console.error('Failed to remove friend:', err);
    }
  };
  
  // Handle adding friend
  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !friendEmail) return;
    
    try {
      setAddFriendStatus('loading');
      setAddFriendError('');
      
      // Simulate sending friend request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRequest = await sendFriendRequest(
        user.id,
        user.username,
        user.avatar,
        `user-${Math.random().toString(36).substring(2, 9)}`
      );
      
      setAddFriendStatus('success');
      setFriendEmail('');
      
      // Close add friend form after delay
      setTimeout(() => {
        setShowAddFriend(false);
        setAddFriendStatus('idle');
      }, 2000);
    } catch (err) {
      console.error('Failed to send friend request:', err);
      setAddFriendStatus('error');
      setAddFriendError('Failed to send friend request');
    }
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Friends</h1>
          <p className="text-gray-400">Connect and share movies with friends</p>
        </div>
        
        <button
          onClick={() => setShowAddFriend(!showAddFriend)}
          className="mt-4 md:mt-0 flex items-center bg-netflix-red hover:bg-netflix-red/90 text-white px-4 py-2 rounded transition"
        >
          <UserPlus size={18} className="mr-2" />
          Add Friend
        </button>
      </div>
      
      {error && (
        <div className="bg-error-dark/20 border border-error-dark text-white px-4 py-3 rounded mb-8">
          {error}
        </div>
      )}
      
      {/* Add Friend Form */}
      {showAddFriend && (
        <div className="mb-8 bg-netflix-black/50 border border-netflix-gray/20 rounded-lg p-6 animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">Add a Friend</h2>
          
          {addFriendStatus === 'success' ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center">
                <div className="bg-success-dark/20 text-success p-3 rounded-full mb-4">
                  <Check size={24} />
                </div>
                <p className="text-lg font-medium">Friend request sent!</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAddFriend}>
              <div className="mb-4">
                <label htmlFor="friendEmail" className="block text-sm font-medium text-gray-300 mb-2">
                  Enter your friend's email:
                </label>
                <input
                  id="friendEmail"
                  type="email"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                  placeholder="friend@example.com"
                  className="w-full px-4 py-2 bg-netflix-gray/20 border border-netflix-gray/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-netflix-red"
                  required
                />
              </div>
              
              {addFriendStatus === 'error' && (
                <div className="bg-error-dark/20 border border-error-dark text-white px-4 py-3 rounded mb-4">
                  {addFriendError}
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddFriend(false);
                    setFriendEmail('');
                    setAddFriendStatus('idle');
                    setAddFriendError('');
                  }}
                  className="mr-2 px-4 py-2 border border-netflix-gray/30 rounded text-white hover:bg-netflix-gray/20 transition"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={addFriendStatus === 'loading' || !friendEmail}
                  className={cn(
                    "bg-netflix-red hover:bg-netflix-red/90 text-white px-6 py-2 rounded transition",
                    (addFriendStatus === 'loading' || !friendEmail) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {addFriendStatus === 'loading' ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
      
      {/* Friend Requests */}
      {friendRequests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <AlertCircle size={20} className="mr-2 text-netflix-red" />
            Friend Requests ({friendRequests.length})
          </h2>
          
          <div className="bg-netflix-black/50 border border-netflix-gray/20 rounded-lg divide-y divide-netflix-gray/20">
            {friendRequests.map(request => (
              <div key={request.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-netflix-gray overflow-hidden">
                    {request.fromAvatar ? (
                      <img 
                        src={request.fromAvatar} 
                        alt={request.fromUsername} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-medium">
                        {request.fromUsername.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-3">
                    <p className="font-medium">{request.fromUsername}</p>
                    <p className="text-sm text-gray-400">
                      Sent {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAcceptFriendRequest(request.id)}
                    className="bg-netflix-red hover:bg-netflix-red/90 text-white p-2 rounded transition"
                    title="Accept"
                  >
                    <Check size={18} />
                  </button>
                  
                  <button
                    onClick={() => handleDeclineFriendRequest(request.id)}
                    className="bg-netflix-gray/30 hover:bg-netflix-gray/50 text-white p-2 rounded transition"
                    title="Decline"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Friends List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Users size={20} className="mr-2" />
            My Friends ({friends.length})
          </h2>
          
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search friends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-netflix-gray/20 border border-netflix-gray/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-netflix-red w-full md:w-60"
            />
          </div>
        </div>
        
        {friends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFriends.map(friend => (
              <div key={friend.id} className="bg-netflix-black/50 border border-netflix-gray/20 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-netflix-gray overflow-hidden">
                    {friend.avatar ? (
                      <img src={friend.avatar} alt={friend.username} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-medium">
                        {friend.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-3">
                    <p className="font-medium">{friend.username}</p>
                    <p className="text-sm text-gray-400">
                      Friends since {new Date(friend.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRemoveFriend(friend.friendId)}
                    className="bg-netflix-gray/30 hover:bg-netflix-gray/50 text-white p-2 rounded transition"
                    title="Remove friend"
                  >
                    <UserMinus size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-netflix-gray/20 rounded-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-netflix-gray/10 rounded-full mb-4">
              <Users size={32} className="text-netflix-red" />
            </div>
            
            <h3 className="text-xl font-semibold mb-2">No friends yet</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Add friends to share and recommend movies with each other.
            </p>
            
            <button
              onClick={() => setShowAddFriend(true)}
              className="inline-flex items-center bg-netflix-red hover:bg-netflix-red/90 text-white px-6 py-2 rounded transition"
            >
              <UserPlus size={18} className="mr-2" />
              Add your first friend
            </button>
          </div>
        )}
      </div>
    </div>
  );
}