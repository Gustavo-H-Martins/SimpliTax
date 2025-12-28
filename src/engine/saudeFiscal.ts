/**
 * 🚦 ANALISADOR DE SAÚDE FISCAL - Dashboard Inteligente
 * 
 * Módulo complementar ao Otimizador que fornece análise visual
 * para o Semáforo de Risco e gera relatórios amigáveis.
 * 
 * 💡 Funcionalidades:
 * - Análise de saúde fiscal em tempo real
 * - Cálculo de ajustes necessários
 * - Geração do "Relatório de Alívio" para WhatsApp
 * 
 * @author LMartins (Product Manager) - SimpliTax 2026
 */

import { ALIQUOTAS_2026, determinarAnexoSimples } from './regras2026'
import { calcularOtimizacao } from './otimizador'

// ============================================================================
// 📊 INTERFACES
// ============================================================================

export interface DadosSaudeFiscal {
  receitaBrutaMensal: number
  despesasOperacionais?: number  // Necessário para calcular dividendos
  folhaPagamento: number
  proLaboreAtual: number
  dividendosDistribuidos?: number
}

export interface StatusSaudeFiscal {
  fatorR: number
  anexo: 'III' | 'V'
  status: 'verde' | 'amarelo' | 'vermelho'
  titulo: string
  mensagem: string
  economiaPotencial: number
  ajusteNecessario: number
  recomendacoes: string[]
}

export interface RelatorioAlivio {
  mensagemWhatsApp: string
  resumoTecnico: string
  economiaMensal: number
  economiaAnual: number
  ajusteRealizado: {
    tipo: 'proLabore' | 'folha' | 'nenhum'
    valorAntigo: number
    valorNovo: number
    diferenca: number
  }
}

// ============================================================================
// 🔍 ANÁLISE DE SAÚDE FISCAL
// ============================================================================

/**
 * 💊 CHECKUP FISCAL COMPLETO
 * 
 * Analisa a saúde fiscal da empresa e retorna status para o Semáforo
 * 
 * 🆕 Usa o otimizador real para determinar se vale a pena ajustar o Fator R
 * considerando a isenção de R$ 50k/mês nos dividendos (PL 1.087/2025)
 */
