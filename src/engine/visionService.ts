/**
 * 📸 AI DATA VISION - Screenshot to Data
 * 
 * Módulo que transforma prints de sistemas contábeis em dados estruturados!
 * 
 * 💡 INSIGHT DA LMARTINS:
 * "Por que o contador precisa DIGITAR tudo? Ele já tem os dados na tela!
 * Deixe ele tirar um print e pronto - a IA lê e popula automaticamente."
 * 
 * 🎯 O QUE ELE FAZ:
 * 1. Recebe uma imagem (screenshot do sistema contábil)
 * 2. Usa OCR (Tesseract.js) para extrair texto
 * 3. Busca padrões: "Receita Bruta", "Folha", "Simples Nacional"
 * 4. Retorna JSON pronto para o SimpliTaxEngine
 * 
 * 🚀 FUTURO: Integração com Google Vision API ou Azure Computer Vision
 * 
 * @author LMartins (Product Manager) - SimpliTax
 */

import Tesseract from 'tesseract.js'

// ============================================================================
// 📊 INTERFACES
// ============================================================================

export interface DadosExtraidos {
  receitaBruta?: number
  folhaPagamento?: number
  proLabore?: number
  simples?: number
  confianca: number  // 0-100: quão confiante a IA está nos dados
  campos: {
    campo: string
    valor: string | number
    confianca: number
    posicao?: { x: number; y: number }
  }[]
  avisos: string[]
}

export interface ConfigVision {
  idioma?: string  // Default: 'por' (Português)
  modoDebug?: boolean
  timeout?: number  // Milissegundos (default: 30000)
}

// ============================================================================
// 🔍 PADRÕES DE RECONHECIMENTO
// ============================================================================

/**
 * 🎯 Regex patterns para identificar campos fiscais em textos extraídos
 * 
 * A LMartins pediu para ser MUITO tolerante aqui. Sistemas contábeis são bagunçados!
 * Aceita variações como: "Receita Bruta", "Rec. Bruta", "RECEITA BRUTA MENSAL"
 */
const PADROES_FISCAIS = {
  receitaBruta: [
    /receita\s*bruta[:\s]*r?\$?\s*([\d.,]+)/i,
    /rec\.\s*bruta[:\s]*r?\$?\s*([\d.,]+)/i,
    /faturamento[:\s]*r?\$?\s*([\d.,]+)/i,
    /vendas\s*totais[:\s]*r?\$?\s*([\d.,]+)/i
  ],
  folhaPagamento: [
    /folha\s*de?\s*pagamento[:\s]*r?\$?\s*([\d.,]+)/i,
    /folha\s*sal[aá]rios?[:\s]*r?\$?\s*([\d.,]+)/i,
    /despesas?\s*(?:com\s*)?pessoal[:\s]*r?\$?\s*([\d.,]+)/i,
    /gastos?\s*(?:com\s*)?funcion[aá]rios[:\s]*r?\$?\s*([\d.,]+)/i
  ],
  proLabore: [
    /pr[oó][- ]?labore[:\s]*r?\$?\s*([\d.,]+)/i,
    /remunera[çc][ãa]o\s*(?:do\s*)?s[óo]cios?[:\s]*r?\$?\s*([\d.,]+)/i,
    /retirada\s*(?:do\s*)?titular[:\s]*r?\$?\s*([\d.,]+)/i
  ],
  simples: [
    /simples\s*nacional[:\s]*r?\$?\s*([\d.,]+)/i,
    /das[:\s]*r?\$?\s*([\d.,]+)/i,
    /tributos?\s*simples[:\s]*r?\$?\s*([\d.,]+)/i
  ]
}

// ============================================================================
// 🤖 FUNÇÕES PRINCIPAIS
// ============================================================================

/**
 * 💎 FUNÇÃO PRINCIPAL: Processar Screenshot
 * 
 * @param imagem - File object, base64 string, ou URL da imagem
 * @param config - Configurações opcionais
 * @returns Dados extraídos estruturados
 */
export async function processarScreenshot(
  imagem: File | string,
  config: ConfigVision = {}
): Promise<DadosExtraidos> {
  
  const {
    idioma = 'por',
    modoDebug = false,
    timeout = 30000
  } = config

  const resultado: DadosExtraidos = {
    confianca: 0,
    campos: [],
    avisos: []
  }

  try {
    // 🔍 PASSO 1: Executar OCR na imagem
    if (modoDebug) console.log('🔍 Iniciando OCR...')
    
    const { data } = await Tesseract.recognize(
      imagem,
      idioma,
      {
        logger: modoDebug ? (m) => console.log(m) : undefined
      }
    )

    const textoExtraido = data.text
    if (modoDebug) {
      console.log('📝 Texto extraído:')
      console.log(textoExtraido)
    }

    // 🎯 PASSO 2: Buscar padrões fiscais no texto
    const camposEncontrados = extrairCamposFiscais(textoExtraido)
    resultado.campos = camposEncontrados

    // 💰 PASSO 3: Preencher valores estruturados
    for (const campo of camposEncontrados) {
      switch (campo.campo) {
        case 'receitaBruta':
          resultado.receitaBruta = Number(campo.valor)
          break
        case 'folhaPagamento':
          resultado.folhaPagamento = Number(campo.valor)
          break
        case 'proLabore':
          resultado.proLabore = Number(campo.valor)
          break
        case 'simples':
          resultado.simples = Number(campo.valor)
          break
      }
    }

    // 📊 PASSO 4: Calcular confiança geral
    resultado.confianca = calcularConfiancaGeral(camposEncontrados)

    // ⚠️ PASSO 5: Gerar avisos se necessário
    if (resultado.confianca < 50) {
      resultado.avisos.push('⚠️ Confiança baixa! Verifique os dados manualmente.')
    }
    if (!resultado.receitaBruta) {
      resultado.avisos.push('❌ Receita Bruta não encontrada.')
    }
    if (!resultado.folhaPagamento && !resultado.proLabore) {
      resultado.avisos.push('❌ Folha de Pagamento não encontrada.')
    }

    return resultado

  } catch (error) {
    console.error('❌ Erro ao processar imagem:', error)
    resultado.avisos.push(`Erro: ${error instanceof Error ? error.message : 'Desconhecido'}`)
    return resultado
  }
}

