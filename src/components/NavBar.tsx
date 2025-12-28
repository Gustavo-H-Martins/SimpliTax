/**
 * 🧭 NavBar - Barra de Navegação Universal do SimpliTax
 * 
 * Componente de navegação com botão Home e links principais
 * para usar em todas as páginas do sistema.
 * 
 * @author LMartins (Product Manager) - SimpliTax
 */

'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Home, LayoutDashboard, Calculator, FileUp, FileText, FolderOpen } from 'lucide-react'
import Logo from './Logo'

export default function NavBar() {
  const router = useRouter()
  const pathname = usePathname()

  const allNavItems = [
    { icon: Home, label: 'Início', path: '/', color: 'text-gray-600 hover:text-blue-600', showIn: ['all'] },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', color: 'text-blue-600 hover:text-blue-700', showIn: ['all'] },
    { icon: Calculator, label: 'Otimizador', path: '/otimizador', color: 'text-green-600 hover:text-green-700', showIn: ['all'] },
    { icon: FileUp, label: 'Upload', path: '/upload', color: 'text-purple-600 hover:text-purple-700', showIn: ['/', '/dashboard', '/upload', '/exemplos-input'] },
    { icon: FolderOpen, label: 'Modelos', path: '/exemplos-input', color: 'text-pink-600 hover:text-pink-700', showIn: ['/', '/dashboard', '/upload', '/exemplos-input'] },
    { icon: FileText, label: 'Relatório', path: '/relatorio-alivio', color: 'text-orange-600 hover:text-orange-700', showIn: ['all'] }
  ]

  // Filtrar itens baseado na página atual
  const navItems = allNavItems.filter(item => 
    item.showIn.includes('all') || item.showIn.includes(pathname)
  )

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => router.push('/')}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Logo size={36} showText={true} />
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                    ${active 
                      ? 'bg-blue-50 text-blue-600 font-semibold' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </button>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => {
              const mobileMenu = document.getElementById('mobile-menu')
              if (mobileMenu) {
                mobileMenu.classList.toggle('hidden')
              }
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div id="mobile-menu" className="hidden md:hidden pb-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            
            return (
              <button
                key={item.path}
                onClick={() => {
                  router.push(item.path)
                  document.getElementById('mobile-menu')?.classList.add('hidden')
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1
                  ${active 
                    ? 'bg-blue-50 text-blue-600 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
