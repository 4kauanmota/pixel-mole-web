import type { StudioSocial } from "~/types/studio";
import { LINK_PLATFORMS } from "@/data/games";
import { BRAND_ICONS } from "@/data/brandIcons";

export interface SocialVisual {
  key: string;
  href: string;
  label: string;
  iconPath?: string;
  iconName: string;
  brandColor: string;
  inkColor: string;
}

// Resolve `studio.socials` (array de { platform, url } — formato ATUAL
// confirmado direto no Supabase, ver types/studio.ts) pra algo pronto de
// renderizar (ícone + cor de marca), reaproveitando o MESMO mapeamento por
// `platform` já usado em GameLinkButton.vue (LINK_PLATFORMS/BRAND_ICONS).
// Extraído daqui pra ser compartilhado entre AppFooter.vue e
// pages/links.vue — os dois precisam exatamente da mesma resolução
// ícone/cor pra rede social, então a lógica mora em UM lugar só.
export function resolveSocialVisuals(
  socials: StudioSocial[] | null | undefined,
): SocialVisual[] {
  return (socials ?? []).map((social) => {
    const isWebsite = social.platform === "website";
    const platformConfig = LINK_PLATFORMS[social.platform];
    const brandColor = isWebsite
      ? "var(--pm-yellow)"
      : (platformConfig?.color ?? "#3a3a3c");
    const inkColor = isWebsite
      ? "var(--pm-dark)"
      : useContrastColor(platformConfig?.color ?? "#3a3a3c");

    return {
      key: social.platform,
      href: social.url,
      label:
        social.label || platformConfig?.label || toLabel(social.platform),
      iconPath: BRAND_ICONS[social.platform],
      iconName: platformConfig?.icon ?? "Globe",
      brandColor,
      inkColor,
    };
  });
}
