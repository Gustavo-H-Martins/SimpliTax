# 🚀 Deploy Rápido no Vercel

## Passo 1: Criar .env.local

```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione uma chave de criptografia:

```env
NEXT_PUBLIC_ENCRYPTION_KEY="simpletax2026_secure_key_change_in_production_min32chars"
```

## Passo 2: Commit & Push

```bash
git add .
git commit -m "🚀 Configuração inicial para app Android + Deploy Vercel"
git push origin main-app
```

## Passo 3: Deploy no Vercel

### Opção A: Via CLI (Rápido)

```bash
npm install -g vercel
vercel login
vercel
```

### Opção B: Via Dashboard (Automático)

1. Acesse https://vercel.com/new
2. Clique "Import Git Repository"
3. Conecte GitHub e selecione `SimpliTax`
4. Branch: `main-app`
5. Framework Preset: **Next.js** (detectado automaticamente)
6. Environment Variables:
   - `NEXT_PUBLIC_ENCRYPTION_KEY` = "sua_chave_aqui"
7. Clique **Deploy**

**URL ao vivo em ~2 minutos:** https://simpletax2026.vercel.app ✨

---

## Próximos Passos

1. ✅ Deploy no Vercel (GRÁTIS)
2. ⏭️ Criar logo e assets (Figma/Canva)
3. ⏭️ Configurar AdMob
4. ⏭️ Configurar RevenueCat
5. ⏭️ Build Android (Capacitor ou React Native)
6. ⏭️ Publicar na Google Play Store

**Documentação completa:** [README_APP.md](./README_APP.md)
