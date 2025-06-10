import { Friend, FriendRequest, ActivityItem } from '../types/user';

// Mock friends data
const mockFriends: Record<string, Friend[]> = {};
const mockFriendRequests: FriendRequest[] = [];
const mockActivity: ActivityItem[] = [];

// Get user's friends
export async function getFriends(userId: string): Promise<Friend[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return mockFriends[userId] || [];
}

// Send friend request
export async function sendFriendRequest(
  fromUserId: string, 
  fromUsername: string, 
  fromAvatar: string | undefined,
  toUserId: string
): Promise<FriendRequest> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Check if request already exists
  const existingRequest = mockFriendRequests.find(
    req => (req.fromUserId === fromUserId && req.toUserId === toUserId) ||
           (req.fromUserId === toUserId && req.toUserId === fromUserId)
  );
  
  if (existingRequest) {
    throw new Error('Friend request already exists');
  }
  
  // Create new request
  const newRequest: FriendRequest = {
    id: `req-${Math.random().toString(36).substring(2, 9)}`,
    fromUserId,
    fromUsername,
    fromAvatar,
    toUserId,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  mockFriendRequests.push(newRequest);
  
  return newRequest;
}

// Get friend requests for user
export async function getFriendRequests(userId: string): Promise<FriendRequest[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockFriendRequests.filter(req => req.toUserId === userId && req.status === 'pending');
}

// Accept friend request
export async function acceptFriendRequest(requestId: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Find request
  const requestIndex = mockFriendRequests.findIndex(req => req.id === requestId);
  if (requestIndex === -1) {
    throw new Error('Friend request not found');
  }
  
  const request = mockFriendRequests[requestIndex];
  
  // Update request status
  mockFriendRequests[requestIndex] = { ...request, status: 'accepted' };
  
  // Add to each user's friends list
  const newFriend1: Friend = {
    id: `friend-${Math.random().toString(36).substring(2, 9)}`,
    userId: request.toUserId,
    friendId: request.fromUserId,
    username: request.fromUsername,
    avatar: request.fromAvatar,
    status: 'accepted',
    createdAt: new Date().toISOString()
  };
  
  const newFriend2: Friend = {
    id: `friend-${Math.random().toString(36).substring(2, 9)}`,
    userId: request.fromUserId,
    friendId: request.toUserId,
    username: 'Mock Friend Name', // This would come from the toUser in a real app
    status: 'accepted',
    createdAt: new Date().toISOString()
  };
  
  // Initialize friends lists if they don't exist
  if (!mockFriends[request.toUserId]) {
    mockFriends[request.toUserId] = [];
  }
  
  if (!mockFriends[request.fromUserId]) {
    mockFriends[request.fromUserId] = [];
  }
  
  mockFriends[request.toUserId].push(newFriend1);
  mockFriends[request.fromUserId].push(newFriend2);
  
  // Add activity item
  const activityItem: ActivityItem = {
    id: `activity-${Math.random().toString(36).substring(2, 9)}`,
    userId: request.toUserId,
    username: 'You', // This would be the actual username in a real app
    type: 'became-friends',
    data: {
      friendId: request.fromUserId,
      friendName: request.fromUsername
    },
    createdAt: new Date().toISOString()
  };
  
  mockActivity.push(activityItem);
}

// Decline friend request
export async function declineFriendRequest(requestId: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Find request
  const requestIndex = mockFriendRequests.findIndex(req => req.id === requestId);
  if (requestIndex === -1) {
    throw new Error('Friend request not found');
  }
  
  // Update request status
  mockFriendRequests[requestIndex] = { 
    ...mockFriendRequests[requestIndex], 
    status: 'declined' 
  };
}

// Remove friend
export async function removeFriend(userId: string, friendId: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Check if user's friends list exists
  if (!mockFriends[userId]) {
    throw new Error('Friends list not found');
  }
  
  // Find friend in user's list
  const friendIndex = mockFriends[userId].findIndex(friend => friend.friendId === friendId);
  if (friendIndex === -1) {
    throw new Error('Friend not found');
  }
  
  // Remove friend from user's list
  mockFriends[userId].splice(friendIndex, 1);
  
  // Remove user from friend's list (if it exists)
  if (mockFriends[friendId]) {
    const userIndex = mockFriends[friendId].findIndex(friend => friend.friendId === userId);
    if (userIndex !== -1) {
      mockFriends[friendId].splice(userIndex, 1);
    }
  }
}

// Get activity feed
export async function getActivityFeed(userId: string): Promise<ActivityItem[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would filter for activities relevant to the user
  // For this mock, we'll just return all activities
  return mockActivity
    .filter(item => item.userId === userId || 
                    (mockFriends[userId] && mockFriends[userId].some(f => f.friendId === item.userId)))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}