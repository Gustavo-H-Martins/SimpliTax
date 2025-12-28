/**
 * 💬 WHATSAPP NOTIFIER - Sistema de Lembretes Inteligentes
 * 
 * 💡 INSIGHT DA LMARTINS:
 * "O contador tem 50 clientes. Ele esquece quem precisa ajustar o quê.
 * Vamos criar um 'robô assistente' que lembra ele TODO MÊS!"
 * 
 * 🎯 O QUE ELE FAZ:
 * 1. Monitora a data (dia 20 de cada mês)
 * 2. Lista empresas que precisam ajustar Fator R
 * 3. Gera mensagens personalizadas
 * 4. Integra com WhatsApp (Twilio, Evolution API, etc)
 * 
 * 🚀 FUTURO: Integração real com:
 * - Twilio API (WhatsApp Business)
 * - Evolution API (WhatsApp Web)
 * - Webhook para sistemas do contador
 * 
 * @author LMartins (Product Manager) - SimpliTax 2026
 */

import axios from 'axios'

// ============================================================================
// 📊 INTERFACES
// ============================================================================

export interface EmpresaMonitorada {
  id: string
  nomeEmpresa: string
  nomeContato: string  // Dono da empresa
  telefone: string     // Formato: +5511999999999
  receitaBruta: number
  folhaAtual: number
  proLaboreAtual: number
  fatorR: number
  ajusteNecessario: number  // Quanto precisa aumentar o Pró-labore
}

export interface ConfigWhatsApp {
  provider: 'twilio' | 'evolution' | 'manual'
  apiKey?: string
  apiUrl?: string
  numeroRemetente?: string  // Número do contador/escritório
}

export interface ResultadoEnvio {
  sucesso: boolean
  mensagensEnviadas: number
  erros: string[]
  log: {
    empresa: string
    telefone: string
    status: 'enviado' | 'falhou'
    mensagem?: string
  }[]
}

// ============================================================================
// 📅 VERIFICAÇÃO DE DATA
// ============================================================================

/**
 * 🗓️ VERIFICAR SE É DIA DE NOTIFICAÇÃO
 * 
 * Por padrão: Dia 20 de cada mês (10 dias antes do fechamento)
 * Pode ser customizado pelo contador
 */
export function isDiaDeNotificacao(diaDoMes: number = 20): boolean {
  const hoje = new Date()
  return hoje.getDate() === diaDoMes
}

/**
 * 📆 PRÓXIMA DATA DE NOTIFICAÇÃO
 */
export function proximaNotificacao(diaDoMes: number = 20): Date {
  const hoje = new Date()
  const proxima = new Date(hoje.getFullYear(), hoje.getMonth(), diaDoMes)
  
  // Se já passou, pegar o próximo mês
  if (proxima < hoje) {
    proxima.setMonth(proxima.getMonth() + 1)
  }
  
  return proxima
}

// ============================================================================
// 💬 GERAÇÃO DE MENSAGENS
// ============================================================================

/**
 * 💬 GERAR MENSAGEM PERSONALIZADA PARA WHATSAPP
 * 
 * Template amigável e urgente (mas não agressivo)
 */
export function gerarMensagemWhatsApp(empresa: EmpresaMonitorada): string {
  const { nomeContato, nomeEmpresa, ajusteNecessario } = empresa
  
  // Emojis para deixar mais amigável
  const mensagem = `
🤖 *SimpliTax - Alerta Fiscal*

Olá, ${nomeContato}! 👋

Aqui é a IA do SimpliTax com um lembrete importante sobre a *${nomeEmpresa}*.

📊 *Situação Atual:*
Faltam apenas *10 dias* para fechar o mês, e detectei que sua empresa precisa de um pequeno ajuste para manter a alíquota reduzida do Fator R.

💡 *Ação Necessária:*
Aumentar o Pró-labore em *R$ ${ajusteNecessario.toFixed(2)}* neste mês.

✅ *Por que fazer isso?*
Sem esse ajuste, seus impostos podem subir até 15% no Simples Nacional! Fazendo agora, você economiza e mantém tudo dentro da lei.

🎯 *Vamos economizar?*
Entre no SimpliTax para ver os detalhes completos e gerar o relatório para seu contador.

---
_Mensagem automática do SimpliTax_
`.trim()

  return mensagem
}

/**
 * 📋 GERAR RELATÓRIO RESUMIDO (Para o contador ver todas de uma vez)
 */
