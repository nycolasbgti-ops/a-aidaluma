import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../supabaseClient'
import MenuManager from './MenuManager'

const fmt = (v) => `R$ ${Number(v).toFixed(2).replace('.', ',')}`

const STATUS = {
  new:        { label: 'Novo',            icon: '🆕', bg: 'bg-blue-500',   next: 'preparing',  nextBtn: 'Iniciar Preparo'  },
  preparing:  { label: 'Em Preparo',      icon: '👨‍🍳', bg: 'bg-yellow-500', next: 'delivering', nextBtn: 'Saiu p/ Entrega' },
  delivering: { label: 'Saiu p/ Entrega', icon: '🛵', bg: 'bg-orange-500', next: 'delivered',  nextBtn: 'Marcar Entregue' },
  delivered:  { label: 'Entregue',        icon: '✅', bg: 'bg-green-600',  next: null,         nextBtn: null              },
}

const ORDER_TABS = [
  { key: 'new',        label: 'Novos'    },
  { key: 'preparing',  label: 'Preparo'  },
  { key: 'delivering', label: 'Entrega'  },
  { key: 'delivered',  label: 'Entregues'},
]

const PAYMENT_LABELS = { pix: 'Pix', credit: 'Crédito', debit: 'Débito', cash: 'Dinheiro' }

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60)   return `${diff}s atrás`
  if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`
  return `${Math.floor(diff / 3600)}h atrás`
}

function OrderCard({ order, onAdvance }) {
  const cfg  = STATUS[order.status] ?? STATUS.new
  const [busy, setBusy] = useState(false)

  const advance = async () => {
    if (!cfg.next || busy) return
    setBusy(true)
    await onAdvance(order.id, cfg.next)
    setBusy(false)
  }

  return (
    <div className={`bg-[#1A1A1A] rounded-2xl p-4 mb-3 ${order.status === 'new' ? 'ring-1 ring-blue-500/40' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-bold text-base leading-snug">{order.customer_name}</p>
          <p className="text-sm text-gray-400">{order.customer_phone}</p>
          <p className="text-xs text-gray-600 mt-0.5">{timeAgo(order.created_at)}</p>
        </div>
        <span className={`${cfg.bg} text-white text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0`}>
          {cfg.icon} {cfg.label}
        </span>
      </div>

      <div className="space-y-1 mb-3">
        {(order.items || []).map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-300 pr-2">{item.qty || 1}× {item.name}{item.crustLabel ? ` + ${item.crustLabel}` : ''}</span>
            <span className="text-[#D4AF37] font-medium flex-shrink-0">{fmt(item.price * (item.qty || 1))}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between py-2.5 border-t border-b border-white/5 mb-3">
        <div className="flex gap-1.5 flex-wrap">
          <span className="text-xs bg-[#242424] px-2 py-0.5 rounded-full text-gray-400">
            {order.delivery_type === 'delivery' ? '🛵 Entrega' : '🏪 Retirada'}
          </span>
          <span className="text-xs bg-[#242424] px-2 py-0.5 rounded-full text-gray-400">
            {PAYMENT_LABELS[order.payment_method] || order.payment_method}
          </span>
        </div>
        <span className="font-bold text-base text-white">{fmt(order.total)}</span>
      </div>

      {order.address && (
        <p className="text-xs text-gray-500 mb-3 flex gap-1.5"><span>📍</span><span>{order.address}</span></p>
      )}
      {order.notes && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-2 mb-3">
          <p className="text-xs text-yellow-300">📝 {order.notes}</p>
        </div>
      )}

      {cfg.next && (
        <button onClick={advance} disabled={busy}
          className="w-full py-3 bg-[#D4AF37] rounded-xl font-bold text-sm text-[#0A0A0A]
                     active:scale-[0.97] transition-all disabled:opacity-50 shadow-md shadow-[#D4AF37]/30">
          {busy ? '...' : cfg.nextBtn}
        </button>
      )}
    </div>
  )
}

// ── Pedidos panel ─────────────────────────────────────────────

