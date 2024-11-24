import express from 'express';
import mongoose from "mongoose";
import app from "./app.js";
import authRoutes from './../routes/auth.js';
import dotenv from 'dotenv';

const router = express.Router();

router.use('/auth', authRoutes);

dotenv.config();

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Connected to DB');
    app.listen(3000, () => console.log('Server running on port 3000...'));
});

export default router;
