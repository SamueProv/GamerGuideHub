import { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player/lazy';
import { Button } from '@/components/ui/button';
import { VideoWithDetails } from '@shared/schema';
import { VideoCardHorizontal } from './video-card';
import { formatDistanceToNow } from 'date-fns';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Settings, 
  Expand, 
  X,
  ThumbsUp, 
  ThumbsDown, 
  Share, 
  Subtitles 
} from 'lucide-react';

interface VideoPlayerProps {
  video: VideoWithDetails;
  recommendedVideos: VideoWithDetails[];
  onClose?: () => void;
  isModal?: boolean;
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

export function VideoPlayer({ video, recommendedVideos, onClose, isModal = false }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<ReactPlayer>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleProgress = (state: { played: number }) => {
    setPlayed(state.played);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current) {
      const bounds = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - bounds.left) / bounds.width;
      playerRef.current?.seekTo(percent);
    }
  };
  
  const createdAtDate = new Date(video.createdAt);
  const timeAgo = formatDistanceToNow(createdAtDate, { addSuffix: false });
  
  // Container classes change based on whether this is a modal or not
  const containerClasses = isModal
    ? "fixed inset-0 bg-black bg-opacity-90 z-50 overflow-y-auto"
    : "container mx-auto max-w-6xl p-4";

  return (
    <div className={containerClasses}>
      <div className="container mx-auto h-full max-w-6xl p-4 flex flex-col">
        {/* Video Player Header */}
        {isModal && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white truncate">{video.title}</h2>
            <button 
              onClick={onClose} 
              className="text-white hover:text-red-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        )}
        
        {/* Video Player */}
        <div className="relative bg-black aspect-video w-full max-h-[70vh] mb-4">
          <ReactPlayer
            ref={playerRef}
            url={video.videoUrl}
            width="100%"
            height="100%"
            playing={isPlaying}
            muted={isMuted}
            onProgress={handleProgress}
            onDuration={handleDuration}
            progressInterval={1000}
            style={{ position: 'absolute', top: 0, left: 0 }}
            config={{
              youtube: {
                playerVars: { modestbranding: 1 }
              }
            }}
          />
          
          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <div className="flex flex-col">
              {/* Progress bar */}
              <div 
                ref={progressRef}
                className="w-full bg-gray-600 h-1 rounded-full mb-2 cursor-pointer"
                onClick={handleSeek}
              >
                <div 
                  className="bg-primary h-1 rounded-full" 
                  style={{ width: `${played * 100}%` }}
                />
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white mr-4"
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white mr-4"
                    onClick={handleMute}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <span className="text-white text-sm">
                    {formatDuration(played * duration)} / {formatDuration(duration)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Button variant="ghost" size="icon" className="text-white mr-4">
                    <Subtitles className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white mr-4">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Expand className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Video Info */}
        <div className="bg-darkgray rounded-lg p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold mb-1">{video.title}</h3>
              <p className="text-textgray text-sm">
                {formatViews(video.views)} views • {timeAgo} ago
              </p>
            </div>
            <div className="flex mt-4 sm:mt-0">
              <Button 
                variant="secondary" 
                className="bg-darklight hover:bg-primary mr-2 flex items-center"
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                <span>24K</span>
              </Button>
              <Button 
                variant="secondary" 
                className="bg-darklight hover:bg-darklight mr-2 flex items-center"
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                <span>1K</span>
              </Button>
              <Button 
                variant="secondary" 
                className="bg-darklight hover:bg-darklight flex items-center"
              >
                <Share className="h-4 w-4 mr-2" />
                <span>Share</span>
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-darklight">
            <div className="flex items-center">
              <img 
                src={video.channel.avatarUrl} 
                alt={`${video.channel.name} channel`} 
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h4 className="font-medium">{video.channel.name}</h4>
                <p className="text-textgray text-xs">{formatViews(video.channel.subscriberCount)} subscribers</p>
              </div>
            </div>
            <Button className="bg-primary hover:bg-opacity-80">
              Subscribe
            </Button>
          </div>
        </div>
        
        {/* Recommendations */}
        <div className="bg-darkgray rounded-lg p-4 overflow-y-auto flex-grow">
          <h3 className="text-lg font-bold mb-4">Recommended Videos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedVideos.map((video) => (
              <VideoCardHorizontal key={video.id} video={video} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
