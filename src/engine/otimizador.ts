/**
 * 🧮 A EQUAÇÃO DE OURO - Otimizador Tributário SimpliTax 2026
 * 
 * Este é o CÉREBRO do sistema! Aqui decidimos o que vale mais:
 * 💼 Pagar Pró-labore (INSS + IRPF mas mantém Fator R)
 * 💰 Distribuir Dividendos (nova taxação de 15%)
 * 
 * A LÓGICA: Encontrar o menor custo tributário total (Empresa + Sócio)
 * 
 * ⚡ PREMISSAS 2026:
 * 1. Fator R: Folha / Receita >= 28% → Anexo III (MAIS BARATO!)
 * 2. Dividendos: Taxação de 15% (a nova realidade)
 * 3. Pró-labore: INSS (11%) + Tabela Progressiva IRPF
 * 
 * 💡 Dica da LMartins: Esta função é chamada em TEMPO REAL enquanto o usuário digita!
 * Por isso, ZERO lado effects, ZERO calls de API. Tudo puro e rápido! ⚡
 * 
 * @author LMartins (Product Manager) - SimpliTax 2026
 */

import { 
  ALIQUOTAS_2026, 
  calcularAliquotaDividendos, 
  determinarAnexoSimples,
  calcularAliquotaSimples,
  calcularImpostoSimples
} from './regras2026'

// ============================================================================
// 📊 INTERFACES - A estrutura dos nossos dados
// ============================================================================

export interface ResultadoOtimizacao {
  cenarioAtual: {
    descricao: string
    custoEmpresa: number      // Impostos da empresa (Simples)
    custoSocio: number        // Impostos do sócio (IR + INSS)
    custoTotal: number        // A conta que importa!
    liquidoFinal: number      // O que sobra no bolso
  }
  cenarioOtimizado: {
    descricao: string
    custoEmpresa: number
    custoSocio: number
    custoTotal: number
    liquidoFinal: number
    impostoSimples: number
    fatorR: number
    aliquotaEfetiva: number
  }
  economiaAnual: number       // O VALOR que você vai economizar!
  recomendacao: string        // A mensagem clara para o cliente
  acoes: string[]             // Passos práticos
}

export interface DadosEmpresa {
  receitaBruta: number
  despesasOperacionais: number
  folhaAtual: number
  prolaboreAtual: number
}

// ============================================================================
// 🔧 FUNÇÕES AUXILIARES - Os blocos de construção
// ============================================================================

/**
 * Calcula o custo do Simples Nacional (com dedução de faixa progressiva)
 */
function calcularCustoSimples(receitaBruta: number, anexo: 'III' | 'V'): number {
  return calcularImpostoSimples(receitaBruta, anexo)
}

/**
 * Calcula IR sobre Pró-labore (Pessoa Física)
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
 * Calcula os encargos totais do sócio (IR + INSS + Dividendos)
 * 
 * 💰 PL 1.087/2025: Isenção de R$ 50.000/mês sobre dividendos
 * Apenas o valor ACIMA de R$ 50k é tributado em 15%
 */
function calcularEncargosSocio(
  proLabore: number, 
  dividendos: number
): { ir: number; inss: number; impostoDiv: number; total: number } {
  const ir = calcularIRProLabore(proLabore)
  const inss = calcularINSSProLabore(proLabore)
  
  // 🆕 Isenção de R$ 50.000 mensais (R$ 600k anuais)
  const ISENCAO_MENSAL = 50000
  const dividendosTributaveis = Math.max(0, dividendos - ISENCAO_MENSAL)
  const aliquotaDiv = calcularAliquotaDividendos(dividendosTributaveis)
  const impostoDiv = dividendosTributaveis * aliquotaDiv
  
  return {
    ir,
    inss,
    impostoDiv,
    total: ir + inss + impostoDiv
  }
}

// ============================================================================
// 🎯 A EQUAÇÃO DE OURO - A função principal!
// ============================================================================

