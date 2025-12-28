/**
 * Types e Interfaces - SimpliTax 2026
 * Interfaces TypeScript para os dados contábeis
 */

export interface Empresa {
  id: string
  nome: string
  cnpj: string
  regimeTributario: 'simples' | 'presumido' | 'real'
  porte: 'mei' | 'micro' | 'pequena' | 'media' | 'grande'
}

export interface DadosFinanceiros {
  periodo: string // YYYY-MM
  receitaBruta: number
  despesasOperacionais: number
  folhaPagamento: number
  prolabore: number
  lucroContabil: number
  impostosPagos: number
}

export interface SimulacaoTributaria {
  cenarioAtual: {
    totalImpostos: number
    lucroLiquido: number
    cargaTributaria: number
  }
  cenario2026: {
    totalImpostos: number
    lucroLiquido: number
    cargaTributaria: number
  }
  economia: number
  recomendacoes: string[]
}

export interface AlertaFiscal {
  id: string
  tipo: 'fatorR' | 'dividendos' | 'conciliacao' | 'outros'
  severidade: 'info' | 'warning' | 'error'
  titulo: string
  mensagem: string
  dataAlerta: Date
  resolvido: boolean
}

export interface ConfiguracaoImportacao {
  formato: 'csv' | 'xlsx' | 'txt'
  delimitador?: string
  mapeamentoColunas: {
    data?: string
    descricao?: string
    valor?: string
    tipo?: string
  }
}

export interface RelatorioCliente {
  empresaId: string
  periodo: string
  economiaTotal: number
  acoesTomadas: string[]
  proximosPassos: string[]
  geradoEm: Date
}
