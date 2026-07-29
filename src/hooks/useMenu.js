import { useState, useEffect } from 'react'
import { api } from '../api'
import { categories as mockCategories, products as mockProducts, ACAI_TOPPINGS, ACAI_EXTRAS } from '../data/menu'

// Normaliza campo `name` do Supabase para `label` esperado pelo modal
const normalize = t => ({ key: t.key, label: t.name, price: Number(t.price) })

export function useMenu() {
  const [categories,   setCategories]   = useState([])
  const [products,     setProducts]     = useState([])
  const [freeToppings, setFreeToppings] = useState([])
  const [extras,       setExtras]       = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)

  useEffect(() => {
    api.getMenu()
      .then(({ categories, products, toppings = [] }) => {
        setCategories(categories)
        setProducts(products)
        setFreeToppings(toppings.filter(t => Number(t.price) === 0).map(normalize))
        setExtras(toppings.filter(t => Number(t.price) > 0).map(normalize))
      })
      .catch(() => {
        setCategories(mockCategories)
        setProducts(mockProducts)
        setFreeToppings(ACAI_TOPPINGS.map(t => ({ key: t.key, label: t.label, price: 0 })))
        setExtras(ACAI_EXTRAS.map(e => ({ key: e.key, label: e.label, price: Number(e.price) })))
        setError('Modo demonstração — conecte o Supabase para dados reais.')
      })
      .finally(() => setLoading(false))
  }, [])

  const byCategory = products.reduce((acc, p) => {
    if (!acc[p.category_id]) acc[p.category_id] = []
    acc[p.category_id].push(p)
    return acc
  }, {})

  return { categories, products, byCategory, freeToppings, extras, loading, error }
}
