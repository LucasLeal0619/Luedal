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
          e evidências. Perfis e conversas são privados e vinculados à conta autenticada.
        </p>
        <h2 className="mt-8">Controle e transparência</h2>
        <p>
          Você pode editar seu perfil, remover evidências e exportar seus dados nas configurações. O
          assistente envia suas mensagens, uma janela limitada do histórico e informações do
          seu perfil a um provedor de inteligência artificial para gerar respostas. Não envie
          senhas ou informações confidenciais. As conversas são armazenadas na sua conta.
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
