// functions/login.ts
import { Handler } from "@netlify/functions";
import supabase from "../lib/supabaseClient";

export const handler: Handler = async (event) => {
  const { email, password } = JSON.parse(event.body || "{}");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: error.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      access_token: data.session?.access_token,
      user: data.user,
    }),
  };
};
