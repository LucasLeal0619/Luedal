import { z } from "zod";
import type { CareerData, Evidence, Skill } from "./career";
import type { CareerCatalog } from "./career-catalog";

export const selfLevels = ["Iniciante — estou começando a aprender", "Básico — conheço os fundamentos", "Intermediário — consigo aplicar em projetos", "Avançado — utilizo com autonomia em situações complexas", "Especialista — consigo orientar outras pessoas"];
export const skillDetailSchema = z.object({ level: z.number().int().min(0).max(4).optional(), duration: z.string().optional(), description: z.string().optional() });
export const professionalSchema = z.object({
  currentRole: z.string().optional(), area: z.string().optional(), company: z.string().optional(), years: z.string().optional(), description: z.string().optional(), responsibilities: z.string().optional(), technologies: z.string().optional(), github: z.string().optional(), linkedin: z.string().optional(), portfolio: z.string().optional(), website: z.string().optional(), shortGoal: z.string().optional(), longGoal: z.string().optional(), interests: z.string().optional(), weeklyHours: z.string().optional(),
  education: z.array(z.record(z.string())).optional(), certifications: z.array(z.record(z.string())).optional(),
});
export type ProfessionalProfile = z.infer<typeof professionalSchema>;
export type SkillDetail = z.infer<typeof skillDetailSchema>;
export function normalizeSkillName(name: string) { return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, ""); }
export function personalSkills(data: CareerData, catalog: CareerCatalog): Skill[] {
  const evidenced = associatedSkillIds(data);
  return [...catalog.skills, ...(data.customSkills ?? [])].filter(s => data.familiarity[s.id] !== undefined || evidenced.has(s.id) || data.skillDetails?.[s.id] !== undefined);
}
export function associatedSkillIds(data: CareerData) { return new Set(data.evidences.flatMap(e => e.skills)); }
export function savePersonalSkill(data: CareerData, catalog: CareerCatalog, skill: Skill, detail: SkillDetail, evidenceIds: string[]): CareerData {
  const all = [...catalog.skills, ...(data.customSkills ?? [])];
  const duplicate = all.find(s => s.id !== skill.id && normalizeSkillName(s.name) === normalizeSkillName(skill.name));
  if (duplicate) throw new Error("Essa competência já existe. Selecione ou edite o registro existente.");
  if (!skill.name.trim() || !skill.category.trim() || detail.level === undefined) throw new Error("Informe nome, categoria e nível de conhecimento.");
  const original = catalog.skills.find(s => s.id === skill.id);
  const changedCatalogSkill = original && (original.name !== skill.name || original.category !== skill.category);
  if (changedCatalogSkill) throw new Error("O nome e a categoria desta sugestão pertencem ao catálogo.");
  return { ...data,
    customSkills: original ? data.customSkills : [...(data.customSkills ?? []).filter(s => s.id !== skill.id), skill],
    familiarity: { ...data.familiarity, [skill.id]: detail.level },
    skillDetails: { ...data.skillDetails, [skill.id]: detail },
    evidences: data.evidences.map(e => ({ ...e, skills: evidenceIds.includes(e.id) ? [...new Set([...e.skills, skill.id])] : e.skills.filter(id => id !== skill.id) })),
  };
}
export function removePersonalSkill(data: CareerData, id: string): CareerData {
  const familiarity = { ...data.familiarity }; delete familiarity[id];
  const skillDetails = { ...data.skillDetails }; delete skillDetails[id];
  const progress = { ...data.progress }; delete progress[id];
  return { ...data, familiarity, skillDetails, progress, customSkills: data.customSkills?.filter(s => s.id !== id), evidences: data.evidences.map(e => ({ ...e, skills: e.skills.filter(s => s !== id) })) };
}
export function goalChanges(data: CareerData) {
  return { goal: data.goal, goalId: data.goalId, areaId: data.areaId, goalSource: data.goalSource, seniority: data.seniority };
}
export function profileCompleteness(data: CareerData) {
  const p = data.professional ?? {};
  const values = [data.name, data.situation, data.goal, p.currentRole, p.area, p.years, p.description, p.responsibilities, p.technologies, p.github || p.linkedin || p.portfolio || p.website, p.shortGoal || p.longGoal, p.interests, p.weeklyHours,
    p.education?.some(e => e.institution?.trim() && e.course?.trim()), p.certifications?.some(c => c.name?.trim()), data.evidences.some(e => e.type === "Experiência profissional" && e.title.trim()), data.evidences.some(e => e.type.includes("Projeto") && e.title.trim()), Object.keys(data.familiarity).length > 0];
  return Math.round(values.filter(v => typeof v === "string" ? Boolean(v.trim()) : Boolean(v)).length / values.length * 100);
}
export function preliminaryActions(data: CareerData) {
  const actions: { title: string; why: string; action: string; evidence: string }[] = [];
  if (!data.professional?.currentRole || !data.professional.years) actions.push({ title: "Registrar seu momento profissional", why: `Precisamos conhecer sua experiência antes de sugerir uma trajetória para ${data.goal}.`, action: "Informe cargo atual, tempo de experiência e responsabilidades no cadastro profissional.", evidence: "Registre uma experiência e sua contribuição real." });
  const unlinked = Object.keys(data.familiarity).filter(id => !associatedSkillIds(data).has(id));
  if (unlinked.length) actions.push({ title: "Documentar competências já declaradas", why: "Sua autoavaliação indica conhecimentos, mas não comprova aplicação nem validação técnica.", action: "Associe projetos ou experiências às competências que você já aplica.", evidence: "Descreva decisões, resultados e sua participação no projeto." });
  actions.push({ title: "Investigar os requisitos do seu objetivo", why: `Ainda não há mapeamento técnico completo para ${data.goal}.`, action: "Registre requisitos concretos de funções de interesse e revise as diferenças em relação ao seu perfil.", evidence: "Registre os requisitos e suas fontes; não os trate como competências adquiridas." });
  return actions;
}
export function emptyProfessionalEvidence(type: string): Evidence { return { id: crypto.randomUUID(), title: "", type, description: "", date: "", url: "", skills: [], contribution: "", details: {} }; }