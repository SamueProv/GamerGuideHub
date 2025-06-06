import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Game } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryTabsProps {
  selectedCategory?: string;
}

export default function CategoryTabs({ selectedCategory }: CategoryTabsProps) {
  const [location] = useLocation();
  
  const { data: games, isLoading } = useQuery<Game[]>({
    queryKey: ['/api/games'],
  });

  return (
    <>
      {/* Mobile Category Pills */}
      <div className="md:hidden overflow-x-auto whitespace-nowrap p-2 bg-black border-b border-gray-800">
        <Link href="/">
          <Button 
            variant={!selectedCategory ? "default" : "secondary"}
            className={!selectedCategory ? "bg-gray-900 text-white" : "bg-gray-800 text-white"} 
            size="sm"
          >
            All
          </Button>
        </Link>
        
        {isLoading ? (
          <>
            <Skeleton className="inline-block h-8 w-20 mx-2 rounded-full" />
            <Skeleton className="inline-block h-8 w-20 mx-2 rounded-full" />
            <Skeleton className="inline-block h-8 w-20 mx-2 rounded-full" />
          </>
        ) : (
          games?.map((game) => (
            <Link key={game.id} href={`/category/${game.slug}`}>
              <Button 
                variant={selectedCategory === game.slug ? "default" : "secondary"}
                className={`mx-2 ${selectedCategory === game.slug ? "bg-gray-900 text-white" : "bg-gray-800 text-white"}`}
                size="sm"
              >
                {game.name}
              </Button>
            </Link>
          ))
        )}
      </div>

      {/* Desktop Category Tabs */}
      <div className="hidden md:flex overflow-x-auto whitespace-nowrap p-3 bg-black border-b border-gray-800">
        <Link href="/">
          <Button 
            variant={!selectedCategory ? "default" : "secondary"}
            className={!selectedCategory ? "bg-gray-900 text-white mr-2" : "bg-gray-800 text-white mr-2"} 
          >
            All
          </Button>
        </Link>
        
        {isLoading ? (
          <>
            <Skeleton className="inline-block h-9 w-24 mx-2 rounded-full" />
            <Skeleton className="inline-block h-9 w-24 mx-2 rounded-full" />
            <Skeleton className="inline-block h-9 w-24 mx-2 rounded-full" />
          </>
        ) : (
          games?.map((game) => (
            <Link key={game.id} href={`/category/${game.slug}`}>
              <Button 
                variant={selectedCategory === game.slug ? "default" : "secondary"}
                className={`mr-2 ${selectedCategory === game.slug ? "bg-gray-900 text-white" : "bg-gray-800 text-white"}`}
              >
                {game.name}
              </Button>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
