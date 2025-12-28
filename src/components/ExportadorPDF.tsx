/**
 * 📄 EXPORTADOR PDF - Relatórios Elegantes do SimpliTax
 * 
 * 💡 INSIGHT DA LMARTINS:
 * "O contador precisa entregar um relatório BONITO para o cliente.
 * Não adianta ter os dados certos se o PDF parecer feio e confuso!"
 * 
 * 🎯 O QUE ELE FAZ:
 * 1. Pega o resultado do Otimizador
 * 2. Cria um PDF profissional com logo + gráficos
 * 3. Mostra antes/depois de forma CLARA
 * 4. Destaca a economia em REAIS
 * 
 * 🎨 DESIGN:
 * - Cabeçalho: "Relatório de Otimização Fiscal 2026 - SimpliTax"
 * - Gráfico comparativo (antes vs depois)
 * - Tabela de ações recomendadas
 * - Rodapé: "Gerado pelo SimpliTax em [data]"
 * 
 * @author LMartins (Product Manager) - SimpliTax
 */

'use client'

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { ResultadoOtimizacao } from '@/engine/otimizador'

// ============================================================================
// 📊 INTERFACES
// ============================================================================

export interface OpcoesExportacao {
  incluirGraficos?: boolean      // Default: true
  incluirTabelas?: boolean       // Default: true
  nomeEmpresa?: string           // Personalizar relatório
  nomeContador?: string          // Assinatura do contador
  logo?: string                  // Base64 da logo da empresa
}

// ============================================================================
// 📄 FUNÇÃO PRINCIPAL: Exportar para PDF
// ============================================================================

/**
 * 💎 EXPORTAR OTIMIZAÇÃO PARA PDF
 * 
 * @param resultado - Dados do otimizador
 * @param opcoes - Configurações opcionais
 * @returns Promise que resolve quando o download iniciar
 */
