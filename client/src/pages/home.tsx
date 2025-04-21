import { useQuery } from '@tanstack/react-query';
import { VideoWithDetails } from '@shared/schema';
import { VideoCard } from '@/components/ui/video-card';
import CategoryTabs from '@/components/layout/category-tabs';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { data: videos, isLoading, error } = useQuery<VideoWithDetails[]>({
    queryKey: ['/api/videos'],
  });

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 bg-black">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-gray-900 rounded-lg overflow-hidden">
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
    <>
      <CategoryTabs />
      
      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="p-8 text-center bg-black text-white">
          <h3 className="text-xl font-bold text-red-500 mb-2">Error loading videos</h3>
          <p className="text-gray-400">Please try again later</p>
        </div>
      ) : videos && videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 bg-black">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-black text-white">
          <h3 className="text-xl font-bold mb-2">No videos found</h3>
          <p className="text-gray-400">Check back later for new content</p>
        </div>
      )}
    </>
  );
}
