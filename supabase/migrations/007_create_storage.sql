-- Create storage bucket for chef documents
-- NOTE: Run this in Supabase Dashboard > Storage > Create Bucket
-- Bucket name: chef-documents
-- Public: OFF (private)
-- File size limit: 5MB
-- Allowed MIME types: application/pdf, image/jpeg, image/png

-- Storage RLS Policies (run in SQL Editor after creating the bucket)

-- Chef can upload to own folder
CREATE POLICY "chef_upload_own_docs" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'chef-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Chef can read own documents
CREATE POLICY "chef_read_own_docs" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'chef-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admin can read all documents
CREATE POLICY "admin_read_all_docs" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'chef-documents'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
