'use client'

import { useState } from 'react'
import { calcularEquilibrio } from '@/engine/calculador'

export default function SimuladorPage() {
  const [proLabore, setProLabore] = useState(5000)
  const [resultado, setResultado] = useState<any>(null)

  const handleSimular = () => {
    const res = calcularEquilibrio(proLabore, 50000)
    setResultado(res)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Simulador What-If</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Pró-labore vs Dividendos</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Valor do Pró-labore: R$ {proLabore.toLocaleString('pt-BR')}
          </label>
          <input
            type="range"
            min="1000"
            max="20000"
            step="500"
            value={proLabore}
            onChange={(e) => setProLabore(Number(e.target.value))}
            className="w-full"
          />
        </div>
        
        <button
          onClick={handleSimular}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Simular Cenário
        </button>
        
        {resultado && (
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">Resultado da Simulação</h3>
            <p className="text-sm">Lucro Líquido: R$ {resultado.lucroLiquido.toFixed(2)}</p>
            <p className="text-sm">Economia: R$ {resultado.economia.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  )
}
