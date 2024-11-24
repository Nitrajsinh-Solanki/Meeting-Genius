

import { useRef, useState, useEffect, useContext } from "react";
import uploadAudio from "../storage/storage.js";
import "./Content.css";
import { authContext } from "./ContextProvider.jsx";
import TextToSpeech from "./TextToSpeech.jsx";
import { jsPDF } from "jspdf"; // Import jsPDF

function Content() {
  const [fileUrl, setFileUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [transcript, setTranscript] = useState({});
  const [summary, setSummary] = useState("");
  const [images, setImages] = useState([]);
  const [fetchingImages, setFetchingImages] = useState(false);
  const inputRef = useRef();
  const { user } = useContext(authContext);
  const [sessionId, setSessionId] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const generatePDF = async () => {
    if (!summary) {
      alert("No summary available to download.");
      return;
    }

    const doc = new jsPDF();
    const marginLeft = 10; 
    const marginTop = 20; 
    const lineHeight = 7;
    const pageWidth = doc.internal.pageSize.width - 20; 
    const pageHeight = doc.internal.pageSize.height; 
    let yPosition = marginTop; 
    doc.setFontSize(16);
    doc.text("Meeting Summary", marginLeft, marginTop - 10);
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(summary, pageWidth);

    lines.forEach((line) => {
      if (yPosition + lineHeight > pageHeight - 40) {
        doc.addPage();
        yPosition = marginTop;
      }
      doc.text(line, marginLeft, yPosition);
      yPosition += lineHeight;
    });

  
    if (images && images.length > 0) {
      try {
        await Promise.all(
          images.slice(0, 5).map((url) => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.crossOrigin = "Anonymous"; 
              img.src = url;

              img.onload = () => {
                if (yPosition + 60 > pageHeight - 10) {
                  doc.addPage();
                  yPosition = marginTop;
                }
                doc.addImage(img, "JPEG", marginLeft, yPosition, 100, 60);
                yPosition += 70; 
                resolve(); 
              };

              img.onerror = () => {
                console.error(`Failed to load image at ${url}`);
                reject(`Image at ${url} could not be loaded.`);
              };
            });
          })
        );
      } catch (error) {
        alert("Some images failed to load. PDF generation may be incomplete.");
        console.error(error);
        return;
      }
    }
    doc.save("MeetingSummary.pdf");
  };

  const uploadAudioFile = async (e) => {
    e.preventDefault();
    const audioFile = inputRef.current.files[0];
    if (audioFile) {
      setUploading(true);
      await uploadAudio(audioFile, setFileUrl);

      const newSessionId = new Date().toISOString();
      setSessionId(newSessionId);
      setTimeout(() => {
      
      }, 0);
    }
  };

  useEffect(() => {
    if (fileUrl) {
      setUploading(false);
    }
  }, [fileUrl]);

  const fetchProcessedText = async () => {
    if (!user || !user.token) {
      alert("Please login to continue");
      return;
    }

    if (!sessionId) {
      console.error("Session ID is not set.");
      alert("Session ID is missing. Please try again.");
      return;
    }

    setLoader(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/processed-text/${
          user.id
        }/${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch processed text");
      }

      const data = await response.json();
      setTranscript({ result: data.data.result });
      setImages(data.data.image_urls || []);
     
    } catch (error) {
      console.error("Error fetching processed text:", error);
      alert("Failed to retrieve processed text.");
    } finally {
      setLoader(false);
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    getTranscript();
  };
  const getTranscript = async () => {
    if (!user || !user.token) {
      alert("Please login to continue");
      return;
    }

    if (!fileUrl || !sessionId) {
      alert(
        "Audio file or session ID is missing. Please upload the file again."
      );
      return;
    }

    setLoader(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/upload/${sessionId}`,
        {
          method: "POST",
          body: JSON.stringify({ audio_url: fileUrl, session_id: sessionId }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await response.json();
      setTranscript(data);

    } catch (error) {
      console.error("Error during transcription:", error);
      alert("Your session has expired, please log in again.");
    } finally {
      setLoader(false);
    }
  };

  const summarizeText = async () => {
    if (!user || !user.token) {
      alert("Please login to continue");
      return;
    }

    if (!transcript.result) {
      alert("Transcription result is empty or not ready yet.");
      return;
    }

    setIsSummarizing(true); 

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/summarize`,
        {
          method: "POST",
          body: JSON.stringify({ text: transcript.result }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await response.json();

      if (data.error) {
        console.error("Error in summarizeText:", data.error);
        alert("Summarization error: " + data.error);
        return;
      }

      setSummary(data.summarizedText);
      pollForImageUrls(); 
    } catch (error) {
      console.log("Error during summarization:", error);
      alert("Failed to generate summary. Please try again.");
    } finally {
      setIsSummarizing(false); 
    }
  };

  const pollForImageUrls = () => {
    setFetchingImages(true);
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/processed-text/${
            user.id
          }/${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch processed text");
        }

        const data = await response.json();

        if (data.data.image_urls && data.data.image_urls.length >= 0) {
          setImages(data.data.image_urls);
          setFetchingImages(false);
          clearInterval(intervalId); 
        } else {
          console.log(
            `Images are available`
          );
        }
      } catch (error) {
        console.error("Error during image URL polling:", error);
      }
    }, 5000);
  };

  return (
    <div className="main">
      <form className="form-element">
        <input ref={inputRef} type="file" accept="audio/*" />
        {fileUrl ? (
          <button onClick={submitForm} type="button">
            Submit
          </button>
        ) : (
          <button onClick={uploadAudioFile} type="button" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Audio"}
          </button>
        )}

        {transcript.result ? (
          <>
            <h1>Generated Text</h1>
            <div className="text-generated">
              <p style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
                {transcript.result}
              </p>
            </div>

            <button
              onClick={summarizeText}
              type="button"
              disabled={isSummarizing}
            >
              {isSummarizing ? "Summarizing, please wait..." : "Summarize"}
            </button>

            {summary && (
              <>
                <h2 style={{ color: "white" }}>Summary</h2>
                <div className="summary-text">
                  <p style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
                    {summary}
                  </p>
                </div>
                <button onClick={generatePDF} type="button">
                  Download as PDF
                </button>
                {summary && <TextToSpeech summary={summary} />}
              </>
            )}

            {fetchingImages ? (
              <p>Loading images, please wait...</p>
            ) : (
              images.length > 0 && (
                <div className="image-gallery">
                  <h2>Relevant Images</h2>
                  <div className="images">
                    {images.slice(0, 5).map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Relevant Image ${index + 1}`}
                        className="image-item"
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </>
        ) : (
          <div>
            <h1>Generated Text</h1>
            {loader && (
              <p className="loader-text">
                We are processing your audio, please wait...
              </p>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

export default Content;
