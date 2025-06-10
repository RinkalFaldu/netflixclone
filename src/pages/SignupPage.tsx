import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingScreen } from '../components/ui/LoadingScreen';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { user, loading, signUp } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password || !username) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      await signUp(email, password, username);
      navigate('/');
    } catch (err) {
      setError('Failed to create account');
      console.error(err);
    }
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: 'url(https://images.pexels.com/photos/8092509/pexels-photo-8092509.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)' }}
    >
      <div className="absolute inset-0 bg-black/70"></div>
      
      <div className="w-full max-w-md bg-black/75 p-8 rounded-md z-10 animate-fade-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-netflix-red font-bold text-4xl">NetflixSocial</h1>
          </Link>
        </div>
        
        <h2 className="text-3xl font-bold mb-6">Sign Up</h2>
        
        {error && (
          <div className="bg-error-dark/20 border border-error-dark text-white px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="sr-only">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-netflix-red"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-netflix-red"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password (6+ characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-netflix-red"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-netflix-red hover:bg-netflix-red/90 text-white font-semibold py-3 rounded transition-colors"
          >
            Sign Up
          </button>
        </form>
        
        <div className="mt-4 text-gray-400 text-sm">
          <p>
            For demo purposes, any email, username and password will work.
          </p>
        </div>
        
        <div className="mt-6 text-gray-400">
          <p>
            Already have an account? <Link to="/login" className="text-white hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}