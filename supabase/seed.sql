-- Seed Data for HealthWise

-- Insert some default health topics
INSERT INTO public.health_topics (id, title, description, category, status) VALUES
(uuid_generate_v4(), 'Nutrition & Hydration', 'Learn about balanced diets, macro-nutrients, and the importance of daily water intake.', 'Nutrition', 'published'),
(uuid_generate_v4(), 'Sleep Hygiene', 'Discover evidence-based practices to improve your sleep quality and circadian rhythm.', 'Sleep', 'published'),
(uuid_generate_v4(), 'Mental Wellness', 'Resources for managing stress, practicing mindfulness, and maintaining emotional health.', 'Mental Health', 'published'),
(uuid_generate_v4(), 'Heart Health', 'Preventive care, exercise recommendations, and dietary choices for cardiovascular longevity.', 'Preventive', 'published');

-- Insert some default health tips
INSERT INTO public.health_tips (id, title, content, category, status, published_at) VALUES
(uuid_generate_v4(), 'The 20-20-20 Rule', 'Every 20 minutes, look at something 20 feet away for at least 20 seconds to reduce eye strain.', 'General Wellness', 'published', NOW()),
(uuid_generate_v4(), 'Morning Sunlight', 'Getting 10-15 minutes of sunlight exposure within an hour of waking up helps regulate your circadian rhythm.', 'Sleep', 'published', NOW()),
(uuid_generate_v4(), 'Mindful Breathing', 'Practice 4-7-8 breathing: Inhale for 4 seconds, hold for 7, exhale for 8 to quickly reduce acute stress.', 'Mental Health', 'published', NOW());
