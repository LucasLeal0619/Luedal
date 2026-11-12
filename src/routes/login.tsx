import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";
import { meta } from "@/lib/career";
export const Route = createFileRoute("/login")({head:()=>meta("Entrar","Entre na sua conta Luedal para continuar sua evolução."),component:()=> <AuthForm mode="login"/>});
