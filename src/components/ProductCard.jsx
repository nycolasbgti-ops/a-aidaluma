import React from 'react'
import { fmt, getBasePrice, hasSizes } from '../utils/price'

export default function ProductCard({ product, onClick }) {
  const basePrice = getBasePrice(product.prices)
  const sized     = hasSizes(product.prices)

  return (
    <button
      onClick={onClick}
      className="w-full bg-[#1A1A1A] rounded-2xl p-4 flex items-center gap-4
                 active:scale-[0.98] transition-all duration-150 text-left
                 border border-white/0 hover:border-[#D4AF37]/10"
    >
      <div className="w-[72px] h-[72px] bg-[#242424] rounded-xl flex-shrink-0 overflow-hidden
                      flex items-center justify-center">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="text-[38px]">🍕</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-[15px] text-white leading-snug">{product.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-[#D4AF37] font-bold text-base flex items-baseline gap-1">
            {sized && (
              <span className="text-[11px] text-gray-500 font-normal">a partir de</span>
            )}
            {fmt(basePrice)}
          </span>
          <span className="w-7 h-7 bg-[#D4AF37] rounded-full flex items-center justify-center
                           text-[#0A0A0A] text-xl leading-none shadow-md shadow-[#D4AF37]/40 font-light">
            +
          </span>
        </div>
      </div>
    </button>
  )
}
