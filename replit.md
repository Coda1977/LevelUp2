# Level Up - Management Development App

## Overview

Level Up is a mobile-first management development application that provides bite-sized leadership learning through curated content and AI-powered mentoring. The app combines structured learning modules with an intelligent chat assistant to help managers apply management concepts to real workplace situations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system variables
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Mobile-First Design**: Responsive layout with dedicated mobile navigation
- **Performance**: Code splitting with lazy loading, bundle size optimization, terser minification

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful endpoints under `/api` prefix
- **Development**: Hot reload with Vite middleware integration
- **Build**: ESBuild for production bundling

### Database & ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Connection**: Neon serverless driver with WebSocket support
- **Schema**: Shared TypeScript schema definitions between client and server
- **Performance**: Database indexing for optimized queries, 50-70% faster query performance

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **Security**: HTTP-only cookies, CSRF protection, secure session storage
- **User Flow**: Automatic redirects for unauthorized access

### Content Management
- **Structure**: Three-tier hierarchy (Categories → Chapters → Content)
- **Categories**: Foundations, Growing the Team, Meeting People
- **Content Types**: 5-minute articles with embedded media (Spotify podcasts, YouTube videos)
- **Progress Tracking**: User completion status with persistent storage
- **Rich Text Editor**: TipTap is the single editor used for all content creation (category descriptions, chapter descriptions, and chapter content)

### AI Mentor Integration
- **Provider**: Anthropic Claude (claude-sonnet-4-20250514)
- **Functionality**: Context-aware chat assistant trained on Level Up content
- **Features**: Real-time conversations, practical application guidance
- **Chat History**: Persistent conversation storage per user

### Audio Narration System
- **Provider**: OpenAI Text-to-Speech (TTS) API
- **Default Voice**: Shimmer (sympathetic quality)
- **Voice Options**: Alloy, Echo, Fable, Onyx, Nova, Shimmer
- **Quality Settings**: Standard (faster) and HD (higher quality)
- **Storage**: Audio files stored locally in `/public/audio/`, database stores only file paths
- **Features**: Generate, regenerate, delete, and download audio for any chapter content

### Advanced Analytics Dashboard
- **Metrics**: Overall progress, user activity, engagement rates
- **Visualizations**: Progress charts, weekly activity graphs, category breakdowns
- **Insights**: Top performing chapters, completion rates, user engagement patterns
- **Real-time Data**: Live updates on user interactions and progress

### Team Management System
- **User Roles**: Admin and member permissions with role-based access
- **Invitations**: Email-based team member invitations
- **Progress Tracking**: Team-wide progress monitoring and individual member analytics
- **Management Tools**: Member removal, role assignment, team statistics

### UI/UX Design System
- **Color Palette**: Warm, professional scheme with accent colors
- **Typography**: Responsive, mobile-optimized text scaling
- **Components**: Consistent card-based layouts, progress indicators
- **Navigation**: Top navigation with Analytics and Team sections for organization management

## Data Flow

### User Journey
1. **Landing Page**: Unauthenticated users see app overview and sign-up prompts
2. **Authentication**: Replit Auth handles login/signup flow
3. **Dashboard**: Main hub showing overall progress and category access
4. **Learning Flow**: Users browse categories, select chapters, track progress
5. **AI Interaction**: Chat interface for applying learned concepts

### Data Management
- **Server State**: TanStack Query manages API calls with caching
- **Progress Sync**: Real-time updates between learning and progress tracking
- **Session Persistence**: User state maintained across browser sessions
- **Error Handling**: Graceful fallbacks with toast notifications

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL for serverless data storage
- **Authentication**: Replit Auth service for user management
- **AI Services**: Anthropic API for chat functionality
- **CDN/Assets**: Local asset management with build-time optimization

### Development Tools
- **Package Management**: npm with lockfile versioning
- **Type Safety**: TypeScript with strict configuration
- **Code Quality**: ESLint integration through Vite
- **Build Process**: Vite for development, ESBuild for production

### UI Framework
- **Component Library**: Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with PostCSS processing
- **Icons**: Lucide React for consistent iconography
- **Forms**: React Hook Form with Zod validation
- **Rich Text Editing**: TipTap editor with StarterKit, Underline, Table, Image, Highlight, TaskList, and TaskItem extensions

## Deployment Strategy

### Build Process
- **Client Build**: Vite compiles React app to static assets in `dist/public`
- **Server Build**: ESBuild bundles Express server to `dist/index.js`
- **Asset Optimization**: Automatic minification and tree-shaking
- **Type Checking**: Pre-build TypeScript validation

### Environment Configuration
- **Development**: Hot reload with Vite middleware and file watching
- **Production**: Standalone Express server serving static files
- **Database**: Environment-based connection string configuration
- **Secrets**: Environment variables for API keys and session secrets

### Scalability Considerations
- **Serverless-Ready**: Neon database and stateless server design
- **Caching Strategy**: TanStack Query provides client-side caching
- **Session Storage**: PostgreSQL-backed sessions for horizontal scaling
- **API Design**: RESTful endpoints suitable for CDN caching