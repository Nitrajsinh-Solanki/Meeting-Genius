
import axios from "axios";

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const HUGGING_FACE_SUMMARIZATION_URL =
  "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

if (!HUGGING_FACE_API_KEY) {
  console.error("Hugging Face API key is missing");
  process.exit(1);
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

const summarizeText = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required for summarization." });
  }

  const chunks = splitTextIntoChunks(text, MAX_TOKENS);

  let fullSummary = "";

  try {
    for (const chunk of chunks) {
      const response = await axios.post(
        HUGGING_FACE_SUMMARIZATION_URL,
        { inputs: chunk },
        {
          headers: {
            Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );


      const summarizedText = response.data[0]?.summary_text || "";

      fullSummary += summarizedText + " ";
    }

    const formattedSummary = formatAsBulletPoints(fullSummary);

    return res.status(200).json({ summarizedText: formattedSummary.trim() });
  } catch (error) {
    console.error("Error in summarization:", error.message || error);

    if (error.response) {
      console.error("Error Response:", error.response.data);
    }

    return res.status(500).json({ error: "Failed to process summarization." });
  }
};

export default summarizeText;
