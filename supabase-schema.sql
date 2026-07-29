-- ============================================================
-- AÇAITERIA — Schema para Supabase
-- ============================================================
-- Como usar:
--   1. Acesse o painel do Supabase → Database → SQL Editor
--   2. Clique em "New query"
--   3. Cole todo este script e clique em "Run"
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- TABELA: settings (configurações da loja — apenas 1 linha)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  id               SMALLINT  PRIMARY KEY DEFAULT 1,
  pix_key          TEXT      NOT NULL DEFAULT '',
  whatsapp_number  TEXT      NOT NULL DEFAULT '',
  store_name       TEXT      NOT NULL DEFAULT 'Açaiteria',
  CONSTRAINT settings_single_row CHECK (id = 1)
);

INSERT INTO settings (id, pix_key, whatsapp_number, store_name)
VALUES (1, '', '', 'Açaiteria')
ON CONFLICT (id) DO NOTHING;


-- ────────────────────────────────────────────────────────────
-- TABELA: categories (categorias do cardápio)
-- ────────────────────────────────────────────────────────────
-- is_builder = true  → ao clicar, abre o modal de montagem de açaí
-- is_builder = false → produto simples, adiciona direto ao carrinho
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  name            TEXT        NOT NULL,
  slug            TEXT        NOT NULL UNIQUE,
  icon            TEXT        NOT NULL DEFAULT '🍧',
  order_position  SMALLINT    NOT NULL DEFAULT 0,
  is_builder      BOOLEAN     NOT NULL DEFAULT false,
  active          BOOLEAN     NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_categories_order  ON categories(order_position);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active);


-- ────────────────────────────────────────────────────────────
-- TABELA: products (produtos do cardápio)
-- ────────────────────────────────────────────────────────────
-- prices (JSONB):
--   Preço único:    { "unique": 21.00 }
--   Por tamanho:    { "P": 30.00, "M": 40.00, "G": 50.00 }
--
-- free_toppings:
--    0  → produto simples, sem builder
--   >0  → qtd máxima de acompanhamentos grátis
--   -1  → acompanhamentos ilimitados
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  category_id     UUID        NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name            TEXT        NOT NULL,
  description     TEXT,
  prices          JSONB       NOT NULL DEFAULT '{"unique": 0}',
  free_toppings   SMALLINT    NOT NULL DEFAULT 0,
  emoji           TEXT,
  image_url       TEXT,
  active          BOOLEAN     NOT NULL DEFAULT true,
  order_position  SMALLINT    NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_order    ON products(order_position);
CREATE INDEX IF NOT EXISTS idx_products_active   ON products(active);


-- ────────────────────────────────────────────────────────────
-- TABELA: toppings (acompanhamentos grátis + extras pagos)
-- ────────────────────────────────────────────────────────────
-- price = 0.00  → acompanhamento grátis (conta no free_toppings)
-- price > 0.00  → extra pago (cobrado separado)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS toppings (
  id              UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ   DEFAULT NOW() NOT NULL,
  key             TEXT          NOT NULL UNIQUE,
  name            TEXT          NOT NULL,
  price           DECIMAL(10,2) NOT NULL DEFAULT 0,
  active          BOOLEAN       NOT NULL DEFAULT true,
  order_position  SMALLINT      NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_toppings_active ON toppings(active);


-- ────────────────────────────────────────────────────────────
-- TABELA: orders (pedidos)
-- ────────────────────────────────────────────────────────────
-- items (JSONB) — estrutura de cada item do pedido:
-- [
--   {
--     "id": "acai-300ml",
--     "name": "Copo 300ml",
--     "qty": 1,
--     "price": 21.00,
--     "base": "tradicional",
--     "toppings": ["leite-ninho", "granola", "morango"],
--     "extras": [{ "key": "nutella", "label": "Nutella", "price": 4.00 }]
--   }
-- ]
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id              UUID           DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ    DEFAULT NOW() NOT NULL,
  customer_name   TEXT           NOT NULL,
  customer_phone  TEXT           NOT NULL,
  delivery_type   TEXT           NOT NULL CHECK (delivery_type IN ('delivery', 'pickup')),
  address         TEXT,
  payment_method  TEXT           NOT NULL CHECK (payment_method IN ('pix', 'credit', 'debit', 'cash')),
  change_for      TEXT,
  items           JSONB          NOT NULL DEFAULT '[]',
  total           DECIMAL(10,2)  NOT NULL,
  status          TEXT           NOT NULL DEFAULT 'new'
                                 CHECK (status IN ('new', 'preparing', 'delivering', 'delivered')),
  notes           TEXT
);

