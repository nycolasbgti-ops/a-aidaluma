import React, { useState } from 'react'
import { CRUST_FLAVORS } from '../data/menu'
import { fmt, getPrice } from '../utils/price'

export default function PizzaBuilderModal({ pizza, allPizzas, onClose, onAdd }) {
  const [mode,        setMode]        = useState('whole') // 'whole' | 'half'
  const [secondHalf,  setSecondHalf]  = useState(null)
  const [crustFlavor, setCrustFlavor] = useState('none')
  const [qty,         setQty]         = useState(1)

  const price1 = getPrice(pizza.prices, null)
  const price2 = secondHalf ? getPrice(secondHalf.prices, null) : 0

  const basePrice  = mode === 'half' && secondHalf
    ? Math.round((price1 + price2) / 2 * 100) / 100
    : price1
  const crustPrice = CRUST_FLAVORS.find(f => f.key === crustFlavor)?.price ?? 0
  const unitPrice  = basePrice + crustPrice
  const total      = unitPrice * qty
  const canAdd     = mode === 'whole' || (mode === 'half' && secondHalf !== null)

  const compatiblePizzas = allPizzas.filter(p => p.id !== pizza.id && p.is_sweet === pizza.is_sweet)

  const handleAdd = () => {
    if (!canAdd) return
    const name = mode === 'half' && secondHalf
      ? `${pizza.name} / ${secondHalf.name}`
      : pizza.name

    const crustInfo = CRUST_FLAVORS.find(f => f.key === crustFlavor)

    onAdd({
      id:         `${pizza.id}${secondHalf ? `-${secondHalf.id}` : ''}-${Date.now()}`,
      name,
      type:       'pizza',
      mode,
      crustFlavor,
      crustLabel: crustInfo.key !== 'none' ? crustInfo.label : null,
      price:      unitPrice,
      qty,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={onClose} />

      <div className="relative bg-[#161616] rounded-t-3xl max-h-[92vh] flex flex-col animate-slideUp">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-white/15 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 pt-2 pb-4 border-b border-white/5 flex-shrink-0 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Monte sua Pizza</h2>
            <p className="text-xs text-gray-500 mt-0.5">Personalize do jeito que preferir</p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 bg-white/8 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5">

          {/* ── Inteira / Meio a Meio ── */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">Tipo</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { v: 'whole', label: '🍕 Pizza Inteira', sub: 'Um sabor' },
                { v: 'half',  label: '½ Meio a Meio',   sub: 'Dois sabores' },
              ].map(opt => (
                <button
                  key={opt.v}
                  onClick={() => { setMode(opt.v); if (opt.v === 'whole') setSecondHalf(null) }}
                  className={`py-3 px-4 rounded-2xl text-left transition-all border ${
                    mode === opt.v
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white'
                      : 'bg-[#232323] border-transparent text-gray-400'
                  }`}
                >
                  <p className="font-semibold text-sm">{opt.label}</p>
                  <p className="text-xs mt-0.5 opacity-60">{opt.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* ── 1ª metade ── */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
              {mode === 'half' ? '1ª metade' : 'Sabor selecionado'}
            </p>
            <div className="bg-[#232323] rounded-2xl p-4 flex items-center gap-3">
              {pizza.image_url ? (
                <img src={pizza.image_url} alt={pizza.name}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <span className="text-3xl">🍕</span>
              )}
              <div className="flex-1">
                <p className="font-bold text-white text-sm">{pizza.name}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{pizza.description}</p>
              </div>
              <p className="text-[#D4AF37] font-bold text-sm flex-shrink-0">{fmt(price1)}</p>
            </div>
          </div>

          {/* ── 2ª metade ── */}
          {mode === 'half' && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
                2ª metade {!secondHalf && <span className="text-[#D4AF37]">— escolha abaixo</span>}
              </p>

              {pizza.is_sweet && (
                <div className="mb-3 bg-pink-500/10 border border-pink-500/20 rounded-xl px-3 py-2">
                  <p className="text-xs text-pink-300">🍬 Pizza doce — a 2ª metade também deve ser doce.</p>
                </div>
              )}

              {compatiblePizzas.length === 0 ? (
                <div className="bg-[#232323] rounded-2xl p-4 text-center">
                  <p className="text-gray-500 text-sm">Nenhuma outra pizza disponível para combinar.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {compatiblePizzas.map(p => {
                    const isSelected = secondHalf?.id === p.id
                    const p2Price    = getPrice(p.prices, null)
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSecondHalf(p)}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all border ${
                          isSelected
                            ? 'bg-[#D4AF37]/15 border-[#D4AF37]'
                            : 'bg-[#232323] border-transparent'
                        }`}
                      >
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                        ) : (
                          <span className="text-2xl">🍕</span>
                        )}
                        <div className="flex-1 text-left">
                          <p className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                            {p.name}
                          </p>
                          <p className="text-[#D4AF37] text-xs font-semibold mt-0.5">{fmt(p2Price)}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isSelected ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-gray-600'
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-[#0A0A0A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {secondHalf && (
                <div className="mt-3 bg-[#D4AF37]/8 border border-[#D4AF37]/20 rounded-xl px-4 py-2.5">
                  <p className="text-xs text-[#D4AF37] text-center">
                    💡 Preço = média dos sabores: <strong>{fmt(Math.round((price1 + price2) / 2 * 100) / 100)}</strong>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Sabor da Borda ── */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">Borda</p>
            <div className="space-y-2">
              {CRUST_FLAVORS.map(flavor => (
                <button
                  key={flavor.key}
                  onClick={() => setCrustFlavor(flavor.key)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${
                    crustFlavor === flavor.key
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37]'
                      : 'bg-[#232323] border-transparent'
                  }`}
                >
                  <span className="text-2xl">{flavor.key === 'none' ? '🍕' : '🧀'}</span>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-sm text-white">{flavor.label}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#D4AF37] font-bold text-sm">+ {fmt(flavor.price)}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      crustFlavor === flavor.key ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-gray-600'
                    }`}>
                      {crustFlavor === flavor.key && (
                        <svg className="w-3 h-3 text-[#0A0A0A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="h-2" />
        </div>

        {/* Footer */}
        <div className="px-5 pt-4 pb-8 border-t border-white/5 flex-shrink-0 bg-[#161616]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400 font-medium">Quantidade</span>
            <div className="flex items-center gap-4">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-full bg-[#2C2C2E] flex items-center justify-center text-lg
                           active:scale-90 transition-transform">−</button>
              <span className="font-bold text-xl w-6 text-center">{qty}</span>
              <button onClick={() => setQty(q => q + 1)}
                className="w-9 h-9 rounded-full bg-[#D4AF37] flex items-center justify-center text-lg
                           text-[#0A0A0A] active:scale-90 transition-transform shadow-md shadow-[#D4AF37]/40">+</button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!canAdd}
            className={`w-full py-4 rounded-2xl font-bold text-[15px] flex items-center justify-between px-6
                        transition-all active:scale-[0.98] ${
              canAdd
                ? 'bg-[#D4AF37] text-[#0A0A0A] shadow-lg shadow-[#D4AF37]/40'
                : 'bg-[#2C2C2E] text-gray-600 cursor-not-allowed'
            }`}
          >
            <span>{canAdd ? 'Adicionar ao Carrinho' : 'Escolha a 2ª metade'}</span>
            {canAdd && <span>{fmt(total)}</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
