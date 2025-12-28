/**
 * 🧪 TESTE DO OTIMIZADOR - Validar correção do bug
 * 
 * Testa o cenário reportado pelo usuário:
 * - Receita: 100.000
 * - Despesas: 30.000
 * - Folha: 280.000 (já 280% da receita!)
 * - Pró-labore: 5.000
 * 
 * Resultado esperado: Sistema deve reconhecer que Fator R já está OK (285%)
 */

// Simular imports (adaptar paths conforme necessário)
const { calcularOtimizacao } = require('./src/engine/otimizador')

console.log('🧪 TESTE: Cenário com Folha Muito Alta\n')
console.log('═'.repeat(60))

const dadosTeste = {
  receitaBruta: 100000,
  despesasOperacionais: 30000,
  folhaAtual: 280000,  // 280% da receita!
  prolaboreAtual: 5000
}

console.log('\n📊 DADOS DE ENTRADA:')
console.log(`   Receita Bruta: R$ ${dadosTeste.receitaBruta.toLocaleString('pt-BR')}`)
console.log(`   Despesas: R$ ${dadosTeste.despesasOperacionais.toLocaleString('pt-BR')}`)
console.log(`   Folha Atual: R$ ${dadosTeste.folhaAtual.toLocaleString('pt-BR')}`)
console.log(`   Pró-labore: R$ ${dadosTeste.prolaboreAtual.toLocaleString('pt-BR')}`)

const folhaTotal = dadosTeste.folhaAtual + dadosTeste.prolaboreAtual
const fatorRAtual = (folhaTotal / dadosTeste.receitaBruta) * 100

console.log(`\n📈 ANÁLISE:`)
console.log(`   Folha Total: R$ ${folhaTotal.toLocaleString('pt-BR')}`)
console.log(`   Fator R Atual: ${fatorRAtual.toFixed(1)}%`)
console.log(`   Fator R Mínimo: 28%`)
console.log(`   Status: ${fatorRAtual >= 28 ? '✅ JÁ ADEQUADO' : '❌ PRECISA AJUSTAR'}`)

try {
  const resultado = calcularOtimizacao(dadosTeste)
  
  console.log('\n═'.repeat(60))
  console.log('🏆 RESULTADO DO OTIMIZADOR:\n')
  console.log(resultado.recomendacao)
  console.log('\n💰 Economia Anual:', resultado.economiaAnual.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }))
  
  console.log('\n📋 AÇÕES RECOMENDADAS:')
  resultado.acoes.forEach((acao, i) => {
    console.log(`   ${i + 1}. ${acao}`)
  })
  
  console.log('\n═'.repeat(60))
  console.log('✅ TESTE CONCLUÍDO')
  
  // Validação
  if (fatorRAtual >= 28) {
    if (resultado.recomendacao.includes('PARABÉNS') || resultado.recomendacao.includes('Continue')) {
      console.log('✅ CORREÇÃO BEM-SUCEDIDA: Sistema reconheceu que folha já está adequada!')
    } else {
      console.log('❌ ERRO: Sistema ainda recomenda ajuste quando não deveria!')
    }
  }
  
} catch (erro) {
  console.error('\n❌ ERRO NO TESTE:', erro.message)
  console.error(erro)
}
