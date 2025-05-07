// Meeting-Genius\server\src\app.js


import express from "express";
import route from "./../routes/index.js"; 
import bodyParser from "body-parser";
import cors from "cors";
import summarizationRoutes from "../routes/summarizationRoutes.js";
import getInfoRoutes from '../routes/getInfo.js';

const app = express();

app.use(express.json());  
app.use(cors());  
app.use(bodyParser.urlencoded({ extended: true })); 



app.use('/api/v2', route); 
app.use('/api/v2', summarizationRoutes);
app.use('/api/v2', getInfoRoutes);

export default app;
