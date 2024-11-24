
import { fetch } from 'undici';
import { configDotenv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import ProcessedText from '../models/processedText.js';

configDotenv();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const uploadImageToSupabase = async (imageBuffer, fileName) => {
  try {
    const { data, error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(`images/${fileName}`, imageBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (error) throw new Error(error.message);

    const publicUrl = supabase.storage
      .from(SUPABASE_BUCKET)
      .getPublicUrl(`images/${fileName}`).data.publicUrl;

    if (!publicUrl) throw new Error('Failed to generate public URL');

    return publicUrl;
  } catch (error) {
    console.error('Error uploading to Supabase:', error.message);
    return null;
  }
};

const fetchImageFromPexels = async (keyword) => {
  try {

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
      console.error(`Pexels API error: ${response.statusText}`);
      return null;
    }

    const { photos } = await response.json();
    if (!photos || photos.length === 0) {
      console.error(`No images found for keyword: ${keyword}`);
      return null;
    }

    const imageUrl = photos[0].src.large;
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const fileName = `${keyword.replace(/\s+/g, '_')}_${Date.now()}.png`;

    return await uploadImageToSupabase(imageBuffer, fileName);
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

    const highlights = processedText.highlights;
    const imageUrls = [];

    for (const highlight of highlights) {
      const imageUrl = await fetchImageFromPexels(highlight.text);
      if (imageUrl) imageUrls.push(imageUrl);
    }

    processedText.image_urls = imageUrls;
    await processedText.save();

   
  } catch (error) {
    console.error('Error updating database with images:', error.message);
  }
};

export default fetchImageFromPexels;
