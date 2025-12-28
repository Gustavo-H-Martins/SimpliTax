# 📱 SimpleTax2026 - Configuração de Anúncios e Assinaturas

## ✅ O que foi implementado

### 1. Sistema de Assinatura (RevenueCat)
- **Arquivo:** `src/utils/subscription.ts`
- **Features:**
  - Hook `useSubscription()` para verificar status Premium
  - 3 planos: Mensal (R$ 29,90), Anual (R$ 299), Vitalício (R$ 997)
  - Limites free: 5 cálculos + 2 PDFs + 3 relatórios por mês
  - Rastreamento de uso por ação

### 2. Sistema de Anúncios (Google AdMob)
- **Arquivo:** `src/components/ads/AdManager.tsx`
- **Componentes:**
  - `<AdBanner />` - Banner fixo no rodapé (apenas free users)
  - `useInterstitialAd()` - Hook para anúncios fullscreen
  - `useAppOpenAd()` - Anúncio ao abrir app (1x por sessão)
- **Triggers configurados:**
  - ✅ App abrir (primeira vez)
  - ✅ Após gerar relatório
  - ✅ Após calcular otimização
  - ✅ Após exportar PDF

### 3. Paywall (Tela de Upgrade)
- **Arquivo:** `src/components/Paywall.tsx`
- **Features:**
  - Modal visual com 3 planos lado a lado
  - Botão "Remover Anúncios" em qualquer lugar
  - Acionamento automático ao atingir limites

### 4. Integração nas Páginas
- **Dashboard** (`src/app/dashboard/page.tsx`):
  - Banner de anúncio no rodapé
  - Anúncio intersticial ao gerar relatório
  - Botão de upgrade para Premium
- **Otimizador** (`src/app/otimizador/page.tsx`):
  - Limites free aplicados (5 cálculos/mês)
  - Anúncio após calcular
  - Anúncio após exportar PDF
  - Paywall ao atingir limite

---

## 🚀 Como testar localmente

### 1. Instalar dependências (se ainda não instalou)
```bash
npm install
```

### 2. Rodar o projeto
```bash
npm run dev
```

### 3. Testar funcionalidades

#### Simular usuário FREE:
1. Abra o app: http://localhost:3000
2. Vá para Dashboard → clique "Gerar Relatório"
3. **Resultado:** Banner fixo aparece + console mostra "Mostrando anúncio intersticial"

#### Simular usuário PREMIUM:
1. Abra DevTools (F12) → Console
2. Digite:
   ```javascript
   localStorage.setItem('simpletax_premium', 'true')
   localStorage.setItem('simpletax_plan', 'anual')
   location.reload()
   ```
3. **Resultado:** Sem anúncios + acesso ilimitado

#### Ver limites free:
1. Limpe o localStorage:
   ```javascript
   localStorage.clear()
   location.reload()
   ```
2. Vá para Otimizador → clique "Calcular" 6 vezes
3. **Resultado:** Na 6ª tentativa, aparece o Paywall

---

## 📦 Gerar Assets Android

### 1. Instalar sharp (conversor de imagens)
```bash
npm install sharp --save-dev
```

### 2. Gerar todos os assets automaticamente
```bash
node scripts/generate-assets.js
```