CREATE INDEX IF NOT EXISTS idx_orders_status     ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);


-- ────────────────────────────────────────────────────────────
-- RLS — Row Level Security
-- ────────────────────────────────────────────────────────────
ALTER TABLE settings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE toppings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders     ENABLE ROW LEVEL SECURITY;

-- Leitura pública: qualquer pessoa pode ver o cardápio
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products"   ON products   FOR SELECT USING (true);
CREATE POLICY "Public read toppings"   ON toppings   FOR SELECT USING (true);

-- Clientes podem criar pedidos
CREATE POLICY "Public insert orders"   ON orders     FOR INSERT WITH CHECK (true);

-- Nota: a SERVICE_ROLE_KEY (usada no backend) ignora RLS automaticamente.
-- As policies acima protegem o caso de acesso direto com ANON_KEY.


-- ────────────────────────────────────────────────────────────
-- SEED: categorias
-- ────────────────────────────────────────────────────────────
INSERT INTO categories (name, slug, icon, order_position, is_builder) VALUES
  ('Monte seu Açaí',   'monte-seu-acai', '🍧', 1, true),
  ('Açaí na Barca',    'acai-na-barca',  '🛶', 2, true),
  ('Marmitas',         'marmitas',       '📦', 3, true),
  ('Vitamina de Açaí', 'vitamina',       '🥤', 4, false),
  ('Combos',           'combos',         '🎁', 5, false),
  ('Milk Shake',       'milkshake',      '🥛', 6, false),
  ('Picolés',          'picoles',        '🍭', 7, false),
  ('Bebidas',          'bebidas',        '🧃', 8, false)
ON CONFLICT (slug) DO NOTHING;


-- ────────────────────────────────────────────────────────────
-- SEED: acompanhamentos grátis
-- ────────────────────────────────────────────────────────────
INSERT INTO toppings (key, name, price, order_position) VALUES
  ('leite-ninho',      'Leite Ninho',      0.00, 1),
  ('pacoca',           'Paçoca',           0.00, 2),
  ('morango',          'Morango',          0.00, 3),
  ('banana',           'Banana',           0.00, 4),
  ('granola',          'Granola',          0.00, 5),
  ('leite-condensado', 'Leite Condensado', 0.00, 6),
  ('amendoim',         'Amendoim',         0.00, 7),
  ('mel',              'Mel',              0.00, 8),
  ('coco',             'Coco Ralado',      0.00, 9),
  ('confete',          'Confete',          0.00, 10)
ON CONFLICT (key) DO NOTHING;

-- ── Extras pagos ──────────────────────────────────────────────
INSERT INTO toppings (key, name, price, order_position) VALUES
  ('nutella',   'Nutella',           4.00, 11),
  ('pistache',  'Creme de Pistache', 5.00, 12),
  ('chocoball', 'Chocoball',         2.50, 13),
  ('bis',       'Bis Triturado',     2.00, 14)
ON CONFLICT (key) DO NOTHING;


-- ────────────────────────────────────────────────────────────
-- SEED: produtos
-- ────────────────────────────────────────────────────────────

-- Monte seu Açaí
INSERT INTO products (category_id, name, description, prices, free_toppings, emoji, order_position)
VALUES
  ((SELECT id FROM categories WHERE slug = 'monte-seu-acai'), 'Kids',       'Para os pequenos. Até 2 acompanhamentos grátis.',        '{"unique": 12.00}',  2,  '🍧', 1),
  ((SELECT id FROM categories WHERE slug = 'monte-seu-acai'), 'Copo 300ml', 'Perfeito para um lanche. Até 4 acompanhamentos grátis.', '{"unique": 21.00}',  4,  '🍧', 2),
  ((SELECT id FROM categories WHERE slug = 'monte-seu-acai'), 'Copo 400ml', 'O tamanho ideal. Até 6 acompanhamentos grátis.',         '{"unique": 26.00}',  6,  '🍧', 3),
  ((SELECT id FROM categories WHERE slug = 'monte-seu-acai'), 'Copo 500ml', 'Para quem ama açaí. Até 8 acompanhamentos grátis.',      '{"unique": 31.00}',  8,  '🍧', 4),
  ((SELECT id FROM categories WHERE slug = 'monte-seu-acai'), 'Copo 700ml', 'O maior! Acompanhamentos à vontade.',                    '{"unique": 36.00}', -1,  '🍧', 5);

