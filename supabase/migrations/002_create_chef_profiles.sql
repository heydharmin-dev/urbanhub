-- Create chef_profiles table
CREATE TABLE public.chef_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  experience_years integer NOT NULL CHECK (experience_years >= 0),
  specialty text NOT NULL,
  location text NOT NULL,
  price_per_hour numeric(10,2),
  price_per_day numeric(10,2),
  bio text,
  document_urls text[] DEFAULT '{}',
  verification_status text NOT NULL DEFAULT 'pending'
    CHECK (verification_status IN ('pending', 'approved', 'rejected', 'suspended')),
  admin_notes text,
  avg_rating numeric(3,2) DEFAULT 0,
  total_reviews integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_chef_profiles_user_id ON public.chef_profiles(user_id);
CREATE INDEX idx_chef_profiles_verification ON public.chef_profiles(verification_status);
CREATE INDEX idx_chef_profiles_location ON public.chef_profiles(location);
CREATE INDEX idx_chef_profiles_specialty ON public.chef_profiles(specialty);
CREATE INDEX idx_chef_browse ON public.chef_profiles(verification_status, location, specialty, price_per_day);

-- Enable RLS
ALTER TABLE public.chef_profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can see approved chefs
CREATE POLICY "chef_select_approved" ON public.chef_profiles
  FOR SELECT USING (verification_status = 'approved');

-- Chef can always see own profile
CREATE POLICY "chef_select_own" ON public.chef_profiles
  FOR SELECT USING (user_id = auth.uid());

-- Admin can see all chef profiles
CREATE POLICY "chef_select_admin" ON public.chef_profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Chef can insert own profile
CREATE POLICY "chef_insert_own" ON public.chef_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Chef can update own profile (not verification_status or admin_notes)
CREATE POLICY "chef_update_own" ON public.chef_profiles
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admin can update any chef profile (for verification)
CREATE POLICY "chef_update_admin" ON public.chef_profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin can delete chef profiles
CREATE POLICY "chef_delete_admin" ON public.chef_profiles
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Auto-update updated_at
CREATE TRIGGER chef_profiles_updated_at
  BEFORE UPDATE ON public.chef_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
