// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hmncstlbxbpzoyeuahtm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtbmNzdGxieGJwem95ZXVhaHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNjQzNzIsImV4cCI6MjA4Njg0MDM3Mn0.eTyUusNsAGG91PriUCxkH0nMiEXJokmssfZSI1I6qnY'


export const supabase = createClient(supabaseUrl, supabaseAnonKey)
