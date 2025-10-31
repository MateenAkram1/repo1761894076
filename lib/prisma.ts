import { createClient } from '@supabase/supabase-js';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var supabase: any;
}

const getSupabaseClient = () => {
  const databaseProvider = process.env.DATABASE_PROVIDER || 'postgres';

  if (databaseProvider === 'supabase') {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY must be set when using Supabase');
    }

    // Create Supabase client for database operations
    const supabase = createClient(supabaseUrl, supabaseKey);

    return supabase;
  } else {
    // For postgres or other providers, return null - Prisma will be used directly
    return null;
  }
};

export const supabase =
  global.supabase ||
  getSupabaseClient();

if (process.env.NODE_ENV !== 'production' && supabase) {
  global.supabase = supabase;
}

// Import actual Prisma Client
import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
