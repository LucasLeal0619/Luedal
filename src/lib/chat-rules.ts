import { z } from "zod";
import { analyze, skills, emptyProfile, type CareerData } from "./career";
export const chatSchema = z.object({ conversationId: z.string().uuid().nullable(), message: z.string().trim().min(1).max(2000), page: z.string().max(80) });
export function profileContext(profile: CareerData, page: string) {
  const a = analyze(profile);
  return { name: profile.name || null, goal: profile.onboarded ? profile.goal : null, situation: profile.onboarded ? profile.situation : null, familiarity: profile.familiarity, evidences: profile.evidences, progress: profile.progress, gaps: a.gaps.map(s => s.name), recommendations: a.recommendations.slice(0,5), catalog: skills, page };
}
export function realProfile(value: unknown, name = ""): CareerData {
  const schema = z.object({ areaId: z.string().optional(), goalId: z.string().optional(), goalSource: z.string().optional(), seniority: z.string().optional(), onboardingStep: z.number().int().min(0).max(4).optional(), customSkills: z.array(z.object({id:z.string(),name:z.string(),category:z.string(),prerequisites:z.array(z.string()),activity:z.string(),priority:z.number()})).optional(), name: z.string().max(80).optional(), situation: z.string().max(150).optional(), goal: z.string().max(2000).optional(), familiarity: z.record(z.number().min(0).max(4)).optional(), evidences: z.array(z.object({ id: z.string(), title: z.string(), type: z.string(), description: z.string(), date: z.string(), url: z.string(), skills: z.array(z.string()), contribution: z.string() })).max(100).optional(), progress: z.record(z.string()).optional(), onboarded: z.boolean().optional(), learning: z.string().optional() });
  const parsed = schema.safeParse(value);
  const base = emptyProfile();
  if(!parsed.success) return {...base,name};
  return {...base, name:parsed.data.name ?? name, situation:parsed.data.situation ?? "", goal:parsed.data.goal ?? "", familiarity:parsed.data.familiarity ?? {}, evidences:parsed.data.evidences ?? [], progress:parsed.data.progress ?? {}, onboarded:parsed.data.onboarded ?? false, learning:parsed.data.learning ?? "", areaId:parsed.data.areaId ?? "", goalId:parsed.data.goalId ?? "", goalSource:parsed.data.goalSource ?? "", seniority:parsed.data.seniority ?? "", onboardingStep:parsed.data.onboardingStep ?? 0, customSkills:parsed.data.customSkills ?? []};
}
export function boundedHistory<T extends {content: string}>(messages: T[]) { let size = 0; return messages.slice(-20).reverse().filter(m => { size += m.content.length; return size <= 24000; }).reverse(); }