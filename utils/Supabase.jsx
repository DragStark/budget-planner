
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ivoqqxsmswfdokxfuqee.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2b3FxeHNtc3dmZG9reGZ1cWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc2NzUwOTEsImV4cCI6MjAzMzI1MTA5MX0.bF6N4aBQVykC7N1ai5z6cNyU00LDvTPALeMUuqkK7t4'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;