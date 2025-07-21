# CLAUDE.md - Level Up Management Development Platform

## Project Overview

**Level Up** is a comprehensive management development platform that transforms leadership learning into bite-sized, actionable insights. The application combines curated content with an AI mentor to provide personalized coaching for managers at all levels.

### Key Features
- **Curated Learning Content**: Lessons and book summaries organized by management topics
- **AI-Powered Coaching**: Personalized AI mentor with access to all app content and user progress
- **Progress Tracking**: Comprehensive analytics and completion tracking
- **Audio Integration**: AI-generated narration with advanced playback controls
- **Admin Dashboard**: Content management with analytics and bulk operations
- **Mobile-First Design**: Responsive interface optimized for all devices

### Tech Stack
- **Frontend**: React + TypeScript + Tailwind CSS + Wouter (routing)
- **Backend**: Express.js + TypeScript + Drizzle ORM + PostgreSQL
- **Authentication**: Replit Auth
- **AI Integration**: OpenAI GPT-4 + TTS
- **State Management**: TanStack Query (React Query)
- **UI Components**: Custom components with Radix UI primitives

## Build, Dev, and Test Commands

### Development
```bash
# Start development server (frontend + backend)
npm run dev

# Frontend only (port 5173)
cd client && npm run dev

# Backend only (port 3000)
cd server && npm run dev

# Install dependencies
npm install
cd client && npm install
cd server && npm install
```

### Build
```bash
# Full production build
npm run build

# Frontend build only
cd client && npm run build

# Backend build only
cd server && npm run build
```

### Testing
```bash
# Run frontend tests
cd client && npm test

# Run backend tests (if available)
cd server && npm test

# Type checking
npm run typecheck
cd client && npm run typecheck
cd server && npm run typecheck
```

### Linting & Formatting
```bash
# Lint frontend
cd client && npm run lint

# Format code
npm run format
```

## Safe and Unsafe File Boundaries

### ✅ SAFE TO MODIFY
**Claude can freely edit these files:**

#### Frontend (`/client/src/`)
- `pages/*.tsx` - All page components
- `components/*.tsx` - All React components
- `hooks/*.ts` - Custom React hooks
- `lib/*.ts` - Utility functions and configurations
- `styles/*.css` - CSS files and Tailwind configurations

#### Backend (`/server/`)
- `routes.ts` - API route handlers
- `storage.ts` - Database operations and queries
- `openai.ts` - AI integration logic
- `audio.ts` - Audio generation functions
- `*.ts` files - TypeScript source files

#### Configuration
- `package.json` files - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `.env.example` - Environment variable templates

#### Documentation
- `README.md` - Project documentation
- `CLAUDE.md` - This file
- Documentation files in `/docs/` if they exist

### ⚠️ MODIFY WITH CAUTION
**Claude should be careful with these files:**

#### Database & Schema
- `db/schema.ts` - Database schema definitions (check impact on existing data)
- Migration files - Can break existing databases

#### Build & Config
- `vite.config.ts` - Build configuration
- `drizzle.config.ts` - Database configuration
- `.gitignore` - Version control exclusions

### 🚫 DO NOT MODIFY
**Claude should NOT edit these files:**

#### Security & Environment
- `.env` - Environment variables with secrets
- `.env.local` - Local environment configuration
- `replit.nix` - Replit system configuration

#### Generated & Dependencies
- `node_modules/` - Package dependencies
- `dist/` - Built files
- `.next/` - Next.js build cache (if applicable)
- `coverage/` - Test coverage reports

#### Version Control
- `.git/` - Git repository data
- `.gitmodules` - Git submodule configuration

## Coding Standards

### TypeScript Standards
- **Strict Mode**: Always use TypeScript strict mode
- **Type Definitions**: Define explicit types for all props, state, and API responses
- **Interface Naming**: Use PascalCase for interfaces (e.g., `UserData`, `ChapterProps`)
- **No `any` Types**: Avoid `any` - use proper typing or `unknown`

```typescript
// ✅ Good
interface ChapterCardProps {
  chapter: Chapter & { completed?: boolean };
  onChapterClick: (chapter: Chapter) => void;
}

// ❌ Bad
function ChapterCard(props: any) {
  // ...
}
```

### React Standards
- **Functional Components**: Use function components with hooks
- **Props Destructuring**: Destructure props in function signature
- **useEffect Dependencies**: Always include all dependencies in useEffect arrays
- **Custom Hooks**: Extract reusable logic into custom hooks

```typescript
// ✅ Good
export function ChapterCard({ chapter, onChapterClick }: ChapterCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Effect logic
  }, [chapter.id]); // Include all dependencies
}
```

### CSS/Styling Standards
- **Tailwind First**: Use Tailwind CSS utilities primarily
- **CSS Variables**: Use CSS custom properties for theme colors
- **Responsive Design**: Always implement mobile-first responsive design
- **Component Classes**: Use component-specific CSS classes when Tailwind isn't sufficient

