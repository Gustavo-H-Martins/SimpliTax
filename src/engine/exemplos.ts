/**
 * 📖 EXEMPLOS DE USO - A Equação de Ouro em Ação!
 * 
 * Este arquivo mostra casos reais de uso do otimizador tributário.
 * Use estes exemplos para entender como o SimpliTax funciona na prática!
 * 
 * 💡 Para testar: Copie e cole no console do navegador ou crie um teste
 */

import { calcularOtimizacao, DadosEmpresa } from './otimizador'

// ============================================================================
// 🏢 CASO 1: Empresa de TI (Típica do Anexo III)
// ============================================================================

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('🏢 CASO 1: Software House - R$ 100k/mês de receita')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

const empresaTI: DadosEmpresa = {
  receitaBruta: 100000,           // R$ 100k/mês de faturamento
  despesasOperacionais: 30000,    // R$ 30k (infraestrutura, tools, etc)
  folhaAtual: 15000,              // R$ 15k de CLT
  prolaboreAtual: 5000            // Sócio tirando só R$ 5k
}

const resultadoTI = calcularOtimizacao(empresaTI)

console.log('\n📊 SITUAÇÃO ATUAL:')
console.log(`Fator R atual: ${((empresaTI.folhaAtual + empresaTI.prolaboreAtual) / empresaTI.receitaBruta * 100).toFixed(1)}%`)
console.log(`Custo total: R$ ${resultadoTI.cenarioAtual.custoTotal.toFixed(2)}`)
console.log(`Líquido no bolso: R$ ${resultadoTI.cenarioAtual.liquidoFinal.toFixed(2)}`)

console.log('\n✨ CENÁRIO OTIMIZADO:')
console.log(resultadoTI.recomendacao)
console.log(`Economia anual: R$ ${resultadoTI.economiaAnual.toFixed(2)}`)

console.log('\n📋 AÇÕES:')
resultadoTI.acoes.forEach((acao, i) => console.log(`${i + 1}. ${acao}`))

// ============================================================================
// 💼 CASO 2: Consultoria (Fator R já ok)
// ============================================================================

console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('💼 CASO 2: Consultoria - Fator R já adequado')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

const empresaConsultoria: DadosEmpresa = {
  receitaBruta: 80000,
  despesasOperacionais: 20000,
  folhaAtual: 10000,
  prolaboreAtual: 15000           // Pró-labore alto (31% da receita)
}

const resultadoConsultoria = calcularOtimizacao(empresaConsultoria)

console.log('\n📊 SITUAÇÃO ATUAL:')
console.log(`Fator R atual: ${((empresaConsultoria.folhaAtual + empresaConsultoria.prolaboreAtual) / empresaConsultoria.receitaBruta * 100).toFixed(1)}%`)
console.log(resultadoConsultoria.cenarioAtual.descricao)

console.log('\n✨ ANÁLISE:')
console.log(resultadoConsultoria.recomendacao)
console.log('💡 Este caso mostra que às vezes manter o Fator R NÃO é a melhor opção!')

// ============================================================================
// 🚨 CASO 3: Empresa em Risco (Fator R baixo)
// ============================================================================

console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('🚨 CASO 3: Empresa em RISCO - Fator R Crítico!')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

const empresaRisco: DadosEmpresa = {
  receitaBruta: 150000,
  despesasOperacionais: 40000,
  folhaAtual: 5000,               // Folha muito baixa!
  prolaboreAtual: 3000            // Pró-labore também baixo
}

const resultadoRisco = calcularOtimizacao(empresaRisco)

console.log('\n⚠️ ALERTA VERMELHO:')
console.log(`Fator R atual: ${((empresaRisco.folhaAtual + empresaRisco.prolaboreAtual) / empresaRisco.receitaBruta * 100).toFixed(1)}% (< 28%!)`)
console.log(`Está pagando ${resultadoRisco.economiaAnual > 0 ? 'A MAIS' : 'A MENOS'} anualmente!`)

console.log('\n🚑 AÇÃO URGENTE:')
console.log(resultadoRisco.recomendacao)
resultadoRisco.acoes.forEach((acao, i) => console.log(`${i + 1}. ${acao}`))

// ============================================================================
// 🔬 CASO 4: Simulação Comparativa
// ============================================================================

console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('🔬 CASO 4: Análise Comparativa - 3 Empresas')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