export function analisarSaudeFiscal(dados: DadosSaudeFiscal): StatusSaudeFiscal {
  const { receitaBrutaMensal, despesasOperacionais, folhaPagamento, proLaboreAtual } = dados
  
  // 📚 Cálculo do Fator R CORRETO:
  // Folha Total = Empregados CLT + Pró-labore dos Sócios
  // (Conforme LC 123/2006 - Simples Nacional)
  const folhaTotal = folhaPagamento + proLaboreAtual
  const fatorR = folhaTotal / receitaBrutaMensal
  const anexo = determinarAnexoSimples(fatorR)
  
  // 🆕 Usar o otimizador real para comparar cenários
  const despesas = despesasOperacionais || receitaBrutaMensal * 0.3 // Default 30%
  const resultado = calcularOtimizacao({
    receitaBruta: receitaBrutaMensal,
    despesasOperacionais: despesas,
    folhaAtual: folhaPagamento,
    prolaboreAtual: proLaboreAtual
  })
  
  // Calcular quanto falta para 28%
  const folhaNecessaria = receitaBrutaMensal * ALIQUOTAS_2026.fatorR.minimoAnexoIII
  const ajusteNecessario = Math.max(0, folhaNecessaria - folhaTotal)
  
  // Economia real vem do otimizador (pode ser negativa!)
  const economiaAnual = resultado.economiaAnual
  const economiaMensal = economiaAnual / 12
  
  // 🟢 VERDE: Já está ótimo (Fator R >= 28% OU cenário atual melhor)
  if (fatorR >= ALIQUOTAS_2026.fatorR.minimoAnexoIII || economiaAnual <= 0) {
    // Se economia <= 0, significa que não vale a pena otimizar!
    const motivoVerde = fatorR >= ALIQUOTAS_2026.fatorR.minimoAnexoIII
      ? `Com Fator R de ${(fatorR * 100).toFixed(1)}%, você está no Anexo III.`
      : `Seu cenário atual já é o melhor! Com dividendos isentos, não vale a pena aumentar a folha.`
    
    return {
      fatorR,
      anexo,
      status: 'verde',
      titulo: 'Eficiência Máxima!',
      mensagem: `Parabéns! ${motivoVerde}`,
      economiaPotencial: 0,
      ajusteNecessario: 0,
      recomendacoes: resultado.recomendacao.includes('PARABÉNS')
        ? resultado.acoes
        : [
          'Continue monitorando mensalmente seu Fator R',
          'Mantenha a configuração atual (já está ótima)',
          'Dividendos isentos até R$ 50.000/mês'
        ]
    }
  }
  
  // 🟡 AMARELO: Atenção/Oportunidade (economia moderada)
  if (fatorR >= ALIQUOTAS_2026.fatorR.limiteAtencao && economiaAnual < 30000) {
    return {
      fatorR,
      anexo,
      status: 'amarelo',
      titulo: 'Atenção: Oportunidade de Economia!',
      mensagem: `Seu Fator R está em ${(fatorR * 100).toFixed(1)}%, próximo do limite. Um ajuste pode gerar economia de R$ ${Math.abs(economiaMensal).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês!`,
      economiaPotencial: Math.abs(economiaMensal),
      ajusteNecessario,
      recomendacoes: resultado.acoes
    }
  }
  
  // 🔴 VERMELHO: Risco Crítico (economia significativa possível)
  return {
    fatorR,
    anexo,
    status: 'vermelho',
    titulo: '⚠️ ALERTA: Perda de Dinheiro!',
    mensagem: resultado.recomendacao.includes('AUMENTE')
      ? `Fator R crítico em ${(fatorR * 100).toFixed(1)}%! ${resultado.recomendacao}`
      : `Fator R em ${(fatorR * 100).toFixed(1)}%. Você pode economizar R$ ${Math.abs(economiaMensal).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês!`,
    economiaPotencial: Math.abs(economiaMensal),
    ajusteNecessario,
    recomendacoes: resultado.acoes
  }
}

/**
 * 💰 CALCULAR ECONOMIA POTENCIAL
 * 
 * Estima quanto a empresa economizaria ao ajustar o Fator R para 28%
 */
function calcularEconomiaPotencial(
  receitaBruta: number,
  fatorRAtual: number,
  ajusteNecessario: number
): number {
  // Se já está no Anexo III, não há economia a fazer
  if (fatorRAtual >= ALIQUOTAS_2026.fatorR.minimoAnexoIII) {
    return 0
  }
  
  // Simplificação: diferença de alíquota entre Anexo V e III
  // Anexo III médio: ~13% | Anexo V médio: ~18%
  const diferencaAliquota = 0.05  // 5% de diferença
  
  // Economia nos impostos da empresa
  const economiaImpostos = receitaBruta * diferencaAliquota
  
  // Custo do ajuste (INSS + IR sobre o Pró-labore adicional)
  const custoAjuste = ajusteNecessario * 0.26  // ~26% de encargos
  
  // Economia líquida
  return Math.max(0, economiaImpostos - custoAjuste)
}

// ============================================================================
// 📱 RELATÓRIO DE ALÍVIO (Para WhatsApp)
// ============================================================================

/**
 * 💬 GERADOR DO "RELATÓRIO DE ALÍVIO"
 * 
 * A joia da coroa! Gera uma mensagem amigável para o contador
 * enviar ao cliente explicando a economia de forma ULTRA SIMPLES.
 * 
 * 💡 Dica da LMartins: O cliente não quer números complexos,
 * ele quer saber: "Economizei quanto?" e "O que você fez?"
 */
