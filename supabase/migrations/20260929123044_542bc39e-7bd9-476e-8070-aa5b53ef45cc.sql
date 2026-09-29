CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

ALTER POLICY "Admins create site settings" ON public.site_settings WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "Admins update site settings" ON public.site_settings USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "Admins delete site settings" ON public.site_settings USING (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "Admins create service plans" ON public.service_plans WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "Admins update service plans" ON public.service_plans USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "Admins delete service plans" ON public.service_plans USING (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "Admins create portfolio projects" ON public.portfolio_projects WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "Admins update portfolio projects" ON public.portfolio_projects USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "Admins delete portfolio projects" ON public.portfolio_projects USING (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "Admins view project inquiries" ON public.project_inquiries USING (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "Admins update project inquiries" ON public.project_inquiries USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "Admins delete project inquiries" ON public.project_inquiries USING (private.has_role(auth.uid(), 'admin'));

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated, service_role;
DROP FUNCTION public.has_role(uuid, public.app_role);