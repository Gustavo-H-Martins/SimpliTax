#!/usr/bin/env node

/**
 * 🚀 SimpliTax - Script de Inicialização Automática
 * 
 * Uso:
 *   node start.js --dev     → Modo desenvolvimento (hot reload)
 *   node start.js           → Modo produção (build + start)
 * 
 * @author LMartins (Product Manager) - SimpliTax
 */

const { execSync, spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

// ============================================================================
// 🎨 CORES PARA O TERMINAL
// ============================================================================

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset)
}

function logBox(title, message, color = 'blue') {
  const line = '═'.repeat(60)
  console.log()
  log(`╔${line}╗`, color)
  log(`║ ${colors.bright}${title.padEnd(58)}${colors.reset}${colors[color]}║`, color)
  log(`╠${line}╣`, color)
  log(`║ ${message.padEnd(58)}║`, color)
  log(`╚${line}╝`, color)
  console.log()
}

// ============================================================================
// 🔍 VERIFICAR SE NODE_MODULES EXISTE
// ============================================================================

function nodeModulesExiste() {
  return fs.existsSync(path.join(__dirname, 'node_modules'))
}

function packageJsonFoiModificado() {
  try {
    const packageLockPath = path.join(__dirname, 'package-lock.json')
    const packageJsonPath = path.join(__dirname, 'package.json')
    
    if (!fs.existsSync(packageLockPath)) {
      return true // Se não existe lock, precisa instalar
    }

    const lockStat = fs.statSync(packageLockPath)
    const packageStat = fs.statSync(packageJsonPath)
    
    // Se package.json foi modificado depois do lock, precisa reinstalar
    return packageStat.mtime > lockStat.mtime
  } catch (error) {
    return true // Na dúvida, reinstala
  }
}

// ============================================================================
// 📦 INSTALAR DEPENDÊNCIAS
// ============================================================================

function instalarDependencias() {
  logBox(
    '📦 INSTALANDO DEPENDÊNCIAS',
    'Aguarde enquanto instalamos as bibliotecas...',
    'yellow'
  )

  try {
    execSync('npm install', { 
      stdio: 'inherit',
      cwd: __dirname 
    })
    
    log('✅ Dependências instaladas com sucesso!', 'green')
    return true
  } catch (error) {
    log('❌ Erro ao instalar dependências!', 'red')
    console.error(error)
    return false
  }
}

// ============================================================================
// 🚀 RODAR PROJETO
// ============================================================================

function rodarProjeto(modoDev = false) {
  if (modoDev) {
    logBox(
      '🔥 MODO DESENVOLVIMENTO',
      'Iniciando servidor com hot reload...',
      'cyan'
    )
    
    log('🌐 Acesse: http://localhost:3000', 'cyan')
    log('📊 Dashboard: http://localhost:3000/dashboard', 'cyan')
    log('💎 Otimizador: http://localhost:3000/otimizador', 'cyan')
    log('📤 Upload: http://localhost:3000/upload', 'cyan')
    log('💬 Relatório: http://localhost:3000/relatorio-alivio', 'cyan')
    console.log()
    log('💡 Pressione Ctrl+C para parar o servidor', 'yellow')
    console.log()

    // Spawn para manter o processo vivo
    const child = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true,
      cwd: __dirname
    })

    child.on('error', (error) => {
      log('❌ Erro ao iniciar servidor:', 'red')
      console.error(error)
      process.exit(1)
    })

  } else {
    logBox(
      '🏭 MODO PRODUÇÃO',
      'Compilando projeto para produção...',
      'blue'
    )

    try {
      // Build
      log('📦 Executando build...', 'yellow')
      execSync('npm run build', { 
        stdio: 'inherit',
        cwd: __dirname 
      })
      
      log('✅ Build concluído com sucesso!', 'green')
      console.log()

      // Start
      logBox(
        '🚀 INICIANDO SERVIDOR PRODUÇÃO',
        'Servidor otimizado rodando...',
        'green'
      )
      
      log('🌐 Acesse: http://localhost:3000', 'green')
      console.log()

      const child = spawn('npm', ['run', 'start'], {
        stdio: 'inherit',
        shell: true,
        cwd: __dirname
      })

      child.on('error', (error) => {
        log('❌ Erro ao iniciar servidor:', 'red')
        console.error(error)
        process.exit(1)
      })

    } catch (error) {
      log('❌ Erro no build de produção!', 'red')
      console.error(error)
      process.exit(1)
    }
  }
}

// ============================================================================
// 🎯 FUNÇÃO PRINCIPAL
// ============================================================================

function main() {
  // Banner
  console.clear()
  log('╔════════════════════════════════════════════════════════════╗', 'bright')
  log('║                                                            ║', 'bright')
  log('║               💎 SIMPLITAX - STARTER 💎                    ║', 'bright')
  log('║                                                            ║', 'bright')
  log('║          Transformando complexidade em clareza             ║', 'bright')
  log('║                                                            ║', 'bright')
  log('╚════════════════════════════════════════════════════════════╝', 'bright')
  console.log()

  // Verificar argumentos
  const args = process.argv.slice(2)
  const modoDev = args.includes('--dev') || args.includes('-d')
  const forcarInstalacao = args.includes('--install') || args.includes('-i')

  log('🔍 Verificando ambiente...', 'cyan')
  console.log()

  // Verificar se precisa instalar
  const precisaInstalar = forcarInstalacao || 
                          !nodeModulesExiste() || 
                          packageJsonFoiModificado()

  if (precisaInstalar) {
    if (!nodeModulesExiste()) {
      log('📦 node_modules não encontrado', 'yellow')
    } else if (packageJsonFoiModificado()) {
      log('📦 package.json foi modificado', 'yellow')
    }
    
    if (!instalarDependencias()) {
      process.exit(1)
    }
    console.log()
  } else {
    log('✅ Dependências já instaladas!', 'green')
    console.log()
  }

  // Rodar projeto
  rodarProjeto(modoDev)
}

// ============================================================================
// 🚀 EXECUTAR
// ============================================================================

main()
