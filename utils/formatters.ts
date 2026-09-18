export function toLabel(value: string): string {
  if (!value) return "";

  return value
    .split("_")
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word.toLowerCase(),
    )
    .join(" ");
}

// Iniciais usadas como avatar de fallback (MemberCard + página de membro)
// quando o membro não tem foto cadastrada. Pega a primeira letra do
// primeiro e do último nome (ou só a primeira, se houver um nome só).
export function getInitials(name: string): string {
  if (!name) return "";

  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";

  return (first + last).toUpperCase();
}

// `default_role` de um membro pode conter mais de um cargo, separados por
// vírgula (ex.: "Game Designer, Programador") — usado tanto no card da
// listagem (MemberCard.vue) quanto no cabeçalho da página individual
// (pages/members/[nick].vue) pra decidir quantas tags de cargo mostrar (1
// ou 2) e o texto de cada uma. Um único cargo (sem vírgula) continua
// funcionando exatamente como antes, sem nenhuma mudança visual.
export function splitRoles(defaultRole: string): string[] {
  if (!defaultRole) return [];

  return defaultRole
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);
}

// Cor da segunda tag de cargo (quando o membro tem 2 cargos) — mesmo tom de
// --pm-purple (assets/css/main.css). Precisa ser o hex literal (não
// "var(--pm-purple)") porque Tag.vue calcula a cor do TEXTO a partir dele
// via useContrastColor, que só entende "#rrggbb".
export const SECONDARY_ROLE_COLOR = "#4D1184";
