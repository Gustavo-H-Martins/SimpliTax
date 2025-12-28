# 🌐 Guia de Configuração: Google AdSense

## 📋 Passo a Passo Completo

### **1️⃣ Criar Conta no AdSense**

1. Acesse: https://www.google.com/adsense
2. Clique em **"Começar"**
3. **Informações necessárias:**
   - URL do site: `https://simpli-tax.vercel.app`
   - Email: Seu email Google
   - País: Brasil
   - Tipo de conteúdo: Ferramenta/Utilitário

### **2️⃣ Adicionar Site para Verificação**

1. No painel do AdSense, clique em **"Sites"**
2. Adicione: `simpli-tax.vercel.app`
3. Google vai fornecer um **código de verificação**

**Código será algo assim:**
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
```

### **3️⃣ Verificar o Site (Automático)**

O SimpleTax já está configurado para carregar o AdSense automaticamente! 

Quando você receber os IDs:
1. Abra: `.env`
2. Cole seus IDs:
```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID="ca-pub-XXXXXXXXXXXXXXXX"
NEXT_PUBLIC_ADSENSE_BANNER_SLOT="YYYYYYYYYY"
```

3. Deploy no Vercel:
```bash
git add .env
git commit -m "Add AdSense IDs"
git push
```

4. Aguarde 10 minutos
5. Volte ao AdSense e clique em **"Verificar código"**

---

## ⏰ Tempo de Aprovação

### **Verificação do Site:**
- ⚡ Instantâneo (se o código for detectado)
- 🐌 Até 24 horas (se houver problemas técnicos)

### **Aprovação da Conta:**
- 📅 **Normal:** 1-3 dias úteis
- 📅 **Pode levar:** Até 2 semanas
- 📧 Você receberá email quando for aprovado

### **Critérios de Aprovação:**
✅ Conteúdo original e útil
✅ Política de privacidade publicada (você já tem!)
✅ Tráfego suficiente (mínimo ~20-50 visitas/dia)
✅ Site totalmente funcional
✅ Não viola políticas do Google

---

## 📊 Expectativa de Receita (AdSense Web)

### **Métricas Estimadas:**

| Métrica | Valor Esperado |
|---------|----------------|
| **CPM (Custo por 1000 impressões)** | $0.50 - $2.00 |
| **CTR (Taxa de cliques)** | 0.5% - 2% |
| **CPC (Custo por clique)** | $0.10 - $0.50 |

### **Cenário Realista:**

**100 visitantes/dia:**
- Impressões/mês: ~3.000
- Cliques (1% CTR): ~30
- **Receita:** $1.50 - $15/mês

**1.000 visitantes/dia:**
- Impressões/mês: ~30.000
- Cliques (1% CTR): ~300
- **Receita:** $15 - $150/mês

**10.000 visitantes/dia:**
- Impressões/mês: ~300.000
- Cliques (1% CTR): ~3.000
- **Receita:** $150 - $1.500/mês

---

## 🎯 Comparação: AdSense vs Assinaturas

### **AdSense (Anúncios):**
✅ Monetização passiva
✅ Funciona desde o dia 1
❌ Receita baixa por usuário ($0.01 - $0.05/visita)
❌ Experiência pior para usuário

### **Premium (Assinaturas):**
✅ Receita MUITO maior (R$ 29.90/mês por usuário)
✅ Experiência melhor (sem anúncios)
❌ Precisa converter usuários
❌ Requer marketing ativo

### **💡 Estratégia Híbrida (RECOMENDADO):**

**Usuários Free (70%):**
- 1 cálculo grátis
- Anúncios AdSense
- CTA forte para Premium
- **Receita:** $0.01 - $0.05/visita

**Usuários Premium (30%):**
- Tudo ilimitado
- Zero anúncios
- Suporte prioritário
- **Receita:** R$ 29.90/mês

**Exemplo com 1.000 usuários/mês:**
- Free (700): R$ 35 - R$ 175 (AdSense)
- Premium (300): R$ 8.970 (assinaturas)
- **Total:** R$ 9.000+ /mês

---

## 🚀 Após Aprovação do AdSense

### **1. Criar Unidades de Anúncio**

No painel AdSense:
1. Vá em **"Anúncios" → "Por unidade de anúncio"**
2. Clique em **"Novo anúncio"**

**Banner Rodapé (Horizontal):**
- Nome: `SimpleTax Banner Rodapé`
- Tipo: **Display responsivo**
- Formato: **Horizontal**
- Copie o **Slot ID** (ex: 1234567890)

### **2. Configurar no SimpleTax**

```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID="ca-pub-XXXXXXXXXXXXXXXX"
NEXT_PUBLIC_ADSENSE_BANNER_SLOT="1234567890"
```

### **3. Deploy e Testar**

```bash
npm run build
git add .
git commit -m "Enable AdSense"
git push
```

**Verificar no site:**
- Abra: https://simpli-tax.vercel.app
- Faça logout (para ser usuário free)
- Verifique banner no rodapé

---

## 🔍 Troubleshooting

### **Problema: "Código não detectado"**
**Solução:** 
1. Verifique se o ID está correto no `.env`
2. Aguarde 24 horas (cache do Google)
3. Abra o site em modo anônimo e recarregue várias vezes

### **Problema: "Anúncios não aparecem"**
**Solução:**
1. Verifique Console do navegador (F12)
2. Confirme que não há adblocker ativo
3. IDs corretos no `.env`?
4. Deploy foi feito com sucesso?

### **Problema: "Conta rejeitada"**
**Solução:**
1. Leia o email de rejeição
2. Correções comuns:
   - Adicionar mais conteúdo textual
   - Garantir política de privacidade visível
   - Gerar tráfego orgânico (20+ visitas/dia)
3. Reaplique após correções

---

## 📧 Contato do Suporte

**Google AdSense:**
- Fórum: https://support.google.com/adsense/community
- Email: Disponível após aprovação da conta

**SimpleTax (você):**
- Email para usuários: contato.simpletax@gmail.com

---

## 🎯 Próximos Passos

**Agora:**
1. ✅ Código já está integrado
2. ⏳ Criar conta AdSense
3. ⏳ Aguardar aprovação (1-3 dias)

**Após Aprovação:**
1. ✅ Cole IDs no `.env`
2. ✅ Deploy no Vercel
3. ✅ Anúncios ao vivo!
4. 💰 Comece a monetizar

**Acompanhamento:**
- Acesse painel AdSense diariamente
- Monitore receita e CTR
- Otimize posicionamento dos anúncios
- A/B test: com/sem anúncios vs conversão Premium
