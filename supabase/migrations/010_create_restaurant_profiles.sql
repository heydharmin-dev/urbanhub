-- Restaurant / Cafe business profiles
CREATE TABLE public.restaurant_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  business_type text NOT NULL CHECK (business_type IN ('restaurant', 'cafe', 'catering', 'hotel', 'cloud_kitchen', 'other')),
  address text NOT NULL,
  city text NOT NULL,
  contact_person text NOT NULL,
  contact_phone text NOT NULL,
  website text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_restaurant_profiles_user_id ON public.restaurant_profiles(user_id);
CREATE INDEX idx_restaurant_profiles_city ON public.restaurant_profiles(city);
CREATE INDEX idx_restaurant_profiles_business_type ON public.restaurant_profiles(business_type);

-- Enable RLS
ALTER TABLE public.restaurant_profiles ENABLE ROW LEVEL SECURITY;

-- Restaurant can see own profile
CREATE POLICY "restaurant_select_own" ON public.restaurant_profiles
  FOR SELECT USING (user_id = auth.uid());

-- Restaurant can insert own profile
CREATE POLICY "restaurant_insert_own" ON public.restaurant_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Restaurant can update own profile
CREATE POLICY "restaurant_update_own" ON public.restaurant_profiles
  FOR UPDATE USING (user_id = auth.uid());

-- Admin can see all restaurant profiles
CREATE POLICY "restaurant_select_admin" ON public.restaurant_profiles
  FOR SELECT USING (public.is_admin());

-- Admin can update any restaurant profile
CREATE POLICY "restaurant_update_admin" ON public.restaurant_profiles
  FOR UPDATE USING (public.is_admin());

-- Auto-update updated_at
CREATE TRIGGER restaurant_profiles_updated_at
  BEFORE UPDATE ON public.restaurant_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
