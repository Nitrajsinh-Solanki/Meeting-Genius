import express from 'express';
import getProcessedText from '../controllers/processedTextController.js';

const router = express.Router();
router.get('/processed-text/:user_id/:session_id', getProcessedText); 
export default router;