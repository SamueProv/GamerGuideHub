import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  onMenuClick: () => void;
  onSearchToggle: () => void;
  isMobileSearchOpen: boolean;
}

export default function Header({ onMenuClick, onSearchToggle, isMobileSearchOpen }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [, navigate] = useLocation();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-gray-800">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 lg:hidden" 
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6 text-white" />
          </Button>
          <Link href="/" className="flex items-center">
            <svg 
              className="h-8 w-8 text-red-600 mr-1" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
            <h1 className="text-xl font-bold">
              <span className="text-white">Dino</span>
              <span className="text-red-600">Games</span>
            </h1>
          </Link>
        </div>
        
        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-grow max-w-3xl mx-4">
          <div className="relative w-full flex">
            <Input
              type="text"
              placeholder="Search for game guides..."
              className="w-full py-2 px-4 bg-gray-800 rounded-l-full text-white placeholder:text-gray-400 border-r-0 border-gray-700 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button 
              className="bg-gray-700 hover:bg-gray-600 rounded-l-none rounded-r-full px-4"
              onClick={handleSearch}
            >
              <Search className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden mr-3" 
            onClick={onSearchToggle}
          >
            <Search className="h-6 w-6 text-white" />
          </Button>
          <Button variant="ghost" size="icon" className="ml-1">
            <Bell className="h-6 w-6 text-white" />
          </Button>
          <div className="ml-3 flex items-center">
            <img 
              src="https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?auto=format&fit=crop&w=40&h=40" 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </div>
      </div>
      
      {/* Mobile Search (Togglable) */}
      {isMobileSearchOpen && (
        <div className="md:hidden p-3 border-t border-gray-800">
          <div className="relative w-full flex">
            <Input
              type="text"
              placeholder="Search for game guides..."
              className="w-full py-2 px-4 bg-gray-800 rounded-l-full text-white placeholder:text-gray-400 border-r-0 border-gray-700 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button 
              className="bg-gray-700 hover:bg-gray-600 rounded-l-none rounded-r-full px-4"
              onClick={handleSearch}
            >
              <Search className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
