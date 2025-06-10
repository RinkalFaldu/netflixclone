import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/notifications';
import { Notification } from '../types/notification';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { Bell, Check, User, Film, Heart, Users, Settings } from 'lucide-react';
import { cn } from '../utils/cn';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  useEffect(() => {
    document.title = 'Notifications - NetflixSocial';
    
    return () => {
      document.title = 'NetflixSocial - Share Movies With Friends';
    };
  }, []);
  
  // Fetch notifications
  useEffect(() => {
    if (!user) return;
    
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const userNotifications = await getUserNotifications(user.id);
        setNotifications(userNotifications);
      } catch (err) {
        setError('Failed to load notifications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, [user]);
  
  // Mark notification as read
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };
  
  // Mark all as read
  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    try {
      await markAllNotificationsAsRead(user.id);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };
  
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'friend_request': return <User size={20} className="text-blue-400" />;
      case 'movie_recommendation': return <Film size={20} className="text-netflix-red" />;
      case 'review_like': return <Heart size={20} className="text-pink-400" />;
      case 'new_friend_activity': return <Users size={20} className="text-green-400" />;
      case 'system': return <Settings size={20} className="text-gray-400" />;
      default: return <Bell size={20} className="text-gray-400" />;
    }
  };
  
  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    return true;
  });
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Notifications</h1>
            <p className="text-gray-400">Stay updated with your social movie activity</p>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center bg-netflix-red hover:bg-netflix-red/90 text-white px-4 py-2 rounded transition"
            >
              <Check size={16} className="mr-2" />
              Mark all as read
            </button>
          )}
        </div>
        
        {error && (
          <div className="bg-error-dark/20 border border-error-dark text-white px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}
        
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
              filter === 'all'
                ? 'bg-netflix-red text-white'
                : 'bg-netflix-gray/20 text-gray-300 hover:bg-netflix-gray/30'
            }`}
          >
            <span>All</span>
            <span className="bg-black/20 px-2 py-1 rounded-full text-xs">
              {notifications.length}
            </span>
          </button>
          
          <button
            onClick={() => setFilter('unread')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
              filter === 'unread'
                ? 'bg-netflix-red text-white'
                : 'bg-netflix-gray/20 text-gray-300 hover:bg-netflix-gray/30'
            }`}
          >
            <span>Unread</span>
            <span className="bg-black/20 px-2 py-1 rounded-full text-xs">
              {unreadCount}
            </span>
          </button>
        </div>
        
        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-2">
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={cn(
                  "bg-netflix-black/50 border border-netflix-gray/20 rounded-lg p-4 transition cursor-pointer",
                  !notification.read && "bg-netflix-red/5 border-netflix-red/20",
                  "hover:bg-netflix-gray/10"
                )}
                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{notification.title}</h3>
                        <p className="text-gray-400 mt-1">{notification.message}</p>
                        <p className="text-gray-500 text-sm mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      
                      {!notification.read && (
                        <div className="w-3 h-3 bg-netflix-red rounded-full flex-shrink-0 mt-1"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-netflix-gray/20 rounded-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-netflix-gray/10 rounded-full mb-4">
              <Bell size={32} className="text-netflix-red" />
            </div>
            
            <h3 className="text-xl font-semibold mb-2">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {filter === 'unread' 
                ? 'You\'re all caught up! Check back later for new updates.'
                : 'When you receive notifications, they\'ll appear here.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}