# 🚀 Meeting Insights Generator

_A Comprehensive Solution for Meeting Transcriptions, Summarizations, and Insights Visualization_

---

## 🌟 About the Project

**Meeting Insights Generator** is a multimodal application designed to streamline meeting workflows by converting speech-to-text, generating concise summaries, and visualizing key insights with AI-powered image generation.

This project was developed as part of the **Hackathon Challenge: From Words to Worlds – Multimodal GenAI**, blending speech, text, and image modalities for innovative meeting analysis.

### Key Features

- 🎤 **Speech-to-Text Conversion**: Transcribe meeting recordings with AssemblyAI.
- 📝 **AI-Powered Summarization**: Summarize discussions using Facebook Bart large cnn model.
- 🖼 **Image Generation**: Retrieve visuals for highlights with Pexels API.
- 🎧 **Text-to-Speech**: Convert summaries into audio for quick reviews using Deepgram API.
- ☁️ **Cloud Storage**: Store and retrieve generated content with Cloudinary.

[Watch Demo Video](https://youtu.be/x_GMz0qJ9Zg)

---

## Screenshots

![App Interface Screenshot 1](https://wcpjrnbiwfpmglpqwstr.supabase.co/storage/v1/object/public/hackathon-november/images/Screenshot%202024-11-24%20144937.png)

![App Interface Screenshot 2](https://wcpjrnbiwfpmglpqwstr.supabase.co/storage/v1/object/public/hackathon-november/images/Screenshot%202024-11-24%20145038.png)

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, CSS
- **Backend**: Node.js, Express, MongoDB
- **APIs Used**:
  - AssemblyAI for transcription
  - Facebook Bart large cnn model for summarization
  - Pexels API for image generation
  - Deepgram for text-to-speech
- **Storage**: Cloudinary

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
```

```bash
cd Meeting-Genius
```

2. **Backend Setup**

   - Navigate to the server directory:

```bash
cd server
```

   - Install dependencies:

```bash
npm install
```

   - Set up environment variables in `.env` file:

```plaintext:.env
API_KEY=your_assembly_ai_api_key
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_string
HUGGING_FACE_API_KEY=your_hugging_face_api_key
PEXELS_API_KEY=your_pexels_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

   - Start the backend server:

```bash
npm run start
```

3. **Frontend Setup**

   - Navigate to the client directory:

```bash
cd client
```

   - Install dependencies:

```bash
npm install
```

   - Set up environment variables in `.env` file:

```plaintext:.env
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
   - Backend: `http://localhost:3000`

---

## 📚 Workflow

### Input
Upload meeting audio files. The app automatically transcribes, summarizes, and generates visual insights.

### Processing
- **Speech-to-Text**: Extracts text from audio using AssemblyAI.
- **Summarization**: Analyzes the transcription and highlights key points with Hugging Face's Facebook Bart Large CNN Model.
- **Image Generation**: Creates visuals based on key points using Pexels API.
- **Audio Generation**: Converts summaries into audio for quick reviews using Deepgram API.
- **Cloud Storage**: Stores all generated content securely using Cloudinary.

### Output
- Text transcription
- Concise summaries
- Relevant visuals
- Optional audio summaries
- Secure cloud storage of all assets

---

## 🎥 Demo Video

Click below to watch a walkthrough of the project!

[![Watch the video](https://img.youtube.com/vi/x_GMz0qJ9Zg/0.jpg)](https://youtu.be/x_GMz0qJ9Zg)

---

## 🔧 Environment Configuration

Make sure to configure your environment variables properly:

### Server Environment Variables

```plaintext:server/.env
API_KEY=your_assembly_ai_api_key
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
HUGGING_FACE_API_KEY=your_hugging_face_api_key
PEXELS_API_KEY=your_pexels_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Client Environment Variables

```plaintext:client/.env
VITE_BASE_URL="http://localhost:3000/api/v2"
VITE_INTERNAL_SERVER="http://localhost:3000"
VITE_DEEPGRAM_API_KEY="your_deepgram_api_key"
```

---
