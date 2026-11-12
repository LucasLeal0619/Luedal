import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Copy, History, Plus, Send, Sparkles, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useCareer } from "@/lib/career-context";
import { loadChat, sendChat } from "@/lib/chat.functions";
type Message = {id:string;role:string;content:string};
const ChatContext = createContext<{open:()=>void}|null>(null);
export function useAssistant() {const c=useContext(ChatContext);if(!c) throw new Error("AssistantProvider required");return c;}
export function AssistantProvider({children}:{children:ReactNode}) {
  const {userId,demo,data}=useCareer(); const location=useLocation();
  const load=useServerFn(loadChat); const send=useServerFn(sendChat);
  const [open,setOpen]=useState(false); const [history,setHistory]=useState(false);const [messages,setMessages]=useState<Message[]>([]);const [conversations,setConversations]=useState<{id:string;title:string}[]>([]);
  const [id,setId]=useState<string|null>(null);const [input,setInput]=useState("");const [busy,setBusy]=useState(false);const [loading,setLoading]=useState(false);const [error,setError]=useState("");
  const end=useRef<HTMLDivElement>(null);const owner=useRef(userId);owner.current=userId;
  useEffect(()=>{setOpen(false);setId(null);setMessages([]);setConversations([]);setInput("");setError("");setBusy(false);},[userId]);
  useEffect(()=>{end.current?.scrollIntoView({behavior:"auto",block:"end"});},[messages,busy]);
  async function restore(next:string|null) { if(!userId)return;const account=userId;setLoading(true);setError("");try {const r=await load({data:{id:next}});if(owner.current!==account)return;setConversations(r.conversations);setId(r.id);setMessages(r.messages);}catch{if(owner.current===account)setError("Não foi possível carregar o histórico. Tente novamente.");}finally{if(owner.current===account)setLoading(false);}}
  async function ask(text:string) {
    if(!userId || busy || loading || !text.trim())return;
    const account=userId;const message=text.trim();setInput(message);setBusy(true);setError("");
    try {
      const r=await send({data:{conversationId:id,message,page:location.pathname}});
      if(owner.current!==account)return;
      if(r.error){setError(r.error);setId(r.id);return;}
      setInput("");setId(r.id);setMessages(m=>[...m,{id:crypto.randomUUID(),role:"user",content:message},{id:crypto.randomUUID(),role:"assistant",content:r.text ?? ""}]);
      const result=await load({data:{id:r.id}});if(owner.current===account)setConversations(result.conversations);
    }catch{if(owner.current===account)setError("Não foi possível enviar. Sua mensagem foi preservada; tente novamente.");}finally{if(owner.current===account)setBusy(false);}
  }
  return <ChatContext.Provider value={{open:()=>{setOpen(true);if(userId && !id && !messages.length)void restore(null);}}}>
    {children}
    {open && <aside className="ai-panel" aria-label="Luedal AI">
      <div className="ai-head"><div><h2 className="panel-title"><Sparkles className="text-primary"/>Luedal AI</h2><p className="text-xs text-muted-foreground mt-2">{userId?data.name || "Minha conta":demo?"Demonstração · sem acesso à IA privada":"Entre para conversar"}</p></div><div className="flex gap-1"><Button variant="ghost" size="icon" title="Histórico de conversas" aria-label="Histórico de conversas" disabled={!userId||busy||loading} onClick={()=>setHistory(!history)}><History/></Button><Button variant="ghost" size="icon" title="Nova conversa" aria-label="Nova conversa" disabled={!userId||busy||loading} onClick={()=>{setId(null);setMessages([]);setInput("");setError("");setHistory(false);}}><Plus/></Button><Button variant="ghost" size="icon" aria-label="Fechar assistente" onClick={()=>setOpen(false)}><X/></Button></div></div>
      {history && <div className="chat-history">{conversations.length?conversations.map(c=><Button key={c.id} variant={c.id===id?"secondary":"ghost"} className="justify-start h-auto whitespace-normal text-left text-xs" onClick={()=>{setHistory(false);void restore(c.id);}}>{c.title}</Button>):<p className="text-xs text-muted-foreground">Nenhuma conversa salva.</p>}</div>}
      <div className="ai-messages">
        {!userId?<div className="chat-bubble"><p>A conversa utiliza somente seu perfil privado. Entre na sua conta para conversar com a Luedal AI.</p><Button asChild className="mt-4"><Link to="/login" onClick={()=>setOpen(false)}>Entrar</Link></Button></div>:<>
          {!messages.length && !loading && <><div className="chat-bubble">Olá{data.name?`, ${data.name}`:""}! O que você gostaria de conversar hoje?</div><div className="chat-suggestions">{["Qual é meu próximo passo?","Analise minhas competências","Explique minha rota","O que é Docker?"].map(q=><Button key={q} variant="outline" className="whitespace-normal text-left h-auto py-3 text-xs justify-start" disabled={busy} onClick={()=>void ask(q)}>{q}</Button>)}</div></>}
          {loading && <p role="status" className="text-xs text-muted-foreground">Carregando conversa…</p>}
          {messages.map(m=><div key={m.id} className={`chat-bubble ${m.role==="user"?"user-message":""}`}><span className="text-[10px] text-muted-foreground">{m.role==="user"?"Você":"Luedal AI"}</span><div className="chat-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown></div>{m.role==="assistant" && <Button variant="ghost" size="icon" title="Copiar resposta" aria-label="Copiar resposta" onClick={()=>{void navigator.clipboard.writeText(m.content).then(()=>toast.success("Resposta copiada."),()=>toast.error("Não foi possível copiar."));}}><Copy size={13}/></Button>}</div>)}
          {busy && <p role="status" className="text-xs text-muted-foreground">Luedal AI está preparando uma resposta…</p>}
        </>}
        {error && <div role="alert" className="text-xs text-destructive leading-6">{error}<Button variant="link" disabled={busy||loading} onClick={()=>{if(input)void ask(input);else void restore(id);}}>Tentar novamente</Button></div>}
        <div ref={end}/>
      </div>
      <form className="ai-form" onSubmit={e=>{e.preventDefault();void ask(input);}}><textarea aria-label="Mensagem para Luedal AI" placeholder="Converse sobre sua evolução…" rows={2} maxLength={2000} disabled={!userId||busy||loading} value={input} onChange={e=>{setInput(e.target.value);e.target.style.height="auto";e.target.style.height=`${Math.min(160,e.target.scrollHeight)}px`;}} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();void ask(input);}}}/><Button size="icon" aria-label="Enviar mensagem" disabled={!userId||busy||loading||!input.trim()}><Send/></Button></form>
    </aside>}
  </ChatContext.Provider>;
}