function OrdersPanel() {
  const [orders,    setOrders]    = useState([])
  const [activeTab, setActiveTab] = useState('new')
  const [loading,   setLoading]   = useState(true)
  const [connOk,    setConnOk]    = useState(true)

  const fetchOrders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('orders').select('*').order('created_at', { ascending: false }).limit(200)
      if (error) throw error
      setOrders(data || [])
      setConnOk(true)
    } catch {
      setConnOk(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
    const ch = supabase
      .channel('admin-orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, ({ new: row }) =>
        setOrders(prev => [row, ...prev]))
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, ({ new: row }) =>
        setOrders(prev => prev.map(o => o.id === row.id ? row : o)))
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [fetchOrders])

  const handleAdvance = async (id, status) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (!error) setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  const filtered = orders.filter(o => o.status === activeTab)
  const newCount = orders.filter(o => o.status === 'new').length

  return (
    <>
      {/* Status tabs */}
      <div className="flex border-b border-white/5 bg-[#0A0A0A]">
        {ORDER_TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3.5 text-sm font-semibold relative transition-colors whitespace-nowrap ${
              activeTab === tab.key ? 'text-white' : 'text-gray-600'
            }`}>
            {tab.label}
            {tab.key === 'new' && newCount > 0 && (
              <span className="ml-1 bg-[#D4AF37] text-[#0A0A0A] text-[10px] font-bold rounded-full px-1.5 py-0.5 align-middle">
                {newCount}
              </span>
            )}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#D4AF37] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Carregando pedidos...</p>
          </div>
        ) : !connOk ? (
          <div className="text-center py-16 px-4">
            <span className="text-5xl block mb-4">⚠️</span>
            <p className="text-gray-300 font-semibold mb-1">Erro de conexão</p>
            <p className="text-gray-500 text-sm mb-5">Verifique as credenciais do Supabase.</p>
            <button onClick={fetchOrders} className="px-5 py-2.5 bg-[#1A1A1A] rounded-xl text-sm font-semibold">
              Tentar novamente
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">{STATUS[activeTab]?.icon || '📋'}</span>
            <p className="text-gray-500 font-medium">Nenhum pedido aqui</p>
          </div>
        ) : (
          filtered.map(order => <OrderCard key={order.id} order={order} onAdvance={handleAdvance} />)
        )}
      </div>
    </>
  )
}

// ── AdminPanel root ───────────────────────────────────────────

const MAIN_TABS = [
  { key: 'orders', label: '📋 Pedidos' },
  { key: 'menu',   label: '🍕 Cardápio' },
]

export default function AdminPanel({ onBack }) {
  const [mainTab, setMainTab] = useState('orders')
  const [orders, setOrders] = useState([])

  // Live badge for new orders even when on Cardápio tab
  const [newCount, setNewCount] = useState(0)
  useEffect(() => {
    const ch = supabase
      .channel('badge-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, async () => {
        const { data } = await supabase.from('orders').select('id').eq('status', 'new')
        setNewCount((data || []).length)
      })
      .subscribe()

    supabase.from('orders').select('id').eq('status', 'new').then(({ data }) =>
      setNewCount((data || []).length))

    return () => { supabase.removeChannel(ch) }
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/5
                      px-4 h-16 flex items-center gap-3">
        <div className="flex-1">
          <h1 className="text-lg font-bold leading-tight">Painel da Pizzaria</h1>
          <p className="text-xs text-gray-500">
            {mainTab === 'orders' ? 'Pedidos em tempo real' : 'Gerenciar cardápio'}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-medium text-green-400">Ao vivo</span>
        </div>
      </div>

      {/* Main tabs */}
      <div className="flex border-b border-white/5 bg-[#0A0A0A]">
        {MAIN_TABS.map(tab => (
          <button key={tab.key} onClick={() => setMainTab(tab.key)}
            className={`flex-1 py-3.5 text-sm font-semibold relative transition-colors ${
              mainTab === tab.key ? 'text-white' : 'text-gray-500'
            }`}>
            {tab.label}
            {tab.key === 'orders' && newCount > 0 && (
              <span className="ml-1 bg-[#D4AF37] text-[#0A0A0A] text-[10px] font-bold rounded-full px-1.5 py-0.5 align-middle">
                {newCount}
              </span>
            )}
            {mainTab === tab.key && (
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#D4AF37] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {mainTab === 'orders' ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          <OrdersPanel />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-5 max-w-lg mx-auto w-full pb-10">
          <MenuManager />
        </div>
      )}
    </div>
  )
}
