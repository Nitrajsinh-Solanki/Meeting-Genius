
---

# 🚀 Meeting Insights Generator  
_A Comprehensive Solution for Meeting Transcriptions, Summarizations, and Insights Visualization_

[![Demo Video](https://img.shields.io/badge/Demo-YouTube-red)](https://youtu.be/x_GMz0qJ9Zg)  
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)  
[![Hackathon Submission](https://img.shields.io/badge/Challenge-Multimodal%20GenAI-orange)](https://hackathon.example.com)

---

## 🌟 About the Project  

**Meeting Insights Generator** is a multimodal application designed to streamline meeting workflows by converting speech-to-text, generating concise summaries, and visualizing key insights with AI-powered image generation.  

This project was developed as part of the **Hackathon Challenge: From Words to Worlds – Multimodal GenAI**, blending speech, text, and image modalities for innovative meeting analysis.

### Key Features  
- 🎤 **Speech-to-Text Conversion**: Transcribe meeting recordings with AssemblyAI.  
- 📝 **AI-Powered Summarization**: Summarize discussions using Facebook Bart large cnn model .  
- 🖼 **Image Generation**: Retrieve visuals for highlights with Pexels api.  
- 🎧 **Text-to-Speech**: Convert summaries into audio for quick reviews using Deepgram api .  
- ☁️ **Storage Integration**: Store and retrieve generated content with Supabase.  

[Watch Demo Video](https://youtu.be/x_GMz0qJ9Zg)  

--- 

---

## 🛠️ Tech Stack  

- **Frontend**: React, Vite, CSS  
- **Backend**: Node.js, Express, MongoDB  
- **APIs Used**:  
  - AssemblyAI for transcription  
  - Facebook Bart large cnn model for summarization  
  - Pexels api for image generation  
  - Deepgram for text-to-speech  
- **Storage**: Supabase  

---

## 📋 Installation Guide  

Follow these steps to set up the project locally:

### Prerequisites  
1. Install [Node.js](https://nodejs.org/) (v16+ recommended).  
2. Install [MongoDB](https://www.mongodb.com/) and ensure it's running locally or use a cloud service like MongoDB Atlas.  

### Step-by-Step Instructions  

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/Nitrajsinh-Solanki/Meeting-Genius.git
   cd Meeting-Genius
   ```

2. **Backend Setup**  
   - Navigate to the server directory:  
     ```bash
     cd Meeting-Genius/server
     ```  
   - Install dependencies:  
     ```bash
     npm install
     ```  
   - Set up environment variables in `.env` file:  
     ```plaintext
     API_KEY=your_assembly_ai_api_key
     DATABASE_URL=your_supabase_url
     JWT_SECRET=Random_string
     HUGGING_FACE_API_KEY=Your_hugging_face_api_key
     PEXELS_API_KEY=Yur_pexels_api_key
     SUPABASE_URL=your_supa_base_url
     SUPABASE_KEY=your_supa_base_key
     SUPABASE_BUCKET=name_of_supa_base_bucket
     ```
   - Start the backend server:  
     ```bash
     npm run start
     ```

3. **Frontend Setup**  
   - Navigate to the client directory:  
     ```bash
     cd Meeting-Genius/client
     ```  
   - Install dependencies:  
     ```bash
     npm install
     ```  
   - Set up environment variables in `.env` file:  
     ```plaintext
     
      VITE_SUPABASE_URL="your_supabase_public_url"
      VITE_SUPABASE_KEY="your_supabase_secret_key"
      VITE_BASE_URL="http://localhost:3000/api/v2"  
      VITE_INTERNAL_SERVER="http://localhost:3000"
      VITE_DEEPGRAM_API_KEY="your_deepgram_api_key"

     ```
   - Start the frontend development server:  
     ```bash
     npm run dev
     ```  

4. **Access the Application**  
   Open your browser and navigate to:  
   - Frontend: `http://localhost:5173`  
   - Backend: `http://localhost:5000`  

---

## 📚 Workflow  

### Input  
Upload meeting audio/video files. The app automatically transcribes, summarizes, and generates visual insights.  

### Processing  
- **Speech-to-Text**: Extracts text from audio using AssemblyAI.  
- **Summarization**: Analyzes the transcription and highlights key points with Hugging face Facebook Bart Large cnn Model.  
- **Image Generation**: Creates visuals based on key points using Pexels Api.  
- **Audio Generation**: Convert summaries into audio for quick reviews using Deepgram API.  

### Output  
- Text transcription  
- Concise summaries  
- Relevant visuals  
- Optional audio summaries  

---

## 🎥 Demo Video  

Click below to watch a walkthrough of the project!  
[![Watch the video](https://img.youtube.com/vi/x_GMz0qJ9Zg/0.jpg)](https://youtu.be/x_GMz0qJ9Zg)

---

 

---

## 🚀 Future Enhancements  

- 🌍 **Live Deployment**: Deploy the app on a cloud service.  
- 🤖 **Advanced Summarization**: Incorporate domain-specific AI models.  
- 📊 **Analytics Dashboard**: Visualize meeting insights with charts and graphs.  

---
