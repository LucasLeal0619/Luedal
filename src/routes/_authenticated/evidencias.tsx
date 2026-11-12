import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Code2, Pencil, Trash2, ExternalLink } from "lucide-react";
import { Shell, PageHeading } from "@/components/luedal-shell";
import { EvidenceForm } from "@/components/evidence-form";
import { Button } from "@/components/ui/button";
import { useCareer } from "@/lib/career-context";
import { skills, meta, type Evidence } from "@/lib/career";
import { toast } from "sonner";
export const Route = createFileRoute("/_authenticated/evidencias")({
  head: () =>
    meta(
      "Evidências profissionais",
      "Organize projetos, experiências e atividades relacionadas às suas competências.",
    ),
  component: Evidences,
});
function Evidences() {
  const { data, update } = useCareer();
  const [add, setAdd] = useState(false);
  const [editing, setEditing] = useState<Evidence | undefined>();
  const [deleting, setDeleting] = useState<string | null>(null);
  return (
    <Shell title="Evidências">
      <main className="page">
        <PageHeading
          title="Seu aprendizado, na prática"
          description="Projetos e experiências que dão contexto às suas competências."
        >
          <Button
            onClick={() => {
              setEditing(undefined);
              setAdd(true);
            }}
          >
            <Plus />
            Nova evidência
          </Button>
        </PageHeading>
        <div className="grid-2">
          {data.evidences.map((e) => (
            <article className="panel panel-pad" key={e.id}>
              <div className="section-head">
                <span className="tag">{e.type}</span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Editar ${e.title}`}
                    onClick={() => {
                      setEditing(e);
                      setAdd(true);
                    }}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Excluir ${e.title}`}
                    onClick={() => setDeleting(e.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
              <Code2 className="text-primary mb-4" size={26} />
              <h2 className="text-lg font-semibold">{e.title}</h2>
              <p className="muted text-xs leading-7 mt-3">{e.description}</p>
              {e.contribution && (
                <p className="text-xs leading-7 mt-3">
                  <strong>Sua contribuição:</strong> {e.contribution}
                </p>
              )}
              <div className="flex gap-2 flex-wrap mt-5">
                {e.skills.map((id) => (
                  <span className="tag" key={id}>
                    {skills.find((s) => s.id === id)?.name}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center mt-6">
                <span className="tag tag-green">Evidência registrada · não validada</span>
                {e.url && (
                  <a href={e.url} target="_blank" rel="noreferrer" className="text-link">
                    Abrir projeto
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
        {!data.evidences.length && (
          <section className="panel empty-state">
            <Code2 className="mx-auto mb-4 text-primary" size={32} />
            <h2 className="text-foreground text-lg mb-2">Seu primeiro projeto começa aqui</h2>
            <p>Registre uma experiência, um projeto ou uma atividade prática.</p>
            <Button className="mt-5" onClick={() => setAdd(true)}>
              <Plus />
              Adicionar evidência
            </Button>
          </section>
        )}
      </main>
      {add && <EvidenceForm existing={editing} onClose={() => setAdd(false)} />}
      {deleting && (
        <div className="detail-overlay">
          <section className="panel modal" role="dialog" aria-label="Confirmar exclusão">
            <h2>Excluir esta evidência?</h2>
            <p className="muted text-sm">
              As competências relacionadas serão recalculadas. Essa ação não pode ser desfeita.
            </p>
            <div className="form-actions">
              <Button variant="outline" onClick={() => setDeleting(null)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (
                    await update({
                      ...data,
                      evidences: data.evidences.filter((e) => e.id !== deleting),
                    })
                  ) {
                    setDeleting(null);
                    toast.success("Evidência excluída.");
                  }
                }}
              >
                Excluir evidência
              </Button>
            </div>
          </section>
        </div>
      )}
    </Shell>
  );
}
