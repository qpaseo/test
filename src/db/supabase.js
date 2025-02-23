import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://evluhcpkdquwikvolnbs.supabase.co"; // 자신의 Supabase URL 입력
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2bHVoY3BrZHF1d2lrdm9sbmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMTIxNzUsImV4cCI6MjA1NTg4ODE3NX0.oRBAyrXKwbvGzZCFxreKWyCc2Eb4TGrNpp9AvxNEnPY"; // 자신의 익명 키 입력

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
