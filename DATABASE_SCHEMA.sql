-- Kantor AI Virtual - Supabase Schema
-- Copy-paste ke Supabase SQL Editor

-- 1. Staff Profiles Table
CREATE TABLE staff_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_key VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  emoji VARCHAR(10),
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  position VARCHAR(100),
  department VARCHAR(100),
  join_date TIMESTAMP DEFAULT NOW(),
  total_score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Activities Table (Real-time)
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_key VARCHAR(50) NOT NULL REFERENCES staff_profiles(role_key) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  title VARCHAR(200),
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Performance Scores (Daily)
CREATE TABLE performance_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_key VARCHAR(50) NOT NULL REFERENCES staff_profiles(role_key) ON DELETE CASCADE,
  date DATE NOT NULL,
  leads_found INTEGER DEFAULT 0,
  drafts_created INTEGER DEFAULT 0,
  approved INTEGER DEFAULT 0,
  deals_closed INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(staff_key, date)
);

-- 4. Telegram Webhook Logs
CREATE TABLE telegram_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id BIGINT,
  user_name VARCHAR(100),
  message TEXT,
  action VARCHAR(50),
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Real-time
ALTER PUBLICATION supabase_realtime ADD TABLE activities;
ALTER PUBLICATION supabase_realtime ADD TABLE performance_scores;

-- Insert Sample Data
INSERT INTO staff_profiles (role_key, name, emoji, email, phone, position, department) VALUES
('fathi', 'FATHI', '🔍', 'fathi@kantor.ai', '+62-812-1234567', 'Lead Researcher', 'Research'),
('qela', 'QELA', '💬', 'qela@kantor.ai', '+62-812-2345678', 'Content Manager', 'Reply/Content'),
('angel', 'ANGEL', '📥', 'angel@kantor.ai', '+62-812-3456789', 'Sales Lead', 'Sales'),
('cindy', 'CINDY', '📱', 'cindy@kantor.ai', '+62-812-4567890', 'Account Manager', 'Sales'),
('faza', 'FAZA', '✍️', 'faza@kantor.ai', '+62-812-5678901', 'Content Creator', 'Reply/Content'),
('nana', 'NANA', '🧑‍💼', 'nana@kantor.ai', '+62-812-6789012', 'Operations Manager', 'Management'),
('cika', 'CIKA', '📊', 'cika@kantor.ai', '+62-812-7890123', 'Data Analyst', 'Research'),
('salam', 'SALAM', '👑', 'salam@kantor.ai', '+62-812-8901234', 'CEO', 'Management');

-- RLS Policies (Public read for MVP)
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read staff_profiles" ON staff_profiles FOR SELECT USING (true);
CREATE POLICY "Public read activities" ON activities FOR SELECT USING (true);
CREATE POLICY "Public read performance_scores" ON performance_scores FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX idx_activities_actor ON activities(actor_key);
CREATE INDEX idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX idx_performance_date ON performance_scores(date DESC);
