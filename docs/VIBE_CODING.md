# 🎨 Guia de VibeCoding - SimpliTax 2026

**O que é VibeCoding?** É a arte de fazer o Copilot trabalhar PRA VOCÊ, usando prompts inteligentes baseados no Master Plan!

---

## 🚀 Como Usar Este Guia

1. **Abra o VS Code** no projeto SimpliTax
2. **Leia o contexto** em [.github/copilot-instructions.md](./.github/copilot-instructions.md)
3. **Use os prompts** abaixo adaptando para sua necessidade
4. **Deixe o Copilot fazer a mágica** ✨

---

## 📚 Prompts por Módulo

### 🧮 Engine Tributário

#### Criar Nova Regra Fiscal
```
Copilot, seguindo a estrutura do SimpliTax 2026, crie uma função em src/engine/regras2026.ts 
que calcule a alíquota progressiva do IRPJ para empresas no Lucro Real. 
Use comentários no estilo da LMartins (entusiasta e didático).
```

#### Adicionar Novo Cálculo
```
Com base na Equação de Ouro do SimpliTax em src/engine/otimizador.ts, 
crie uma função que simule o impacto de contratar um novo funcionário CLT 
no Fator R da empresa. Mostre em linguagem clara quanto economiza.
```

#### Testar Cenário Específico
```
No arquivo src/engine/calculador.ts, crie uma função de teste que simule 
uma empresa com R$ 500k de receita anual decidindo entre MEI, Simples ou Lucro Presumido. 
Retorne uma tabela comparativa.
```

---

### 🎨 Componentes Visuais

#### Criar Novo Componente
```
Copilot, crie um componente React em src/components/AlertaFiscal.tsx que mostre 
um alerta estilo "toast" quando o Fator R cair abaixo de 28%. Use Tailwind CSS 
com as cores do SimpliTax (theme.colors.simpli-*). Siga o padrão do Semaforo.tsx.
```

#### Gráfico Interativo
```
Baseado em src/components/GraficoComparativo.tsx, crie um gráfico de linha 
que mostre a evolução do Fator R nos últimos 12 meses. Use chart.js ou uma lib similar. 
O eixo X são os meses, Y é a porcentagem do Fator R (com linha de referência em 28%).
```

#### Modal de Explicação
```
Crie um componente Modal em src/components/ui/Modal.tsx que explique 
"O que é Fator R?" em linguagem ultra simples (nível: dono de padaria). 
Use emojis e exemplos práticos no estilo LMartins.
```

---

### 📄 Páginas e Fluxos

#### Nova Página de Relatório
```
Copilot, crie uma página em src/app/relatorio/page.tsx que gere um relatório 
em PDF para o cliente final (não o contador, mas o dono da empresa). 
Deve incluir: economia obtida, ações tomadas, e explicações simples. 
Use a lib jsPDF ou similar.
```

#### Fluxo de Onboarding
```
Seguindo a estrutura do SimpliTax, crie um fluxo de onboarding em 
src/app/onboarding/page.tsx onde o contador cadastra a empresa em 3 etapas:
1. Dados básicos (CNPJ, Receita)
2. Upload de planilha financeira
3. Configuração de alertas
```

#### Dashboard Analytics
```
Crie um dashboard em src/app/analytics/page.tsx que mostre KPIs:
- Economia total do mês
- Número de empresas em risco (Fator R < 28%)
- Gráfico de barras: Anexo III vs Anexo V
Use os componentes Card e GraficoComparativo existentes.
```

---

### 🔧 Utilitários e Helpers

#### Parser de Planilhas
```
Em src/utils/parser.ts, crie uma função que leia um CSV/XLSX de extrato bancário 
e identifique automaticamente as colunas de Data, Descrição, Valor. 
Use uma lib como papaparse ou xlsx. Retorne um array normalizado.
```

#### Formatadores
```
Crie src/utils/formatters.ts com funções puras:
- formatarMoeda(valor) → "R$ 1.234,56"
- formatarPercentual(decimal) → "12,5%"
- formatarCNPJ(string) → "12.345.678/0001-90"
```

#### Validadores
```
Em src/utils/validators.ts, crie validadores para:
- isCNPJValido(cnpj: string): boolean
- isFatorRSeguro(fatorR: number): boolean (retorna false se < 0.28)
- isReceitaValida(valor: number): boolean (entre 0 e limite Simples)
```

---

### 🧪 Testes

