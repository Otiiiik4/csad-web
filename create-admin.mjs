import { createClient } from '@supabase/supabase-js';

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
    console.log('NOTE: ak email confirmation enabled, musite potvrdit.');
  }
}

createAdmin();
