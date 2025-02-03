const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://upnpjqjhsxkfwdrltdqu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwbnBqcWpoc3hrZndkcmx0ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1NzMwMjEsImV4cCI6MjA1NDE0OTAyMX0.uVbzjslKc62BE-0DurZDTjViRI9n1LnZgX9GjwllO5A"
);

module.exports = { supabase };
