const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.transcribeVideo = async (videoUrl) => {
  try {
    // Download the video file
    const response = await axios({
      method: 'GET',
      url: videoUrl,
      responseType: 'arraybuffer'
    });

    // Create a buffer from the video data
    const videoBuffer = Buffer.from(response.data);

    // Use Gemini Pro Vision for transcription
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    // Convert buffer to base64 for Gemini
    const base64Video = videoBuffer.toString('base64');
    
    // Generate transcription
    const result = await model.generateContent([
      "Transcribe the following video content in detail:",
      {
        inlineData: {
          mimeType: "video/mp4",
          data: base64Video
        }
      }
    ]);

    const transcription = result.response.text();
    
    return {
      transcript: transcription,
      timestamps: [], // Gemini doesn't provide timestamps, so we return an empty array
      captions: [] // Gemini doesn't provide captions, so we return an empty array
    };
  } catch (error) {
    console.error('Error in video transcription:', error);
    throw new Error('Failed to transcribe video');
  }
};

exports.generateSummary = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent([
      "You are a helpful assistant that creates concise summaries of educational content.",
      `Please create a brief summary of the following educational content: ${text}`
    ]);

    return result.response.text();
  } catch (error) {
    console.error('Error in generating summary:', error);
    throw new Error('Failed to generate summary');
  }
}; 