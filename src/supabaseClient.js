import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://stcaolztlrvkjuqejzds.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Y2FvbHp0bHJ2a2p1cWVqemRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwNDA5NjAsImV4cCI6MjA5OTYxNjk2MH0.o9N7mdViD9VDiwWNK_cwYDuQvFr_7O4FkaM33wj9DEQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
