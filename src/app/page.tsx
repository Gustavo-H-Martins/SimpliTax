'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import Footer from '@/components/Footer'
import Logo from '@/components/Logo'
import { 
  LayoutDashboard, 
  Calculator, 
  FileUp, 
  FileText, 
  TrendingUp,
  Sparkles
} from 'lucide-react'

export default function Home() {
  const router = useRouter()

  const modulos = [
    {
      icon: LayoutDashboard,
      titulo: 'Dashboard Fiscal',
      descricao: 'Visão completa da saúde tributária da sua empresa',
      rota: '/dashboard',
      cor: 'from-blue-500 to-blue-600',
      corBg: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      icon: Calculator,
      titulo: 'Otimizador Tributário',
      descricao: 'Descubra a melhor estratégia para economizar impostos',
      rota: '/otimizador',
      cor: 'from-green-500 to-green-600',
      corBg: 'bg-green-50 hover:bg-green-100'
    },
    {
      icon: FileUp,
      titulo: 'Upload Universal',
      descricao: 'Importe dados de qualquer sistema contábil',
      rota: '/upload',
      cor: 'from-purple-500 to-purple-600',
      corBg: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      icon: FileText,
      titulo: 'Relatório de Alívio',
      descricao: 'Gere mensagens WhatsApp para seus clientes',
      rota: '/relatorio-alivio',
      cor: 'from-orange-500 to-orange-600',
      corBg: 'bg-orange-50 hover:bg-orange-100'
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <Logo size={80} showText={false} variant="icon" className="drop-shadow-lg" />
          </div>
          <h1 className="text-5xl font-bold mb-4">SimpliTax</h1>
          <p className="text-2xl mb-2 text-blue-100">
            Inteligência Tributária para Contadores
          </p>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            Transforme a complexidade da Reforma Tributária em decisões claras e lucrativas
          </p>
        </div>
      </div>

      {/* Módulos */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Escolha um Módulo
          </h2>
          <p className="text-gray-600 text-lg">
            Ferramentas poderosas para otimização fiscal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {modulos.map((modulo, index) => {
            const Icon = modulo.icon
            return (
              <div
                key={index}
                onClick={() => router.push(modulo.rota)}
                className={`${modulo.corBg} border-2 border-transparent hover:border-gray-300 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105`}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${modulo.cor} rounded-lg mb-4 text-white`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {modulo.titulo}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {modulo.descricao}
                </p>
                <div className="flex items-center text-sm font-semibold text-gray-700">
                  Acessar
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            )
          })}
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="text-center p-6 bg-white">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Economia Garantida</h3>
            <p className="text-gray-600 text-sm">
              Economize até 70% em impostos com estratégias inteligentes
            </p>
          </Card>

          <Card className="text-center p-6 bg-white">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Rápido e Simples</h3>
            <p className="text-gray-600 text-sm">
              Resultados em segundos, sem planilhas complexas
            </p>
          </Card>

          <Card className="text-center p-6 bg-white">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <FileUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Universal</h3>
            <p className="text-gray-600 text-sm">
              Compatível com qualquer sistema contábil
            </p>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-3">
              Pronto para Economizar?
            </h3>
            <p className="text-blue-100 mb-6 max-w-md">
              Comece agora mesmo a otimizar a tributação das suas empresas
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors duration-300"
            >
              Acessar Dashboard →
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
