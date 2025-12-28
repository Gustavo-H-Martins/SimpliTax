/**
 * 📤 PÁGINA DE UPLOAD - Uploader Universal SimpliTax
 * 
 * Página dedicada para upload de arquivos contábeis
 * Integra com o UniversalUploader e redireciona para o Otimizador
 * 
 * @author LMartins (Product Manager) - SimpliTax
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/NavBar'
import UniversalUploader, { DadosNormalizados } from '@/components/UniversalUploader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Footer from '@/components/Footer'
import { FileUp, TrendingUp, Zap } from 'lucide-react'

export default function UploadPage() {
  const router = useRouter()
  const [dadosRecebidos, setDadosRecebidos] = useState<DadosNormalizados | null>(null)

  const handleDadosProcessados = (dados: DadosNormalizados) => {
    console.log('✅ Dados recebidos:', dados)
    setDadosRecebidos(dados)
    
    // Salvar no formato unificado do sistema
    if (typeof window !== 'undefined') {
      const dadosUnificados = {
        receitaBrutaMensal: dados.receitaBruta || 0,
        despesasOperacionais: dados.despesas || 0,
        folhaPagamento: dados.folhaPagamento || 0,
        proLaboreAtual: dados.proLabore || 0
      }
      
      // Salvar para Dashboard, Otimizador e Relatório
      localStorage.setItem('simplitax_dados_empresa', JSON.stringify(dadosUnificados))
      localStorage.setItem('simplitax_dados_upload', JSON.stringify(dados))
    }
  }

  const handleContinuar = () => {
    router.push('/otimizador')
  }

  const handleNovoUpload = () => {
    setDadosRecebidos(null)
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-6 max-w-4xl">
      {/* CABEÇALHO */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
          <FileUp className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-3">📤 Upload Universal</h1>
        <p className="text-xl text-gray-600">
          Importe seus dados contábeis de qualquer sistema
        </p>
      </div>

      {/* CARDS DE BENEFÍCIOS */}
      {!dadosRecebidos && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="text-center p-4">
              <Zap className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-bold text-blue-900 mb-1">Rápido</h3>
              <p className="text-sm text-blue-700">
                Processamento em segundos
              </p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="text-center p-4">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-bold text-green-900 mb-1">Inteligente</h3>
              <p className="text-sm text-green-700">
                Auto-mapper de colunas
              </p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="text-center p-4">
              <FileUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-bold text-purple-900 mb-1">Universal</h3>
              <p className="text-sm text-purple-700">
                Aceita todos os formatos
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* UPLOADER */}
      {!dadosRecebidos && (
        <UniversalUploader 
          onDadosProcessados={handleDadosProcessados}
          aceitarImagens={true}
        />
      )}

      {/* PREVIEW DOS DADOS */}
      {dadosRecebidos && (
        <div className="space-y-6">
          {/* Card de Sucesso */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500">
            <div className="text-center p-6">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-green-900 mb-2">
                Dados Importados com Sucesso!
              </h2>
              <p className="text-green-700">
                Fonte: <strong>{dadosRecebidos.fonte}</strong> • 
                Confiança: <strong>{dadosRecebidos.confianca}%</strong>
              </p>
            </div>
          </Card>

          {/* Preview dos Valores */}
          <Card title="📊 Valores Detectados">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dadosRecebidos.receitaBruta && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Receita Bruta</p>
                  <p className="text-2xl font-bold text-blue-700">
                    R$ {dadosRecebidos.receitaBruta.toLocaleString('pt-BR')}
                  </p>
                </div>
              )}

              {dadosRecebidos.folhaPagamento && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Folha de Pagamento</p>
                  <p className="text-2xl font-bold text-green-700">
                    R$ {dadosRecebidos.folhaPagamento.toLocaleString('pt-BR')}
                  </p>
                </div>
              )}

              {dadosRecebidos.proLabore && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Pró-labore</p>
                  <p className="text-2xl font-bold text-purple-700">
                    R$ {dadosRecebidos.proLabore.toLocaleString('pt-BR')}
                  </p>
                </div>
              )}

              {dadosRecebidos.despesas && (
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600">Despesas</p>
                  <p className="text-2xl font-bold text-orange-700">
                    R$ {dadosRecebidos.despesas.toLocaleString('pt-BR')}
                  </p>
                </div>
              )}
            </div>

            {/* Avisos */}
            {dadosRecebidos.avisos.length > 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Avisos:</h4>
                <ul className="space-y-1">
                  {dadosRecebidos.avisos.map((aviso, index) => (
                    <li key={index} className="text-sm text-yellow-800">
                      • {aviso}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-4">
            <Button 
              variant="primary" 
              onClick={handleContinuar}
              className="flex-1"
            >
              Continuar para Otimizador →
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleNovoUpload}
            >
              Fazer Novo Upload
            </Button>
          </div>
        </div>
      )}

      {/* FAQ */}
      <Card title="❓ Perguntas Frequentes" className="mt-8">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              📋 Quais formatos são aceitos?
            </h4>
            <p className="text-sm text-gray-600">
              CSV, Excel (.xlsx/.xls), PDF, XML, TXT e Screenshots (PNG/JPG)
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              🔒 Meus dados estão seguros?
            </h4>
            <p className="text-sm text-gray-600">
              Sim! Todo processamento é feito localmente no seu navegador. 
              Nada é enviado para servidores externos.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              🤖 Como funciona o Auto-mapper?
            </h4>
            <p className="text-sm text-gray-600">
              Nossa IA identifica automaticamente colunas como "Receita Bruta", 
              "Folha", "Pró-labore" mesmo que tenham nomes diferentes em seu sistema.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              📸 E se eu tirar um print do sistema?
            </h4>
            <p className="text-sm text-gray-600">
              Perfeito! Nossa tecnologia de OCR (Tesseract.js) lê os valores 
              direto da imagem. É o jeito mais rápido de importar dados!
            </p>
          </div>
        </div>
      </Card>
    </div>
    </>
  )
}
