import { createClient } from "@supabase/supabase-js";

const supabaseUrl= "https://rsejwdartsxbpvudkvmz.supabase.co";
const supabaseKey = "sb_publishable_vc_M3cop-tOZQ7fDv6CvcA_hzMt63AO";

export const supabase = createClient(supabaseUrl, supabaseKey);