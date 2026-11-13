import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Target,
  Network,
  Layers,
  Route as RouteIcon,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { PublicHeader } from "@/components/luedal-shell";
import { Button } from "@/components/ui/button";
import logo from "@/assets/luedal-original.png.asset.json";
import { meta } from "@/lib/career";
export const Route = createFileRoute("/sobre")({
  head: () =>
    meta(
      "Evolução de carreira em tecnologia",
      "Pare de tentar aprender tudo. Descubra seu próximo passo em tecnologia com a Luedal.",
    ),
  component: About,
});
function About() {
  return (
    <>
      <PublicHeader />
      <main>
        <section className="landing-main">
          <img
            className="original-logo"
            src={logo.url}
            alt="Luedal — Evolução de carreira em tecnologia"
          />
          <span className="tag tag-purple mt-6">Seu GPS de evolução profissional</span>
          <h1>
            Pare de tentar aprender tudo.
            <br />
            Descubra seu próximo passo em tecnologia.
          </h1>
          <p>
            Mapeie suas competências, identifique lacunas e construa uma rota de evolução
            profissional baseada no que você realmente sabe e no que deseja alcançar.
          </p>
          <div className="landing-actions">
            <Button asChild size="lg">
              <Link to="/cadastro">
                Começar minha evolução
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/dashboard">
                Explorar a Luedal
                <ArrowUpRight />
              </Link>
            </Button>
          </div>
          <span className="muted text-xs">
            Beta · Primeiro objetivo: Backend Júnior com Node.js / TypeScript
          </span>
        </section>
        <section className="landing-section">
          <span className="eyebrow mb-4">MENOS RUÍDO, MAIS DIREÇÃO</span>
          <h2>Você não precisa aprender tudo ao mesmo tempo.</h2>
          <p>
            Entre cursos, tecnologias e recomendações, é fácil perder de vista o que importa para
            sua carreira. A Luedal conecta seu ponto de partida ao seu objetivo, com próximos passos
            fundamentados nas suas competências e evidências.
          </p>
          <div className="landing-steps">
            {[
              { icon: Target, title: "Defina seu objetivo", text: "Saiba onde você quer chegar." },
              {
                icon: Network,
                title: "Mapeie competências",
                text: "Dê contexto ao que você conhece.",
              },
              {
                icon: Layers,
                title: "Descubra suas lacunas",
                text: "Entenda o que precisa desenvolver ou demonstrar.",
              },
              {
                icon: RouteIcon,
                title: "Siga sua rota",
                text: "Evolua com atividades práticas e explicáveis.",
              },
            ].map((s, i) => (
              <div key={s.title}>
                <s.icon size={25} className="text-primary" />
                <h3>
                  0{i + 1} · {s.title}
                </h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="landing-section">
          <h2>Recomendações que fazem sentido para você.</h2>
          <p>
            A Luedal não recomenda estudar uma tecnologia só porque ela é popular. O Skill Graph
            conecta competências e pré-requisitos; suas evidências dão contexto; o Career GPS
            organiza os próximos passos. A Luedal AI complementa a experiência com explicações sobre
            seu perfil.
          </p>
          <div className="flex gap-3 mt-6 flex-wrap">
            <Link to="/competencias" className="text-link">
              Explorar Skill Graph <ArrowRight size={14} />
            </Link>
            <Link to="/minha-rota" className="text-link">
              Conhecer Career GPS <ArrowRight size={14} />
            </Link>
          </div>
        </section>
        <section className="landing-section">
          <span className="eyebrow mb-4">EM EVOLUÇÃO, ASSIM COMO VOCÊ</span>
          <h2>Uma base sólida. Um beta transparente.</h2>
          <p>
            Os primeiros recursos estão sendo disponibilizados gradualmente. O beta oferece um
            catálogo Backend Node.js / TypeScript, registro manual de evidências e diagnóstico por
            regras. O assistente conversa com inteligência artificial e informações do seu perfil privado.
          </p>
        </section>
      </main>
      <footer className="public-footer">
        <span>Luedal · Evolução de carreira em tecnologia.</span>
        <div className="flex gap-5">
          <Link to="/dashboard">Meu espaço</Link>
          <Link to="/privacidade">Privacidade</Link>
          <Link to="/termos">Termos</Link>
        </div>
      </footer>
    </>
  );
}
