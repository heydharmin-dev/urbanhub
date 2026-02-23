-- Job postings by restaurants
CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurant_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  cuisine_type text NOT NULL,
  experience_required integer NOT NULL DEFAULT 0,
  location text NOT NULL,
  salary_amount numeric(10,2),
  salary_type text NOT NULL CHECK (salary_type IN ('monthly', 'hourly', 'fixed', 'negotiable')),
  job_type text NOT NULL CHECK (job_type IN ('full_time', 'part_time', 'event_based', 'contract')),
  working_hours text,
  chefs_needed integer NOT NULL DEFAULT 1,
  start_date date,
  duration text,
  kitchen_facilities text,
  benefits text,
  description text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'matched', 'filled', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_jobs_restaurant_id ON public.jobs(restaurant_id);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_cuisine_type ON public.jobs(cuisine_type);
CREATE INDEX idx_jobs_location ON public.jobs(location);
CREATE INDEX idx_jobs_job_type ON public.jobs(job_type);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Restaurant can see own jobs
CREATE POLICY "jobs_select_own" ON public.jobs
  FOR SELECT USING (
    restaurant_id IN (SELECT id FROM public.restaurant_profiles WHERE user_id = auth.uid())
  );

-- Restaurant can insert own jobs
CREATE POLICY "jobs_insert_own" ON public.jobs
  FOR INSERT WITH CHECK (
    restaurant_id IN (SELECT id FROM public.restaurant_profiles WHERE user_id = auth.uid())
  );

-- Restaurant can update own jobs (close/edit)
CREATE POLICY "jobs_update_own" ON public.jobs
  FOR UPDATE USING (
    restaurant_id IN (SELECT id FROM public.restaurant_profiles WHERE user_id = auth.uid())
  );

-- Admin can see all jobs
CREATE POLICY "jobs_select_admin" ON public.jobs
  FOR SELECT USING (public.is_admin());

-- Admin can update any job (status changes when matching)
CREATE POLICY "jobs_update_admin" ON public.jobs
  FOR UPDATE USING (public.is_admin());

-- Auto-update updated_at
CREATE TRIGGER jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