const empresas = [
  { nome: 'Startup Tech', receita: 50000, folha: 8000, prolabore: 6000 },
  { nome: 'Agência Mid', receita: 120000, folha: 25000, prolabore: 12000 },
  { nome: 'Enterprise', receita: 300000, folha: 80000, prolabore: 20000 }
]

empresas.forEach(emp => {
  const dados: DadosEmpresa = {
    receitaBruta: emp.receita,
    despesasOperacionais: emp.receita * 0.3,
    folhaAtual: emp.folha,
    prolaboreAtual: emp.prolabore
  }
  
  const res = calcularOtimizacao(dados)
  const fatorR = ((emp.folha + emp.prolabore) / emp.receita * 100).toFixed(1)
  
  console.log(`\n📊 ${emp.nome}`)
  console.log(`   Receita: R$ ${emp.receita.toLocaleString('pt-BR')}`)
  console.log(`   Fator R: ${fatorR}%`)
  console.log(`   Economia potencial/ano: R$ ${res.economiaAnual.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`)
})

// ============================================================================
// 📈 CASO 5: Projeção de Crescimento
// ============================================================================

console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('📈 CASO 5: Projeção de Crescimento - 12 meses')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

let receitaInicial = 80000
const taxaCrescimento = 1.05  // 5% ao mês

console.log('\nMês | Receita    | Fator R Ideal | Economia Anual')
console.log('----+-----------+---------------+----------------')

for (let mes = 1; mes <= 12; mes++) {
  const receita = receitaInicial * Math.pow(taxaCrescimento, mes - 1)
  
  const dados: DadosEmpresa = {
    receitaBruta: receita,
    despesasOperacionais: receita * 0.35,
    folhaAtual: 10000,
    prolaboreAtual: 8000
  }
  
  const res = calcularOtimizacao(dados)
  const proLaboreOtimo = receita * 0.28 - dados.folhaAtual
  
  console.log(
    `${mes.toString().padStart(2, ' ')}  | R$ ${receita.toFixed(0).padStart(7)} | R$ ${proLaboreOtimo.toFixed(0).padStart(9)} | R$ ${res.economiaAnual.toFixed(0).padStart(10)}`
  )
}

console.log('\n💡 Insight: À medida que a receita cresce, o impacto da otimização AUMENTA!')

// ============================================================================
// 🎯 TAKEAWAYS - Lições dos Exemplos
// ============================================================================

console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('🎯 LIÇÕES APRENDIDAS')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

console.log(`
1. 📊 FATOR R É REI
   Se sua folha + pró-labore >= 28% da receita, você fica no Anexo III
   e economiza MUITO em impostos!

2. 💰 NEM SEMPRE VALE AUMENTAR O PRÓ-LABORE
   Em alguns casos (empresas pequenas ou com muitos CLT), compensa
   pagar os 15% de dividendos e ficar no Anexo V.

3. 🎯 CADA EMPRESA É ÚNICA
   Não existe "receita de bolo". Use o SimpliTax para calcular
   o cenário específico da sua empresa!

4. 📈 PLANEJE O CRESCIMENTO
   À medida que a receita sobe, o valor absoluto da economia cresce.
   Uma otimização de 5% em R$ 300k vale muito mais que em R$ 50k!

5. ⚡ AÇÃO RÁPIDA = MAIS ECONOMIA
   Quanto antes ajustar, mais meses de economia você terá em 2026!
`)

// ============================================================================
// 🧪 COMO TESTAR NO SEU PROJETO
// ============================================================================

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('🧪 COMO USAR ESTES EXEMPLOS')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

console.log(`
1. No terminal do projeto:
   npm run dev

2. Acesse: http://localhost:3000/otimizador

3. Digite os dados da sua empresa nos campos

4. Clique em "Calcular Otimização"

5. Veja a mágica acontecer! ✨

Ou, se preferir testar programaticamente:

import { calcularOtimizacao } from '@/engine/otimizador'

const minhaSituacao = {
  receitaBruta: 100000,
  despesasOperacionais: 30000,
  folhaAtual: 15000,
  prolaboreAtual: 5000
}

const resultado = calcularOtimizacao(minhaSituacao)
console.log(resultado.recomendacao)
console.log('Economia anual:', resultado.economiaAnual)
`)

export {}