**Saída:**
- `assets/icon.png` (1024×1024) - Ícone principal
- `assets/adaptive-icon-foreground.png` - Foreground do adaptive icon
- `assets/adaptive-icon-background.png` - Background (cor #0F172A)
- `assets/splash.png` (1242×2436) - Tela de splash
- `assets/feature-graphic.png` (1024×500) - Banner Google Play

### 3. Tirar Screenshots (mínimo 2)

**Opção A: Browser DevTools**
1. Abra: http://localhost:3000
2. F12 → Ctrl+Shift+M (Device Mode)
3. Configure: 360×640 px, escala 3x
4. DevTools → ⋮ → "Capture screenshot"
5. Salve em `assets/screenshots/`

**Páginas sugeridas:**
- 📊 Dashboard com dados preenchidos
- 💎 Otimizador mostrando economia ("Economize R$ 50k/ano!")
- 📈 Gráfico comparativo
- ✅ Tela "Já está otimizado!"

---

## 🔑 Configurar AdMob e RevenueCat

### 1. Google AdMob (anúncios)

1. **Criar conta:** https://admob.google.com
2. **Criar app:**
   - Apps → Adicionar app
   - Nome: SimpleTax2026
   - Plataforma: Android
   - Copiar **App ID** (ca-app-pub-XXXXXX~XXXXXX)

3. **Criar unidades de anúncio:**
   - **Banner:**
     - Formato: Banner
     - Nome: SimpleTax Banner
     - Copiar **Ad Unit ID** (ca-app-pub-XXXXXX/XXXXXX)
   - **Intersticial:**
     - Formato: Intersticial
     - Nome: SimpleTax Interstitial
     - Copiar **Ad Unit ID**

### 2. RevenueCat (assinaturas)

1. **Criar conta:** https://www.revenuecat.com
2. **Criar projeto:**
   - Nome: SimpleTax2026
   - Plataforma: Android
3. **Configurar produtos** (aba "Products"):
   - `simpletax2026_premium_mensal` → R$ 29,90
   - `simpletax2026_premium_anual` → R$ 299,00
   - `simpletax2026_premium_lifetime` → R$ 997,00
4. **Copiar API Key** (aba "API Keys" → Public Key)

### 3. Configurar variáveis de ambiente

1. **Copiar arquivo de exemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Preencher com seus IDs:**
   ```env
   # AdMob
   NEXT_PUBLIC_ADMOB_APP_ID_ANDROID=ca-app-pub-XXXXXX~XXXXXX
   NEXT_PUBLIC_ADMOB_BANNER_ID_ANDROID=ca-app-pub-XXXXXX/XXXXXX
   NEXT_PUBLIC_ADMOB_INTERSTITIAL_ID_ANDROID=ca-app-pub-XXXXXX/XXXXXX

   # RevenueCat
   NEXT_PUBLIC_REVENUECAT_API_KEY_ANDROID=rcpb_XXXXXX

   # Produtos
   NEXT_PUBLIC_PRODUCT_ID_MENSAL=simpletax2026_premium_mensal
   NEXT_PUBLIC_PRODUCT_ID_ANUAL=simpletax2026_premium_anual
   NEXT_PUBLIC_PRODUCT_ID_VITALICIO=simpletax2026_premium_lifetime
   ```

---

## 🚢 Deploy para Produção

### Opção 1: Vercel (Web + PWA)

1. **Instalar Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Fazer deploy:**
   ```bash
   vercel --prod
   ```

3. **Adicionar variáveis de ambiente:**
   - Dashboard Vercel → Seu Projeto → Settings → Environment Variables
   - Adicionar todas as variáveis do `.env`

### Opção 2: Capacitor (Android Nativo)

**NOTA:** Implementação completa de AdMob/RevenueCat requer SDK nativo.

1. **Instalar Capacitor:**
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init SimpleTax2026 com.lmtech.simpletax2026
   ```

2. **Adicionar plataforma Android:**
   ```bash
   npm install @capacitor/android
   npx cap add android
   ```

3. **Instalar plugins de anúncios:**
   ```bash
   npm install @capacitor-community/admob
   npm install @revenuecat/purchases-capacitor
   ```

4. **Build e sync:**
   ```bash
   npm run build
   npx cap sync
   npx cap open android
   ```

5. **Rodar no emulador/device:**
   - Android Studio abrirá
   - Clique em "Run" (▶️)

---

## 📊 Estimativa de Receita

### Projeção Mensal (10.000 usuários ativos)

| Fonte | Quantidade | Valor Unit. | Total/Mês |
|-------|-----------|-------------|-----------|
| **Anúncios (Free 70%)** |
| Banner | 7.000 users × 30 impressões | R$ 1,00/1k | R$ 210 |
| Interstitial | 7.000 × 10 cliques/mês | R$ 5,00/1k | R$ 350 |
| **Assinaturas (Premium 30%)** |
| Mensal | 2.000 × R$ 29,90 | | R$ 59.800 |
| Anual | 800 × R$ 24,92/mês | | R$ 19.936 |
| Vitalício | 200 × R$ 997 (once) | | R$ 199.400* |
| **TOTAL** | | | **R$ 279.696/mês** |

_* Vitalício é pagamento único, diluído em 12 meses = R$ 16.617/mês_

**Receita real esperada: R$ 80k - 120k/mês** com 10k usuários.

---

## 🆘 Problemas Comuns

### "Hook useSubscription() não funciona"
**Causa:** Versão web usa localStorage (mock).
**Solução:** Em produção mobile, integrar RevenueCat SDK real.

### "Anúncios não aparecem"
**Causa:** Você está em modo Premium ou IDs de teste.
**Solução:**
1. Limpar localStorage: `localStorage.clear()`
2. Verificar console: deve mostrar mensagens de anúncio
3. Em produção: usar IDs reais do AdMob

### "Sharp não instala"
**Causa:** Falta compilador C++.
**Solução:**
- Windows: Instalar [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/)
- Ou usar método manual (Figma/Inkscape) do `ASSETS_GUIDE.md`

---

## 📚 Documentação Completa

- **Guia de Assets:** [ASSETS_GUIDE.md](ASSETS_GUIDE.md)
- **Guia de Deploy:** [DEPLOY.md](DEPLOY.md)
- **Readme do App:** [README_APP.md](README_APP.md)
- **Política de Privacidade:** [PRIVACY_POLICY.md](PRIVACY_POLICY.md)
- **Termos de Serviço:** [TERMS_OF_SERVICE.md](TERMS_OF_SERVICE.md)

---

## ✅ Checklist Pré-Lançamento

Antes de publicar no Google Play:

- [ ] Assets gerados (icon.png, splash.png, etc.)
- [ ] Mínimo 2 screenshots (recomendado 4-6)
- [ ] Conta Google Play Developer criada ($25 one-time)
- [ ] Conta AdMob configurada com App ID e Ad Units
- [ ] Conta RevenueCat configurada com produtos
- [ ] Variáveis de ambiente (.env) preenchidas
- [ ] Política de Privacidade publicada (obrigatória)
- [ ] Termos de Serviço publicados (obrigatória)
- [ ] App testado em emulador/device real
- [ ] Anúncios testados (modo free)
- [ ] Assinatura testada (modo test do RevenueCat)

---

## 🎯 Próximas Features (Roadmap)

- [ ] Push notifications (avisos de mudanças tributárias)
- [ ] Modo offline (salvar dados localmente)
- [ ] Exportar relatório para Excel
- [ ] Integração com Contador.io / ContaAzul
- [ ] Dashboard de métricas para contadores
- [ ] Programa de afiliados (20% comissão)

---

**Dúvidas?** Entre em contato ou consulte a documentação completa! 🚀

**Desenvolvido por:** LMTech & SimpleTax Team
