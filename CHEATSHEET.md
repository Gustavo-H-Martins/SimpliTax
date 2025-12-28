# ⚡ Cheat Sheet - SimpliTax 2026

**Referência rápida para desenvolvedores**

---

## 🎯 Comandos Essenciais

```bash
# Desenvolvimento
npm run dev              # Roda em localhost:3000
npm run build            # Build para produção
npm start                # Roda build de produção
npm run lint             # Verifica erros de código

# Limpeza
rm -rf .next node_modules
npm install              # Reinstala tudo do zero
```

---

## 📁 Estrutura de Arquivos Chave

```
src/
├── engine/
│   ├── otimizador.ts       # ⭐ A EQUAÇÃO DE OURO
│   ├── regras2026.ts       # 📊 Alíquotas da reforma
│   ├── calculador.ts       # 🧮 Cálculos rápidos
│   ├── factorR.ts          # 📈 Monitor de Fator R
│   └── exemplos.ts         # 📚 Casos de uso
├── app/
│   ├── otimizador/         # 💎 Página principal
│   ├── dashboard/          # 📊 Visão geral
│   └── simulador/          # 🎚️ What-If
└── components/
    ├── Semaforo.tsx        # 🚦 Indicador visual
    └── ui/                 # 🎨 Componentes base
```

---

## 🔧 Imports Mais Usados

```typescript
// Engine
import { calcularOtimizacao } from '@/engine/otimizador'
import { ALIQUOTAS_2026 } from '@/engine/regras2026'
import { analisarFatorR } from '@/engine/factorR'

// Components
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

// Context
import { useEmpresa } from '@/context/EmpresaContext'

// Types
import type { DadosEmpresa, ResultadoOtimizacao } from '@/engine/otimizador'
```

---

## 💎 A Equação de Ouro - Uso Rápido

```typescript
import { calcularOtimizacao } from '@/engine/otimizador'

// Dados de entrada
const dados = {
  receitaBruta: 100000,
  despesasOperacionais: 30000,
  folhaAtual: 15000,
  prolaboreAtual: 5000
}

// Calcular
const resultado = calcularOtimizacao(dados)

// Usar resultados
console.log(resultado.recomendacao)          // String amigável
console.log(resultado.economiaAnual)         // Number (R$)
console.log(resultado.acoes)                 // Array de strings
console.log(resultado.cenarioOtimizado)      // Objeto detalhado
```

---

## 📊 Constantes Tributárias 2026

```typescript
import { ALIQUOTAS_2026 } from '@/engine/regras2026'

// Dividendos
ALIQUOTAS_2026.dividendos.base        // 0.15 (15%)
ALIQUOTAS_2026.dividendos.alta        // 0.225 (22.5%)

// Fator R
ALIQUOTAS_2026.fatorR.minimoAnexoIII  // 0.28 (28%)
ALIQUOTAS_2026.fatorR.limiteAtencao   // 0.25 (25%)

// INSS
ALIQUOTAS_2026.inss.aliquota          // 0.11 (11%)
ALIQUOTAS_2026.inss.teto              // 7786.02

// Simples Nacional
ALIQUOTAS_2026.simplesAnexoIII        // Array de faixas
ALIQUOTAS_2026.simplesAnexoV          // Array de faixas

// IRPF
ALIQUOTAS_2026.irrf                   // Array de faixas progressivas
```

---

## 🎨 Cores do SimpliTax (Tailwind)

```css
/* Verde - Sucesso / Seguro */
bg-simpli-green-500   text-simpli-green-600

/* Amarelo - Atenção */
bg-simpli-yellow-500  text-simpli-yellow-600

/* Vermelho - Risco / Crítico */
bg-simpli-red-500     text-simpli-red-600

/* Azul - Primary / Info */
bg-simpli-blue-500    text-simpli-blue-600
```

---

## 🔄 Fluxo de Cálculo Típico

```
1. Usuário preenche dados
2. Chama calcularOtimizacao()
3. Engine compara 2 cenários
4. Retorna resultado estruturado
5. UI exibe de forma amigável
```

