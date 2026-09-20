import { createClient } from "@supabase/supabase-js";
import type { Studio } from "~/types/studio";

// Dado do estúdio (nome, redes sociais) compartilhado entre a Home
// (HomeHero.vue) e o AppFooter — ambos montados JUNTOS em toda página, e os
// dois precisam do mesmo registro único (`studio`, uma linha só na tabela).
//
// Por isso isto é um composable com estado compartilhado via `useState`
// (mesmo padrão de useTheme.ts), não uma função simples chamada por
// página como fetchAllGames/fetchAllMembers: aqui o mesmo dado é consumido
// por DOIS COMPONENTES na MESMA renderização, então uma função comum
// disparia duas queries idênticas toda vez que a Home carrega. `load()` é
// seguro pra chamar de qualquer componente que precise do dado — o guard
// `hasLoaded` (setado de forma síncrona, antes do `await`) garante que só a
// PRIMEIRA chamada realmente busca no Supabase; qualquer chamada
// concorrente logo em seguida só observa o mesmo estado compartilhado.
export function useStudio() {
  const studio = useState<Studio | null>("pm-studio", () => null);
  const isLoading = useState<boolean>("pm-studio-loading", () => true);
  const hasLoaded = useState<boolean>("pm-studio-load-started", () => false);

  async function load(): Promise<void> {
    if (hasLoaded.value) return;
    hasLoaded.value = true;

    const config: any = useRuntimeConfig();
    const supabase = createClient(
      config.public.supabaseUrl,
      config.public.supabaseKey,
    );

    try {
      studio.value = await fetchStudio(supabase);
    } finally {
      isLoading.value = false;
    }
  }

  return { studio, isLoading, load };
}
