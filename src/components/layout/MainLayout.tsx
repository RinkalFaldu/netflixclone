import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';

export function MainLayout() {
  const { user, initialized } = useAuth();
  
  // This effect could be used for analytics or other initialization
  useEffect(() => {
    if (initialized) {
      console.log("App fully initialized");
    }
  }, [initialized]);

  return (
    <div className="flex flex-col min-h-screen bg-netflix-black text-white">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}