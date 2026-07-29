import React, { useRef, useEffect } from 'react'

export default function CategoryTabs({ categories, selected, onChange }) {
  const containerRef = useRef(null)

  // Auto-scroll o tab ativo para o centro quando muda por scroll spy
  useEffect(() => {
    if (!selected || !containerRef.current) return
    const btn = containerRef.current.querySelector(`[data-cat-btn="${selected}"]`)
    btn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [selected])

  return (
    <div className="sticky top-16 z-30 bg-[#07011A] border-b border-purple-800/30">
      <div ref={containerRef} className="flex gap-2 overflow-x-auto px-4 py-3 max-w-lg mx-auto scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat.id}
            data-cat-btn={cat.id}
            onClick={() => onChange(cat.id)}
            className={`
              flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full
              text-xs font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap
              ${selected === cat.id
                ? 'bg-[#DB2777] text-white shadow-lg shadow-[#DB2777]/40'
                : 'bg-purple-950/40 text-gray-400 border border-purple-800/20'}
            `}
          >
            <span className="text-sm leading-none">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