export async function exportarParaPDF(
  resultado: ResultadoOtimizacao,
  opcoes: OpcoesExportacao = {}
): Promise<void> {
  
  const {
    incluirGraficos = true,
    incluirTabelas = true,
    nomeEmpresa = 'Empresa',
    nomeContador = 'Contador',
    logo
  } = opcoes

  // 🎨 CRIAR DOCUMENTO PDF
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // Configurações de layout
  const margemEsq = 20
  const margemDir = 190
  const margemTop = 20
  let posY = margemTop

  // ========================================================================
  // 🎨 CABEÇALHO
  // ========================================================================
  
  // Logo (se fornecida)
  if (logo) {
    doc.addImage(logo, 'PNG', margemEsq, posY, 30, 30)
    posY += 35
  }

  // Título principal
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(37, 99, 235) // Azul SimpliTax
  doc.text('SimpliTax', margemEsq, posY)
  
  posY += 8
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text('Relatorio de Otimizacao Fiscal', margemEsq, posY)
  
  posY += 6
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text(`Empresa: ${nomeEmpresa}`, margemEsq, posY)
  
  posY += 5
  const dataAtual = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
  doc.text(`Gerado em: ${dataAtual}`, margemEsq, posY)

  // Linha separadora
  posY += 5
  doc.setDrawColor(200, 200, 200)
  doc.line(margemEsq, posY, margemDir, posY)
  posY += 10

  // ========================================================================
  // 💰 DESTAQUE: ECONOMIA
  // ========================================================================
  
  doc.setFillColor(34, 197, 94) // Verde
  doc.roundedRect(margemEsq, posY, 170, 30, 3, 3, 'F')
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('ECONOMIA ANUAL ESTIMADA', margemEsq + 5, posY + 10)
  
  doc.setFontSize(24)
  const economiaTexto = formatarMoeda(resultado.economiaAnual)
  doc.text(economiaTexto, margemEsq + 5, posY + 23)
  
  posY += 40

  // ========================================================================
  // 📊 RECOMENDAÇÃO
  // ========================================================================
  
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('Recomendacao', margemEsq, posY)
  
  posY += 10
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(50, 50, 50)
  
  // Quebrar texto longo em múltiplas linhas
  const linhasRecomendacao = doc.splitTextToSize(resultado.recomendacao, 170)
  doc.text(linhasRecomendacao, margemEsq, posY)
  posY += linhasRecomendacao.length * 6 + 12

  // ========================================================================
  // 📋 COMPARAÇÃO DE CENÁRIOS
  // ========================================================================
  
  if (incluirTabelas) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Comparacao de Cenarios', margemEsq, posY)
    posY += 10

    // CENÁRIO ATUAL
    doc.setFillColor(243, 244, 246) // Cinza claro
    doc.roundedRect(margemEsq, posY, 80, 50, 2, 2, 'F')
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Cenario Atual', margemEsq + 3, posY + 7)
    
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(50, 50, 50)
    
    const linhasAtual = doc.splitTextToSize(resultado.cenarioAtual.descricao, 74)
    doc.text(linhasAtual, margemEsq + 3, posY + 14)
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('Custo Total:', margemEsq + 3, posY + 30)
    doc.setFont('helvetica', 'normal')
    doc.text(formatarMoeda(resultado.cenarioAtual.custoTotal), margemEsq + 3, posY + 36)
    
    doc.setFont('helvetica', 'bold')
    doc.text('Liquido Final:', margemEsq + 3, posY + 42)
    doc.setFont('helvetica', 'normal')
    doc.text(formatarMoeda(resultado.cenarioAtual.liquidoFinal), margemEsq + 3, posY + 48)

    // CENÁRIO OTIMIZADO
    doc.setFillColor(220, 252, 231) // Verde claro
    doc.setDrawColor(34, 197, 94) // Borda verde
    doc.setLineWidth(0.5)
    doc.roundedRect(margemEsq + 90, posY, 80, 50, 2, 2, 'FD')
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Cenario Otimizado', margemEsq + 93, posY + 7)
    
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(50, 50, 50)
    
    const linhasOtimizado = doc.splitTextToSize(resultado.cenarioOtimizado.descricao, 74)
    doc.text(linhasOtimizado, margemEsq + 93, posY + 14)
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('Custo Total:', margemEsq + 93, posY + 30)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(50, 50, 50)
    doc.text(formatarMoeda(resultado.cenarioOtimizado.custoTotal), margemEsq + 93, posY + 36)
    
    doc.setFont('helvetica', 'bold')
    doc.text('Liquido Final:', margemEsq + 93, posY + 42)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(34, 197, 94) // Verde
    doc.text(formatarMoeda(resultado.cenarioOtimizado.liquidoFinal), margemEsq + 93, posY + 48)
    
    posY += 60
  }

  // ========================================================================
  // 📋 AÇÕES RECOMENDADAS
  // ========================================================================
  
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('Acoes Praticas', margemEsq, posY)
  posY += 10

  resultado.acoes.forEach((acao, index) => {
    // Verificar se precisa nova página
    if (posY > 270) {
      doc.addPage()
      posY = 20
    }

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(37, 99, 235) // Azul
    doc.circle(margemEsq + 3, posY, 3, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    doc.text(String(index + 1), margemEsq + 1.8, posY + 1.2)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    
    const linhasAcao = doc.splitTextToSize(acao, 160)
    doc.text(linhasAcao, margemEsq + 10, posY + 1)
    
    posY += linhasAcao.length * 5 + 5
  })

  // ========================================================================
  // 🎨 MARCA D'ÁGUA - LM TECH CONSULTING
  // ========================================================================
  
  // Adicionar marca d'água diagonal no centro
  doc.saveGraphicsState()
  doc.setGState({ opacity: 0.05 }) // Muito transparente
  doc.setFontSize(60)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(100, 100, 100)
  
  // Rotacionar texto 45 graus
  const centroX = 105
  const centroY = 148.5
  doc.text('LM TECH', centroX, centroY, {
    angle: 45,
    align: 'center'
  })
  
  doc.restoreGraphicsState()

  // ========================================================================
  // 📌 RODAPÉ
  // ========================================================================
  
  const rodapeY = 280
  
  // Linha separadora sutil
  doc.setDrawColor(220, 220, 220)
  doc.line(margemEsq, rodapeY - 3, margemDir, rodapeY - 3)
  
  // Texto do rodapé
  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(150, 150, 150)
  doc.text('SimpliTax - Transformando complexidade em clareza', margemEsq, rodapeY)
  doc.text(`Contador responsável: ${nomeContador}`, margemEsq, rodapeY + 4)
  
  // Logo LM Tech no rodapé
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text('Desenvolvido por LM Tech Consulting', margemEsq, rodapeY + 8)
  doc.setTextColor(37, 99, 235)
  doc.textWithLink('grupolmtech.com.br', margemEsq + 52, rodapeY + 8, {
    url: 'https://grupolmtech.com.br/'
  })

  // ========================================================================
  // 💾 SALVAR ARQUIVO
  // ========================================================================
  
  const nomeArquivo = `SimpliTax_${nomeEmpresa.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(nomeArquivo)
}

// ============================================================================
// 🖼️ EXPORTAR ELEMENTO HTML PARA PDF (Alternativa)
// ============================================================================

/**
 * 📸 EXPORTAR ELEMENTO HTML PARA PDF
 * 
 * Usa html2canvas para capturar um elemento visual da página
 * e inseri-lo no PDF. Útil para gráficos complexos.
 * 
 * @param elementoId - ID do elemento HTML a capturar
 * @param nomeArquivo - Nome do arquivo PDF (opcional)
 */
export async function exportarElementoParaPDF(
  elementoId: string,
  nomeArquivo: string = 'relatorio.pdf'
): Promise<void> {
  
  const elemento = document.getElementById(elementoId)
  
  if (!elemento) {
    throw new Error(`❌ Elemento #${elementoId} não encontrado!`)
  }

  // 📸 Capturar como imagem
  const canvas = await html2canvas(elemento, {
    scale: 2,  // Melhor qualidade
    backgroundColor: '#ffffff'
  })

  // Criar PDF
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'mm'
  })

  // Calcular dimensões mantendo proporção
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
  pdf.save(nomeArquivo)
}

