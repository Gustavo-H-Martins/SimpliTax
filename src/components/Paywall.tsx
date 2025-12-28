/**
 * 💎 Paywall - Tela de Upgrade Premium
 * 
 * Modal que aparece quando usuário atinge limite free
 * ou clica em "Remover Anúncios"
 * 
 * @author SimpleTax2026
 */

'use client'

import { useState } from 'react'
import { X, Check, Zap, Crown, Infinity } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PLANS, useSubscription } from '@/utils/subscription'

interface PaywallProps {
  isOpen: boolean
  onClose: () => void
  trigger?: 'limit' | 'manual' | 'ad_removal'
}

export function Paywall({ isOpen, onClose, trigger = 'manual' }: PaywallProps) {
  const { subscribe } = useSubscription()
  const [selectedPlan, setSelectedPlan] = useState<keyof typeof PLANS>('anual')
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen) return null

  const handleSubscribe = async () => {
    setIsProcessing(true)
    
    try {
      await subscribe(selectedPlan)
      // Em produção: RevenueCat fará a compra real
      alert(`✅ Parabéns! Você agora é ${PLANS[selectedPlan].name}!`)
      onClose()
    } catch (error) {
      alert('❌ Erro ao processar pagamento. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  const getTriggerMessage = () => {
    switch (trigger) {
      case 'limit':
        return '🚨 Você atingiu o limite gratuito deste mês!'
      case 'ad_removal':
        return '✨ Remova anúncios e libere recursos ilimitados!'
      default:
        return '💎 Desbloqueie todo o potencial do SimpleTax!'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">
              SimpleTax <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">Premium</span>
            </h2>
            <p className="text-gray-600">{getTriggerMessage()}</p>
          </div>
        </div>

        {/* Planos */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Plano Mensal */}
          <button
            onClick={() => setSelectedPlan('mensal')}
            className={`relative p-6 rounded-xl border-2 transition text-left ${
              selectedPlan === 'mensal'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-lg">Mensal</h3>
            </div>
            
            <div className="mb-4">
              <span className="text-3xl font-bold">R$ 29</span>
              <span className="text-gray-600">,90/mês</span>
              <p className="text-sm text-gray-500 mt-1">7 dias grátis</p>
            </div>

            <ul className="space-y-2 text-sm">
              {PLANS.mensal.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </button>

          {/* Plano Anual (Destaque) */}
          <button
            onClick={() => setSelectedPlan('anual')}
            className={`relative p-6 rounded-xl border-2 transition text-left ${
              selectedPlan === 'anual'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Badge "Mais Popular" */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              ⭐ MAIS POPULAR
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-green-500" />
              <h3 className="font-bold text-lg">Anual</h3>
            </div>
            
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">R$ 299</span>
                <span className="text-gray-400 line-through text-sm">R$ 359</span>
              </div>
              <p className="text-sm text-green-600 font-semibold">
                17% OFF • R$ 24,92/mês
              </p>
              <p className="text-sm text-gray-500 mt-1">14 dias grátis</p>
            </div>

            <ul className="space-y-2 text-sm">
              {PLANS.anual.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </button>

          {/* Plano Vitalício */}
          <button
            onClick={() => setSelectedPlan('vitalicio')}
            className={`relative p-6 rounded-xl border-2 transition text-left ${
              selectedPlan === 'vitalicio'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Infinity className="w-5 h-5 text-purple-500" />
              <h3 className="font-bold text-lg">Vitalício</h3>
            </div>
            
            <div className="mb-4">
              <span className="text-3xl font-bold">R$ 997</span>
              <p className="text-sm text-purple-600 font-semibold">
                Pagamento único
              </p>
              <p className="text-sm text-gray-500 mt-1">Acesso para sempre</p>
            </div>

            <ul className="space-y-2 text-sm">
              {PLANS.vitalicio.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </button>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <Button
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 text-lg"
          >
            {isProcessing ? (
              '⏳ Processando...'
            ) : (
              <>
                🚀 Assinar {PLANS[selectedPlan].name} - {PLANS[selectedPlan].price}
              </>
            )}
          </Button>

          <div className="mt-4 text-center space-y-2">
            <p className="text-xs text-gray-500">
              {selectedPlan !== 'vitalicio' && (
                <>
                  • Cancele a qualquer momento<br />
                  • Renovação automática via Google Play<br />
                </>
              )}
              • Pagamento 100% seguro<br />
              • Garantia de 7 dias
            </p>
            
            <button
              onClick={() => {
                // Em produção: RevenueCat.restorePurchases()
                alert('🔄 Restaurando compras... (mock)')
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              Já sou assinante? Restaurar compras
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ============================================================================
// 🎯 Botão de Upgrade (para colocar em qualquer lugar)
// ============================================================================

export function UpgradeButton({ className = '' }: { className?: string }) {
  const [showPaywall, setShowPaywall] = useState(false)

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setShowPaywall(true)}
        className={`bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 ${className}`}
      >
        <Crown className="w-4 h-4 mr-2" />
        Remover Anúncios
      </Button>

      <Paywall
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        trigger="ad_removal"
      />
    </>
  )
}
