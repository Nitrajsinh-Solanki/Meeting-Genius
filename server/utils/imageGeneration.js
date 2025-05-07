// Meeting-Genius\server\utils\imageGeneration.js
import { fetch } from 'undici';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import ProcessedText from '../models/processedText.js';

// Use dotenv.config() instead of configDotenv()
dotenv.config();

// Configure Cloudinary with proper environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

const uploadImageToCloudinary = async (imageBuffer, fileName) => {
  try {
    // Log Cloudinary configuration for debugging
    console.log("Cloudinary Config:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? "Set" : "Not set",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "Set" : "Not set"
    });

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'meeting-genius',
          public_id: fileName,
          resource_type: 'image'
        },
        (error, result) => {
          if (error) {
            console.error('Error uploading to Cloudinary:', error);
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );
      uploadStream.end(imageBuffer);
    });
  } catch (error) {
    console.error('Error in uploadImageToCloudinary:', error.message);
    return null;
  }
};

const fetchImageFromPexels = async (keyword) => {
  try {
    // Log Pexels API key status for debugging
    console.log(`Fetching image for keyword "${keyword}" with Pexels API key: ${PEXELS_API_KEY ? "Set" : "Not set"}`);

    if (!PEXELS_API_KEY) {
      console.error("Pexels API key is missing");
      return null;
    }

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=1`,
      {
        method: 'GET',
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      console.error(`Pexels API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    const { photos } = data;

    if (!photos || photos.length === 0) {
      console.error(`No images found for keyword: ${keyword}`);
      return null;
    }

    const imageUrl = photos[0].src.large;
    console.log(`Found image for "${keyword}": ${imageUrl}`);

    const imageResponse = await fetch(imageUrl);
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const fileName = `${keyword.replace(/\s+/g, '_')}_${Date.now()}`;
    
    return await uploadImageToCloudinary(imageBuffer, fileName);
  } catch (error) {
    console.error(`Error fetching image for keyword "${keyword}":`, error.message);
    return null;
  }
};

export const updateDatabaseWithImages = async (sessionId) => {
  try {
    const processedText = await ProcessedText.findOne({ session_id: sessionId });
    if (!processedText) {
      console.error(`No processed text found for session ID: ${sessionId}`);
      return;
    }

    const highlights = processedText.highlights || [];
    console.log(`Found ${highlights.length} highlights for session ${sessionId}`);

    const imageUrls = [];
    // Use only 5 highlights to avoid too many API calls
    const limitedHighlights = highlights.slice(0, 5);

    for (const highlight of limitedHighlights) {
      const imageUrl = await fetchImageFromPexels(highlight.text);
      if (imageUrl) {
        console.log(`Added image for "${highlight.text}": ${imageUrl}`);
        imageUrls.push(imageUrl);
      }
    }

    // If no highlights or no images found, try some generic meeting-related keywords
    if (imageUrls.length === 0) {
      const genericKeywords = ["business meeting", "conference", "team collaboration", "presentation", "discussion"];
      for (const keyword of genericKeywords) {
        const imageUrl = await fetchImageFromPexels(keyword);
        if (imageUrl) {
          console.log(`Added generic image for "${keyword}": ${imageUrl}`);
          imageUrls.push(imageUrl);
          if (imageUrls.length >= 3) break; // Get at least 3 images
        }
      }
    }

    processedText.image_urls = imageUrls;
    await processedText.save();
    console.log(`Saved ${imageUrls.length} images to database for session ${sessionId}`);
  } catch (error) {
    console.error('Error updating database with images:', error.message);
  }
};

export default fetchImageFromPexels;