// ============================================================================
// 🔧 FUNÇÕES AUXILIARES
// ============================================================================

/**
 * 💵 Formatar valor para moeda brasileira
 */
function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

/**
 * 🎨 GERAR PDF COM GRÁFICO (Exemplo avançado)
 * 
 * Para usar com bibliotecas de gráficos como Chart.js ou Recharts
 */
export async function exportarComGrafico(
  resultado: ResultadoOtimizacao,
  graficoElementoId: string,
  opcoes: OpcoesExportacao = {}
): Promise<void> {
  
  // 1. Gerar PDF básico
  await exportarParaPDF(resultado, opcoes)
  
  // 2. Capturar gráfico como imagem
  const elemento = document.getElementById(graficoElementoId)
  if (!elemento) {
    console.warn(`⚠️ Gráfico #${graficoElementoId} não encontrado. PDF gerado sem gráfico.`)
    return
  }

  const canvas = await html2canvas(elemento)
  const imgData = canvas.toDataURL('image/png')

  // 3. TODO: Inserir imagem no PDF existente
  // (Requer lógica mais complexa de manipulação do jsPDF)
  console.log('📊 Gráfico capturado:', imgData.substring(0, 50) + '...')
}

// ============================================================================
// 🎓 EXEMPLO DE USO
// ============================================================================

/**
 * 📚 Como usar no seu componente React:
 * 
 * ```tsx
 * import { exportarParaPDF } from '@/components/ExportadorPDF'
 * import { calcularOtimizacao } from '@/engine/otimizador'
 * 
 * const handleExportar = async () => {
 *   const resultado = calcularOtimizacao(dados)
 *   
 *   await exportarParaPDF(resultado, {
 *     nomeEmpresa: 'Empresa XYZ Ltda',
 *     nomeContador: 'João Silva - CRC 123456',
 *     logo: logoBase64
 *   })
 *   
 *   alert('✅ PDF gerado com sucesso!')
 * }
 * ```
 * 
 * Para capturar um elemento HTML:
 * 
 * ```tsx
 * <div id="relatorio-visual">
 *   // Seu conteúdo aqui
 * </div>
 * 
 * <button onClick={() => exportarElementoParaPDF('relatorio-visual')}>
 *   Exportar PDF
 * </button>
 * ```
 */
