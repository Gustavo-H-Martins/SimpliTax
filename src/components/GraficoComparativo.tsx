'use client'

import { useState, useEffect } from 'react'
import { calcularOtimizacao } from '@/engine/otimizador'

interface Props {
  receitaBruta?: number
  despesas?: number
  folhaAtual?: number
  proLaboreAtual?: number
}

export default function GraficoComparativo({ 
  receitaBruta: receitaProp,
  despesas: despesasProp,
  folhaAtual: folhaProp,
  proLaboreAtual: proLaboreProp
}: Props = {}) {
  
  const [dados, setDados] = useState({
    proLaboreAtual: 35000,
    proLaboreOtimizado: 42000,
    economia: 7000
  })

  useEffect(() => {
    // Tentar carregar do localStorage primeiro
    if (typeof window !== 'undefined') {
      const dadosSalvos = localStorage.getItem('simplitax_dados_empresa')
      
      if (dadosSalvos) {
        try {
          const dadosParseados = JSON.parse(dadosSalvos)
          
          // Usar dados do localStorage ou props ou defaults
          const receita = receitaProp || dadosParseados.receitaBrutaMensal || 100000
          const despesas = despesasProp || dadosParseados.despesasOperacionais || 30000
          const folha = folhaProp || dadosParseados.folhaPagamento || 15000
          const proLabore = proLaboreProp || dadosParseados.proLaboreAtual || 5000
          
          // Calcular cenários
          const resultado = calcularOtimizacao({
            receitaBruta: receita,
            despesasOperacionais: despesas,
            folhaAtual: folha,
            prolaboreAtual: proLabore
          })
          
          setDados({
            proLaboreAtual: resultado.cenarioAtual.custoTotal,
            proLaboreOtimizado: resultado.cenarioOtimizado.custoTotal,
            economia: Math.abs(resultado.economiaAnual / 12) // Economia mensal
          })
          
        } catch (erro) {
          console.error('Erro ao calcular gráfico:', erro)
        }
      }
    }
  }, [receitaProp, despesasProp, folhaProp, proLaboreProp])

  const maiorValor = Math.max(dados.proLaboreAtual, dados.proLaboreOtimizado)
  const percentualAtual = (dados.proLaboreAtual / maiorValor) * 100
  const percentualOtimizado = (dados.proLaboreOtimizado / maiorValor) * 100

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">💰 Comparativo de Custos</h2>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Cenário Atual (Custo Total Mensal)</span>
            <span className="text-sm font-bold text-red-600">
              R$ {dados.proLaboreAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-red-500 h-4 rounded-full transition-all duration-500" 
              style={{ width: `${percentualAtual}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Cenário Otimizado (Custo Total Mensal)</span>
            <span className="text-sm font-bold text-green-600">
              R$ {dados.proLaboreOtimizado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-green-500 h-4 rounded-full transition-all duration-500" 
              style={{ width: `${percentualOtimizado}%` }}
            />
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <p className="text-center text-lg font-bold text-green-600">
            💸 Economia Mensal: R$ {dados.economia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-center text-sm text-gray-600 mt-1">
            💰 Economia Anual: R$ {(dados.economia * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  )
}
