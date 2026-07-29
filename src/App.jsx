import React, { useState, useCallback, useEffect } from 'react'
import { useMenu } from './hooks/useMenu'
import Header from './components/Header'
import CategoryTabs from './components/CategoryTabs'
import Menu from './components/Menu'
import AcaiBuilderModal from './components/AcaiBuilderModal'
import CartBottomSheet from './components/CartBottomSheet'
import CheckoutView from './components/CheckoutView'
import ConfirmationView from './components/ConfirmationView'
import BottomNav from './components/BottomNav'
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
  const [navTab,         setNavTab]        = useState('home')

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

  const activeCategory = categories.find(c => c.id === activeCatId) ?? null
  const shownProducts  = byCategory[activeCatId] ?? []

  // ── Cart ─────────────────────────────────────────────────────
  const addToCart = useCallback((item) => {
    setCart(prev => {
      // Açaí montado: cada pedido é único (customização diferente)
      if (item.type === 'acai') {
        return [...prev, { ...item, cartId: Date.now() + Math.random() }]
      }
      // Item simples: incrementa qty se já está no carrinho
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.cartId === existing.cartId ? { ...i, qty: (i.qty || 1) + 1 } : i)
      }
      return [...prev, { ...item, cartId: Date.now() + Math.random(), qty: 1 }]
    })
    setNavTab('home')
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
    if (activeCategory?.is_builder) {
      setBuilder({ open: true, product })
    } else {
      const price = Number(product.prices?.unique ?? product.price ?? 0)
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
    return <ConfirmationView order={confirmedOrder} onNewOrder={() => { setConfirmedOrder(null); setView('menu'); setNavTab('home') }} />
  }

  // ── Menu principal ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#07011A] text-white flex flex-col">
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onCartClick={() => { setCartOpen(true); setNavTab('cart') }}
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

          <main className="flex-1 overflow-y-auto">
            <Menu
              categories={categories}
              byCategory={byCategory}
              activeCatId={activeCatId}
              onSelectProduct={handleProductClick}
              isBuilder={activeCategory?.is_builder}
            />
          </main>
        </>
      )}

      {builder.open && (
        <AcaiBuilderModal
          product={builder.product}
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

      <BottomNav
        cartCount={cartCount}
        onHomeClick={() => setNavTab('home')}
        onCartClick={() => { setCartOpen(true); setNavTab('cart') }}
        onProfileClick={() => setNavTab('profile')}
        activeTab={navTab}
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
      <div className="w-10 h-10 border-2 border-[#DB2777] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-500">Carregando cardápio...</p>
    </div>
  )
}

function ErrorState({ message }) {
  return (
    <div className="px-6 pt-24 text-center">
      <span className="text-5xl block mb-4">⚠️</span>
      <p className="text-gray-300 font-semibold mb-2">Não foi possível carregar o cardápio</p>
      <p className="text-gray-600 text-xs font-mono bg-[#1A0B2E] rounded-xl px-4 py-3 mt-3 text-left break-all">
        {message}
      </p>
      <p className="text-gray-600 text-sm mt-4">Verifique se a API está rodando em <code>VITE_API_URL</code>.</p>
    </div>
  )
}
