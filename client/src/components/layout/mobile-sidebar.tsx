import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { X, Home, TrendingUp, Gamepad2, Trophy, GraduationCap } from 'lucide-react';
import { Game, Channel } from '@shared/schema';
import { Button } from '@/components/ui/button';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const [location] = useLocation();
  
  const { data: games } = useQuery<Game[]>({
    queryKey: ['/api/games'],
  });
  
  const { data: channels } = useQuery<Channel[]>({
    queryKey: ['/api/channels'],
  });

  if (!isOpen) return null;

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 lg:hidden">
      <div className="w-64 h-full bg-black overflow-y-auto">
        <div className="flex justify-between items-center p-3 border-b border-gray-800">
          <div className="flex items-center">
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
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6 text-white" />
          </Button>
        </div>
        
        <div className="p-3">
          <nav>
            <ul>
              <li className="mb-1">
                <Link href="/">
                  <a 
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-800 ${location === '/' ? 'bg-gray-800' : ''}`}
                    onClick={handleLinkClick}
                  >
                    <Home className="h-5 w-5 mr-6" />
                    <span>Home</span>
                  </a>
                </Link>
              </li>
              <li className="mb-1">
                <Link href="/trending">
                  <a 
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-800 ${location === '/trending' ? 'bg-gray-800' : ''}`}
                    onClick={handleLinkClick}
                  >
                    <TrendingUp className="h-5 w-5 mr-6" />
                    <span>Trending</span>
                  </a>
                </Link>
              </li>
              <li className="mb-1">
                <Link href="/gaming">
                  <a 
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-800 ${location === '/gaming' ? 'bg-gray-800' : ''}`}
                    onClick={handleLinkClick}
                  >
                    <Gamepad2 className="h-5 w-5 mr-6" />
                    <span>Gaming</span>
                  </a>
                </Link>
              </li>
              <li className="mb-1">
                <Link href="/esports">
                  <a 
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-800 ${location === '/esports' ? 'bg-gray-800' : ''}`}
                    onClick={handleLinkClick}
                  >
                    <Trophy className="h-5 w-5 mr-6" />
                    <span>Esports</span>
                  </a>
                </Link>
              </li>
              <li className="mb-1">
                <Link href="/guides">
                  <a 
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-800 ${location === '/guides' ? 'bg-gray-800' : ''}`}
                    onClick={handleLinkClick}
                  >
                    <GraduationCap className="h-5 w-5 mr-6" />
                    <span>Guides</span>
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
          
          {games && games.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <h3 className="px-3 text-gray-400 text-sm font-medium mb-2">POPULAR GAMES</h3>
              <ul>
                {games.map((game) => (
                  <li key={game.id} className="mb-1">
                    <Link href={`/category/${game.slug}`}>
                      <a 
                        className={`flex items-center p-2 rounded-lg hover:bg-gray-800 ${location === `/category/${game.slug}` ? 'bg-gray-800' : ''}`}
                        onClick={handleLinkClick}
                      >
                        <img 
                          src={game.thumbnailUrl} 
                          className="w-6 h-6 rounded-full mr-6" 
                          alt={game.name} 
                        />
                        <span>{game.name}</span>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {channels && channels.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <h3 className="px-3 text-gray-400 text-sm font-medium mb-2">SUBSCRIPTIONS</h3>
              <ul>
                {channels.map((channel) => (
                  <li key={channel.id} className="mb-1">
                    <Link href={`/channel/${channel.id}`}>
                      <a 
                        className={`flex items-center p-2 rounded-lg hover:bg-gray-800 ${location.startsWith(`/channel/${channel.id}`) ? 'bg-gray-800' : ''}`}
                        onClick={handleLinkClick}
                      >
                        <img 
                          src={channel.avatarUrl} 
                          className="w-6 h-6 rounded-full mr-6" 
                          alt={channel.name} 
                        />
                        <span>{channel.name}</span>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