export function gerarRelatorioAlivio(
  nomeCliente: string,
  dadosAntigos: DadosSaudeFiscal,
  dadosNovos: DadosSaudeFiscal
): RelatorioAlivio {
  // Análise antes e depois
  const statusAntigo = analisarSaudeFiscal(dadosAntigos)
  const statusNovo = analisarSaudeFiscal(dadosNovos)
  
  // Calcular economia
  const economiaMensal = statusAntigo.economiaPotencial
  const economiaAnual = economiaMensal * 12
  
  // Determinar que tipo de ajuste foi feito
  const ajuste = {
    tipo: dadosNovos.proLaboreAtual !== dadosAntigos.proLaboreAtual 
      ? 'proLabore' as const
      : dadosNovos.folhaPagamento !== dadosAntigos.folhaPagamento
        ? 'folha' as const
        : 'nenhum' as const,
    valorAntigo: dadosAntigos.proLaboreAtual,
    valorNovo: dadosNovos.proLaboreAtual,
    diferenca: dadosNovos.proLaboreAtual - dadosAntigos.proLaboreAtual
  }
  
  // 💬 MENSAGEM PARA WHATSAPP (Tom super amigável!)
  let mensagemWhatsApp = ''
  
  if (statusNovo.status === 'verde' && statusAntigo.status !== 'verde') {
    // Sucesso! Conseguimos otimizar
    mensagemWhatsApp = `
Oi ${nomeCliente}! 😊

Tenho uma notícia ÓTIMA! 🎉

Fizemos uma análise tributária aqui no SimpliTax e encontramos uma oportunidade de economia para 2026.

✅ **O que fizemos:**
Ajustamos seu Pró-labore de R$ ${dadosAntigos.proLaboreAtual.toLocaleString('pt-BR')} para R$ ${dadosNovos.proLaboreAtual.toLocaleString('pt-BR')}.

💰 **Resultado:**
Com isso, evitamos que você pagasse R$ ${economiaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} A MAIS de imposto este mês!

No ano, isso representa uma economia de R$ ${economiaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}! 🚀

Agora sua empresa está no Anexo III do Simples Nacional (o mais vantajoso) e você pode distribuir dividendos tranquilamente.

Qualquer dúvida, é só chamar! 👍
    `.trim()
  } else if (statusNovo.status === 'verde') {
    // Já estava bom, apenas confirmação
    mensagemWhatsApp = `
Oi ${nomeCliente}! 😊

Fiz a análise tributária mensal aqui no SimpliTax.

✅ **Tudo certo!**
Sua empresa continua no Anexo III (a faixa mais econômica) com Fator R de ${(statusNovo.fatorR * 100).toFixed(1)}%.

Não precisa fazer ajustes este mês. Continue assim! 👍

💡 Vou monitorar mensalmente para garantir que você sempre pague o mínimo necessário de impostos.
    `.trim()
  } else {
    // Ainda precisa ajustar
    mensagemWhatsApp = `
Oi ${nomeCliente}! 😊

Fiz a análise tributária aqui no SimpliTax e identifiquei uma oportunidade.

⚠️ **Situação atual:**
Seu Fator R está em ${(statusNovo.fatorR * 100).toFixed(1)}%, colocando a empresa no Anexo V (impostos mais altos).

💡 **Recomendação:**
Aumentando seu Pró-labore em R$ ${statusNovo.ajusteNecessario.toLocaleString('pt-BR')}, você economizaria R$ ${statusNovo.economiaPotencial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por mês!

Vamos conversar sobre isso? É literalmente dinheiro deixado na mesa! 💰

Me chama quando puder! 👍
    `.trim()
  }
  
  // 📄 RESUMO TÉCNICO (Para o contador)
  const resumoTecnico = `
=== RELATÓRIO TÉCNICO DE OTIMIZAÇÃO ===

CLIENTE: ${nomeCliente}
DATA: ${new Date().toLocaleDateString('pt-BR')}

STATUS ANTERIOR:
- Fator R: ${(statusAntigo.fatorR * 100).toFixed(2)}%
- Anexo: ${statusAntigo.anexo}
- Pró-labore: R$ ${dadosAntigos.proLaboreAtual.toLocaleString('pt-BR')}

STATUS ATUAL:
- Fator R: ${(statusNovo.fatorR * 100).toFixed(2)}%
- Anexo: ${statusNovo.anexo}
- Pró-labore: R$ ${dadosNovos.proLaboreAtual.toLocaleString('pt-BR')}

AJUSTE REALIZADO:
- Tipo: ${ajuste.tipo}
- Valor: R$ ${ajuste.diferenca.toLocaleString('pt-BR')}

ECONOMIA OBTIDA:
- Mensal: R$ ${economiaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Anual: R$ ${economiaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

RECOMENDAÇÕES:
${statusNovo.recomendacoes.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Gerado por: SimpliTax 2026 - Dashboard de Saúde Fiscal
  `.trim()
  
  return {
    mensagemWhatsApp,
    resumoTecnico,
    economiaMensal,
    economiaAnual,
    ajusteRealizado: ajuste
  }
}

