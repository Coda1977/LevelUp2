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
- **Post-Chapter Actions**: Pre-written actionable suggestions provided with each chapter
- **Admin-Managed Content**: Editors can set specific practice actions for each chapter via admin dashboard
- **Practical Application**: Concrete tasks to implement learnings immediately
- **Example**: After "Delegation" → "This week, identify one task you do regularly that you could delegate. Use the RACI framework from the chapter."

### 6. Editor Dashboard (Admin Only)
- **Simple CMS**: Add/edit articles with rich text formatting
- **Media Embedding**: Easy paste of Spotify/YouTube links
- **Category Management**: Organize content within the existing structure
- **Preview Mode**: See how content looks on mobile before publishing
- **Share Analytics**: View metrics on shared links

### 7. Simple Tools (Productivity Suite)
- **AI-Powered Tools**: Collection of practical productivity tools using Claude API
- **Intelligent Generation**: Claude creates contextual, professional outputs based on user input
- **Integrated Experience**: Accessible from main navigation and dashboard
- **Tools Include**:
  - **Your Life in Weeks**: Visual life planning tool with AI-generated reflection prompts
  - **Email Writing Assistant**: Professional email composition with Claude's writing assistance
  - **Origin Stories**: Personal and company narrative creation with AI guidance
  - **Meeting Summary**: AI-powered meeting notes and action item extraction from raw notes
  - **5 Whys Analysis**: AI-guided root cause analysis with intelligent questioning
  - **Team Activity Ideas**: Claude-generated team building and engagement suggestions
  - **Idea Spark**: AI-powered brainstorming and ideation assistant for innovation
- **Seamless Integration**: Tools complement management learning content
- **Mobile Optimized**: All tools work effectively on mobile devices
- **Smart Context**: Claude understands management context from Level Up content

### 8. User Management
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
- **Chat Service**: Claude API for the mentor chat
- **Simple Tools**: Claude API for intelligent content generation
- **Content Indexing**: Vector embeddings for content-aware responses in chat

### Mobile Optimization
- **Responsive Design**: Optimized for phones and tablets
- **Touch-Friendly Interface**: All interactions designed for mobile input

## User Experience Flow

1. **First Visit**: 
   - Welcome screen explaining Level Up's purpose
   - Quick sign-up via Replit Auth
   - Overview of three categories

2. **Learning Journey**:
   - Choose any category/chapter to start
   - Read 5-minute article
   - Watch/listen to embedded media
   - Get pre-written "Try This Week" suggestion
   - Option to share chapter with team

3. **AI Mentor Interaction**:
   - Accessible from any screen via floating button
   - Remembers conversation history
   - Can ask about specific chapters or general management questions
   - Provides scenario-based practice

4. **Simple Tools Usage**:
   - Access AI-powered productivity tools from dashboard or main navigation
   - Use Claude's intelligence for real workplace challenges
   - Get contextual, professional outputs tailored to management scenarios
   - Export or save AI-generated content for future reference

5. **Progress Tracking**:
   - Dashboard shows completion percentage
   - Visual progress through each category
   - No pressure to complete in order

## Success Metrics
- User completion rates per chapter
- Chat engagement frequency
- Share link usage and conversion
- Simple tools usage and Claude API efficiency
- Mobile vs. desktop usage
- User retention (weekly active users)
- AI-generated content quality ratings

---

# Complete Page Structure

## Public Pages (No Authentication Required)

### 1. Landing/Welcome Page (`/`)
- App introduction and value proposition
- Sign up/Sign in buttons
- Brief overview of the three main categories
- Mobile-optimized hero section

### 2. Shared Chapter Pages (`/shared/:chapterSlug-:shareId`)
- Display shared chapter content
- Embedded videos/podcasts
- "Shared by [Manager Name]" banner
- Call-to-action to sign up
- No chat access or navigation to other chapters
- View tracking for analytics

## Authentication Pages

### 3. Sign In Page (`/signin`)
- Replit Auth integration
- Redirect to dashboard after successful login

### 4. Sign Up Page (`/signup`)
- Replit Auth integration
- Brief onboarding flow
- Redirect to dashboard after completion

## Main App Pages (Authentication Required)

### 5. Dashboard/Home Page (`/dashboard`)
- Overall progress bar (% completion across all chapters)
- Three main categories with progress indicators
- Quick access to recently viewed chapters
- AI Mentor chat button (floating)
- Navigation to all sections

