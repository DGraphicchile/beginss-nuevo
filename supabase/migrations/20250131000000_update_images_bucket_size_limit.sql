/*
  # Update images storage bucket file size limit to 20MB

  Increases the maximum upload size from 5MB to 20MB for profile photos,
  Cafecito event images, Marketplace images, and all other images.
*/

UPDATE storage.buckets
SET file_size_limit = 20971520  -- 20MB
WHERE id = 'images';
