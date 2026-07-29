// Mock API local — sem backend necessário.
// Quando o backend estiver pronto, substitua por chamadas HTTP reais.
// Atualize pix_key e whatsapp_number em MOCK_SETTINGS abaixo.

const MOCK_SETTINGS = {
  pix_key:         '(11) 99999-9999',    // substitua pela chave Pix real
  whatsapp_number: '5511999999999',       // substitua pelo número real (ex: 5511987654321)
}

export const api = {
  // ── Público ──────────────────────────────────────────────────
  createOrder: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 700))
    return { ...data, id: `${Date.now()}` }
  },

  getSettings: async () => ({ ...MOCK_SETTINGS }),

  // ── Admin (offline — ative quando o backend estiver rodando) ──
  getMenu:        async () => { throw new Error('Backend offline') },
  getOrders:      async () => { throw new Error('Backend offline') },
  updateOrder:    async () => { throw new Error('Backend offline') },
  ordersEvents:   ()       => { throw new Error('Backend offline') },
  getCategories:  async () => { throw new Error('Backend offline') },
  createCategory: async () => { throw new Error('Backend offline') },
  updateCategory: async () => { throw new Error('Backend offline') },
  deleteCategory: async () => { throw new Error('Backend offline') },
  getProducts:    async () => { throw new Error('Backend offline') },
  createProduct:  async () => { throw new Error('Backend offline') },
  updateProduct:  async () => { throw new Error('Backend offline') },
  deleteProduct:  async () => { throw new Error('Backend offline') },
  updateSettings: async () => { throw new Error('Backend offline') },
  uploadImage:    async () => { throw new Error('Backend offline') },
}
