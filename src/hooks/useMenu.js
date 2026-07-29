import { useState, useEffect } from 'react'
import { api } from '../api'
import { categories as mockCategories, products as mockProducts, ACAI_BASES, ACAI_TOPPINGS, ACAI_EXTRAS } from '../data/menu'

const normalizeAddon = (a) => ({ key: a.id ?? a.key, label: a.name, price: Number(a.price) })

function groupAddons(list) {
  const grouped = { massa: [], calda: [], acompanhamento: [], extra: [] }
  for (const a of (list || [])) {
    if (a.active === false) continue
    if (grouped[a.category]) grouped[a.category].push(normalizeAddon(a))
  }
  return grouped
}

export function useMenu() {
  const [categories, setCategories] = useState([])
  const [products,   setProducts]   = useState([])
  const [addons,     setAddons]     = useState({ massa: [], calda: [], acompanhamento: [], extra: [] })
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  useEffect(() => {
    api.getMenu()
      .then(({ categories, products, addons: rawAddons, toppings }) => {
        setCategories(categories)
        setProducts(products)

        if (rawAddons?.length) {
          setAddons(groupAddons(rawAddons))
        } else if (toppings?.length) {
          // Fallback: legado com tabela toppings (price=0 → acompanhamento, price>0 → extra)
          setAddons({
            massa:          [],
            calda:          [],
            acompanhamento: toppings.filter(t => Number(t.price) === 0).map(normalizeAddon),
            extra:          toppings.filter(t => Number(t.price) > 0).map(normalizeAddon),
          })
        }
      })
      .catch(() => {
        setCategories(mockCategories)
        setProducts(mockProducts)
        setAddons({
          massa:          ACAI_BASES.map(b => ({ key: b.key, label: b.label, price: 0 })),
          calda:          [],
          acompanhamento: ACAI_TOPPINGS.map(t => ({ key: t.key, label: t.label, price: 0 })),
          extra:          ACAI_EXTRAS.map(e => ({ key: e.key, label: e.label, price: Number(e.price) })),
        })
        setError('Modo demonstração — conecte o Supabase para dados reais.')
      })
      .finally(() => setLoading(false))
  }, [])

  const byCategory = products.reduce((acc, p) => {
    if (!acc[p.category_id]) acc[p.category_id] = []
    acc[p.category_id].push(p)
    return acc
  }, {})

  return { categories, products, byCategory, addons, loading, error }
}
