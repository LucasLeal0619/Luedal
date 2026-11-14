<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Application architecture
- Keep professional evolution rules and the catalog in a browser-safe domain module, separate from UI and persistence; deterministic recommendations must stay testable without an AI provider.
- Persist career aggregates exclusively in user-owned Cloud profiles guarded by RLS; anonymous visitors never receive workspace data.
- Use one shared career context and application shell across distinct file routes; profile changes immediately recompute gaps and career recommendations.
- Use React Flow for interactive prerequisite graphs rather than a decorative graph implementation.
- Keep conversational inference in authenticated server functions through the AI Gateway; read context and bounded history with user-scoped RLS, never accept profile identity from the browser.
- Mount the assistant in the root career provider so navigation preserves conversations; only authenticated sessions invoke inference.
- Gate workspace pages in the client-only authenticated layout without browser-storage bypasses; backend handlers independently enforce authentication and ownership.
- Construct chat message pairs in a browser-safe persistence helper with explicit timestamps on every row; heterogeneous bulk inserts otherwise null omitted required columns.
- Centralize sign-out sequencing in the career provider with a tested helper and replace navigation to login; all exit controls must clear the current session and protected cache consistently.
