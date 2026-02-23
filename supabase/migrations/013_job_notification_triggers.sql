-- Notification trigger for job assignment events
CREATE OR REPLACE FUNCTION public.handle_job_assignment_notification()
RETURNS trigger AS $$
DECLARE
  chef_user_id uuid;
  chef_name text;
  job_title text;
  restaurant_name text;
  restaurant_user_id uuid;
BEGIN
  -- Get the chef's user_id and name
  SELECT cp.user_id, p.full_name
  INTO chef_user_id, chef_name
  FROM public.chef_profiles cp
  JOIN public.profiles p ON p.id = cp.user_id
  WHERE cp.id = NEW.chef_id;

  -- Get job title and restaurant info
  SELECT j.title, rp.business_name, rp.user_id
  INTO job_title, restaurant_name, restaurant_user_id
  FROM public.jobs j
  JOIN public.restaurant_profiles rp ON rp.id = j.restaurant_id
  WHERE j.id = NEW.job_id;

  IF TG_OP = 'INSERT' THEN
    -- Notify chef of new assignment
    INSERT INTO public.notifications (user_id, title, message, type, reference_id)
    VALUES (
      chef_user_id,
      'New Job Assignment',
      'You have been assigned to "' || job_title || '" at ' || restaurant_name || '. Please review and respond.',
      'job_assigned',
      NEW.id
    );

  ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    IF NEW.status = 'accepted' THEN
      -- Notify restaurant that chef accepted
      INSERT INTO public.notifications (user_id, title, message, type, reference_id)
      VALUES (
        restaurant_user_id,
        'Chef Accepted Job',
        chef_name || ' has accepted the position for "' || job_title || '"!',
        'assignment_accepted',
        NEW.id
      );
    ELSIF NEW.status = 'declined' THEN
      -- Notify restaurant that chef declined
      INSERT INTO public.notifications (user_id, title, message, type, reference_id)
      VALUES (
        restaurant_user_id,
        'Chef Declined Job',
        chef_name || ' has declined the position for "' || job_title || '". Admin will find another match.',
        'assignment_declined',
        NEW.id
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_job_assignment_change
  AFTER INSERT OR UPDATE ON public.job_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_job_assignment_notification();

-- Notification trigger for new job postings (notify admin)
CREATE OR REPLACE FUNCTION public.handle_new_job_notification()
RETURNS trigger AS $$
DECLARE
  restaurant_name text;
  admin_record RECORD;
BEGIN
  -- Get restaurant name
  SELECT rp.business_name INTO restaurant_name
  FROM public.restaurant_profiles rp
  WHERE rp.id = NEW.restaurant_id;

  -- Notify all admins
  FOR admin_record IN
    SELECT id FROM public.profiles WHERE role = 'admin'
  LOOP
    INSERT INTO public.notifications (user_id, title, message, type, reference_id)
    VALUES (
      admin_record.id,
      'New Job Posted',
      restaurant_name || ' posted a new job: "' || NEW.title || '". Please review and match a chef.',
      'job_posted',
      NEW.id
    );
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_new_job_posted
  AFTER INSERT ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_job_notification();

-- Notification trigger for job status changes (notify restaurant)
CREATE OR REPLACE FUNCTION public.handle_job_status_notification()
RETURNS trigger AS $$
DECLARE
  restaurant_user_id uuid;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Get restaurant owner
    SELECT rp.user_id INTO restaurant_user_id
    FROM public.restaurant_profiles rp
    WHERE rp.id = NEW.restaurant_id;

    IF NEW.status = 'matched' THEN
      INSERT INTO public.notifications (user_id, title, message, type, reference_id)
      VALUES (
        restaurant_user_id,
        'Chef Matched to Your Job',
        'A chef has been assigned to your job "' || NEW.title || '". Waiting for chef confirmation.',
        'job_matched',
        NEW.id
      );
    ELSIF NEW.status = 'filled' THEN
      INSERT INTO public.notifications (user_id, title, message, type, reference_id)
      VALUES (
        restaurant_user_id,
        'Job Position Filled',
        'Your job "' || NEW.title || '" has been filled!',
        'job_filled',
        NEW.id
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_job_status_change
  AFTER UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_job_status_notification();
