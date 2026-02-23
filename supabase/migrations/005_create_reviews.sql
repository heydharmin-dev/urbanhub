-- Create reviews table
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL UNIQUE REFERENCES public.bookings(id),
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  chef_id uuid NOT NULL REFERENCES public.chef_profiles(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_reviews_chef_id ON public.reviews(chef_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "reviews_select_all" ON public.reviews
  FOR SELECT USING (true);

-- User can insert review for their completed booking
CREATE POLICY "reviews_insert_user" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update chef avg_rating when a review is added
CREATE OR REPLACE FUNCTION public.update_chef_rating()
RETURNS trigger AS $$
BEGIN
  UPDATE public.chef_profiles
  SET
    avg_rating = (SELECT AVG(rating)::numeric(3,2) FROM public.reviews WHERE chef_id = NEW.chef_id),
    total_reviews = (SELECT COUNT(*) FROM public.reviews WHERE chef_id = NEW.chef_id)
  WHERE id = NEW.chef_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_created
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_chef_rating();
