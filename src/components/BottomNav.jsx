import React from 'react'

export default function BottomNav({ cartCount, onHomeClick, onCartClick, onProfileClick, activeTab = 'home' }) {
  const NavItem = ({ id, label, icon, onClick, isActive }) => (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center py-3 px-2 transition-all ${
        isActive
          ? 'text-[#DB2777]'
          : 'text-gray-500 hover:text-gray-400'
      }`}
    >
      <div className="relative flex items-center justify-center mb-1.5">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon === 'home' && (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 12l2.834-2.834a2 2 0 012.828 0L12 13l3.338-3.338a2 2 0 012.828 0L21 20M3 6h18M3 6v12a2 2 0 002 2h14a2 2 0 002-2V6" />
          )}
          {icon === 'cart' && (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          )}
          {icon === 'profile' && (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          )}
        </svg>
        {icon === 'cart' && cartCount > 0 && (
          <span className="absolute -top-1 -right-2 w-5 h-5 bg-[#DB2777] rounded-full text-white 
                           text-xs font-bold flex items-center justify-center">
            {cartCount > 9 ? '9+' : cartCount}
          </span>
        )}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  )

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0F0320] border-t border-purple-800/30 
                    backdrop-blur-lg z-40 max-w-lg mx-auto">
      <div className="flex items-center justify-around">
        <NavItem
          id="home"
          label="Início"
          icon="home"
          isActive={activeTab === 'home'}
          onClick={onHomeClick}
        />
        <NavItem
          id="cart"
          label="Carrinho"
          icon="cart"
          isActive={activeTab === 'cart'}
          onClick={onCartClick}
        />
        <NavItem
          id="profile"
          label="Perfil"
          icon="profile"
          isActive={activeTab === 'profile'}
          onClick={onProfileClick}
        />
      </div>
    </nav>
  )
}
