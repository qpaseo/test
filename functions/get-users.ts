// functions/get-users.js
import supabase from "../lib/supabaseClient";

exports.handler = async () => {
  const { data, error } = await supabase.from("users").select("*");

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
