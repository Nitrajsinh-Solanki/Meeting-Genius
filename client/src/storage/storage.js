// Meeting-Genius\client\src\storage\storage.js


import axios from 'axios';

async function uploadAudio(audioFile, cb) {
  if (!audioFile) {
    alert("Please select an audio file.");
    return;
  }

  // Log file information for debugging
  console.log("File to upload:", {
    name: audioFile.name,
    type: audioFile.type,
    size: `${(audioFile.size / 1024 / 1024).toFixed(2)} MB`
  });

  try {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', audioFile);
    
    // For unsigned uploads (using upload preset)
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    console.log("Using upload preset:", uploadPreset);
    
    if (!uploadPreset) {
      alert("Upload preset is missing. Please check your environment variables.");
      return;
    }
    
    formData.append('upload_preset', uploadPreset);
    
    // Add resource type for audio files
    formData.append('resource_type', 'auto');
    
    // Log the cloud name being used
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    console.log("Using cloud name:", cloudName);
    
    if (!cloudName) {
      alert("Cloud name is missing. Please check your environment variables.");
      return;
    }

    // Log the full URL being used
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    console.log("Uploading to URL:", uploadUrl);

    // Upload to Cloudinary directly from the browser
    const response = await axios.post(
      uploadUrl,
      formData
    );

    console.log("Cloudinary response:", response.data);

    if (response.data && response.data.secure_url) {
      cb(response.data.secure_url);
    } else {
      console.error("Failed to retrieve the public URL from response:", response.data);
      alert("Failed to get the uploaded file URL.");
    }
  } catch (error) {
    console.error("Upload error:", error);
    
    // More detailed error logging
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
      
      alert(`Upload failed: ${error.response.data.error?.message || JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error("No response received:", error.request);
      alert("Upload failed: No response received from server");
    } else {
      console.error("Error message:", error.message);
      alert(`Upload failed: ${error.message}`);
    }
  }
}

export default uploadAudio;
