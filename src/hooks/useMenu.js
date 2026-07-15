import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useMenu() {
  const [categories, setCategories] = useState([])
  const [products,   setProducts]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          supabase.from('categories').select('*').eq('active', true).order('order_position'),
          supabase.from('products').select('*').eq('active', true).order('order_position'),
        ])
        if (!mounted) return
        if (catRes.error)  throw catRes.error
        if (prodRes.error) throw prodRes.error
        setCategories(catRes.data  || [])
        setProducts(prodRes.data   || [])
        setError(null)
      } catch (e) {
        if (mounted) setError(e.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    // Atualiza o menu ao vivo quando o admin salva mudanças
    const ch = supabase
      .channel('public-menu')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products'   }, load)
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(ch)
    }
  }, [])

  // Produtos agrupados por category_id para acesso O(1)
  const byCategory = products.reduce((acc, p) => {
    if (!acc[p.category_id]) acc[p.category_id] = []
    acc[p.category_id].push(p)
    return acc
  }, {})

  return { categories, products, byCategory, loading, error }
}
