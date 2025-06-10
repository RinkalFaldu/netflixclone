import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClose: () => void;
}

export function SearchBar({ onSearch, onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto focus the input when the search bar appears
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Handle escape key to close search
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className="absolute right-0 top-0 flex items-center bg-netflix-black border border-netflix-gray/30 rounded px-2 animate-fade-in"
    >
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies or friends..."
        className="bg-transparent text-white px-2 py-1 w-56 focus:outline-none"
      />
      <button 
        type="button" 
        onClick={onClose}
        className="ml-1 text-netflix-gray hover:text-white transition"
      >
        <X size={16} />
      </button>
    </form>
  );
}