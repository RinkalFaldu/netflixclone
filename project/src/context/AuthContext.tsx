import { createContext, useState, useEffect, ReactNode } from 'react';

// Define user type
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}

// Define context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  initialized: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Mock user authentication - this would be replaced with actual auth logic
  useEffect(() => {
    // Simulate checking for a stored session
    const storedUser = localStorage.getItem('netflix_social_user');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('netflix_social_user');
      }
    }
    
    setLoading(false);
    setInitialized(true);
  }, []);

  // Mock sign in function - would be replaced with actual auth
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful sign in
      const newUser: User = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        email,
        username: email.split('@')[0],
      };
      
      setUser(newUser);
      localStorage.setItem('netflix_social_user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock sign up function
  const signUp = async (email: string, password: string, username: string) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful sign up
      const newUser: User = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        email,
        username,
      };
      
      setUser(newUser);
      localStorage.setItem('netflix_social_user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock sign out function
  const signOut = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      localStorage.removeItem('netflix_social_user');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock update profile function
  const updateProfile = async (data: Partial<User>) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (user) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('netflix_social_user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        initialized,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}