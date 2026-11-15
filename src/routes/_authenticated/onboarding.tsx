import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowLeft, Plus, Trash2, Save, LogOut } from "lucide-react";
import { Brand } from "@/components/luedal-shell";
import { Button } from "@/components/ui/button";
import { CareerGoalPicker } from "@/components/career-goal-picker";
import { CareerSkillsPicker } from "@/components/career-skills-picker";
import { useCareer } from "@/lib/career-context";
import { analyze, meta, type Evidence } from "@/lib/career";
import { limitedMappingMessage } from "@/lib/career-catalog";
import { toast } from "sonner";
export const Route = createFileRoute("/_authenticated/onboarding")({head:()=>meta("Começar minha evolução","Defina sua carreira, registre competências e retome seu perfil profissional."),component:Onboarding});
function Onboarding(){
 const {data,update,loading,catalog,logout}=useCareer();
 const navigate=useNavigate();
 const [form,setForm]=useState(data);const [step,setStep]=useState(data.onboardingStep??0);const [busy,setBusy]=useState(false);const initialized=useRef(false);
 useEffect(()=>{if(!loading&&!initialized.current){setForm(data);setStep(data.onboardingStep??0);initialized.current=true;}},[loading,data]);
 const a=analyze(form,catalog);
 async function save(nextStep=step,finish=false){setBusy(true);const next={...form,onboardingStep:nextStep,onboarded:finish||form.onboarded};const ok=await update(next);if(ok){setForm(next);setStep(nextStep);if(finish) await navigate({to:"/dashboard"});}setBusy(false);return ok;}
 function addProject(){const e:Evidence={id:crypto.randomUUID(),title:"",type:"Projeto pessoal",description:"",date:"",url:"",skills:[],contribution:""};setForm({...form,evidences:[...form.evidences,e]});}
 function editProject(id:string,key:keyof Evidence,value:string){setForm({...form,evidences:form.evidences.map(e=>e.id===id?{...e,[key]:value}:e)});}
 const valid=step===0?Boolean(form.name.trim()&&form.situation.trim()):step===1?Boolean(form.goal.trim()):step===3?form.evidences.every(e=>e.title.trim()):true;
 if(loading)return <div className="loading-page">Carregando seu perfil…</div>;
 return <div className="welcome-container">
 <div className="flex justify-between items-center gap-4"><Brand/><Button variant="ghost" onClick={()=>void logout()}><LogOut/>Sair</Button></div>
 <div className="flex justify-between mt-8"><span className="muted text-xs">Seu ponto de partida</span><span className="muted text-xs">Etapa {step+1} de 5</span></div>
 <div className="onboard-progress">{[0,1,2,3,4].map(n=><span className={n<=step?"filled":""} key={n}/>)}</div>
 <section className="onboard-card">
 {step===0&&<><h1>Quem é você e qual seu momento profissional?</h1><div className="form-field"><label htmlFor="onboard-name">Como você prefere ser chamado?</label><input id="onboard-name" maxLength={80} value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div><div className="form-field"><label htmlFor="onboard-situation">Seu momento profissional</label><input id="onboard-situation" maxLength={150} value={form.situation} onChange={e=>setForm({...form,situation:e.target.value})} placeholder="Estudante, profissional experiente, em transição…"/></div></>}
 {step===1&&<><h1>Onde você quer chegar na sua carreira em tecnologia?</h1><CareerGoalPicker value={form} catalog={catalog} onChange={setForm}/></>}
 {step===2&&<><h1>Quais competências você já possui?</h1><CareerSkillsPicker value={form} catalog={catalog} onChange={setForm}/></>}
 {step===3&&<><h1>Quais projetos e experiências deseja registrar?</h1>{form.evidences.map((e,i)=><div key={e.id} className="border-b border-border py-5"><div className="flex justify-between"><h2 className="panel-title">Experiência {i+1}</h2><Button variant="ghost" size="icon" aria-label={`Remover experiência ${i+1}`} onClick={()=>setForm({...form,evidences:form.evidences.filter(v=>v.id!==e.id)})}><Trash2/></Button></div><div className="form-field"><label htmlFor={`project-title-${i}`}>Título do projeto ou experiência</label><input id={`project-title-${i}`} maxLength={150} value={e.title} onChange={v=>editProject(e.id,"title",v.target.value)}/></div><div className="form-field"><label htmlFor={`project-type-${i}`}>Tipo</label><select id={`project-type-${i}`} value={e.type} onChange={v=>editProject(e.id,"type",v.target.value)}>{["Projeto pessoal","Projeto acadêmico","Experiência profissional","Curso ou certificação","Atividade prática"].map(t=><option key={t}>{t}</option>)}</select></div><div className="form-field"><label htmlFor={`project-description-${i}`}>Descrição</label><textarea id={`project-description-${i}`} value={e.description} onChange={v=>editProject(e.id,"description",v.target.value)}/></div><div className="form-field"><label htmlFor={`project-contribution-${i}`}>Sua contribuição</label><textarea id={`project-contribution-${i}`} value={e.contribution} onChange={v=>editProject(e.id,"contribution",v.target.value)}/></div><div className="form-field"><label htmlFor={`project-url-${i}`}>URL (opcional)</label><input id={`project-url-${i}`} type="url" value={e.url} onChange={v=>editProject(e.id,"url",v.target.value)}/></div></div>)}<Button variant="outline" className="mt-5" onClick={addProject}><Plus/>Adicionar projeto ou experiência</Button></>}
 {step===4&&<><h1>Revisão do seu perfil</h1><div className="settings-row"><span>Nome</span><strong>{form.name}</strong></div><div className="settings-row"><span>Momento profissional</span><strong>{form.situation}</strong></div><div className="settings-row"><span>Objetivo</span><strong className="text-sm break-words">{form.goal}</strong></div><div className="settings-row"><span>Competências declaradas</span><strong>{a.mapped.length}</strong></div><div className="settings-row"><span>Projetos e experiências</span><strong>{form.evidences.length}</strong></div><p className="muted text-sm leading-7 mt-5">{!a.supported?limitedMappingMessage:!a.hasData?"Ainda não há dados suficientes para um diagnóstico. Seu objetivo continuará salvo.":"Seu diagnóstico considera competências declaradas, evidências e pré-requisitos cadastrados; não representa uma avaliação técnica."}</p></>}
 <div className="form-actions flex-wrap">{step>0&&<Button variant="outline" disabled={busy} onClick={()=>void save(step-1)}><ArrowLeft/>Voltar</Button>}<Button variant="outline" disabled={busy} onClick={async()=>{if(await save())toast.success("Progresso salvo. Você pode retomar depois.");}}><Save/>Salvar progresso</Button><Button disabled={busy||!valid} onClick={()=>void save(Math.min(step+1,4),step===4)}>{busy?"Salvando…":step===4?"Concluir perfil":"Continuar"}<ArrowRight/></Button></div>
 </section></div>;
}
