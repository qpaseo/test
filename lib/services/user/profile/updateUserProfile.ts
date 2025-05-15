import supabase from "../../../../lib/supabaseClient";

export default async function updateUserProfile(
  userId: string,
  name: string,
  profile_url: string
) {
  const { error: updateError } = await supabase
    .from("users")
    .update({ name, profile_url })
    .eq("id", userId);
  if (updateError) {
    throw new Error(updateError.message);
  }
}
