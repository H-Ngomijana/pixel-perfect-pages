import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function publicClient() {
  const key = process.env['SUPABASE_PUBLISHABLE_KEY']!;
  return createClient<Database>(process.env['SUPABASE_URL']!, key, { auth: { persistSession: false }, global: { fetch: (input, init) => { const headers = new Headers(init?.headers); if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization'); headers.set('apikey', key); return fetch(input, { ...init, headers }); } } });
}

export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  const db = publicClient();
  const [settings, plans, projects] = await Promise.all([
    db.from("site_settings").select("*").eq("id", "main").single(),
    db.from("service_plans").select("*").order("display_order"),
    db.from("portfolio_projects").select("*").order("display_order"),
  ]);
  if (settings.error || plans.error || projects.error) throw new Error("Website content is temporarily unavailable.");
  return { settings: settings.data, plans: plans.data, projects: projects.data };
});

const inquirySchema = z.object({ name:z.string().min(2).max(100), email:z.string().email().max(200), company:z.string().max(120).optional(), budget:z.string().min(1).max(60), timeline:z.string().min(1).max(60), brief:z.string().min(20).max(3000) });
export const submitInquiry = createServerFn({ method: "POST" }).inputValidator((input) => inquirySchema.parse(input)).handler(async ({ data }) => {
  const { error } = await publicClient().from("project_inquiries").insert(data);
  if (error) throw new Error("We could not submit your inquiry. Please try again.");
  return { ok: true };
});

export const getAdminContent = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data: role } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!role) throw new Error("Administrator access is required.");
  const [content, inquiries] = await Promise.all([getSiteContent(), context.supabase.from("project_inquiries").select("*").order("created_at", { ascending:false })]);
  if (inquiries.error) throw new Error(inquiries.error.message);
  return { ...content, inquiries: inquiries.data };
});

const planSchema = z.object({ id:z.string().uuid(), name:z.string().min(1).max(80), price:z.string().min(1).max(40), delivery_time:z.string().min(1).max(60), description:z.string().max(500), features:z.array(z.string().max(120)).max(10), featured:z.boolean() });
export const updatePlan = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input)=>planSchema.parse(input)).handler(async ({data,context})=>{
  const { error } = await context.supabase.from("service_plans").update({name:data.name,price:data.price,delivery_time:data.delivery_time,description:data.description,features:data.features,featured:data.featured}).eq("id",data.id);
  if (error) throw new Error(error.message); return {ok:true};
});

const settingsSchema = z.object({ headline:z.string().min(1).max(160), story:z.string().min(20).max(2000), email:z.string().email(), location:z.string().min(1).max(120), availability:z.string().min(1).max(100) });
export const updateSettings = createServerFn({ method:"POST" }).middleware([requireSupabaseAuth]).inputValidator((input)=>settingsSchema.parse(input)).handler(async ({data,context})=>{ const {error}=await context.supabase.from("site_settings").update(data).eq("id","main"); if(error) throw new Error(error.message); return {ok:true}; });