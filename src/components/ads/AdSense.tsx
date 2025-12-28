// Hook para Google AdSense na versão web
import { useEffect } from 'react';

export function useAdSense(clientId: string) {
  useEffect(() => {
    // Só carregar no browser
    if (typeof window === 'undefined') return;
    
    // Verificar se já está carregado
    if ((window as any).adsbygoogle) return;
    
    // Carregar script do AdSense
    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, [clientId]);
}

// Componente de banner AdSense
export function AdSenseBanner({ 
  slot, 
  format = 'auto',
  responsive = true 
}: { 
  slot: string; 
  format?: string;
  responsive?: boolean;
}) {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive.toString()}
    />
  );
}
