import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { HomePage } from './pages/HomePage';

// Lazy loaded pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const MovieDetailsPage = lazy(() => import('./pages/MovieDetailsPage'));
const WatchlistPage = lazy(() => import('./pages/WatchlistPage'));
const FriendsPage = lazy(() => import('./pages/FriendsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const RecommendationsPage = lazy(() => import('./pages/RecommendationsPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/friends" element={<FriendsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;