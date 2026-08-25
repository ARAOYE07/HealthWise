-- HealthWise Database Schema & Security Configurations

-- ==========================================
-- 1. EXTENSIONS & ENUMS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE safety_level AS ENUM ('LOW', 'MODERATE', 'URGENT', 'EMERGENCY');
CREATE TYPE assessment_status AS ENUM ('pending', 'processing', 'completed', 'flagged', 'error');
CREATE TYPE content_status AS ENUM ('draft', 'scheduled', 'published', 'archived');
CREATE TYPE admin_role AS ENUM ('moderator', 'content_manager', 'admin', 'super_admin');

-- ==========================================
-- 2. TABLES
-- ==========================================

-- PROFILES
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    age INTEGER CHECK (age > 0 AND age < 150),
    country TEXT,
    health_goals TEXT[],
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ADMIN ROLES
CREATE TABLE admin_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role admin_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- HEALTH ASSESSMENTS
CREATE TABLE health_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    concern TEXT NOT NULL,
    relevant_information JSONB DEFAULT '{}'::jsonb,
    status assessment_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- HEALTH ADVICE (AI OUTPUTS)
CREATE TABLE health_advice (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES health_assessments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    summary TEXT NOT NULL,
    educational_information TEXT NOT NULL,
    recommendations TEXT[] DEFAULT '{}',
    warning_signs TEXT[] DEFAULT '{}',
    safety_level safety_level NOT NULL,
    disclaimer TEXT NOT NULL DEFAULT 'This information is for educational purposes and does not replace professional medical advice.',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(assessment_id)
);

-- HEALTH TOPICS (CMS)
CREATE TABLE health_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    image_url TEXT,
    status content_status DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- HEALTH TIPS (CMS)
CREATE TABLE health_tips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status content_status DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SAVED TIPS
CREATE TABLE saved_tips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tip_id UUID REFERENCES health_tips(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, tip_id)
);

-- FEEDBACK
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    advice_id UUID REFERENCES health_advice(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    reviewed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, advice_id)
);

-- AUDIT LOGS
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI USAGE TRACKING (COST CONTROL)
CREATE TABLE ai_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    model TEXT NOT NULL,
    tokens INTEGER,
    prompt_category TEXT,
    estimated_cost NUMERIC(10, 6),
    success BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==========================================
-- 3. INDEXES FOR PERFORMANCE
-- ==========================================
CREATE INDEX idx_health_assessments_user_id ON health_assessments(user_id);
CREATE INDEX idx_health_assessments_created_at ON health_assessments(created_at DESC);
CREATE INDEX idx_health_advice_user_id ON health_advice(user_id);
CREATE INDEX idx_health_advice_safety_level ON health_advice(safety_level);
CREATE INDEX idx_health_tips_status ON health_tips(status, published_at DESC);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_admin_roles_user_id ON admin_roles(user_id);


-- ==========================================
-- 4. FUNCTIONS & TRIGGERS
-- ==========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessments_modtime BEFORE UPDATE ON health_assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_topics_modtime BEFORE UPDATE ON health_topics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tips_modtime BEFORE UPDATE ON health_tips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, created_at)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RBAC Helper Functions
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_roles WHERE admin_roles.user_id = $1 AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION has_role(user_id UUID, required_role admin_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_roles WHERE admin_roles.user_id = $1 AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Secure Audit Logging Function
CREATE OR REPLACE FUNCTION log_audit_event(
    p_admin_id UUID, p_action TEXT, p_target_type TEXT, p_target_id UUID, p_metadata JSONB
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO audit_logs (admin_user_id, action, target_type, target_id, metadata)
    VALUES (p_admin_id, p_action, p_target_type, p_target_id, p_metadata);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==========================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_advice ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

-- Profiles: Users see own, Admins see all
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin(auth.uid()));

-- Assessments: Users view/insert own, Admins view all
CREATE POLICY "Users can insert own assessments" ON health_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own assessments" ON health_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all assessments" ON health_assessments FOR SELECT USING (is_admin(auth.uid()));

-- Advice: Users view own, Admins view all
CREATE POLICY "Users can view own advice" ON health_advice FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all advice" ON health_advice FOR SELECT USING (is_admin(auth.uid()));

-- Topics & Tips: Public read (if published), Managers write
CREATE POLICY "Anyone can view published topics" ON health_topics FOR SELECT USING (status = 'published');
CREATE POLICY "Content managers can manage topics" ON health_topics FOR ALL USING (has_role(auth.uid(), 'content_manager') OR is_admin(auth.uid()));

CREATE POLICY "Anyone can view published tips" ON health_tips FOR SELECT USING (status = 'published');
CREATE POLICY "Content managers can manage tips" ON health_tips FOR ALL USING (has_role(auth.uid(), 'content_manager') OR is_admin(auth.uid()));

-- Saved Tips: Users manage own
CREATE POLICY "Users manage own saved tips" ON saved_tips FOR ALL USING (auth.uid() = user_id);

-- Feedback: Users insert/view own, Admins view all
CREATE POLICY "Users insert own feedback" ON feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users view own feedback" ON feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all feedback" ON feedback FOR SELECT USING (is_admin(auth.uid()));

-- Audit Logs: Only Super Admins can view. Inserts handled via Security Definer function.
CREATE POLICY "Super Admins view audit logs" ON audit_logs FOR SELECT USING (has_role(auth.uid(), 'super_admin'));

-- AI Usage: Admins view all
CREATE POLICY "Admins view AI usage" ON ai_usage FOR SELECT USING (is_admin(auth.uid()));
