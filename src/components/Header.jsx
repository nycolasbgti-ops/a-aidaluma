import React from 'react'

const fmt = (v) => `R$ ${Number(v || 0).toFixed(2).replace('.', ',')}`

export default function Header({ cartCount, cartTotal, onCartClick }) {
  return (
    <header className="sticky top-0 z-40 bg-[#07011A]/95 backdrop-blur-xl border-b border-purple-800/30">
      <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo — esquerda */}
        <div className="flex items-center gap-2 flex-1">
          <span className="text-2xl leading-none">🍧</span>
          <span className="font-bold text-white text-base tracking-tight">Pivô</span>
        </div>

        {/* Carrinho — direita */}
        <div>
          {cartCount > 0 ? (
            <button
              onClick={onCartClick}
              className="flex items-center gap-2 bg-[#DB2777] px-3 py-2 rounded-full
                         active:scale-95 transition-all shadow-lg shadow-[#DB2777]/40 text-white text-sm"
            >
              <span className="text-xs font-bold bg-black/20 rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
              <span className="text-xs font-bold">{fmt(cartTotal)}</span>
            </button>
          ) : (
            <button
              onClick={onCartClick}
              className="w-9 h-9 flex items-center justify-center bg-purple-950/60 rounded-full 
                         border border-purple-800/40 text-gray-400 transition-all active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
