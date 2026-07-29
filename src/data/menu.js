export const ADMIN_PIN = '1234'

// ── Massas (Passo 1 do builder) ─────────────────────────────────
export const ACAI_BASES = [
  { key: 'tradicional', label: 'Açaí Tradicional',    description: 'Puro açaí cremoso da Amazônia' },
  { key: 'morango',     label: 'Sorvete de Morango',  description: 'Cremoso e refrescante' },
  { key: 'casadinho',   label: 'Casadinho',            description: 'Açaí + Creme de baunilha' },
  { key: 'cupuacu',     label: 'Açaí com Cupuaçu',    description: 'Combinação amazônica irresistível' },
]

// ── Acompanhamentos grátis (Passo 2) ────────────────────────────
export const ACAI_TOPPINGS = [
  { key: 'leite-ninho',      label: 'Leite Ninho' },
  { key: 'pacoca',           label: 'Paçoca' },
  { key: 'morango',          label: 'Morango' },
  { key: 'banana',           label: 'Banana' },
  { key: 'granola',          label: 'Granola' },
  { key: 'leite-condensado', label: 'Leite Condensado' },
  { key: 'amendoim',         label: 'Amendoim' },
  { key: 'mel',              label: 'Mel' },
  { key: 'coco',             label: 'Coco Ralado' },
  { key: 'confete',          label: 'Confete' },
]

// ── Adicionais pagos (Passo 3) ───────────────────────────────────
export const ACAI_EXTRAS = [
  { key: 'nutella',   label: 'Nutella',           price: 4.00 },
  { key: 'pistache',  label: 'Creme de Pistache', price: 5.00 },
  { key: 'chocoball', label: 'Chocoball',          price: 2.50 },
  { key: 'bis',       label: 'Bis Triturado',      price: 2.00 },
]

// ── Categorias ──────────────────────────────────────────────────
// is_builder: true → abre o AcaiBuilderModal ao clicar no produto
export const categories = [
  { id: 'monte-seu-acai', name: 'Monte seu Açaí',  icon: '🍧', is_builder: true },
  { id: 'acai-na-barca',  name: 'Açaí na Barca',   icon: '🛶',  is_builder: true },
  { id: 'marmitas',       name: 'Marmitas',         icon: '📦',  is_builder: true },
  { id: 'vitamina',       name: 'Vitamina de Açaí', icon: '🥤' },
  { id: 'combos',         name: 'Combos',           icon: '🎁' },
  { id: 'milkshake',      name: 'Milk Shake',       icon: '🥛' },
  { id: 'picoles',        name: 'Picolés',          icon: '🍭' },
  { id: 'bebidas',        name: 'Bebidas',          icon: '🧃' },
]

