import ProcessedText from "../models/processedText.js";
import fetch from "node-fetch";
import generateImageFromHighlight from "../utils/imageGeneration.js";
import { configDotenv } from "dotenv";

configDotenv();

const transcribeAPIToken = async (audio_url, user_id, sessionId) => {
  const api_token = process.env.API_KEY;

  try {
   
    const headers = {
      authorization: api_token,
      "content-type": "application/json",
    };

    const res = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      body: JSON.stringify({
        audio_url,
        speaker_labels: true,
        auto_highlights: true,
        language_detection: true,
      }),
      headers,
    });

    const responseData = await res.json();
    const transcriptID = responseData.id;
    const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptID}`;

    while (true) {
      const pollingResponse = await fetch(pollingEndpoint, { headers });
      const transcriptionResult = await pollingResponse.json();

      if (transcriptionResult.status === "completed") {
        

        const utterances = transcriptionResult.utterances;
        const highlights =
          transcriptionResult.auto_highlights_result?.results || [];
        let resultText = "";

        if (utterances && utterances.length > 0) {
          utterances.forEach((utterance) => {
            const speaker = utterance.speaker;
            const text = utterance.text;

            resultText += `Speaker ${speaker}:\n${"=".repeat(
              `Speaker ${speaker}:`.length
            )}\n${text}\n\n`;
          });

          const processedT = new ProcessedText({
            user_id,
            session_id: sessionId,
            result: resultText,
            highlights,
            description: {
              duration: transcriptionResult.audio_duration,
              confidence: transcriptionResult.confidence,
              language: transcriptionResult.language_code,
              audio_url,
            },
            image_urls: [],
          });

          const savedResult = await processedT.save();

          await generateImagesForHighlights(savedResult._id, highlights);

          return savedResult;
        } else {
          console.log("No recognizable speech found.");
          const processedT = new ProcessedText({
            user_id,
            session_id: sessionId,
            result: "There is no recognized speech.",
            highlights: [],
            description: {
              duration: transcriptionResult.audio_duration,
              confidence: transcriptionResult.confidence,
              language: transcriptionResult.language_code,
              audio_url,
            },
            image_urls: [],
          });

          return await processedT.save();
        }
      } else if (transcriptionResult.status === "error") {
        throw new Error(`Transcription failed: ${transcriptionResult.error}`);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Poll every 3 seconds
      }
    }
  } catch (error) {
    console.error("Error during transcription:", error.message);
  }
};

export const generateImagesForHighlights = async (documentId, highlights) => {
  const topHighlights = highlights.sort((a, b) => b.rank - a.rank).slice(0, 5);

  for (const highlight of topHighlights) {
    try {
      const imageUrl = await generateImageFromHighlight(highlight.text);
      if (imageUrl) {
        await ProcessedText.findByIdAndUpdate(
          documentId,
          { $push: { image_urls: imageUrl } },
          { new: true }
        );
      
      }
    } catch (error) {
      console.error(
        `Error generating image for highlight: "${highlight.text}"`,
        error.message
      );
    }
  }
};

export default transcribeAPIToken;
