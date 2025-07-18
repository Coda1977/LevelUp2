# Level Up - Management Development App Specification

## Vision Statement
**Level Up** is a mobile-first management development app that transforms leadership learning into bite-sized, actionable insights. It combines curated content with an AI mentor that helps managers apply what they learn to real workplace situations.

## Content Structure

### Three Main Categories:

1. **Foundations**
   - Your Number 1 Role
   - Author vs. Editor
   - Accountability
   - Performance Standards
   - Growth Mindset

2. **Growing the Team**
   - Total Motivation
   - Coaching
   - Feedback
   - Delegation

3. **Meeting People**
   - Influence
   - Situation vs. Action Talk
   - 1:1s
   - Having Great Meetings

Each chapter consists of:
- 5-minute read article/lesson
- Embedded Spotify podcast and/or YouTube video at the end

## Core Features

### 1. Content Library
- **Structure**: 3 categories → 14 chapters → 5-minute articles
- **Mixed Media**: Written lessons with embedded Spotify podcasts and YouTube videos at the end
- **Mobile Optimized**: Clean, readable interface that works seamlessly on phones
- **Free Access**: All content available at no cost

### 2. Progress Tracking
- **Simple Progress Bar**: Shows overall % completion across all chapters
- **Chapter Checkmarks**: Visual indicators for completed chapters
- **Flexible Navigation**: Users can jump between any topics in any order
- **Persistent Progress**: Saved to user account via Replit Auth

### 3. AI Mentor Chat
- **Knowledgeable Assistant**: Trained on all Level Up content plus general management best practices
- **Practical Application**: Helps users apply concepts to their specific situations
- **Professional but Approachable**: Mentor personality that's supportive and actionable
- **Context-Aware**: Can reference specific chapters and make connections between concepts
- **Scenario Practice**: Interactive scenarios where users can practice concepts with AI feedback

### 4. Chapter Sharing (Time-Limited Links)
- **Share Button**: Available at the bottom of each completed chapter
- **Unique Links**: Generates links like `levelup.replit.app/shared/delegation-xyz123`
- **10-Day Expiration**: Links automatically expire after 10 days
- **No Login Required**: Recipients can read shared chapters without creating an account
- **Limited Access**: Shared views include:
  - The chapter content
  - Embedded videos/podcasts
  - Banner showing "Shared by [Manager Name]"
  - Call-to-action: "Want to access all content and AI mentor? Sign up free"
- **Share Tracking**: Managers can see view count for their shared links
- **Privacy**: No chat access or progress tracking for anonymous viewers

### 5. Try This Week Suggestions
- **Post-Chapter Actions**: After completing a chapter, AI mentor suggests one specific practice action
- **Practical Application**: Concrete tasks to implement learnings immediately
- **Example**: After "Delegation" → "This week, identify one task you do regularly that you could delegate. Use the RACI framework from the chapter."

### 6. Editor Dashboard (Admin Only)
- **Simple CMS**: Add/edit articles with rich text formatting
- **Media Embedding**: Easy paste of Spotify/YouTube links
- **Category Management**: Organize content within the existing structure
- **Preview Mode**: See how content looks on mobile before publishing
- **Share Analytics**: View metrics on shared links

### 7. User Management
- **Replit Auth Integration**: Simple sign-in process
- **User Profiles**: Track individual progress
- **Persistent Chat History**: Users can return to previous conversations

## Technical Architecture (Replit-Optimized)

### Frontend
- **Framework**: React with responsive design
- **Styling**: Tailwind CSS for mobile-first design
- **State Management**: React Context for user progress and auth

### Backend
- **Server**: Node.js with Express
- **Database**: PostgreSQL for content, user data, and share links
- **Authentication**: Replit Auth integration

### AI Integration
- **Chat Service**: OpenAI API for the mentor chat
- **Content Indexing**: Vector embeddings for content-aware responses

### Mobile Optimization
- **Progressive Web App**: Installable on mobile devices
- **Offline Reading**: Cache completed chapters for offline access
- **Responsive Design**: Optimized for phones and tablets

## User Experience Flow

1. **First Visit**: 
   - Welcome screen explaining Level Up's purpose
   - Quick sign-up via Replit Auth
   - Overview of three categories

2. **Learning Journey**:
   - Choose any category/chapter to start
   - Read 5-minute article
   - Watch/listen to embedded media
   - Get "Try This Week" suggestion
   - Option to share chapter with team

3. **AI Mentor Interaction**:
   - Accessible from any screen via floating button
   - Remembers conversation history
   - Can ask about specific chapters or general management questions
   - Provides scenario-based practice

4. **Progress Tracking**:
   - Dashboard shows completion percentage
   - Visual progress through each category
   - No pressure to complete in order

## Success Metrics
- User completion rates per chapter
- Chat engagement frequency
- Share link usage and conversion
- Mobile vs. desktop usage
- User retention (weekly active users)