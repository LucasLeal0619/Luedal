import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Download } from "lucide-react";
import { Shell, PageHeading, ThemeControl } from "@/components/luedal-shell";
import { useCareer } from "@/lib/career-context";
import { meta } from "@/lib/career";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/_authenticated/configuracoes")({
  head: () =>
    meta("Configurações", "Preferências, aparência e controle sobre seu perfil profissional."),
  component: Settings,
});
function Settings() {
  const { data, logout } = useCareer();
  const nav = useNavigate();
  return (
    <Shell title="Configurações">
      <main className="page">
        <PageHeading title="Do seu jeito" description="Preferências e controle sobre seus dados." />
        <section className="panel panel-pad">
          <div className="settings-row">
            <div>
              <h3>Aparência</h3>
              <p>Escolha o tema do seu espaço.</p>
            </div>
            <ThemeControl />
          </div>
          <div className="settings-row">
            <div>
              <h3>Meus dados</h3>
              <p>Exporte seu perfil, competências e evidências.</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                const url = URL.createObjectURL(
                  new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
                );
                const a = document.createElement("a");
                a.href = url;
                a.download = "luedal-meu-perfil.json";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download />
              Exportar
            </Button>
          </div>
            <div className="settings-row">
              <div>
                <h3>Sua conta</h3>
                <p>Perfil privado salvo com Lovable Cloud.</p>
              </div>
              <Button
                variant="outline"
                onClick={async () => {
                  await logout();
                  await nav({ to: "/login", replace: true });
                }}
              >
                <LogOut />
                Sair
              </Button>
            </div>
          <div className="settings-row">
            <div>
              <h3>Privacidade e termos</h3>
              <p>Informações sobre o beta e o tratamento de dados.</p>
            </div>
            <div className="flex gap-4 text-xs text-primary">
              <Link to="/privacidade">Privacidade</Link>
              <Link to="/termos">Termos</Link>
            </div>
          </div>
        </section>
      </main>
    </Shell>
  );
}
