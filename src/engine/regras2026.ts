/**
 * 💰 Módulo Fiscal 2026 - O Coração da Reforma Tributária
 * 
 * Aqui está a MÁGICA! Este módulo traduz a complexidade da lei em números que fazem sentido.
 * 
 * 🎯 O QUE MUDOU EM 2026?
 * 1. Dividendos agora são TAXADOS (acabou a festa da isenção total!)
 * 2. O Fator R virou o melhor amigo do contador esperto
 * 3. Quem não planejar vai PAGAR CARO
 * 
 * 💡 Dica da LMartins: Use estas constantes como sua bússola fiscal!
 * 
 * @author LMartins (Product Manager) - SimpliTax 2026
 */

export const ALIQUOTAS_2026 = {
  // 🎁 Nova taxação sobre dividendos (A GRANDE MUDANÇA!)
  dividendos: {
    isento: 0,      // Isenção zerada (RIP dividendos 100% livres)
    base: 0.15,     // 15% - A alíquota que vai doer no bolso
    alta: 0.225     // 22,5% para quem ganha MUITO (acima de 40k/mês)
  },
  
  // ⚖️ Fator R - A RÉGUA DE OURO do Simples Nacional
  // Tradução: Se sua folha é >= 28% da receita, você ECONOMIZA!
  fatorR: {
    minimoAnexoIII: 0.28,  // O número mágico: 28%!
    limiteAtencao: 0.25    // Zona de perigo: abaixo de 25% você está perdendo dinheiro
  },
  
  // Simples Nacional - Anexo III (Serviços)
  simplesAnexoIII: [
    { ate: 180000, aliquota: 0.06, deducao: 0 },
    { ate: 360000, aliquota: 0.112, deducao: 9360 },
    { ate: 720000, aliquota: 0.135, deducao: 17640 },
    { ate: 1800000, aliquota: 0.16, deducao: 35640 },
    { ate: 3600000, aliquota: 0.21, deducao: 125640 },
    { ate: 4800000, aliquota: 0.33, deducao: 648000 }
  ],
  
  // Simples Nacional - Anexo V (Serviços sem Fator R adequado)
  simplesAnexoV: [
    { ate: 180000, aliquota: 0.155, deducao: 0 },
    { ate: 360000, aliquota: 0.18, deducao: 4500 },
    { ate: 720000, aliquota: 0.195, deducao: 9900 },
    { ate: 1800000, aliquota: 0.205, deducao: 17100 },
    { ate: 3600000, aliquota: 0.23, deducao: 62100 },
    { ate: 4800000, aliquota: 0.305, deducao: 540000 }
  ],
  
  // IR Pró-labore (Pessoa Física)
  irrf: [
    { ate: 2259.20, aliquota: 0, deducao: 0 },
    { ate: 2826.65, aliquota: 0.075, deducao: 169.44 },
    { ate: 3751.05, aliquota: 0.15, deducao: 381.44 },
    { ate: 4664.68, aliquota: 0.225, deducao: 662.77 },
    { ate: Infinity, aliquota: 0.275, deducao: 896.00 }
  ],
  
  // INSS Pró-labore
  inss: {
    aliquota: 0.11,
    teto: 7786.02  // Teto do INSS 2026 (valor estimado)
  }
}

/**
 * Calcula a alíquota de dividendos baseada no valor
 */
export function calcularAliquotaDividendos(valor: number): number {
  // Simplificação: valores até R$ 20.000/mês são isentos
  if (valor <= 20000) return ALIQUOTAS_2026.dividendos.isento
  // Valores entre R$ 20k e R$ 40k: 15%
  if (valor <= 40000) return ALIQUOTAS_2026.dividendos.base
  // Valores acima de R$ 40k: 22,5%
  return ALIQUOTAS_2026.dividendos.alta
}

/**
 * Determina o anexo do Simples Nacional baseado no Fator R
 */
export function determinarAnexoSimples(fatorR: number): 'III' | 'V' {
  return fatorR >= ALIQUOTAS_2026.fatorR.minimoAnexoIII ? 'III' : 'V'
}

/**
 * Calcula a alíquota do Simples Nacional
 * 
 * ATENÇÃO: Esta função retorna apenas a ALÍQUOTA nominal.
 * Para calcular o imposto real, use calcularImpostoSimples()
 */
export function calcularAliquotaSimples(receitaBruta: number, anexo: 'III' | 'V'): number {
  const tabela = anexo === 'III' ? ALIQUOTAS_2026.simplesAnexoIII : ALIQUOTAS_2026.simplesAnexoV
  
  for (const faixa of tabela) {
    if (receitaBruta <= faixa.ate) {
      return faixa.aliquota
    }
  }
  
  return tabela[tabela.length - 1].aliquota
}

/**
 * Calcula o IMPOSTO REAL do Simples Nacional (com dedução)
 * 
 * Fórmula correta: (Receita × Alíquota) - Dedução
 */
export function calcularImpostoSimples(receitaBruta: number, anexo: 'III' | 'V'): number {
  const tabela = anexo === 'III' ? ALIQUOTAS_2026.simplesAnexoIII : ALIQUOTAS_2026.simplesAnexoV
  
  for (const faixa of tabela) {
    if (receitaBruta <= faixa.ate) {
      return (receitaBruta * faixa.aliquota) - faixa.deducao
    }
  }
  
  const ultimaFaixa = tabela[tabela.length - 1]
  return (receitaBruta * ultimaFaixa.aliquota) - ultimaFaixa.deducao
}
