
import express from 'express';
import transcribeAPIToken from '../controllers/transcribeAPIToken.js';
const router = express.Router();

router.post('/:session_id', async (req, res) => {
    const { audio_url, session_id } = req.body;
    const user_id = req.user?.id;
  
    if (!audio_url || !session_id) {
      return res.status(400).json({ error: 'Audio URL and Session ID are required.' });
    }
  
    try {
      const result = await transcribeAPIToken(audio_url, user_id, session_id);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error processing transcription:', error);
      res.status(500).json({ error: 'Failed to process transcription.' });
    }
  });
  
  
export default router;