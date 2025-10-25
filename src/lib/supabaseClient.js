import { createClient } from '@supabase/supabase-js';

// USA QUESTI VALORI DIRETTAMENTE:
const supabaseUrl = 'https://kegosmuokofyqrzwgjrl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlZ29zbXVva29meXFyendnanJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MjU3OTQsImV4cCI6MjA3NjIwMTc5NH0.5DFSqm3MhGhlQTiEPrU6d62gaRjDq-89coOhBz_gQls';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
