'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/NavBar'
import { gerarRelatorioAlivio, DadosSaudeFiscal } from '@/engine/saudeFiscal'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Footer from '@/components/Footer'
import { Copy, MessageCircle, FileText } from 'lucide-react'

export default function RelatorioAlivioPage() {
  const router = useRouter()
  const [nomeCliente, setNomeCliente] = useState('João Silva')
  const [copiado, setCopiado] = useState(false)
  
  // Dados de exemplo: ANTES da otimização
  const [dadosAntigos, setDadosAntigos] = useState<DadosSaudeFiscal>({
    receitaBrutaMensal: 100000,
    folhaPagamento: 15000,
    proLaboreAtual: 5000
  })
  
  // Dados DEPOIS da otimização
  const [dadosNovos, setDadosNovos] = useState<DadosSaudeFiscal>({
    receitaBrutaMensal: 100000,
    folhaPagamento: 15000,
    proLaboreAtual: 13000
  })

  // 🔄 Carregar dados do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dadosSalvos = localStorage.getItem('simplitax_dados_empresa')
      if (dadosSalvos) {
        try {
          const dados = JSON.parse(dadosSalvos)
          setDadosAntigos({
            receitaBrutaMensal: dados.receitaBrutaMensal || 100000,
            folhaPagamento: dados.folhaPagamento || 15000,
            proLaboreAtual: dados.proLaboreAtual || 5000
          })
          // Dados novos = simulação com ajuste do pró-labore para 28%
          const proLaboreOtimizado = (dados.receitaBrutaMensal || 100000) * 0.28 - (dados.folhaPagamento || 15000)
          setDadosNovos({
            receitaBrutaMensal: dados.receitaBrutaMensal || 100000,
            folhaPagamento: dados.folhaPagamento || 15000,
            proLaboreAtual: Math.max(proLaboreOtimizado, dados.proLaboreAtual || 5000)
          })
        } catch (erro) {
          console.error('Erro ao carregar dados:', erro)
        }
      }
    }
  }, [])

  const relatorio = gerarRelatorioAlivio(nomeCliente, dadosAntigos, dadosNovos)

  const copiarMensagem = () => {
    navigator.clipboard.writeText(relatorio.mensagemWhatsApp)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const abrirWhatsApp = () => {
    const mensagemEncoded = encodeURIComponent(relatorio.mensagemWhatsApp)
    window.open(`https://wa.me/?text=${mensagemEncoded}`, '_blank')
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">💬 Relatório de Alívio</h1>
        <p className="text-gray-600 text-lg">
          A mensagem perfeita para enviar ao seu cliente! (Dica de Ouro #2 da LMartins)
        </p>
      </div>

      {/* Configuração */}
      <Card title="⚙️ Configuração" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome do Cliente"
            value={nomeCliente}
            onChange={(e) => setNomeCliente(e.target.value)}
            placeholder="Ex: João Silva"
          />
          
          <div className="flex items-end">
            <Button 
              variant="primary" 
              className="w-full"
              onClick={() => {
                // Recarregar com novo nome
                window.location.reload()
              }}
            >
              Atualizar Relatório
            </Button>
          </div>
        </div>
      </Card>

      {/* Resultado: Economia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">💰 Economia Mensal</p>
            <p className="text-4xl font-bold text-green-700">
              R$ {relatorio.economiaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">🚀 Economia Anual</p>
            <p className="text-4xl font-bold text-blue-700">
              R$ {relatorio.economiaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </Card>
      </div>

      {/* Ajuste Realizado */}
      <Card title="🔧 Ajuste Realizado" className="mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-600 mb-1">Pró-labore Anterior</p>
              <p className="text-xl font-bold text-gray-700">
                R$ {relatorio.ajusteRealizado.valorAntigo.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-3xl">→</span>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Pró-labore Novo</p>
              <p className="text-xl font-bold text-green-700">
                R$ {relatorio.ajusteRealizado.valorNovo.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Aumento de: 
              <span className="font-bold text-blue-600 ml-1">
                R$ {relatorio.ajusteRealizado.diferenca.toLocaleString('pt-BR')}
              </span>
            </p>
          </div>
        </div>
      </Card>

      {/* Mensagem para WhatsApp */}
      <Card className="mb-6 border-2 border-green-400">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="text-green-600" size={24} />
            <h2 className="text-xl font-semibold">Mensagem para WhatsApp</h2>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={copiarMensagem}
            >
              <Copy size={16} className="mr-1" />
              {copiado ? 'Copiado!' : 'Copiar'}
            </Button>
            <Button 
              variant="success" 
              size="sm"
              onClick={abrirWhatsApp}
            >
              <MessageCircle size={16} className="mr-1" />
              Enviar
            </Button>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
          <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
            {relatorio.mensagemWhatsApp}
          </pre>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            💡 <strong>Dica da LMartins:</strong> Esta mensagem foi criada especialmente para ser 
            enviada pelo WhatsApp! Copie e cole, ou clique em "Enviar" para abrir direto no WhatsApp Web.
          </p>
        </div>
      </Card>

      {/* Resumo Técnico */}
      <Card className="bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="text-gray-600" size={24} />
            <h2 className="text-xl font-semibold">Resumo Técnico (Para você)</h2>
          </div>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(relatorio.resumoTecnico)
            }}
          >
            <Copy size={16} className="mr-1" />
            Copiar
          </Button>
        </div>

        <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
          <pre className="whitespace-pre-wrap font-mono text-xs text-gray-700">
            {relatorio.resumoTecnico}
          </pre>
        </div>
      </Card>

      {/* Informações */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
        <h3 className="font-bold text-lg mb-3">🎯 Como Usar Este Recurso</h3>
        <ol className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="font-bold mr-2">1.</span>
            <span>Configure os dados da empresa no dashboard</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">2.</span>
            <span>Execute a otimização fiscal (Equação de Ouro)</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">3.</span>
            <span>Venha aqui e copie a mensagem pronta</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">4.</span>
            <span>Envie pro seu cliente pelo WhatsApp e impressione!</span>
          </li>
        </ol>
        
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            ⭐ <strong>O Diferencial do SimpliTax:</strong> Seu cliente não quer ver planilhas e 
            números complexos. Ele quer saber: <em>"Quanto economizei?"</em> e <em>"O que você fez?"</em>. 
            Esta mensagem responde exatamente isso em linguagem ultra simples!
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
    </>
  )
}
