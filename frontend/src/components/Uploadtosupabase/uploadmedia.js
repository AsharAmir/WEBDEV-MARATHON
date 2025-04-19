import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  'https://jqqvrvzgrxalinzxodml.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxcXZydnpncnhhbGluenhvZG1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNDc0MTIsImV4cCI6MjA2MDYyMzQxMn0.0dj8gvkurZHkJbdlczz4eS-PGaQOsfBUFZNvLqIrORg'
)

export async function uploadMedia(file, type) {
  console.log('Starting upload with file:', { 
    name: file?.name,
    type: file?.type,
    size: file?.size 
  });

  if (!file) {
    console.error('No file provided to uploadMedia');
    return { error: 'No file provided' };
  }

  try {
    // Create a unique file name with timestamp
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    // Determine folder based on type
    const folder = type === 'image' ? 'images' : 'videos';
    const filePath = `${folder}/${fileName}`;

    console.log('Uploading file to Supabase:', { 
      bucket: 'vedios',
      filePath,
      contentType: file.type 
    });

    // Upload file to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from('vedios')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return { error: uploadError.message };
    }

    console.log('File uploaded successfully:', data);

    // Get the public URL
    const { data: urlData, error: urlError } = supabase.storage
      .from('vedios')
      .getPublicUrl(filePath);

    if (urlError) {
      console.error('Failed to get public URL:', urlError);
      return { error: urlError.message };
    }

    console.log('Got public URL:', urlData);
    return { url: urlData.publicUrl };
  } catch (error) {
    console.error('Unexpected error in uploadMedia:', error);
    return { error: error.message };
  }
}