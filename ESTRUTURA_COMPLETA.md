# 🌳 Árvore Completa do Projeto - SimpliTax 2026

```
SimpliTax/
│
├── 📄 README.md                          # Visão geral do projeto
├── 📄 CHANGELOG.md                       # Histórico de versões
├── 📄 QUICKSTART.md                      # Início rápido (5 min)
├── 📄 CHEATSHEET.md                      # Referência rápida
├── 📄 IMPLEMENTACAO_COMPLETA.md          # Status detalhado
│
├── 📦 package.json                       # Dependências npm
├── 📦 package-lock.json                  # Lock de dependências
│
├── ⚙️ tsconfig.json                      # Config TypeScript
├── ⚙️ next.config.js                     # Config Next.js
├── ⚙️ tailwind.config.js                 # Config Tailwind
├── ⚙️ postcss.config.js                  # Config PostCSS
│
├── 🙈 .gitignore                         # Arquivos ignorados
│
├── 📁 .github/                           # GitHub específico
│   ├── 📄 copilot-instructions.md        # 🎯 MASTER PLAN
│   └── workflows/
│       └── deploy.yml                    # CI/CD workflow
│
├── 📁 docs/                              # Documentação
│   └── 📄 VIBE_CODING.md                 # 🤖 Guia de Prompts Copilot
│
├── 📁 public/                            # Assets estáticos
│   └── logo.svg                          # Logo SimpliTax
│
├── 📁 context/                           # Context API
│   └── EmpresaContext.tsx                # Estado global da empresa
│
└── 📁 src/                               # Código fonte
    │
    ├── 📁 app/                           # Next.js App Router
    │   ├── layout.tsx                    # Layout global
    │   ├── page.tsx                      # Home page
    │   ├── globals.css                   # Estilos globais
    │   │
    │   ├── dashboard/                    # 📊 Dashboard
    │   │   └── page.tsx
    │   │
    │   ├── simulador/                    # 🎚️ Simulador What-If
    │   │   └── page.tsx
    │   │
    │   └── otimizador/                   # 💎 A EQUAÇÃO DE OURO
    │       └── page.tsx                  # ⭐ PÁGINA PRINCIPAL
    │
    ├── 📁 components/                    # Componentes React
    │   ├── Semaforo.tsx                  # 🚦 Indicador de risco
    │   ├── GraficoComparativo.tsx        # 📊 Gráfico visual
    │   │
    │   └── ui/                           # Componentes UI base
    │       ├── Button.tsx                # Botão estilizado
    │       ├── Card.tsx                  # Card container
    │       ├── Input.tsx                 # Input de formulário
    │       └── index.ts                  # Barrel export
    │
    ├── 📁 engine/                        # 🧮 MOTOR TRIBUTÁRIO
    │   ├── regras2026.ts                 # 📋 Alíquotas da reforma
    │   ├── otimizador.ts                 # 💎 A EQUAÇÃO DE OURO
    │   ├── calculador.ts                 # 🧮 Cálculos rápidos
    │   ├── factorR.ts                    # 📈 Monitor Fator R
    │   └── exemplos.ts                   # 📚 5 Casos de uso
    │
    ├── 📁 hooks/                         # React Hooks
    │   └── useTaxCalculation.ts          # Hook de cálculo fiscal
    │
    └── 📁 types/                         # TypeScript Types
        └── index.ts                      # Interfaces globais
```

---

## 📊 Estatísticas do Projeto

```
📁 Pastas:              12
📄 Arquivos:            35+
⚛️  Componentes React:   7
🧮 Funções Engine:      15+
📚 Docs:                5
⏱️  Tempo Dev:           ~3h
🤖 Copilot:             100%
```

---

## 🎯 Arquivos por Importância

### ⭐⭐⭐ CRÍTICOS (Use diariamente)

1. **`src/engine/otimizador.ts`** - A Equação de Ouro
   - 400+ linhas
   - Toda lógica de otimização
   - Funções puras e rápidas

2. **`src/app/otimizador/page.tsx`** - Interface principal
   - Página mais importante
   - UI completa da Equação de Ouro

3. **`src/engine/regras2026.ts`** - Regras tributárias
   - Todas as alíquotas
   - Base de todos os cálculos

### ⭐⭐ IMPORTANTES (Use frequentemente)

4. **`docs/VIBE_CODING.md`** - Guia de prompts
   - 50+ prompts prontos
   - Acelera desenvolvimento

5. **`src/engine/exemplos.ts`** - Casos de uso
   - 5 cenários documentados
   - Exemplos práticos

6. **`.github/copilot-instructions.md`** - Master Plan
   - Visão do produto
   - Roadmap completo

### ⭐ ÚTEIS (Consulta ocasional)

7. **`QUICKSTART.md`** - Início rápido
8. **`CHEATSHEET.md`** - Referência rápida
9. **`CHANGELOG.md`** - Histórico
10. **`src/components/ui/`** - Componentes base

---

## 🔍 Onde Está o Quê?

### Procurando por...

**Alíquotas tributárias?**
→ `src/engine/regras2026.ts`

