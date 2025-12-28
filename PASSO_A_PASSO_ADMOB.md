# 📱 Passo a Passo: Criar App e Anúncios no AdMob

Seu Publisher ID: `pub-8625345036623568` ✅

---

## 🎯 Passo 1: Criar App no AdMob

1. **Acesse:** https://apps.admob.com/v2/apps/create

2. **Clique em "Adicionar app"** (botão azul)

3. **Preencha os dados:**
   - ✅ **Nome do app:** SimpleTax2026
   - ✅ **Plataforma:** Android
   - ✅ **O app já está publicado no Google Play?** → Selecione "Não"
   - ✅ **Aceite os termos** e clique em "Adicionar"

4. **Copie o App ID:**
   - Aparecerá algo como: `ca-app-pub-8625345036623568~1234567890`
   - Este é seu **NEXT_PUBLIC_ADMOB_APP_ID_ANDROID**
   - 📋 Cole no arquivo `.env`

---

## 🎯 Passo 2: Criar Unidade de Anúncio Banner

1. **No mesmo app criado**, clique em **"Ad units"** (ou "Blocos de anúncios")

2. **Clique em "Adicionar bloco de anúncios"**

3. **Selecione formato:** Banner

4. **Preencha:**
   - ✅ **Nome:** SimpleTax Banner
   - ✅ **Configurações:** Deixe padrão (Banner adaptável)
   - ✅ Clique em "Criar bloco de anúncios"

5. **Copie o Ad Unit ID:**
   - Aparecerá: `ca-app-pub-8625345036623568/9876543210`
   - Este é seu **NEXT_PUBLIC_ADMOB_BANNER_ID_ANDROID**
   - 📋 Cole no arquivo `.env`

---

## 🎯 Passo 3: Criar Unidade de Anúncio Intersticial

1. **Na mesma página de Ad Units**, clique em **"Adicionar bloco de anúncios"** novamente

2. **Selecione formato:** Intersticial

3. **Preencha:**
   - ✅ **Nome:** SimpleTax Interstitial
   - ✅ **Configurações:** Deixe padrão
   - ✅ Clique em "Criar bloco de anúncios"

4. **Copie o Ad Unit ID:**
   - Aparecerá: `ca-app-pub-8625345036623568/1122334455`
   - Este é seu **NEXT_PUBLIC_ADMOB_INTERSTITIAL_ID_ANDROID**
   - 📋 Cole no arquivo `.env`

---

## 🎯 Passo 4: Atualizar arquivo .env

Abra o arquivo `.env` e substitua "PREENCHER" pelos IDs reais:

```env
# Exemplo (use seus IDs reais!):
NEXT_PUBLIC_ADMOB_APP_ID_ANDROID="ca-app-pub-8625345036623568~1234567890"
NEXT_PUBLIC_ADMOB_BANNER_ID_ANDROID="ca-app-pub-8625345036623568/9876543210"
NEXT_PUBLIC_ADMOB_INTERSTITIAL_ID_ANDROID="ca-app-pub-8625345036623568/1122334455"
```

---

## 🎯 Passo 5: Testar Localmente

1. **Salve o arquivo `.env`**

2. **Reinicie o servidor:**
   ```bash
   npm run dev
   ```

3. **Abra:** http://localhost:3000

4. **Você verá:**
   - Banner no rodapé (mock com texto)
   - Console mostrando "Mostrando anúncio intersticial..." ao gerar relatório

---

## ⚠️ IMPORTANTE: Modo de Teste

**NUNCA clique nos seus próprios anúncios reais!** Isso pode banir sua conta.

Para testar com anúncios de verdade SEM arriscar, use os **IDs de teste do Google**:

```env
# MODO DE TESTE (use durante desenvolvimento)
NEXT_PUBLIC_ADMOB_BANNER_ID_ANDROID="ca-app-pub-3940256099942544/6300978111"
NEXT_PUBLIC_ADMOB_INTERSTITIAL_ID_ANDROID="ca-app-pub-3940256099942544/1033173712"
```

Esses IDs mostram anúncios reais, mas não geram receita e você pode clicar à vontade.

---

## 📊 Quanto Tempo Até Gerar Receita?

### Timeline:
- ✅ **Dia 0:** Criar app e ad units (hoje)
- ✅ **Dia 1-7:** Testar com IDs de teste
- ✅ **Dia 7:** Publicar app no Google Play
- ⏳ **Dia 14:** Primeiras impressões reais de anúncios
- 💰 **Dia 30:** Primeira receita visível no AdMob
- 💸 **~Dia 45:** Primeiro pagamento (após atingir $100)

### Receita Esperada:
- **1.000 usuários/mês:** R$ 50-200/mês
- **5.000 usuários/mês:** R$ 500-1.500/mês
- **10.000 usuários/mês:** R$ 2.000-5.000/mês

---

## 🆘 Problemas Comuns

### "Não consigo ver anúncios no navegador"
✅ **Normal!** A versão web usa mock. Anúncios reais só aparecem no app Android.

### "Aparece erro 'App ID inválido'"
✅ Verifique se copiou o ID completo (incluindo `~` no App ID)

### "Anúncios não geram receita"
✅ Você está usando IDs de teste? Troque pelos reais no `.env`

### "Quanto tempo até ver dados no dashboard?"
✅ 24-48 horas após primeiras impressões

---

## 🚀 Próximo Passo: RevenueCat

Depois de configurar o AdMob, configure assinaturas:
1. Acesse: https://www.revenuecat.com
2. Crie conta
3. Copie API Key
4. Cole no `.env` → `NEXT_PUBLIC_REVENUECAT_API_KEY_ANDROID`

---

**Tudo pronto para monetizar! 🎉**
