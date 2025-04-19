import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  'https://jqqvrvzgrxalinzxodml.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxcXZydnpncnhhbGluenhvZG1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNDc0MTIsImV4cCI6MjA2MDYyMzQxMn0.0dj8gvkurZHkJbdlczz4eS-PGaQOsfBUFZNvLqIrORg'
)

export async function uploadMedia(file, type) {
  if (!file) return { error: 'No file provided' }

  const fileName = `${Date.now()}_${file.name}`
  
  // Determine folder based on type
  const folder = type === 'image' ? 'images' : 'videos'
  const filePath = `${folder}/${fileName}`
  const bucket = 'vedios' // Replace with your actual bucket name if it's different

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      contentType: file.type,
    })

  if (error) {
    console.error('Upload error:', error.message)
    return { error }
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return { url: publicUrlData.publicUrl }
}