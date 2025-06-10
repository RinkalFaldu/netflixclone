import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        <h1 className="text-6xl font-bold text-netflix-red mb-6">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center bg-netflix-red hover:bg-netflix-red/90 text-white px-6 py-2 rounded transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}