import React from 'react'

export default function CategoryTabs({ categories, selected, onChange }) {
  return (
    <div className="sticky top-20 z-30 bg-[#0A0A0A] border-b border-white/5">
      <div className="flex gap-2 overflow-x-auto px-4 py-3 max-w-lg mx-auto">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={`
              flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full
              text-sm font-semibold transition-all duration-200 active:scale-95
              ${selected === cat.id
                ? 'bg-[#D4AF37] text-[#0A0A0A] shadow-lg shadow-[#D4AF37]/30'
                : 'bg-[#1A1A1A] text-gray-400'}
            `}
          >
            <span className="text-base leading-none">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
