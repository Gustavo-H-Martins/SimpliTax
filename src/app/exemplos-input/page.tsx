/**
 * 📁 Página de Modelos de Input - SimpliTax
 * 
 * Exibe exemplos de arquivos que podem ser importados pelo sistema
 * Permite download dos arquivos de exemplo
 * 
 * @author LMartins (Product Manager) - SimpliTax
 */

'use client'

import { useRouter } from 'next/navigation'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FileText, FileSpreadsheet, FileCode, Image, Download, CheckCircle } from 'lucide-react'

export default function ExemplosInputPage() {
  const router = useRouter()

  const formatos = [
    {
      icon: FileSpreadsheet,
      nome: 'CSV',
      extensao: '.csv',
      descricao: 'Formato universal de planilha, compatível com Excel e Google Sheets',
      exemplo: `Receita Bruta,Despesas,Folha Pagamento,Pró-labore
100000,30000,15000,5000`,
      download: '/docs/exemplos/exemplo-dados-fiscais.csv',
      cor: 'text-green-600 bg-green-50'
    },
    {
      icon: FileSpreadsheet,
      nome: 'Excel',
      extensao: '.xlsx',
      descricao: 'Planilha do Microsoft Excel com fórmulas e formatação',
      exemplo: 'Crie uma planilha com colunas: Receita Bruta, Despesas, Folha Pagamento, Pró-labore',
      download: null,
      cor: 'text-emerald-600 bg-emerald-50',
      instrucoes: [
        'Abra o Microsoft Excel ou Google Sheets',
        'Crie as colunas: Receita Bruta, Despesas, Folha Pagamento, Pró-labore',
        'Preencha com valores numéricos',
        'Salve como .xlsx'
      ]
    },
    {
      icon: FileText,
      nome: 'Texto',
      extensao: '.txt',
      descricao: 'Arquivo de texto simples com valores separados por linha',
      exemplo: `Receita Bruta: 100000
Despesas: 30000
Folha Pagamento: 15000
Pró-labore: 5000`,
      download: '/docs/exemplos/exemplo-dados-fiscais.txt',
      cor: 'text-blue-600 bg-blue-50'
    },
    {
      icon: FileCode,
      nome: 'XML',
      extensao: '.xml',
      descricao: 'Formato estruturado para integração com sistemas contábeis',
      exemplo: `<DadosFiscais>
  <ReceitaBruta>100000</ReceitaBruta>
  <Despesas>30000</Despesas>
  <FolhaPagamento>15000</FolhaPagamento>
</DadosFiscais>`,
      download: '/docs/exemplos/exemplo-dados-fiscais.xml',
      cor: 'text-orange-600 bg-orange-50'
    },
    {
      icon: FileText,
      nome: 'PDF',
      extensao: '.pdf',
      descricao: 'Documento com dados fiscais (usa OCR para extração)',
      exemplo: 'Crie um documento com os dados fiscais e exporte como PDF',
      download: null,
      cor: 'text-red-600 bg-red-50',
      instrucoes: [
        'Crie um documento no Word ou Google Docs',
        'Adicione os dados fiscais em formato legível',
        'Exporte/Salve como PDF',
        'O SimpliTax usa OCR para extrair automaticamente'
      ]
    },
    {
      icon: Image,
      nome: 'Imagem',
      extensao: '.png, .jpg',
      descricao: 'Screenshot ou foto de planilha/relatório (usa AI Vision)',
      exemplo: 'Tire um screenshot de uma planilha ou relatório contábil',
      download: null,
      cor: 'text-purple-600 bg-purple-50',
      instrucoes: [
        'Tire um screenshot da planilha ou relatório',
        'Certifique-se que o texto está legível',
        'Use boa resolução (mínimo 1024x768)',
        'Fundo claro e texto escuro funcionam melhor'
      ]
    }
  ]

  const camposReconhecidos = [
    { nome: 'Receita Bruta', aliases: 'Faturamento, Vendas, Receita' },
    { nome: 'Despesas Operacionais', aliases: 'Custos, Gastos, Despesas' },
    { nome: 'Folha de Pagamento', aliases: 'Salários, Pessoal, Funcionários' },
    { nome: 'Pró-labore', aliases: 'Retirada, Sócios, Pro-labore' },
    { nome: 'Simples Nacional', aliases: 'DAS, Impostos, Tributos' }
  ]

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Cabeçalho */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-3">📁 Modelos de Input</h1>
          <p className="text-xl text-gray-600">
            Exemplos de arquivos que você pode importar no SimpliTax
          </p>
        </div>

        {/* Formatos Aceitos */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">📂 Formatos Aceitos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formatos.map((formato, index) => {
              const Icon = formato.icon
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${formato.cor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2">
                    {formato.nome} <span className="text-sm text-gray-500">{formato.extensao}</span>
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    {formato.descricao}
                  </p>

                  {/* Exemplo de código */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4 text-xs font-mono overflow-x-auto">
                    <pre className="text-gray-700 whitespace-pre-wrap">{formato.exemplo}</pre>
                  </div>

                  {/* Instruções (se houver) */}
                  {formato.instrucoes && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Como criar:</p>
                      <ol className="text-xs text-gray-600 space-y-1">
                        {formato.instrucoes.map((instrucao, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">{i + 1}.</span>
                            <span>{instrucao}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Botão de Download */}
                  {formato.download ? (
                    <a 
                      href={formato.download} 
                      download
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                    >
                      <Download className="w-4 h-4" />
                      Baixar Exemplo
                    </a>
                  ) : (
                    <div className="text-center text-xs text-gray-500 italic">
                      Crie manualmente seguindo as instruções
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>

        {/* Campos Reconhecidos */}
        <Card className="p-6 mb-10">
          <h2 className="text-2xl font-bold mb-4">🔍 Campos Reconhecidos Automaticamente</h2>
          <p className="text-gray-600 mb-6">
            O SimpliTax identifica automaticamente estes campos, mesmo com nomes diferentes:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {camposReconhecidos.map((campo, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-800">{campo.nome}</h4>
                  <p className="text-sm text-gray-600">
                    Também reconhece: <span className="italic">{campo.aliases}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Como Usar */}
        <Card className="p-6 mb-10 bg-gradient-to-br from-blue-50 to-purple-50">
          <h2 className="text-2xl font-bold mb-4">🚀 Como Usar</h2>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
              <div>
                <strong>Baixe um exemplo</strong> ou crie seu próprio arquivo seguindo o formato
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
              <div>
                <strong>Acesse a página de Upload</strong> clicando no botão abaixo
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
              <div>
                <strong>Arraste e solte</strong> o arquivo ou clique para selecionar
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
              <div>
                <strong>Revise os dados</strong> extraídos automaticamente
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">5</span>
              <div>
                <strong>Continue para o Otimizador</strong> e veja sua economia!
              </div>
            </li>
          </ol>
          
          <div className="mt-6 flex gap-3">
            <Button 
              variant="primary" 
              onClick={() => router.push('/upload')}
              className="flex-1"
            >
              📤 Ir para Upload
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => router.push('/')}
              className="flex-1"
            >
              🏠 Voltar ao Início
            </Button>
          </div>
        </Card>

        {/* Dicas */}
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            💡 Dicas para Melhor Reconhecimento
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">●</span>
              Use nomes de colunas claros e em português
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">●</span>
              Valores numéricos sem cifrão (R$) funcionam melhor
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">●</span>
              Separe milhares com ponto ou nada (100000 ou 100.000)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">●</span>
              Para imagens, use boa resolução e fundo claro
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">●</span>
              PDFs com texto selecionável funcionam melhor que imagens escaneadas
            </li>
          </ul>
        </Card>
      </div>

      <Footer />
    </>
  )
}
