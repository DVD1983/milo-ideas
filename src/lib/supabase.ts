import { createClient } from '@supabase/supabase-js'
import type { Database } from '../data/database'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
