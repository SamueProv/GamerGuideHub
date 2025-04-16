import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { VideoWithDetails } from '@shared/schema';
import { VideoPlayer } from '@/components/ui/video-player';
import { Skeleton } from '@/components/ui/skeleton';

export default function Video() {
  const { id } = useParams();
  const videoId = parseInt(id);
  
  const { data: video, isLoading: isVideoLoading } = useQuery<VideoWithDetails>({
    queryKey: [`/api/videos/${videoId}`],
    enabled: !isNaN(videoId),
  });
  
  const { data: recommendedVideos, isLoading: isRecommendedLoading } = useQuery<VideoWithDetails[]>({
    queryKey: [`/api/videos/recommended/${videoId}`],
    enabled: !isNaN(videoId),
  });

  if (isVideoLoading || isRecommendedLoading) {
    return (
      <div className="container mx-auto max-w-6xl p-4">
        <Skeleton className="w-full aspect-video mb-4" />
        <Skeleton className="w-full h-40 mb-4 rounded-lg" />
        <Skeleton className="w-full h-60 rounded-lg" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="container mx-auto max-w-6xl p-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Video not found</h2>
        <p className="text-gray-400">The video you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <VideoPlayer 
      video={video} 
      recommendedVideos={recommendedVideos || []} 
    />
  );
}
