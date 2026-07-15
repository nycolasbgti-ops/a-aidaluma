// Número do WhatsApp da pizzaria (formato internacional, sem + ou espaços)
// Ex.: 5511999999999 para (11) 99999-9999
export const WHATSAPP_NUMBER = 'COLOQUE_SEU_NUMERO_AQUI'

export const CRUST_FLAVORS = [
  { key: 'none',     label: 'Sem borda',         price: 0 },
  { key: 'catupiry', label: 'Borda de Catupiry', price: 6 },
  { key: 'cheddar',  label: 'Borda de Cheddar',  price: 6 },
]

export const ADMIN_PIN = '1234'

export const PIX_KEY = 'CHAVE_PIX_AQUI'

export const categories = [
  { id: 'pizzas',      name: 'Pizzas',      icon: '🍕' },
  { id: 'bebidas',     name: 'Bebidas',     icon: '🥤' },
  { id: 'sobremesas',  name: 'Sobremesas',  icon: '🍰' },
]

export const products = [
  // ── PIZZAS SALGADAS ──────────────────────────────────────────
  { id: '01-mussarela',        category: 'pizzas', sweet: false, emoji: '🧀', prices: { P: 30, M: 40, G: 50 }, price: 40, name: '01 - Mussarela',           description: 'Molho de tomate, queijo mussarela, orégano, azeitona.' },
  { id: '02-marguerita',       category: 'pizzas', sweet: false, emoji: '🍅', prices: { P: 30, M: 40, G: 50 }, price: 40, name: '02 - Marguerita',           description: 'Molho de tomate, queijo mussarela, tomate, manjericão, orégano, azeitona.' },
  { id: '03-calabresa',        category: 'pizzas', sweet: false, emoji: '🌶️', prices: { P: 30, M: 40, G: 50 }, price: 40, name: '03 - Calabresa',            description: 'Molho de tomate, queijo mussarela, calabresa fatiada, cebola fatiada, orégano, azeitona.' },
  { id: '04-calabresa-catupiry',category: 'pizzas', sweet: false, emoji: '🌶️', prices: { P: 30, M: 40, G: 50 }, price: 40, name: '04 - Calabresa com Catupiry', description: 'Molho de tomate, queijo mussarela, calabresa fatiada, catupiry, cebola fatiada, orégano, azeitona.' },
  { id: '05-file-mignon',      category: 'pizzas', sweet: false, emoji: '🥩', prices: { P: 30, M: 40, G: 50 }, price: 40, name: '05 - Filé Mignon',          description: 'Molho de tomate, queijo mussarela, filé mignon, alho frito, catupiry, bacon, orégano, azeitona.' },
  { id: '06-alho-poro',        category: 'pizzas', sweet: false, emoji: '🥓', prices: { P: 30, M: 40, G: 50 }, price: 40, name: '06 - Alho Poró',            description: 'Molho de tomate, alho poró, alho frito, bacon, queijo mussarela, tomate cereja, catupiry, orégano, azeitona.' },
  { id: '07-carne-seca-1',     category: 'pizzas', sweet: false, emoji: '🥩', prices: { P: 30, M: 40, G: 50 }, price: 40, name: '07 - Carne Seca',           description: 'Molho de tomate, carne seca, queijo mussarela, cebola fatiada, catupiry, orégano, azeitona.' },
  { id: '08-atum',             category: 'pizzas', sweet: false, emoji: '🐟', prices: { P: 30, M: 40, G: 50 }, price: 40, name: '08 - Atum',                 description: 'Molho de tomate, queijo mussarela, atum, cebola fatiada, orégano, azeitona.' },
  { id: '09-quatro-queijos-1', category: 'pizzas', sweet: false, emoji: '🧀', prices: { P: 30, M: 40, G: 50 }, price: 40, name: '09 - Quatro Queijos 1',     description: 'Molho de tomate, queijo mussarela, queijo provolone, queijo gorgonzola, queijo parmesão, orégano, azeitona.' },
  { id: '10-palmito',          category: 'pizzas', sweet: false, emoji: '🌿', prices: { P: 30, M: 40, G: 50 }, price: 40, name: '10 - Palmito',              description: 'Molho de tomate, palmito, queijo mussarela, bacon, tomate cereja, catupiry, orégano, azeitona.' },
  { id: '11-abobrinha',        category: 'pizzas', sweet: false, emoji: '🥒', prices: { P: 30, M: 40, G: 50 }, price: 40, name: '11 - Abobrinha',            description: 'Molho de tomate, abobrinha, bacon, tomate cereja, queijo mussarela, catupiry, orégano, azeitona.' },
  { id: '12-baiana',           category: 'pizzas', sweet: false, emoji: '🔥', prices: { P: 30, M: 40, G: 50 }, price: 40, name: '12 - Baiana',               description: 'Molho de tomate, queijo mussarela, cebola fatiada, calabresa moída, pimenta dedo de moça, orégano, azeitona.' },
  { id: '13-toscana',          category: 'pizzas', sweet: false, emoji: '🌶️', prices: { P: 30, M: 40, G: 50 }, price: 40, name: '13 - Toscana',              description: 'Molho de tomate, linguiça toscana, queijo mussarela, vinagrete de tomate, pimenta biquinho, orégano, azeitona.' },
  { id: '14-frango-catupiry',  category: 'pizzas', sweet: false, emoji: '🍗', prices: { P: 30, M: 40, G: 50 }, price: 40, name: '14 - Frango com Catupiry',  description: 'Molho de tomate, frango desfiado, queijo mussarela, tomate cereja, catupiry, orégano e azeitona.' },
  { id: '15-carne-seca-2',     category: 'pizzas', sweet: false, emoji: '🥩', prices: { P: 30, M: 40, G: 50 }, price: 40, name: '15 - Carne Seca',           description: 'Molho de tomate, queijo mussarela, carne seca, cebola, catupiry, alho frito, orégano e azeitona.' },
  { id: '16-portuguesa',       category: 'pizzas', sweet: false, emoji: '🫒', prices: { P: 30, M: 40, G: 50 }, price: 40, name: '16 - Portuguesa',           description: 'Molho de tomate, presunto fatiado, ervilha fresca, cebola fatiada, palmito, ovo cozido, tomate e presunto.' },
  { id: '17-brocolis',         category: 'pizzas', sweet: false, emoji: '🥦', prices: { P: 30, M: 40, G: 50 }, price: 40, name: '17 - Brócolis',             description: 'Molho de tomate, brócolis, bacon, tomate cereja, alho frito, catupiry, orégano e azeitona.' },
  { id: '18-quatro-queijos-2', category: 'pizzas', sweet: false, emoji: '🧀', prices: { P: 30, M: 40, G: 50 }, price: 40, name: '18 - Quatro Queijos 2',     description: 'Molho de tomate, queijo mussarela, queijo provolone, catupiry, queijo parmesão, orégano, azeitona.' },
  { id: '19-bacon',            category: 'pizzas', sweet: false, emoji: '🥓', prices: { P: 30, M: 40, G: 50 }, price: 40, name: '19 - Bacon',                description: 'Molho de tomate, bacon, tomate cereja, queijo mussarela, catupiry, orégano, azeitona.' },
  { id: '20-pepperoni',        category: 'pizzas', sweet: false, emoji: '🍕', prices: { P: 30, M: 40, G: 50 }, price: 40, name: '20 - Pepperoni',            description: 'Molho de tomate, queijo mussarela, pepperoni, orégano, azeitona.' },
  { id: '21-lombo',            category: 'pizzas', sweet: false, emoji: '🥩', prices: { P: 30, M: 40, G: 50 }, price: 40, name: '21 - Lombo',                description: 'Molho de tomate, queijo mussarela, lombo, catupiry, tomate cereja, orégano, azeitona.' },
  { id: '22-bauru',            category: 'pizzas', sweet: false, emoji: '🍖', prices: { P: 30, M: 40, G: 50 }, price: 40, name: '22 - Bauru',                description: 'Molho de tomate, presunto, queijo mussarela, tomate, orégano e azeitona.' },
  { id: '23-tomate-seco',      category: 'pizzas', sweet: false, emoji: '🍅', prices: { P: 30, M: 40, G: 50 }, price: 40, name: '23 - Tomate Seco',          description: 'Molho de tomate, queijo mussarela, alho frito, rúcula fresca, mussarela de búfala.' },
  { id: '24-moda-da-casa',     category: 'pizzas', sweet: false, emoji: '⭐', prices: { P: 30, M: 40, G: 50 }, price: 40, name: '24 - Moda da Casa',         description: 'Molho de tomate, queijo mussarela, frango desfiado, bacon, palmito, tomate cereja, catupiry, orégano e azeitona.' },
  { id: '25-vegetariana',      category: 'pizzas', sweet: false, emoji: '🥦', prices: { P: 30, M: 40, G: 50 }, price: 40, name: '25 - Vegetariana',          description: 'Molho de tomate, berinjela, pimentão amarelo e vermelho, abobrinha, queijo mussarela, orégano e azeitona.' },

  // ── PIZZAS DOCES ────────────────────────────────────────────
  { id: 'doce-01-banana',      category: 'pizzas', sweet: true,  emoji: '🍌', prices: { P: 30, M: 40, G: 50 }, price: 40, name: 'Banana com Doce de Leite', description: 'Doce de leite, banana fatiada, creme branco, canela com açúcar.' },

  // ── BEBIDAS ─────────────────────────────────────────────────
  {
    id: 101,
    category: 'bebidas',
    name: 'Coca-Cola Lata',
    description: '350ml gelada.',
    price: 6.00,
    emoji: '🥤',
  },
  {
    id: 102,
    category: 'bebidas',
    name: 'Coca-Cola 2 Litros',
    description: 'Ideal para compartilhar.',
    price: 14.00,
    emoji: '🥤',
  },
  {
    id: 103,
    category: 'bebidas',
    name: 'Suco Natural',
    description: 'Laranja, limão ou maracujá. 300ml, feito na hora.',
    price: 9.00,
    emoji: '🍊',
  },
  {
    id: 104,
    category: 'bebidas',
    name: 'Água Mineral',
    description: '500ml, com ou sem gás.',
    price: 4.00,
    emoji: '💧',
  },
  {
    id: 105,
    category: 'bebidas',
    name: 'Heineken 600ml',
    description: 'Long neck bem gelada.',
    price: 14.00,
    emoji: '🍺',
  },
  {
    id: 106,
    category: 'bebidas',
    name: 'Guaraná Antarctica',
    description: '350ml lata, bem gelado.',
    price: 6.00,
    emoji: '🟢',
  },

  // ── SOBREMESAS ───────────────────────────────────────────────
  {
    id: 201,
    category: 'sobremesas',
    name: 'Petit Gateau',
    description: 'Bolinho de chocolate com centro derretido e sorvete de baunilha.',
    price: 22.00,
    emoji: '🍫',
  },
  {
    id: 202,
    category: 'sobremesas',
    name: 'Brownie com Sorvete',
    description: 'Brownie de chocolate com nozes servido quente com sorvete.',
    price: 16.00,
    emoji: '🍫',
  },
  {
    id: 203,
    category: 'sobremesas',
    name: 'Sorvete 2 Bolas',
    description: 'Chocolate, baunilha ou morango. Com calda à sua escolha.',
    price: 12.00,
    emoji: '🍦',
  },
  {
    id: 204,
    category: 'sobremesas',
    name: 'Churros',
    description: 'Porção com 4 churros crocantes recheados com doce de leite.',
    price: 18.00,
    emoji: '🍩',
  },
]