#### Teste do Engine
```
Copilot, crie testes unitários em __tests__/engine/otimizador.test.ts 
para a função calcularOtimizacao. Teste cenários extremos:
1. Receita zero
2. Fator R exatamente 28%
3. Pró-labore maior que receita (deve dar erro)
Use Jest ou Vitest.
```

#### Teste de Componente
```
Crie um teste E2E em __tests__/components/Semaforo.test.tsx verificando:
- Cor verde quando Fator R >= 0.28
- Cor amarela quando 0.25 <= Fator R < 0.28
- Cor vermelha quando Fator R < 0.25
Use Testing Library.
```

---

## 🎯 Prompts Avançados (Combo Moves!)

### Criar Feature Completa
```
Copilot, quero implementar a feature "Simulador de Reforma 2026" do Master Plan:

1. Crie src/engine/comparador2025vs2026.ts com função que compare 
   os custos tributários usando regras de 2025 (dividendos isentos) 
   vs regras de 2026 (dividendos taxados 15%)

2. Crie src/app/comparador/page.tsx com interface para:
   - Upload de balancete 2025
   - Projeção automática para 2026
   - Gráfico lado a lado

3. Adicione rota em src/app/layout.tsx

Use o padrão visual do SimpliTax e comentários estilo LMartins.
```

### Refatorar para Performance
```
Analise src/engine/otimizador.ts e otimize para performance:
1. Identifique cálculos repetidos
2. Use memoization onde apropriado
3. Adicione early returns para casos óbvios
4. Documente as otimizações nos comentários
```

### Adicionar Acessibilidade
```
Revise src/components/Semaforo.tsx e adicione:
1. ARIA labels descritivos
2. Suporte para leitores de tela
3. Navegação por teclado
4. Indicadores visuais para daltônicos (não só cores)
Mantenha a estética atual.
```

---

## 💡 Dicas de Ouro da LMartins

### ✅ FAÇA
- Use contexto específico nos prompts (mencione arquivos existentes)
- Peça o tom de voz "estilo LMartins" para manter consistência
- Solicite comentários didáticos no código
- Sempre peça Tailwind CSS (o projeto usa isso)

### ❌ NÃO FAÇA
- Prompts genéricos tipo "crie um formulário"
- Pedir libs pesadas sem necessidade
- Ignorar a estrutura de pastas do projeto
- Esquecer de mencionar TypeScript

---

## 🎓 Exemplos Reais de Sessões

### Sessão 1: "Preciso de um botão de emergência"
```
Copilot, implemente a Dica de Ouro 1 do Master Plan: o "Botão de Pânico do Fator R".

Crie src/components/BotaoPanico.tsx que:
- Monitore os últimos 12 meses de dados
- Mostre alerta vermelho piscando se Fator R < 25%
- Calcule EXATAMENTE quanto aumentar a folha este mês
- Exemplo de mensagem: "AÇÃO URGENTE: Aumente sua folha em R$ 500 
  este mês ou seus impostos subirão 15% em 2026!"

Use os dados do context/EmpresaContext.tsx
Siga o padrão visual do Semaforo.tsx
```

### Sessão 2: "Cliente quer ver o relatório"
```
Implemente a Dica de Ouro 2 do Master Plan: Relatórios para o Cliente Final.

Crie src/utils/geradorRelatorio.ts com função:
- Entrada: dados da empresa (DadosEmpresa)
- Saída: string em markdown explicando de forma ULTRA SIMPLES
- Tom: como se estivesse explicando para um dono de padaria
- Inclua: "Este mês economizamos R$ X fazendo Y"
- Use emojis e metáforas do dia a dia

Depois crie src/app/relatorio-cliente/page.tsx que:
- Mostre o markdown renderizado (use react-markdown)
- Tenha botão "Baixar PDF"
- Tenha botão "Enviar por WhatsApp" (link pré-formatado)
```

---

## 🔄 Workflow Recomendado

1. **Leia o Master Plan** antes de cada sessão
2. **Escolha uma funcionalidade** (uma por vez!)
3. **Monte o prompt** usando este guia
4. **Revise o código gerado** (Copilot é bom, mas não perfeito)
5. **Teste localmente** com `npm run dev`
6. **Commit incremental** (não acumule muitas mudanças)

---

## 📞 Suporte

Dúvidas sobre prompts ou funcionalidades? Consulte:
- [Master Plan](./.github/copilot-instructions.md)
- [README principal](../README.md)
- Documentação do Next.js, Tailwind CSS e TypeScript

---

**Feito com 💙 pela LMartins - Bora codar!** 🚀
