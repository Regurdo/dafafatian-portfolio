-- ========================================================
-- SUPABASE SCHEMA FOR PORTFOLIO WEBSITE
-- ========================================================
-- Petunjuk:
-- 1. Buka Supabase Dashboard -> Project Anda -> SQL Editor
-- 2. Tempel seluruh kode di bawah ini lalu klik RUN
-- ========================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT NOT NULL,
  avatar_url TEXT,
  resume_url TEXT,
  email TEXT NOT NULL,
  github TEXT,
  linkedin TEXT,
  twitter TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  image_url TEXT,
  live_url TEXT,
  github_url TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'General',
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SKILLS TABLE
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency INTEGER DEFAULT 50 CHECK (proficiency >= 0 AND proficiency <= 100),
  icon TEXT,
  order_index INTEGER DEFAULT 0
);

-- 4. EXPERIENCES TABLE
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  description TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  type TEXT NOT NULL CHECK (type IN ('work', 'education')),
  order_index INTEGER DEFAULT 0
);

-- 5. MESSAGES TABLE (Contact Form Inbox)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ========================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public access profiles" ON profiles;
DROP POLICY IF EXISTS "Public access projects" ON projects;
DROP POLICY IF EXISTS "Public access skills" ON skills;
DROP POLICY IF EXISTS "Public access experiences" ON experiences;
DROP POLICY IF EXISTS "Public access messages" ON messages;
DROP POLICY IF EXISTS "Public read access" ON profiles;
DROP POLICY IF EXISTS "Public read access" ON projects;
DROP POLICY IF EXISTS "Public read access" ON skills;
DROP POLICY IF EXISTS "Public read access" ON experiences;
DROP POLICY IF EXISTS "Public insert access" ON messages;

-- Allow read & write for portfolio & admin dashboard operations
CREATE POLICY "Public access profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access skills" ON skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access experiences" ON experiences FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access messages" ON messages FOR ALL USING (true) WITH CHECK (true);

-- ========================================================
-- INDEXES
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(order_index);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_experiences_order ON experiences(order_index);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);

-- ========================================================
-- INITIAL SEED DATA (Opsional - otomatis dimasukkan jika tabel kosong)
-- ========================================================

-- Seed Profile
INSERT INTO profiles (name, title, bio, email, github, linkedin, twitter, location)
SELECT 
  'Dafa Fatian Akbar',
  'Creative Developer',
  'I craft digital experiences with clean code and cinematic design. Passionate about building beautiful, functional websites that leave a lasting impression.',
  'hello@dafa.dev',
  'https://github.com/dafa',
  'https://linkedin.com/in/dafa',
  'https://twitter.com/dafa',
  'Indonesia'
WHERE NOT EXISTS (SELECT 1 FROM profiles LIMIT 1);

-- Seed Projects
INSERT INTO projects (title, description, category, tech_stack, featured, order_index)
SELECT 'E-Commerce Platform', 'A full-stack e-commerce solution with real-time inventory management and seamless payment integration.', 'Full Stack', ARRAY['Next.js', 'TypeScript', 'Supabase', 'Stripe', 'Tailwind CSS'], true, 0
WHERE NOT EXISTS (SELECT 1 FROM projects LIMIT 1);

INSERT INTO projects (title, description, category, tech_stack, featured, order_index)
SELECT 'AI Content Studio', 'An AI-powered content creation platform with real-time collaboration features.', 'AI/ML', ARRAY['React', 'Python', 'OpenAI', 'WebSocket', 'PostgreSQL'], true, 1
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'AI Content Studio');

INSERT INTO projects (title, description, category, tech_stack, featured, order_index)
SELECT 'Social Analytics Dashboard', 'Real-time social media analytics with beautiful data visualizations and reporting.', 'Data Viz', ARRAY['Next.js', 'D3.js', 'Node.js', 'Redis', 'MongoDB'], true, 2
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Social Analytics Dashboard');

INSERT INTO projects (title, description, category, tech_stack, featured, order_index)
SELECT 'Task Management App', 'A minimal yet powerful task management application with drag-and-drop Kanban boards.', 'Productivity', ARRAY['React', 'TypeScript', 'Firebase', 'Tailwind CSS'], false, 3
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Task Management App');

-- Seed Skills
INSERT INTO skills (name, category, proficiency, order_index)
SELECT 'React / Next.js', 'Frontend', 95, 0 WHERE NOT EXISTS (SELECT 1 FROM skills LIMIT 1);
INSERT INTO skills (name, category, proficiency, order_index)
SELECT 'TypeScript', 'Frontend', 90, 1 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'TypeScript');
INSERT INTO skills (name, category, proficiency, order_index)
SELECT 'Tailwind CSS', 'Frontend', 92, 2 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Tailwind CSS');
INSERT INTO skills (name, category, proficiency, order_index)
SELECT 'Framer Motion', 'Frontend', 85, 3 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Framer Motion');
INSERT INTO skills (name, category, proficiency, order_index)
SELECT 'Node.js', 'Backend', 88, 4 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Node.js');
INSERT INTO skills (name, category, proficiency, order_index)
SELECT 'PostgreSQL', 'Backend', 82, 5 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'PostgreSQL');
INSERT INTO skills (name, category, proficiency, order_index)
SELECT 'Supabase', 'Backend', 87, 6 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Supabase');
INSERT INTO skills (name, category, proficiency, order_index)
SELECT 'Python', 'Backend', 80, 7 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Python');
INSERT INTO skills (name, category, proficiency, order_index)
SELECT 'Docker', 'DevOps', 75, 8 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Docker');
INSERT INTO skills (name, category, proficiency, order_index)
SELECT 'Git', 'DevOps', 90, 9 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Git');
INSERT INTO skills (name, category, proficiency, order_index)
SELECT 'Figma', 'Design', 78, 10 WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Figma');

-- Seed Experiences
INSERT INTO experiences (title, company, location, description, start_date, is_current, type, order_index)
SELECT 'Senior Frontend Developer', 'Tech Startup Co.', 'Jakarta, Indonesia', 'Led the frontend team in building a modern SaaS platform. Implemented complex UI components, optimized performance, and mentored junior developers.', '2023-01-01', true, 'work', 0
WHERE NOT EXISTS (SELECT 1 FROM experiences LIMIT 1);

INSERT INTO experiences (title, company, location, description, start_date, end_date, is_current, type, order_index)
SELECT 'Fullstack Developer', 'Digital Agency', 'Bandung, Indonesia', 'Built responsive web applications for various clients. Worked with React, Node.js, and PostgreSQL to deliver high-quality solutions.', '2021-06-01', '2022-12-31', false, 'work', 1
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE company = 'Digital Agency');

INSERT INTO experiences (title, company, location, description, start_date, end_date, is_current, type, order_index)
SELECT 'Computer Science', 'University of Indonesia', 'Indonesia', 'Bachelor of Computer Science with focus on software engineering and web technologies.', '2017-09-01', '2021-06-30', false, 'education', 2
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE company = 'University of Indonesia');
