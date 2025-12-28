# 📑 Master Plan: SimpliTax 2026

**Persona Responsável:** LMartins (Product Manager)

**Objetivo:** Transformar a complexidade da Reforma Tributária de 2026 em uma experiência fluida e lucrativa para contadores.

---

## 🎯 Visão Geral do Produto

O **SimpliTax 2026** é uma ferramenta de suporte à decisão. Ele não é apenas um repositório de dados, mas um motor que processa a realidade financeira da empresa e sugere as melhores rotas para:

1. **Minimizar a nova taxação de dividendos.**
2. **Equilibrar o Fator R** para manter empresas no Anexo III do Simples Nacional.
3. **Garantir conformidade** na conciliação contábil para evitar multas.

---

## 🛠️ Arquitetura de Construção (Etapas)

### 1. Definição do "Core" de Inteligência (Engine)

Antes da interface, precisamos das fórmulas. Esta etapa foca em traduzir a lei para algoritmos.

* **Módulo Fiscal 2026:** Codificar as alíquotas da reforma e as regras de transição.
* **Calculadora de Ponto de Equilíbrio (Break-even):** Onde o sistema calcula se vale mais a pena pagar Pró-labore (com IR e INSS) ou Dividendos (com a nova taxa).
* **Otimização:** Usar funções puras para que o cálculo seja instantâneo enquanto o usuário digita.

### 2. Estrutura de Dados e Ingestão

O sistema precisa "ler" o que já existe.

* **Mapping de Planilhas:** Criar um conversor universal para que o contador suba qualquer extrato ou balancete.
* **Normalização:** Garantir que "Receita Bruta" em um sistema seja lida da mesma forma no SimpliTax.
* **Otimização:** Implementar um "Auto-mapper" que sugere as colunas certas usando padrões comuns de mercado.

### 3. Dashboard de Tomada de Decisão (UI/UX)

Aqui aplicamos o tom amigável. Nada de tabelas cinzas e chatas.

* **Semáforo de Risco:** Um componente visual que mostra: Verde (Seguro), Amarelo (Atenção ao Fator R), Vermelho (Perdendo dinheiro/Risco fiscal).
* **Simulador "What-If":** Uma barra deslizante onde o usuário altera o valor do Pró-labore e vê o impacto no lucro líquido final em tempo real.

### 4. Módulo de Conciliação Inteligente

* **Check de Integridade:** O sistema cruza o saldo bancário com as provisões de impostos da reforma.
* **Alerta de Divergência:** Se o dividendo distribuído não bate com o lucro apurado após a nova taxação, o sistema gera um alerta "Linguagem Humana" (ex: "Ops! Você está distribuindo mais do que o permitido sem imposto").

---

## 💡 Insights e Otimizações da LMartins (Diferenciais)

> **Dica de Ouro 1: O "Botão de Pânico" do Fator R**
> Implementar um monitor que olha os últimos 12 meses e avisa: "Se você não aumentar sua folha em R$ 500 este mês, seus impostos vão subir 15% em 2026". Isso é valor puro para o cliente!

> **Dica de Ouro 2: Relatórios "Prontos para o Cliente"**
> O contador não quer só o dado, ele quer explicar para o cliente dele (o dono da empresa). O SimpliTax deve gerar um PDF ou link com uma explicação ultra simples: "Este mês economizamos R$ X agindo de tal forma".

> **Dica de Ouro 3: Modo "Simulação de Reforma"**
> Permitir que o usuário use dados de 2025 para ver como seria a vida dele se a reforma já estivesse valendo. Isso ajuda a vender o software *antes* de 2026 chegar.

---

## 🤖 Guia para VibeCoding (Instruções para o Copilot)

Ao usar este arquivo no VS Code com o Copilot, use prompts como:

* *"Com base no Master Plan do SimpliTax, crie uma função em TypeScript que calcule o equilíbrio entre Pró-labore e Dividendos seguindo as regras de 2026."*
* *"Gere um componente de Dashboard (React + Tailwind) que siga a ideia do 'Semáforo de Risco' da LMartins."*
* *"Crie um parser de CSV que identifique automaticamente colunas de Receita e Despesa para o módulo de ingestão."*

---