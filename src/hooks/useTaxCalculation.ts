/**
 * Hook para cálculos tributários
 * Lógica reutilizável para componentes que precisam de cálculos fiscais
 */

import { useState, useEffect, useCallback } from 'react'
import { calcularEquilibrio, calcularPontoOtimo } from '@/engine/calculador'
import { analisarFatorR, DadosMensais } from '@/engine/factorR'
import type { ResultadoCalculo } from '@/engine/calculador'
import type { ResultadoFatorR } from '@/engine/factorR'

export function useTaxCalculation(lucroContabil: number, dadosMensais?: DadosMensais[]) {
  const [proLabore, setProLabore] = useState(5000)
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null)
  const [fatorR, setFatorR] = useState<ResultadoFatorR | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Calcula equilíbrio entre Pró-labore e Dividendos
  const calcular = useCallback(() => {
    setIsCalculating(true)
    try {
      const res = calcularEquilibrio(proLabore, lucroContabil)
      setResultado(res)
    } catch (error) {
      console.error('Erro ao calcular:', error)
    } finally {
      setIsCalculating(false)
    }
  }, [proLabore, lucroContabil])

  // Calcula o ponto ótimo automaticamente
  const calcularOtimo = useCallback(() => {
    setIsCalculating(true)
    try {
      const { valorOtimo, resultado: res } = calcularPontoOtimo(lucroContabil)
      setProLabore(valorOtimo)
      setResultado(res)
    } catch (error) {
      console.error('Erro ao calcular ponto ótimo:', error)
    } finally {
      setIsCalculating(false)
    }
  }, [lucroContabil])

  // Analisa Fator R se dados mensais estiverem disponíveis
  useEffect(() => {
    if (dadosMensais && dadosMensais.length > 0) {
      const resultado = analisarFatorR(dadosMensais)
      setFatorR(resultado)
    }
  }, [dadosMensais])

  // Recalcula automaticamente quando proLabore ou lucro muda
  useEffect(() => {
    calcular()
  }, [calcular])

  return {
    proLabore,
    setProLabore,
    resultado,
    fatorR,
    isCalculating,
    calcular,
    calcularOtimo
  }
}
