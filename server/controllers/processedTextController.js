import ProcessedText from '../models/processedText.js';

const getProcessedText = async (req, res) => {
  const { user_id, session_id } = req.params; 

  try {
    const processedText = await ProcessedText.findOne({ user_id, session_id });
    if (!processedText) {
      return res.status(404).json({ message: "Processed text not found" });
    }

    res.json({
      user: { id: processedText.user_id },
      data: {
        result: processedText.result,
        image_urls: processedText.image_urls,
        highlights: processedText.highlights,
        description: processedText.description,
      },
    });
  } catch (error) {
    console.error("Error fetching processed text:", error);
    res.status(500).json({ message: "Error fetching processed text", error });
  }
};


export default getProcessedText;