import { Handler } from "@netlify/functions";
import supabase from "../lib/supabaseClient";
import updateUserProfile from "../lib/services/user/profile/updateUserProfile";
import uploadProfileImage from "../lib/services/user/profile/uploadProfileImage";
import parseFormData from "../lib/services/user/profile/parseFormData";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const authHeader = event.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return { statusCode: 401, body: "Missing or invalid token" };
  }

  const { data: userData, error: authError } = await supabase.auth.getUser(
    token
  );
  if (authError || !userData.user) {
    return { statusCode: 401, body: "Invalid token or user not found" };
  }

  try {
    const { name, profileBuffer, profileFilename } = await parseFormData(
      event,
      userData.user.id
    );
    let profile_url = "";

    if (profileBuffer) {
      try {
        profile_url = await uploadProfileImage(profileBuffer, profileFilename);
      } catch (uploadErr: any) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: uploadErr.message }),
        };
      }
    }

    try {
      await updateUserProfile(userData.user.id, name, profile_url);
    } catch (updateErr: any) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: updateErr.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Profile updated successfully",
        profile_url,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to parse form data",
        details: err,
      }),
    };
  }
};
