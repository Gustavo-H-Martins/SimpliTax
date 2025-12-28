/**
 * 📢 Sistema de Anúncios - Google AdMob
 * 
 * Gerencia exibição de banners e interstitials
 * 
 * @author SimpleTax2026
 */

'use client'

import { useEffect, useState } from 'react'
import { useSubscription } from '@/utils/subscription'

// ============================================================================
// 📱 AdMob IDs (substituir pelos IDs reais do AdMob)
// ============================================================================

const ADMOB_IDS = {
  banner: process.env.NEXT_PUBLIC_ADMOB_BANNER_ID_ANDROID || 'ca-app-pub-3940256099942544/6300978111', // Test ID
  interstitial: process.env.NEXT_PUBLIC_ADMOB_INTERSTITIAL_ID_ANDROID || 'ca-app-pub-3940256099942544/1033173712', // Test ID
}

// ============================================================================
// 🎯 Banner Ad Component
// ============================================================================

/**
 * Banner fixo no rodapé do app (apenas para usuários free)
 */
export function AdBanner() {
  const { isPremium } = useSubscription()
  const [showAd, setShowAd] = useState(false)

  useEffect(() => {
    // Só mostrar em produção e para usuários free
    const isProduction = process.env.NODE_ENV === 'production'
    const showAdsInDev = process.env.NEXT_PUBLIC_SHOW_ADS_DEV === 'true'
    
    if (!isPremium && (isProduction || showAdsInDev)) {
      setShowAd(true)
    }
  }, [isPremium])

  if (!showAd) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700">
      <div className="container mx-auto">
        {/* Em produção mobile: usar react-native-google-mobile-ads */}
        {/* <BannerAd unitId={ADMOB_IDS.banner} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} /> */}
        
        {/* Mock web */}
        <div className="flex items-center justify-center h-12 bg-gradient-to-r from-gray-800 to-gray-700 text-white text-xs">
          <span className="opacity-60">📢 Anúncio • Atualize para Premium e remova</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 💥 Interstitial Ad Hook
// ============================================================================

/**
 * Hook para exibir anúncios fullscreen após ações específicas
 * 
 * Uso:
 * ```tsx
 * const { showInterstitial } = useInterstitialAd()
 * 
 * const handleGerarRelatorio = async () => {
 *   // ... lógica do relatório
 *   await showInterstitial() // Mostra anúncio após gerar
 * }
 * ```
 */
export function useInterstitialAd() {
  const { isPremium } = useSubscription()
  const [isAdLoaded, setIsAdLoaded] = useState(false)
  const [adShownCount, setAdShownCount] = useState(0)

  useEffect(() => {
    if (isPremium) return

    // Em produção mobile: carregar anúncio intersticial
    // const interstitial = InterstitialAd.createForAdRequest(ADMOB_IDS.interstitial)
    // interstitial.addAdEventListener(AdEventType.LOADED, () => setIsAdLoaded(true))
    // interstitial.load()

    setIsAdLoaded(true) // Mock
  }, [isPremium])

  const showInterstitial = async (): Promise<void> => {
    if (isPremium) {
      console.log('✅ Usuário Premium - Sem anúncios')
      return
    }

    // Estratégia: mostrar a cada 2 ações (não toda vez)
    const currentCount = adShownCount + 1
    setAdShownCount(currentCount)

    if (currentCount % 2 !== 0) {
      console.log('⏭️ Pulando anúncio desta vez (estratégia de frequência)')
      return
    }

    if (!isAdLoaded) {
      console.log('⚠️ Anúncio não carregado ainda')
      return
    }

    return new Promise((resolve) => {
      // Em produção mobile: mostrar intersticial
      // interstitial.show()
      // interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      //   interstitial.load() // Recarregar para próxima vez
      //   resolve()
      // })

      // Mock web: delay 2s
      console.log('📢 Mostrando anúncio intersticial... (mock)')
      setTimeout(() => {
        console.log('✅ Anúncio fechado')
        resolve()
      }, 2000)
    })
  }

  return {
    showInterstitial,
    isAdReady: isAdLoaded
  }
}

// ============================================================================
// 📊 Ad Manager (controle centralizado)
// ============================================================================

/**
 * Gerenciador global de anúncios
 */
class AdManager {
  private static instance: AdManager
  private adFrequency: Map<string, number> = new Map()

  private constructor() {}

  static getInstance(): AdManager {
    if (!AdManager.instance) {
      AdManager.instance = new AdManager()
    }
    return AdManager.instance
  }

  /**
   * Verifica se deve mostrar anúncio baseado em frequência
   */
  shouldShowAd(action: string, minInterval: number = 2): boolean {
    const lastShown = this.adFrequency.get(action) || 0
    const now = Date.now()

    if (now - lastShown < minInterval * 60 * 1000) {
      return false // Ainda não passou tempo suficiente
    }

    this.adFrequency.set(action, now)
    return true
  }

  /**
   * Limpa histórico de frequência
   */
  reset() {
    this.adFrequency.clear()
  }
}

export const adManager = AdManager.getInstance()

// ============================================================================
// 🎬 App Open Ad (ao abrir o app)
// ============================================================================

/**
 * Hook para mostrar anúncio ao abrir o app (apenas 1x por sessão)
 */
export function useAppOpenAd() {
  const { isPremium } = useSubscription()
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    if (isPremium || hasShown) return

    const timer = setTimeout(() => {
      if (adManager.shouldShowAd('app_open', 5)) {
        console.log('👋 Mostrando anúncio de boas-vindas...')
        // Em produção: mostrar App Open Ad
        setHasShown(true)
      }
    }, 1000) // 1s após abrir

    return () => clearTimeout(timer)
  }, [isPremium, hasShown])

  return { hasShownAppOpenAd: hasShown }
}
