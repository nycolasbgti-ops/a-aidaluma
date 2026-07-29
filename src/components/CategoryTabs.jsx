import React, { useRef, useEffect } from 'react'

function CategoryIcon({ icon, name }) {
  const isUrl = icon && (icon.startsWith('http') || icon.startsWith('/'))
  if (isUrl) {
    return (
      <img
        src={icon}
        alt={name}
        className="w-8 h-8 object-contain flex-shrink-0"
      />
    )
  }
  return <span className="text-xl leading-none">{icon}</span>
}

export default function CategoryTabs({ categories, selected, onChange }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!selected || !containerRef.current) return
    const btn = containerRef.current.querySelector(`[data-cat-btn="${selected}"]`)
    btn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [selected])

  return (
    <div className="sticky top-16 z-30 bg-[#07011A] border-b border-purple-800/30">
      <div ref={containerRef} className="flex gap-2 overflow-x-auto px-4 py-2 max-w-lg mx-auto scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat.id}
            data-cat-btn={cat.id}
            onClick={() => onChange(cat.id)}
            className={`
              flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-2xl
              text-xs font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap min-w-[60px]
              ${selected === cat.id
                ? 'bg-[#DB2777] text-white shadow-lg shadow-[#DB2777]/40'
                : 'bg-purple-950/40 text-gray-400 border border-purple-800/20'}
            `}
          >
            <CategoryIcon icon={cat.icon} name={cat.name} />
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
