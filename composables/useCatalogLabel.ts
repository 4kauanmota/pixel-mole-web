// Traduz nomes que vêm crus do banco (tipos de jogo, tags) — hoje esses
// valores só passavam por `toLabel()` (snake_case -> Title Case), nunca
// pelo sistema de i18n, então trocar de idioma não traduzia nada disso.
//
// Resolve com um pequeno catálogo em i18n/locales/*.json
// ("catalog.types.*" / "catalog.tags.*"), indexado pelo slug exato salvo
// no Supabase. Slug sem entrada no catálogo (ex.: uma tag nova, ainda não
// traduzida) cai de volta pro toLabel() de sempre — nunca quebra, só não
// traduz até alguém adicionar a chave.
export function useCatalogLabel() {
  const { t, te } = useI18n();

  function label(kind: "types" | "tags", name: string): string {
    if (!name) return "";
    const key = `catalog.${kind}.${name}`;
    return te(key) ? t(key) : toLabel(name);
  }

  return { label };
}
