import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CircleHelp } from "lucide-react";
import { Shell, PageHeading } from "@/components/luedal-shell";
import { useCareer } from "@/lib/career-context";
import { analyze, explain, meta } from "@/lib/career";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/lacunas")({
  head: () =>
    meta(
      "Diagnóstico de lacunas",
      "Uma comparação explicável entre seu objetivo, competências declaradas e evidências.",
    ),
  component: Gaps,
});
function Gaps() {
  const { data } = useCareer();
  const a = analyze(data);
  return (
    <Shell title="Diagnóstico">
      <main className="page">
        <PageHeading
          title="Clareza sobre o que vem a seguir"
          description="Ausência de evidência não é ausência de conhecimento."
        >
          <Button asChild>
            <Link to="/minha-rota">
              Ver minha rota <ArrowRight />
            </Link>
          </Button>
        </PageHeading>
        <div className="summary-grid">
          {[
            [a.mapped.length, "Competências mapeadas"],
            [a.evidenced.size, "Com evidência registrada"],
            [a.gaps.length, "A desenvolver ou demonstrar"],
          ].map(([n, t]) => (
            <section className="panel stat" key={t}>
              <p className="muted text-xs">{t}</p>
              <h2 className="stat-value">{n}</h2>
            </section>
          ))}
        </div>
        <div className="grid-2">
          {a.gaps.map((s) => (
            <section className="panel panel-pad" key={s.id}>
              <div className="section-head">
                <h2 className="panel-title">{s.name}</h2>
                <CircleHelp size={16} className="text-primary" />
              </div>
              <span className="tag">
                {data.familiarity[s.id] !== undefined
                  ? "Declarada, sem evidência"
                  : "Ponto a confirmar"}
              </span>
              <p className="text-xs leading-7 muted mt-4">{explain(s, data)}</p>
            </section>
          ))}
        </div>
      </main>
    </Shell>
  );
}