/**
 * 💎 A JOIA DA COROA!
 * 
 * Esta função analisa DOIS cenários e te diz qual é o melhor:
 * 
 * CENÁRIO 1: "Manter o Fator R" (Aumentar Pró-labore para 28%)
 * - Benefício: Fica no Anexo III (impostos mais baixos)
 * - Custo: Paga mais INSS e IR no Pró-labore
 * 
 * CENÁRIO 2: "Dividendos Taxados" (Ignorar Fator R)
 * - Benefício: Menos encargos trabalhistas
 * - Custo: Vai pro Anexo V (Simples mais caro) + 15% nos dividendos
 * 
 * A função retorna: Qual cenário deixa MAIS DINHEIRO no seu bolso? 💰
 */
export function calcularOtimizacao(dados: DadosEmpresa): ResultadoOtimizacao {
  const { receitaBruta, despesasOperacionais, folhaAtual, prolaboreAtual } = dados

  // ========================================================================
  // 📈 CENÁRIO 1: Manter Fator R (Ajustar Folha Total)
  // ========================================================================
  // 
  // 📚 IMPORTANTE: Fator R = (Folha Empregados + Pró-labore) / Receita
  // O pró-labore ENTRA no cálculo da "folha de pagamento" para Fator R!
  // Fonte: Lei Complementar 123/2006, Art. 18, § 5º-C
  
  // ✅ CORREÇÃO: Calcular a FOLHA TOTAL necessária, não apenas pró-labore
  const folhaTotalNecessaria = receitaBruta * ALIQUOTAS_2026.fatorR.minimoAnexoIII  // 28% da receita
  const folhaAtualTotal = folhaAtual + prolaboreAtual  // Folha atual completa
  
  // Se folhaAtualTotal >= folhaTotalNecessaria, já está OK!
  // Se não, precisamos ajustar
  let proLaboreOtimizado: number
  let folhaOtimizada: number
  
  if (folhaAtualTotal >= folhaTotalNecessaria) {
    // 🎉 Já temos folha suficiente! Manter como está ou até reduzir
    proLaboreOtimizado = prolaboreAtual
    folhaOtimizada = folhaAtual
  } else {
    // Precisa aumentar - preferir ajustar pró-labore
    const deficit = folhaTotalNecessaria - folhaAtualTotal
    proLaboreOtimizado = prolaboreAtual + deficit
    folhaOtimizada = folhaAtual
  }
  
  const folhaComProLabore = folhaOtimizada + proLaboreOtimizado
  const fatorRCenario1 = folhaComProLabore / receitaBruta
  const anexoCenario1 = determinarAnexoSimples(fatorRCenario1)
  
  const custoSimplesCenario1 = calcularCustoSimples(receitaBruta, anexoCenario1)
  const lucroAposSimplesC1 = receitaBruta - custoSimplesCenario1 - despesasOperacionais - folhaOtimizada
  const lucroAposProLaboreC1 = lucroAposSimplesC1 - proLaboreOtimizado
  
  // Sócio recebe: Pró-labore (com descontos) + Dividendos (SEM IMPOSTO pois Fator R ok)
  const encargosSocioC1 = calcularEncargosSocio(proLaboreOtimizado, 0)
  const liquidoProLaboreC1 = proLaboreOtimizado - encargosSocioC1.ir - encargosSocioC1.inss
  const liquidoTotalC1 = liquidoProLaboreC1 + lucroAposProLaboreC1
  const custoTotalC1 = custoSimplesCenario1 + folhaOtimizada + proLaboreOtimizado + encargosSocioC1.total

  // ========================================================================
  // 📉 CENÁRIO 2: Ignorar Fator R (Dividendos Taxados)
  // ========================================================================
  
  const fatorRCenario2 = folhaAtualTotal / receitaBruta
  const anexoCenario2 = determinarAnexoSimples(fatorRCenario2)
  
  const custoSimplesCenario2 = calcularCustoSimples(receitaBruta, anexoCenario2)
  const lucroAposSimplesC2 = receitaBruta - custoSimplesCenario2 - despesasOperacionais - folhaAtual
  const lucroAposProLaboreC2 = lucroAposSimplesC2 - prolaboreAtual
  
  // Sócio recebe: Pró-labore atual + Dividendos COM IMPOSTO (15%)
  const encargosSocioC2 = calcularEncargosSocio(prolaboreAtual, lucroAposProLaboreC2)
  const liquidoProLaboreC2 = prolaboreAtual - encargosSocioC2.ir - encargosSocioC2.inss
  const liquidoDividendosC2 = lucroAposProLaboreC2 - encargosSocioC2.impostoDiv
  const liquidoTotalC2 = liquidoProLaboreC2 + liquidoDividendosC2
  const custoTotalC2 = custoSimplesCenario2 + folhaAtual + prolaboreAtual + encargosSocioC2.total

  // ========================================================================
  // 🏆 DECISÃO: Qual cenário é o vencedor?
  // ========================================================================
  
  const economiaAbsoluta = custoTotalC2 - custoTotalC1  // Positivo = otimizar vale a pena
  const economiaAnual = economiaAbsoluta * 12  // Projetando para o ano todo!
  
  // 🐛 DEBUG: Log dos cálculos
  console.log('📊 COMPARAÇÃO DE CENÁRIOS:', {
    receita: receitaBruta,
    'C1 (Otimizado)': {
      fatorR: (fatorRCenario1 * 100).toFixed(1) + '%',
      anexo: anexoCenario1,
      simples: custoSimplesCenario1,
      folha: folhaOtimizada,
      proLabore: proLaboreOtimizado,
      encargos: encargosSocioC1.total,
      custoTotal: custoTotalC1
    },
    'C2 (Atual)': {
      fatorR: (fatorRCenario2 * 100).toFixed(1) + '%',
      anexo: anexoCenario2,
      simples: custoSimplesCenario2,
      folha: folhaAtual,
      proLabore: prolaboreAtual,
      encargos: encargosSocioC2.total,
      custoTotal: custoTotalC2
    },
    economiaAbsoluta,
    economiaAnual,
    melhor: custoTotalC1 < custoTotalC2 ? 'C1 (Otimizar)' : 'C2 (Manter)'
  })
  
  let melhorCenario: 'fatorR' | 'dividendos'
  let recomendacao: string
  let acoes: string[]
  
  if (custoTotalC1 < custoTotalC2) {
    // ✅ OTIMIZAR O FATOR R É MAIS BARATO
    melhorCenario = 'fatorR'
    
    // Analisar o que precisa ajustar
    const folhaJaSuficiente = folhaAtualTotal >= folhaTotalNecessaria
    
    if (folhaJaSuficiente) {
      // 🎉 Folha já está adequada!
      recomendacao = `✅ PARABÉNS! Sua folha total (R$ ${folhaAtualTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) já garante o Fator R de ${(fatorRCenario1 * 100).toFixed(1)}%. Continue assim!`
      acoes = [
        `Manter Fator R em ${(fatorRCenario1 * 100).toFixed(1)}% (acima dos 28% mínimos)`,
        `Folha atual de R$ ${folhaAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + Pró-labore R$ ${prolaboreAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `Permanecer no Anexo III do Simples Nacional`,
        `Distribuir dividendos SEM taxação adicional`
      ]
    } else {
      // Precisa ajustar
      const diferencaNecessaria = proLaboreOtimizado - prolaboreAtual
      const precisaAumentar = diferencaNecessaria > 0
      const acao = precisaAumentar ? 'AUMENTE' : 'DIMINUA'
      const verbo = precisaAumentar ? 'Aumentando' : 'Diminuindo'
      
      recomendacao = `💼 ${acao} O PRÓ-LABORE! ${verbo} de R$ ${prolaboreAtual.toFixed(2)} para R$ ${proLaboreOtimizado.toFixed(2)}, você economiza R$ ${Math.abs(economiaAnual).toFixed(2)} por ano!`
      acoes = [
        `${precisaAumentar ? 'Aumentar' : 'Diminuir'} Pró-labore em R$ ${Math.abs(diferencaNecessaria).toFixed(2)}`,
        `Folha Total necessária: R$ ${folhaTotalNecessaria.toFixed(2)} (28% da receita)`,
        `Garantir Fator R de ${(fatorRCenario1 * 100).toFixed(1)}% (mínimo: 28%)`,
        `Permanecer no Anexo III do Simples Nacional`,
        `Distribuir dividendos SEM taxação adicional`
      ]
    }
  } else if (custoTotalC2 < custoTotalC1) {
    // 💰 DIVIDENDOS (CENÁRIO ATUAL) É MAIS BARATO
    melhorCenario = 'dividendos'
    
    // Calcular se dividendos estão isentos
    const lucroLiquidoAtual = receitaBruta - despesasOperacionais - custoSimplesCenario2 - folhaAtual - prolaboreAtual
    const dividendosIsentos = lucroLiquidoAtual <= 50000
    
    if (dividendosIsentos) {
      recomendacao = `✅ PARABÉNS! Seu cenário atual JÁ É O MELHOR! Com lucro de R$ ${lucroLiquidoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês, seus dividendos são 100% ISENTOS. Aumentar a folha para atingir Fator R custaria R$ ${Math.abs(economiaAnual).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} a MAIS por ano!`
      acoes = [
        `Manter configuração atual (não mexer!)`,
        `Dividendos isentos até R$ 50.000/mês`,
        `Fator R atual: ${(fatorRCenario2 * 100).toFixed(1)}% (abaixo de 28% = Anexo V)`,
        `Não compensa aumentar folha neste caso`,
        `Reavaliar se receita ou lucro aumentarem significativamente`
      ]
    } else {
      // Dividendos pagam imposto mas ainda é melhor que otimizar
      const custoOtimizar = Math.abs(economiaAnual)
      recomendacao = `💰 MANTENHA COMO ESTÁ! Mesmo no Anexo ${anexoCenario2} e pagando imposto sobre dividendos acima de R$ 50k, você evita gastar R$ ${custoOtimizar.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} a MAIS por ano que custaria otimizar o Fator R!`
      acoes = [
        `Manter Pró-labore atual de R$ ${prolaboreAtual.toFixed(2)}`,
        `Aceitar o Anexo ${anexoCenario2} do Simples (neste caso, compensa)`,
        `Distribuir dividendos e pagar 15% sobre o excedente de R$ 50k`,
        `Economia vem de evitar encargos elevados no Pró-labore`
      ]
    }
  } else {
    melhorCenario = 'fatorR'  // Empate: preferir segurança do Fator R
    recomendacao = `⚖️ EMPATE TÉCNICO! Os dois cenários custam praticamente o mesmo. Recomendamos manter o Fator R por segurança fiscal.`
    acoes = [
      `Manter Fator R acima de 28%`,
      `Monitorar mensalmente para ajustes`,
      `Considerar outros benefícios não-tributários do Pró-labore`
    ]
  }

  return {
    cenarioAtual: {
      descricao: `Cenário Atual: Folha R$ ${folhaAtual.toFixed(2)} + Pró-labore R$ ${prolaboreAtual.toFixed(2)} (Fator R: ${(fatorRCenario2 * 100).toFixed(1)}% - Anexo ${anexoCenario2})`,
      custoEmpresa: custoSimplesCenario2,
      custoSocio: encargosSocioC2.total,
      custoTotal: custoTotalC2,
      liquidoFinal: liquidoTotalC2
    },
    cenarioOtimizado: melhorCenario === 'fatorR' ? {
      // Melhor cenário é otimizar o Fator R
      descricao: `Otimizado: Folha R$ ${folhaOtimizada.toFixed(2)} + Pró-labore R$ ${proLaboreOtimizado.toFixed(2)} (Fator R: ${(fatorRCenario1 * 100).toFixed(1)}% - Anexo III)`,
      custoEmpresa: custoSimplesCenario1,
      custoSocio: encargosSocioC1.total,
      custoTotal: custoTotalC1,
      liquidoFinal: liquidoTotalC1,
      impostoSimples: custoSimplesCenario1,
      fatorR: fatorRCenario1,
      aliquotaEfetiva: (custoTotalC1 / receitaBruta) * 100
    } : {
      // Melhor cenário é manter como está (dividendos)
      descricao: `Otimizado: Manter Configuração Atual (Fator R: ${(fatorRCenario2 * 100).toFixed(1)}% - Anexo ${anexoCenario2})`,
      custoEmpresa: custoSimplesCenario2,
      custoSocio: encargosSocioC2.total,
      custoTotal: custoTotalC2,
      liquidoFinal: liquidoTotalC2,
      impostoSimples: custoSimplesCenario2,
      fatorR: fatorRCenario2,
      aliquotaEfetiva: (custoTotalC2 / receitaBruta) * 100
    },
    economiaAnual,
    recomendacao,
    acoes
  }
}

// ============================================================================
// 🎛️ SIMULADOR RÁPIDO - Para o slider da interface
// ============================================================================

/**
 * Versão simplificada para uso no slider do simulador
 * (mantida por compatibilidade com componentes existentes)
 */
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
