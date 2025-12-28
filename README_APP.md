# 📱 SimpleTax 2026 - Guia de Conversão para App Android

## 🎯 Visão Geral

**SimpleTax 2026** é uma ferramenta mobile que ajuda MEI, ME e profissionais autônomos a economizarem com a Reforma Tributária de 2026, otimizando o Fator R e maximizando a distribuição de dividendos.

---

## 📊 Informações do App

**Nome:** SimpleTax2026  
**Package:** com.lmtech.simpletax2026  
**Versão:** 1.0.0  
**Min SDK:** 23 (Android 6.0+)  
**Target SDK:** 34 (Android 14)

---

## 🚀 Deploy Web (Vercel) - GRÁTIS

### Passo 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Passo 2: Login

```bash
vercel login
```

### Passo 3: Deploy

```bash
vercel
```

### Passo 4: Deploy Automático

1. Acesse https://vercel.com/new
2. Conecte seu GitHub
3. Selecione o repositório SimpliTax
4. Branch: `main-app`
5. Clique "Deploy"

**Pronto! Cada push = deploy automático!** ✅

**URL:** https://simpletax2026.vercel.app

---

## 📱 Conversão para App Android

### Opção A: Capacitor (Mais Rápido)

```bash
# 1. Instalar Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android

# 2. Inicializar
npx cap init SimpleTax2026 com.lmtech.simpletax2026

# 3. Build Next.js
npm run build
npx next export

# 4. Adicionar Android
npx cap add android

# 5. Sincronizar
npx cap sync

# 6. Abrir no Android Studio
npx cap open android
```

### Opção B: React Native + Expo (Performance)

```bash
# 1. Criar projeto Expo
npx create-expo-app SimpleTax2026Mobile --template blank-typescript

# 2. Instalar dependências
cd SimpleTax2026Mobile
npx expo install @react-navigation/native
npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-native-async-storage/async-storage

# 3. Monetização
npx expo install react-native-google-mobile-ads
npm install react-native-purchases
```

---

## 💰 Configuração de Monetização

### 1. Google AdMob

**Criar conta:** https://admob.google.com

**Passos:**
1. Criar app "SimpleTax2026"
2. Copiar App ID
3. Criar unidades de anúncio:
   - Banner (dashboard)
   - Interstitial (após cálculo)
4. Atualizar `app.json` com IDs reais

### 2. RevenueCat (Assinaturas)

**Criar conta:** https://revenuecat.com

**Passos:**
1. Criar projeto "SimpleTax2026"
2. Adicionar app Android
3. Criar produtos:
   - `simpletax2026_premium_mensal` (R$ 29,90)
   - `simpletax2026_premium_anual` (R$ 299,00)
   - `simpletax2026_premium_lifetime` (R$ 997,00)
4. Copiar API Key
5. Atualizar `app.json`

### 3. Google Play Console

**Criar conta:** https://play.google.com/console ($25 taxa única)

**Configurar In-App Products:**
1. Monetização → Produtos
2. Criar assinaturas:
   - Mensal: R$ 29,90 (trial 7 dias)
   - Anual: R$ 299,00 (trial 14 dias)
3. Criar produto gerenciado:
   - Vitalício: R$ 997,00

---

## 🎨 Assets Necessários

### Ícones

```
assets/icon.png - 1024×1024px (ícone principal)
assets/adaptive-icon.png - 1024×1024px (Android adaptativo)
assets/splash.png - 1242×2436px (tela de splash)
```

**Conceito:**
- Cor base: #0F172A (azul profundo)
- Acento: #00B4D8 (ciano elétrico)
- Logo: Rede de conexões + seta de crescimento (conceito "Conector Ágil")

### Screenshots (Google Play)

```
1080×1920px (mínimo 4 imagens):
- Dashboard principal
- Calculadora de otimização
- Comparação antes/depois
- Painel de recomendações
```

---

## 📄 Documentos Legais

### Política de Privacidade (Obrigatória!)

**Deve incluir:**
- Dados coletados (receita, despesas, folha)
- Como são armazenados (localStorage/AsyncStorage)
- Se há compartilhamento (não há)
- AdMob (cookies de anúncios)
- RevenueCat (dados de compra)
- Direitos do usuário (LGPD)

**Gerar em:** https://www.privacypolicygenerator.info/

### Termos de Uso

**Deve incluir:**
- O app é ferramenta de suporte, não substitui contador
- Cálculos baseados em regras públicas (LC 123/2006)
- Usuário responsável por validar com profissional
- Assinaturas não são reembolsáveis após 7 dias

---

## 🔧 Configurações do Código

### Modo Free vs Premium

```typescript
// src/utils/subscription.ts
import { useEffect, useState } from 'react';

export function useSubscription() {
  const [isPremium, setIsPremium] = useState(false);
  
  useEffect(() => {
    // Verificar status no RevenueCat
    checkSubscription().then(setIsPremium);
  }, []);
  
  return { isPremium };
}

// src/components/AdBanner.tsx
export function AdBanner() {
  const { isPremium } = useSubscription();
  
  if (isPremium) return null;
  
  return <BannerAd unitId="..." />;
}
```

### Limite de Uso Gratuito

```typescript
// Opção 1: 5 cálculos grátis por mês
const MAX_FREE_CALCULATIONS = 5;

// Opção 2: Anúncio a cada cálculo
// Opção 3: Funcionalidades limitadas (sem PDF export)
```

---

## 📈 Roadmap de Lançamento

### Semana 1: Preparação
- [ ] Deploy no Vercel
- [ ] Testar web app
- [ ] Criar assets (logo, screenshots)
- [ ] Escrever Política de Privacidade

### Semana 2: Conversão
- [ ] Escolher Capacitor ou React Native
- [ ] Build Android inicial
- [ ] Testar em dispositivo físico
- [ ] Ajustar layout mobile

### Semana 3: Monetização
- [ ] Criar conta AdMob
- [ ] Criar conta RevenueCat
- [ ] Configurar Google Play Console
- [ ] Implementar sistema de assinaturas
- [ ] Testar compras (sandbox)

### Semana 4: Publicação
- [ ] Criar listing no Google Play
- [ ] Upload APK/AAB
- [ ] Preencher descrição, screenshots
- [ ] Submeter para revisão
- [ ] Aguardar aprovação (3-7 dias)

### Semana 5: Lançamento
- [ ] App publicado! 🎉
- [ ] Campanha marketing (Instagram, TikTok)
- [ ] Parcerias com contadores
- [ ] Monitorar métricas

---

## 💡 Funcionalidades Extras (Futuro)

- [ ] **Notificações:** Lembrete mensal "Ajuste seu Fator R!"
- [ ] **Backup na nuvem:** Supabase/Firebase
- [ ] **Multi-empresa:** Gerenciar várias empresas
- [ ] **Histórico:** Acompanhar evolução mês a mês
- [ ] **Relatórios PDF:** Export para contador
- [ ] **Comparação com concorrentes:** "Sua empresa vs média do setor"
- [ ] **Modo escuro**
- [ ] **Widget Android:** Fator R no home screen

---

## 📞 Suporte

**Email:** suporte@simpletax2026.com  
**Site:** https://simpletax2026.vercel.app  
**WhatsApp:** (XX) XXXX-XXXX

---

## 🎯 Meta de Sucesso

**6 meses:**
- 10.000 downloads
- 1.000 assinantes pagantes
- R$ 30k MRR (Monthly Recurring Revenue)

**1 ano:**
- 50.000 downloads
- 5.000 assinantes
- R$ 150k MRR

**Valorização:** App faturando R$ 150k/mês = Valuation ~R$ 3-5 milhões! 💎
