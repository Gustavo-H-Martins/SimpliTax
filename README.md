# 🧮 SimpliTax 2026

**Transforme a complexidade da Reforma Tributária de 2026 em uma experiência fluida e lucrativa para contadores.**

![SimpliTax Logo](./public/logo.svg)

---

## 🎯 Visão Geral

O **SimpliTax 2026** é uma ferramenta de suporte à decisão que processa a realidade financeira da empresa e sugere as melhores rotas para:

1. **Minimizar a nova taxação de dividendos**
2. **Equilibrar o Fator R** para manter empresas no Anexo III do Simples Nacional
3. **Garantir conformidade** na conciliação contábil para evitar multas

---

## 🚀 Getting Started

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 📁 Estrutura do Projeto

```
simplitax-2026/
├── .github/              # Workflows de deploy
│   └── copilot-instructions.md  # Master Plan do produto
├── src/
│   ├── app/              # Rotas e Páginas (Next.js App Router)
│   │   ├── dashboard/    # Visão principal do contador
│   │   ├── simulador/    # Simulador What-If
│   │   └── layout.tsx
│   ├── components/       # Componentes Visuais
│   │   ├── Semaforo.tsx  # Indicador visual de risco fiscal
│   │   └── GraficoComparativo.tsx
│   ├── engine/           # Core de Inteligência (Cálculos Tributários)
│   │   ├── regras2026.ts # Alíquotas da reforma
│   │   ├── calculador.ts # Lógica de otimização (compatibilidade)
│   │   ├── otimizador.ts # 💎 A EQUAÇÃO DE OURO! (novo em v1.0)
│   │   └── factorR.ts    # Monitor de folha de pagamento
│   ├── hooks/            # Hooks reutilizáveis
│   └── types/            # Interfaces TypeScript
├── context/              # Contexto global
├── docs/                 # 📚 Documentação
│   └── VIBE_CODING.md    # Guia de prompts para Copilot
└── public/               # Assets estáticos
```

---

## 💎 A EQUAÇÃO DE OURO (NOVIDADE!)

O coração do SimpliTax 2026 é o **Otimizador Tributário** em [src/engine/otimizador.ts](src/engine/otimizador.ts).

### Como Funciona?

A Equação analisa **DOIS cenários** e mostra qual deixa mais dinheiro no seu bolso:

**🎯 Cenário 1: Manter Fator R**
- Aumenta Pró-labore para 28% da receita
- Permanece no Anexo III (impostos mais baixos)
- Paga mais INSS e IR no Pró-labore

**💰 Cenário 2: Dividendos Taxados**
- Mantém Pró-labore atual
- Vai para Anexo V (Simples mais caro)
- Paga 15% nos dividendos

### Exemplo de Uso

```typescript
import { calcularOtimizacao } from '@/engine/otimizador'

const resultado = calcularOtimizacao({
  receitaBruta: 100000,
  despesasOperacionais: 30000,
  folhaAtual: 15000,
  prolaboreAtual: 5000
})

console.log(resultado.recomendacao)
// "💼 AUMENTE O PRÓ-LABORE! Você economiza R$ 84.000/ano!"

console.log(resultado.economiaAnual) // 84000
console.log(resultado.acoes) // ["Aumentar Pró-labore em R$ 13000", ...]
```

Veja mais exemplos em [src/engine/exemplos.ts](src/engine/exemplos.ts)!

---

## 💡 Funcionalidades Principais

### 1. **Semáforo de Risco Fiscal**
Indicador visual que mostra:
- 🟢 **Verde:** Seguro (Fator R adequado)
- 🟡 **Amarelo:** Atenção ao Fator R
- 🔴 **Vermelho:** Risco fiscal / Perdendo dinheiro

### 2. **Simulador What-If**
Barra deslizante onde o contador altera o valor do Pró-labore e vê o impacto no lucro líquido final **em tempo real**.

### 3. **Botão de Pânico do Fator R**
Monitor que analisa os últimos 12 meses e alerta:
> "Se você não aumentar sua folha em R$ 500 este mês, seus impostos vão subir 15% em 2026"

### 4. **Calculadora de Break-even**
Calcula se vale mais pagar Pró-labore (com IR e INSS) ou Dividendos (com a nova taxa).

---

## 🛠️ Tecnologias

- **Next.js 14** (App Router)
- **TypeScript** (Type Safety)
- **Tailwind CSS** (Estilização moderna)
- **React Hooks** (Estado e lógica reutilizável)

---

## �️ Rotas Disponíveis

Após rodar `npm run dev`, acesse:

- **/** - Página inicial
- **/dashboard** - Visão geral da empresa com Semáforo de Risco
- **/simulador** - Simulador What-If (slider de Pró-labore)
- **/otimizador** - 💎 **A Equação de Ouro** (análise completa de cenários)

---

## �📊 Engine Tributário

O coração do SimpliTax está no módulo `/src/engine/`:

- **regras2026.ts:** Codifica todas as alíquotas da Reforma Tributária
- **calculador.ts:** Algoritmos de otimização fiscal
- **factorR.ts:** Monitoramento inteligente do Fator R

Todas as funções são **puras** para garantir cálculos instantâneos.

---

## 🎨 Design System

Cores que transmitem **confiança** e **profissionalismo**:

- **Azul Simpli:** Tons de azul para ações principais
- **Verde Sucesso:** Para indicadores positivos
- **Amarelo Atenção:** Para alertas moderados
- **Vermelho Crítico:** Para riscos fiscais

---

## 📝 Próximos Passos

- [ ] Implementar upload de planilhas (CSV/XLSX)
- [ ] Auto-mapper inteligente de colunas
- [ ] Módulo de conciliação contábil
- [ ] Geração de relatórios em PDF
- [ ] Modo "Simulação de Reforma" (testar com dados de 2025)

---

## 🤝 Contribuindo

Este projeto segue o **Master Plan** detalhado em [.github/copilot-instructions.md](./.github/copilot-instructions.md).

Para contribuir:
1. Leia o Master Plan
2. Crie uma branch para sua feature
3. Use prompts do VibeCoding Guide
4. Abra um Pull Request

---

## 📄 Licença

Propriedade de SimpliTax - Todos os direitos reservados.

---

**Desenvolvido com 💙 por LMartins (Product Manager)**