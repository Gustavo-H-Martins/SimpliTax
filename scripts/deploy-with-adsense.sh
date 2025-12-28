#!/bin/bash

# Script de Deploy com AdSense - SimpleTax 2026

echo "🚀 Iniciando deploy com AdSense..."

# 1. Verificar se o ID do AdSense está configurado
if grep -q 'NEXT_PUBLIC_ADSENSE_CLIENT_ID=""' .env; then
  echo "⚠️  ATENÇÃO: ADSENSE_CLIENT_ID ainda não configurado!"
  echo "Configure no arquivo .env antes de continuar."
  exit 1
fi

# 2. Build local para testar
echo "📦 Buildando projeto..."
npm run build

# 3. Testar localmente (opcional)
echo "🧪 Quer testar localmente antes do deploy? (y/n)"
read -r response
if [ "$response" = "y" ]; then
  npx serve out
  echo "✅ Teste local concluído"
fi

# 4. Commit e push
echo "💾 Salvando mudanças..."
git add .env
git add src/components/ads/AdManager.tsx
git commit -m "feat: Enable AdSense for web monetization"
git push origin main-app

# 5. Deploy Vercel
echo "🌐 Fazendo deploy no Vercel..."
vercel --prod

echo "✅ Deploy concluído!"
echo "🔗 Seu site: https://simpli-tax.vercel.app"
echo ""
echo "📊 Próximos passos:"
echo "1. Aguarde 10-60 min para o Google detectar o código"
echo "2. Volte ao AdSense e verifique status"
echo "3. Aguarde email de aprovação (1-3 dias)"
