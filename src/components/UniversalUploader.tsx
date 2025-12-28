/**
 * ☁️ UNIVERSAL UPLOADER - O Conversor Universal do SimpliTax
 * 
 * 💡 INSIGHT DA LMARTINS:
 * "O contador trabalha com DEZENAS de sistemas diferentes. Cada um exporta
 * num formato diferente. Vamos aceitar TUDO e normalizar internamente!"
 * 
 * 🎯 ACEITA:
 * - CSV / TSV (texto delimitado)
 * - Excel (.xlsx, .xls)
 * - PDF (extrai tabelas)
 * - XML (SPED, NFe)
 * - TXT (genérico)
 * - Screenshots (via AI Vision)
 * 
 * 💎 DIFERENCIAL: Área de Drag & Drop linda + "Auto-mapper inteligente"
 * 
 * @author LMartins (Product Manager) - SimpliTax
 */

'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { processarScreenshot } from '@/engine/visionService'
import { Card } from './ui/Card'

// ============================================================================
// 📊 INTERFACES
// ============================================================================

export interface DadosNormalizados {
  receitaBruta?: number
  despesas?: number
  folhaPagamento?: number
  proLabore?: number
  simples?: number
  fonte: string  // De onde vieram os dados
  confianca: number  // 0-100
  avisos: string[]
  dadosBrutos?: any  // Para debug
}

interface UniversalUploaderProps {
  onDadosProcessados: (dados: DadosNormalizados) => void
  aceitarImagens?: boolean  // Default: true
}

// ============================================================================
// 🎨 COMPONENTE PRINCIPAL
// ============================================================================

