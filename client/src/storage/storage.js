
import supabase from './supabase.js';

async function uploadAudio(audioFile, cb) {
  if (!audioFile) {
    alert("Please select an audio file.");
    return;
  }

  const fileName = "audio/" + Date.now().toString() + audioFile.name;
  if (!supabase || !supabase.storage) {
    console.error("Supabase storage is not initialized.");
    return;
  }
  const { data, error } = await supabase.storage
    .from('hackathon-november') 
    .upload(fileName, audioFile);

  if (error) {
    console.error("Upload error:", error.message);
    return;
  }


  const { data: publicUrlData, error: urlError } = supabase.storage
    .from('hackathon-november')
    .getPublicUrl(fileName);

  if (urlError) {
    console.error("Error retrieving public URL:", urlError.message);
  } else if (publicUrlData) {
    cb(publicUrlData.publicUrl);
  } else {
    console.error("Failed to retrieve the public URL.");
  }
}

export default uploadAudio;
