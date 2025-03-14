import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ioukidwpwrmgwoppnwnv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvdWtpZHdwd3JtZ3dvcHBud252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NDc0MzUsImV4cCI6MjA1NzQyMzQzNX0.QI4kL_y3WTj1gGO6kcKGhAO-wEGLnVfyhn2EC0mayKU';

export const supabase = createClient(supabaseUrl, supabaseKey);

