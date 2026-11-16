import { useState } from "react";
import { Button } from "./ui/button";
import type { CareerData } from "@/lib/career";
import { chooseGoal, customGoal, selectedGoal, type CareerCatalog } from "@/lib/career-catalog";
export function CareerGoalPicker({ value, catalog, onChange }: { value: CareerData; catalog: CareerCatalog; onChange: (value: CareerData) => void }) {
  const [query, setQuery] = useState("");
  const goal = selectedGoal(value, catalog);
  const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
  const matches = catalog.goals.filter(g => normalize(`${g.title} ${catalog.areas.find(a => a.id === g.area_id)?.name ?? ""}`).includes(normalize(query.trim())));
  return <div>
    <div className="form-field"><label htmlFor="career-search">Pesquisar área ou cargo</label><input id="career-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Frontend, IA, arquitetura…" /></div>
    {query.trim() && <div className="flex flex-col gap-2 mb-4" aria-label="Resultados da pesquisa">
      {matches.slice(0, 8).map(g => <Button key={g.id} type="button" variant="outline" className="h-auto whitespace-normal justify-start" onClick={() => { onChange(chooseGoal(value, g)); setQuery(""); }}>{g.title}</Button>)}
      <Button type="button" className="h-auto whitespace-normal justify-start" onClick={() => { onChange(customGoal(value, query.trim())); setQuery(""); }}>Usar {query.trim()} como meu objetivo profissional</Button>
    </div>}
    <div className="form-field"><label htmlFor="career-area">Área profissional</label><select id="career-area" value={value.areaId ?? ""} onChange={e => onChange({ ...value, areaId: e.target.value, goalId: "", goal: value.goalSource === "custom" ? value.goal : "", goalSource: value.goalSource === "custom" ? "custom" : "catalog", seniority: "" })}><option value="">Selecione uma área</option>{catalog.areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
    {value.areaId && value.goalSource !== "custom" && <>
      <div className="form-field"><label htmlFor="career-role">Cargo ou especialização</label><select id="career-role" value={value.goalId ?? ""} onChange={e => { const next = catalog.goals.find(g => g.id === e.target.value); if(next) onChange(chooseGoal(value, next)); }}><option value="">Selecione um objetivo</option>{catalog.goals.filter(g => g.area_id === value.areaId).map(g => <option key={g.id} value={g.id}>{g.title}</option>)}</select></div>
      {goal?.description && <p className="muted text-xs leading-7">{goal.description}</p>}
      {Boolean(goal?.seniorities.length) && <div className="form-field"><label htmlFor="career-seniority">Senioridade desejada (opcional)</label><select id="career-seniority" value={value.seniority ?? ""} onChange={e => { if(goal) onChange(chooseGoal(value, goal, e.target.value)); }}><option value="">Não definir agora</option>{goal?.seniorities.map(s => <option key={s}>{s}</option>)}</select></div>}
    </>}
    <Button type="button" variant="outline" className="w-full h-auto whitespace-normal mt-4" onClick={() => onChange(customGoal(value, value.goalSource === "custom" ? value.goal : ""))}>Não encontrei meu objetivo. Quero descrevê-lo.</Button>
    {value.goalSource === "custom" && <div className="form-field"><label htmlFor="career-custom">Descreva seu objetivo profissional</label><textarea id="career-custom" maxLength={2000} value={value.goal} onChange={e => onChange(customGoal(value, e.target.value))} placeholder="Quero me tornar Arquiteto de Software" /></div>}
    {value.goalSource === "custom" && <Button type="button" variant="ghost" onClick={() => onChange({...value, goalSource:"catalog",goal:"",goalId:""})}>Voltar ao catálogo</Button>}
  </div>;
}