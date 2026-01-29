/*
  # Create images storage bucket for Cafecito events and other images

  This migration creates the 'images' storage bucket with public access
  for storing images uploaded by users (cafecito event images, avatars, etc.)
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'images' AND
  auth.role() = 'authenticated'
);

-- Policy: Allow public read access to images
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- Policy: Allow authenticated users to update images they uploaded
-- Files are stored as: cafecitos/{user.id}-{timestamp}.{ext}
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'images' AND
  (name LIKE 'cafecitos/' || auth.uid()::text || '-%' OR name LIKE auth.uid()::text || '-%')
)
WITH CHECK (
  bucket_id = 'images' AND
  (name LIKE 'cafecitos/' || auth.uid()::text || '-%' OR name LIKE auth.uid()::text || '-%')
);

-- Policy: Allow authenticated users to delete images they uploaded
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'images' AND
  (name LIKE 'cafecitos/' || auth.uid()::text || '-%' OR name LIKE auth.uid()::text || '-%')
);
