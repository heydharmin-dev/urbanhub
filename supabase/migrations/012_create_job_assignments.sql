-- Job assignments (admin assigns chef to a job)
CREATE TABLE public.job_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  chef_id uuid NOT NULL REFERENCES public.chef_profiles(id) ON DELETE CASCADE,
  assigned_by uuid NOT NULL REFERENCES public.profiles(id),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')),
  admin_notes text,
  chef_response_notes text,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  responded_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(job_id, chef_id)
);

CREATE INDEX idx_job_assignments_job_id ON public.job_assignments(job_id);
CREATE INDEX idx_job_assignments_chef_id ON public.job_assignments(chef_id);
CREATE INDEX idx_job_assignments_status ON public.job_assignments(status);

-- Enable RLS
ALTER TABLE public.job_assignments ENABLE ROW LEVEL SECURITY;

-- Chef can see own assignments
CREATE POLICY "assignments_select_chef" ON public.job_assignments
  FOR SELECT USING (
    chef_id IN (SELECT id FROM public.chef_profiles WHERE user_id = auth.uid())
  );

-- Chef can update own assignments (accept/decline)
CREATE POLICY "assignments_update_chef" ON public.job_assignments
  FOR UPDATE USING (
    chef_id IN (SELECT id FROM public.chef_profiles WHERE user_id = auth.uid())
  );

-- Restaurant can see assignments for their jobs
CREATE POLICY "assignments_select_restaurant" ON public.job_assignments
  FOR SELECT USING (
    job_id IN (
      SELECT j.id FROM public.jobs j
      JOIN public.restaurant_profiles rp ON rp.id = j.restaurant_id
      WHERE rp.user_id = auth.uid()
    )
  );

-- Admin can do everything
CREATE POLICY "assignments_select_admin" ON public.job_assignments
  FOR SELECT USING (public.is_admin());

CREATE POLICY "assignments_insert_admin" ON public.job_assignments
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "assignments_update_admin" ON public.job_assignments
  FOR UPDATE USING (public.is_admin());

-- Auto-update updated_at
CREATE TRIGGER job_assignments_updated_at
  BEFORE UPDATE ON public.job_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
