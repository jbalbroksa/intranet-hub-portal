
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const SUPABASE_URL = "https://hfmambzasimghlepeays.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbWFtYnphc2ltZ2hsZXBlYXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MDczNTYsImV4cCI6MjA1OTA4MzM1Nn0.QSofxZT3cNPQeRfKP53sjFeFGKNUR0M5s3_91v6WTPY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
