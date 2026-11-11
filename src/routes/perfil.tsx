import { createFileRoute, Link } from "@tanstack/react-router";
import { Save, ArrowRight, Target } from "lucide-react";
import { useState } from "react";
import { Shell, PageHeading } from "@/components/luedal-shell";
import { Button } from "@/components/ui/button";
import { useCareer } from "@/lib/career-context";
import { analyze, meta } from "@/lib/career";
import { toast } from "sonner";
export const Route = createFileRoute("/perfil")({
  head: () =>
    meta("Perfil profissional", "Seu objetivo, sua experiência e suas preferências de evolução."),
  component: Profile,
});
const situations = [
  "Estudante de tecnologia",
  "Em busca da primeira oportunidade",
  "Desenvolvedor em início de carreira",
  "Profissional experiente",
  "Em transição de carreira",
];
function Profile() {
  const { data, update } = useCareer();
  const [name, setName] = useState(data.name);
  const [situation, setSituation] = useState(data.situation);
  const [learning, setLearning] = useState(data.learning);
  const [busy, setBusy] = useState(false);
  const a = analyze(data);
  return (
    <Shell title="Perfil profissional">
      <main className="page">
        <PageHeading
          title="Seu ponto de partida"
          description="Sua história, seus objetivos e o jeito que você prefere aprender."
        />
        <div className="grid-2">
          <form
            className="panel panel-pad"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              if (await update({ ...data, name, situation, learning }))
                toast.success("Perfil salvo. Sua rota foi recalculada.");
              setBusy(false);
            }}
          >
            <h2 className="panel-title mb-6">Informações profissionais</h2>
            <div className="form-field">
              <label htmlFor="profile-name">Como prefere ser chamado?</label>
              <input
                id="profile-name"
                required
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="profile-situation">Momento profissional</label>
              <select
                id="profile-situation"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
              >
                {situations.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="profile-learning">Preferência de aprendizado</label>
              <select
                id="profile-learning"
                value={learning}
                onChange={(e) => setLearning(e.target.value)}
              >
                {[
                  "Projetos práticos",
                  "Documentação e leitura",
                  "Vídeos e cursos",
                  "Aprendizado em grupo",
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <Button disabled={busy}>
              <Save />
              {busy ? "Salvando…" : "Salvar alterações"}
            </Button>
          </form>
          <div>
            <section className="panel panel-pad">
              <h2 className="panel-title">
                <Target className="text-primary" size={18} />
                Meu objetivo
              </h2>
              <h3 className="text-xl font-semibold mt-5">{data.goal}</h3>
              <p className="muted text-xs mt-3 leading-7">
                Node.js / TypeScript · Objetivo suportado no beta.
              </p>
              <p className="muted text-xs mt-5 leading-7">
                Frontend, Full Stack, DevOps e outras especializações estão em desenvolvimento.
              </p>
            </section>
            <section className="panel panel-pad mt-5">
              <h2 className="panel-title">Minha trajetória</h2>
              <p className="muted text-xs leading-7 mt-4">
                {a.mapped.length} competências mapeadas · {data.evidences.length} evidências
                registradas.
              </p>
              <Link to="/competencias" className="text-link mt-4">
                Editar competências
                <ArrowRight size={13} />
              </Link>
              <Link to="/evidencias" className="text-link mt-4">
                Gerenciar projetos e experiências
                <ArrowRight size={13} />
              </Link>
            </section>
          </div>
        </div>
      </main>
    </Shell>
  );
}
export { situations };
