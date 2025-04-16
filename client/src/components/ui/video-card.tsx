import { formatDistanceToNow } from 'date-fns';
import { Link } from 'wouter';
import { VideoWithDetails } from '@shared/schema';

interface VideoCardProps {
  video: VideoWithDetails;
  className?: string;
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const formatViews = (views: number) => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
};

export function VideoCard({ video, className = "" }: VideoCardProps) {
  const createdAtDate = new Date(video.createdAt);
  const timeAgo = formatDistanceToNow(createdAtDate, { addSuffix: false });

  return (
    <Link href={`/video/${video.id}`}>
      <div className={`video-card bg-dark rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${className}`}>
        <div className="relative">
          <img 
            src={video.thumbnailUrl} 
            alt={video.title} 
            className="w-full aspect-video object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
            {formatDuration(video.duration)}
          </div>
        </div>
        <div className="p-3">
          <div className="flex">
            <div className="flex-shrink-0 mr-3">
              <img 
                src={video.channel.avatarUrl} 
                alt={`${video.channel.name} avatar`} 
                className="w-9 h-9 rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium leading-tight mb-1 line-clamp-2">{video.title}</h3>
              <p className="text-textgray text-sm">{video.channel.name}</p>
              <p className="text-textgray text-xs mt-1">
                {formatViews(video.views)} views • {timeAgo} ago
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function VideoCardHorizontal({ video, className = "" }: VideoCardProps) {
  const createdAtDate = new Date(video.createdAt);
  const timeAgo = formatDistanceToNow(createdAtDate, { addSuffix: false });

  return (
    <Link href={`/video/${video.id}`}>
      <div className={`flex bg-darklight rounded-lg overflow-hidden cursor-pointer ${className}`}>
        <div className="w-40 flex-shrink-0">
          <img 
            src={video.thumbnailUrl} 
            alt={video.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-3">
          <h4 className="font-medium text-sm mb-1 line-clamp-2">{video.title}</h4>
          <p className="text-textgray text-xs">{video.channel.name}</p>
          <p className="text-textgray text-xs mt-1">
            {formatViews(video.views)} views • {timeAgo} ago
          </p>
        </div>
      </div>
    </Link>
  );
}
