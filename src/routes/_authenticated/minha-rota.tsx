import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, RefreshCw, Plus, Check, CircleHelp } from "lucide-react";
import { Shell, PageHeading } from "@/components/luedal-shell";
import { EvidenceForm } from "@/components/evidence-form";
import { Button } from "@/components/ui/button";
import { analyze, explain, skills, meta } from "@/lib/career";
import { useCareer } from "@/lib/career-context";
import { toast } from "sonner";
export const Route = createFileRoute("/_authenticated/minha-rota")({
  head: () =>
    meta(
      "Minha rota",
      "Atividades práticas priorizadas por relevância, pré-requisitos e evidências.",
    ),
  component: CareerRoute,
});
function CareerRoute() {
  const { data, update } = useCareer();
  const a = analyze(data);
  const [add, setAdd] = useState(false);
  return (
    <Shell title="Minha Rota">
      <main className="page">
        <PageHeading
          title="Sua evolução tem uma direção"
          description={`${data.goal} · Node.js / TypeScript`}
        >
          <Button
            variant="outline"
            onClick={() =>
              toast.success("Rota recalculada com suas competências e evidências atuais.")
            }
          >
            <RefreshCw />
            Recalcular rota
          </Button>
        </PageHeading>
        <div className="goal-band">
          <CircleHelp className="text-primary" />
          <p>
            Prioridade definida por pré-requisitos, relevância para seu objetivo e evidências
            registradas. Sem notas arbitrárias.
          </p>
          <Link to="/lacunas" className="text-link ml-auto">
            Ver diagnóstico <ArrowRight size={14} />
          </Link>
        </div>
        {a.recommendations.slice(0, 8).map((s, i) => (
          <section className="panel route-card" key={s.id}>
            <div className="route-number">{i + 1}</div>
            <div className="route-card-body">
              <span className={`tag ${i === 0 ? "tag-purple" : ""}`}>
                {i === 0
                  ? "Próximo passo"
                  : a.ready(s)
                    ? "Pré-requisitos declarados"
                    : "Consolidar pré-requisitos"}
              </span>
              <h2>{s.name}</h2>
              <p>{explain(s, data)}</p>
              <div className="route-detail">
                <div>
                  <h3>O QUE FAZER</h3>
                  <p>{s.activity}</p>
                </div>
                <div>
                  <h3>COMO DEMONSTRAR</h3>
                  <p>
                    Registre o projeto e explique os cenários, sua contribuição e as decisões
                    tomadas.
                  </p>
                </div>
                <div>
                  <h3>PRÉ-REQUISITOS</h3>
                  <p>
                    {s.prerequisites
                      .map((id) => skills.find((s) => s.id === id)?.name)
                      .join(", ") || "Nenhum pré-requisito específico."}
                  </p>
                </div>
                <div>
                  <h3>RESULTADO ESPERADO</h3>
                  <p>Aplicar {s.name} em um projeto e explicar o resultado com uma evidência.</p>
                </div>
              </div>
              <div className="form-actions">
                <Button variant="outline" onClick={() => setAdd(true)}>
                  <Plus />
                  Adicionar evidência
                </Button>
                <Button
                  variant={data.progress[s.id] === "started" ? "secondary" : "default"}
                  onClick={async () => {
                    await update({
                      ...data,
                      progress: {
                        ...data.progress,
                        [s.id]: data.progress[s.id] === "started" ? "completed" : "started",
                      },
                    });
                    toast.success(
                      data.progress[s.id] === "started"
                        ? "Atividade concluída. Registre uma evidência para demonstrar o aprendizado."
                        : "Atividade iniciada.",
                    );
                  }}
                >
                  <Check />
                  {data.progress[s.id] === "started" ? "Concluir atividade" : "Iniciar atividade"}
                </Button>
              </div>
            </div>
          </section>
        ))}
        {Object.entries(data.progress).filter(([, p]) => p === "completed").length > 0 && (
          <section className="panel panel-pad">
            <h2 className="panel-title">Atividades concluídas</h2>
            {Object.entries(data.progress)
              .filter(([, p]) => p === "completed")
              .map(([id]) => (
                <div className="settings-row" key={id}>
                  <span className="flex gap-2">
                    <Check className="text-success" size={16} />
                    {skills.find((s) => s.id === id)?.name}
                  </span>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      update({ ...data, progress: { ...data.progress, [id]: "started" } })
                    }
                  >
                    Reabrir
                  </Button>
                </div>
              ))}
          </section>
        )}
        {!a.recommendations.length && (
          <div className="panel empty-state">
            Todas as atividades disponíveis foram concluídas. Continue registrando evidências.
          </div>
        )}
      </main>
      {add && <EvidenceForm onClose={() => setAdd(false)} />}
    </Shell>
  );
}
