import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { demoProfile, emptyProfile, type CareerData } from "./career";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { realProfile } from "./chat-rules";
type Store = {
  data: CareerData;
  demo: boolean;
  loading: boolean;
  userId: string | null;
  update: (data: CareerData) => Promise<boolean>;
  startDemo: () => void;
  startEmpty: () => void;
  logout: () => Promise<void>;
};
const Context = createContext<Store | null>(null);
export function CareerProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CareerData>(emptyProfile);
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  useEffect(() => {
    let alive = true;
    let version = 0;
    const load = async (id: string | null) => {
      if (!alive) return;
      const current = ++version;
      setLoading(true);
      setUserId(id);
      setData(emptyProfile());
      if (id) {
        setDemo(false);
        const { data: row, error } = await supabase
          .from("profiles")
          .select("career_data")
          .eq("id", id)
          .maybeSingle();
        if (!alive || current !== version) return;
        if (error) toast.error("Não foi possível carregar seu perfil.");
        setData(realProfile(row?.career_data));
      } else {
        const saved = sessionStorage.getItem("luedal-demo");
        setDemo(Boolean(saved));
        if (saved) {
          try {
            setData(realProfile(JSON.parse(saved)));
          } catch {
            setData(demoProfile());
          }
        }
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
    if (demo) {
      sessionStorage.setItem("luedal-demo", JSON.stringify(next));
      setData(next);
      return true;
    }
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
  function startDemo() {
    if (userId) { toast.info("Saia da sua conta para acessar a demonstração separada."); return; }
    setDemo(true);
    setData(demoProfile());
    sessionStorage.setItem("luedal-demo", JSON.stringify(demoProfile()));
  }
  function startEmpty() {
    if (userId) return;
    setDemo(true);
    setData(emptyProfile());
    sessionStorage.setItem("luedal-demo", JSON.stringify(emptyProfile()));
  }
  return (
    <Context.Provider
      value={{
        data,
        demo,
        loading,
        userId,
        update,
        startDemo,
        startEmpty,
        logout: async () => {
          await queryClient.cancelQueries();
          queryClient.clear();
          await supabase.auth.signOut();
          sessionStorage.removeItem("luedal-demo");
          sessionStorage.removeItem("luedal-recovery");
          setData(emptyProfile());
          setDemo(false);
          setUserId(null);
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
