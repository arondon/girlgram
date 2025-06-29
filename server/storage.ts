import {
  users,
  posts,
  circles,
  comments,
  likes,
  userCircles,
  type User,
  type UpsertUser,
  type Post,
  type PostWithAuthorAndCircle,
  type Circle,
  type Comment,
  type CommentWithAuthor,
  type InsertPost,
  type InsertComment,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(id: string, data: Partial<User>): Promise<User>;

  // Circle operations
  getAllCircles(): Promise<Circle[]>;
  getUserCircles(userId: string): Promise<Circle[]>;
  joinCircle(userId: string, circleId: number): Promise<void>;
  leaveCircle(userId: string, circleId: number): Promise<void>;
  createCircle(circle: any): Promise<Circle>;

  // Post operations
  createPost(post: InsertPost): Promise<Post>;
  getFeedPosts(userId: string, limit?: number): Promise<PostWithAuthorAndCircle[]>;
  getPostsByCircle(circleId: number, userId: string, limit?: number): Promise<PostWithAuthorAndCircle[]>;
  getUserPosts(userId: string, limit?: number): Promise<PostWithAuthorAndCircle[]>;
  deletePost(postId: number, userId: string): Promise<boolean>;

  // Interaction operations
  likePost(postId: number, userId: string): Promise<void>;
  unlikePost(postId: number, userId: string): Promise<void>;
  addComment(comment: InsertComment): Promise<Comment>;
  getPostComments(postId: number): Promise<CommentWithAuthor[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserProfile(id: string, data: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Circle operations
  async getAllCircles(): Promise<Circle[]> {
    return await db.select().from(circles);
  }

  async getUserCircles(userId: string): Promise<Circle[]> {
    const result = await db
      .select({
        id: circles.id,
        name: circles.name,
        description: circles.description,
        icon: circles.icon,
        color: circles.color,
        createdAt: circles.createdAt,
      })
      .from(userCircles)
      .innerJoin(circles, eq(userCircles.circleId, circles.id))
      .where(eq(userCircles.userId, userId));
    
    return result;
  }

  async joinCircle(userId: string, circleId: number): Promise<void> {
    await db
      .insert(userCircles)
      .values({ userId, circleId })
      .onConflictDoNothing();
  }

  async leaveCircle(userId: string, circleId: number): Promise<void> {
    await db
      .delete(userCircles)
      .where(and(eq(userCircles.userId, userId), eq(userCircles.circleId, circleId)));
  }

  async createCircle(circleData: any): Promise<Circle> {
    const [circle] = await db.insert(circles).values(circleData).returning();
    return circle;
  }

  // Post operations
  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async getFeedPosts(userId: string, limit = 20): Promise<PostWithAuthorAndCircle[]> {
    const result = await db
      .select({
        id: posts.id,
        authorId: posts.authorId,
        circleId: posts.circleId,
        content: posts.content,
        imageUrl: posts.imageUrl,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          age: users.age,
          bio: users.bio,
          interests: users.interests,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        },
        circle: {
          id: circles.id,
          name: circles.name,
          description: circles.description,
          icon: circles.icon,
          color: circles.color,
          createdAt: circles.createdAt,
        },
        likesCount: sql<number>`CAST(COUNT(DISTINCT ${likes.id}) AS INTEGER)`,
        commentsCount: sql<number>`CAST(COUNT(DISTINCT ${comments.id}) AS INTEGER)`,
        isLiked: sql<boolean>`CASE WHEN COUNT(DISTINCT CASE WHEN ${likes.userId} = ${userId} THEN ${likes.id} END) > 0 THEN true ELSE false END`,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .innerJoin(circles, eq(posts.circleId, circles.id))
      .leftJoin(likes, eq(posts.id, likes.postId))
      .leftJoin(comments, eq(posts.id, comments.postId))
      .groupBy(posts.id, users.id, circles.id)
      .orderBy(desc(posts.createdAt))
      .limit(limit);

    return result;
  }

  async getPostsByCircle(circleId: number, userId: string, limit = 20): Promise<PostWithAuthorAndCircle[]> {
    const result = await db
      .select({
        id: posts.id,
        authorId: posts.authorId,
        circleId: posts.circleId,
        content: posts.content,
        imageUrl: posts.imageUrl,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          age: users.age,
          bio: users.bio,
          interests: users.interests,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        },
        circle: {
          id: circles.id,
          name: circles.name,
          description: circles.description,
          icon: circles.icon,
          color: circles.color,
          createdAt: circles.createdAt,
        },
        likesCount: sql<number>`CAST(COUNT(DISTINCT ${likes.id}) AS INTEGER)`,
        commentsCount: sql<number>`CAST(COUNT(DISTINCT ${comments.id}) AS INTEGER)`,
        isLiked: sql<boolean>`CASE WHEN COUNT(DISTINCT CASE WHEN ${likes.userId} = ${userId} THEN ${likes.id} END) > 0 THEN true ELSE false END`,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .innerJoin(circles, eq(posts.circleId, circles.id))
      .leftJoin(likes, eq(posts.id, likes.postId))
      .leftJoin(comments, eq(posts.id, comments.postId))
      .where(eq(posts.circleId, circleId))
      .groupBy(posts.id, users.id, circles.id)
      .orderBy(desc(posts.createdAt))
      .limit(limit);

    return result;
  }

  async getUserPosts(userId: string, limit = 20): Promise<PostWithAuthorAndCircle[]> {
    const result = await db
      .select({
        id: posts.id,
        authorId: posts.authorId,
        circleId: posts.circleId,
        content: posts.content,
        imageUrl: posts.imageUrl,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          age: users.age,
          bio: users.bio,
          interests: users.interests,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        },
        circle: {
          id: circles.id,
          name: circles.name,
          description: circles.description,
          icon: circles.icon,
          color: circles.color,
          createdAt: circles.createdAt,
        },
        likesCount: sql<number>`CAST(COUNT(DISTINCT ${likes.id}) AS INTEGER)`,
        commentsCount: sql<number>`CAST(COUNT(DISTINCT ${comments.id}) AS INTEGER)`,
        isLiked: sql<boolean>`CASE WHEN COUNT(DISTINCT CASE WHEN ${likes.userId} = ${userId} THEN ${likes.id} END) > 0 THEN true ELSE false END`,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .innerJoin(circles, eq(posts.circleId, circles.id))
      .leftJoin(likes, eq(posts.id, likes.postId))
      .leftJoin(comments, eq(posts.id, comments.postId))
      .where(eq(posts.authorId, userId))
      .groupBy(posts.id, users.id, circles.id)
      .orderBy(desc(posts.createdAt))
      .limit(limit);

    return result;
  }

  async deletePost(postId: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(posts)
      .where(and(eq(posts.id, postId), eq(posts.authorId, userId)))
      .returning();
    
    return result.length > 0;
  }

  // Interaction operations
  async likePost(postId: number, userId: string): Promise<void> {
    await db
      .insert(likes)
      .values({ postId, userId })
      .onConflictDoNothing();
  }

  async unlikePost(postId: number, userId: string): Promise<void> {
    await db
      .delete(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, userId)));
  }

  async addComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    return newComment;
  }

  async getPostComments(postId: number): Promise<CommentWithAuthor[]> {
    const result = await db
      .select({
        id: comments.id,
        postId: comments.postId,
        authorId: comments.authorId,
        content: comments.content,
        createdAt: comments.createdAt,
        author: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          age: users.age,
          bio: users.bio,
          interests: users.interests,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        },
      })
      .from(comments)
      .innerJoin(users, eq(comments.authorId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));

    return result;
  }
}

export const storage = new DatabaseStorage();
