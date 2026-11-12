import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";
import { meta } from "@/lib/career";
export const Route = createFileRoute("/")({
  head: () =>
    meta(
      "Seu próximo passo em tecnologia",
      "Mapeie suas competências, registre evidências e descubra sua rota de evolução profissional.",
    ),
  component: () => <AuthForm mode="login"/>,
});
