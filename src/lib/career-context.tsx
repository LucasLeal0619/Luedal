import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { emptyProfile, type CareerData } from "./career";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { realProfile } from "./chat-rules";
import { signOutAccount } from "./sign-out";
import { emptyCatalog, type CareerCatalog } from "./career-catalog";
import { loadCareerCatalog } from "./catalog-persistence";
type Store = {
  catalog: CareerCatalog;
  data: CareerData;
  demo: boolean;
  loading: boolean;
  userId: string | null;
  update: (data: CareerData) => Promise<boolean>;
  logout: () => Promise<void>;
};
const Context = createContext<Store | null>(null);
export function CareerProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CareerData>(emptyProfile);
  const [catalog, setCatalog] = useState<CareerCatalog>(emptyCatalog);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  useEffect(() => {
    sessionStorage.removeItem("luedal-demo");
    let alive = true;
    let version = 0;
    const load = async (id: string | null) => {
      if (!alive) return;
      const current = ++version;
      setLoading(true);
      setUserId(id);
      setData(emptyProfile());
      setCatalog(emptyCatalog);
      if (id) {
        const { data: row, error } = await supabase
          .from("profiles")
          .select("career_data")
          .eq("id", id)
          .maybeSingle();
        if (!alive || current !== version) return;
        if (error) toast.error("Não foi possível carregar seu perfil.");
        setData(realProfile(row?.career_data));
        try {
          const nextCatalog = await loadCareerCatalog();
          if (!alive || current !== version) return;
          setCatalog(nextCatalog);
        } catch { toast.error("Não foi possível carregar as opções de carreira. Tente atualizar a página."); }
      }
      setLoading(false);
    };
    supabase.auth.getUser().then(({ data }) => load(data.user?.id ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if(event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED" && event !== "PASSWORD_RECOVERY") return;
      if(event === "PASSWORD_RECOVERY") sessionStorage.setItem("luedal-recovery",session?.user.id ?? "");
      queueMicrotask(async () => {
        await load(session?.user.id ?? null);
        if(event !== "PASSWORD_RECOVERY") void router.invalidate();
        if(event !== "SIGNED_OUT") void queryClient.invalidateQueries();
      });
    });
    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, [queryClient,router]);
  async function update(next: CareerData) {
    if (!userId) return false;
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        career_data: JSON.parse(JSON.stringify(next)),
        updated_at: new Date().toISOString(),
      });
    if (error) {
      toast.error("Não foi possível salvar. Tente novamente.");
      return false;
    }
    setData(next);
    return true;
  }
  return (
    <Context.Provider
      value={{
        catalog,
        data,
        demo: false,
        loading,
        userId,
        update,
        logout: async () => {
          try {
            await signOutAccount({
              cancelQueries: () => queryClient.cancelQueries(),
              clearQueries: () => queryClient.clear(),
              endSession: () => supabase.auth.signOut({ scope: "local" }),
              clearProfile: () => {
                sessionStorage.removeItem("luedal-demo");
                sessionStorage.removeItem("luedal-recovery");
                setData(emptyProfile());
                setCatalog(emptyCatalog);
                setUserId(null);
              },
              goToLogin: () => router.navigate({ to: "/login", replace: true }),
            });
          } catch {
            toast.error("Não foi possível sair. Verifique sua conexão e tente novamente.");
          }
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useCareer() {
  const value = useContext(Context);
  if (!value) throw new Error("CareerProvider required");
  return value;
}
