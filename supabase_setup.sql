-- ============================================================
-- BELLA PIZZA — Configuração do Banco de Dados (Supabase)
-- ============================================================
-- Execute este script no SQL Editor do seu projeto Supabase.
-- Acesse: https://supabase.com/dashboard → seu projeto → SQL Editor
-- ============================================================

-- 1. Cria a tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id              UUID              DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ       DEFAULT NOW() NOT NULL,
  customer_name   TEXT              NOT NULL,
  customer_phone  TEXT              NOT NULL,
  delivery_type   TEXT              NOT NULL CHECK (delivery_type IN ('delivery', 'pickup')),
  address         TEXT,
  payment_method  TEXT              NOT NULL CHECK (payment_method IN ('pix', 'credit', 'debit', 'cash')),
  change_for      TEXT,
  items           JSONB             NOT NULL DEFAULT '[]',
  total           DECIMAL(10, 2)    NOT NULL,
  status          TEXT              NOT NULL DEFAULT 'new'
                                    CHECK (status IN ('new', 'preparing', 'delivering', 'delivered')),
  notes           TEXT
);

-- 2. Ativa Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de acesso público (demo — ajuste para produção com autenticação)
DROP POLICY IF EXISTS "Allow public insert"  ON orders;
DROP POLICY IF EXISTS "Allow public select"  ON orders;
DROP POLICY IF EXISTS "Allow public update"  ON orders;

CREATE POLICY "Allow public insert" ON orders
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow public select" ON orders
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow public update" ON orders
  FOR UPDATE TO anon USING (true);

-- 4. Habilita Realtime para a tabela (necessário para o painel admin)
-- No Supabase Dashboard: Database → Replication → enable "orders"
-- Ou execute:
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- ============================================================
-- PRONTO! Após executar, configure as credenciais no arquivo:
-- src/supabaseClient.js
--   COLOQUE_SUA_URL_AQUI    → Project URL (Settings → API)
--   COLOQUE_SUA_ANON_KEY_AQUI → anon/public key (Settings → API)
-- ============================================================