**Lógica de cálculo?**
→ `src/engine/otimizador.ts` (principal)
→ `src/engine/calculador.ts` (auxiliar)

**Interface visual?**
→ `src/app/otimizador/page.tsx` (melhor)
→ `src/app/simulador/page.tsx` (simples)

**Componentes reutilizáveis?**
→ `src/components/` (visuais)
→ `src/components/ui/` (básicos)

**Exemplos de código?**
→ `src/engine/exemplos.ts`

**Prompts do Copilot?**
→ `docs/VIBE_CODING.md`

**Como começar?**
→ `QUICKSTART.md`

**Referência rápida?**
→ `CHEATSHEET.md`

**Roadmap?**
→ `.github/copilot-instructions.md`

---

## 📦 Dependências Principais

```json
{
  "dependencies": {
    "next": "14.2.0",           // Framework React
    "react": "^18",             // UI Library
    "react-dom": "^18"          // React DOM
  },
  "devDependencies": {
    "@types/node": "^20",       // Types Node.js
    "@types/react": "^18",      // Types React
    "typescript": "^5",         // TypeScript
    "tailwindcss": "^3.4.1",    // CSS Framework
    "autoprefixer": "^10",      // CSS Autoprefixer
    "postcss": "^8"             // CSS Processor
  }
}
```

---

## 🎨 Arquitetura Visual

```
┌─────────────────────────────────────────────────────────┐
│                     USUÁRIO                             │
│                   (Navegador)                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  FRONTEND (Next.js)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ Home     │  │Dashboard │  │ Otimizador ⭐        │  │
│  │ page.tsx │  │ page.tsx │  │ page.tsx             │  │
│  └──────────┘  └──────────┘  └──────────────────────┘  │
│                     │                  │                │
│                     └──────────┬───────┘                │
│                                ▼                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │         COMPONENTS (React)                       │  │
│  │  Semaforo.tsx | GraficoComparativo.tsx          │  │
│  │  Button | Card | Input                           │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                ENGINE (TypeScript)                      │
│  ┌───────────────────────────────────────────────────┐ │
│  │  otimizador.ts ⭐                                  │ │
│  │  → A EQUAÇÃO DE OURO                              │ │
│  │  → Compara cenários                               │ │
│  │  → Retorna recomendação                           │ │
│  └───────────────────────────────────────────────────┘ │
│                     │                                   │
│  ┌──────────────────┴────────────────────┐             │
│  │                                        │             │
│  ▼                                        ▼             │
│  regras2026.ts                    calculador.ts         │
│  • Alíquotas                      • Funções auxiliares  │
│  • Constantes                     • Cálculos rápidos    │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Dados

```
1. Usuário preenche formulário
   ↓
2. Estado React atualiza
   ↓
3. Trigger: botão "Calcular"
   ↓
4. Chama: calcularOtimizacao(dados)
   ↓
5. Engine processa (< 1ms)
   ↓
6. Retorna: ResultadoOtimizacao
   ↓
7. React atualiza UI
   ↓
8. Usuário vê resultado
```

---

## 🚀 Pontos de Entrada

### Para Desenvolvedores
```
1. Leia: README.md
2. Setup: QUICKSTART.md
3. Consulte: CHEATSHEET.md
4. Use: docs/VIBE_CODING.md
```

### Para Entender o Código
```
1. Veja: src/engine/exemplos.ts
2. Estude: src/engine/otimizador.ts
3. Explore: src/app/otimizador/page.tsx
```

### Para Copilot
```
1. Abra: .github/copilot-instructions.md
2. Use: docs/VIBE_CODING.md
3. Adapte os prompts!
```

---

## 📝 Ordem Recomendada de Leitura

Se você é novo no projeto, leia nesta ordem:

1. ✅ `README.md` - Entenda o que é
2. ✅ `.github/copilot-instructions.md` - Visão do produto
3. ✅ `QUICKSTART.md` - Rode localmente
4. ✅ `src/engine/exemplos.ts` - Veja funcionando
5. ✅ `src/engine/otimizador.ts` - Entenda a lógica
6. ✅ `docs/VIBE_CODING.md` - Desenvolva features

---

## 🎯 Modificações Futuras

**Adicionar nova feature?**
→ Consulte `docs/VIBE_CODING.md` para prompts

**Mudar alíquota?**
→ Edite `src/engine/regras2026.ts`

**Novo componente UI?**
→ Crie em `src/components/` e importe

**Nova página?**
→ Adicione em `src/app/nome-da-rota/page.tsx`

**Novo cálculo?**
→ Adicione função em `src/engine/` apropriado

---

## 🏆 Arquivos Mais Importantes (Top 5)

1. 💎 **`src/engine/otimizador.ts`** - A joia da coroa
2. 📋 **`src/engine/regras2026.ts`** - Base de tudo
3. 🎨 **`src/app/otimizador/page.tsx`** - Interface principal
4. 🤖 **`docs/VIBE_CODING.md`** - Acelerador de dev
5. 📖 **`.github/copilot-instructions.md`** - Master Plan

---

**💡 Dica:** Salve este arquivo nos favoritos do seu editor!

---

*Última atualização: v1.0 - 27/12/2025*