-- Açaí na Barca
INSERT INTO products (category_id, name, description, prices, free_toppings, emoji, order_position)
VALUES
  ((SELECT id FROM categories WHERE slug = 'acai-na-barca'), 'Hamburgueira M', 'Barca redonda média. Até 5 acompanhamentos grátis.',       '{"unique": 27.00}',  5,  '🛶', 1),
  ((SELECT id FROM categories WHERE slug = 'acai-na-barca'), 'Hamburgueira G', 'Barca redonda grande. Acompanhamentos à vontade.',         '{"unique": 37.00}', -1,  '🛶', 2),
  ((SELECT id FROM categories WHERE slug = 'acai-na-barca'), 'Barca P',        'Barca pequena. Até 5 acompanhamentos grátis.',             '{"unique": 35.00}',  5,  '🛶', 3),
  ((SELECT id FROM categories WHERE slug = 'acai-na-barca'), 'Barca M',        'Barca média. Até 7 acompanhamentos grátis.',               '{"unique": 55.00}',  7,  '🛶', 4);

-- Marmitas
INSERT INTO products (category_id, name, description, prices, free_toppings, emoji, order_position)
VALUES
  ((SELECT id FROM categories WHERE slug = 'marmitas'), 'Marmita P', 'Marmita pequena. Até 5 acompanhamentos grátis.', '{"unique": 29.00}', 5, '📦', 1);

-- Vitamina de Açaí
INSERT INTO products (category_id, name, description, prices, free_toppings, emoji, order_position)
VALUES
  ((SELECT id FROM categories WHERE slug = 'vitamina'), 'Vitamina 300ml', 'Açaí batido com leite e fruta à escolha.',                    '{"unique": 18.00}', 0, '🥤', 1),
  ((SELECT id FROM categories WHERE slug = 'vitamina'), 'Vitamina 500ml', 'Açaí batido com leite e fruta à escolha. Tamanho grande.',    '{"unique": 24.00}', 0, '🥤', 2);

-- Combos
INSERT INTO products (category_id, name, description, prices, free_toppings, emoji, order_position)
VALUES
  ((SELECT id FROM categories WHERE slug = 'combos'), 'Combo Casal',   '2x Copo 400ml com acompanhamentos à escolha.', '{"unique": 55.00}', 0, '🎁', 1),
  ((SELECT id FROM categories WHERE slug = 'combos'), 'Combo Família', '1 Barca M com acompanhamentos à vontade.',     '{"unique": 65.00}', 0, '🎁', 2);

-- Milk Shake
INSERT INTO products (category_id, name, description, prices, free_toppings, emoji, order_position)
VALUES
  ((SELECT id FROM categories WHERE slug = 'milkshake'), 'Shake de Açaí',       'Cremoso milk shake de açaí. 400ml.',    '{"unique": 22.00}', 0, '🥛', 1),
  ((SELECT id FROM categories WHERE slug = 'milkshake'), 'Shake de Morango',    'Milk shake gelado de morango. 400ml.',  '{"unique": 20.00}', 0, '🥛', 2),
  ((SELECT id FROM categories WHERE slug = 'milkshake'), 'Shake de Chocolate',  'Milk shake cremoso de chocolate. 400ml.','{"unique": 20.00}', 0, '🥛', 3);

-- Picolés
INSERT INTO products (category_id, name, description, prices, free_toppings, emoji, order_position)
VALUES
  ((SELECT id FROM categories WHERE slug = 'picoles'), 'Picolé de Açaí',     'Picolé artesanal de açaí puro.',     '{"unique": 8.00}', 0, '🍭', 1),
  ((SELECT id FROM categories WHERE slug = 'picoles'), 'Picolé de Morango',  'Picolé cremoso de morango.',         '{"unique": 7.00}', 0, '🍭', 2),
  ((SELECT id FROM categories WHERE slug = 'picoles'), 'Picolé de Maracujá', 'Picolé refrescante de maracujá.',    '{"unique": 7.00}', 0, '🍭', 3);

