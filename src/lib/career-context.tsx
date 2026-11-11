import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { demoProfile, emptyProfile, type CareerData } from "./career";
import { toast } from "sonner";
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
  const [data, setData] = useState<CareerData>(demoProfile);
  const [demo, setDemo] = useState(true);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    const load = async (id: string | null) => {
      if (!alive) return;
      setUserId(id);
      if (id) {
        setDemo(false);
        const { data: row, error } = await supabase
          .from("profiles")
          .select("career_data")
          .eq("id", id)
          .maybeSingle();
        if (!alive) return;
        if (error) toast.error("Não foi possível carregar seu perfil.");
        setData(row ? { ...emptyProfile(), ...(row.career_data as object) } : emptyProfile());
      } else {
        setDemo(true);
        const saved = sessionStorage.getItem("luedal-demo");
        if (saved) {
          try {
            setData(JSON.parse(saved));
          } catch {
            setData(demoProfile());
          }
        }
      }
      setLoading(false);
    };
    supabase.auth.getSession().then(({ data }) => load(data.session?.user.id ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      void load(session?.user.id ?? null);
    });
    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, []);
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
    setDemo(true);
    setData(demoProfile());
    sessionStorage.setItem("luedal-demo", JSON.stringify(demoProfile()));
  }
  function startEmpty() {
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
          await supabase.auth.signOut();
          sessionStorage.removeItem("luedal-demo");
          setData(demoProfile());
          setDemo(true);
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
