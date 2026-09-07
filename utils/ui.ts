// Classes compartilhadas pelos controles de filtro do topo da página
// principal (busca, seletor de tipo, seletor de tags) e pelo seletor de
// idioma da navbar, garantindo que todos tenham exatamente o mesmo
// padding/altura/tipografia — em vez de cada componente definir o próprio
// valor isolado (o que foi, inclusive, a causa da barra de busca ter ficado
// com uma altura diferente dos outros filtros).
//
// px-5/py-3.5/text-base (em vez de px-4/py-3/text-sm) deixam esse conjunto
// de controles maior e mais confortável, aproveitando melhor o espaço
// horizontal disponível — como todos compartilham essa mesma constante,
// crescem juntos e continuam com a mesma altura entre si.
export const FILTER_CONTROL_CLASSES = "px-5 py-3.5 text-base";
