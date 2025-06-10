import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getUserNotifications, markAllNotificationsAsRead } from '../../services/notifications';
import { Notification } from '../../types/notification';
import { NotificationDropdown } from './NotificationDropdown';
import { cn } from '../../utils/cn';

export function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Fetch notifications
  useEffect(() => {
    if (!user) return;
    
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const userNotifications = await getUserNotifications(user.id);
        setNotifications(userNotifications);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, [user]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    try {
      await markAllNotificationsAsRead(user.id);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };
  
  if (!user) return null;
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-white hover:text-netflix-red transition"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-netflix-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          loading={loading}
          onClose={() => setIsOpen(false)}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      )}
    </div>
  );
}