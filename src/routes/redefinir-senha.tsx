import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Brand } from "@/components/luedal-shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { meta } from "@/lib/career";
export const Route = createFileRoute("/redefinir-senha")({
  head: () => meta("Redefinir senha", "Defina uma nova senha para acessar sua conta Luedal."),
  component: Reset,
});
function Reset() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <main className="panel auth-card">
      <Brand />
      <h1>Nova senha</h1>
      <p>Use o link enviado ao seu e-mail para recuperar sua conta.</p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          const { error } = await supabase.auth.updateUser({ password });
          setMessage(error ? error.message : "Senha atualizada. Você já pode acessar sua conta.");
          setBusy(false);
        }}
      >
        <label htmlFor="new-password">Nova senha</label>
        <input
          id="new-password"
          type="password"
          minLength={8}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button disabled={busy} className="w-full mt-5">
          Salvar nova senha
        </Button>
      </form>
      {message && (
        <p role="status" className="muted text-xs leading-7 mt-5">
          {message}
        </p>
      )}
      <Link to="/login" className="text-link mt-5">
        Voltar para entrar →
      </Link>
    </main>
  );
}