// ============================================================================
// 🔧 FUNÇÕES AUXILIARES
// ============================================================================

/**
 * 🎯 Extrair campos fiscais do texto usando regex
 */
function extrairCamposFiscais(texto: string): DadosExtraidos['campos'] {
  const campos: DadosExtraidos['campos'] = []

  // Para cada tipo de campo (receita, folha, pró-labore, simples)
  for (const [nomeCampo, padroes] of Object.entries(PADROES_FISCAIS)) {
    for (const padrao of padroes) {
      const match = texto.match(padrao)
      
      if (match && match[1]) {
        const valorTexto = match[1]
        const valorNumerico = converterParaNumero(valorTexto)
        
        campos.push({
          campo: nomeCampo,
          valor: valorNumerico,
          confianca: 80  // Confiança padrão (pode ser refinada)
        })
        
        break // Encontrou, não precisa testar outros padrões
      }
    }
  }

  return campos
}

/**
 * 💵 Converter string monetária para número
 * Exemplos: "1.234,56" → 1234.56 | "R$ 1234.56" → 1234.56
 */
function converterParaNumero(valorTexto: string): number {
  // Remove símbolos de moeda e espaços
  let limpo = valorTexto.replace(/[R$\s]/g, '')
  
  // Detecta formato BR (1.234,56) vs US (1,234.56)
  const temPontoVirgula = limpo.includes(',')
  const temPonto = limpo.includes('.')
  
  if (temPontoVirgula && temPonto) {
    // Formato BR: 1.234,56
    limpo = limpo.replace(/\./g, '').replace(',', '.')
  } else if (temPontoVirgula) {
    // Apenas vírgula: 1234,56
    limpo = limpo.replace(',', '.')
  }
  // Se apenas ponto: já está ok (1234.56)
  
  return parseFloat(limpo)
}

/**
 * 📊 Calcular confiança geral baseado nos campos encontrados
 */
function calcularConfiancaGeral(campos: DadosExtraidos['campos']): number {
  if (campos.length === 0) return 0
  
  // Média ponderada da confiança dos campos
  let somaConfianca = 0
  let somaPesos = 0
  
  for (const campo of campos) {
    // Receita Bruta tem peso 2 (mais importante!)
    const peso = campo.campo === 'receitaBruta' ? 2 : 1
    somaConfianca += campo.confianca * peso
    somaPesos += peso
  }
  
  return Math.round(somaConfianca / somaPesos)
}

// ============================================================================
// 🚀 FUNÇÕES FUTURAS (Placeholder para APIs externas)
// ============================================================================

/**
 * 🎨 FUTURO: Google Vision API
 * 
 * Para produção, trocar Tesseract.js por Google Vision ou Azure Computer Vision
 * que têm precisão MUITO maior (especialmente para tabelas)
 */
export async function processarComGoogleVision(
  imagem: File | string,
  apiKey: string
): Promise<DadosExtraidos> {
  // TODO: Implementar quando tiver API Key
  console.warn('⚠️ Google Vision ainda não implementado. Usando Tesseract.js como fallback.')
  return processarScreenshot(imagem)
}

/**
 * 🔷 FUTURO: Azure Computer Vision
 */
export async function processarComAzureVision(
  imagem: File | string,
  endpoint: string,
  apiKey: string
): Promise<DadosExtraidos> {
  // TODO: Implementar quando tiver credenciais Azure
  console.warn('⚠️ Azure Vision ainda não implementado. Usando Tesseract.js como fallback.')
  return processarScreenshot(imagem)
}

// ============================================================================
// 🎓 EXEMPLO DE USO
// ============================================================================

/**
 * 📚 Como usar no seu componente React:
 * 
 * ```tsx
 * import { processarScreenshot } from '@/engine/visionService'
 * 
 * const handleUpload = async (file: File) => {
 *   const dados = await processarScreenshot(file, { modoDebug: true })
 *   
 *   if (dados.confianca > 70) {
 *     // Dados confiáveis! Popular o formulário
 *     setReceita(dados.receitaBruta)
 *     setFolha(dados.folhaPagamento)
 *   } else {
 *     alert('⚠️ Não consegui ler com certeza. Confira os dados!')
 *   }
 * }
 * ```
 */
