# 🚀 Início Rápido - SimpliTax 2026

**Tempo estimado:** 5 minutos para ver tudo funcionando!

---

## ⚡ Setup Express (Para quem tem pressa)

```bash
# 1. Clone ou navegue até o projeto
cd SimpliTax

# 2. Instale as dependências
npm install

# 3. Rode o servidor de desenvolvimento
npm run dev

# 4. Abra no navegador
# http://localhost:3000
```

**Pronto!** 🎉 Agora você tem o SimpliTax rodando localmente.

---

## 🎯 Testando a Equação de Ouro (O QUE FAZER PRIMEIRO!)

1. **Acesse:** [http://localhost:3000/otimizador](http://localhost:3000/otimizador)

2. **Preencha os campos** com dados de exemplo:
   - Receita Bruta: `100000`
   - Despesas: `30000`
   - Folha Atual: `15000`
   - Pró-labore: `5000`

3. **Clique em "Calcular Otimização"**

4. **Veja a mágica acontecer!** 💎
   - Comparação de cenários
   - Economia anual projetada
   - Ações práticas recomendadas

---

## 🗺️ Tour Guiado (5 min)

### Página 1: Home (`/`)
**O que ver:** Apresentação do SimpliTax
**Tempo:** 30 segundos

### Página 2: Dashboard (`/dashboard`)
**O que ver:** Semáforo de Risco Fiscal 🟢🟡🔴
**Tempo:** 1 minuto
**Teste:** Mude o Fator R nos componentes para ver as cores mudarem

### Página 3: Simulador (`/simulador`)
**O que ver:** Slider interativo de Pró-labore
**Tempo:** 1 minuto
**Teste:** Arraste o slider e veja o resultado mudar em tempo real

### Página 4: Otimizador (`/otimizador`) ⭐ **ESTRELA DO SHOW!**
**O que ver:** A Equação de Ouro completa
**Tempo:** 2 minutos
**Teste:** Use os dados de exemplo acima

---

## 📚 Próximos Passos

### Para Desenvolvedores

1. **Leia o Master Plan:**
   - Abra [.github/copilot-instructions.md](.github/copilot-instructions.md)
   - Entenda a visão do produto

2. **Estude o Engine:**
   - Explore [src/engine/otimizador.ts](src/engine/otimizador.ts)
   - Veja os comentários detalhados da LMartins

3. **Use o VibeCoding:**
   - Abra [docs/VIBE_CODING.md](docs/VIBE_CODING.md)
   - Copie e cole os prompts no Copilot

4. **Rode os Exemplos:**
   - Abra o console do navegador (F12)
   - Copie o código de [src/engine/exemplos.ts](src/engine/exemplos.ts)
   - Execute para ver casos reais

### Para Product Managers

1. **Teste os Cenários:**
   - Use dados de empresas reais (anonimizados)
   - Compare com cálculos manuais
   - Valide as recomendações

2. **Planeje Features:**
   - Consulte o [CHANGELOG.md](CHANGELOG.md)
   - Veja o roadmap da v1.1
   - Priorize com base no feedback

3. **Documente Insights:**
   - Crie issues no GitHub
   - Use labels: `feature`, `bug`, `enhancement`

---

## 🔧 Troubleshooting Rápido

### ❌ Erro: "Cannot find module 'next'"
**Solução:** Rode `npm install` novamente

### ❌ Erro: "Port 3000 already in use"
**Solução:** 
```bash
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Ou mude a porta:
npm run dev -- -p 3001
```

### ❌ Página em branco no navegador
**Solução:** 
1. Verifique o console do navegador (F12)
2. Verifique o terminal onde rodou `npm run dev`
3. Tente limpar o cache: `rm -rf .next` e rode `npm run dev` novamente

### ❌ Erros de TypeScript
**Solução:** 
```bash
# Recompile os tipos
npx tsc --noEmit

# Se persistir, reinstale:
rm -rf node_modules package-lock.json
npm install
```

---

## 💡 Dicas de Produtividade

### Use os Atalhos do VS Code
- `Ctrl + P` → Buscar arquivo
- `Ctrl + Shift + F` → Buscar em todos os arquivos
- `F2` → Renomear símbolo

### Ative o Copilot
1. Instale a extensão "GitHub Copilot"
2. Abra qualquer arquivo `.ts` ou `.tsx`
3. Comece a digitar e veja as sugestões!

### Hot Reload
O Next.js recarrega automaticamente. Salve o arquivo e veja as mudanças instantâneas!

---

## 🎓 Recursos de Aprendizado

### Para Aprender Next.js
- [Documentação Oficial](https://nextjs.org/docs)
- [Tutorial Interativo](https://nextjs.org/learn)

### Para Aprender Tailwind CSS
- [Documentação](https://tailwindcss.com/docs)
- [Playground](https://play.tailwindcss.com/)

### Para Entender a Reforma Tributária 2026
- Consulte [src/engine/regras2026.ts](src/engine/regras2026.ts)
- Leia os comentários explicativos
- Veja os exemplos em [src/engine/exemplos.ts](src/engine/exemplos.ts)

---

## ✅ Checklist de "Estou Pronto!"

- [ ] Projeto rodando em `localhost:3000`
- [ ] Testei a Equação de Ouro com dados de exemplo
- [ ] Li o Master Plan em `.github/copilot-instructions.md`
- [ ] Explorei os 3 arquivos principais do engine
- [ ] Copilot instalado e funcionando
- [ ] Guia VibeCoding aberto para consulta

**Marcou tudo?** Parabéns! Você está pronto para desenvolver! 🚀

---

## 📞 Precisa de Ajuda?

1. **Consulte primeiro:**
   - [README.md](README.md) - Visão geral
   - [CHANGELOG.md](CHANGELOG.md) - O que há de novo
   - [docs/VIBE_CODING.md](docs/VIBE_CODING.md) - Prompts do Copilot

2. **Ainda com dúvidas?**
   - Abra uma issue no GitHub
   - Ou use o Copilot Chat: `@workspace como faço X?`

---

**Boa codificação! 💙** - Equipe SimpliTax