// ── Produtos ─────────────────────────────────────────────────────
// free_toppings: N → até N acompanhamentos grátis; -1 → ilimitado
export const products = [

  // ── MONTE SEU AÇAÍ ───────────────────────────────────────────
  {
    id: 'acai-kids',
    category_id: 'monte-seu-acai',
    name: 'Kids',
    description: 'Para os pequenos. Até 2 acompanhamentos grátis.',
    prices: { unique: 12.00 },
    free_toppings: 2,
    emoji: '🍧',
  },
  {
    id: 'acai-300ml',
    category_id: 'monte-seu-acai',
    name: 'Copo 300ml',
    description: 'Perfeito para um lanche. Até 4 acompanhamentos grátis.',
    prices: { unique: 21.00 },
    free_toppings: 4,
    emoji: '🍧',
  },
  {
    id: 'acai-400ml',
    category_id: 'monte-seu-acai',
    name: 'Copo 400ml',
    description: 'O tamanho ideal. Até 6 acompanhamentos grátis.',
    prices: { unique: 26.00 },
    free_toppings: 6,
    emoji: '🍧',
  },
  {
    id: 'acai-500ml',
    category_id: 'monte-seu-acai',
    name: 'Copo 500ml',
    description: 'Para quem ama açaí. Até 8 acompanhamentos grátis.',
    prices: { unique: 31.00 },
    free_toppings: 8,
    emoji: '🍧',
  },
  {
    id: 'acai-700ml',
    category_id: 'monte-seu-acai',
    name: 'Copo 700ml',
    description: 'O maior! Acompanhamentos à vontade.',
    prices: { unique: 36.00 },
    free_toppings: -1,
    emoji: '🍧',
  },

  // ── AÇAÍ NA BARCA ────────────────────────────────────────────
  {
    id: 'hamburgueira-m',
    category_id: 'acai-na-barca',
    name: 'Hamburgueira M',
    description: 'Barca redonda média. Até 5 acompanhamentos grátis.',
    prices: { unique: 27.00 },
    free_toppings: 5,
    emoji: '🛶',
  },
  {
    id: 'hamburgueira-g',
    category_id: 'acai-na-barca',
    name: 'Hamburgueira G',
    description: 'Barca redonda grande. Acompanhamentos à vontade.',
    prices: { unique: 37.00 },
    free_toppings: -1,
    emoji: '🛶',
  },
  {
    id: 'barca-p',
    category_id: 'acai-na-barca',
    name: 'Barca P',
    description: 'Barca pequena. Até 5 acompanhamentos grátis.',
    prices: { unique: 35.00 },
    free_toppings: 5,
    emoji: '🛶',
  },
  {
    id: 'barca-m',
    category_id: 'acai-na-barca',
    name: 'Barca M',
    description: 'Barca média. Até 7 acompanhamentos grátis.',
    prices: { unique: 55.00 },
    free_toppings: 7,
    emoji: '🛶',
  },

  // ── MARMITAS ─────────────────────────────────────────────────
  {
    id: 'marmita-p',
    category_id: 'marmitas',
    name: 'Marmita P',
    description: 'Marmita pequena. Até 5 acompanhamentos grátis.',
    prices: { unique: 29.00 },
    free_toppings: 5,
    emoji: '📦',
  },

  // ── VITAMINA DE AÇAÍ ─────────────────────────────────────────
  {
    id: 'vitamina-300',
    category_id: 'vitamina',
    name: 'Vitamina 300ml',
    description: 'Açaí batido com leite e fruta à escolha.',
    prices: { unique: 18.00 },
    emoji: '🥤',
  },
  {
    id: 'vitamina-500',
    category_id: 'vitamina',
    name: 'Vitamina 500ml',
    description: 'Açaí batido com leite e fruta à escolha. Tamanho grande.',
    prices: { unique: 24.00 },
    emoji: '🥤',
  },

  // ── COMBOS ───────────────────────────────────────────────────
  {
    id: 'combo-casal',
    category_id: 'combos',
    name: 'Combo Casal',
    description: '2x Copo 400ml com acompanhamentos à escolha.',
    prices: { unique: 55.00 },
    emoji: '🎁',
  },
  {
    id: 'combo-familia',
    category_id: 'combos',
    name: 'Combo Família',
    description: '1 Barca M com acompanhamentos à vontade.',
    prices: { unique: 65.00 },
    emoji: '🎁',
  },

  // ── MILK SHAKE ───────────────────────────────────────────────
  {
    id: 'shake-acai',
    category_id: 'milkshake',
    name: 'Shake de Açaí',
    description: 'Cremoso milk shake de açaí. 400ml.',
    prices: { unique: 22.00 },
    emoji: '🥛',
  },
  {
    id: 'shake-morango',
    category_id: 'milkshake',
    name: 'Shake de Morango',
    description: 'Milk shake gelado de morango. 400ml.',
    prices: { unique: 20.00 },
    emoji: '🥛',
  },
  {
    id: 'shake-chocolate',
    category_id: 'milkshake',
    name: 'Shake de Chocolate',
    description: 'Milk shake cremoso de chocolate. 400ml.',
    prices: { unique: 20.00 },
    emoji: '🥛',
  },

  // ── PICOLÉS ──────────────────────────────────────────────────
  {
    id: 'picole-acai',
    category_id: 'picoles',
    name: 'Picolé de Açaí',
    description: 'Picolé artesanal de açaí puro.',
    prices: { unique: 8.00 },
    emoji: '🍭',
  },
  {
    id: 'picole-morango',
    category_id: 'picoles',
    name: 'Picolé de Morango',
    description: 'Picolé cremoso de morango.',
    prices: { unique: 7.00 },
    emoji: '🍭',
  },
  {
    id: 'picole-maracuja',
    category_id: 'picoles',
    name: 'Picolé de Maracujá',
    description: 'Picolé refrescante de maracujá.',
    prices: { unique: 7.00 },
    emoji: '🍭',
  },

  // ── BEBIDAS ──────────────────────────────────────────────────
  {
    id: 'bebida-agua',
    category_id: 'bebidas',
    name: 'Água Mineral',
    description: '500ml, com ou sem gás.',
    prices: { unique: 4.00 },
    emoji: '💧',
  },
  {
    id: 'bebida-coca-lata',
    category_id: 'bebidas',
    name: 'Coca-Cola Lata',
    description: '350ml gelada.',
    prices: { unique: 6.00 },
    emoji: '🥤',
  },
  {
    id: 'bebida-coca-2l',
    category_id: 'bebidas',
    name: 'Coca-Cola 2 Litros',
    description: 'Ideal para compartilhar.',
    prices: { unique: 14.00 },
    emoji: '🥤',
  },
  {
    id: 'bebida-suco',
    category_id: 'bebidas',
    name: 'Suco Natural',
    description: 'Laranja, limão ou maracujá. 300ml.',
    prices: { unique: 9.00 },
    emoji: '🍊',
  },
]
