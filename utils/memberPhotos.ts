// Fotos dos membros NÃO vêm do Supabase (a tabela `members` nem tem essa
// coluna) — ficam versionadas junto do projeto em assets/img/members/[nick],
// e a extensão pode variar de arquivo pra arquivo (ex.: .jpg, .png...).
//
// O glob abaixo é resolvido em build-time pelo Vite: ele importa todo
// arquivo de imagem dentro da pasta e já devolve a URL final de cada um
// (com hash/otimização, como qualquer asset processado pelo bundler) — sem
// precisar de app importar cada foto uma por uma nem saber a extensão de
// antemão.
const photoModules = import.meta.glob<string>(
  "../assets/img/members/*.{png,jpg,jpeg,webp,avif,gif}",
  { eager: true, import: "default" },
);

const photosByNick: Record<string, string> = {};

for (const path in photoModules) {
  // `path` é algo como "../assets/img/members/4kauanmota.jpg" — a chave do
  // mapa é o nome do arquivo sem extensão, que deve ser igual ao nick.
  const fileName = path.split("/").pop() ?? "";
  const nick = fileName.replace(/\.[^./]+$/, "");
  const url = photoModules[path];
  if (url) photosByNick[nick] = url;
}

// Retorna a URL da foto do membro, ou undefined se não existir nenhum
// arquivo em assets/img/members pra esse nick — nesse caso quem chama cai
// pro fallback de iniciais (mesmo padrão já usado no MemberCard e na
// página individual).
export function getMemberPhoto(nick: string): string | undefined {
  return photosByNick[nick];
}
