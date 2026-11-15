import { describe, expect, it } from "vitest";
import { analyze, emptyProfile } from "@/lib/career";
import { chooseGoal, customGoal, suggestedSkills, type CareerCatalog, type CareerGoal } from "@/lib/career-catalog";
import { realProfile } from "@/lib/chat-rules";
const frontend: CareerGoal = {id:"frontend",area_id:"frontend",title:"Desenvolvedor Frontend",description:"",seniorities:["Júnior"],mapping_status:"complete",skill_ids:["html","css"]};
const ai: CareerGoal = {id:"ai",area_id:"ai",title:"Engenheiro de IA",description:"",seniorities:[],mapping_status:"partial",skill_ids:["python"]};
const catalog: CareerCatalog = {areas:[],goals:[frontend,ai],skills:[
 {id:"html",name:"HTML",category:"Frontend",prerequisites:[],activity:"Página semântica",priority:60,area_ids:["frontend"]},
 {id:"css",name:"CSS",category:"Frontend",prerequisites:["html"],activity:"Estilizar página",priority:70,area_ids:["frontend"]},
 {id:"python",name:"Python",category:"IA",prerequisites:[],activity:"",priority:60,area_ids:["ai"]},
 {id:"node",name:"Node.js",category:"Backend",prerequisites:[],activity:"",priority:60,area_ids:["backend"]},
]};
describe("Personalized career catalog",()=>{
 it("saves Frontend and optional seniority without assigning Backend",()=>{
  const p=chooseGoal(emptyProfile(),frontend,"Júnior");
  expect(p.goal).toBe("Desenvolvedor Frontend · Júnior");
  expect(p.areaId).toBe("frontend");
 });
 it("does not require seniority",()=>expect(chooseGoal(emptyProfile(),ai).goal).toBe("Engenheiro de IA"));
 it("suggests Frontend skills rather than Node.js",()=>expect(suggestedSkills(chooseGoal(emptyProfile(),frontend),catalog).map(s=>s.id)).toEqual(["html","css"]));
 it("suggests Python for IA without fabricating a diagnosis for a partial mapping",()=>{
  const p=chooseGoal(emptyProfile(),ai);p.familiarity={python:3};
  expect(suggestedSkills(p,catalog).map(s=>s.id)).toEqual(["python"]);
  expect(analyze(p,catalog).recommendations).toEqual([]);
 });
 it("preserves the exact custom goal through persisted profile normalization",()=>{
  const text="Quero me tornar Arquiteto de Software";
  expect(realProfile(JSON.parse(JSON.stringify(customGoal(emptyProfile(),text)))).goal).toBe(text);
 });
 it("does not use a structured graph for custom goals",()=>{
  const p=customGoal(chooseGoal(emptyProfile(),frontend),"Quero me tornar Arquiteto de Software");p.familiarity={html:4};
  expect(analyze(p,catalog).recommendations).toEqual([]);
  expect(analyze(p,catalog).supported).toBe(false);
 });
 it("persists the incomplete step, skills and experiences for later resumption",()=>{
  const p=chooseGoal(emptyProfile(),frontend);p.onboardingStep=3;p.familiarity={html:2};p.evidences=[{id:"project",title:"Portfolio",type:"Projeto pessoal",description:"",contribution:"",date:"",url:"",skills:["html"]}];
  const loaded=realProfile(JSON.parse(JSON.stringify(p)));
  expect(loaded.onboardingStep).toBe(3);expect(loaded.familiarity).toEqual({html:2});expect(loaded.evidences[0]?.title).toBe("Portfolio");expect(loaded.onboarded).toBe(false);
 });
 it("limits calculated recommendations to the selected complete graph",()=>{
  const p=chooseGoal(emptyProfile(),frontend);p.familiarity={html:2};
  expect(analyze(p,catalog).recommendations.map(s=>s.id)).toEqual(["css","html"]);
 });
 it("does not create declared mastery for a custom skill",()=>{
  const p=emptyProfile();p.customSkills=[{id:"custom",name:"Agentes de IA",category:"Minhas competências",prerequisites:[],activity:"",priority:0}];
  expect(analyze(p,catalog).mapped).toEqual([]);expect(p.familiarity).toEqual({});
 });
});