import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { canEnterWorkspace } from "@/lib/auth-rules";
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({location}) => {
    const {data} = await supabase.auth.getUser();
    const demo = sessionStorage.getItem("luedal-demo") !== null;
    if(!canEnterWorkspace(data.user?.id ?? null,demo)) throw redirect({to:"/login"});
    if(data.user) {
      const {data:row,error} = await supabase.from("profiles").select("career_data").eq("id",data.user.id).maybeSingle();
      if(error) throw new Error("Não foi possível carregar seu perfil. Tente novamente.");
      const complete = row?.career_data && typeof row.career_data === "object" && !Array.isArray(row.career_data) && row.career_data['onboarded'] === true;
      if(!complete && location.pathname !== "/onboarding") throw redirect({to:"/onboarding"});
    }
  },
  component: () => <Outlet />,
});