import { 
  users, type User, type InsertUser,
  games, type Game, type InsertGame,
  channels, type Channel, type InsertChannel,
  videos, type Video, type InsertVideo, 
  type VideoWithDetails,
  type GameWithVideos,
  type ChannelWithVideos
} from "@shared/schema";

// Storage interface with CRUD methods for videos, games, and channels
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Game methods
  getAllGames(): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;
  getGameBySlug(slug: string): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
  
  // Channel methods
  getAllChannels(): Promise<Channel[]>;
  getChannel(id: number): Promise<Channel | undefined>;
  createChannel(channel: InsertChannel): Promise<Channel>;
  
  // Video methods
  getAllVideos(): Promise<Video[]>;
  getAllVideosWithDetails(): Promise<VideoWithDetails[]>;
  getVideo(id: number): Promise<Video | undefined>;
  getVideoWithDetails(id: number): Promise<VideoWithDetails | undefined>;
  getVideosByGameId(gameId: number): Promise<VideoWithDetails[]>;
  getVideosByGameSlug(slug: string): Promise<VideoWithDetails[]>;
  getVideosByChannelId(channelId: number): Promise<VideoWithDetails[]>;
  getRecommendedVideos(videoId: number): Promise<VideoWithDetails[]>;
  searchVideos(query: string): Promise<VideoWithDetails[]>;
  createVideo(video: InsertVideo): Promise<Video>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private channels: Map<number, Channel>;
  private videos: Map<number, Video>;
  
  private userIdCounter: number;
  private gameIdCounter: number;
  private channelIdCounter: number;
  private videoIdCounter: number;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.channels = new Map();
    this.videos = new Map();
    
    this.userIdCounter = 1;
    this.gameIdCounter = 1;
    this.channelIdCounter = 1;
    this.videoIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Game methods
  async getAllGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }
  
  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }
  
  async getGameBySlug(slug: string): Promise<Game | undefined> {
    return Array.from(this.games.values()).find(game => game.slug === slug);
  }
  
  async createGame(game: InsertGame): Promise<Game> {
    const id = game.id || this.gameIdCounter++;
    const newGame: Game = { ...game, id };
    this.games.set(id, newGame);
    return newGame;
  }
  
  // Channel methods
  async getAllChannels(): Promise<Channel[]> {
    return Array.from(this.channels.values());
  }
  
  async getChannel(id: number): Promise<Channel | undefined> {
    return this.channels.get(id);
  }
  
  async createChannel(channel: InsertChannel): Promise<Channel> {
    const id = channel.id || this.channelIdCounter++;
    const newChannel: Channel = { ...channel, id };
    this.channels.set(id, newChannel);
    return newChannel;
  }
  
  // Video methods
  async getAllVideos(): Promise<Video[]> {
    return Array.from(this.videos.values());
  }
  
  async getAllVideosWithDetails(): Promise<VideoWithDetails[]> {
    return Promise.all(
      Array.from(this.videos.values()).map(async (video) => {
        const game = await this.getGame(video.gameId);
        const channel = await this.getChannel(video.channelId);
        
        if (!game || !channel) {
          throw new Error(`Video ${video.id} has invalid game or channel reference`);
        }
        
        return {
          ...video,
          game,
          channel
        };
      })
    );
  }
  
  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }
  
  async getVideoWithDetails(id: number): Promise<VideoWithDetails | undefined> {
    const video = await this.getVideo(id);
    if (!video) return undefined;
    
    const game = await this.getGame(video.gameId);
    const channel = await this.getChannel(video.channelId);
    
    if (!game || !channel) return undefined;
    
    return {
      ...video,
      game,
      channel
    };
  }
  
  async getVideosByGameId(gameId: number): Promise<VideoWithDetails[]> {
    const matchingVideos = Array.from(this.videos.values()).filter(
      video => video.gameId === gameId
    );
    
    return Promise.all(
      matchingVideos.map(async (video) => {
        const game = await this.getGame(video.gameId);
        const channel = await this.getChannel(video.channelId);
        
        if (!game || !channel) {
          throw new Error(`Video ${video.id} has invalid game or channel reference`);
        }
        
        return {
          ...video,
          game,
          channel
        };
      })
    );
  }
  
  async getVideosByGameSlug(slug: string): Promise<VideoWithDetails[]> {
    const game = await this.getGameBySlug(slug);
    if (!game) return [];
    
    return this.getVideosByGameId(game.id);
  }
  
  async getVideosByChannelId(channelId: number): Promise<VideoWithDetails[]> {
    const matchingVideos = Array.from(this.videos.values()).filter(
      video => video.channelId === channelId
    );
    
    return Promise.all(
      matchingVideos.map(async (video) => {
        const game = await this.getGame(video.gameId);
        const channel = await this.getChannel(video.channelId);
        
        if (!game || !channel) {
          throw new Error(`Video ${video.id} has invalid game or channel reference`);
        }
        
        return {
          ...video,
          game,
          channel
        };
      })
    );
  }
  
  async getRecommendedVideos(videoId: number): Promise<VideoWithDetails[]> {
    const video = await this.getVideo(videoId);
    if (!video) return [];
    
    // First get videos with same game, excluding the current video
    let recommendedVideos = Array.from(this.videos.values()).filter(
      v => v.gameId === video.gameId && v.id !== videoId
    );
    
    // If we don't have enough, add other videos
    if (recommendedVideos.length < 5) {
      const otherVideos = Array.from(this.videos.values()).filter(
        v => v.id !== videoId && !recommendedVideos.includes(v)
      );
      
      recommendedVideos = [...recommendedVideos, ...otherVideos];
    }
    
    // Limit to 10 videos
    recommendedVideos = recommendedVideos.slice(0, 10);
    
    return Promise.all(
      recommendedVideos.map(async (video) => {
        const game = await this.getGame(video.gameId);
        const channel = await this.getChannel(video.channelId);
        
        if (!game || !channel) {
          throw new Error(`Video ${video.id} has invalid game or channel reference`);
        }
        
        return {
          ...video,
          game,
          channel
        };
      })
    );
  }
  
  async searchVideos(query: string): Promise<VideoWithDetails[]> {
    if (!query) return [];
    
    const normalizedQuery = query.toLowerCase();
    
    const matchingVideos = Array.from(this.videos.values()).filter(video => {
      return (
        video.title.toLowerCase().includes(normalizedQuery) || 
        video.description.toLowerCase().includes(normalizedQuery)
      );
    });
    
    return Promise.all(
      matchingVideos.map(async (video) => {
        const game = await this.getGame(video.gameId);
        const channel = await this.getChannel(video.channelId);
        
        if (!game || !channel) {
          throw new Error(`Video ${video.id} has invalid game or channel reference`);
        }
        
        return {
          ...video,
          game,
          channel
        };
      })
    );
  }
  
  async createVideo(video: InsertVideo): Promise<Video> {
    const id = video.id || this.videoIdCounter++;
    const newVideo: Video = { ...video, id };
    this.videos.set(id, newVideo);
    return newVideo;
  }
}

export const storage = new MemStorage();
