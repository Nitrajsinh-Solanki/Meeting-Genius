
// Meeting-Genius\server\models\processedText.js
import mongoose from "mongoose";

const ProcessedTextSchema = new mongoose.Schema({
    user_id: { 
        type: String,
        required: true,
        default: "default-user-id" 
    },
    session_id: { 
        type: String,
        required: true 
    },
    result: { 
        type: String 
    },
    highlights: [
        {
            text: { type: String },
            count: { type: Number },
            rank: { type: Number }
        }
    ],
    description: {
        duration: { type: Number },
        confidence: { type: Number },
        language: { type: String },
        audio_url: { type: String }
    },
    image_urls: [[{ type: String }]],
},{
    timestamps: true,
});

export default mongoose.model("ProcessedText", ProcessedTextSchema);
