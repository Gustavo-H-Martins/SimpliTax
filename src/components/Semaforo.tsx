'use client'

import { useMemo } from 'react'
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { StatusSaudeFiscal } from '@/engine/saudeFiscal'

type RiscoFiscal = 'verde' | 'amarelo' | 'vermelho'

interface SemaforoProps {
  statusFiscal: StatusSaudeFiscal
}

/**
 * 🚦 SEMÁFORO DE RISCO FISCAL - Dashboard de Saúde
 * 
 * Componente visual que traduz dados fiscais complexos em sinalização instantânea.
 * Baseado nas regras da Reforma Tributária 2026!
 * 
 * 🟢 Verde (28%+): Eficiência máxima - Anexo III garantido!
 * 🟡 Amarelo (24-27.9%): Oportunidade de otimização - pequeno ajuste = grande economia
 * 🔴 Vermelho (<24%): Alerta crítico - dinheiro sendo perdido!
 * 
 * @author LMartins (Product Manager) - SimpliTax 2026
 */
export default function Semaforo({ statusFiscal }: SemaforoProps) {
  
  const status = useMemo(() => {
    const fatorR = statusFiscal.fatorR
    const statusCor = statusFiscal.status
    
    // 🟢 VERDE: Saúde Plena
    if (statusCor === 'verde') {
      return {
        risco: 'verde' as RiscoFiscal,
        cor: 'text-green-600',
        bg: 'bg-green-50',
        borda: 'border-green-200',
        icon: CheckCircle,
        titulo: statusFiscal.titulo,
        mensagem: statusFiscal.mensagem,
        dica: statusFiscal.recomendacoes[0] || '✨ Continue monitorando mensalmente para manter essa vantagem!'
      }
    }
    
    // 🟡 AMARELO: Atenção/Oportunidade
    if (statusCor === 'amarelo') {
      return {
        risco: 'amarelo' as RiscoFiscal,
        cor: 'text-yellow-600',
        bg: 'bg-yellow-50',
        borda: 'border-yellow-200',
        icon: AlertTriangle,
        titulo: statusFiscal.titulo,
        mensagem: statusFiscal.mensagem,
        dica: statusFiscal.recomendacoes[0] || '💡 Ajuste sua folha nos próximos meses para manter a vantagem tributária.'
      }
    }
    
    // 🔴 VERMELHO: Risco Crítico
    return {
      risco: 'vermelho' as RiscoFiscal,
      cor: 'text-red-600',
      bg: 'bg-red-50',
      borda: 'border-red-200',
      icon: XCircle,
      titulo: statusFiscal.titulo,
      mensagem: statusFiscal.mensagem,
      dica: statusFiscal.recomendacoes[0] || '🚨 Revise sua estratégia tributária imediatamente!'
    }
  }, [statusFiscal])

  const IconComponent = status.icon

  return (
    <div className={`relative overflow-hidden rounded-2xl ${status.bg} border-2 ${status.borda} shadow-lg transition-all hover:shadow-xl`}>
      {/* Header com ícone */}
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`${status.cor} p-3 rounded-full ${status.bg}`}>
            <IconComponent className="w-8 h-8" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
              Status Fiscal 2026
            </h2>
            <h3 className={`text-xl font-bold ${status.cor} mb-2`}>
              {status.titulo}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Fator R:</span>
              <span className={`text-2xl font-bold ${status.cor}`}>
                {(statusFiscal.fatorR * 100).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500">(mínimo: 28%)</span>
            </div>
          </div>
        </div>

        {/* Mensagem principal */}
        <div className="bg-white bg-opacity-60 rounded-lg p-4 mb-4">
          <p className="text-gray-800 leading-relaxed">
            {status.mensagem}
          </p>
        </div>

        {/* Dica da LMartins */}
        <div className={`${status.bg} border-l-4 ${status.borda} pl-4 py-3`}>
          <p className="text-sm font-medium text-gray-700">
            {status.dica}
          </p>
        </div>

        {/* Economia Potencial (se houver) */}
        {statusFiscal.economiaPotencial > 0 && (
          <div className="mt-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">
                  💰 Economia Potencial
                </p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {statusFiscal.economiaPotencial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  por mês, otimizando agora!
                </p>
              </div>
              <div className="text-4xl">💎</div>
            </div>
          </div>
        )}
      </div>

      {/* Barra de progresso do Fator R */}
      <div className="px-6 pb-6">
        <div className="bg-white bg-opacity-60 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              statusFiscal.fatorR >= 0.28 ? 'bg-green-500' : 
              statusFiscal.fatorR >= 0.24 ? 'bg-yellow-500' : 
              'bg-red-500'
            }`}
            style={{ width: `${Math.min((statusFiscal.fatorR / 0.28) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>0%</span>
          <span className="font-semibold">28% (meta)</span>
          <span>35%+</span>
        </div>
      </div>
    </div>
  )
}
