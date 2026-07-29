import { useState, useEffect } from 'react'
import { api } from '../api'
import { categories as mockCategories, products as mockProducts, ACAI_TOPPINGS, ACAI_EXTRAS } from '../data/menu'

export function useMenu() {
  const [categories, setCategories] = useState([])
  const [products,   setProducts]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  useEffect(() => {
    api.getMenu()
      .then(({ categories, products }) => {
        setCategories(categories)
        setProducts(products)
      })
      .catch(() => {
        // Fallback para dados locais se a API não estiver disponível
        setCategories(mockCategories)
        setProducts(mockProducts)
        setError('Modo demonstração — conecte o backend para dados reais.')
      })
      .finally(() => setLoading(false))
  }, [])

  const byCategory = products.reduce((acc, p) => {
    if (!acc[p.category_id]) acc[p.category_id] = []
    acc[p.category_id].push(p)
    return acc
  }, {})

  return { categories, products, byCategory, loading, error }
}
