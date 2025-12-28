/**
 * 📚 EXEMPLOS - Dashboard de Saúde Fiscal
 * 
 * Casos práticos de uso do Semáforo de Risco e Relatório de Alívio
 * 
 * @author LMartins (Product Manager) - SimpliTax 2026
 */

import { 
  analisarSaudeFiscal, 
  gerarRelatorioAlivio,
  projetarFatorR12Meses,
  botaoDePanico,
  DadosSaudeFiscal 
} from './saudeFiscal'

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('🚦 EXEMPLOS: DASHBOARD DE SAÚDE FISCAL')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

// ============================================================================
// 🟢 CASO 1: Empresa Saudável (Verde)
// ============================================================================

console.log('\n\n┌─────────────────────────────────────────────┐')
console.log('│ 🟢 CASO 1: Software House (Saúde Plena)   │')
console.log('└─────────────────────────────────────────────┘')

const empresaSaudavel: DadosSaudeFiscal = {
  receitaBrutaMensal: 100000,
  folhaPagamento: 18000,
  proLaboreAtual: 10000  // Fator R: 28%
}

const statusVerde = analisarSaudeFiscal(empresaSaudavel)

console.log('\n📊 Análise:')
console.log(`Status: ${statusVerde.status.toUpperCase()}`)
console.log(`Fator R: ${(statusVerde.fatorR * 100).toFixed(1)}%`)
console.log(`Anexo: ${statusVerde.anexo}`)
console.log(`Título: ${statusVerde.titulo}`)
console.log(`\nMensagem: ${statusVerde.mensagem}`)

console.log('\n✅ Recomendações:')
statusVerde.recomendacoes.forEach((rec, i) => {
  console.log(`${i + 1}. ${rec}`)
})

// ============================================================================
// 🟡 CASO 2: Empresa em Atenção (Amarelo)
// ============================================================================

console.log('\n\n┌─────────────────────────────────────────────┐')
console.log('│ 🟡 CASO 2: Consultoria (Oportunidade)     │')
console.log('└─────────────────────────────────────────────┘')

const empresaAtencao: DadosSaudeFiscal = {
  receitaBrutaMensal: 80000,
  folhaPagamento: 12000,
  proLaboreAtual: 8000  // Fator R: 25%
}

const statusAmarelo = analisarSaudeFiscal(empresaAtencao)

console.log('\n📊 Análise:')
console.log(`Status: ${statusAmarelo.status.toUpperCase()}`)
console.log(`Fator R: ${(statusAmarelo.fatorR * 100).toFixed(1)}%`)
console.log(`Economia Potencial: R$ ${statusAmarelo.economiaPotencial.toFixed(2)}/mês`)
console.log(`Ajuste Necessário: R$ ${statusAmarelo.ajusteNecessario.toFixed(2)}`)

console.log('\n💡 Recomendações:')
statusAmarelo.recomendacoes.forEach((rec, i) => {
  console.log(`${i + 1}. ${rec}`)
})

// Verificar botão de pânico
const panico = botaoDePanico(empresaAtencao)
console.log(`\n⚠️ Botão de Pânico:`)
console.log(`Precisa agir: ${panico.precisaAgir ? 'SIM' : 'NÃO'}`)
console.log(`Urgência: ${panico.urgencia.toUpperCase()}`)
console.log(`Mensagem: ${panico.mensagemAlerta}`)

// ============================================================================
// 🔴 CASO 3: Empresa em Risco (Vermelho)
// ============================================================================

console.log('\n\n┌─────────────────────────────────────────────┐')
console.log('│ 🔴 CASO 3: Agência Marketing (RISCO!)     │')
console.log('└─────────────────────────────────────────────┘')

const empresaRisco: DadosSaudeFiscal = {
  receitaBrutaMensal: 150000,
  folhaPagamento: 8000,
  proLaboreAtual: 4000  // Fator R: 8% (CRÍTICO!)
}

const statusVermelho = analisarSaudeFiscal(empresaRisco)

