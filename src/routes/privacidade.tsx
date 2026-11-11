import { createFileRoute } from "@tanstack/react-router";
import { PublicHeader } from "@/components/luedal-shell";
import { meta } from "@/lib/career";
export const Route = createFileRoute("/privacidade")({
  head: () =>
    meta("Privacidade", "Transparência sobre dados profissionais e o ambiente beta da Luedal."),
  component: Privacy,
});
function Privacy() {
  return (
    <>
      <PublicHeader />
      <main className="landing-section">
        <span className="tag">Documento em preparação · Beta</span>
        <h1 className="text-3xl my-6">Privacidade na Luedal</h1>
        <p>
          Seu perfil profissional inclui informações que você fornece: nome, objetivo, competências
          e evidências. Perfis de contas são privados e vinculados ao usuário. O ambiente
          demonstrativo usa dados fictícios e mantém suas alterações apenas nesta sessão do
          navegador.
        </p>
        <h2 className="mt-8">Controle e transparência</h2>
        <p>
          Você pode editar seu perfil, remover evidências e exportar seus dados nas configurações. O
          assistente demonstrativo utiliza as informações do perfil por regras locais; não envia
          suas mensagens a um provedor externo de IA.
        </p>
        <h2 className="mt-8">Antes do lançamento público</h2>
        <p>
          A política definitiva, a identificação do responsável pelo tratamento e os canais para
          solicitações LGPD ainda precisam ser fornecidos e revisados. Este texto informativo não
          substitui uma política de privacidade definitiva.
        </p>
      </main>
    </>
  );
}
