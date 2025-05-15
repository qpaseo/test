// functions/register.ts
import { Handler } from "@netlify/functions";
import supabase from "../lib/supabaseClient";

export const handler: Handler = async (event) => {
  const { email, password } = JSON.parse(event.body || "{}");

  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError || !authData.user) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: signUpError?.message || "Signup failed" }),
    };
  }

  const { id } = authData.user;

  const { error: insertError } = await supabase.from("users").insert([
    {
      id,
      name: "",
      profile_url: "",
    },
  ]);

  if (insertError) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: insertError.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Signup successful",
      user: {
        id,
        email,
      },
    }),
  };
};
