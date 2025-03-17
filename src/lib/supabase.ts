// src/lib/supabase.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Client pour les composants côté client
export const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
});