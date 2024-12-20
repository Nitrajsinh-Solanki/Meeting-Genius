

import express from 'express';
import register from '../controllers/Register.js';
import login from '../controllers/Login.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);

export default router;