# 🎨 Guia de Identidade Visual - SimpliTax 2026

## Paleta de Cores Oficial

### Cores Primárias
```
Azul Profundo (Base/Confiança): #0F172A
- Uso: Textos principais, backgrounds escuros, elementos de confiança
- Representa: Solidez, profissionalismo, segurança

Ciano Elétrico (Acento/Tecnologia): #00B4D8
- Uso: Botões de ação, destaques, links, ícones interativos
- Representa: Inovação, agilidade, modernidade
```

### Cores Secundárias
```
Branco Puro: #FFFFFF
- Uso: Backgrounds, cards, espaçamentos
- Representa: Clareza, limpeza, simplicidade

Cinza Neutro: #64748B
- Uso: Textos secundários, bordas, elementos neutros
- Representa: Equilíbrio, profissionalismo
```

### Cores de Status
```
Verde Sucesso: #10B981 (para economia, otimização)
Amarelo Atenção: #F59E0B (para alertas moderados)
Vermelho Urgente: #EF4444 (para ações críticas)
```

## Logo SimpliTax

### Conceito: "O Conector Ágil"
A logo representa a conexão inteligente entre dados fiscais e decisões estratégicas.

**Elementos:**
1. **Nós de Rede** (círculos): Pontos de dados conectados
2. **Linhas Conectoras**: Formam um "S" estilizado (SimpliTax)
3. **Seta de Crescimento**: Indica direção e progresso
4. **Cores Alternadas**: Azul profundo + Ciano elétrico = confiança + tecnologia

### Variações
- **Logo Completa**: Ícone + texto "SimpliTax" + tagline "powered by LM Tech"
- **Logo Ícone**: Apenas o símbolo (para favicons, avatares)
- **Logo Check** (alternativa): Letra "L" que se transforma em check ✓

## Aplicações

### NavBar
- Logo completa (36px)
- Hover: opacidade 80%
- Cores: Gradiente azul → ciano no texto

### Dashboard
- Cards: Backgrounds claros (#F8FAFC)
- Destaques: Ciano elétrico (#00B4D8)
- Alertas: Sistema de cores de status

### Botões
```css
Primário: bg-gradient(#0F172A → #00B4D8)
Secundário: border #00B4D8, text #0F172A
Hover: Leve aumento de brilho + scale(1.02)
```

### Tipografia
- **Fonte Principal**: Inter (sans-serif)
- **Títulos**: Bold, tracking-tight
- **Corpo**: Regular/Medium
- **Destaque**: Gradient text (azul → ciano)

## Filosofia de Design

> "Clareza sem sacrificar a sofisticação. Tecnologia que não intimida."

### Princípios
1. **Minimalismo Intencional**: Cada elemento tem propósito
2. **Hierarquia Visual Clara**: O olho sabe onde pousar
3. **Feedback Imediato**: Toda ação tem resposta visual
4. **Cores com Significado**: Verde = bom, Amarelo = atenção, Vermelho = urgente

## Exemplos de Uso

### Card de Sucesso
```tsx
<Card className="bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 border-2 border-cyan-400">
  {/* Conteúdo otimizado */}
</Card>
```

### Card de Alerta
```tsx
<Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300">
  {/* Conteúdo sem otimização */}
</Card>
```

### Texto com Gradiente
```tsx
<h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
  SimpliTax Otimizado
</h1>
```

## Referências Visuais

### Site LM Tech
- URL: https://grupolmtech.com.br
- Footer: Azul profundo (#0F172A)
- Botões: Ciano elétrico (#00B4D8)
- Estilo: Moderno, limpo, tecnológico

### Inspirações
- Fintech startups (Nubank, Stripe)
- Dashboards SaaS (Vercel, Linear)
- Design Systems (Tailwind, Radix)

---

**Criado por:** LMartins (Product Manager)  
**Última atualização:** Dezembro 2025
