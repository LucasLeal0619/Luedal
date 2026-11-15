import { profileSkills, limitedMappingMessage } from "@/lib/career-catalog";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ReactFlow, Background, Controls, type Node, type Edge } from "@xyflow/react";
import { LayoutGrid, Network, Search, X, FolderOpen } from "lucide-react";
import { Shell, PageHeading } from "@/components/luedal-shell";
import { Button } from "@/components/ui/button";
import { useCareer } from "@/lib/career-context";
import { analyze, levels, meta, type Skill } from "@/lib/career";
export const Route = createFileRoute("/_authenticated/competencias")({
  head: () =>
    meta(
      "Competências e Skill Graph",
      "Explore suas competências, relações e evidências profissionais.",
    ),
  component: SkillsPage,
});
function SkillsPage() {
  const { data, update, catalog } = useCareer();
  const skills = profileSkills(data, catalog);
  const [view, setView] = useState("categories");
  const [category, setCategory] = useState("Todas");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Skill | null>(null);
  const a = analyze(data, catalog);
  const categories = [...new Set(skills.map((s) => s.category))];
  const filtered = skills.filter(
    (s) =>
      (category === "Todas" || s.category === category) &&
      s.name.toLowerCase().includes(query.toLowerCase()),
  );
  const nodes: Node[] = skills.map((s, i) => ({
    id: s.id,
    position: {
      x: categories.indexOf(s.category) * 240,
      y: (i - skills.findIndex((v) => v.category === s.category)) * 110,
    },
    data: { label: s.name },
    className: a.evidenced.has(s.id) ? "evidenced-node" : "",
  }));
  const edges: Edge[] = skills.flatMap((s) =>
    s.prerequisites.map((id) => ({
      id: `${id}-${s.id}`,
      source: id,
      target: s.id,
      type: "smoothstep",
    })),
  );
  return (
    <Shell title="Competências">
      <main className="page">
        <PageHeading
          title="Seu mapa de competências"
          description="O que você conhece, o que já demonstrou e como tudo se conecta."
        />
        <div className="tabs-bar">
          <Button
            variant={view === "categories" ? "default" : "outline"}
            onClick={() => setView("categories")}
          >
            <LayoutGrid />
            Categorias
          </Button>
          <Button
            variant={view === "graph" ? "default" : "outline"}
            onClick={() => setView("graph")}
          >
            <Network />
            Skill Graph
          </Button>
          <select
            aria-label="Filtrar categoria"
            className="max-w-48 ml-auto"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Todas</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={15} />
            <input
              aria-label="Buscar competência"
              className="pl-9"
              placeholder="Buscar competência"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        {view === "graph" && !a.supported ? <div className="empty-state">{limitedMappingMessage}</div> : view === "graph" ? (
          <div className="graph-container">
            <ReactFlow
              nodes={nodes.filter((n) => filtered.some((s) => s.id === n.id))}
              edges={edges}
              fitView
              nodesDraggable
              onNodeClick={(_e, n) => setSelected(skills.find((s) => s.id === n.id) ?? null)}
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        ) : (
          <div className="skill-grid">
            {filtered.map((s) => (
              <article key={s.id} className="panel skill-item">
                <span className="eyebrow text-muted-foreground">{s.category}</span>
                <h3>{s.name}</h3>
                <span
                  className={`tag w-fit ${a.evidenced.has(s.id) ? "tag-green" : data.familiarity[s.id] !== undefined ? "tag-purple" : ""}`}
                >
                  {a.evidenced.has(s.id)
                    ? "Com evidência registrada"
                    : data.familiarity[s.id] !== undefined
                      ? "Declarada pelo usuário"
                      : "Não avaliada"}
                </span>
                <select
                  aria-label={`Familiaridade com ${s.name}`}
                  value={data.familiarity[s.id] ?? ""}
                  onChange={(e) => {
                    const familiarity = { ...data.familiarity };
                    if (e.target.value === "") delete familiarity[s.id];
                    else familiarity[s.id] = Number(e.target.value);
                    void update({ ...data, familiarity });
                  }}
                >
                  <option value="">Não avaliada</option>
                  {levels.map((l, i) => (
                    <option key={l} value={i}>
                      {l}
                    </option>
                  ))}
                </select>
                <Button
                  variant="ghost"
                  className="justify-start p-0 h-auto text-xs text-primary"
                  onClick={() => setSelected(s)}
                >
                  Ver relações e detalhes →
                </Button>
              </article>
            ))}
          </div>
        )}
        {!filtered.length && <div className="empty-state">Nenhuma competência encontrada.</div>}
      </main>
      {selected && (
        <div className="detail-overlay">
          <section className="panel modal" role="dialog" aria-label="Detalhes da competência">
            <div className="section-head">
              <h2>{selected.name}</h2>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Fechar detalhes"
                onClick={() => setSelected(null)}
              >
                <X />
              </Button>
            </div>
            <span className="tag tag-purple">{selected.category}</span>
            <p className="text-sm leading-7 muted mt-5">
              Competência do catálogo ou registrada por você; sua declaração não equivale à validação técnica.
            </p>
            <h3 className="panel-title mt-6">Pré-requisitos</h3>
            <div className="flex flex-wrap gap-2 mt-3">
              {selected.prerequisites.map((id) => (
                <Button
                  variant="outline"
                  key={id}
                  onClick={() => setSelected(skills.find((s) => s.id === id) ?? null)}
                >
                  {skills.find((s) => s.id === id)?.name}
                </Button>
              ))}
              {!selected.prerequisites.length && (
                <p className="muted text-xs">Nenhum pré-requisito específico.</p>
              )}
            </div>
            <h3 className="panel-title mt-6">
              <FolderOpen size={16} />
              Evidências relacionadas
            </h3>
            {data.evidences
              .filter((e) => e.skills.includes(selected.id))
              .map((e) => (
                <p className="text-sm mt-3" key={e.id}>
                  {e.title} <span className="tag tag-green">Registrada, não validada</span>
                </p>
              ))}
            {!a.evidenced.has(selected.id) && (
              <p className="muted text-xs mt-3">
                Ainda não há evidências registradas. Isso não significa que você desconheça essa
                competência.
              </p>
            )}
            <h3 className="panel-title mt-6">Atividade sugerida</h3>
            <p className="muted text-sm leading-7 mt-3">{selected.activity}</p>
          </section>
        </div>
      )}
    </Shell>
  );
}
