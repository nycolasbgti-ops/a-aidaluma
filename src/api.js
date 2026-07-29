const BASE = import.meta.env.VITE_API_URL ?? ''

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  })
  if (res.status === 204) return null
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? res.statusText)
  return json
}

export const api = {
  // ── Público ──────────────────────────────────────────────────
  getMenu:     ()         => request('GET',   '/api/menu'),
  getSettings: ()         => request('GET',   '/api/settings'),
  createOrder: (data)     => request('POST',  '/api/orders', data),

  // ── Admin: Pedidos ────────────────────────────────────────────
  getOrders:   ()         => request('GET',   '/api/orders'),
  updateOrder: (id, data) => request('PATCH', `/api/orders/${id}`, data),
  ordersEvents: ()        => new EventSource(`${BASE}/api/orders/events`),

  // ── Admin: Categorias ─────────────────────────────────────────
  getCategories:  ()         => request('GET',    '/api/categories'),
  createCategory: (data)     => request('POST',   '/api/categories', data),
  updateCategory: (id, data) => request('PATCH',  `/api/categories/${id}`, data),
  deleteCategory: (id)       => request('DELETE', `/api/categories/${id}`),

  // ── Admin: Produtos ───────────────────────────────────────────
  getProducts:   (catId)     => request('GET',    `/api/products${catId ? `?category_id=${catId}` : ''}`),
  createProduct: (data)      => request('POST',   '/api/products', data),
  updateProduct: (id, data)  => request('PATCH',  `/api/products/${id}`, data),
  deleteProduct: (id)        => request('DELETE', `/api/products/${id}`),

  // ── Admin: Acompanhamentos ────────────────────────────────────
  getToppings:   ()          => request('GET',    '/api/toppings'),
  createTopping: (data)      => request('POST',   '/api/toppings', data),
  updateTopping: (id, data)  => request('PATCH',  `/api/toppings/${id}`, data),
  deleteTopping: (id)        => request('DELETE', `/api/toppings/${id}`),

  // ── Admin: Configurações ──────────────────────────────────────
  updateSettings: (data) => request('PATCH', '/api/settings', data),

  // ── Admin: Upload de imagem ───────────────────────────────────
  uploadImage: async (file) => {
    const form = new FormData()
    form.append('image', file)
    const res = await fetch(`${BASE}/api/upload`, { method: 'POST', body: form })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? res.statusText)
    return json
  },
}
