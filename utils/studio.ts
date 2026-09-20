import type { Studio, StudioSocial } from "~/types/studio";

// Busca o registro único do estúdio (nome, redes sociais...) — uma única
// linha na tabela `studio` (não uma listagem), por isso `.maybeSingle()` em
// vez de `.select()` simples: `maybeSingle()` devolve `null` (não um erro)
// quando a tabela ainda não tem nenhuma linha, o que é um estado válido
// (estúdio "ainda não cadastrado") e precisa ser tratado sem quebrar a
// Home/Footer — ver useStudio.ts.
export async function fetchStudio(supabase: any): Promise<Studio | null> {
  const { data, error } = await supabase
    .from("studio")
    .select("*")
    .maybeSingle();

  // Diagnóstico explícito, em vez de simplesmente cair no fallback em
  // silêncio: as redes sociais do Footer/Home dependem inteiramente desta
  // linha existir e vir com o formato certo, e sem esses avisos um problema
  // no lado do Supabase (RLS, nome de coluna errado, linha nunca criada)
  // fica indistinguível de "não há redes cadastradas" — o mesmo estado
  // visual (nada aparece), causas bem diferentes. Cada `console.warn` aqui
  // aponta exatamente o que checar no painel do Supabase.
  if (error) {
    // PostgREST costuma devolver isto (não um erro de rede) quando a RLS
    // bloqueia a leitura anônima da tabela — o sintoma é idêntico a "não
    // existe nenhuma linha" (Footer/Home ficam sem nome/redes), mas a causa
    // e a correção são bem diferentes (uma policy de SELECT público,
    // igual à que já existe em `games`/`members`, e não um dado faltando).
    console.error(
      '[studio] Falha ao consultar a tabela "studio" no Supabase — nome/redes sociais não vão aparecer até isso ser corrigido. Verifique no painel do Supabase: 1) a tabela "studio" existe; 2) ela tem uma política de RLS permitindo SELECT público (anon), igual à de "games"/"members". Erro original:',
      error,
    );
    return null;
  }

  if (!data) {
    // Confirmado ao vivo (consulta direta à API pública do Supabase, com a
    // mesma anon key que o site usa): a tabela "studio" devolve 0 linhas
    // pro role anônimo (`Content-Range: */0`), enquanto "games"/"members"
    // devolvem os dados normalmente com a MESMA key. Ou seja, o problema é
    // específico da tabela "studio" — e `.maybeSingle()` não distingue "a
    // tabela está mesmo vazia" de "existe uma linha, mas RLS esconde ela do
    // anon" (os dois casos chegam aqui do mesmo jeito). No painel do
    // Supabase (logado como dono — isso ENXERGA através da RLS), confira:
    // 1) existe uma linha na tabela "studio"? Se não, crie uma com "name" e
    //    "socials" preenchidos.
    // 2) se a linha existe, a tabela tem uma policy de RLS permitindo
    //    SELECT público (anon)? Tabela nova no Supabase nasce com RLS
    //    ligado e SEM nenhuma policy — mesma causa raiz já documentada em
    //    utils/games.ts pra "game_links"/"game_members". Policy mínima:
    //    CREATE POLICY "Public read" ON public.studio FOR SELECT USING (true);
    console.warn(
      '[studio] A tabela "studio" respondeu sem erro, mas não retornou nenhuma linha (confirmado ao vivo: a API pública devolve 0 registros, igual pro anon). Verifique no painel do Supabase (logado como dono): 1) existe uma linha na tabela "studio" com "name"/"socials" preenchidos? 2) se sim, existe uma policy de RLS de SELECT público nessa tabela (igual "games"/"members" já têm)? Até isso ser corrigido no Supabase, nome/redes sociais do estúdio ficam nos valores de fallback do código.',
    );
    return null;
  }

  if (typeof data.name !== "string" || !data.name) {
    console.warn(
      '[studio] A linha de "studio" foi encontrada, mas a coluna "name" está vazia ou não existe com esse nome exato — confirme o nome da coluna no Supabase.',
    );
  }

  // Formato ATUAL confirmado pelo usuário direto do conteúdo gravado no
  // Supabase: `socials` é um ARRAY de objetos `{ platform, url }` — ex.
  // [{ "platform": "instagram", "url": "https://..." }]. Já foi um objeto
  // simples `{ plataforma: url }` numa rodada anterior; o usuário trocou o
  // formato gravado no banco pra este array (mesmo formato de
  // game_links/member_socials), então o parsing segue essa mudança — ver
  // types/studio.ts pro histórico.
  const rawSocials = data.socials;
  if (rawSocials != null && !Array.isArray(rawSocials)) {
    console.warn(
      '[studio] A coluna "socials" existe mas não é um array JSON (esperado: [{ "platform": "...", "url": "..." }]) — o formato atual não é reconhecido e nenhuma rede social vai aparecer. Valor recebido:',
      rawSocials,
    );
  }

  // `socials` é jsonb — pode vir `null` (campo nunca preenchido) ou, em
  // teoria, com alguma entrada incompleta (edição manual direto no banco).
  // O filter descarta qualquer entrada sem `platform`/`url` válidos em vez
  // de deixar um link quebrado (ou um crash) aparecer no Footer/`/links` —
  // mesmo espírito do filter de linhas órfãs em mapGame (utils/mappers.ts).
  const socials: StudioSocial[] = Array.isArray(rawSocials)
    ? rawSocials.filter(
        (s: any) =>
          s &&
          typeof s.platform === "string" &&
          s.platform &&
          typeof s.url === "string" &&
          s.url,
      )
    : [];

  if (
    Array.isArray(rawSocials) &&
    rawSocials.length > 0 &&
    socials.length === 0
  ) {
    console.warn(
      '[studio] A coluna "socials" tem itens, mas nenhum passou na validação (cada item precisa de "platform" e "url" como texto não vazio) — confira o formato exato gravado no Supabase. Valor recebido:',
      rawSocials,
    );
  }

  return {
    name: data.name ?? "",
    socials,
  };
}
