// import Lesson from '../models/Lesson.js';
// import Course from '../models/Course.js';
// import { uploadVideo, deleteVideo } from '../utils/supabase.js';
// import { GoogleGenerativeAI } from '@google/generative-ai';
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const { uploadVideo, deleteVideo } = require('../utils/supabase');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let ffmpeg = null;

async function initializeFFmpeg() {
  if (!ffmpeg) {
    const { createFFmpeg, fetchFile } = await import('@ffmpeg/ffmpeg');
    ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();
  }
  return ffmpeg;
}

async function extractAudioFromVideo(videoUrl) {
  try {
    const ffmpeg = await initializeFFmpeg();

    // Download the video
    const videoResponse = await fetch(videoUrl);
    const videoData = await videoResponse.arrayBuffer();
    ffmpeg.FS('writeFile', 'input.mp4', new Uint8Array(videoData));

    // Extract audio
    await ffmpeg.run('-i', 'input.mp4', '-vn', '-acodec', 'pcm_s16le', '-ar', '16000', 'output.wav');
    
    // Read the audio file
    const audioData = ffmpeg.FS('readFile', 'output.wav');
    
    // Clean up
    ffmpeg.FS('unlink', 'input.mp4');
    ffmpeg.FS('unlink', 'output.wav');

    return audioData;
  } catch (error) {
    console.error('Error in extractAudioFromVideo:', error);
    throw error;
  }
}

async function processVideo(lessonId, videoUrl) {
  try {
    // Extract audio from video
    console.log('Extracting audio from video...');
    const audioData = await extractAudioFromVideo(videoUrl);

    // Use Google Speech-to-Text API for transcription
    console.log('Transcribing audio...');
    const transcription = await transcribeAudio(audioData);

    // Use Gemini for analysis
    console.log('Generating analysis with Gemini...');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate summary
    const summaryPrompt = `Summarize the following transcription in a concise way, highlighting the main points:
    ${transcription}`;
    const summaryResult = await model.generateContent(summaryPrompt);
    const summary = summaryResult.response.text();

    // Generate detailed notes
    const notesPrompt = `Create detailed study notes from the following transcription. Include:
    - Key concepts
    - Important points
    - Main takeaways
    - Any technical terms and their explanations
    
    Transcription:
    ${transcription}`;
    const notesResult = await model.generateContent(notesPrompt);
    const notes = notesResult.response.text();

    // Update lesson with processed data
    await Lesson.findByIdAndUpdate(lessonId, {
      transcription,
      summary,
      notes,
      status: 'completed'
    });

    console.log('Video processing completed successfully');
  } catch (error) {
    console.error('Error processing video:', error);
    await Lesson.findByIdAndUpdate(lessonId, {
      status: 'failed',
      error: error.message
    });
  }
}

// Create a new lesson
const createLesson = async (req, res) => {
  try {
    const { courseId, title, description, videoUrl } = req.body;
    const lesson = new Lesson({
      courseId,
      title,
      description,
      videoUrl,
      status: 'processing'
    });
    await lesson.save();
    
    // Start processing video in background
    processVideo(lesson._id, videoUrl).catch(console.error);
    
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Error creating lesson', error: error.message });
  }
};

// Get a lesson by ID
const getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lesson', error: error.message });
  }
};

// Delete a lesson
const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Delete video from storage if exists
    if (lesson.videoUrl) {
      await deleteVideo(lesson.videoUrl);
    }
    
    await lesson.deleteOne();
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lesson', error: error.message });
  }
};

module.exports = {
  createLesson,
  getLesson,
  deleteLesson
}; 