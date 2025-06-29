import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPostSchema, insertCommentSchema, insertCircleSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Initialize default circles if they don't exist
  app.get('/api/init', async (req, res) => {
    try {
      const circles = await storage.getAllCircles();
      if (circles.length === 0) {
        const defaultCircles = [
          { name: "Study & School Life", description: "Academic support and study tips", icon: "fas fa-book", color: "blue" },
          { name: "Mental Wellness & Self-Care", description: "Mental health and wellness support", icon: "fas fa-heart", color: "green" },
          { name: "Creative Space", description: "Art, writing, music and creativity", icon: "fas fa-palette", color: "purple" },
          { name: "Style & Beauty", description: "Fashion and beauty discussions", icon: "fas fa-sparkles", color: "pink" },
          { name: "College & Career", description: "Career advice and college prep", icon: "fas fa-graduation-cap", color: "yellow" },
        ];

        for (const circle of defaultCircles) {
          await storage.createCircle?.(circle);
        }
      }
      res.json({ message: "Initialized successfully" });
    } catch (error) {
      console.error("Error initializing:", error);
      res.status(500).json({ message: "Failed to initialize" });
    }
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updateData = req.body;
      
      // Validate age for community guidelines (13-25)
      if (updateData.age && (updateData.age < 13 || updateData.age > 25)) {
        return res.status(400).json({ message: "Age must be between 13 and 25" });
      }

      const user = await storage.updateUserProfile(userId, updateData);
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Circle routes
  app.get('/api/circles', async (req, res) => {
    try {
      const circles = await storage.getAllCircles();
      res.json(circles);
    } catch (error) {
      console.error("Error fetching circles:", error);
      res.status(500).json({ message: "Failed to fetch circles" });
    }
  });

  app.get('/api/circles/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const circles = await storage.getUserCircles(userId);
      res.json(circles);
    } catch (error) {
      console.error("Error fetching user circles:", error);
      res.status(500).json({ message: "Failed to fetch user circles" });
    }
  });

  app.post('/api/circles/:id/join', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const circleId = parseInt(req.params.id);
      
      await storage.joinCircle(userId, circleId);
      res.json({ message: "Joined circle successfully" });
    } catch (error) {
      console.error("Error joining circle:", error);
      res.status(500).json({ message: "Failed to join circle" });
    }
  });

  app.delete('/api/circles/:id/leave', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const circleId = parseInt(req.params.id);
      
      await storage.leaveCircle(userId, circleId);
      res.json({ message: "Left circle successfully" });
    } catch (error) {
      console.error("Error leaving circle:", error);
      res.status(500).json({ message: "Failed to leave circle" });
    }
  });

  // Post routes
  app.get('/api/posts/feed', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const posts = await storage.getFeedPosts(userId, limit);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching feed:", error);
      res.status(500).json({ message: "Failed to fetch feed" });
    }
  });

  app.get('/api/posts/circle/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const circleId = parseInt(req.params.id);
      const limit = parseInt(req.query.limit as string) || 20;
      
      const posts = await storage.getPostsByCircle(circleId, userId, limit);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching circle posts:", error);
      res.status(500).json({ message: "Failed to fetch circle posts" });
    }
  });

  app.get('/api/posts/user/:id', isAuthenticated, async (req: any, res) => {
    try {
      const currentUserId = req.user.claims.sub;
      const targetUserId = req.params.id;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const posts = await storage.getUserPosts(targetUserId, limit);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      res.status(500).json({ message: "Failed to fetch user posts" });
    }
  });

  app.post('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const validatedData = insertPostSchema.parse({
        ...req.body,
        authorId: userId,
      });

      const post = await storage.createPost(validatedData);
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid post data", errors: error.errors });
      }
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.delete('/api/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = parseInt(req.params.id);
      
      const deleted = await storage.deletePost(postId, userId);
      if (!deleted) {
        return res.status(404).json({ message: "Post not found or unauthorized" });
      }
      
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Interaction routes
  app.post('/api/posts/:id/like', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = parseInt(req.params.id);
      
      await storage.likePost(postId, userId);
      res.json({ message: "Post liked successfully" });
    } catch (error) {
      console.error("Error liking post:", error);
      res.status(500).json({ message: "Failed to like post" });
    }
  });

  app.delete('/api/posts/:id/like', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = parseInt(req.params.id);
      
      await storage.unlikePost(postId, userId);
      res.json({ message: "Post unliked successfully" });
    } catch (error) {
      console.error("Error unliking post:", error);
      res.status(500).json({ message: "Failed to unlike post" });
    }
  });

  app.get('/api/posts/:id/comments', isAuthenticated, async (req: any, res) => {
    try {
      const postId = parseInt(req.params.id);
      
      const comments = await storage.getPostComments(postId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post('/api/posts/:id/comments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = parseInt(req.params.id);
      
      const validatedData = insertCommentSchema.parse({
        ...req.body,
        postId,
        authorId: userId,
      });

      const comment = await storage.addComment(validatedData);
      res.json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
