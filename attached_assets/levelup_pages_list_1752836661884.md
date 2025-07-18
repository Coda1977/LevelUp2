# Level Up App - Complete Page List

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
- "Try This Week" suggestion (after completion)
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
- Collection of productivity artifacts powered by Claude
- **Your Life in Weeks**: Visual life planning tool
- **Email Writing Assistant**: Professional email composer
- **Origin Stories**: Personal/company story creator
- **Meeting Summary**: AI-powered meeting notes
- **5 Whys**: Root cause analysis tool
- **Team Activity Ideas**: Creative team building suggestions
- **Idea Spark**: Brainstorming and ideation assistant
- Clean grid layout with tool previews
- Each tool opens in full-screen mode

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

### 10. Content Management (`/admin/content`)
- List all chapters with edit options
- Add new chapter form
- Category management (add/edit/reorder categories)
- Bulk operations

### 11. Chapter Editor (`/admin/chapter/:chapterSlug/edit`)
- Rich text editor for article content
- Media embedding interface (Spotify/YouTube)
- Preview mode (mobile/desktop)
- SEO and metadata settings
- Save/publish controls

### 12. Category Management (`/admin/categories`)
- Add new topic/category
- Edit existing category names and descriptions  
- Reorder categories
- Assign chapters to categories
- Preview how categories appear to users

### 13. Analytics Dashboard (`/admin/analytics`)
- User completion rates per chapter
- Chat engagement metrics
- Share link usage statistics
- Mobile vs desktop usage
- User retention data

### 14. User Management (`/admin/users`)
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

### Progressive Web App Manifest
- Offline capability for completed chapters
- Installable app experience
- Push notification support (future feature)

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