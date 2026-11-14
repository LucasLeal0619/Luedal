export const GOAL = "Desenvolvedor Backend Júnior";
export const levels = [
  "Ainda não conheço",
  "Conheço os conceitos",
  "Aplico com ajuda",
  "Aplico sozinho",
  "Resolvo e justifico decisões",
];
export type Skill = {
  id: string;
  name: string;
  category: string;
  prerequisites: string[];
  activity: string;
  priority: number;
};
const groups: [string, [string, string, string[]][]][] = [
  [
    "Fundamentos",
    [
      ["logic", "Lógica de programação", []],
      ["javascript", "JavaScript", ["logic"]],
      ["typescript", "TypeScript", ["javascript"]],
      ["async", "Programação assíncrona", ["javascript"]],
      ["errors", "Tratamento de erros", ["async"]],
    ],
  ],
  [
    "Backend",
    [
      ["node", "Node.js", ["javascript", "async"]],
      ["rest", "APIs REST", ["node"]],
      ["validation", "Validação de dados", ["rest", "typescript"]],
      ["auth", "Autenticação", ["rest"]],
      ["authorization", "Autorização", ["auth"]],
      ["business", "Regras de negócio", ["rest"]],
    ],
  ],
  [
    "Banco de dados",
    [
      ["sql", "SQL", []],
      ["modeling", "Modelagem relacional", ["sql"]],
      ["postgres", "PostgreSQL", ["sql"]],
      ["transactions", "Transações", ["postgres"]],
      ["indexes", "Índices e consultas", ["postgres"]],
    ],
  ],
  [
    "Qualidade",
    [
      ["unit", "Testes unitários", ["javascript"]],
      ["integration", "Testes de integração", ["rest", "postgres"]],
      ["failures", "Tratamento de falhas", ["errors"]],
      ["debug", "Debugging", ["javascript"]],
    ],
  ],
  [
    "Infraestrutura",
    [
      ["git", "Git", []],
      ["docker", "Docker", ["node"]],
      ["env", "Variáveis de ambiente", ["node"]],
      ["cicd", "CI/CD", ["git", "unit"]],
      ["observability", "Observabilidade básica", ["node", "errors"]],
    ],
  ],
  [
    "Engenharia",
    [
      ["organization", "Organização de código", ["typescript"]],
      ["security", "Segurança de APIs", ["auth", "validation"]],
      ["separation", "Separação de responsabilidades", ["organization"]],
      ["architecture", "Decisões arquiteturais básicas", ["separation"]],
    ],
  ],
];
export const skills: Skill[] = groups.flatMap(([category, items]) =>
  items.map(([id, name, prerequisites]) => ({
    id,
    name,
    category,
    prerequisites,
    priority: id === "integration" ? 100 : id === "docker" ? 90 : id === "cicd" ? 80 : 60,
    activity:
      id === "integration"
        ? "Criar testes de integração para uma API que utiliza PostgreSQL."
        : id === "docker"
          ? "Containerizar sua API Node.js e o banco PostgreSQL com Docker Compose."
          : id === "cicd"
            ? "Criar um pipeline que execute os testes a cada alteração no repositório."
            : `Criar uma atividade prática de ${name} e registrar os resultados.`,
  })),
);
export type Evidence = {
  id: string;
  title: string;
  type: string;
  description: string;
  date: string;
  url: string;
  skills: string[];
  contribution: string;
};
export type CareerData = {
  areaId?: string;
  goalId?: string;
  goalSource?: string;
  seniority?: string;
  onboardingStep?: number;
  customSkills?: Skill[];
  name: string;
  situation: string;
  goal: string;
  familiarity: Record<string, number>;
  evidences: Evidence[];
  progress: Record<string, string>;
  onboarded: boolean;
  learning: string;
};
export const emptyProfile = (): CareerData => ({
  name: "",
  situation: "",
  goal: "",
  familiarity: {},
  evidences: [],
  progress: {},
  onboarded: false,
  learning: "",
});
export const demoProfile = (): CareerData => ({
  ...emptyProfile(),
  name: "Alex Martins",
  goal: GOAL,
  situation: "Em busca da primeira oportunidade",
  onboarded: true,
  familiarity: {
    logic: 3,
    javascript: 3,
    typescript: 3,
    async: 3,
    node: 3,
    rest: 3,
    sql: 3,
    postgres: 3,
    git: 3,
  },
  evidences: [
    {
      id: "demo-api",
      title: "API de Gerenciamento de Tarefas",
      type: "Projeto pessoal",
      description:
        "API REST para criar, organizar e acompanhar tarefas, com persistência no PostgreSQL.",
      date: "2026-11-01",
      url: "",
      skills: ["javascript", "typescript", "node", "rest", "postgres", "git"],
      contribution: "Desenvolvimento dos endpoints, modelagem do banco e organização do projeto.",
    },
  ],
});
export function analyze(data: CareerData, catalog?: import("./career-catalog").CareerCatalog) {
  const allSkills = catalog ? [...catalog.skills, ...(data.customSkills ?? [])] : skills;
  const goal = catalog?.goals.find(g => g.id === data.goalId && data.goalSource !== "custom");
  const goalSkills = catalog ? allSkills.filter(s => goal?.skill_ids.includes(s.id)) : skills;
  const evidenced = new Set(data.evidences.flatMap((e) => e.skills));
  const mapped = allSkills.filter((s) => data.familiarity[s.id] !== undefined || evidenced.has(s.id));
  const supported = catalog ? goal?.mapping_status === "complete" && goalSkills.length > 0 : data.goal === GOAL;
  const hasData = mapped.length > 0 || data.evidences.length > 0;
  const gaps = supported && hasData ? goalSkills.filter((s) => !evidenced.has(s.id)) : [];
  const ready = (s: Skill) =>
    s.prerequisites.every((id) => (data.familiarity[id] ?? 0) >= 2 || evidenced.has(id));
  const recommendations = gaps
    .filter((s) => data.progress[s.id] !== "completed")
    .sort(
      (a, b) =>
        Number(ready(b)) - Number(ready(a)) ||
        b.priority - a.priority ||
        allSkills.indexOf(a) - allSkills.indexOf(b),
    );
  return { evidenced, mapped, gaps, recommendations, ready, supported, hasData };
}
export function explain(skill: Skill, data: CareerData, catalog?: import("./career-catalog").CareerCatalog) {
  const prerequisites = skill.prerequisites
    .map((id) => (catalog?.skills ?? skills).find((s) => s.id === id)?.name)
    .filter(Boolean);
  return `Ainda não encontramos evidências suficientes de ${skill.name} no seu perfil. ${prerequisites.length ? `Essa competência se conecta a ${prerequisites.join(" e ")}. ` : ""}Ela faz parte do mapeamento de ${data.goal}. ${analyze(data, catalog).ready(skill) ? "Seus pré-requisitos declarados permitem começar esta atividade." : "Comece pelos pré-requisitos indicados antes de avançar."}`;
}
export function meta(title: string, description: string) {
  return {
    meta: [
      { title: `${title} · Luedal` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} · Luedal` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
