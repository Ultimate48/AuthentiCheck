import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://yhrkhyfaiiypguxgnpcd.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlocmtoeWZhaWl5cGd1eGducGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1OTMwNzEsImV4cCI6MjA4NzE2OTA3MX0.wAZoUO5sAnJdfAvcCKwM3tsUqFNQrtZL8hjW3g2SDVI"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
