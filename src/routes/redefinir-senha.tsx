import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";
import { meta } from "@/lib/career";
export const Route = createFileRoute("/redefinir-senha")({head:()=>meta("Redefinir senha","Defina uma nova senha com seu link de recuperação Luedal."),component:()=> <AuthForm mode="reset"/>});