console.log('\n📊 Análise:')
console.log(`Status: 🚨 ${statusVermelho.status.toUpperCase()} 🚨`)
console.log(`Fator R: ${(statusVermelho.fatorR * 100).toFixed(1)}% (Muito abaixo!)`)
console.log(`Anexo: ${statusVermelho.anexo} (CARO!)`)
console.log(`Economia Potencial: R$ ${statusVermelho.economiaPotencial.toFixed(2)}/mês`)
console.log(`Ajuste Necessário: R$ ${statusVermelho.ajusteNecessario.toFixed(2)}`)

console.log('\n🚨 Ação Urgente Necessária!')
statusVermelho.recomendacoes.forEach((rec, i) => {
  console.log(`${i + 1}. ${rec}`)
})

const panicoAlto = botaoDePanico(empresaRisco)
console.log(`\n🔴 ALERTA CRÍTICO:`)
console.log(panicoAlto.mensagemAlerta)
console.log(`Prazo: ${panicoAlto.prazoAcao}`)

// ============================================================================
// 💬 CASO 4: Relatório de Alívio (WhatsApp)
// ============================================================================

console.log('\n\n┌─────────────────────────────────────────────┐')
console.log('│ 💬 CASO 4: Relatório de Alívio            │')
console.log('└─────────────────────────────────────────────┘')

const dadosAntigos: DadosSaudeFiscal = {
  receitaBrutaMensal: 100000,
  folhaPagamento: 15000,
  proLaboreAtual: 5000  // 20% - Anexo V
}

const dadosOtimizados: DadosSaudeFiscal = {
  receitaBrutaMensal: 100000,
  folhaPagamento: 15000,
  proLaboreAtual: 13000  // 28% - Anexo III
}

const relatorio = gerarRelatorioAlivio('Maria Silva', dadosAntigos, dadosOtimizados)

console.log('\n💰 Economia Obtida:')
console.log(`Mensal: R$ ${relatorio.economiaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`)
console.log(`Anual: R$ ${relatorio.economiaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`)

console.log('\n🔧 Ajuste Realizado:')
console.log(`Tipo: ${relatorio.ajusteRealizado.tipo}`)
console.log(`De: R$ ${relatorio.ajusteRealizado.valorAntigo.toLocaleString('pt-BR')}`)
console.log(`Para: R$ ${relatorio.ajusteRealizado.valorNovo.toLocaleString('pt-BR')}`)
console.log(`Diferença: R$ ${relatorio.ajusteRealizado.diferenca.toLocaleString('pt-BR')}`)

console.log('\n📱 Mensagem para WhatsApp:')
console.log('─────────────────────────────────────────────')
console.log(relatorio.mensagemWhatsApp)
console.log('─────────────────────────────────────────────')

// ============================================================================
// 📈 CASO 5: Projeção de 12 Meses
// ============================================================================

console.log('\n\n┌─────────────────────────────────────────────┐')
console.log('│ 📈 CASO 5: Projeção com Crescimento       │')
console.log('└─────────────────────────────────────────────┘')

const projecao = projetarFatorR12Meses(
  80000,   // Receita inicial
  12000,   // Folha
  8000,    // Pró-labore
  0.05     // 5% de crescimento mensal
)

console.log('\n📊 Projeção de Fator R (crescimento 5% a.m.):')
console.log('\nMês | Receita    | Folha   | Fator R | Status')
console.log('────┼────────────┼─────────┼─────────┼────────')

projecao.forEach(mes => {
  const statusIcon = 
    mes.status === 'verde' ? '🟢' :
    mes.status === 'amarelo' ? '🟡' : '🔴'
  
  console.log(
    `${mes.mes.toString().padStart(2)} | ` +
    `R$ ${mes.receita.toFixed(0).padStart(7)} | ` +
    `R$ ${mes.folha.toFixed(0).padStart(5)} | ` +
    `${(mes.fatorR * 100).toFixed(1)}%  | ${statusIcon} ${mes.status}`
  )
})

console.log('\n⚠️ Observação: Conforme a receita cresce, o Fator R diminui!')
console.log('💡 Solução: Aumentar proporcionalmente a folha de pagamento.')

// ============================================================================
// 🎯 ANÁLISE COMPARATIVA
// ============================================================================

