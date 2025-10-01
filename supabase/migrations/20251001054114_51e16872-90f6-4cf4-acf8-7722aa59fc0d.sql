-- Create colleges table with seed data
CREATE TABLE IF NOT EXISTS public.colleges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  course TEXT NOT NULL,
  fee INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on colleges (public read access)
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read colleges
CREATE POLICY "Anyone can read colleges"
  ON public.colleges
  FOR SELECT
  USING (true);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  college_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "Anyone can read reviews"
  ON public.reviews
  FOR SELECT
  USING (true);

-- Users can insert their own reviews
CREATE POLICY "Users can insert own reviews"
  ON public.reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(college_id, user_id)
);

-- Enable RLS on favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Users can only see their own favorites
CREATE POLICY "Users can view own favorites"
  ON public.favorites
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own favorites
CREATE POLICY "Users can insert own favorites"
  ON public.favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete own favorites"
  ON public.favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- Insert seed data for colleges
INSERT INTO public.colleges (name, location, course, fee) VALUES
  ('ABC Engineering College', 'Hyderabad', 'Computer Science', 120000),
  ('XYZ Institute of Technology', 'Bangalore', 'Electronics', 100000),
  ('Sunrise Business School', 'Chennai', 'MBA', 150000),
  ('Greenfield Medical College', 'Hyderabad', 'MBBS', 250000),
  ('TechVista University', 'Bangalore', 'Computer Science', 180000),
  ('Bright Future Institute', 'Chennai', 'Electronics', 110000),
  ('Elite Management Academy', 'Hyderabad', 'MBA', 200000),
  ('Innovation Tech College', 'Bangalore', 'Computer Science', 140000);