// ============================================================================
// 📊 MONITOR DE 12 MESES (Previsão)
// ============================================================================

/**
 * 📈 PROJEÇÃO DE FATOR R
 * 
 * Calcula como o Fator R vai evoluir nos próximos 12 meses
 * se a empresa continuar com os valores atuais
 */
export function projetarFatorR12Meses(
  receitaMensalMedia: number,
  folhaAtual: number,
  proLaboreAtual: number,
  crescimentoReceita: number = 0  // % de crescimento mensal (ex: 0.05 = 5%)
): Array<{
  mes: number
  receita: number
  folha: number
  fatorR: number
  status: 'verde' | 'amarelo' | 'vermelho'
}> {
  const projecao = []
  
  for (let mes = 1; mes <= 12; mes++) {
    const receita = receitaMensalMedia * Math.pow(1 + crescimentoReceita, mes - 1)
    const folhaTotal = folhaAtual + proLaboreAtual
    const fatorR = folhaTotal / receita
    
    let status: 'verde' | 'amarelo' | 'vermelho'
    if (fatorR >= 0.28) status = 'verde'
    else if (fatorR >= 0.24) status = 'amarelo'
    else status = 'vermelho'
    
    projecao.push({
      mes,
      receita,
      folha: folhaTotal,
      fatorR,
      status
    })
  }
  
  return projecao
}

/**
 * 🚨 BOTÃO DE PÂNICO
 * 
 * Versão simplificada da Dica de Ouro 1:
 * Verifica se é necessário agir IMEDIATAMENTE
 */
export function botaoDePanico(dados: DadosSaudeFiscal): {
  precisaAgir: boolean
  urgencia: 'baixa' | 'media' | 'alta'
  mensagemAlerta: string
  prazoAcao: string
} {
  const status = analisarSaudeFiscal(dados)
  
  if (status.status === 'vermelho') {
    return {
      precisaAgir: true,
      urgencia: 'alta',
      mensagemAlerta: `🚨 URGENTE! Se você não aumentar sua folha em R$ ${status.ajusteNecessario.toFixed(2)} este mês, vai perder R$ ${status.economiaPotencial.toFixed(2)} por mês em 2026!`,
      prazoAcao: 'Até o final deste mês'
    }
  }
  
  if (status.status === 'amarelo') {
    return {
      precisaAgir: true,
      urgencia: 'media',
      mensagemAlerta: `⚠️ ATENÇÃO! Ajuste seu Pró-labore nos próximos 30 dias para economizar R$ ${status.economiaPotencial.toFixed(2)} por mês!`,
      prazoAcao: 'Próximos 30 dias'
    }
  }
  
  return {
    precisaAgir: false,
    urgencia: 'baixa',
    mensagemAlerta: '✅ Tudo certo! Continue monitorando mensalmente.',
    prazoAcao: 'Revisão mensal'
  }
}