console.log('\n\n┌─────────────────────────────────────────────┐')
console.log('│ 🎯 CASO 6: Análise Comparativa            │')
console.log('└─────────────────────────────────────────────┘')

const empresas = [
  { nome: 'Startup Tech', dados: { receitaBrutaMensal: 50000, folhaPagamento: 8000, proLaboreAtual: 6000 } },
  { nome: 'Agência Média', dados: { receitaBrutaMensal: 120000, folhaPagamento: 20000, proLaboreAtual: 15000 } },
  { nome: 'Consultoria', dados: { receitaBrutaMensal: 200000, folhaPagamento: 40000, proLaboreAtual: 20000 } }
]

console.log('\n📊 Comparação de 3 Empresas:')
console.log('\nEmpresa          | Fator R | Anexo | Status    | Economia/mês')
console.log('─────────────────┼─────────┼───────┼───────────┼──────────────')

empresas.forEach(emp => {
  const status = analisarSaudeFiscal(emp.dados)
  const statusIcon = 
    status.status === 'verde' ? '🟢' :
    status.status === 'amarelo' ? '🟡' : '🔴'
  
  console.log(
    `${emp.nome.padEnd(16)} | ` +
    `${(status.fatorR * 100).toFixed(1)}%  | ` +
    `${status.anexo.padEnd(5)} | ` +
    `${statusIcon} ${status.status.padEnd(7)} | ` +
    `R$ ${status.economiaPotencial.toFixed(2)}`
  )
})

// ============================================================================
// 🎓 LIÇÕES APRENDIDAS
// ============================================================================

console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('🎓 LIÇÕES DO DASHBOARD DE SAÚDE FISCAL')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

console.log(`
1. 🚦 SEMÁFORO VISUAL = DECISÃO RÁPIDA
   Cores (verde/amarelo/vermelho) permitem decisão instantânea
   sem precisar analisar números complexos.

2. 💬 RELATÓRIO DE ALÍVIO = CLIENTE FELIZ
   Traduzir economia em mensagem WhatsApp = diferencial competitivo.
   Cliente quer saber: "Economizei quanto?" não "Qual meu Fator R?".

3. 🚨 BOTÃO DE PÂNICO = AÇÃO IMEDIATA
   Alertas com prazo claro evitam perdas desnecessárias.
   "Até final do mês" é melhor que "urgente".

4. 📈 PROJEÇÃO = PREVENÇÃO
   Mostrar o futuro (12 meses) evita surpresas desagradáveis.
   Crescimento de receita = diminuição de Fator R!

5. 🎯 COMPARE E APRENDA
   Analisar múltiplas empresas mostra padrões.
   Nem sempre "mais receita" = "melhor situação fiscal".
`)

// ============================================================================
// 🧪 COMO USAR NO SEU CÓDIGO
// ============================================================================

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('🧪 EXEMPLO DE USO EM COMPONENTE REACT')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

console.log(`
// 1. No seu componente Dashboard:
import { analisarSaudeFiscal } from '@/engine/saudeFiscal'
import Semaforo from '@/components/Semaforo'

const dados = {
  receitaBrutaMensal: 100000,
  folhaPagamento: 15000,
  proLaboreAtual: 5000
}

const status = analisarSaudeFiscal(dados)

return (
  <Semaforo 
    fatorR={status.fatorR}
    economiaPotencial={status.economiaPotencial}
    receitaBruta={dados.receitaBrutaMensal}
    folhaAtual={dados.folhaPagamento + dados.proLaboreAtual}
  />
)

// 2. Para gerar Relatório de Alívio:
import { gerarRelatorioAlivio } from '@/engine/saudeFiscal'

const relatorio = gerarRelatorioAlivio(
  'João Silva',
  dadosAntigos,
  dadosNovos
)

// Copiar para clipboard
navigator.clipboard.writeText(relatorio.mensagemWhatsApp)

// Ou abrir WhatsApp direto
const encoded = encodeURIComponent(relatorio.mensagemWhatsApp)
window.open(\`https://wa.me/?text=\${encoded}\`, '_blank')
`)

export {}
