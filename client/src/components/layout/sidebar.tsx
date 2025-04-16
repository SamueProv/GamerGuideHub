import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Home, TrendingUp, Gamepad2, Trophy, GraduationCap } from 'lucide-react';
import { Game, Channel } from '@shared/schema';

export default function Sidebar() {
  const [location] = useLocation();
  
  const { data: games } = useQuery<Game[]>({
    queryKey: ['/api/games'],
  });
  
  const { data: channels } = useQuery<Channel[]>({
    queryKey: ['/api/channels'],
  });

  return (
    <aside className="hidden lg:block w-60 bg-dark overflow-y-auto border-r border-darklight">
      <div className="p-3">
        <nav>
          <ul>
            <li className="mb-1">
              <Link href="/">
                <a className={`flex items-center p-2 rounded-lg hover:bg-darklight ${location === '/' ? 'bg-darklight' : ''}`}>
                  <Home className="h-5 w-5 mr-6" />
                  <span>Home</span>
                </a>
              </Link>
            </li>
            <li className="mb-1">
              <Link href="/trending">
                <a className={`flex items-center p-2 rounded-lg hover:bg-darklight ${location === '/trending' ? 'bg-darklight' : ''}`}>
                  <TrendingUp className="h-5 w-5 mr-6" />
                  <span>Trending</span>
                </a>
              </Link>
            </li>
            <li className="mb-1">
              <Link href="/gaming">
                <a className={`flex items-center p-2 rounded-lg hover:bg-darklight ${location === '/gaming' ? 'bg-darklight' : ''}`}>
                  <Gamepad2 className="h-5 w-5 mr-6" />
                  <span>Gaming</span>
                </a>
              </Link>
            </li>
            <li className="mb-1">
              <Link href="/esports">
                <a className={`flex items-center p-2 rounded-lg hover:bg-darklight ${location === '/esports' ? 'bg-darklight' : ''}`}>
                  <Trophy className="h-5 w-5 mr-6" />
                  <span>Esports</span>
                </a>
              </Link>
            </li>
            <li className="mb-1">
              <Link href="/guides">
                <a className={`flex items-center p-2 rounded-lg hover:bg-darklight ${location === '/guides' ? 'bg-darklight' : ''}`}>
                  <GraduationCap className="h-5 w-5 mr-6" />
                  <span>Guides</span>
                </a>
              </Link>
            </li>
          </ul>
        </nav>
        
        {games && games.length > 0 && (
          <div className="mt-4 pt-4 border-t border-darklight">
            <h3 className="px-3 text-gray-400 text-sm font-medium mb-2">POPULAR GAMES</h3>
            <ul>
              {games.map((game) => (
                <li key={game.id} className="mb-1">
                  <Link href={`/category/${game.slug}`}>
                    <a className={`flex items-center p-2 rounded-lg hover:bg-darklight ${location === `/category/${game.slug}` ? 'bg-darklight' : ''}`}>
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
          <div className="mt-4 pt-4 border-t border-darklight">
            <h3 className="px-3 text-gray-400 text-sm font-medium mb-2">SUBSCRIPTIONS</h3>
            <ul>
              {channels.map((channel) => (
                <li key={channel.id} className="mb-1">
                  <Link href={`/channel/${channel.id}`}>
                    <a className={`flex items-center p-2 rounded-lg hover:bg-darklight ${location.startsWith(`/channel/${channel.id}`) ? 'bg-darklight' : ''}`}>
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
    </aside>
  );
}
