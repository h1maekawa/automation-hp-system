CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  template_id TEXT NOT NULL,
  category TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'gallery',
  site_analysis JSONB,
  shop_info JSONB,
  generated_content JSONB,
  rendered_html TEXT,
  deploy_url TEXT,
  slug TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[],
  preview_title TEXT,
  variables JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
