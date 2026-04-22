import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@csad.cz',
    password: 'AdminPassword123!',
  });
  
  if (error) {
    console.error('Error creating admin:', error.message);
  } else {
    console.log('Admin created successfully:', data.user?.email);
    console.log('NOTE: If email confirmation is enabled in Supabase, the user will need to confirm their email before logging in. You can disable email confirmation in Supabase -> Authentication -> Providers -> Email.');
  }
}

createAdmin();