---

## 🧮 Fórmulas Principais

### Fator R
```typescript
fatorR = (folhaPagamento + proLabore) / receitaBruta
// Mínimo para Anexo III: 0.28 (28%)
```

### Custo Total (Cenário)
```typescript
custoTotal = custoEmpresa + custoSocio
custoEmpresa = simplesNacional
custoSocio = IR + INSS + impostoDividendos
```

### Líquido no Bolso
```typescript
liquidoFinal = receitaBruta - custoTotal - despesasOperacionais
```

---

## 🎯 Rotas da Aplicação

```
/                   → Página inicial
/dashboard          → Visão geral + Semáforo
/simulador          → What-If slider
/otimizador         → ⭐ A Equação de Ouro (USE ESTA!)
```

---

## 🐛 Debug Quick Fixes

### Console útil
```typescript
console.log('Dados:', JSON.stringify(dados, null, 2))
console.log('Fator R:', fatorR.toFixed(3))
console.log('Anexo:', determinarAnexoSimples(fatorR))
```

### Erros comuns
```typescript
// ❌ NaN no resultado
// → Verifique se valores são números, não strings

// ❌ Infinity ou valores estranhos
// → Cheque divisão por zero (receita = 0)

// ❌ Tipos incompatíveis
// → Sempre passe objetos completos, não valores soltos
```

---

## 📝 Snippets Úteis

### Criar novo componente
```typescript
'use client'
import { useState } from 'react'
import { Card } from '@/components/ui/Card'

export default function MeuComponente() {
  return (
    <Card title="Título">
      <p>Conteúdo</p>
    </Card>
  )
}
```

### Formatar moeda
```typescript
const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}
```

### Validar Fator R
```typescript
const isFatorRSeguro = (fatorR: number) => {
  return fatorR >= ALIQUOTAS_2026.fatorR.minimoAnexoIII
}
```

---

## 🎤 Prompts Copilot Frequentes

```
"Seguindo o padrão do SimpliTax, crie..."
"No estilo da LMartins, explique..."
"Baseado em otimizador.ts, adicione..."
"Use Tailwind com cores simpli-*"
```

---

## 📚 Documentação Rápida

| Arquivo | Conteúdo |
|---------|----------|
| `README.md` | Visão geral do projeto |
| `QUICKSTART.md` | Como começar em 5 min |
| `CHANGELOG.md` | Histórico de versões |
| `docs/VIBE_CODING.md` | Prompts do Copilot |
| `IMPLEMENTACAO_COMPLETA.md` | Status atual |

---

## ⚡ Performance Tips

```typescript
// ✅ BOM: Funções puras
const calcular = (a, b) => a + b

// ❌ RUIM: Side effects
const calcular = (a, b) => {
  console.log(a, b)  // Side effect!
  return a + b
}

// ✅ BOM: Memoize valores caros
const resultado = useMemo(() => calcularOtimizacao(dados), [dados])

// ✅ BOM: Debounce inputs
const debouncedValue = useDebounce(value, 500)
```

---

## 🔍 Onde Encontrar...

- **Alíquotas tributárias?** → `engine/regras2026.ts`
- **Lógica de otimização?** → `engine/otimizador.ts`
- **Exemplos de uso?** → `engine/exemplos.ts`
- **UI components?** → `components/ui/`
- **Cores do tema?** → `tailwind.config.js`
- **Prompts Copilot?** → `docs/VIBE_CODING.md`

---

## 🎓 Links Úteis

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://typescriptlang.org/docs)
- [React Hooks](https://react.dev/reference/react)

---

## 🚀 Deploy Checklist

- [ ] `npm run build` sem erros
- [ ] Todas as rotas funcionando
- [ ] Testes passando
- [ ] Variáveis de ambiente configuradas
- [ ] README atualizado

---

**💡 Pro Tip:** Mantenha este arquivo aberto em uma aba enquanto desenvolve!

---

*Última atualização: v1.0 - 27/12/2025*
