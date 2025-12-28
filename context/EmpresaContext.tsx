'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import type { Empresa, DadosFinanceiros } from '@/types'

interface EmpresaContextType {
  empresa: Empresa | null
  setEmpresa: (empresa: Empresa | null) => void
  dadosFinanceiros: DadosFinanceiros[]
  setDadosFinanceiros: (dados: DadosFinanceiros[]) => void
  adicionarDadosFinanceiros: (dados: DadosFinanceiros) => void
}

const EmpresaContext = createContext<EmpresaContextType | undefined>(undefined)

export function EmpresaProvider({ children }: { children: ReactNode }) {
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [dadosFinanceiros, setDadosFinanceiros] = useState<DadosFinanceiros[]>([])

  const adicionarDadosFinanceiros = (dados: DadosFinanceiros) => {
    setDadosFinanceiros(prev => [...prev, dados])
  }

  return (
    <EmpresaContext.Provider
      value={{
        empresa,
        setEmpresa,
        dadosFinanceiros,
        setDadosFinanceiros,
        adicionarDadosFinanceiros
      }}
    >
      {children}
    </EmpresaContext.Provider>
  )
}

export function useEmpresa() {
  const context = useContext(EmpresaContext)
  if (context === undefined) {
    throw new Error('useEmpresa must be used within an EmpresaProvider')
  }
  return context
}