### 6. Category Overview Pages
- **Foundations** (`/foundations`)
- **Growing the Team** (`/growing-team`)
- **Meeting People** (`/meeting-people`)

Each category page includes:
- List of chapters with completion status
- Category-specific progress bar
- Brief description of what's covered
- Direct links to individual chapters

### 7. Individual Chapter Pages (`/chapter/:chapterSlug`)
- 5-minute article content
- Embedded Spotify podcast player
- Embedded YouTube video player
- Chapter completion marking
- Pre-written "Try This Week" suggestion (after completion)
- Share button (bottom of page)
- Navigation to previous/next chapters
- Progress indicator

**Chapter URLs:**
- `/chapter/your-number-1-role`
- `/chapter/author-vs-editor`
- `/chapter/accountability`
- `/chapter/performance-standards`
- `/chapter/growth-mindset`
- `/chapter/total-motivation`
- `/chapter/coaching`
- `/chapter/feedback`
- `/chapter/delegation`
- `/chapter/influence`
- `/chapter/situation-vs-action-talk`
- `/chapter/one-on-ones`
- `/chapter/having-great-meetings`

### 8. Simple Tools Page (`/tools`)
- Collection of AI-powered productivity tools using Claude
- **Your Life in Weeks**: Visual life planning with AI reflection prompts
- **Email Writing Assistant**: Professional email composition with Claude
- **Origin Stories**: Personal/company story creation with AI guidance
- **Meeting Summary**: AI-powered meeting notes from raw input
- **5 Whys**: AI-guided root cause analysis tool
- **Team Activity Ideas**: Claude-generated team building suggestions
- **Idea Spark**: AI-powered brainstorming and ideation assistant
- Clean grid layout with tool previews
- Each tool opens in full-screen mode with Claude integration

### 9. AI Mentor Chat Page (`/chat`)
- Full-screen chat interface
- Conversation history
- Context-aware responses about Level Up content
- Scenario practice mode
- Quick links to related chapters
- Mobile-optimized chat UI

## Admin Pages (Editor Dashboard - Role-Based Access)

### 10. Admin Dashboard (`/admin`)
- Content management overview
- Quick stats on user engagement
- Recent activity feed
- Navigation to all admin functions

### 11. Content Management (`/admin/content`)
- List all chapters with edit options
- Add new chapter form
- Category management (add/edit/reorder categories)
- Bulk operations

### 12. Category Management (`/admin/categories`)
- Add new topic/category
- Edit existing category names and descriptions  
- Reorder categories
- Assign chapters to categories
- Preview how categories appear to users

### 13. Chapter Editor (`/admin/chapter/:chapterSlug/edit`)
- Rich text editor for article content
- Media embedding interface (Spotify/YouTube)
- "Try This Week" suggestion field (editable text)
- Preview mode (mobile/desktop)
- SEO and metadata settings
- Save/publish controls

### 14. Analytics Dashboard (`/admin/analytics`)
- User completion rates per chapter
- Chat engagement metrics
- Share link usage statistics
- Mobile vs desktop usage
- User retention data

### 15. User Management (`/admin/users`)
- User list with progress overview
- Account management tools
- Export user data
- Usage patterns analysis

## Utility Pages

### 16. 404 Error Page (`/404`)
- Friendly error message
- Navigation back to main areas
- Search functionality

### 17. Privacy Policy (`/privacy`)
- Data handling practices
- Cookie policy
- User rights information

## Mobile-Specific Considerations

### Responsive Design Focus
- Touch-friendly interfaces for all tools
- Optimized layouts for small screens
- Fast loading and minimal data usage

## API Endpoints (Supporting the Frontend)

### Authentication
- `POST /api/auth/signin`
- `POST /api/auth/signup`
- `POST /api/auth/signout`

### Content
- `GET /api/chapters`
- `GET /api/chapters/:slug`
- `GET /api/shared/:shareId`
- `POST /api/chapters/:slug/share`

### Progress
- `GET /api/user/progress`
- `POST /api/user/progress/:chapterSlug`

### Chat
- `POST /api/chat`
- `GET /api/chat/history`

### Simple Tools
- `POST /api/tools/email` (generate email with Claude)
- `POST /api/tools/5whys` (AI-guided analysis)
- `POST /api/tools/meeting-summary` (process meeting notes)
- `POST /api/tools/origin-story` (generate narrative)
- `POST /api/tools/team-activities` (get suggestions)
- `POST /api/tools/idea-spark` (brainstorming assistance)
- `POST /api/tools/life-weeks` (generate reflection prompts)

