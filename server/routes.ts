import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";
import { sendCodeUpdates } from "./email";
import { setupAuth } from "./auth";
import { InsertGame, InsertChannel, InsertVideo } from "@shared/schema";

// Load mock data
const loadJsonData = <T>(filename: string): T => {
  const filePath = path.join(process.cwd(), 'server', 'data', filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize the server with data
  const initialize = async () => {
    try {
      const videosData = loadJsonData<InsertVideo[]>('videos.json');
      const gamesData = loadJsonData<InsertGame[]>('games.json');
      const channelsData = loadJsonData<InsertChannel[]>('channels.json');
      
      // Preload the data into storage
      await Promise.all([
        ...gamesData.map((game) => storage.createGame(game)),
        ...channelsData.map((channel) => storage.createChannel(channel)),
      ]);
      
      // Add videos after games and channels
      await Promise.all(videosData.map((video) => storage.createVideo(video)));
      
      console.log('Mock data loaded successfully');
    } catch (error) {
      console.error('Error loading mock data:', error);
    }
  };
  
  // Set up authentication
  setupAuth(app);
  
  // Initialize with mock data
  await initialize();

  // API Routes
  app.get('/api/videos', async (req, res) => {
    try {
      const videos = await storage.getAllVideosWithDetails();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch videos' });
    }
  });

  app.get('/api/videos/:id', async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      if (isNaN(videoId)) {
        return res.status(400).json({ error: 'Invalid video ID' });
      }
      
      const video = await storage.getVideoWithDetails(videoId);
      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }
      
      res.json(video);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch video' });
    }
  });

  app.get('/api/videos/game/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const videos = await storage.getVideosByGameSlug(slug);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch game videos' });
    }
  });
  
  app.get('/api/videos/recommended/:id', async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      if (isNaN(videoId)) {
        return res.status(400).json({ error: 'Invalid video ID' });
      }
      
      const videos = await storage.getRecommendedVideos(videoId);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch recommended videos' });
    }
  });

  app.get('/api/games', async (req, res) => {
    try {
      const games = await storage.getAllGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch games' });
    }
  });

  app.get('/api/games/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const game = await storage.getGameBySlug(slug);
      
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }
      
      res.json(game);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch game' });
    }
  });

  app.get('/api/channels', async (req, res) => {
    try {
      const channels = await storage.getAllChannels();
      res.json(channels);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch channels' });
    }
  });

  app.get('/api/search', async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
      }
      
      const videos = await storage.searchVideos(query);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: 'Failed to search videos' });
    }
  });

  // Email-related endpoints
  app.post('/api/send-code', async (req: Request, res: Response) => {
    try {
      const { email, code } = req.body;
      
      if (!email || !code) {
        return res.status(400).json({ 
          success: false, 
          error: 'Email and code are required' 
        });
      }
      
      const result = await sendCodeUpdates(email, code);
      
      if (result) {
        res.json({ success: true, message: 'Code sent successfully' });
      } else {
        res.status(500).json({ 
          success: false, 
          error: 'Failed to send code via email' 
        });
      }
    } catch (error) {
      console.error('Error sending code via email:', error);
      res.status(500).json({ 
        success: false, 
        error: 'An error occurred while sending the code' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
