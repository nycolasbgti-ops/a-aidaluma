import { useState, useEffect } from 'react'
import { api } from '../api'

const POLL_INTERVAL = 30_000

export function useMenu() {
  const [categories, setCategories] = useState([])
  const [products,   setProducts]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const { categories: cats, products: prods } = await api.getMenu()
        if (!mounted) return
        setCategories(cats)
        setProducts(prods)
        setError(null)
      } catch (e) {
        if (mounted) setError(e.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    const interval = setInterval(load, POLL_INTERVAL)
    return () => { mounted = false; clearInterval(interval) }
  }, [])

  // Produtos agrupados por category_id para acesso O(1)
  const byCategory = products.reduce((acc, p) => {
    if (!acc[p.category_id]) acc[p.category_id] = []
    acc[p.category_id].push(p)
    return acc
  }, {})

  return { categories, products, byCategory, loading, error }
}
