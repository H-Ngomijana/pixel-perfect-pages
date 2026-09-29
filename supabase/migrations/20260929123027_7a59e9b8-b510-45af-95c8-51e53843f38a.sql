CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  display_name text NOT NULL DEFAULT '',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users create own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

CREATE TABLE public.site_settings (
  id text PRIMARY KEY DEFAULT 'main',
  company_name text NOT NULL DEFAULT 'JH Digitals',
  headline text NOT NULL DEFAULT 'Digital products engineered for growth.',
  story text NOT NULL DEFAULT 'We are a Kigali-based digital studio combining strategy, product design, and full-stack engineering to build useful, enduring digital experiences.',
  email text NOT NULL DEFAULT 'jhdigitals1@gmail.com',
  location text NOT NULL DEFAULT 'Kigali, Rwanda · Worldwide',
  availability text NOT NULL DEFAULT 'Available for new projects',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone views site settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins create site settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update site settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete site settings" ON public.site_settings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.service_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price text NOT NULL,
  delivery_time text NOT NULL,
  description text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.service_plans TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.service_plans TO authenticated;
GRANT ALL ON public.service_plans TO service_role;
ALTER TABLE public.service_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone views service plans" ON public.service_plans FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins create service plans" ON public.service_plans FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update service plans" ON public.service_plans FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete service plans" ON public.service_plans FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  summary text NOT NULL,
  website_url text,
  technologies text[] NOT NULL DEFAULT '{}',
  display_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.portfolio_projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.portfolio_projects TO authenticated;
GRANT ALL ON public.portfolio_projects TO service_role;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone views portfolio projects" ON public.portfolio_projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins create portfolio projects" ON public.portfolio_projects FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update portfolio projects" ON public.portfolio_projects FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete portfolio projects" ON public.portfolio_projects FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.project_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  budget text NOT NULL,
  timeline text NOT NULL,
  brief text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'contacted', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.project_inquiries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.project_inquiries TO authenticated;
GRANT ALL ON public.project_inquiries TO service_role;
ALTER TABLE public.project_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors submit project inquiries" ON public.project_inquiries FOR INSERT TO anon, authenticated WITH CHECK (status = 'new');
CREATE POLICY "Admins view project inquiries" ON public.project_inquiries FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update project inquiries" ON public.project_inquiries FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete project inquiries" ON public.project_inquiries FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER service_plans_updated_at BEFORE UPDATE ON public.service_plans FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER portfolio_projects_updated_at BEFORE UPDATE ON public.portfolio_projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER project_inquiries_updated_at BEFORE UPDATE ON public.project_inquiries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_settings (id) VALUES ('main');
INSERT INTO public.service_plans (name, price, delivery_time, description, features, featured, display_order) VALUES
('Launch', '$4.8k', '2–4 weeks', 'A focused sprint for a polished, production-ready first release.', ARRAY['Focused product strategy','High-fidelity design','Production-ready build'], false, 1),
('Scale', '$9.5k', '5–8 weeks', 'An end-to-end product partnership built for ambitious launches.', ARRAY['End-to-end product team','Advanced integrations','Analytics and optimisation'], true, 2),
('Partner', 'Custom', 'Ongoing', 'Dedicated design and engineering capacity for continuous growth.', ARRAY['Dedicated monthly capacity','Priority delivery','Continuous product growth'], false, 3);
INSERT INTO public.portfolio_projects (name, category, summary, website_url, technologies, display_order) VALUES
('Cyusa Jason', 'Portfolio · Software Engineering', 'A focused personal portfolio presenting full-stack development, cybersecurity, and practical digital products.', 'https://cyusajason.netlify.app/', ARRAY['React','Engineering','Security'], 1),
('Hugues Blessy', 'Portfolio · Creative Development', 'An editorial developer portfolio balancing personal identity, modern engineering, and carefully paced interaction.', 'https://huguesblessy.netlify.app/', ARRAY['Web','Creative Direction','Motion'], 2);