-- RUN THIS IN SUPABASE SQL EDITOR to ensure the schema is complete

-- Add missing cancel_at_period_end column to subscriptions
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS cancel_at_period_end boolean DEFAULT false;

-- Ensure charities table has some seed data for development
INSERT INTO public.charities (name, slug, description, category, is_featured, total_raised)
VALUES 
  ('The Fairway Foundation', 'fairway-foundation', 'Providing access to golf programmes for underprivileged youth across the UK.', 'Youth', true, 42800),
  ('Royal Marsden Cancer Charity', 'royal-marsden', 'Supporting world-class cancer research and treatment.', 'Health', false, 31200),
  ('Childhood Sports Education Trust', 'cset', 'Delivering physical education programmes to primary schools in deprived areas.', 'Education', false, 18500),
  ('Community Links', 'community-links', 'Building stronger communities through local grassroots initiatives.', 'Community', false, 12700),
  ('Green Fairways Environment Trust', 'green-fairways', 'Protecting and restoring natural habitats associated with golf courses.', 'Environment', false, 9300),
  ('Veterans Golf Alliance', 'veterans-golf', 'Using golf as a therapeutic tool for military veterans.', 'Community', false, 7100)
ON CONFLICT (slug) DO NOTHING;
