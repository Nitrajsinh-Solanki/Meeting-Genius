// Meeting-Genius\server\src\index.js

import mongoose from "mongoose";
import app from "./app.js";
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.DATABASE_URL, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}).then(() => {
  console.log('Connected to DB');
  app.listen(3000, () => console.log('Server running on port 3000...'));
});
