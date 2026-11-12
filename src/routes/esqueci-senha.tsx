import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";
import { meta } from "@/lib/career";
export const Route = createFileRoute("/esqueci-senha")({head:()=>meta("Recuperar acesso","Solicite um link seguro para recuperar sua conta Luedal."),component:()=> <AuthForm mode="forgot"/>});