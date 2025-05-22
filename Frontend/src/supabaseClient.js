// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bpxpulbsxuyjbfbtcnyd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJweHB1bGJzeHV5amJmYnRjbnlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NDU0MTQsImV4cCI6MjA2MzQyMTQxNH0.cl60ugopz75vLalU4Z9GHJcw357wK_YryUk-2iVmT38'


export const supabase = createClient(supabaseUrl, supabaseAnonKey)