```typescript
// ✅ Good - Tailwind with CSS variables
className="bg-[var(--accent-blue)] text-white rounded-lg hover:bg-[var(--accent-yellow)]"

// ✅ Good - Responsive classes
className="text-sm md:text-base lg:text-lg"
```

### Database Standards
- **Drizzle ORM**: Use Drizzle for all database operations
- **Type Safety**: Leverage Drizzle's type inference
- **Transactions**: Use transactions for multi-step operations
- **Error Handling**: Always handle database errors gracefully

### API Standards
- **RESTful Routes**: Follow REST conventions for API endpoints
- **Error Responses**: Return consistent error structures
- **Authentication**: Use `isAuthenticated` middleware for protected routes
- **Input Validation**: Validate all input data

```typescript
// ✅ Good API error handling
try {
  const result = await storage.getChapter(id);
  res.json(result);
} catch (error) {
  console.error("Error fetching chapter:", error);
  res.status(500).json({ message: "Failed to fetch chapter" });
}
```

## Deployment Guidance

### Environment Variables
Ensure these environment variables are set in production:
```bash
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
REPLIT_DB_URL=...
NODE_ENV=production
```

### Pre-Deployment Checklist
1. **Build Success**: Verify both frontend and backend build without errors
2. **Type Check**: Run TypeScript type checking (`npm run typecheck`)
3. **Lint Clean**: Ensure linting passes (`npm run lint`)
4. **Database Migrations**: Apply any pending database migrations
5. **Environment Vars**: Verify all required environment variables are set
6. **API Tests**: Test critical API endpoints manually or with tools

### Deployment Steps
1. **Build Production Assets**:
   ```bash
   npm run build
   ```

2. **Database Migration** (if schema changes):
   ```bash
   npm run db:migrate
   ```

3. **Deploy to Platform** (Replit, Vercel, etc.)

4. **Post-Deploy Verification**:
   - Test user registration/login
   - Verify content loading
   - Check AI chat functionality
   - Test admin dashboard

## Critical Rules

### 🔒 Security Rules
- **Never commit secrets**: Use environment variables for API keys and database URLs
- **Validate inputs**: Always validate user inputs on both frontend and backend
- **Sanitize HTML**: Use proper HTML sanitization for user-generated content
- **Authentication**: Protect all admin routes with authentication middleware

### 🧪 Testing Rules
- **Test Before Deploy**: Always test functionality before deploying
- **Mobile Testing**: Test responsive design on mobile devices
- **Cross-Browser**: Verify functionality in major browsers
- **Error Scenarios**: Test error handling and edge cases

### 📝 Code Quality Rules
- **No Console Logs**: Remove console.logs before committing (except error logging)
- **Clean Imports**: Remove unused imports and variables
- **Consistent Naming**: Use consistent naming conventions across the codebase
- **Comment Complex Logic**: Add comments for complex business logic

### 🎯 Performance Rules
- **Optimize Queries**: Use efficient database queries and indexing
- **Lazy Loading**: Implement lazy loading for heavy components
- **Cache Appropriately**: Use React Query caching effectively
- **Bundle Size**: Monitor and optimize bundle sizes

### 🔄 Git Rules
- **Descriptive Commits**: Write clear, descriptive commit messages
- **Small Commits**: Make small, focused commits
- **Branch Protection**: Never push directly to main/production branch
- **Review Changes**: Review code changes before committing

## AI Integration Guidelines

### OpenAI Usage
- **Context Management**: The AI uses all chapter content plus user progress for personalization
- **Error Handling**: Always have fallbacks for AI API failures
- **Rate Limiting**: Be mindful of API rate limits and usage costs
- **Content Safety**: Ensure AI responses are appropriate for professional development

### Content Management
- **Auto-Save**: Content editing includes automatic draft saving
- **Analytics**: Track content engagement and user progress
- **Bulk Operations**: Support bulk editing for content management efficiency

---

## Quick Reference

### Common Tasks
- **Add new page**: Create in `/client/src/pages/`, add to routing
- **Add API endpoint**: Add to `/server/routes.ts` with authentication
- **Database changes**: Update schema in `/db/schema.ts`, run migrations
- **New component**: Create in `/client/src/components/` with TypeScript props
- **Styling changes**: Use Tailwind classes and CSS variables

### Troubleshooting
- **Build fails**: Check TypeScript errors and missing dependencies
- **Database errors**: Verify DATABASE_URL and check migrations
- **Auth issues**: Check Replit Auth configuration
- **AI not working**: Verify OPENAI_API_KEY and check API limits

Remember: This is a professional management development platform. Always maintain high code quality, test thoroughly, and ensure the user experience is polished and reliable.