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
