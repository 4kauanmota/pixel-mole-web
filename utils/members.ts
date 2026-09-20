import type { MemberSummary } from "~/types/member";

// Busca todos os membros para a listagem (/members), com a MESMA query que
// já vivia dentro daquela página — extraída pra cá sem nenhuma alteração de
// comportamento, no mesmo espírito de fetchAllGames (utils/games.ts): assim
// qualquer outro lugar que precise da equipe (hoje, a prévia da nova home em
// `/`) reaproveita esta função em vez de duplicar a query.
export async function fetchAllMembers(supabase: any): Promise<MemberSummary[]> {
  // Listagem só precisa de nome e cargo (ver types/member.ts) — nada de
  // bio, redes sociais ou jogos aqui, que só a página individual usa.
  //
  // Sem "photo": a tabela `members` não tem essa coluna (a foto vem dos
  // assets do projeto, não do Supabase — ver utils/memberPhotos.ts).
  // Pedir uma coluna inexistente faz a query INTEIRA falhar (erro
  // "column does not exist"), o que já aconteceu aqui antes e deixava a
  // grade vazia sem nenhum aviso visível.
  // Ordem sempre pelo `id` (crescente) — pedido explícito do usuário, nunca
  // por nome/data de criação/qualquer outro campo.
  const { data, error } = await supabase
    .from("members")
    .select("id, name, nick, default_role")
    .order("id", { ascending: true });

  if (error) {
    console.error("[Supabase] Erro ao buscar members:", error);
  }

  return ((data as any[]) ?? []).map(mapMemberSummary);
}