### Admin
- `GET /api/admin/analytics`
- `POST /api/admin/chapters`
- `PUT /api/admin/chapters/:slug`
- `DELETE /api/admin/chapters/:slug`

## Navigation Structure

### Main Navigation (Authenticated Users)
1. Dashboard
2. Foundations
3. Growing the Team
4. Meeting People
5. Simple Tools
6. AI Mentor

### Admin Navigation
1. Dashboard
2. Content Management
3. Category Management
4. Analytics
5. User Management
6. Settings

This structure provides a complete, mobile-first experience that supports all the features outlined in the specification while maintaining clear separation between user and admin functionality.

---

# Design Implementation Guide

## Core Design Rules
1. **Less is more** - Every word must earn its place
2. **White space is not empty space** - Use it generously
3. **One primary action per screen** - Don't overwhelm users

## Colors (CSS Variables)
```css
:root {
  --bg-primary: #F5F0E8;
  --text-primary: #1A1A1A;
  --accent-yellow: #FFD60A;
  --accent-blue: #003566;
  --text-secondary: #4A4A4A;
  --white: #FFFFFF;
}
```

## Typography Rules
```css
/* Hero Headlines */
font-size: clamp(48px, 8vw, 80px);
font-weight: 900;
letter-spacing: -2px;
line-height: 1.1;

/* Section Headers */
font-size: clamp(32px, 5vw, 48px);
font-weight: 700;
letter-spacing: -1px;

/* Body Text */
font-size: 18px;
font-weight: 400;
line-height: 1.7;
color: var(--text-secondary);

/* Small Text */
font-size: 16px;
line-height: 1.6;
```

## Content Length Limits
- **Headlines**: 3-6 words maximum
- **Subheadlines**: 10-15 words maximum  
- **Body paragraphs**: 2-3 sentences maximum
- **Button text**: 2-4 words
- **Feature descriptions**: 15-25 words

## Component Templates

### Primary Button
```jsx
<button className="bg-gray-900 text-[#F5F0E8] px-10 py-4 rounded-full font-semibold text-lg hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
  Get Started
</button>
```

### Feature Card
```jsx
<div className="bg-white p-12 rounded-2xl hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
  <div className="text-6xl font-black text-[#FFD60A] mb-4">01</div>
  <h3 className="text-2xl font-bold mb-4">[4-6 word headline]</h3>
  <p className="text-gray-600">[15-25 word description]</p>
</div>
```

### Section Container
```jsx
<section className="py-20 md:py-32 px-5 md:px-10">
  <div className="max-w-6xl mx-auto">
    <!-- Content -->
  </div>
</section>
```

## Layout Rules

### Spacing Scale
- **XS**: 8px (0.5rem)
- **S**: 16px (1rem)
- **M**: 32px (2rem)
- **L**: 64px (4rem)
- **XL**: 128px (8rem)

### Grid Structure
- **Desktop**: 12-column grid, 80px gap
- **Tablet**: 8-column grid, 40px gap
- **Mobile**: 4-column grid, 20px gap

### Breakpoints
```css
/* Mobile First */
/* Default: 0-767px */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
```

## Animation Rules
```css
/* Standard Transition */
transition: all 0.3s ease;

/* Hover Lift */
hover:-translate-y-2

/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
animation: fadeIn 0.6s ease-out;
```

## Don'ts
- ❌ No drop shadows except on hover
- ❌ No gradients except subtle overlays
- ❌ No more than 2 font weights per component
- ❌ No centered body text (only headlines)
- ❌ No more than 3 colors per component
- ❌ No animations longer than 0.5s
- ❌ No more than one CTA per section

## Mobile Modifications
```css
/* Reduce all spacing by 50% on mobile */
/* Stack all elements vertically */
/* Increase touch targets to 44px minimum */
/* Hide secondary navigation items */
/* Reduce font sizes by 20% */
```

## Copy Voice
- **Active voice**: "Transform your team" not "Your team will be transformed"
- **Direct address**: Use "you" and "your"
- **Present tense**: "Get insights" not "You will get insights"
- **No jargon**: Simple words over complex ones

## Image Guidelines
- Prefer geometric shapes and patterns over photos
- Use SVG for icons and illustrations
- Lazy load all images below the fold
- Max image size: 200KB

## Quick Reference
Every component should:
1. Have generous padding (min 32px)
2. Use only colors from the palette
3. Include hover state
4. Be keyboard accessible
5. Work on mobile without horizontal scroll