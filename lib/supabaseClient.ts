// lib/supabaseClient.js
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // 또는 anon key
);

module.exports = supabase;

export default supabase;
