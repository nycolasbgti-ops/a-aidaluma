-- ============================================================
-- BELLA PIZZA — Schema do Cardápio Dinâmico
-- Script 2 de 2  (execute APÓS supabase_setup.sql)
-- ============================================================
-- Execute no: Supabase Dashboard → SQL Editor → New Query
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1. TABELA: categories
-- ────────────────────────────────────────────────────────────
-- Cada linha é uma aba do cardápio (Pizzas, Bebidas, Pastéis…)
-- is_pizza = true  → abre o modal de montagem (Meio a Meio + Borda)
-- is_pizza = false → adiciona direto ao carrinho

CREATE TABLE IF NOT EXISTS categories (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  name            TEXT        NOT NULL,
  slug            TEXT        NOT NULL UNIQUE,       -- ex: 'pizzas', 'bebidas'
  icon            TEXT        NOT NULL DEFAULT '🍽️', -- emoji exibido na aba
  order_position  SMALLINT    NOT NULL DEFAULT 0,    -- ordem das abas (menor = primeiro)
  is_pizza        BOOLEAN     NOT NULL DEFAULT false, -- ativa modal de montagem
  active          BOOLEAN     NOT NULL DEFAULT true
);

COMMENT ON COLUMN categories.is_pizza IS
  'true = exibe modal de montagem com Meio a Meio e Borda Recheada';


-- ────────────────────────────────────────────────────────────
-- 2. TABELA: products
-- ────────────────────────────────────────────────────────────
-- prices (JSONB) aceita dois formatos:
--   Preço único:  { "unique": 15.90 }
--   Por tamanho:  { "P": 30.00, "M": 40.00, "G": 50.00 }
--
-- is_sweet = true → pizza doce; na lógica Meio a Meio,
--   só combina com outra pizza de is_sweet = true

CREATE TABLE IF NOT EXISTS products (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  category_id     UUID        NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name            TEXT        NOT NULL,
  description     TEXT,
  prices          JSONB       NOT NULL DEFAULT '{"unique": 0}',
  is_sweet        BOOLEAN     NOT NULL DEFAULT false,
  image_url       TEXT,                              -- URL pública do Supabase Storage
  active          BOOLEAN     NOT NULL DEFAULT true,
  order_position  SMALLINT    NOT NULL DEFAULT 0
);

COMMENT ON COLUMN products.prices IS
  'Formatos aceitos: {"unique": 15.90}  ou  {"P": 30, "M": 40, "G": 50}';

COMMENT ON COLUMN products.is_sweet IS
  'true = pizza doce; impede combinação com pizzas salgadas no Meio a Meio';

COMMENT ON COLUMN products.image_url IS
  'URL pública do arquivo no bucket "menu-images" do Supabase Storage';


-- ────────────────────────────────────────────────────────────
-- 3. ÍNDICES DE PERFORMANCE
-- ────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_products_category  ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_order   ON categories(order_position);
CREATE INDEX IF NOT EXISTS idx_products_order     ON products(order_position);
CREATE INDEX IF NOT EXISTS idx_products_active    ON products(active);
CREATE INDEX IF NOT EXISTS idx_categories_active  ON categories(active);


-- ────────────────────────────────────────────────────────────
-- 4. ROW LEVEL SECURITY (RLS)
-- ────────────────────────────────────────────────────────────

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;

-- Leitura pública: apenas registros ativos
DROP POLICY IF EXISTS "Public read categories" ON categories;
DROP POLICY IF EXISTS "Public read products"   ON products;

CREATE POLICY "Public read categories"
  ON categories FOR SELECT TO anon
  USING (active = true);

CREATE POLICY "Public read products"
  ON products FOR SELECT TO anon
  USING (active = true);

-- Escrita do admin (anon por enquanto — proteja com auth em produção)
DROP POLICY IF EXISTS "Admin insert categories" ON categories;
DROP POLICY IF EXISTS "Admin update categories" ON categories;
DROP POLICY IF EXISTS "Admin delete categories" ON categories;
DROP POLICY IF EXISTS "Admin insert products"   ON products;
DROP POLICY IF EXISTS "Admin update products"   ON products;
DROP POLICY IF EXISTS "Admin delete products"   ON products;

CREATE POLICY "Admin insert categories" ON categories FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Admin update categories" ON categories FOR UPDATE TO anon USING (true);
CREATE POLICY "Admin delete categories" ON categories FOR DELETE TO anon USING (true);

CREATE POLICY "Admin insert products"   ON products FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Admin update products"   ON products FOR UPDATE TO anon USING (true);
CREATE POLICY "Admin delete products"   ON products FOR DELETE TO anon USING (true);


-- ────────────────────────────────────────────────────────────
-- 5. REALTIME (painel admin recebe atualizações ao vivo)
-- ────────────────────────────────────────────────────────────

ALTER PUBLICATION supabase_realtime ADD TABLE categories;
ALTER PUBLICATION supabase_realtime ADD TABLE products;


-- ────────────────────────────────────────────────────────────
-- 6. POLÍTICAS DO STORAGE (bucket "menu-images")
-- ────────────────────────────────────────────────────────────
-- ATENÇÃO: execute este bloco SOMENTE APÓS criar o bucket
-- manualmente no Dashboard (veja instruções no README).
-- O bucket precisa existir antes das policies.

DROP POLICY IF EXISTS "Public read menu images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin upload menu images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin update menu images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin delete menu images"  ON storage.objects;

CREATE POLICY "Public read menu images"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'menu-images');

CREATE POLICY "Admin upload menu images"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'menu-images');

CREATE POLICY "Admin update menu images"
  ON storage.objects FOR UPDATE TO anon
  USING (bucket_id = 'menu-images');

CREATE POLICY "Admin delete menu images"
  ON storage.objects FOR DELETE TO anon
  USING (bucket_id = 'menu-images');


-- ────────────────────────────────────────────────────────────
-- 7. SEED — Categorias iniciais
-- ────────────────────────────────────────────────────────────
-- Popula as 4 categorias base. Produtos devem ser criados
-- pelo Painel Admin ou via INSERT manual abaixo.

INSERT INTO categories (name, slug, icon, order_position, is_pizza) VALUES
  ('Pizzas',      'pizzas',      '🍕', 1, true),
  ('Bebidas',     'bebidas',     '🥤', 2, false),
  ('Sobremesas',  'sobremesas',  '🍰', 3, false)
ON CONFLICT (slug) DO NOTHING;


-- ────────────────────────────────────────────────────────────
-- 8. EXEMPLOS: como inserir produtos via SQL
-- ────────────────────────────────────────────────────────────
-- (Descomente para usar como referência)

/*
-- Pizza com preço por tamanho (P/M/G):
INSERT INTO products (category_id, name, description, prices, is_sweet, order_position)
SELECT
  c.id,
  '01 - Mussarela',
  'Molho de tomate, queijo mussarela, orégano, azeitona.',
  '{"P": 30, "M": 40, "G": 50}',
  false,
  1
FROM categories c WHERE c.slug = 'pizzas';

-- Bebida com preço único:
INSERT INTO products (category_id, name, description, prices, order_position)
SELECT
  c.id,
  'Coca-Cola Lata',
  '350ml gelada.',
  '{"unique": 6.00}',
  1
FROM categories c WHERE c.slug = 'bebidas';
*/


-- ============================================================
-- PRÓXIMO PASSO: crie o bucket "menu-images" no Storage.
-- Veja as instruções detalhadas no arquivo STORAGE_SETUP.md
-- ============================================================
