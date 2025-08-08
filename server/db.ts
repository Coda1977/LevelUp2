import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not set, using mock storage for development");
}

// Only create pool if DATABASE_URL is properly configured
const pool = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost') 
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

export { pool };
export const db = pool ? drizzle({ client: pool, schema }) : null;