import type { CareerData, Skill } from "./career";
export type CareerArea = { id: string; name: string; description: string; sort_order: number };
export type CareerGoal = { id: string; area_id: string; title: string; description: string; seniorities: string[]; mapping_status: string; skill_ids: string[] };
export type CatalogSkill = Skill & { area_ids: string[] };
export type CareerCatalog = { areas: CareerArea[]; goals: CareerGoal[]; skills: CatalogSkill[] };
export const emptyCatalog: CareerCatalog = { areas: [], goals: [], skills: [] };
export const limitedMappingMessage = "Seu objetivo foi salvo! Ainda estamos expandindo nosso catálogo de competências para essa área. Você já pode registrar suas habilidades e experiências enquanto preparamos recomendações mais específicas.";
export function selectedGoal(data: CareerData, catalog: CareerCatalog) {
  return data.goalSource === "custom" ? undefined : catalog.goals.find(g => g.id === data.goalId);
}
export function profileSkills(data: CareerData, catalog: CareerCatalog): Skill[] {
  return [...catalog.skills, ...(data.customSkills ?? [])];
}
export function suggestedSkills(data: CareerData, catalog: CareerCatalog): Skill[] {
  const goal = selectedGoal(data, catalog);
  return catalog.skills.filter(s => goal?.skill_ids.includes(s.id) || (data.areaId && s.area_ids.includes(data.areaId)));
}
export function chooseGoal(data: CareerData, goal: CareerGoal, seniority = ""): CareerData {
  return { ...data, goal: [goal.title, seniority].filter(Boolean).join(" · "), goalId: goal.id, areaId: goal.area_id, goalSource: "catalog", seniority };
}
export function customGoal(data: CareerData, text: string): CareerData {
  return { ...data, goal: text, goalSource: "custom", goalId: "", seniority: "" };
}