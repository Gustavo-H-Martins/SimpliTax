'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/NavBar'
import { calcularOtimizacao, DadosEmpresa, ResultadoOtimizacao } from '@/engine/otimizador'
import { exportarParaPDF } from '@/components/ExportadorPDF'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Footer from '@/components/Footer'
import { FileDown } from 'lucide-react'
import { AdBanner, useInterstitialAd } from '@/components/ads/AdManager'
import { useSubscription, trackUsage, hasReachedLimit } from '@/utils/subscription'
import { Paywall } from '@/components/Paywall'

export default function OtimizadorPage() {
  const router = useRouter()
  const [dados, setDados] = useState<DadosEmpresa>({
    receitaBruta: 100000,
    despesasOperacionais: 30000,
    folhaAtual: 20000,
    prolaboreAtual: 5000
  })
  
  const [resultado, setResultado] = useState<ResultadoOtimizacao | null>(null)
  const [showPaywall, setShowPaywall] = useState(false)

  // 📢 Sistema de anúncios
  const { isPremium } = useSubscription()
  const { showInterstitial } = useInterstitialAd()

  // 🔄 Carregar dados do localStorage (vindos do Dashboard ou Upload)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dadosSalvos = localStorage.getItem('simplitax_dados_empresa')
      if (dadosSalvos) {
        try {
          const dadosParseados = JSON.parse(dadosSalvos)
          setDados({
            receitaBruta: dadosParseados.receitaBrutaMensal || 100000,
            despesasOperacionais: dadosParseados.despesasOperacionais || 30000,
            folhaAtual: dadosParseados.folhaPagamento || 20000,
            prolaboreAtual: dadosParseados.proLaboreAtual || 5000
          })
          // Calcular automaticamente se houver dados
          const res = calcularOtimizacao({
            receitaBruta: dadosParseados.receitaBrutaMensal || 100000,
            despesasOperacionais: dadosParseados.despesasOperacionais || 30000,
            folhaAtual: dadosParseados.folhaPagamento || 20000,
            prolaboreAtual: dadosParseados.proLaboreAtual || 5000
          })
          setResultado(res)
        } catch (erro) {
          console.error('Erro ao carregar dados:', erro)
        }
      }
    }
  }, [])

  const handleCalcular = async () => {
    // Verificar limite free
    if (!isPremium && hasReachedLimit('calculation')) {
      setShowPaywall(true)
      return
    }

    // Registrar uso
    if (!isPremium) {
      trackUsage('calculation')
    }

    const res = calcularOtimizacao(dados)
    setResultado(res)

    // Mostrar anúncio após calcular (apenas free)
    await showInterstitial()
  }

  const handleExportarPDF = async () => {
    if (!resultado) return

    // Verificar limite free
    if (!isPremium && hasReachedLimit('pdfExport')) {
      setShowPaywall(true)
      return
    }

    // Registrar uso
    if (!isPremium) {
      trackUsage('pdfExport')
    }
    
    try {
      await exportarParaPDF(resultado, {
        nomeEmpresa: 'Minha Empresa',
        nomeContador: 'Contador SimpliTax'
      })
      alert('✅ PDF gerado com sucesso!')

      // Mostrar anúncio após gerar PDF (apenas free)
      await showInterstitial()
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('❌ Erro ao gerar PDF. Tente novamente.')
    }
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">💎 A Equação de Ouro</h1>
          <p className="text-gray-600 text-lg">
            Descubra qual estratégia deixa MAIS DINHEIRO no seu bolso em 2026!
          </p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Formulário de Entrada */}
        <Card title="📊 Dados da Empresa">
          <Input
            label="Receita Bruta Mensal"
            type="number"
            value={dados.receitaBruta}
            onChange={(e) => setDados({ ...dados, receitaBruta: Number(e.target.value) })}
          />
          
          <Input
            label="Despesas Operacionais"
            type="number"
            value={dados.despesasOperacionais}
            onChange={(e) => setDados({ ...dados, despesasOperacionais: Number(e.target.value) })}
          />
          
          <Input
            label="Folha de Pagamento Atual"
            type="number"
            value={dados.folhaAtual}
            onChange={(e) => setDados({ ...dados, folhaAtual: Number(e.target.value) })}
          />
          
          <Input
            label="Pró-labore Atual"
            type="number"
            value={dados.prolaboreAtual}
            onChange={(e) => setDados({ ...dados, prolaboreAtual: Number(e.target.value) })}
          />
          
          <Button onClick={handleCalcular} className="w-full mt-4">
            🧮 Calcular Otimização
          </Button>
        </Card>

        {/* Informações */}
        <Card title="💡 Como Funciona">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">🎯 Cenário 1: Manter Fator R</h4>
              <p className="text-sm text-blue-800">
                Aumentar Pró-labore para 28% da receita. Fica no Anexo III (mais barato) mas paga mais INSS e IR.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">💰 Cenário 2: Dividendos Taxados</h4>
              <p className="text-sm text-green-800">
                Manter Pró-labore atual. Vai pro Anexo V mas paga 15% nos dividendos.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">⚡ A Mágica</h4>
              <p className="text-sm text-yellow-800">
                Calculamos os DOIS cenários e mostramos qual deixa mais dinheiro no seu bolso!
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Resultados */}
      {resultado && (
        <div className="space-y-6">
          {/* Verificar se já está otimizado */}
          {resultado.recomendacao.includes('PARABÉNS') ? (
            // Caso já otimizado - mostrar apenas sucesso
            <Card className="border-4 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-4 text-green-800">✅ Já Otimizado!</h2>
                <p className="text-xl mb-6 text-gray-700">{resultado.recomendacao}</p>
                
                <div className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-md">
                  <h3 className="font-bold text-lg mb-4">📋 Situação Atual</h3>
                  <div className="space-y-2 text-left">
                    {resultado.acoes.map((acao, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <p className="text-sm text-gray-700">{acao}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <p className="text-sm text-gray-600 mb-2">Continue monitorando mensalmente</p>
                  <Button 
                    onClick={handleExportarPDF}
                    className="inline-flex items-center gap-2"
                    variant="secondary"
                  >
                    <FileDown className="w-5 h-5" />
                    Exportar Comprovante
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            // Caso precise otimizar - mostrar recomendação
            <>
              <Card className="border-4 border-green-500">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">🏆 Recomendação</h2>
                  <p className="text-xl mb-4">{resultado.recomendacao}</p>
                  <div className="inline-block bg-green-100 px-6 py-3 rounded-lg mb-4">
                    <p className="text-sm text-gray-600">Economia Anual Estimada</p>
                    <p className="text-3xl font-bold text-green-700">
                      {formatarMoeda(resultado.economiaAnual)}
                    </p>
                  </div>
                  
                  {/* Botão Exportar PDF */}
                  <div className="mt-4">
                    <Button 
                      onClick={handleExportarPDF}
                      className="inline-flex items-center gap-2"
                      variant="secondary"
                    >
                      <FileDown className="w-5 h-5" />
                      Exportar Relatório PDF
                    </Button>
                  </div>
                </div>
              </Card>

            {/* Comparação dos Cenários */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cenário Atual */}
              <Card className="bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">📍 Cenário Atual</h3>
                <p className="text-sm text-gray-600 mb-4">{resultado.cenarioAtual.descricao}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Custo Empresa (Simples):</span>
                    <span className="font-semibold">{formatarMoeda(resultado.cenarioAtual.custoEmpresa)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Custo Sócio (IR+INSS+Div):</span>
                    <span className="font-semibold">{formatarMoeda(resultado.cenarioAtual.custoSocio)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2">
                    <span className="font-bold">Custo Total:</span>
                    <span className="font-bold text-red-600">{formatarMoeda(resultado.cenarioAtual.custoTotal)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-bold">Líquido Final:</span>
                    <span className="font-bold text-green-600">{formatarMoeda(resultado.cenarioAtual.liquidoFinal)}</span>
                  </div>
                </div>
              </Card>

              {/* Cenário Otimizado */}
              <Card className="bg-green-50 border-2 border-green-500">
                <h3 className="text-lg font-semibold mb-4">✨ Cenário Otimizado</h3>
                <p className="text-sm text-gray-600 mb-4">{resultado.cenarioOtimizado.descricao}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Custo Empresa (Simples):</span>
                    <span className="font-semibold">{formatarMoeda(resultado.cenarioOtimizado.custoEmpresa)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Custo Sócio (IR+INSS+Div):</span>
                    <span className="font-semibold">{formatarMoeda(resultado.cenarioOtimizado.custoSocio)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2">
                    <span className="font-bold">Custo Total:</span>
                    <span className="font-bold text-red-600">{formatarMoeda(resultado.cenarioOtimizado.custoTotal)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-bold">Líquido Final:</span>
                    <span className="font-bold text-green-600">{formatarMoeda(resultado.cenarioOtimizado.liquidoFinal)}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Ações Recomendadas */}
            <Card title="📋 Ações Práticas">
              <ol className="space-y-3">
                {resultado.acoes.map((acao, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-bold mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{acao}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </>
          )}
        </div>
      )}
      
      {/* Banner de anúncio fixo */}
      <AdBanner />

      {/* Paywall modal */}
      <Paywall
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        trigger="limit"
      />

      <Footer />
    </div>
    </>
  )
}
