import { Link } from 'react-router-dom';
import { Bell, Check, X, User, Film, Heart, Users } from 'lucide-react';
import { Notification } from '../../types/notification';
import { cn } from '../../utils/cn';

interface NotificationDropdownProps {
  notifications: Notification[];
  loading: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
}

export function NotificationDropdown({ 
  notifications, 
  loading, 
  onClose, 
  onMarkAllAsRead 
}: NotificationDropdownProps) {
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'friend_request': return <User size={16} className="text-blue-400" />;
      case 'movie_recommendation': return <Film size={16} className="text-netflix-red" />;
      case 'review_like': return <Heart size={16} className="text-pink-400" />;
      case 'new_friend_activity': return <Users size={16} className="text-green-400" />;
      case 'system': return <Bell size={16} className="text-gray-400" />;
      default: return <Bell size={16} className="text-gray-400" />;
    }
  };
  
  return (
    <div className="absolute right-0 mt-2 w-80 bg-netflix-black border border-netflix-gray/30 rounded-lg shadow-xl z-50 animate-slide-up">
      <div className="p-4 border-b border-netflix-gray/20">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex items-center space-x-2">
            {notifications.some(n => !n.read) && (
              <button
                onClick={onMarkAllAsRead}
                className="text-sm text-netflix-red hover:underline"
              >
                Mark all as read
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-netflix-red mx-auto"></div>
          </div>
        ) : notifications.length > 0 ? (
          notifications.slice(0, 10).map(notification => (
            <div
              key={notification.id}
              className={cn(
                "p-4 border-b border-netflix-gray/10 hover:bg-netflix-gray/5 transition",
                !notification.read && "bg-netflix-red/5"
              )}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-grow min-w-0">
                  <p className="font-medium text-sm">{notification.title}</p>
                  <p className="text-gray-400 text-xs mt-1">{notification.message}</p>
                  <p className="text-gray-500 text-xs mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                
                {!notification.read && (
                  <div className="w-2 h-2 bg-netflix-red rounded-full flex-shrink-0 mt-2"></div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <Bell size={32} className="text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400">No notifications yet</p>
          </div>
        )}
      </div>
      
      {notifications.length > 10 && (
        <div className="p-3 border-t border-netflix-gray/20 text-center">
          <Link
            to="/notifications"
            onClick={onClose}
            className="text-sm text-netflix-red hover:underline"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}