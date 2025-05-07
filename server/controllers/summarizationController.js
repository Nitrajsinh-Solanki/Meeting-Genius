// Meeting-Genius\server\controllers\summarizationController.js

import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const HUGGING_FACE_SUMMARIZATION_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

if (!HUGGING_FACE_API_KEY) {
  console.error("Hugging Face API key is missing");
}

const MAX_TOKENS = 1024;

const splitTextIntoChunks = (text, maxTokens) => {
  const words = text.split(" ");
  const chunks = [];
  let currentChunk = "";
  for (const word of words) {
    if ((currentChunk + " " + word).length > maxTokens) {
      chunks.push(currentChunk.trim());
      currentChunk = word;
    } else {
      currentChunk += " " + word;
    }
  }
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  return chunks;
};

const formatAsBulletPoints = (text) => {
  const sentences = text.split(". ").filter((sentence) => sentence.trim() !== "");
  return sentences.map((sentence) => `• ${sentence.trim()}.`).join("\n");
};

// Fallback summarization function using a simpler approach
const fallbackSummarize = (text) => {
  // Extract sentences
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0);
  
  // Take the first sentence and a few important ones based on length
  const importantSentences = [
    sentences[0], // First sentence is usually important
    ...sentences
      .slice(1)
      .filter(s => s.length > 50) // Longer sentences often contain more information
      .slice(0, 5) // Limit to 5 sentences
  ];
  
  return importantSentences.join(". ") + ".";
};

const summarizeText = async (req, res) => {
  console.log("Summarization request received");
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: "Text is required for summarization." });
  }
  
  console.log(`Received text of length: ${text.length}`);
  
  // Check if API key is available
  if (!HUGGING_FACE_API_KEY) {
    console.error("Missing Hugging Face API key");
    return res.status(500).json({ error: "API configuration error." });
  }
  
  const chunks = splitTextIntoChunks(text, MAX_TOKENS);
  console.log(`Split text into ${chunks.length} chunks`);
  
  let fullSummary = "";
  
  try {
    // Process each chunk with a delay to avoid rate limiting
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`Processing chunk ${i+1}/${chunks.length}, length: ${chunk.length}`);
      
      try {
        const response = await axios.post(
          HUGGING_FACE_SUMMARIZATION_URL,
          { inputs: chunk },
          {
            headers: {
              Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
              "Content-Type": "application/json",
            },
            timeout: 30000, // 30 second timeout
          }
        );
        
        console.log(`Received response for chunk ${i+1}`);
        
        if (response.data && response.data[0] && response.data[0].summary_text) {
          const summarizedText = response.data[0].summary_text;
          fullSummary += summarizedText + " ";
          console.log(`Added summary for chunk ${i+1}: ${summarizedText.substring(0, 50)}...`);
        } else {
          console.warn(`No summary text in response for chunk ${i+1}:`, response.data);
          // Use fallback for this chunk
          const fallbackSummaryForChunk = fallbackSummarize(chunk);
          fullSummary += fallbackSummaryForChunk + " ";
          console.log(`Added fallback summary for chunk ${i+1}`);
        }
        
        // Add a delay between chunks to avoid rate limiting
        if (i < chunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (chunkError) {
        console.error(`Error processing chunk ${i+1}:`, chunkError.message);
        
        // Use fallback for this chunk
        const fallbackSummaryForChunk = fallbackSummarize(chunk);
        fullSummary += fallbackSummaryForChunk + " ";
        console.log(`Added fallback summary for chunk ${i+1} after error`);
      }
    }
    
    // If we have no summary at all, use the fallback for the entire text
    if (!fullSummary.trim()) {
      console.log("No summary generated, using fallback");
      fullSummary = fallbackSummarize(text);
    }
    
    const formattedSummary = formatAsBulletPoints(fullSummary);
    console.log("Returning formatted summary");
    
    return res.status(200).json({ summarizedText: formattedSummary.trim() });
  } catch (error) {
    console.error("Error in summarization:", error.message || error);
    
    if (error.response) {
      console.error("Error Response:", error.response.data);
      console.error("Status:", error.response.status);
    }
    
    // Try fallback summarization
    try {
      console.log("Using fallback summarization");
      const fallbackSummary = fallbackSummarize(text);
      const formattedFallbackSummary = formatAsBulletPoints(fallbackSummary);
      
      return res.status(200).json({ 
        summarizedText: formattedFallbackSummary.trim(),
        note: "Used fallback summarization due to API error"
      });
    } catch (fallbackError) {
      console.error("Fallback summarization also failed:", fallbackError);
      return res.status(500).json({ error: "Failed to process summarization." });
    }
  }
};

export default summarizeText;
