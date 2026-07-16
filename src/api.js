const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

async function request(method, path, body) {
  const opts = { method, headers: {} }
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(body)
  }
  const res = await fetch(BASE + path, opts)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Erro HTTP ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  // ── Público ──────────────────────────────────────────────────
  getMenu:       ()           => request('GET',   '/api/menu'),
  createOrder:   (body)       => request('POST',  '/api/orders', body),

  // ── Admin: Pedidos ────────────────────────────────────────────
  getOrders:     ()           => request('GET',   '/api/orders'),
  updateOrder:   (id, body)   => request('PATCH', `/api/orders/${id}`, body),
  ordersEvents:  ()           => new EventSource(`${BASE}/api/orders/events`),

  // ── Admin: Categorias ─────────────────────────────────────────
  getCategories:  ()           => request('GET',    '/api/categories'),
  createCategory: (body)       => request('POST',   '/api/categories', body),
  updateCategory: (id, body)   => request('PATCH',  `/api/categories/${id}`, body),
  deleteCategory: (id)         => request('DELETE', `/api/categories/${id}`),

  // ── Admin: Produtos ───────────────────────────────────────────
  getProducts:   (catId)      => request('GET',    `/api/products?category_id=${catId}`),
  createProduct: (body)       => request('POST',   '/api/products', body),
  updateProduct: (id, body)   => request('PATCH',  `/api/products/${id}`, body),
  deleteProduct: (id)         => request('DELETE', `/api/products/${id}`),

  // ── Admin: Configurações ──────────────────────────────────────
  getSettings:    ()           => request('GET',   '/api/settings'),
  updateSettings: (body)       => request('PATCH', '/api/settings', body),

  // ── Admin: Upload de imagem ───────────────────────────────────
  uploadImage: async (file) => {
    const form = new FormData()
    form.append('image', file)
    const res = await fetch(`${BASE}/api/upload`, { method: 'POST', body: form })
    if (!res.ok) throw new Error(`Erro no upload: HTTP ${res.status}`)
    return res.json()
  },
}