export default function UniversalUploader({ 
  onDadosProcessados,
  aceitarImagens = true 
}: UniversalUploaderProps) {
  
  const [processando, setProcessando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [arquivoAtual, setArquivoAtual] = useState<string | null>(null)

  // ========================================================================
  // 📤 DRAG & DROP HANDLER
  // ========================================================================
  
  const onDrop = useCallback(async (arquivosAceitos: File[]) => {
    if (arquivosAceitos.length === 0) return

    const arquivo = arquivosAceitos[0]
    setArquivoAtual(arquivo.name)
    setProcessando(true)
    setSucesso(false)
    setErro(null)

    try {
      const extensao = arquivo.name.split('.').pop()?.toLowerCase()
      let dados: DadosNormalizados

      // 🎯 Rotear para processador correto baseado na extensão
      switch (extensao) {
        case 'csv':
        case 'tsv':
          dados = await processarCSV(arquivo, extensao === 'tsv' ? '\t' : ',')
          break
        case 'xlsx':
        case 'xls':
          dados = await processarExcel(arquivo)
          break
        case 'pdf':
          dados = await processarPDF(arquivo)
          break
        case 'xml':
          dados = await processarXML(arquivo)
          break
        case 'txt':
          dados = await processarTexto(arquivo)
          break
        case 'png':
        case 'jpg':
        case 'jpeg':
          if (!aceitarImagens) {
            throw new Error('Upload de imagens está desabilitado')
          }
          dados = await processarImagem(arquivo)
          break
        default:
          throw new Error(`Formato não suportado: .${extensao}`)
      }

      // ✅ Sucesso! Enviar dados para o componente pai
      onDadosProcessados(dados)
      setSucesso(true)
      
      // Resetar após 3 segundos
      setTimeout(() => {
        setSucesso(false)
        setArquivoAtual(null)
      }, 3000)

    } catch (err) {
      console.error('❌ Erro ao processar arquivo:', err)
      setErro(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setProcessando(false)
    }
  }, [aceitarImagens, onDadosProcessados])

  // ========================================================================
  // 🎨 CONFIGURAÇÃO DO DROPZONE
  // ========================================================================
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'text/tab-separated-values': ['.tsv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/pdf': ['.pdf'],
      'text/xml': ['.xml'],
      'application/xml': ['.xml'],
      'text/plain': ['.txt'],
      ...(aceitarImagens && {
        'image/png': ['.png'],
        'image/jpeg': ['.jpg', '.jpeg']
      })
    },
    maxFiles: 1,
    multiple: false
  })

  // ========================================================================
  // 🎨 RENDER
  // ========================================================================

  return (
    <Card className="p-8">
      <div
        {...getRootProps()}
        className={`
          border-4 border-dashed rounded-2xl p-12 
          text-center cursor-pointer transition-all duration-300
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
          }
          ${processando ? 'opacity-60 cursor-wait' : ''}
          ${sucesso ? 'border-green-500 bg-green-50' : ''}
          ${erro ? 'border-red-500 bg-red-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {/* ÍCONE CENTRAL */}
        <div className="mb-6">
          {processando && (
            <Loader2 className="w-20 h-20 mx-auto text-blue-500 animate-spin" />
          )}
          {sucesso && !processando && (
            <CheckCircle className="w-20 h-20 mx-auto text-green-500" />
          )}
          {erro && !processando && (
            <AlertCircle className="w-20 h-20 mx-auto text-red-500" />
          )}
          {!processando && !sucesso && !erro && (
            <Upload className="w-20 h-20 mx-auto text-gray-400" />
          )}
        </div>

        {/* TEXTO */}
        <div className="space-y-2">
          {processando && (
            <>
              <h3 className="text-xl font-bold text-blue-700">
                Processando {arquivoAtual}...
              </h3>
              <p className="text-gray-600">
                A LMartins está lendo seus dados! ⚡
              </p>
            </>
          )}

          {sucesso && !processando && (
            <>
              <h3 className="text-2xl font-bold text-green-700">
                ✨ Dados lidos com sucesso!
              </h3>
              <p className="text-green-600 text-lg">
                A LMartins já está calculando sua economia... 🎯
              </p>
            </>
          )}

          {erro && !processando && (
            <>
              <h3 className="text-xl font-bold text-red-700">
                ❌ Ops! Algo deu errado
              </h3>
              <p className="text-red-600">{erro}</p>
              <p className="text-sm text-gray-500 mt-4">
                Arraste outro arquivo para tentar novamente
              </p>
            </>
          )}

          {!processando && !sucesso && !erro && (
            <>
              <h3 className="text-2xl font-bold text-gray-700">
                {isDragActive 
                  ? '📥 Solte o arquivo aqui!' 
                  : '☁️ Arraste seu arquivo aqui'
                }
              </h3>
              <p className="text-gray-500 mt-2">
                ou clique para selecionar
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                <span className="px-3 py-1 bg-white rounded-full text-xs border border-gray-300">
                  .csv
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-xs border border-gray-300">
                  .xlsx
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-xs border border-gray-300">
                  .pdf
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-xs border border-gray-300">
                  .xml
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-xs border border-gray-300">
                  .txt
                </span>
                {aceitarImagens && (
                  <span className="px-3 py-1 bg-white rounded-full text-xs border border-gray-300">
                    .png/.jpg
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* DICA DE OURO */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex gap-3">
          <FileText className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-yellow-900 mb-1">
              💡 Dica da LMartins
            </h4>
            <p className="text-sm text-yellow-800">
              Não sabe qual formato usar? Tire um <strong>screenshot</strong> do 
              seu sistema contábil! Nossa IA lê automaticamente os valores. 📸
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

// ============================================================================
// 🔧 PROCESSADORES POR FORMATO
// ============================================================================

/**
 * 📊 Processar CSV/TSV
 */
async function processarCSV(arquivo: File, delimitador: string): Promise<DadosNormalizados> {
  return new Promise((resolve, reject) => {
    Papa.parse(arquivo, {
      complete: (resultado) => {
        try {
          const dados = normalizarDados(resultado.data, 'CSV')
          resolve(dados)
        } catch (err) {
          reject(err)
        }
      },
      error: (erro) => reject(erro),
      delimiter: delimitador,
      header: true,
      skipEmptyLines: true
    })
  })
}

/**
 * 📗 Processar Excel
 */
async function processarExcel(arquivo: File): Promise<DadosNormalizados> {
  const buffer = await arquivo.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  
  // Pega a primeira aba
  const primeiraAba = workbook.SheetNames[0]
  const planilha = workbook.Sheets[primeiraAba]
  
  // Converte para JSON
  const dados = XLSX.utils.sheet_to_json(planilha)
  
  return normalizarDados(dados, 'Excel')
}

/**
 * 📄 Processar PDF (básico - precisa melhorias)
 */
async function processarPDF(arquivo: File): Promise<DadosNormalizados> {
  // TODO: Implementar extração de PDF com pdf-parse ou similar
  // Por enquanto, retorna erro amigável
  throw new Error('📄 PDF ainda não implementado! Use CSV, Excel ou Screenshot por enquanto.')
}

/**
 * 🏷️ Processar XML (SPED, NFe)
 */
async function processarXML(arquivo: File): Promise<DadosNormalizados> {
  const texto = await arquivo.text()
  
  // Busca tags comuns de XML fiscal
  const receita = extrairTagXML(texto, ['vBC', 'vNF', 'vProd'])
  const impostos = extrairTagXML(texto, ['vTotTrib', 'vISSQN'])
  
  return {
    receitaBruta: receita,
    simples: impostos,
    fonte: 'XML',
    confianca: receita ? 70 : 30,
    avisos: receita ? [] : ['⚠️ Não encontrei valores no XML. Verifique o formato.']
  }
}

/**
 * 📝 Processar TXT genérico
 */
async function processarTexto(arquivo: File): Promise<DadosNormalizados> {
  const texto = await arquivo.text()
  
  // Tenta detectar se é CSV disfarçado
  if (texto.includes(',') || texto.includes(';')) {
    return processarCSV(arquivo, texto.includes(';') ? ';' : ',')
  }
  
  // Senão, tenta extrair valores "à força"
  const numeros = texto.match(/\d+[.,]?\d*/g)?.map(n => parseFloat(n.replace(',', '.')))
  
  if (!numeros || numeros.length < 2) {
    throw new Error('❌ Arquivo de texto não reconhecido. Use CSV ou Excel.')
  }
  
  return {
    receitaBruta: numeros[0],
    folhaPagamento: numeros[1],
    fonte: 'TXT',
    confianca: 40,
    avisos: ['⚠️ Valores extraídos "à força". Confira se estão corretos!']
  }
}

/**
 * 📸 Processar Imagem (via AI Vision)
 */
async function processarImagem(arquivo: File): Promise<DadosNormalizados> {
  const resultado = await processarScreenshot(arquivo, { modoDebug: false })
  
  return {
    receitaBruta: resultado.receitaBruta,
    folhaPagamento: resultado.folhaPagamento,
    proLabore: resultado.proLabore,
    simples: resultado.simples,
    fonte: 'Screenshot (AI Vision)',
    confianca: resultado.confianca,
    avisos: resultado.avisos
  }
}

// ============================================================================
// 🎯 AUTO-MAPPER - A Inteligência do Sistema!
// ============================================================================

/**
 * 💎 NORMALIZAR DADOS - O Auto-mapper inteligente da LMartins!
 * 
 * Recebe dados "bagunçados" de qualquer fonte e tenta identificar
 * as colunas importantes automaticamente.
 */
function normalizarDados(dados: any[], fonte: string): DadosNormalizados {
  const avisos: string[] = []
  
  if (!dados || dados.length === 0) {
    throw new Error('❌ Arquivo vazio!')
  }

  const primeiraLinha = dados[0]
  const colunas = Object.keys(primeiraLinha)
  
  // 🎯 MAPEAMENTO INTELIGENTE DE COLUNAS
  const mapa = {
    receitaBruta: encontrarColuna(colunas, ['receita', 'bruta', 'faturamento', 'vendas']),
    despesas: encontrarColuna(colunas, ['despesa', 'custo', 'gasto']),
    folhaPagamento: encontrarColuna(colunas, ['folha', 'salario', 'pessoal', 'funcionario']),
    proLabore: encontrarColuna(colunas, ['prolabore', 'pro-labore', 'retirada', 'socio']),
    simples: encontrarColuna(colunas, ['simples', 'das', 'imposto', 'tributo'])
  }

  // 📊 Extrair valores da primeira linha de dados
  const resultado: DadosNormalizados = {
    fonte,
    confianca: 0,
    avisos,
    dadosBrutos: dados
  }

  let camposEncontrados = 0

  for (const [campo, coluna] of Object.entries(mapa)) {
    if (coluna) {
      const valor = primeiraLinha[coluna]
      if (valor) {
        const campoKey = campo as keyof DadosNormalizados
        if (campoKey === 'receitaBruta' || campoKey === 'despesas' || campoKey === 'folhaPagamento' || campoKey === 'proLabore' || campoKey === 'simples') {
          resultado[campoKey] = parseFloat(String(valor).replace(',', '.'))
          camposEncontrados++
        }
      }
    }
  }

  // Calcular confiança
  resultado.confianca = Math.round((camposEncontrados / 5) * 100)

  if (camposEncontrados === 0) {
    avisos.push('❌ Não consegui identificar os campos automaticamente.')
    avisos.push('💡 Renomeie as colunas para: "Receita Bruta", "Folha", "Pró-labore"')
  } else if (camposEncontrados < 3) {
    avisos.push('⚠️ Alguns campos não foram encontrados. Verifique se estão corretos.')
  }

  return resultado
}

/**
 * 🔍 Encontrar coluna que casa com termos de busca
 */
function encontrarColuna(colunas: string[], termosBusca: string[]): string | null {
  for (const coluna of colunas) {
    const colunaLower = coluna.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    
    for (const termo of termosBusca) {
      if (colunaLower.includes(termo)) {
        return coluna
      }
    }
  }
  return null
}

/**
 * 🏷️ Extrair valor de tags XML
 */
function extrairTagXML(xml: string, tags: string[]): number | undefined {
  for (const tag of tags) {
    const regex = new RegExp(`<${tag}>(.*?)</${tag}>`, 'i')
    const match = xml.match(regex)
    if (match && match[1]) {
      return parseFloat(match[1])
    }
  }
  return undefined
}
