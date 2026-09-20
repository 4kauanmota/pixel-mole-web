-- =============================================================================
-- Pixel Mole — Migração de textos para o formato multilíngue { "pt": "...", "en": "..." }
-- =============================================================================
--
-- Execute este script no SQL Editor do Supabase quando estiver pronto.
-- O código do site já foi atualizado para ler tanto o formato ANTIGO (text
-- simples) quanto o NOVO (jsonb multilíngue) — então nada quebra antes de
-- rodar isto, e você pode rodar tabela por tabela, no seu tempo, sem pressa.
--
-- O que este script faz, em ordem:
--   1. games.description        text -> jsonb { pt, en }
--   2. members.description      text -> jsonb { pt, en }
--   3. members.default_role     text -> jsonb { pt, en }
--   4. game_members.role_in_game text -> jsonb { pt, en }
--   5. game_types: adiciona slug (novo) + converte name para jsonb
--   6. tags: adiciona slug (novo) + converte name para jsonb
--
-- Para os campos 1-4, o valor atual (o texto que já está cadastrado) vira o
-- "pt" do novo objeto, e "en" fica com o MESMO texto até você editar a
-- tradução em inglês diretamente no Supabase depois. Nada muda visualmente
-- na hora que você rodar — o site mostra o texto de sempre (em pt) até você
-- preencher o "en" de cada linha.
--
-- Para game_types.name e tags.name (passos 5 e 6), em vez de duplicar o
-- slug bruto (ex.: "coming_soon") como texto visível, o script já usa as
-- traduções REAIS que hoje vivem em i18n/locales/pt.json e en.json — assim
-- o site continua mostrando "Em Breve"/"Coming Soon" em vez de aparecer o
-- slug cru na tela.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. games.description
-- -----------------------------------------------------------------------------
ALTER TABLE games
  ALTER COLUMN description TYPE jsonb
  USING jsonb_build_object('pt', description, 'en', description);


-- -----------------------------------------------------------------------------
-- 2. members.description
-- -----------------------------------------------------------------------------
ALTER TABLE members
  ALTER COLUMN description TYPE jsonb
  USING jsonb_build_object('pt', description, 'en', description);


-- -----------------------------------------------------------------------------
-- 3. members.default_role
-- -----------------------------------------------------------------------------
ALTER TABLE members
  ALTER COLUMN default_role TYPE jsonb
  USING jsonb_build_object('pt', default_role, 'en', default_role);


-- -----------------------------------------------------------------------------
-- 4. game_members.role_in_game
-- -----------------------------------------------------------------------------
ALTER TABLE game_members
  ALTER COLUMN role_in_game TYPE jsonb
  USING jsonb_build_object('pt', role_in_game, 'en', role_in_game);


-- -----------------------------------------------------------------------------
-- 5. game_types: slug (novo, plain text, nunca traduzido) + name (jsonb)
-- -----------------------------------------------------------------------------
-- 5a. Novo campo slug, seedado com o valor atual de "name" (que hoje já É o
--     slug estável, ex.: "coming_soon", "game_jam") — preserva o identificador
--     usado em toda a lógica do site (Card.vue, HomeHero.vue, pages/games.vue
--     etc. agora comparam por `type.slug`, nunca mais por `type.name`).
ALTER TABLE game_types ADD COLUMN slug text;
UPDATE game_types SET slug = name;
ALTER TABLE game_types ALTER COLUMN slug SET NOT NULL;
ALTER TABLE game_types ADD CONSTRAINT game_types_slug_unique UNIQUE (slug);

-- 5b. Converte "name" pra jsonb, usando as traduções REAIS que já existem
--     hoje em i18n/locales/pt.json e en.json (catalog.types.*) — se o seu
--     banco tiver algum type_slug além destes 3, adicione um WHEN próprio
--     (o ELSE cobre esse caso duplicando o slug como fallback, igual aos
--     campos 1-4 acima).
ALTER TABLE game_types
  ALTER COLUMN name TYPE jsonb
  USING (
    CASE slug
      WHEN 'all_games'   THEN '{"pt": "Todos os Jogos", "en": "All Games"}'
      WHEN 'coming_soon' THEN '{"pt": "Em Breve", "en": "Coming Soon"}'
      WHEN 'game_jam'    THEN '{"pt": "Game Jam", "en": "Game Jam"}'
      ELSE jsonb_build_object('pt', name, 'en', name)
    END
  )::jsonb;


-- -----------------------------------------------------------------------------
-- 6. tags: slug (novo, plain text, nunca traduzido) + name (jsonb)
-- -----------------------------------------------------------------------------
-- Mesmo raciocínio do passo 5, pelo mesmo motivo: tag.name também é usado
-- como identificador no site (filtro de tags em MultiSelect.vue/pages/games.vue),
-- então precisa de um slug estável separado do rótulo exibido.
ALTER TABLE tags ADD COLUMN slug text;
UPDATE tags SET slug = name;
ALTER TABLE tags ALTER COLUMN slug SET NOT NULL;
ALTER TABLE tags ADD CONSTRAINT tags_slug_unique UNIQUE (slug);

ALTER TABLE tags
  ALTER COLUMN name TYPE jsonb
  USING (
    CASE slug
      WHEN 'romance'       THEN '{"pt": "Romance", "en": "Romance"}'
      WHEN 'visual_novel'  THEN '{"pt": "Visual Novel", "en": "Visual Novel"}'
      WHEN 'adventure'     THEN '{"pt": "Aventura", "en": "Adventure"}'
      WHEN 'platform'      THEN '{"pt": "Plataforma", "en": "Platformer"}'
      ELSE jsonb_build_object('pt', name, 'en', name)
    END
  )::jsonb;


-- =============================================================================
-- Depois de rodar isto:
--   - O site continua funcionando exatamente igual (mesmos textos em pt),
--     porque cada objeto novo tem "en" preenchido com o mesmo valor de "pt"
--     (exceto game_types/tags, que já usam a tradução real).
--   - Pra ativar o inglês de verdade, edite cada linha e troque o valor de
--     "en" pela tradução correta — ex.: description: {"pt": "...", "en": "..."}.
--   - Qualquer campo NOVO que você quiser tornar multilíngue no futuro: só
--     seguir o mesmo padrão jsonb { "pt": "...", "en": "..." } — o composable
--     useLocalizedText() (composables/useLocalizedText.ts) já funciona pra
--     QUALQUER campo nesse formato, em qualquer lugar do site, sem precisar
--     de nenhuma alteração de código.
-- =============================================================================