export function gerarRelatorioGeral(empresas: EmpresaMonitorada[]): string {
  const total = empresas.length
  const totalAjuste = empresas.reduce((soma, emp) => soma + emp.ajusteNecessario, 0)
  
  let relatorio = `📊 *Relatório Mensal - SimpliTax*\n\n`
  relatorio += `🚨 *${total} empresas precisam de atenção este mês!*\n\n`
  relatorio += `💰 Ajuste total necessário: R$ ${totalAjuste.toFixed(2)}\n\n`
  relatorio += `---\n\n`
  
  empresas.forEach((emp, index) => {
    relatorio += `${index + 1}. *${emp.nomeEmpresa}*\n`
    relatorio += `   Fator R: ${(emp.fatorR * 100).toFixed(1)}%\n`
    relatorio += `   Ajustar: R$ ${emp.ajusteNecessario.toFixed(2)}\n`
    relatorio += `   Contato: ${emp.nomeContato}\n\n`
  })
  
  relatorio += `---\n`
  relatorio += `_Use o SimpliTax para enviar notificações automáticas!_`
  
  return relatorio
}

// ============================================================================
// 📤 ENVIO DE MENSAGENS
// ============================================================================

/**
 * 📲 ENVIAR NOTIFICAÇÕES PARA LISTA DE EMPRESAS
 * 
 * @param empresas - Lista de empresas a notificar
 * @param config - Configuração do provedor WhatsApp
 * @returns Resultado do envio
 */
export async function enviarNotificacoes(
  empresas: EmpresaMonitorada[],
  config: ConfigWhatsApp
): Promise<ResultadoEnvio> {
  
  const resultado: ResultadoEnvio = {
    sucesso: false,
    mensagensEnviadas: 0,
    erros: [],
    log: []
  }

  for (const empresa of empresas) {
    try {
      const mensagem = gerarMensagemWhatsApp(empresa)
      
      // Enviar conforme o provider
      switch (config.provider) {
        case 'twilio':
          await enviarViaTwilio(empresa.telefone, mensagem, config)
          break
        case 'evolution':
          await enviarViaEvolution(empresa.telefone, mensagem, config)
          break
        case 'manual':
          // Apenas gera a mensagem, não envia
          console.log(`📱 Mensagem para ${empresa.nomeEmpresa}:`, mensagem)
          break
      }
      
      resultado.mensagensEnviadas++
      resultado.log.push({
        empresa: empresa.nomeEmpresa,
        telefone: empresa.telefone,
        status: 'enviado'
      })
      
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro desconhecido'
      resultado.erros.push(`${empresa.nomeEmpresa}: ${mensagemErro}`)
      resultado.log.push({
        empresa: empresa.nomeEmpresa,
        telefone: empresa.telefone,
        status: 'falhou',
        mensagem: mensagemErro
      })
    }
  }

  resultado.sucesso = resultado.erros.length === 0
  return resultado
}

// ============================================================================
// 🔌 INTEGRAÇÕES COM PROVEDORES
// ============================================================================

/**
 * 📞 ENVIAR VIA TWILIO (WhatsApp Business API)
 */
async function enviarViaTwilio(
  telefone: string,
  mensagem: string,
  config: ConfigWhatsApp
): Promise<void> {
  
  if (!config.apiKey || !config.numeroRemetente) {
    throw new Error('⚠️ API Key e Número Remetente são obrigatórios para Twilio')
  }

  // Formato Twilio: whatsapp:+5511999999999
  const para = `whatsapp:${telefone}`
  const de = `whatsapp:${config.numeroRemetente}`

  const response = await axios.post(
    'https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json',
    new URLSearchParams({
      From: de,
      To: para,
      Body: mensagem
    }),
    {
      auth: {
        username: 'YOUR_ACCOUNT_SID',
        password: config.apiKey
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )

  if (response.status !== 201) {
    throw new Error(`Twilio falhou: ${response.statusText}`)
  }
}

/**
 * 🚀 ENVIAR VIA EVOLUTION API (Open Source)
 */
async function enviarViaEvolution(
  telefone: string,
  mensagem: string,
  config: ConfigWhatsApp
): Promise<void> {
  
  if (!config.apiUrl || !config.apiKey) {
    throw new Error('⚠️ API URL e API Key são obrigatórios para Evolution')
  }

  const response = await axios.post(
    `${config.apiUrl}/message/sendText`,
    {
      number: telefone.replace(/\D/g, ''), // Remove caracteres não-numéricos
      text: mensagem
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.apiKey
      }
    }
  )

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(`Evolution API falhou: ${response.statusText}`)
  }
}

