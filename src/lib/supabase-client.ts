// src/lib/supabase-client.ts (for client components)
import { createClient } from '@supabase/supabase-js';

export const createClientSupabaseClient = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
};
