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
// � AdSense IDs (Web) - Configurar após aprovação
// ============================================================================

const ADSENSE_IDS = {
  client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '',
  bannerSlot: process.env.NEXT_PUBLIC_ADSENSE_BANNER_SLOT || '',
}

// Detecta se está rodando em mobile app ou web
const isMobileApp = typeof window !== 'undefined' && 
  (window.navigator.userAgent.includes('wv') || // WebView Android
   (window as any).ReactNativeWebView); // React Native

// ============================================================================
// 🎯 Banner Ad Component (AdSense para Web)
// ============================================================================

/**
 * Banner fixo no rodapé (AdSense para web, AdMob para mobile)
 */
export function AdBanner() {
  const { isPremium } = useSubscription()
  const [showAd, setShowAd] = useState(false)
  const [adSenseLoaded, setAdSenseLoaded] = useState(false)

  useEffect(() => {
    // Só mostrar em produção e para usuários free
    const isProduction = process.env.NODE_ENV === 'production'
    const showAdsInDev = process.env.NEXT_PUBLIC_SHOW_ADS_DEV === 'true'
    
    if (!isPremium && (isProduction || showAdsInDev)) {
      setShowAd(true)
      
      // Carregar AdSense apenas na web
      if (!isMobileApp && ADSENSE_IDS.client && typeof window !== 'undefined') {
        const script = document.createElement('script')
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_IDS.client}`
        script.async = true
        script.crossOrigin = 'anonymous'
        script.onload = () => setAdSenseLoaded(true)
        document.head.appendChild(script)
        
        return () => {
          if (document.head.contains(script)) {
            document.head.removeChild(script)
          }
        }
      }
    }
  }, [isPremium])

  // Inicializar anúncio AdSense quando carregar
  useEffect(() => {
    if (adSenseLoaded && !isMobileApp && ADSENSE_IDS.bannerSlot) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      } catch (e) {
        console.error('AdSense error:', e)
      }
    }
  }, [adSenseLoaded])

  if (!showAd) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700">
      <div className="container mx-auto">
        {/* Web: AdSense */}
        {!isMobileApp && ADSENSE_IDS.client && ADSENSE_IDS.bannerSlot ? (
          <div className="flex items-center justify-center min-h-[60px] py-2">
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client={ADSENSE_IDS.client}
              data-ad-slot={ADSENSE_IDS.bannerSlot}
              data-ad-format="horizontal"
              data-full-width-responsive="true"
            />
          </div>
        ) : isMobileApp ? (
          // Mobile: AdMob (implementar com react-native-google-mobile-ads)
          <div className="flex items-center justify-center h-12 bg-gradient-to-r from-gray-800 to-gray-700 text-white text-xs">
            <span className="opacity-60">📢 AdMob Banner • Atualize para Premium</span>
          </div>
        ) : ADSENSE_IDS.client ? (
          // Fallback: AdSense em aprovação
          <div className="flex items-center justify-center h-12 bg-gradient-to-r from-gray-800 to-gray-700 text-white text-xs">
            <span className="opacity-60">⏳ Anúncios em breve • Atualize para Premium e remova</span>
          </div>
        ) : null}
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
