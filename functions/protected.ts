// functions/protected.ts
import { Handler } from "@netlify/functions";
import supabase from "../lib/supabaseClient";

export const handler: Handler = async (event) => {
  const authHeader = event.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Hello ${user.email}` }),
  };
};
