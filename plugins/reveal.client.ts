// Diretiva `v-reveal`: fade + leve translateY na primeira vez que o
// elemento entra na viewport (ver .reveal-on-scroll em assets/css/main.css).
// Client-only e via IntersectionObserver — nunca atrasa o conteúdo em si
// (o elemento já existe no DOM, só a opacidade/posição mudam), e respeita
// `prefers-reduced-motion` (tratado no CSS, não aqui). Usado com moderação,
// só nos blocos de cabeçalho/introdução de cada página — não nos cards da
// grade, pra não virar um efeito repetitivo a cada item.
export default defineNuxtPlugin((nuxtApp) => {
  const seen = new WeakSet<Element>();

  nuxtApp.vueApp.directive("reveal", {
    mounted(el: HTMLElement) {
      if (seen.has(el)) return;
      seen.add(el);

      el.classList.add("reveal-on-scroll");

      if (!("IntersectionObserver" in window)) {
        el.classList.add("is-visible");
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
      );
      observer.observe(el);
    },
  });
});
