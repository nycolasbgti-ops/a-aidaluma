import { useState, useEffect } from 'react'
import { categories as mockCategories, products as mockProducts } from '../data/menu'

// API desconectada — dados servidos localmente enquanto o backend não está configurado
export function useMenu() {
  const [categories, setCategories] = useState([])
  const [products,   setProducts]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  useEffect(() => {
    setCategories(mockCategories)
    setProducts(mockProducts)
    setLoading(false)
  }, [])

  const byCategory = products.reduce((acc, p) => {
    if (!acc[p.category_id]) acc[p.category_id] = []
    acc[p.category_id].push(p)
    return acc
  }, {})

  return { categories, products, byCategory, loading, error }
}
