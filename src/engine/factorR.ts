/**
 * Monitor do Fator R - Folha de Pagamento
 * 
 * Implementa o "Botão de Pânico" mencionado pela LMartins:
 * Monitora os últimos 12 meses e alerta quando o Fator R está em risco.
 * 
 * 📚 IMPORTANTE - COMPOSIÇÃO DO FATOR R:
 * 
 * Fator R = (Folha de Pagamento Total) / (Receita Bruta)
 * 
 * Onde "Folha de Pagamento Total" INCLUI:
 * ✅ Salários de empregados CLT
 * ✅ Pró-labore dos sócios (SIM, entra no cálculo!)
 * ✅ Encargos sociais (FGTS, INSS Patronal)
 * ✅ 13º salário, férias, etc.
 * 
 * 💡 ATENÇÃO: No SimpliTax, usamos:
 * - folhaPagamento = Folha dos empregados apenas
 * - proLabore = Retirada dos sócios
 * - Fator R = (folhaPagamento + proLabore) / receitaBruta
 * 
 * Esta separação ajuda a visualizar melhor os ajustes necessários!
 */

import { ALIQUOTAS_2026, determinarAnexoSimples } from './regras2026'

export interface DadosMensais {
  mes: string
  receitaBruta: number
  folhaPagamento: number
}

export interface ResultadoFatorR {
  fatorR: number
  anexo: 'III' | 'V'
  status: 'seguro' | 'atencao' | 'critico'
  mensagem: string
  ajusteNecessario?: number
}

/**
 * Calcula o Fator R
 * Fator R = (Folha de Pagamento últimos 12 meses) / (Receita Bruta últimos 12 meses)
 */
export function calcularFatorR(dados: DadosMensais[]): number {
  const totalReceita = dados.reduce((sum, d) => sum + d.receitaBruta, 0)
  const totalFolha = dados.reduce((sum, d) => sum + d.folhaPagamento, 0)
  
  if (totalReceita === 0) return 0
  
  return totalFolha / totalReceita
}

/**
 * Analisa o Fator R e retorna status com recomendações
 */
export function analisarFatorR(dados: DadosMensais[]): ResultadoFatorR {
  const fatorR = calcularFatorR(dados)
  const anexo = determinarAnexoSimples(fatorR)
  
  // Calcula totais
  const totalReceita = dados.reduce((sum, d) => sum + d.receitaBruta, 0)
  const totalFolha = dados.reduce((sum, d) => sum + d.folhaPagamento, 0)
  
  // Determina status
  let status: 'seguro' | 'atencao' | 'critico'
  let mensagem: string
  let ajusteNecessario: number | undefined
  
  if (fatorR >= ALIQUOTAS_2026.fatorR.minimoAnexoIII) {
    status = 'seguro'
    mensagem = `Parabéns! Sua empresa está no Anexo III com Fator R de ${(fatorR * 100).toFixed(1)}%.`
  } else if (fatorR >= ALIQUOTAS_2026.fatorR.limiteAtencao) {
    status = 'atencao'
    const folhaNecessaria = totalReceita * ALIQUOTAS_2026.fatorR.minimoAnexoIII
    ajusteNecessario = folhaNecessaria - totalFolha
    mensagem = `Atenção! Seu Fator R está em ${(fatorR * 100).toFixed(1)}%. ` +
               `Aumente sua folha em R$ ${ajusteNecessario.toFixed(2)} para garantir o Anexo III.`
  } else {
    status = 'critico'
    const folhaNecessaria = totalReceita * ALIQUOTAS_2026.fatorR.minimoAnexoIII
    ajusteNecessario = folhaNecessaria - totalFolha
    mensagem = `⚠️ ALERTA! Fator R em ${(fatorR * 100).toFixed(1)}%. ` +
               `Você está no Anexo V (impostos mais altos). ` +
               `Aumente sua folha em R$ ${ajusteNecessario.toFixed(2)} para economizar!`
  }
  
  return {
    fatorR,
    anexo,
    status,
    mensagem,
    ajusteNecessario
  }
}

/**
 * Simula o impacto de aumentar a folha de pagamento
 */
export function simularAumentoFolha(
  dadosAtuais: DadosMensais[],
  aumentoMensal: number
): ResultadoFatorR {
  const dadosSimulados = dadosAtuais.map(d => ({
    ...d,
    folhaPagamento: d.folhaPagamento + aumentoMensal
  }))
  
  return analisarFatorR(dadosSimulados)
}

/**
 * Calcula quanto precisa aumentar a folha para atingir Fator R mínimo
 */
export function calcularAumentoNecessario(dados: DadosMensais[]): number {
  const totalReceita = dados.reduce((sum, d) => sum + d.receitaBruta, 0)
  const totalFolhaAtual = dados.reduce((sum, d) => sum + d.folhaPagamento, 0)
  const folhaNecessaria = totalReceita * ALIQUOTAS_2026.fatorR.minimoAnexoIII
  
  return Math.max(0, folhaNecessaria - totalFolhaAtual)
}

/**
 * "Botão de Pânico" - Alerta mensal
 * Analisa se a empresa precisa agir imediatamente
 */
export function botaoPanico(dados: DadosMensais[]): {
  precisaAgir: boolean
  urgencia: 'baixa' | 'media' | 'alta'
  acaoSugerida: string
  impactoFinanceiro?: number
} {
  const resultado = analisarFatorR(dados)
  
  if (resultado.status === 'critico') {
    return {
      precisaAgir: true,
      urgencia: 'alta',
      acaoSugerida: resultado.mensagem,
      impactoFinanceiro: resultado.ajusteNecessario
    }
  }
  
  if (resultado.status === 'atencao') {
    return {
      precisaAgir: true,
      urgencia: 'media',
      acaoSugerida: resultado.mensagem,
      impactoFinanceiro: resultado.ajusteNecessario
    }
  }
  
  return {
    precisaAgir: false,
    urgencia: 'baixa',
    acaoSugerida: 'Continue monitorando mensalmente seu Fator R.'
  }
}
