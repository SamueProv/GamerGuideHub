import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { VideoWithDetails, Game } from '@shared/schema';
import { VideoCard } from '@/components/ui/video-card';
import CategoryTabs from '@/components/layout/category-tabs';
import { Skeleton } from '@/components/ui/skeleton';

export default function Category() {
  const { slug } = useParams();
  
  const { data: game, isLoading: isGameLoading } = useQuery<Game>({
    queryKey: [`/api/games/${slug}`],
  });
  
  const { data: videos, isLoading: isVideosLoading } = useQuery<VideoWithDetails[]>({
    queryKey: [`/api/videos/game/${slug}`],
    enabled: !!slug,
  });

  const isLoading = isGameLoading || isVideosLoading;

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
    <>
      <CategoryTabs selectedCategory={slug} />
      
      <div className="p-4">
        {!isLoading && game && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">{game.name} Videos</h1>
            <p className="text-gray-400">Browse the best {game.name} guides and gameplay videos</p>
          </div>
        )}
        
        {isLoading ? (
          <LoadingSkeleton />
        ) : videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <h3 className="text-xl font-bold mb-2">No videos found for this game</h3>
            <p className="text-gray-400">Check back later for new content</p>
          </div>
        )}
      </div>
    </>
  );
}
