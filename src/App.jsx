import React, { useState, useCallback, useEffect } from 'react'
import { useMenu } from './hooks/useMenu'
import Header from './components/Header'
import CategoryTabs from './components/CategoryTabs'
import ProductCard from './components/ProductCard'
import PizzaBuilderModal from './components/PizzaBuilderModal'
import CartBottomSheet from './components/CartBottomSheet'
import CheckoutView from './components/CheckoutView'
import ConfirmationView from './components/ConfirmationView'
import AdminLogin from './components/admin/AdminLogin'
import AdminPanel from './components/admin/AdminPanel'
import { ADMIN_PIN } from './data/menu'

export default function App() {
  const { categories, byCategory, loading, error } = useMenu()

  const [view,           setView]          = useState('menu')
  const [cart,           setCart]          = useState([])
  const [activeCatId,    setActiveCatId]   = useState(null)
  const [builder,        setBuilder]       = useState({ open: false, product: null })
  const [cartOpen,       setCartOpen]      = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState(null)
  const [showAdminLogin, setAdminLogin]    = useState(false)
  const [adminAuthed,    setAdminAuthed]   = useState(false)

  // Link secreto: ?admin na URL abre o login sem botão visível na interface
  useEffect(() => {
    if (window.location.search.includes('admin')) {
      setAdminLogin(true)
    }
  }, [])

  // Seleciona a primeira categoria quando os dados chegam
  useEffect(() => {
    if (categories.length > 0 && !activeCatId) {
      setActiveCatId(categories[0].id)
    }
  }, [categories, activeCatId])

  const activeCategory  = categories.find(c => c.id === activeCatId) ?? null
  const shownProducts   = byCategory[activeCatId] ?? []

  // ── Cart ────────────────────────────────────────────────────
  const addToCart = useCallback((item) => {
    setCart(prev => {
      if (item.type === 'pizza') {
        return [...prev, { ...item, cartId: Date.now() + Math.random() }]
      }
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.cartId === existing.cartId ? { ...i, qty: (i.qty || 1) + 1 } : i)
      }
      return [...prev, { ...item, cartId: Date.now() + Math.random(), qty: 1 }]
    })
    setCartOpen(true)
  }, [])

  const updateQty = useCallback((cartId, delta) => {
    setCart(prev =>
      prev
        .map(i => i.cartId === cartId ? { ...i, qty: (i.qty || 1) + delta } : i)
        .filter(i => (i.qty || 1) > 0)
    )
  }, [])

  const removeItem = useCallback((cartId) => {
    setCart(prev => prev.filter(i => i.cartId !== cartId))
  }, [])

  const cartCount = cart.reduce((s, i) => s + (i.qty || 1), 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0)

  // ── Handlers ─────────────────────────────────────────────────
  const handleProductClick = (product) => {
    if (activeCategory?.is_pizza) {
      setBuilder({ open: true, product })
    } else {
      // Item simples: preço único, adiciona direto
      const price = Number(product.prices?.unique ?? 0)
      addToCart({ ...product, type: 'other', price, qty: 1 })
    }
  }

  const handleAdminLogin = (pin) => {
    if (pin === ADMIN_PIN) {
      setAdminAuthed(true)
      setAdminLogin(false)
      setView('admin')
      return true
    }
    return false
  }

  const handleOrderConfirmed = (order) => {
    setConfirmedOrder(order)
    setCart([])
    setCartOpen(false)
    setView('confirmation')
  }

  // ── Views ─────────────────────────────────────────────────────
  if (view === 'admin') {
    return <AdminPanel onBack={() => setView('menu')} />
  }
  if (view === 'checkout') {
    return <CheckoutView cart={cart} total={cartTotal} onBack={() => setView('menu')} onConfirm={handleOrderConfirmed} />
  }
  if (view === 'confirmation') {
    return <ConfirmationView order={confirmedOrder} onNewOrder={() => { setConfirmedOrder(null); setView('menu') }} />
  }

  // ── Menu principal ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onCartClick={() => setCartOpen(true)}
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          <CategoryTabs
            categories={categories}
            selected={activeCatId}
            onChange={setActiveCatId}
          />

<main className="px-4 py-4 pb-32 space-y-3 max-w-lg mx-auto">
            {shownProducts.length === 0 ? (
              <div className="text-center py-20">
                <span className="text-5xl block mb-4">🍽️</span>
                <p className="text-gray-500 font-medium">Nenhum produto nesta categoria.</p>
                <p className="text-gray-600 text-sm mt-1">Adicione produtos pelo Painel Admin.</p>
              </div>
            ) : (
              shownProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => handleProductClick(product)}
                />
              ))
            )}
          </main>
        </>
      )}

      {builder.open && (
        <PizzaBuilderModal
          pizza={builder.product}
          allPizzas={shownProducts}
          onClose={() => setBuilder({ open: false, product: null })}
          onAdd={(item) => {
            addToCart(item)
            setBuilder({ open: false, product: null })
          }}
        />
      )}

      <CartBottomSheet
        open={cartOpen}
        cart={cart}
        total={cartTotal}
        onClose={() => setCartOpen(false)}
        onRemove={removeItem}
        onUpdateQty={updateQty}
        onCheckout={() => { setCartOpen(false); setView('checkout') }}
      />

      {showAdminLogin && (
        <AdminLogin onLogin={handleAdminLogin} onClose={() => setAdminLogin(false)} />
      )}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center pt-24 gap-4">
      <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-500">Carregando cardápio...</p>
    </div>
  )
}

function ErrorState({ message }) {
  return (
    <div className="px-6 pt-24 text-center">
      <span className="text-5xl block mb-4">⚠️</span>
      <p className="text-gray-300 font-semibold mb-2">Não foi possível carregar o cardápio</p>
      <p className="text-gray-600 text-xs font-mono bg-[#1A1A1A] rounded-xl px-4 py-3 mt-3 text-left break-all">
        {message}
      </p>
      <p className="text-gray-600 text-sm mt-4">Verifique se a API está rodando em <code>VITE_API_URL</code>.</p>
    </div>
  )
}
