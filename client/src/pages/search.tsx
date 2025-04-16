import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { VideoWithDetails } from '@shared/schema';
import { VideoCard } from '@/components/ui/video-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

export default function Search() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const url = new URL(window.location.href);
    const q = url.searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [location]);

  const { data: videos, isLoading, error } = useQuery<VideoWithDetails[]>({
    queryKey: [`/api/search?q=${encodeURIComponent(searchQuery)}`],
    enabled: searchQuery.length > 0,
  });

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-dark rounded-lg overflow-hidden">
          <Skeleton className="w-full aspect-video" />
          <div className="p-3">
            <div className="flex">
              <Skeleton className="w-9 h-9 rounded-full mr-3" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-3/4 mb-1" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Search Results</h1>
        {searchQuery && <p className="text-gray-400">Showing results for "{searchQuery}"</p>}
      </div>
      
      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="p-8 text-center">
          <h3 className="text-xl font-bold text-red-500 mb-2">Error searching videos</h3>
          <p className="text-gray-400">Please try again later</p>
        </div>
      ) : videos && videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : searchQuery ? (
        <div className="p-8 text-center">
          <h3 className="text-xl font-bold mb-2">No videos found for "{searchQuery}"</h3>
          <p className="text-gray-400">Try different keywords or check your spelling</p>
        </div>
      ) : (
        <div className="p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Enter a search term to find videos</h3>
        </div>
      )}
    </div>
  );
}
