/**
 * Calculadora de Ponto de Equilíbrio - Break-even
 * 
 * Calcula se vale mais pagar Pró-labore (com IR e INSS) ou Dividendos (com nova taxa)
 */

import { ALIQUOTAS_2026, calcularAliquotaDividendos } from './regras2026'

export interface ResultadoCalculo {
  proLabore: {
    valor: number
    irrf: number
    inss: number
    custoTotal: number
    liquidoParaSocio: number
  }
  dividendos: {
    valor: number
    imposto: number
    custoTotal: number
    liquidoParaSocio: number
  }
  lucroLiquido: number
  economia: number
  recomendacao: 'proLabore' | 'dividendos' | 'misto'
}

/**
 * Calcula IR sobre Pró-labore
 */
function calcularIRProLabore(valor: number): number {
  for (const faixa of ALIQUOTAS_2026.irrf) {
    if (valor <= faixa.ate) {
      return Math.max(0, valor * faixa.aliquota - faixa.deducao)
    }
  }
  return 0
}

/**
 * Calcula INSS sobre Pró-labore
 */
function calcularINSSProLabore(valor: number): number {
  const baseCalculo = Math.min(valor, ALIQUOTAS_2026.inss.teto)
  return baseCalculo * ALIQUOTAS_2026.inss.aliquota
}

/**
 * Calcula o equilíbrio entre Pró-labore e Dividendos
 */
export function calcularEquilibrio(
  valorProLabore: number,
  lucroContabil: number
): ResultadoCalculo {
  // Cálculo do Pró-labore
  const irrf = calcularIRProLabore(valorProLabore)
  const inss = calcularINSSProLabore(valorProLabore)
  const custoTotalProLabore = irrf + inss
  const liquidoProLabore = valorProLabore - custoTotalProLabore

  // Cálculo dos Dividendos (sobre o lucro que sobrou)
  const lucroAposProlabore = lucroContabil - valorProLabore
  const aliquotaDividendos = calcularAliquotaDividendos(lucroAposProlabore)
  const impostoDividendos = lucroAposProlabore * aliquotaDividendos
  const liquidoDividendos = lucroAposProlabore - impostoDividendos

  // Total líquido para o sócio
  const lucroLiquido = liquidoProLabore + liquidoDividendos

  // Cenário alternativo: Tudo como dividendo
  const impostoTotalDividendos = lucroContabil * calcularAliquotaDividendos(lucroContabil)
  const liquidoTotalDividendos = lucroContabil - impostoTotalDividendos

  // Economia
  const economia = lucroLiquido - liquidoTotalDividendos

  // Recomendação
  let recomendacao: 'proLabore' | 'dividendos' | 'misto'
  if (economia > 1000) {
    recomendacao = 'misto'
  } else if (economia < -1000) {
    recomendacao = 'dividendos'
  } else {
    recomendacao = 'proLabore'
  }

  return {
    proLabore: {
      valor: valorProLabore,
      irrf,
      inss,
      custoTotal: custoTotalProLabore,
      liquidoParaSocio: liquidoProLabore
    },
    dividendos: {
      valor: lucroAposProlabore,
      imposto: impostoDividendos,
      custoTotal: impostoDividendos,
      liquidoParaSocio: liquidoDividendos
    },
    lucroLiquido,
    economia,
    recomendacao
  }
}

/**
 * Calcula o ponto ótimo de Pró-labore
 * (Função de otimização que testa diferentes valores)
 */
export function calcularPontoOtimo(
  lucroContabil: number,
  passos: number = 20
): { valorOtimo: number; resultado: ResultadoCalculo } {
  let melhorValor = 0
  let melhorResultado: ResultadoCalculo | null = null
  let maiorLucroLiquido = 0

  const incremento = lucroContabil / passos

  for (let proLabore = 0; proLabore <= lucroContabil; proLabore += incremento) {
    const resultado = calcularEquilibrio(proLabore, lucroContabil)
    
    if (resultado.lucroLiquido > maiorLucroLiquido) {
      maiorLucroLiquido = resultado.lucroLiquido
      melhorValor = proLabore
      melhorResultado = resultado
    }
  }

  return {
    valorOtimo: melhorValor,
    resultado: melhorResultado!
  }
}
