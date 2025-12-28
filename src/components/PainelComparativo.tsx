/**
 * 📊 PainelComparativo - Comparação Antes vs Depois da Otimização
 * 
 * Mostra lado a lado:
 * - Cenário SEM otimização (Anexo V + Dividendos 2026)
 * - Cenário COM SimpliTax (Anexo III + Fator R otimizado)
 * 
 * @author LMartins (Product Manager) - SimpliTax
 */

'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { TrendingDown, TrendingUp, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react'
import { calcularOtimizacao } from '@/engine/otimizador'
import { calcularImpostoSimples } from '@/engine/regras2026'

interface Props {
  receitaBruta?: number
  despesas?: number
  folhaAtual?: number
  proLaboreAtual?: number
}

export default function PainelComparativo({ 
  receitaBruta, 
  despesas, 
  folhaAtual, 
  proLaboreAtual 
}: Props) {
  const [dados, setDados] = useState({
    cenarioAntigo: {
      custoTotal: 0,
      impostoSimples: 0,
      impostoDividendos: 0,
      aliquotaEfetiva: 0
    },
    cenarioOtimizado: {
      custoTotal: 0,
      impostoSimples: 0,
      fatorR: 0,
      aliquotaEfetiva: 0
    },
    economiaAnual: 0,
    economiaPercentual: 0
  })

  useEffect(() => {
    let receita = receitaBruta || 0
    let despesasOp = despesas || 0
    let folha = folhaAtual || 0
    let proLabore = proLaboreAtual || 0

    // Se props não fornecidas, tentar localStorage
    if (!receita || !despesasOp || !folha || !proLabore) {
      if (typeof window !== 'undefined') {
        const dadosSalvos = localStorage.getItem('simplitax_dados_empresa')
        if (dadosSalvos) {
          const parsed = JSON.parse(dadosSalvos)
          receita = parsed.receitaBrutaMensal || 100000
          despesasOp = parsed.despesasOperacionais || 30000
          folha = parsed.folhaPagamento || 15000
          proLabore = parsed.proLaboreAtual || 5000
        }
      }
    }

    // Calcular cenário otimizado
    const resultado = calcularOtimizacao({
      receitaBruta: receita,
      despesasOperacionais: despesasOp,
      folhaAtual: folha,
      prolaboreAtual: proLabore
    })

    // Calcular cenário SEM otimização (Anexo V com faixa progressiva)
    const impostoSimplesAnexoV = calcularImpostoSimples(receita, 'V')
    
    // Dividendos 2026: Com isenção de R$ 50.000 mensais (PL 1.087/2025)
    const lucroLiquido = receita - despesasOp - folha - proLabore - impostoSimplesAnexoV
    const ISENCAO_DIVIDENDOS_MENSAL = 50000 // R$ 50 mil/mês isento
    const dividendosTributaveis = Math.max(0, lucroLiquido - ISENCAO_DIVIDENDOS_MENSAL)
    const impostoDividendos = dividendosTributaveis * 0.15 // 15% sobre o excedente
    
    // INSS sobre pró-labore (11% limitado ao teto)
    const TETO_INSS = 7786.02 // Teto INSS 2026
    const baseINSS = Math.min(proLabore, TETO_INSS)
    const inssProLabore = baseINSS * 0.11
    
    const custoTotalSemOtimizacao = impostoSimplesAnexoV + impostoDividendos + folha + proLabore + inssProLabore
    const aliquotaEfetivaSem = (custoTotalSemOtimizacao / receita) * 100

    setDados({
      cenarioAntigo: {
        custoTotal: custoTotalSemOtimizacao,
        impostoSimples: impostoSimplesAnexoV,
        impostoDividendos: impostoDividendos,
        aliquotaEfetiva: aliquotaEfetivaSem
      },
      cenarioOtimizado: {
        custoTotal: resultado.cenarioOtimizado.custoTotal,
        impostoSimples: resultado.cenarioOtimizado.impostoSimples,
        fatorR: resultado.cenarioOtimizado.fatorR,
        aliquotaEfetiva: resultado.cenarioOtimizado.aliquotaEfetiva
      },
      economiaAnual: resultado.economiaAnual,
      economiaPercentual: (resultado.economiaAnual / (custoTotalSemOtimizacao * 12)) * 100
    })
  }, [receitaBruta, despesas, folhaAtual, proLaboreAtual])

  const formatarMoeda = (valor: number) => {
    if (valor === undefined || valor === null || isNaN(valor)) {
      return 'R$ 0,00'
    }
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const formatarPercentual = (valor: number) => {
    if (valor === undefined || valor === null || isNaN(valor)) {
      return '0.00'
    }
    return valor.toFixed(2)
  }

  // Se não há economia significativa, não mostrar o painel
  const economiaSignificativa = Math.abs(dados.economiaAnual) > 1000
  
  if (!economiaSignificativa) {
    return (
      <div className="w-full">
        <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-300">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-green-800 mb-2">✅ Já Otimizado!</h3>
          <p className="text-gray-700 text-lg">
            Sua empresa já está no melhor cenário fiscal possível.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Fator R: <strong>{formatarPercentual((dados.cenarioOtimizado.fatorR || 0) * 100)}%</strong> - Mantendo Anexo III
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Título */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">⚖️ Comparação: Antes vs Depois</h2>
        <p className="text-gray-600">Veja o impacto real da otimização SimpliTax</p>
      </div>

      {/* Cards Comparativos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Cenário SEM Otimização */}
        <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-bl-full opacity-30"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gray-200 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Sem Otimização</h3>
                <p className="text-sm text-gray-600">Anexo V + Dividendos 2026</p>
              </div>
            </div>

            {/* Valores */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Simples Nacional:</span>
                <span className="font-semibold text-gray-800">
                  {formatarMoeda(dados.cenarioAntigo.impostoSimples)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Imposto Dividendos:</span>
                <span className="font-semibold text-gray-800">
                  {formatarMoeda(dados.cenarioAntigo.impostoDividendos)}
                </span>
              </div>
              <div className="h-px bg-gray-300"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">Custo Total Mensal:</span>
                <span className="font-bold text-xl text-gray-800">
                  {formatarMoeda(dados.cenarioAntigo.custoTotal)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Alíquota Efetiva:</span>
                <span className="text-sm font-semibold text-gray-700">
                  {formatarPercentual(dados.cenarioAntigo.aliquotaEfetiva)}%
                </span>
              </div>
            </div>

            {/* Ícone de Tendência */}
            <div className="flex items-center gap-2 text-red-600">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-semibold">Custo Elevado</span>
            </div>
          </div>
        </Card>

        {/* Cenário COM SimpliTax */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 border-2 border-cyan-400 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-bl-full opacity-30"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                  SimpliTax Otimizado
                </h3>
                <p className="text-sm text-gray-600">Anexo III + Fator R Ajustado</p>
              </div>
            </div>

            {/* Valores */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Simples Nacional:</span>
                <span className="font-semibold text-blue-700">
                  {formatarMoeda(dados.cenarioOtimizado.impostoSimples)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Fator R Otimizado:</span>
                <span className="font-semibold text-green-700">
                  {formatarPercentual((dados.cenarioOtimizado.fatorR || 0) * 100)}%
                </span>
              </div>
              <div className="h-px bg-cyan-300"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">Custo Total Mensal:</span>
                <span className="font-bold text-xl text-blue-700">
                  {formatarMoeda(dados.cenarioOtimizado.custoTotal)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Alíquota Efetiva:</span>
                <span className="text-sm font-semibold text-green-700">
                  {formatarPercentual(dados.cenarioOtimizado.aliquotaEfetiva)}%
                </span>
              </div>
            </div>

            {/* Ícone de Tendência */}
            <div className="flex items-center gap-2 text-green-600">
              <TrendingDown className="w-5 h-5" />
              <span className="text-sm font-semibold">Custo Reduzido</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Barra de Economia */}
      <Card className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-full">
              <DollarSign className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm opacity-90">Economia Anual Estimada</p>
              <p className="text-3xl font-bold">{formatarMoeda(dados.economiaAnual)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Redução de Custo</p>
            <p className="text-3xl font-bold">{formatarPercentual(dados.economiaPercentual)}%</p>
          </div>
        </div>

        {/* Barra Visual */}
        <div className="mt-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold whitespace-nowrap">Sem SimpliTax</span>
            <div className="flex-1 h-8 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/80 rounded-full transition-all duration-1000 flex items-center justify-end pr-3"
                style={{ width: '100%' }}
              >
                <span className="text-xs font-bold text-red-600">100%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-sm font-semibold whitespace-nowrap">Com SimpliTax</span>
            <div className="flex-1 h-8 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full transition-all duration-1000 flex items-center justify-end pr-3"
                style={{ width: `${100 - (dados.economiaPercentual || 0)}%` }}
              >
                <span className="text-xs font-bold text-white">{formatarPercentual(100 - (dados.economiaPercentual || 0))}%</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
