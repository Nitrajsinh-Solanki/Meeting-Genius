
import { useState, useRef } from "react";

function TextToSpeech({ summary }) {
  const [loading, setLoading] = useState(false);
  const [audioUrls, setAudioUrls] = useState([]); 
  const [isPlaying, setIsPlaying] = useState(false); 
  const audioRef = useRef(null);
  const MAX_CHUNK_LENGTH = 300;

  const chunkText = (text, maxLength) => {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
      const end = Math.min(start + maxLength, text.length);
      chunks.push(text.slice(start, end));
      start = end;
    }
    return chunks;
  };

  const generateAudioChunks = async (textChunks) => {
    const urls = [];
    for (const chunk of textChunks) {
      try {
        const response = await fetch(
          "https://api.deepgram.com/v1/speak?model=aura-asteria-en&encoding=mp3",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${import.meta.env.VITE_DEEPGRAM_API_KEY}`,
            },
            body: JSON.stringify({ text: chunk }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to generate TTS audio for a chunk.");
        }

        const contentType = response.headers.get("Content-Type");
        if (!contentType.startsWith("audio/")) {
          throw new Error(`Unexpected content type: ${contentType}`);
        }

        const audioBlob = await response.blob();
        const generatedAudioUrl = URL.createObjectURL(audioBlob);
        urls.push(generatedAudioUrl);
      } catch (error) {
        console.error("Error generating audio for chunk:", error);
        alert("Failed to generate audio for a chunk. Please try again.");
      }
    }
    return urls;
  };

  const toggleAudioPlayback = async () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (audioUrls.length === 0) {
      setLoading(true);
      try {
        const textChunks = chunkText(summary, MAX_CHUNK_LENGTH);
        const urls = await generateAudioChunks(textChunks);
        setAudioUrls(urls);

       
        const allChunksAudioUrl = await combineAudioChunks(urls);
        if (audioRef.current) {
          audioRef.current.src = allChunksAudioUrl;
          audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error("Error generating audio:", error);
        alert("Failed to generate audio. Please try again.");
      } finally {
        setLoading(false);
      }
    } else if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const combineAudioChunks = async (urls) => {
    const audioBlobs = await Promise.all(urls.map(url => fetch(url).then(res => res.blob())));
    const combinedBlob = new Blob(audioBlobs, { type: "audio/mp3" });
    return URL.createObjectURL(combinedBlob);
  };

  const downloadAudio = async () => {
    if (audioUrls.length > 0) {
     
      const allChunksAudioUrl = await combineAudioChunks(audioUrls);
      const a = document.createElement("a");
      a.href = allChunksAudioUrl;
      a.download = "full_audio.mp3";
      a.click();
    }
  };

  return (
    <div className="text-to-speech-container">
      <button
        type="button"
        onClick={toggleAudioPlayback}
        className={`tts-button ${loading ? "loading" : ""}`}
        disabled={loading}
      >
        {isPlaying ? "Pause Audio" : "Play Summary"}
      </button>

      <button
        type="button"
        onClick={downloadAudio}
        className="tts-button"
        disabled={loading || audioUrls.length === 0}
      >
        Download Audio
      </button>

      <audio
        ref={audioRef}
        className="hidden"
        onEnded={() => {
          setIsPlaying(false); 
        }}
      />
    </div>
  );
}

export default TextToSpeech;
