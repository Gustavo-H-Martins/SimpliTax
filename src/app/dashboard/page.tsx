'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/NavBar'
import Semaforo from '@/components/Semaforo'
import GraficoComparativo from '@/components/GraficoComparativo'
import PainelComparativo from '@/components/PainelComparativo'
import { analisarSaudeFiscal, botaoDePanico } from '@/engine/saudeFiscal'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Footer from '@/components/Footer'

export default function DashboardPage() {
  const router = useRouter()
  
  // Estado editável dos dados (agora o usuário pode alterar!)
  const [dados, setDados] = useState({
    receitaBrutaMensal: 100000,
    despesasOperacionais: 30000,
    folhaPagamento: 15000,
    proLaboreAtual: 5000
  })

  const [modoEdicao, setModoEdicao] = useState(false)
  const [mensagemSalvo, setMensagemSalvo] = useState(false)

  // 🔄 Carregar dados salvos do localStorage ao montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dadosSalvos = localStorage.getItem('simplitax_dados_empresa')
      if (dadosSalvos) {
        try {
          const dadosParseados = JSON.parse(dadosSalvos)
          setDados({
            receitaBrutaMensal: dadosParseados.receitaBrutaMensal || 100000,
            despesasOperacionais: dadosParseados.despesasOperacionais || 30000,
            folhaPagamento: dadosParseados.folhaPagamento || 15000,
            proLaboreAtual: dadosParseados.proLaboreAtual || 5000
          })
        } catch (erro) {
          console.error('Erro ao carregar dados salvos:', erro)
        }
      }
    }
  }, [])

  const handleInputChange = (campo: string, valor: string) => {
    const valorNumerico = parseFloat(valor) || 0
    setDados(prev => ({
      ...prev,
      [campo]: valorNumerico
    }))
  }

  const handleSalvar = () => {
    // Salvar no localStorage para usar em outras páginas
    if (typeof window !== 'undefined') {
      localStorage.setItem('simplitax_dados_empresa', JSON.stringify(dados))
    }
    setModoEdicao(false)
    setMensagemSalvo(true)
    
    // Ocultar mensagem após 3 segundos
    setTimeout(() => setMensagemSalvo(false), 3000)
  }

  const handleVerAnalise = () => {
    router.push('/otimizador')
  }

  const handleGerarRelatorio = () => {
    router.push('/relatorio-alivio')
  }

  const handleIrParaUpload = () => {
    router.push('/upload')
  }

  const statusFiscal = useMemo(() => analisarSaudeFiscal({
    receitaBrutaMensal: dados.receitaBrutaMensal,
    despesasOperacionais: dados.despesasOperacionais,
    folhaPagamento: dados.folhaPagamento,
    proLaboreAtual: dados.proLaboreAtual
  }), [dados])
  
  const panico = useMemo(() => botaoDePanico({
    receitaBrutaMensal: dados.receitaBrutaMensal,
    despesasOperacionais: dados.despesasOperacionais,
    folhaPagamento: dados.folhaPagamento,
    proLaboreAtual: dados.proLaboreAtual
  }), [dados])

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Dashboard Fiscal</h1>
        <p className="text-gray-600">
          Visão completa da saúde tributária da sua empresa
        </p>
      </div>

      {/* Botão de Pânico (se necessário) */}
      {panico.precisaAgir && panico.urgencia !== 'baixa' && (
        <div className={`mb-6 p-4 rounded-lg border-2 ${
          panico.urgencia === 'alta' 
            ? 'bg-red-50 border-red-300' 
            : 'bg-yellow-50 border-yellow-300'
        }`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">
              {panico.urgencia === 'alta' ? '🚨' : '⚠️'}
            </span>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">
                {panico.urgencia === 'alta' ? 'AÇÃO URGENTE NECESSÁRIA!' : 'Atenção Necessária'}
              </h3>
              <p className="text-sm mb-2">{panico.mensagemAlerta}</p>
              <p className="text-xs text-gray-600">
                Prazo: <strong>{panico.prazoAcao}</strong>
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Formulário de Edição de Dados */}
      <Card className="mb-6 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">📊 Dados da Empresa</h2>
          <div className="flex items-center gap-3">
            {mensagemSalvo && (
              <span className="text-sm text-green-600 font-semibold animate-pulse">
                ✅ Salvo com sucesso!
              </span>
            )}
            <Button 
              variant={modoEdicao ? 'primary' : 'secondary'}
              onClick={() => modoEdicao ? handleSalvar() : setModoEdicao(true)}
            >
              {modoEdicao ? '✅ Salvar' : '✏️ Editar'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Receita Bruta Mensal
            </label>
            {modoEdicao ? (
              <input
                type="number"
                value={dados.receitaBrutaMensal}
                onChange={(e) => handleInputChange('receitaBrutaMensal', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="text-xl font-bold text-blue-600">
                {dados.receitaBrutaMensal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Despesas Operacionais
            </label>
            {modoEdicao ? (
              <input
                type="number"
                value={dados.despesasOperacionais}
                onChange={(e) => handleInputChange('despesasOperacionais', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="text-xl font-bold text-orange-600">
                {dados.despesasOperacionais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Folha de Pagamento Atual
            </label>
            {modoEdicao ? (
              <input
                type="number"
                value={dados.folhaPagamento}
                onChange={(e) => handleInputChange('folhaPagamento', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="text-xl font-bold text-green-600">
                {dados.folhaPagamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Pró-labore Atual
            </label>
            {modoEdicao ? (
              <input
                type="number"
                value={dados.proLaboreAtual}
                onChange={(e) => handleInputChange('proLaboreAtual', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="text-xl font-bold text-purple-600">
                {dados.proLaboreAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            )}
          </div>
        </div>

        {modoEdicao && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Dica:</strong> Altere os valores e clique em “Salvar” para atualizar os cálculos do dashboard.
            </p>
          </div>
        )}
      </Card>
      
      {/* Painel Comparativo Antes vs Depois */}
      <div className="mb-6">
        <PainelComparativo 
          receitaBruta={dados.receitaBrutaMensal}
          despesas={dados.despesasOperacionais}
          folhaAtual={dados.folhaPagamento}
          proLaboreAtual={dados.proLaboreAtual}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Semáforo de Risco */}
        <Semaforo 
          statusFiscal={statusFiscal}
        />
        
        {/* Gráfico Comparativo - Agora com dados reais! */}
        <GraficoComparativo 
          receitaBruta={dados.receitaBrutaMensal}
          despesas={dados.despesasOperacionais}
          folhaAtual={dados.folhaPagamento}
          proLaboreAtual={dados.proLaboreAtual}
        />
      </div>
      
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Receita Bruta Mensal</p>
            <p className="text-3xl font-bold text-blue-700">
              R$ {dados.receitaBrutaMensal.toLocaleString('pt-BR')}
            </p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Fator R Atual</p>
            <p className="text-3xl font-bold text-green-700">
              {(statusFiscal.fatorR * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-600">
              Anexo {statusFiscal.anexo} do Simples
            </p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Folha Total</p>
            <p className="text-3xl font-bold text-purple-700">
              R$ {(dados.folhaPagamento + dados.proLaboreAtual).toLocaleString('pt-BR')}
            </p>
            <p className="text-xs text-gray-600">
              CLT + Pró-labore
            </p>
          </div>
        </Card>
      </div>

      {/* Recomendações */}
      <Card title="📋 Recomendações do SimpliTax">
        <div className="space-y-3">
          {statusFiscal.recomendacoes.map((recomendacao, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </span>
              <p className="text-gray-700 text-sm">{recomendacao}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="primary" onClick={handleVerAnalise}>
            Ver Análise Completa
          </Button>
          <Button variant="secondary" onClick={handleGerarRelatorio}>
            Gerar Relatório
          </Button>
          <Button variant="secondary" onClick={handleIrParaUpload}>
            📤 Importar Dados
          </Button>
        </div>
      </Card>

      <Footer />
    </div>
    </>
  )
}
