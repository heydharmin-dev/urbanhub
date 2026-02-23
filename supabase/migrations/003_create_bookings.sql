-- Create bookings table
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  chef_id uuid NOT NULL REFERENCES public.chef_profiles(id),
  booking_date date NOT NULL,
  booking_time time NOT NULL,
  event_type text NOT NULL,
  duration_hours integer DEFAULT 1,
  guest_count integer,
  special_requests text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
  total_price numeric(10,2),
  chef_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_chef_id ON public.bookings(chef_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_date ON public.bookings(booking_date);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- User can see own bookings
CREATE POLICY "bookings_select_user" ON public.bookings
  FOR SELECT USING (user_id = auth.uid());

-- Chef can see bookings for their profile
CREATE POLICY "bookings_select_chef" ON public.bookings
  FOR SELECT USING (
    chef_id IN (SELECT id FROM public.chef_profiles WHERE user_id = auth.uid())
  );

-- Admin can see all bookings
CREATE POLICY "bookings_select_admin" ON public.bookings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- User can create bookings
CREATE POLICY "bookings_insert_user" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Chef can update booking status on their bookings
CREATE POLICY "bookings_update_chef" ON public.bookings
  FOR UPDATE USING (
    chef_id IN (SELECT id FROM public.chef_profiles WHERE user_id = auth.uid())
  );

-- User can cancel own bookings
CREATE POLICY "bookings_update_user" ON public.bookings
  FOR UPDATE USING (user_id = auth.uid());

-- Admin can update any booking
CREATE POLICY "bookings_update_admin" ON public.bookings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Auto-update updated_at
CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
