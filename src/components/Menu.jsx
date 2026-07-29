import React, { useState } from 'react'
import { fmt, getBasePrice } from '../utils/price'

export default function Menu({ categories, byCategory, activeCatId, onSelectProduct, isBuilder }) {
  const shownProducts = byCategory[activeCatId] ?? []

  if (shownProducts.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <span className="text-5xl block mb-4">🍧</span>
        <p className="text-gray-500 font-medium">Nenhum produto nesta categoria.</p>
        <p className="text-gray-600 text-sm mt-1">Adicione produtos pelo Painel Admin.</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-4 pb-32">
      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
        {shownProducts.map(product => (
          <ProductGridCard
            key={product.id}
            product={product}
            isBuilder={isBuilder}
            onClick={() => onSelectProduct(product)}
          />
        ))}
      </div>
    </div>
  )
}

function ProductGridCard({ product, isBuilder, onClick }) {
  const basePrice = getBasePrice(product.prices)

  return (
    <button
      onClick={onClick}
      className="flex flex-col bg-[#190844] rounded-xl overflow-hidden 
                 active:scale-[0.96] transition-all duration-150 text-left
                 border border-purple-700/20 hover:border-purple-600/40 group"
    >
      {/* Image placeholder */}
      <div className="w-full aspect-square bg-gradient-to-br from-gray-700 to-gray-900 
                      flex items-center justify-center overflow-hidden relative">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-800">
            <span className="text-4xl opacity-30">{product.emoji ?? '🍧'}</span>
          </div>
        )}
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-active:bg-black/20 transition-all" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-3">
        <h3 className="font-bold text-sm text-white leading-snug line-clamp-2 mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-400 line-clamp-1 flex-1">
          {product.description}
        </p>

        {/* Footer with price and button */}
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-purple-700/20">
          <span className="text-fuchsia-400 font-bold text-sm">
            {fmt(basePrice)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
            className="w-7 h-7 bg-[#DB2777] rounded-full flex items-center justify-center
                       text-white text-lg leading-none shadow-md shadow-[#DB2777]/40 
                       font-light active:scale-90 transition-transform flex-shrink-0"
          >
            +
          </button>
        </div>
      </div>
    </button>
  )
}
