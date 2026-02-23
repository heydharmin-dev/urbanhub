-- Notification trigger for booking events
CREATE OR REPLACE FUNCTION public.handle_booking_notification()
RETURNS trigger AS $$
DECLARE
  chef_user_id uuid;
  customer_name text;
  chef_name text;
BEGIN
  -- Get the chef's user_id
  SELECT user_id INTO chef_user_id FROM public.chef_profiles WHERE id = NEW.chef_id;

  -- Get customer name
  SELECT full_name INTO customer_name FROM public.profiles WHERE id = NEW.user_id;

  -- Get chef name
  SELECT full_name INTO chef_name FROM public.profiles WHERE id = chef_user_id;

  IF TG_OP = 'INSERT' THEN
    -- Notify chef of new booking request
    INSERT INTO public.notifications (user_id, title, message, type, reference_id)
    VALUES (
      chef_user_id,
      'New Booking Request',
      customer_name || ' wants to book you for ' || NEW.event_type || ' on ' || NEW.booking_date,
      'booking_request',
      NEW.id
    );
  ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    IF NEW.status = 'accepted' THEN
      INSERT INTO public.notifications (user_id, title, message, type, reference_id)
      VALUES (
        NEW.user_id,
        'Booking Accepted',
        chef_name || ' accepted your booking for ' || NEW.booking_date || '!',
        'booking_accepted',
        NEW.id
      );
    ELSIF NEW.status = 'rejected' THEN
      INSERT INTO public.notifications (user_id, title, message, type, reference_id)
      VALUES (
        NEW.user_id,
        'Booking Declined',
        chef_name || ' declined your booking for ' || NEW.booking_date || '.',
        'booking_rejected',
        NEW.id
      );
    ELSIF NEW.status = 'cancelled' THEN
      INSERT INTO public.notifications (user_id, title, message, type, reference_id)
      VALUES (
        chef_user_id,
        'Booking Cancelled',
        customer_name || ' cancelled the booking for ' || NEW.booking_date || '.',
        'booking_cancelled',
        NEW.id
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_booking_change
  AFTER INSERT OR UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_booking_notification();

-- Notification trigger for chef verification status changes
CREATE OR REPLACE FUNCTION public.handle_chef_status_notification()
RETURNS trigger AS $$
BEGIN
  IF OLD.verification_status IS DISTINCT FROM NEW.verification_status THEN
    IF NEW.verification_status = 'approved' THEN
      INSERT INTO public.notifications (user_id, title, message, type, reference_id)
      VALUES (
        NEW.user_id,
        'Profile Approved!',
        'Your chef profile has been verified. You are now visible to customers.',
        'chef_approved',
        NEW.id
      );
    ELSIF NEW.verification_status = 'rejected' THEN
      INSERT INTO public.notifications (user_id, title, message, type, reference_id)
      VALUES (
        NEW.user_id,
        'Profile Not Approved',
        'Your chef profile was not approved. ' || COALESCE('Reason: ' || NEW.admin_notes, 'Please contact support for details.'),
        'chef_rejected',
        NEW.id
      );
    ELSIF NEW.verification_status = 'suspended' THEN
      INSERT INTO public.notifications (user_id, title, message, type, reference_id)
      VALUES (
        NEW.user_id,
        'Profile Suspended',
        'Your chef profile has been suspended. Please contact support.',
        'chef_suspended',
        NEW.id
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_chef_status_change
  AFTER UPDATE ON public.chef_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_chef_status_notification();
