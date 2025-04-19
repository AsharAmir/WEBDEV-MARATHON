const OpenAI = require('openai');
const { Readable } = require('stream');
const { s3 } = require('./s3');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.generateTranscription = async (videoKey) => {
  try {
    // Get video file from S3
    const videoObject = await s3.getObject({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: videoKey
    }).promise();

    // Convert buffer to stream
    const videoStream = Readable.from(videoObject.Body);

    // Generate transcription using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: videoStream,
      model: "whisper-1",
      language: "en"
    });

    return transcription.text;
  } catch (error) {
    console.error('Error generating transcription:', error);
    throw new Error('Failed to generate transcription');
  }
};

exports.generateSummary = async (transcription) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes educational content. Create a concise summary of the following transcription, highlighting key points and concepts."
        },
        {
          role: "user",
          content: transcription
        }
      ],
      max_tokens: 500
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary');
  }
}; 