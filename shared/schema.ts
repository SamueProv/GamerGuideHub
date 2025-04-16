import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").default(""),
  profilePicture: text("profile_picture").default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  profilePicture: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  thumbnailUrl: text("thumbnail_url").notNull(),
});

export const insertGameSchema = createInsertSchema(games).pick({
  name: true,
  slug: true,
  thumbnailUrl: true,
});

export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;

export const channels = pgTable("channels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  subscriberCount: integer("subscriber_count").notNull().default(0),
});

export const insertChannelSchema = createInsertSchema(channels).pick({
  name: true,
  avatarUrl: true,
  subscriberCount: true,
});

export type InsertChannel = z.infer<typeof insertChannelSchema>;
export type Channel = typeof channels.$inferSelect;

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  videoUrl: text("video_url").notNull(),
  duration: integer("duration").notNull(), // in seconds
  views: integer("views").notNull().default(0),
  gameId: integer("game_id").notNull().references(() => games.id),
  channelId: integer("channel_id").notNull().references(() => channels.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertVideoSchema = createInsertSchema(videos).pick({
  title: true,
  description: true,
  thumbnailUrl: true,
  videoUrl: true,
  duration: true,
  views: true,
  gameId: true,
  channelId: true,
});

export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;

// Extra types for API responses
export type VideoWithDetails = Video & {
  game: Game;
  channel: Channel;
};

export type GameWithVideos = Game & {
  videos: VideoWithDetails[];
};

export type ChannelWithVideos = Channel & {
  videos: VideoWithDetails[];
};
