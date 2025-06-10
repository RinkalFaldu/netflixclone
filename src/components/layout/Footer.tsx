import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-netflix-dark py-8 px-4 mt-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-netflix-red font-bold text-lg mb-4">NetflixSocial</h3>
            <p className="text-netflix-gray text-sm mb-4">
              Discover, share and recommend movies with friends. Your personal social movie platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-netflix-gray hover:text-white transition">
                <Github size={20} />
              </a>
              <a href="#" className="text-netflix-gray hover:text-white transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-netflix-gray hover:text-white transition">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-netflix-gray hover:text-white transition">Home</Link></li>
              <li><Link to="/watchlist" className="text-netflix-gray hover:text-white transition">My List</Link></li>
              <li><Link to="/friends" className="text-netflix-gray hover:text-white transition">Friends</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-netflix-gray hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="text-netflix-gray hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="text-netflix-gray hover:text-white transition">Cookie Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-netflix-gray">support@netflixsocial.com</li>
              <li className="text-netflix-gray">1-800-NETFLIX</li>
              <li className="text-netflix-gray">Los Gatos, California, USA</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-netflix-gray/20 text-sm text-netflix-gray text-center">
          <p>© {new Date().getFullYear()} NetflixSocial. All rights reserved.</p>
          <p className="mt-1">Not affiliated with Netflix, Inc. This is a demo project.</p>
        </div>
      </div>
    </footer>
  );
}