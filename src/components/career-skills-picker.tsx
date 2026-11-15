import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { levels, type CareerData } from "@/lib/career";
import { profileSkills, suggestedSkills, type CareerCatalog } from "@/lib/career-catalog";
export function CareerSkillsPicker({value,catalog,onChange}: {value:CareerData;catalog:CareerCatalog;onChange:(value:CareerData)=>void}) {
  const [query,setQuery]=useState("");
  const all=profileSkills(value,catalog);
  const suggestions=suggestedSkills(value,catalog);
  const visible=all.filter(s => query ? s.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()) : suggestions.some(v=>v.id===s.id) || value.familiarity[s.id]!==undefined || value.customSkills?.some(v=>v.id===s.id));
  return <div>
    <p className="muted text-xs leading-7">Sua autoavaliação não é uma validação técnica. Você pode avaliar depois.</p>
    <div className="form-field"><label htmlFor="skill-search">Pesquisar no catálogo geral ou adicionar competência</label><input id="skill-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Nome da competência" /></div>
    {query.trim() && !all.some(s=>s.name.toLocaleLowerCase()===query.trim().toLocaleLowerCase()) && <Button type="button" variant="outline" onClick={()=>{onChange({...value,customSkills:[...(value.customSkills??[]),{id:crypto.randomUUID(),name:query.trim(),category:"Minhas competências",prerequisites:[],activity:"",priority:0}]});setQuery("");}}><Plus/>Adicionar {query.trim()}</Button>}
    {!visible.length && <p className="muted text-sm py-4">Nenhuma sugestão cadastrada para esta área. Pesquise ou adicione suas competências.</p>}
    {visible.map(s=><div className="form-field" key={s.id}><label htmlFor={`skill-${s.id}`}>{s.name}</label><select id={`skill-${s.id}`} value={value.familiarity[s.id]??""} onChange={e=>{const familiarity={...value.familiarity};if(e.target.value==="") delete familiarity[s.id];else familiarity[s.id]=Number(e.target.value);onChange({...value,familiarity});}}><option value="">Prefiro avaliar depois</option>{levels.map((l,i)=><option key={l} value={i}>{l}</option>)}</select></div>)}
  </div>;
}