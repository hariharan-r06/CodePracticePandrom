-- PROFILES TABLE (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  avatar_url TEXT,
  streak INTEGER DEFAULT 0,
  last_active DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PATTERNS TABLE
CREATE TABLE patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROBLEMS TABLE
CREATE TABLE problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_id UUID NOT NULL REFERENCES patterns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  problem_url TEXT NOT NULL,
  reference_video_url TEXT,
  solution_video_url TEXT,
  platform TEXT NOT NULL CHECK (platform IN ('leetcode', 'geeksforgeeks', 'other')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SUBMISSIONS TABLE
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  screenshot_url TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  feedback TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS TABLE
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('new_problem', 'new_pattern', 'submission_approved', 'submission_rejected', 'new_submission')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  for_role TEXT NOT NULL CHECK (for_role IN ('student', 'admin', 'all')),
  for_user_id UUID REFERENCES profiles(id), -- NULL means broadcast to role
  is_read BOOLEAN DEFAULT FALSE,
  meta JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES

-- Profiles: users can read all, update only their own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Patterns: everyone authenticated can read, only admins write
ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view patterns" ON patterns FOR SELECT USING (true);
CREATE POLICY "Admins can insert patterns" ON patterns FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update patterns" ON patterns FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete patterns" ON patterns FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Problems: same as patterns
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view problems" ON problems FOR SELECT USING (true);
CREATE POLICY "Admins can manage problems" ON problems FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Submissions: students see own, admins see all
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students view own submissions" ON submissions FOR SELECT USING (
  student_id = auth.uid() OR
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "Students can submit" ON submissions FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Admins can update submissions" ON submissions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Notifications: users see their own or broadcasts for their role
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own notifications" ON notifications FOR SELECT USING (
  for_user_id = auth.uid() OR
  for_user_id IS NULL
);
CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (
  for_user_id = auth.uid() OR for_user_id IS NULL
);

-- STORAGE BUCKET
-- Run these in your Supabase storage settings or SQL if extensions enabled
-- INSERT INTO storage.buckets (id, name, public) VALUES ('submissions', 'submissions', true);
-- CREATE POLICY "Anyone can view submission screenshots" ON storage.objects FOR SELECT USING (bucket_id = 'submissions');
-- CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'submissions' AND auth.role() = 'authenticated');
-- CREATE POLICY "Admins can delete uploads" ON storage.objects FOR DELETE USING (bucket_id = 'submissions');
