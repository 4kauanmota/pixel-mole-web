// Aplica o tema salvo (ou a preferência do sistema) assim que o app sobe no
// cliente — antes do primeiro paint da hidratação, pra minimizar o flash de
// tema errado em quem já escolheu "light" antes.
export default defineNuxtPlugin(() => {
  const { init } = useTheme();
  init();
});
