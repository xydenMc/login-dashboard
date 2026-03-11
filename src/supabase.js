import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mesypcwzvyauoamsifnv.supabase.co'
const supabaseKey = 'sb_publishable_UaOygzM3zfeXwqYrTuki_w_b89xik8H' 

export const supabase = createClient(supabaseUrl, supabaseKey)