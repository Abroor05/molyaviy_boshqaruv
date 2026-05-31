require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function createTables() {
  const client = await pool.connect();
  try {
    console.log('🔄 Jadvallar yaratilmoqda...');

    // Enum types
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "fullName" TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role "Role" NOT NULL DEFAULT 'USER',
        status "Status" NOT NULL DEFAULT 'ACTIVE',
        avatar TEXT,
        "refreshToken" TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ users jadvali yaratildi');

    // Incomes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS incomes (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        title TEXT NOT NULL,
        amount FLOAT NOT NULL,
        category TEXT NOT NULL,
        date TIMESTAMP NOT NULL,
        description TEXT,
        "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ incomes jadvali yaratildi');

    // Expenses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        title TEXT NOT NULL,
        amount FLOAT NOT NULL,
        category TEXT NOT NULL,
        date TIMESTAMP NOT NULL,
        description TEXT,
        "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ expenses jadvali yaratildi');

    // Prisma migrations table (Prisma uchun kerak)
    await client.query(`
      CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
        id VARCHAR(36) PRIMARY KEY,
        checksum VARCHAR(64) NOT NULL,
        finished_at TIMESTAMPTZ,
        migration_name VARCHAR(255) NOT NULL,
        logs TEXT,
        rolled_back_at TIMESTAMPTZ,
        started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        applied_steps_count INTEGER NOT NULL DEFAULT 0
      );
    `);

    console.log('\n🎉 Barcha jadvallar muvaffaqiyatli yaratildi!');
  } catch (err) {
    console.error('❌ Xato:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

createTables().catch(() => process.exit(1));
