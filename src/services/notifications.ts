import { Notification, NotificationSettings } from '../types/notification';

// Mock notifications data
const mockNotifications: Record<string, Notification[]> = {};
const mockSettings: Record<string, NotificationSettings> = {};

// Get user notifications
export async function getUserNotifications(userId: string): Promise<Notification[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return (mockNotifications[userId] || [])
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Create a notification
export async function createNotification(
  userId: string,
  type: Notification['type'],
  title: string,
  message: string,
  data?: any
): Promise<Notification> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const notification: Notification = {
    id: `notif-${Math.random().toString(36).substring(2, 9)}`,
    userId,
    type,
    title,
    message,
    data,
    read: false,
    createdAt: new Date().toISOString()
  };
  
  if (!mockNotifications[userId]) {
    mockNotifications[userId] = [];
  }
  
  mockNotifications[userId].push(notification);
  return notification;
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  Object.values(mockNotifications).forEach(notifications => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  });
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (mockNotifications[userId]) {
    mockNotifications[userId].forEach(notification => {
      notification.read = true;
    });
  }
}

// Get notification settings
export async function getNotificationSettings(userId: string): Promise<NotificationSettings> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return mockSettings[userId] || {
    friendRequests: true,
    movieRecommendations: true,
    reviewLikes: true,
    friendActivity: true,
    systemUpdates: true,
    emailNotifications: false
  };
}

// Update notification settings
export async function updateNotificationSettings(
  userId: string,
  settings: NotificationSettings
): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  mockSettings[userId] = settings;
}