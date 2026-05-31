const { PrismaClient } = require('@prisma/client');
const { PrismaNeon }   = require('@prisma/adapter-neon');
const { neonConfig, Pool } = require('@neondatabase/serverless');
const ws = require('ws');

// Neon WebSocket konfiguratsiyasi (Node.js uchun zarur)
neonConfig.webSocketConstructor = ws;

const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaNeon(pool);

const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

module.exports = prisma;
