-- ============================================================
-- IMPÉRIO PIZZARIA — Inicialização do Banco de Dados
-- Executado automaticamente pelo Docker na primeira subida.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- TABELA: settings
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  id               SMALLINT  PRIMARY KEY DEFAULT 1,
  pix_key          TEXT      NOT NULL DEFAULT '',
  whatsapp_number  TEXT      NOT NULL DEFAULT '',
  CONSTRAINT settings_single_row CHECK (id = 1)
);

INSERT INTO settings (id, pix_key, whatsapp_number)
VALUES (1, '', '')
ON CONFLICT (id) DO NOTHING;


-- ────────────────────────────────────────────────────────────
-- TABELA: categories
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  name            TEXT        NOT NULL,
  slug            TEXT        NOT NULL UNIQUE,
  icon            TEXT        NOT NULL DEFAULT '🍽️',
  order_position  SMALLINT    NOT NULL DEFAULT 0,
  is_pizza        BOOLEAN     NOT NULL DEFAULT false,
  active          BOOLEAN     NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_categories_order  ON categories(order_position);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active);


-- ────────────────────────────────────────────────────────────
-- TABELA: products
-- ────────────────────────────────────────────────────────────
-- prices (JSONB):
--   Preço único:   { "unique": 15.90 }
--   Por tamanho:   { "P": 30.00, "M": 40.00, "G": 50.00 }
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  category_id     UUID        NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name            TEXT        NOT NULL,
  description     TEXT,
  prices          JSONB       NOT NULL DEFAULT '{"unique": 0}',
  is_sweet        BOOLEAN     NOT NULL DEFAULT false,
  image_url       TEXT,
  active          BOOLEAN     NOT NULL DEFAULT true,
  order_position  SMALLINT    NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_order    ON products(order_position);
CREATE INDEX IF NOT EXISTS idx_products_active   ON products(active);


-- ────────────────────────────────────────────────────────────
-- TABELA: orders
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
-- SEED: categorias iniciais
-- ────────────────────────────────────────────────────────────
INSERT INTO categories (name, slug, icon, order_position, is_pizza) VALUES
  ('Pizzas',     'pizzas',     '🍕', 1, true),
  ('Bebidas',    'bebidas',    '🥤', 2, false),
  ('Sobremesas', 'sobremesas', '🍰', 3, false)
ON CONFLICT (slug) DO NOTHING;