// ============================================================================
// ⏰ AGENDAMENTO (Simulação de Cron Job)
// ============================================================================

/**
 * ⏰ INICIAR MONITOR AUTOMÁTICO
 * 
 * Verifica a cada hora se é dia de notificação
 * Em produção, usar um cron job real (node-cron, agenda.js, etc)
 */
export function iniciarMonitorAutomatico(
  callback: () => Promise<void>,
  intervaloMinutos: number = 60
): NodeJS.Timeout {
  
  console.log('🤖 Monitor SimpliTax iniciado!')
  console.log(`📅 Próxima verificação: ${proximaNotificacao()}`)
  
  const intervalo = setInterval(async () => {
    if (isDiaDeNotificacao()) {
      console.log('📢 É dia de notificação! Executando callback...')
      try {
        await callback()
      } catch (error) {
        console.error('❌ Erro no callback:', error)
      }
    }
  }, intervaloMinutos * 60 * 1000)

  return intervalo
}

/**
 * 🛑 PARAR MONITOR
 */
export function pararMonitor(intervalo: NodeJS.Timeout): void {
  clearInterval(intervalo)
  console.log('🛑 Monitor SimpliTax parado.')
}

// ============================================================================
// 🎓 EXEMPLO DE USO
// ============================================================================

/**
 * 📚 Como usar no seu sistema:
 * 
 * ```typescript
 * import { 
 *   enviarNotificacoes, 
 *   iniciarMonitorAutomatico,
 *   EmpresaMonitorada 
 * } from '@/engine/whatsappNotifier'
 * 
 * // Lista de empresas para monitorar
 * const empresas: EmpresaMonitorada[] = [
 *   {
 *     id: '1',
 *     nomeEmpresa: 'Tech Solutions Ltda',
 *     nomeContato: 'João Silva',
 *     telefone: '+5511999999999',
 *     receitaBruta: 100000,
 *     folhaAtual: 20000,
 *     proLaboreAtual: 5000,
 *     fatorR: 0.25,
 *     ajusteNecessario: 3000
 *   }
 * ]
 * 
 * // Configuração WhatsApp
 * const config = {
 *   provider: 'evolution' as const,
 *   apiUrl: 'https://sua-evolution-api.com',
 *   apiKey: 'sua-api-key'
 * }
 * 
 * // Enviar notificações manualmente
 * const resultado = await enviarNotificacoes(empresas, config)
 * console.log(`✅ ${resultado.mensagensEnviadas} mensagens enviadas!`)
 * 
 * // OU iniciar monitor automático
 * const monitor = iniciarMonitorAutomatico(async () => {
 *   const empresasAtencao = await buscarEmpresasQueNecessitamAjuste()
 *   await enviarNotificacoes(empresasAtencao, config)
 * })
 * 
 * // Para parar depois
 * pararMonitor(monitor)
 * ```
 * 
 * 🔌 INTEGRAÇÃO COM FRONTEND (Modo Manual):
 * 
 * ```tsx
 * import { gerarMensagemWhatsApp } from '@/engine/whatsappNotifier'
 * 
 * const handleEnviarWhatsApp = () => {
 *   const mensagem = gerarMensagemWhatsApp(empresa)
 *   const encoded = encodeURIComponent(mensagem)
 *   const url = `https://wa.me/${empresa.telefone}?text=${encoded}`
 *   window.open(url, '_blank')
 * }
 * ```
 */

// ============================================================================
// 🎯 FUNÇÕES AUXILIARES
// ============================================================================

/**
 * 🔍 FILTRAR EMPRESAS QUE PRECISAM DE AJUSTE
 * 
 * Retorna apenas empresas com Fator R < 28%
 */
export function filtrarEmpresasComRisco(
  empresas: EmpresaMonitorada[]
): EmpresaMonitorada[] {
  return empresas.filter(emp => emp.fatorR < 0.28)
}

/**
 * 📊 CALCULAR ESTATÍSTICAS
 */
export function calcularEstatisticas(empresas: EmpresaMonitorada[]) {
  const total = empresas.length
  const emRisco = filtrarEmpresasComRisco(empresas).length
  const ajusteTotal = empresas.reduce((soma, emp) => soma + emp.ajusteNecessario, 0)
  const ajusteMedio = total > 0 ? ajusteTotal / total : 0
  
  return {
    total,
    emRisco,
    percentualRisco: total > 0 ? (emRisco / total) * 100 : 0,
    ajusteTotal,
    ajusteMedio
  }
}
