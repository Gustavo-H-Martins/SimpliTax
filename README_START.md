# 🚀 SimpliTax - Guia de Inicialização Rápida

## 📋 Comandos Disponíveis

### Opção 1: Script Automatizado (Recomendado)

```bash
# Modo Desenvolvimento (com hot reload)
node start.js --dev

# Modo Produção (build + start otimizado)
node start.js

# Forçar reinstalação de dependências
node start.js --install
```

### Opção 2: Scripts NPM Simplificados

```bash
# Modo Desenvolvimento
npm run go

# Modo Produção
npm run go:prod

# Setup inicial (força instalação)
npm run setup
```

### Opção 3: Comandos Tradicionais

```bash
# Instalar dependências
npm install

# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor produção
npm start
```

---

## 🎯 Como Funciona o `start.js`

### 1. **Verificação Automática**
- ✅ Verifica se `node_modules` existe
- ✅ Detecta se `package.json` foi modificado
- ✅ Instala dependências automaticamente se necessário

### 2. **Modo Desenvolvimento (`--dev`)**
- 🔥 Hot reload ativado
- 📝 Logs detalhados
- 🌐 Servidor em `http://localhost:3000`
- ⚡ Mudanças refletem instantaneamente

### 3. **Modo Produção (sem flag)**
- 🏭 Build otimizado
- 📦 Código minificado
- 🚀 Performance máxima
- 🔒 Pronto para deploy

---

## 🎨 Flags Disponíveis

| Flag | Atalho | Descrição |
|------|--------|-----------|
| `--dev` | `-d` | Modo desenvolvimento |
| `--install` | `-i` | Força instalação de dependências |

---

## 📱 URLs Importantes

Após iniciar o servidor, acesse:

- 🏠 **Home:** http://localhost:3000
- 📊 **Dashboard:** http://localhost:3000/dashboard
- 💎 **Otimizador:** http://localhost:3000/otimizador
- 📤 **Upload:** http://localhost:3000/upload
- 💬 **Relatório:** http://localhost:3000/relatorio-alivio

---

## 🐛 Troubleshooting

### Erro: "node_modules não encontrado"
```bash
node start.js --install
```

### Erro: "Port 3000 already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Erro: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build falha em produção
```bash
npm run lint        # Verificar erros
npm run build       # Build manual
```

---

## 💡 Dicas da LMartins

### 🔥 Desenvolvimento Rápido
```bash
# Uma linha, zero configuração!
npm run go
```

### 🚀 Deploy Rápido
```bash
# Build + Start em produção
npm run go:prod
```

### 🔄 Resetar Tudo
```bash
# Limpar e reinstalar do zero
rm -rf node_modules .next
npm run setup
```

---

## 📦 Dependências Necessárias

O script automaticamente instala:
- ✅ Next.js 14
- ✅ React 18
- ✅ Tailwind CSS
- ✅ lucide-react (ícones)
- ✅ axios (HTTP)
- ✅ jspdf (PDF)
- ✅ html2canvas (screenshots)
- ✅ papaparse (CSV)
- ✅ xlsx (Excel)
- ✅ tesseract.js (OCR)
- ✅ react-dropzone (upload)

---

## 🎓 Exemplos de Uso

### Primeiro Uso
```bash
# Clone o repositório
git clone <repo>
cd SimpliTax

# Rode o script (instala tudo automaticamente)
node start.js --dev

# Aguarde... em 30s você já está rodando! 🚀
```

### Uso Diário
```bash
# Simplesmente rode
npm run go

# Pronto! Servidor no ar em 5s ⚡
```

### Preparar para Deploy
```bash
# Build otimizado
npm run go:prod

# Ou manualmente
npm run build
npm start
```

---

## 🎯 Fluxo Recomendado

### 1. **Desenvolvimento Local**
```bash
npm run go
```

### 2. **Testar Build Produção**
```bash
npm run build
npm start
```

### 3. **Deploy** (Vercel, Netlify, etc)
```bash
# Vercel
vercel

# Netlify
netlify deploy --prod

# Docker
docker build -t simplitax .
docker run -p 3000:3000 simplitax
```

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env.local`:

```bash
# APIs externas (opcional)
GOOGLE_VISION_API_KEY=sua_key_aqui
TWILIO_API_KEY=sua_key_aqui
EVOLUTION_API_URL=https://sua-api.com

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📞 Suporte

Se encontrar problemas:

1. ✅ Verifique se Node.js >= 18 está instalado
2. ✅ Execute `npm run setup` para reinstalar
3. ✅ Limpe o cache: `rm -rf .next`
4. ✅ Verifique os logs no console

---

**Desenvolvido por:** GitHub Copilot + LMartins  
**Versão:** SimpliTax 2026 v1.0  
**Data:** 27 de dezembro de 2025
