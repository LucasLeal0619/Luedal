import { supabase } from "@/integrations/supabase/client";
export async function loadCareerCatalog() {
  const [areas, goals, skills] = await Promise.all([
    supabase.from("career_areas").select("*").order("sort_order"),
    supabase.from("career_goals").select("*"),
    supabase.from("career_skills").select("*"),
  ]);
  if (areas.error || goals.error || skills.error) throw new Error("Não foi possível carregar o catálogo de carreiras.");
  return { areas: areas.data ?? [], goals: goals.data ?? [], skills: skills.data ?? [] };
}