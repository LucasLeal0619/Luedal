import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";
import { meta } from "@/lib/career";
export const Route = createFileRoute("/cadastro")({head:()=>meta("Criar conta","Cadastre seu perfil privado e comece sua evolução na Luedal."),component:()=> <AuthForm mode="signup"/>});