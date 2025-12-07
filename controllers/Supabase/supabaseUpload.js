const supabase = require("../Supabase/supabaseClient");

async function uploadToSupabaseBuffer(buffer, originalName) {
  const filePath = `courses/${Date.now()}-${originalName}`;

  const { data, error } = await supabase.storage
    .from("courses")
    .upload(filePath, buffer, {
      contentType: "application/octet-stream",
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from("courses")
    .getPublicUrl(filePath);

  return {
    url: urlData.publicUrl,
    bucket: "courses",
    path: filePath,
    fileName: originalName,
  };
}


module.exports = uploadToSupabaseBuffer;
