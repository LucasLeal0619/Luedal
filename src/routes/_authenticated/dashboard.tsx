import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/dashboard";
import { meta } from "@/lib/career";
export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => meta("Dashboard", "Seu objetivo, suas evidências e seu próximo passo profissional."),
  component: Dashboard,
});
