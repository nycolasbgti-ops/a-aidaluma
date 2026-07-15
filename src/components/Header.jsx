import React from 'react'
import logoImg from '../assets/logo.png'

const fmt = (v) => `R$ ${v.toFixed(2).replace('.', ',')}`

export default function Header({ cartCount, cartTotal, onCartClick }) {
  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#D4AF37]/10">
      <div className="max-w-lg mx-auto px-4 h-20 relative flex items-center">

        {/* Logo — absolutamente centralizada */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <img src={logoImg} alt="Pizzaria Império" className="h-12 w-auto object-contain" />
        </div>

        {/* Carrinho — direita */}
        <div className="ml-auto">
          {cartCount > 0 ? (
            <button
              onClick={onCartClick}
              className="flex items-center gap-2 bg-[#D4AF37] px-4 py-2.5 rounded-full
                         active:scale-95 transition-all shadow-lg shadow-[#D4AF37]/30 text-[#0A0A0A]"
            >
              <span className="text-xs font-bold bg-black/15 rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
              <span className="text-sm font-bold">{fmt(cartTotal)}</span>
            </button>
          ) : (
            <button
              onClick={onCartClick}
              className="w-9 h-9 flex items-center justify-center bg-[#1A1A1A] rounded-full"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
