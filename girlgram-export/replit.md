# GirlGram - A Safe Community Platform

## Overview

GirlGram is a React-based community platform designed as a safe, uplifting online space for girls and young women aged 13-25. The application features a mobile-first design with themed discussion circles, posts, comments, and user profiles. Built with modern web technologies, it emphasizes safety, positivity, and authentic connections.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state and caching
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Neon serverless database
- **ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth integration with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store

### Mobile-First Design
- **Responsive Layout**: Optimized for mobile devices with max-width constraints
- **Progressive Enhancement**: Works on desktop but prioritizes mobile experience
- **Touch-Friendly**: Large touch targets and gesture-friendly interactions

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Session Storage**: PostgreSQL-based session store using connect-pg-simple
- **User Management**: Automatic user creation/updates on authentication
- **Protected Routes**: Authentication middleware for API endpoints

### Database Schema
- **Users**: Profile information, preferences, and metadata
- **Circles**: Themed discussion groups (Study, Mental Wellness, Creative, etc.)
- **Posts**: User-generated content within circles
- **Comments**: Threaded discussions on posts
- **Likes**: User engagement tracking
- **UserCircles**: Many-to-many relationship for circle membership
- **Sessions**: Authentication session persistence

### Community Features
- **Themed Circles**: Pre-defined interest groups for focused discussions
- **Post Creation**: Rich text content with circle assignment
- **Social Interactions**: Likes, comments, and replies
- **User Profiles**: Customizable profiles with bio and interests
- **Circle Management**: Join/leave functionality for community participation

## Data Flow

### Authentication Flow
1. User accesses protected route
2. Middleware checks session validity
3. If unauthenticated, redirects to Replit Auth
4. On successful auth, creates/updates user profile
5. Establishes persistent session

### Post Interaction Flow
1. User creates post with circle assignment
2. Backend validates and stores post data
3. Real-time updates via React Query invalidation
4. Feed updates reflect new content immediately
5. Social interactions (likes/comments) trigger similar flows

### Circle Membership Flow
1. User browses available circles
2. Join/leave actions update user-circle relationships
3. Feed content filters based on joined circles
4. Circle-specific views show relevant posts

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection Pooling**: Built-in connection management

### Authentication
- **Replit Auth**: OpenID Connect provider
- **Session Security**: Secure cookie-based sessions

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Lucide Icons**: Icon library for consistent UI
- **Tailwind CSS**: Utility-first styling framework

### Development Tools
- **TypeScript**: Type safety across the stack
- **Drizzle Kit**: Database migration and schema management
- **ESBuild**: Production bundling for server code

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite development server with HMR
- **Type Checking**: Real-time TypeScript validation
- **Database Migrations**: Automatic schema synchronization

### Production Build
- **Client Build**: Vite production optimization with code splitting
- **Server Build**: ESBuild bundling for Node.js deployment
- **Static Assets**: Optimized and compressed client assets

### Environment Configuration
- **Database URL**: PostgreSQL connection string
- **Session Secret**: Secure session encryption key
- **Replit Integration**: Development environment detection

## Changelog

```
Changelog:
- June 29, 2025. Initial setup
- June 29, 2025. Complete AWS deployment configuration added - serverless framework, Lambda handlers, Amplify config, and deployment scripts
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
Budget constraints: Using AWS free tier only, no paid services.
Deployment preference: AWS Lambda + Amplify for scalable, cost-effective hosting.
```