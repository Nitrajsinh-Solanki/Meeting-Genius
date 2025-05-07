// Meeting-Genius\server\routes\index.js
import express from "express";
import uploadRoutes from "./upload.js";


const route = express.Router();
route.use('/upload', uploadRoutes); 

export default route;