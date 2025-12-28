/**
 * 💰 Sistema de Assinatura - RevenueCat
 * 
 * Gerencia planos premium e verificação de status
 * 
 * @author SimpleTax2026
 */

export interface SubscriptionPlan {
  id: string
  name: string
  price: string
  priceValue: number
  period: 'month' | 'year' | 'lifetime'
  trial: number
  description: string
  features: string[]
}

export const PLANS: Record<string, SubscriptionPlan> = {
  mensal: {
    id: 'simpletax2026_premium_mensal',
    name: 'Plano Mensal',
    price: 'R$ 29,90',
    priceValue: 29.90,
    period: 'month',
    trial: 7,
    description: 'Acesso completo sem anúncios',
    features: [
      '✓ Sem anúncios',
      '✓ Cálculos ilimitados',
      '✓ Exportar PDF ilimitado',
      '✓ Histórico completo',
      '✓ Suporte prioritário',
      '✓ 7 dias grátis'
    ]
  },
  anual: {
    id: 'simpletax2026_premium_anual',
    name: 'Plano Anual',
    price: 'R$ 299,00',
    priceValue: 299.00,
    period: 'year',
    trial: 14,
    description: 'Economize 17% com o plano anual',
    features: [
      '✓ Tudo do Mensal',
      '✓ 17% de desconto',
      '✓ R$ 24,92/mês',
      '✓ 14 dias grátis',
      '✓ Acesso a novas features',
      '⭐ Melhor custo-benefício'
    ]
  },
  vitalicio: {
    id: 'simpletax2026_premium_lifetime',
    name: 'Plano Vitalício',
    price: 'R$ 997,00',
    priceValue: 997.00,
    period: 'lifetime',
    trial: 0,
    description: 'Pagamento único, acesso para sempre',
    features: [
      '✓ Tudo do Anual',
      '✓ Pagamento único',
      '✓ Acesso vitalício',
      '✓ Todas as atualizações',
      '✓ Sem mensalidades',
      '💎 Investimento único'
    ]
  }
}

// ============================================================================
// 🔐 Subscription Hook (para usar em componentes)
// ============================================================================

/**
 * Hook para verificar status de assinatura
 * 
 * NOTA: Implementação completa requer React Native + RevenueCat SDK
 * Esta é a versão web (localStorage mock)
 */
export function useSubscription() {
  if (typeof window === 'undefined') {
    return {
      isPremium: false,
      isLoading: true,
      plan: null,
      checkSubscription: async () => false,
      subscribe: async () => {},
      restore: async () => {}
    }
  }

  // Web: usar localStorage (mock)
  const isPremiumStored = localStorage.getItem('simpletax_premium') === 'true'
  const planStored = localStorage.getItem('simpletax_plan') as keyof typeof PLANS | null

  return {
    isPremium: isPremiumStored,
    isLoading: false,
    plan: planStored ? PLANS[planStored] : null,
    
    async checkSubscription() {
      // Em produção mobile: usar RevenueCat SDK
      // const customerInfo = await Purchases.getCustomerInfo()
      // return customerInfo.entitlements.active['premium'] !== undefined
      
      return isPremiumStored
    },
    
    async subscribe(planId: keyof typeof PLANS) {
      // Em produção mobile: usar RevenueCat SDK
      // const { customerInfo } = await Purchases.purchasePackage(planId)
      
      // Mock web (apenas para teste)
      localStorage.setItem('simpletax_premium', 'true')
      localStorage.setItem('simpletax_plan', planId)
      window.location.reload()
    },
    
    async restore() {
      // Em produção mobile: restaurar compras
      // const customerInfo = await Purchases.restorePurchases()
      
      alert('Compras restauradas! (mock)')
    }
  }
}

// ============================================================================
// 📊 Usage Tracking (limites free)
// ============================================================================

export const FREE_LIMITS = {
  calculations: 5, // 5 cálculos grátis por mês
  pdfExports: 2,   // 2 PDFs grátis
  reports: 3       // 3 relatórios grátis
}

export function trackUsage(action: 'calculation' | 'pdfExport' | 'report') {
  if (typeof window === 'undefined') return

  const key = `usage_${action}_${new Date().getMonth()}`
  const current = parseInt(localStorage.getItem(key) || '0')
  
  localStorage.setItem(key, (current + 1).toString())
  
  return current + 1
}

export function getUsageCount(action: 'calculation' | 'pdfExport' | 'report') {
  if (typeof window === 'undefined') return 0

  const key = `usage_${action}_${new Date().getMonth()}`
  return parseInt(localStorage.getItem(key) || '0')
}

export function hasReachedLimit(action: 'calculation' | 'pdfExport' | 'report') {
  const count = getUsageCount(action)
  const limit = FREE_LIMITS[`${action}s` as keyof typeof FREE_LIMITS]
  
  return count >= limit
}
