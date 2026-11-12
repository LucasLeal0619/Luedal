import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Brand } from "./luedal-shell";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useCareer } from "@/lib/career-context";
import { authError, destination, emailSchema, passwordSchema, resetSchema, signupSchema } from "@/lib/auth-rules";
import "@lovable.dev/cloud-auth-js/styles.css";
export function AuthForm({mode}: {mode:"login"|"signup"|"forgot"|"reset"}) {
  const navigate = useNavigate();
  const {userId,loading,data,startDemo,logout} = useCareer();
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [confirm,setConfirm]=useState("");
  const [show,setShow]=useState(false); const [busy,setBusy]=useState(false); const [error,setError]=useState(""); const [notice,setNotice]=useState(""); const [recovery,setRecovery]=useState(false);
  useEffect(() => { if(mode !== "reset" && !loading && userId) void navigate({to:destination(data.onboarded),replace:true}); },[mode,loading,userId,data.onboarded,navigate]);
  useEffect(() => {
    if(mode !== "reset") return;
    let alive=true;
    const verify = async () => {
      const hash=new URLSearchParams(window.location.hash.slice(1));
      const params=new URLSearchParams(window.location.search);
      if(hash.has("error") || params.has("error")) {setError("Este link é inválido ou expirou. Solicite um novo link.");return;}
      // getUser waits for the client to finish consuming an implicit recovery link.
      const {data:{user}}=await supabase.auth.getUser();
      const fromLink=hash.get("type")==="recovery";
      const marked=sessionStorage.getItem("luedal-recovery")===user?.id;
      if(!alive) return;
      if(user && (fromLink || marked)) { sessionStorage.setItem("luedal-recovery",user.id); setRecovery(true); window.history.replaceState(null,"",window.location.pathname); }
      else setError("Este link é inválido, expirou ou já foi utilizado. Solicite um novo link.");
    }; void verify(); return () => {alive=false;};
  },[mode,userId]);
  async function submit() {
    setError("");setNotice("");
    const validation=mode==="signup" ? signupSchema.safeParse({name,email,password,confirm}) : mode==="reset" ? resetSchema.safeParse({password,confirm}) : mode==="forgot" ? emailSchema.safeParse(email) : emailSchema.safeParse(email);
    if(!validation.success) {setError(validation.error.issues[0]?.message ?? "Confira os campos.");return;}
    if(mode==="login" && !password) {setError("Informe sua senha.");return;}
    if(mode==="reset" && !recovery) {setError("Solicite um link válido para redefinir sua senha.");return;}
    setBusy(true);
    try {
      if(mode==="forgot") {
        const {error}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:`${window.location.origin}/redefinir-senha`});
        if(error) setError(authError(error.code)); else setNotice("Se houver uma conta com este e-mail, você receberá um link de recuperação. Confira também o spam.");
      } else if(mode==="reset") {
        const {error}=await supabase.auth.updateUser({password});
        if(error) setError(authError(error.code)); else {setRecovery(false);sessionStorage.removeItem("luedal-recovery");await logout();setError("");setNotice("Senha atualizada. Entre com sua nova senha.");}
      } else {
        const result=mode==="signup" ? await supabase.auth.signUp({email:email.trim(),password,options:{data:{full_name:name.trim()},emailRedirectTo:window.location.origin+"/login"}}) : await supabase.auth.signInWithPassword({email:email.trim(),password});
        if(result.error) setError(authError(result.error.code));
        else if(!result.data.session) setNotice("Confira seu e-mail para confirmar a conta antes de entrar.");
        else {const {data:row,error}=await supabase.from("profiles").select("career_data").eq("id",result.data.session.user.id).maybeSingle();if(error) setError("Não foi possível carregar seu perfil. Tente novamente.");else {const complete=row?.career_data && typeof row.career_data==="object" && !Array.isArray(row.career_data) && row.career_data['onboarded']===true;await navigate({to:destination(Boolean(complete)),replace:true});}}
      }
    } catch {setError(authError());} finally {setBusy(false);}
  }
  async function social(provider:"google"|"lovable") {setBusy(true);setError("");try {const result=await lovable.auth.signInWithOAuth(provider,{redirect_uri:window.location.origin+"/login"});if(result.error) setError(authError());} catch {setError(authError());} finally{setBusy(false);}}
  const hasPassword=mode!=="forgot"; const confirmPassword=mode==="signup"||mode==="reset";
  return <main className="panel auth-card">
    <Brand />
    <h1>{mode==="login"?"Bem-vindo de volta":mode==="signup"?"Crie sua conta":mode==="forgot"?"Esqueceu sua senha?":"Redefinir senha"}</h1>
    <p>{mode==="forgot"?"Informe o e-mail cadastrado na Luedal para receber um link de redefinição de senha.":mode==="signup"?"Sua evolução começa com seu perfil real.":mode==="reset"?"Escolha uma nova senha para sua conta.":"Entre para continuar sua evolução profissional."}</p>
    {(mode==="login"||mode==="signup") && <><div className="flex flex-col gap-3"><Button variant="outline" className="w-full" disabled={busy} onClick={()=>void social("google")}>Continuar com Google</Button><Button variant="outline" className="lovable-auth-button w-full" disabled={busy} onClick={()=>void social("lovable")}>Continue with Lovable</Button></div><div className="auth-divider">ou com seu e-mail</div></>}
    {(mode!=="reset" || recovery) && !notice.includes("Senha atualizada") && <form onSubmit={e=>{e.preventDefault();void submit();}}>
      {mode==="signup" && <div className="form-field"><label htmlFor="auth-name">Nome completo</label><input id="auth-name" autoComplete="name" maxLength={80} required value={name} onChange={e=>setName(e.target.value)} /></div>}
      {mode!=="reset" && <div className="form-field"><label htmlFor="auth-email">E-mail</label><input id="auth-email" type="email" autoComplete="email" maxLength={255} required value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@exemplo.com" /></div>}
      {hasPassword && <div className="form-field"><label htmlFor="auth-password">{mode==="reset"?"Nova senha":"Senha"}</label><div className="relative"><input id="auth-password" className="pr-12" type={show?"text":"password"} autoComplete={mode==="login"?"current-password":"new-password"} maxLength={128} minLength={mode==="login"?1:8} required value={password} onChange={e=>setPassword(e.target.value)} /><Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1" aria-label={show?"Ocultar senha":"Mostrar senha"} onClick={()=>setShow(!show)}>{show?<EyeOff/>:<Eye/>}</Button></div>{confirmPassword && <p className={`text-xs mt-2 ${passwordSchema.safeParse(password).success?"text-success":"text-muted-foreground"}`}>Pelo menos 8 caracteres</p>}</div>}
      {confirmPassword && <div className="form-field"><label htmlFor="auth-confirm">Confirmar {mode==="reset"?"nova ":""}senha</label><input id="auth-confirm" type={show?"text":"password"} autoComplete="new-password" maxLength={128} required value={confirm} onChange={e=>setConfirm(e.target.value)} /></div>}
      <Button className="w-full" disabled={busy}>{busy?"Aguarde…":mode==="signup"?"Criar conta":mode==="forgot"?"Enviar link de recuperação":mode==="reset"?"Salvar nova senha":"Entrar"}<ArrowRight/></Button>
    </form>}
    {error && <p role="alert" className="text-destructive text-xs leading-6 mt-4">{error}</p>}{notice && <p role="status" className="text-success text-xs leading-6 mt-4">{notice}</p>}
    <div className="flex flex-col gap-3 text-center text-xs mt-6">
      {mode==="login"?<><Link to="/esqueci-senha" className="text-primary">Esqueceu sua senha?</Link><Link to="/cadastro" className="text-primary">Não tem uma conta? Cadastre-se</Link></>:<Link to="/login" className="text-primary">Voltar para o login</Link>}
      {mode==="reset" && !recovery && <Link to="/esqueci-senha" className="text-primary">Solicitar novo link</Link>}
    </div>
    {mode==="login" && <><div className="auth-divider">conheça primeiro</div><Button variant="outline" className="w-full" onClick={()=>{startDemo();void navigate({to:"/dashboard"});}}>Explorar demonstração</Button></>}
    <p className="text-xs text-muted-foreground text-center mt-6"><Link to="/privacidade">Privacidade</Link> · <Link to="/termos">Termos</Link></p>
  </main>;
}