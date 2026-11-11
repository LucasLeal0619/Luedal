import { Link } from "@tanstack/react-router";
import {
  Target,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Network,
  FolderOpen,
  Layers,
  CircleHelp,
  Route as RouteIcon,
  Check,
  ShieldCheck,
  Code2,
  CalendarDays,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shell, PageHeading, Assistant } from "./luedal-shell";
import { useCareer } from "@/lib/career-context";
import { analyze } from "@/lib/career";
export function Dashboard() {
  const { data } = useCareer();
  const analysis = analyze(data);
  const next = analysis.recommendations[0];
  const [ai, setAi] = useState(false);
  return (
    <Shell title="Dashboard">
      <main className="page">
        <PageHeading
          title={`Olá, ${data.name?.split(" ")[0] || "bem-vindo"} 👋`}
          description="Cada passo conta. Vamos continuar sua evolução em tecnologia?"
        >
          <span className="date-label flex gap-2 items-center">
            <CalendarDays size={13} /> Seu espaço de evolução
          </span>
        </PageHeading>
        <section className="goal-band">
          <div className="goal-icon">
            <Target size={23} />
          </div>
          <div>
            <span className="eyebrow">SEU OBJETIVO PROFISSIONAL</span>
            <h2>{data.goal}</h2>
            <p>Construindo uma base sólida para sua próxima oportunidade.</p>
          </div>
          <div className="goal-tags">
            <span className="tag">Node.js</span>
            <span className="tag">TypeScript</span>
            <span className="tag tag-purple">Objetivo do beta</span>
          </div>
          <Link to="/perfil" className="text-link ml-4">
            Ver objetivo <ChevronRight size={13} />
          </Link>
        </section>
        <div className="dashboard-grid">
          <div>
            <section className="panel next-step">
              <RouteIcon className="step-symbol" />
              <span className="eyebrow">
                <Sparkles size={13} /> SEU PRÓXIMO PASSO
              </span>
              <h2>
                {next
                  ? `Desenvolver ${next.name.toLowerCase()}${next.id === "integration" ? " para APIs Node.js" : ""}`
                  : "Continue demonstrando suas competências"}
              </h2>
              <p>
                {next?.activity ||
                  "Suas atividades foram concluídas. Adicione evidências do que você aprendeu."}
              </p>
              <div className="why">
                <strong>
                  <CircleHelp size={12} /> Por que este passo?
                </strong>
                <p>
                  {next?.prerequisites.length === 0
                    ? "Esta competência é um fundamento do seu objetivo e não exige pré-requisitos. Comece com uma atividade prática."
                    : next && analysis.ready(next)
                    ? "Você já declarou familiaridade com os pré-requisitos. Ainda não há evidência registrada desta competência, relevante para seu objetivo."
                    : "Consolide seus fundamentos e registre evidências práticas para construir uma rota alinhada ao seu objetivo."}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="tag tag-purple">{next?.category || "Evolução"}</span>
                <span className="tag">Atividade prática</span>
              </div>
              <div className="next-bottom">
                <span className="text-[10px] muted flex items-center gap-1.5">
                  <ShieldCheck size={12} /> Recomendação baseada no seu perfil
                </span>
                <Button asChild>
                  <Link to="/minha-rota">
                    Ver minha rota <ArrowRight />
                  </Link>
                </Button>
              </div>
            </section>
            <div className="summary-grid">
              {[
                {
                  icon: Network,
                  value: analysis.mapped.length,
                  label: "Competências mapeadas",
                  foot: "Declaradas no seu perfil",
                },
                {
                  icon: FolderOpen,
                  value: analysis.evidenced.size,
                  label: "Com evidências",
                  foot: "Relacionadas a projetos",
                },
                {
                  icon: Layers,
                  value: analysis.gaps.length,
                  label: "A desenvolver ou demonstrar",
                  foot: "Pontos para explorar",
                },
              ].map((s) => (
                <div className="panel stat" key={s.label}>
                  <div className="stat-head">
                    <s.icon size={15} className="text-primary" />
                    {s.label}
                  </div>
                  <div className="stat-value">{s.value.toString().padStart(2, "0")}</div>
                  <p className="stat-foot">{s.foot}</p>
                </div>
              ))}
            </div>
            <section className="panel panel-pad">
              <div className="section-head">
                <h2>
                  <RouteIcon size={16} className="text-primary" />
                  Minha rota de evolução
                </h2>
                <Link to="/minha-rota" className="text-link">
                  Ver rota completa <ArrowUpRight size={13} />
                </Link>
              </div>
              <p className="muted text-[10px] mb-2">Uma direção clara. Um passo de cada vez.</p>
              {analysis.recommendations.slice(0, 3).map((s, i) => (
                <Link to="/minha-rota" key={s.id} className="route-row">
                  <div className="route-number">{i + 1}</div>
                  <div className="route-copy">
                    <h3>
                      {s.id === "integration"
                        ? "Implementar testes de integração"
                        : s.id === "docker"
                          ? "Containerizar sua aplicação"
                          : s.id === "cicd"
                            ? "Automatizar testes com CI/CD"
                            : s.name}
                    </h3>
                    <p>{s.activity}</p>
                    <span className={`tag ${i === 0 ? "tag-purple" : ""}`}>
                      {i === 0 ? "Próximo passo" : "Na sequência"}
                    </span>
                  </div>
                  <ChevronRight size={15} className="muted mt-1" />
                </Link>
              ))}
            </section>
            <section className="mt-6">
              <div className="section-head">
                <h2>
                  <FolderOpen size={16} />
                  Evidências recentes
                </h2>
                <Link to="/evidencias" className="text-link">
                  Ver todas <ArrowUpRight size={13} />
                </Link>
              </div>
              {data.evidences.slice(0, 2).map((e) => (
                <Link to="/evidencias" className="evidence-row panel" key={e.id}>
                  <div className="goal-icon">
                    <Code2 size={19} />
                  </div>
                  <div>
                    <h3>{e.title}</h3>
                    <p>
                      {e.type} · {e.skills.length} competências relacionadas
                    </p>
                    <div className="mt-2">
                      <span className="tag tag-green">
                        <Check size={10} /> Evidência registrada
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight size={15} className="ml-auto muted" />
                </Link>
              ))}
              {!data.evidences.length && (
                <div className="panel empty-state">
                  Você ainda não registrou evidências.
                  <br />
                  <Link to="/evidencias" className="text-primary">
                    Adicionar meu primeiro projeto →
                  </Link>
                </div>
              )}
            </section>
          </div>
          <div className="right-stack">
            <section className="panel panel-pad">
              <div className="section-head">
                <h2>
                  <Network size={16} className="text-primary" />
                  Seu mapa de competências
                </h2>
                <Link to="/competencias" title="Abrir competências">
                  <ArrowUpRight size={15} className="muted" />
                </Link>
              </div>
              <p className="text-[10px] muted">Conecte o que você sabe ao que vem a seguir.</p>
              <div className="skill-preview">
                <svg
                  viewBox="0 0 320 230"
                  role="img"
                  aria-label="Relações entre JavaScript, Node.js, TypeScript, APIs REST e testes"
                >
                  <line x1="160" y1="110" x2="83" y2="48" />
                  <line x1="160" y1="110" x2="250" y2="53" />
                  <line x1="160" y1="110" x2="66" y2="149" />
                  <line x1="160" y1="110" x2="242" y2="157" />
                  <line x1="242" y1="157" x2="161" y2="201" />
                  <line x1="66" y1="149" x2="161" y2="201" />
                  {[
                    [83, 48, "JavaScript"],
                    [250, 53, "TypeScript"],
                    [160, 110, "Node.js"],
                    [66, 149, "APIs REST"],
                    [242, 157, "PostgreSQL"],
                    [161, 201, "Testes de integração"],
                  ].map(([x, y, name]) => (
                    <g key={name}>
                      <circle cx={x} cy={y} r={name === "Node.js" ? 25 : 17} />
                      <text x={x} y={Number(y) + (name === "Node.js" ? 4 : 32)} textAnchor="middle">
                        {name}
                      </text>
                      {name !== "Testes de integração" && (
                        <circle
                          cx={Number(x) + 13}
                          cy={Number(y) - 12}
                          r="3"
                          className="fill-success stroke-success"
                        />
                      )}
                    </g>
                  ))}
                </svg>
              </div>
              <div className="legend">
                <span>
                  <i className="dot dot-success" />
                  Com evidências
                </span>
                <span>
                  <i className="dot" />A explorar
                </span>
              </div>
              <div className="skill-mini-list">
                <div>
                  <span>Fundamentos & Backend</span>
                  <span className="tag tag-green">Em evolução</span>
                </div>
                <div>
                  <span>Qualidade & Infraestrutura</span>
                  <span className="tag tag-purple">Próximo foco</span>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full mt-4 text-xs">
                <Link to="/competencias">
                  Explorar Skill Graph <ArrowRight />
                </Link>
              </Button>
            </section>
            <section className="panel ai-teaser">
              <h2 className="panel-title">
                <Sparkles size={17} className="text-primary" />
                Um pouco de clareza com a Luedal AI
              </h2>
              <p>
                Entenda suas competências, explore sua rota e descubra o motivo de cada
                recomendação.
              </p>
              <Button variant="outline" className="w-full text-xs" onClick={() => setAi(true)}>
                Conversar com a Luedal AI <ArrowUpRight />
              </Button>
              <p className="text-[9px] mb-0 mt-3">
                Assistente demonstrativo · baseado no seu perfil
              </p>
            </section>
            <div className="px-2">
              <span className="eyebrow text-muted-foreground">EVOLUÇÃO COM PROPÓSITO</span>
              <p className="muted text-xs leading-7 mt-3">
                Não é sobre aprender tudo.
                <br />É sobre aprender o que faz sentido
                <br />
                para o seu próximo passo.
              </p>
            </div>
          </div>
        </div>
        <footer className="dashboard-footer">
          <ShieldCheck size={12} /> Suas competências declaradas não são uma avaliação técnica. Você
          está no controle da sua evolução.
        </footer>
      </main>
      {ai && <Assistant onClose={() => setAi(false)} page="Dashboard" />}
    </Shell>
  );
}
