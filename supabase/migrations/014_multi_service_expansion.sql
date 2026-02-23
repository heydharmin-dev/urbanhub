-- ============================================
-- Migration 014: Multi-Service Platform Expansion
-- Transform ChefHire into UrbanHire (Urban Company-like)
-- ============================================

-- 1. Create service_categories table
CREATE TABLE IF NOT EXISTS public.service_categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  icon text NOT NULL DEFAULT 'Wrench',
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS: public read, admin write
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_categories_select_public" ON public.service_categories
  FOR SELECT USING (true);

CREATE POLICY "service_categories_admin_all" ON public.service_categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 2. Seed 20 service categories
INSERT INTO public.service_categories (id, name, description, icon, display_order) VALUES
  ('cooking', 'Cooking & Chef', 'Personal chefs, catering, meal prep, event cooking', 'ChefHat', 1),
  ('cleaning', 'Home Cleaning', 'Deep cleaning, regular cleaning, kitchen, bathroom, carpet', 'SprayCan', 2),
  ('babysitting', 'Babysitting & Childcare', 'Nanny, daycare, tutoring, child supervision', 'Baby', 3),
  ('elder_care', 'Elder Care', 'Companion care, nursing, physiotherapy at home', 'HeartHandshake', 4),
  ('massage_spa', 'Massage & Spa', 'Body massage, head massage, facial treatments', 'Flower2', 5),
  ('salon_beauty', 'Salon & Beauty', 'Haircut, styling, bridal makeup, threading, waxing', 'Scissors', 6),
  ('plumbing', 'Plumbing', 'Leak repair, pipe fitting, drain cleaning, water heater', 'Wrench', 7),
  ('electrical', 'Electrical', 'Wiring, fixture installation, fan/AC, short circuit repair', 'Zap', 8),
  ('carpentry', 'Carpentry', 'Furniture repair, assembly, door/window, custom woodwork', 'Hammer', 9),
  ('painting', 'Painting', 'Interior painting, exterior painting, waterproofing, texture', 'Paintbrush', 10),
  ('pest_control', 'Pest Control', 'Cockroach, termite, bed bug, mosquito, rodent control', 'Bug', 11),
  ('appliance_repair', 'Appliance Repair', 'AC, washing machine, refrigerator, microwave, geyser', 'Settings', 12),
  ('fitness_yoga', 'Fitness & Yoga', 'Personal trainer, yoga instructor, Zumba, pilates', 'Dumbbell', 13),
  ('pet_care', 'Pet Care', 'Dog walking, grooming, pet sitting, vet at home', 'PawPrint', 14),
  ('driving', 'Driving', 'Personal driver, delivery, chauffeur service', 'Car', 15),
  ('security', 'Security', 'Guard, bouncer, event security, night watch', 'Shield', 16),
  ('gardening', 'Gardening', 'Lawn care, landscaping, plant maintenance, tree trimming', 'Flower', 17),
  ('laundry', 'Laundry', 'Wash & fold, dry cleaning, ironing, stain removal', 'Shirt', 18),
  ('moving_packing', 'Moving & Packing', 'Local shifting, packing, loading/unloading', 'Truck', 19),
  ('event_services', 'Event Services', 'Waiter, bartender, DJ, photographer, decorator', 'PartyPopper', 20)
ON CONFLICT (id) DO NOTHING;

-- 3. Add service_category column to chef_profiles (providers)
ALTER TABLE public.chef_profiles
  ADD COLUMN IF NOT EXISTS service_category text REFERENCES public.service_categories(id) DEFAULT 'cooking';

-- Set all existing chefs to cooking category
UPDATE public.chef_profiles SET service_category = 'cooking' WHERE service_category IS NULL;

-- Index for filtering providers by category
CREATE INDEX IF NOT EXISTS idx_chef_profiles_service_category ON public.chef_profiles(service_category);

-- 4. Add service_category column to jobs (service requests)
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS service_category text REFERENCES public.service_categories(id) DEFAULT 'cooking';

-- Set all existing jobs to cooking category
UPDATE public.jobs SET service_category = 'cooking' WHERE service_category IS NULL;

-- Index for filtering jobs by category
CREATE INDEX IF NOT EXISTS idx_jobs_service_category ON public.jobs(service_category);

-- 5. Expand restaurant_profiles business_type to include non-restaurant clients
ALTER TABLE public.restaurant_profiles DROP CONSTRAINT IF EXISTS restaurant_profiles_business_type_check;
ALTER TABLE public.restaurant_profiles ADD CONSTRAINT restaurant_profiles_business_type_check
  CHECK (business_type IN ('restaurant', 'cafe', 'catering', 'hotel', 'cloud_kitchen', 'residential', 'commercial', 'individual', 'other'));

-- 6. Update handle_new_user() trigger to support 'provider' metadata alias
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    CASE
      WHEN NEW.raw_user_meta_data->>'role' IN ('chef', 'provider') THEN 'chef'
      WHEN NEW.raw_user_meta_data->>'role' IN ('restaurant', 'client') THEN 'restaurant'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
