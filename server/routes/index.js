
import express from "express";
import uploadRoutes from "./upload.js";
import authRoutes from "./auth.js";
import authMiddleware from "../middlewares/auth.js";
const route = express.Router();
route.use('/upload', authMiddleware, uploadRoutes); 
route.use('/auth', authRoutes); 
export default route;