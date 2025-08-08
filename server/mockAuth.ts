import type { Express, RequestHandler } from "express";
import session from "express-session";

// Mock user for development/testing
const mockUser = {
  claims: {
    sub: 'test-user-123',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    profile_image_url: null,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // expires in 24 hours
  },
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
};

export function getSession() {
  return session({
    secret: process.env.SESSION_SECRET || 'mock-session-secret-for-testing',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Allow non-HTTPS for local development
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
  });
}

export async function setupAuth(app: Express) {
  console.log('🔧 Setting up mock authentication for development...');
  
  app.use(getSession());
  
  // Mock passport-like session handling
  app.use((req: any, res, next) => {
    // Automatically authenticate all requests with mock user
    req.user = mockUser;
    req.isAuthenticated = () => true;
    req.logout = (callback: () => void) => {
      req.user = null;
      callback();
    };
    next();
  });

  // Mock auth routes
  app.get("/api/login", (req, res) => {
    console.log('Mock login request');
    res.redirect("/");
  });

  app.get("/api/callback", (req, res) => {
    console.log('Mock callback request');
    res.redirect("/");
  });

  app.get("/api/logout", (req, res) => {
    console.log('Mock logout request');
    res.redirect("/");
  });
  
  console.log('✅ Mock authentication setup complete');
}

export const isAuthenticated: RequestHandler = (req: any, res, next) => {
  // Always allow access in mock mode
  if (!req.user) {
    req.user = mockUser;
  }
  next();
};