import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowLeft, Target, Check, Plus } from "lucide-react";
import { Brand } from "@/components/luedal-shell";
import { Button } from "@/components/ui/button";
import { useCareer } from "@/lib/career-context";
import { skills, levels, analyze, meta } from "@/lib/career";
export const Route = createFileRoute("/onboarding")({
  head: () =>
    meta(
      "Começar minha evolução",
      "Defina seu objetivo e mapeie suas competências para construir sua primeira rota.",
    ),
  component: Onboarding,
});
const situations = [
  "Estudante de tecnologia",
  "Em busca da primeira oportunidade",
  "Desenvolvedor em início de carreira",
  "Profissional experiente",
  "Em transição de carreira",
];
function Onboarding() {
  const { data, update, demo, startEmpty } = useCareer();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(data);
  const [project, setProject] = useState("");
  const [busy, setBusy] = useState(false);
  async function next() {
    if (step === 4) {
      setBusy(true);
      const next = {
        ...form,
        onboarded: true,
        evidences: project
          ? [
              ...form.evidences,
              {
                id: crypto.randomUUID(),
                title: project,
                type: "Projeto pessoal",
                description:
                  "Projeto informado no onboarding. Adicione detalhes na página de evidências.",
                date: "",
                url: "",
                skills: [],
                contribution: "",
              },
            ]
          : form.evidences,
      };
      if (await update(next)) await navigate({ to: "/dashboard" });
      setBusy(false);
    } else setStep(step + 1);
  }
  return (
    <div className="welcome-container">
      <Brand />
      <div className="flex justify-between mt-8">
        <span className="muted text-xs">Seu ponto de partida</span>
        <span className="muted text-xs">Etapa {step + 1} de 5</span>
      </div>
      <div className="onboard-progress">
        {[0, 1, 2, 3, 4].map((n) => (
          <span className={n <= step ? "filled" : ""} key={n} />
        ))}
      </div>
      <section className="panel onboard-card">
        {step === 0 && (
          <>
            <span className="eyebrow mb-4">BEM-VINDO À LUEDAL</span>
            <h1>Vamos conhecer você?</h1>
            <p>Uma rota útil começa com seu momento atual.</p>
            <div className="form-field">
              <label htmlFor="onboard-name">Como você prefere ser chamado?</label>
              <input
                id="onboard-name"
                autoComplete="given-name"
                maxLength={80}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Seu nome"
              />
            </div>
            <div className="form-field">
              <label htmlFor="onboard-situation">Qual é seu momento profissional?</label>
              <select
                id="onboard-situation"
                value={form.situation}
                onChange={(e) => setForm({ ...form, situation: e.target.value })}
              >
                {situations.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            {demo && (
              <div className="mt-6">
                <span className="demo-badge">Demonstração · salvo apenas nesta sessão</span>
                <Button
                  variant="link"
                  className="block p-0 mt-4"
                  onClick={() => {
                    startEmpty();
                    setForm({
                      ...form,
                      name: "",
                      familiarity: {},
                      evidences: [],
                      progress: {},
                      onboarded: false,
                    });
                  }}
                >
                  Começar com um perfil vazio
                </Button>
              </div>
            )}
          </>
        )}
        {step === 1 && (
          <>
            <Target className="text-primary mb-5" size={28} />
            <h1>Onde você quer chegar?</h1>
            <p>Vamos concentrar sua evolução em um objetivo claro.</p>
            <div className="panel panel-pad border-primary">
              <span className="tag tag-purple">Disponível no beta</span>
              <h2 className="text-lg mt-4 font-semibold">Desenvolvedor Backend Júnior</h2>
              <p className="muted text-sm mt-3">Node.js / TypeScript</p>
              <Check className="text-primary mt-5" />
            </div>
            <p className="muted text-xs mt-6 leading-7">
              Frontend, Full Stack, DevOps, Dados e outras carreiras serão disponibilizadas em
              versões futuras.
            </p>
          </>
        )}
        {step === 2 && (
          <>
            <h1>O que você já conhece?</h1>
            <p>Sua autoavaliação é um ponto de partida, não uma validação técnica.</p>
            {skills
              .filter((s) =>
                [
                  "logic",
                  "javascript",
                  "typescript",
                  "async",
                  "node",
                  "rest",
                  "sql",
                  "postgres",
                  "git",
                  "integration",
                  "docker",
                  "cicd",
                ].includes(s.id),
              )
              .map((s) => (
                <div className="form-field" key={s.id}>
                  <label htmlFor={`onboard-${s.id}`}>
                    {s.name} <span className="muted text-[10px]">· {s.category}</span>
                  </label>
                  <select
                    id={`onboard-${s.id}`}
                    value={form.familiarity[s.id] ?? ""}
                    onChange={(e) => {
                      const familiarity = { ...form.familiarity };
                      if (e.target.value === "") delete familiarity[s.id];
                      else familiarity[s.id] = Number(e.target.value);
                      setForm({ ...form, familiarity });
                    }}
                  >
                    <option value="">Prefiro avaliar depois</option>
                    {levels.map((l, i) => (
                      <option value={i} key={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
          </>
        )}
        {step === 3 && (
          <>
            <Plus className="text-primary mb-5" size={26} />
            <h1>Um projeto para contar?</h1>
            <p>
              Experiências reais dão contexto ao seu aprendizado. Este passo é opcional, e você não
              precisa de GitHub.
            </p>
            <div className="form-field">
              <label htmlFor="onboard-project">Título do projeto ou experiência</label>
              <input
                id="onboard-project"
                value={project}
                maxLength={150}
                onChange={(e) => setProject(e.target.value)}
                placeholder="Ex.: API de organização de tarefas"
              />
            </div>
            <p className="muted text-xs leading-7">
              Depois você poderá adicionar a descrição, sua contribuição e as competências
              relacionadas.
            </p>
          </>
        )}
        {step === 4 && (
          <>
            <Check className="text-success mb-5" size={28} />
            <h1>Seu próximo passo começa aqui</h1>
            <p>
              Confira seu ponto de partida. O diagnóstico é calculado por regras de competências,
              evidências e pré-requisitos.
            </p>
            <div className="settings-row">
              <span>Seu nome</span>
              <strong>{form.name}</strong>
            </div>
            <div className="settings-row">
              <span>Objetivo</span>
              <strong className="text-xs">Backend Júnior · Node.js</strong>
            </div>
            <div className="settings-row">
              <span>Competências mapeadas</span>
              <strong>{analyze(form).mapped.length}</strong>
            </div>
            <div className="settings-row">
              <span>Evidências registradas</span>
              <strong>{form.evidences.length + (project ? 1 : 0)}</strong>
            </div>
          </>
        )}
        <div className="form-actions">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              <ArrowLeft />
              Voltar
            </Button>
          )}
          <Button disabled={busy || (step === 0 && !form.name.trim())} onClick={next}>
            {busy
              ? "Salvando perfil…"
              : step === 4
                ? "Ver meu diagnóstico"
                : step === 3 && !project
                  ? "Pular por enquanto"
                  : "Continuar"}
            <ArrowRight />
          </Button>
        </div>
      </section>
    </div>
  );
}
