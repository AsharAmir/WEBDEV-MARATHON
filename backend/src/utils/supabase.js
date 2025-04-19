const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * Upload a video file to Supabase storage
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} fileName - The original file name
 * @param {string} folder - The folder path in storage
 * @returns {Promise<{url: string, key: string}>} - The public URL and storage key
 */
exports.uploadVideo = async (fileBuffer, fileName, folder) => {
  try {
    // Generate a unique key for the file
    const timestamp = Date.now();
    const fileExtension = fileName.split('.').pop();
    const key = `${folder}/${timestamp}-${fileName}`;

    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(key, fileBuffer, {
        contentType: `video/${fileExtension}`,
        cacheControl: '3600'
      });

    if (error) {
      console.error('Error uploading to Supabase:', error);
      throw new Error('Failed to upload file to Supabase');
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(key);

    return {
      url: publicUrl,
      key: key
    };
  } catch (error) {
    console.error('Error in uploadVideo:', error);
    throw error;
  }
};

/**
 * Delete a video file from Supabase storage
 * @param {string} key - The storage key of the file to delete
 * @returns {Promise<void>}
 */
exports.deleteVideo = async (key) => {
  try {
    const { error } = await supabase.storage
      .from('videos')
      .remove([key]);

    if (error) {
      console.error('Error deleting from Supabase:', error);
      throw new Error('Failed to delete file from Supabase');
    }
  } catch (error) {
    console.error('Error in deleteVideo:', error);
    throw error;
  }
};

/**
 * Get a signed URL for a video file
 * @param {string} key - The storage key of the file
 * @param {number} expiresIn - The number of seconds until the URL expires
 * @returns {Promise<string>} - The signed URL
 */
exports.getSignedUrl = async (key, expiresIn = 3600) => {
  try {
    const { data, error } = await supabase.storage
      .from('videos')
      .createSignedUrl(key, expiresIn);

    if (error) {
      console.error('Error generating signed URL:', error);
      throw new Error('Failed to generate signed URL');
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Error in getSignedUrl:', error);
    throw error;
  }
}; 