-- Bebidas
INSERT INTO products (category_id, name, description, prices, free_toppings, emoji, order_position)
VALUES
  ((SELECT id FROM categories WHERE slug = 'bebidas'), 'Água Mineral',     '500ml, com ou sem gás.',          '{"unique": 4.00}',  0, '💧', 1),
  ((SELECT id FROM categories WHERE slug = 'bebidas'), 'Coca-Cola Lata',   '350ml gelada.',                   '{"unique": 6.00}',  0, '🥤', 2),
  ((SELECT id FROM categories WHERE slug = 'bebidas'), 'Coca-Cola 2 Litros','Ideal para compartilhar.',       '{"unique": 14.00}', 0, '🥤', 3),
  ((SELECT id FROM categories WHERE slug = 'bebidas'), 'Suco Natural',     'Laranja, limão ou maracujá. 300ml.','{"unique": 9.00}', 0, '🍊', 4);


-- ────────────────────────────────────────────────────────────
-- MIGRAÇÃO: Açaiteria — flavors + addons
-- Execute separadamente se o banco já existir
-- ────────────────────────────────────────────────────────────

-- 1. Coluna flavors na tabela products
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS flavors JSONB NOT NULL DEFAULT '[]'::jsonb;

-- 2. Tabela addons
CREATE TABLE IF NOT EXISTS addons (
  id              UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ   DEFAULT NOW() NOT NULL,
  category        TEXT          NOT NULL
                                CHECK (category IN ('massa', 'calda', 'acompanhamento', 'extra')),
  name            TEXT          NOT NULL,
  price           DECIMAL(10,2) NOT NULL DEFAULT 0,
  active          BOOLEAN       NOT NULL DEFAULT true,
  order_position  SMALLINT      NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_addons_category ON addons(category);
CREATE INDEX IF NOT EXISTS idx_addons_active   ON addons(active);

ALTER TABLE addons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read addons" ON addons
  FOR SELECT USING (true);

-- 3. Seed inicial de addons
INSERT INTO addons (category, name, price, order_position) VALUES
  ('massa', 'Açaí Tradicional',    0.00, 1),
  ('massa', 'Sorvete de Morango',  0.00, 2),
  ('massa', 'Casadinho',           0.00, 3),
  ('massa', 'Açaí com Cupuaçu',   0.00, 4),
  ('calda', 'Leite Condensado',    0.00, 1),
  ('calda', 'Mel',                 0.00, 2),
  ('calda', 'Calda de Chocolate',  0.00, 3),
  ('calda', 'Calda de Morango',    0.00, 4),
  ('acompanhamento', 'Leite Ninho',       0.00,  1),
  ('acompanhamento', 'Paçoca',           0.00,  2),
  ('acompanhamento', 'Morango',          0.00,  3),
  ('acompanhamento', 'Banana',           0.00,  4),
  ('acompanhamento', 'Granola',          0.00,  5),
  ('acompanhamento', 'Leite Condensado', 0.00,  6),
  ('acompanhamento', 'Amendoim',         0.00,  7),
  ('acompanhamento', 'Mel',              0.00,  8),
  ('acompanhamento', 'Coco Ralado',      0.00,  9),
  ('acompanhamento', 'Confete',          0.00, 10),
  ('extra', 'Nutella',           4.00, 1),
  ('extra', 'Creme de Pistache', 5.00, 2),
  ('extra', 'Chocoball',         2.50, 3),
  ('extra', 'Bis Triturado',     2.00, 4);


-- ────────────────────────────────────────────────────────────
-- STORAGE: bucket para imagens de produtos
-- ────────────────────────────────────────────────────────────
-- Execute separadamente no SQL Editor se quiser criar via SQL:
--
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('product-images', 'product-images', true)
-- ON CONFLICT (id) DO NOTHING;
--
-- Ou crie pelo painel: Storage → New bucket → nome: product-images → Public: ON
-- ────────────────────────────────────────────────────────────
