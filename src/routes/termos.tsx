import { createFileRoute } from "@tanstack/react-router";
import { PublicHeader } from "@/components/luedal-shell";
import { meta } from "@/lib/career";
export const Route = createFileRoute("/termos")({
  head: () =>
    meta("Termos do beta", "Informações sobre o escopo e os limites da versão beta da Luedal."),
  component: Terms,
});
function Terms() {
  return (
    <>
      <PublicHeader />
      <main className="landing-section">
        <span className="tag">Documento em preparação · Beta</span>
        <h1 className="text-3xl my-6">Termos do beta</h1>
        <p>
          A Luedal é uma plataforma de evolução profissional em tecnologia em desenvolvimento. O
          objetivo atualmente suportado é Desenvolvedor Backend Júnior com Node.js / TypeScript.
        </p>
        <h2 className="mt-8">Limites da experiência</h2>
        <p>
          Competências declaradas e evidências registradas não equivalem a validação técnica.
          Recomendações são calculadas por regras explícitas e não garantem contratação, nível
          profissional ou resultados de carreira. O assistente da versão atual é demonstrativo.
        </p>
        <h2 className="mt-8">Conteúdo fornecido pelo usuário</h2>
        <p>
          Registre apenas informações e evidências que você está autorizado a compartilhar. Não
          inclua senhas, chaves de acesso, dados confidenciais de terceiros ou informações restritas
          de empresas.
        </p>
        <h2 className="mt-8">Termos definitivos</h2>
        <p>
          A identificação da empresa responsável, os canais de atendimento e os termos jurídicos
          definitivos precisam ser fornecidos e revisados antes do lançamento público.
        </p>
      </main>
    </>
  );
}
