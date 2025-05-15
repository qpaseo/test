import supabase from "../../../supabaseClient";

export default async function uploadProfileImage(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filename, buffer, {
      contentType: "image/jpeg", // or dynamic from mimetype
      upsert: true,
    });
  if (uploadError) {
    throw new Error(uploadError.message);
  }
  const { data: publicUrl } = supabase.storage
    .from("avatars")
    .getPublicUrl(filename);
  return publicUrl.publicUrl;
}
