/**
 * 🎨 Gerador Automático de Assets Android
 * 
 * Converte logo.svg e favicon.svg em todos os assets necessários
 * 
 * Uso: node scripts/generate-assets.js
 * 
 * @author SimpleTax2026
 */

const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

// ============================================================================
// Configurações
// ============================================================================

const COLORS = {
  background: '#0F172A',  // Azul profundo SimpleTax
  transparent: { r: 0, g: 0, b: 0, alpha: 0 },
  backgroundRGB: { r: 15, g: 23, b: 42, alpha: 1 }
}

const SIZES = {
  icon: { width: 1024, height: 1024 },
  adaptive: { width: 1024, height: 1024 },
  splash: { width: 1242, height: 2436 },
  splashLogo: { width: 600, height: 600 }
}

const PATHS = {
  public: path.join(__dirname, '..', 'public'),
  assets: path.join(__dirname, '..', 'assets'),
  screenshots: path.join(__dirname, '..', 'assets', 'screenshots')
}

// ============================================================================
// Funções Auxiliares
// ============================================================================

function createDirectories() {
  if (!fs.existsSync(PATHS.assets)) {
    fs.mkdirSync(PATHS.assets, { recursive: true })
  }
  if (!fs.existsSync(PATHS.screenshots)) {
    fs.mkdirSync(PATHS.screenshots, { recursive: true })
  }
}

function logSuccess(message) {
  console.log(`✅ ${message}`)
}

function logInfo(message) {
  console.log(`📱 ${message}`)
}

function logError(message) {
  console.error(`❌ ${message}`)
}

// ============================================================================
// Geradores de Assets
// ============================================================================

async function generateIcon() {
  logInfo('Gerando icon.png (1024×1024)...')
  
  try {
    // Usar logo.svg como base (com texto "SimpliTax")
    await sharp(path.join(PATHS.public, 'logo.svg'))
      .resize(SIZES.icon.width, SIZES.icon.height, {
        fit: 'contain',
        background: COLORS.backgroundRGB
      })
      .png()
      .toFile(path.join(PATHS.assets, 'icon.png'))
    
    logSuccess('icon.png criado!')
  } catch (error) {
    logError(`Erro ao gerar icon.png: ${error.message}`)
  }
}

async function generateAdaptiveIconForeground() {
  logInfo('Gerando adaptive-icon-foreground.png...')
  
  try {
    // Usar favicon.svg (apenas ícone, sem texto)
    // Reduzir para 80% (margem de segurança para adaptive icons)
    const size = Math.floor(SIZES.adaptive.width * 0.8)
    const margin = Math.floor((SIZES.adaptive.width - size) / 2)
    
    await sharp(path.join(PATHS.public, 'favicon.svg'))
      .resize(size, size, {
        fit: 'contain',
        background: COLORS.transparent
      })
      .extend({
        top: margin,
        bottom: margin,
        left: margin,
        right: margin,
        background: COLORS.transparent
      })
      .png()
      .toFile(path.join(PATHS.assets, 'adaptive-icon-foreground.png'))
    
    logSuccess('adaptive-icon-foreground.png criado!')
  } catch (error) {
    logError(`Erro ao gerar adaptive-icon-foreground.png: ${error.message}`)
  }
}

async function generateAdaptiveIconBackground() {
  logInfo('Gerando adaptive-icon-background.png...')
  
  try {
    // Fundo sólido #0F172A
    await sharp({
      create: {
        width: SIZES.adaptive.width,
        height: SIZES.adaptive.height,
        channels: 4,
        background: COLORS.backgroundRGB
      }
    })
      .png()
      .toFile(path.join(PATHS.assets, 'adaptive-icon-background.png'))
    
    logSuccess('adaptive-icon-background.png criado!')
  } catch (error) {
    logError(`Erro ao gerar adaptive-icon-background.png: ${error.message}`)
  }
}

async function generateSplashScreen() {
  logInfo('Gerando splash.png (1242×2436)...')
  
  try {
    // Logo centralizado em fundo azul
    await sharp(path.join(PATHS.public, 'logo.svg'))
      .resize(SIZES.splashLogo.width, SIZES.splashLogo.height, {
        fit: 'contain',
        background: COLORS.backgroundRGB
      })
      .extend({
        top: Math.floor((SIZES.splash.height - SIZES.splashLogo.height) / 2),
        bottom: Math.ceil((SIZES.splash.height - SIZES.splashLogo.height) / 2),
        left: Math.floor((SIZES.splash.width - SIZES.splashLogo.width) / 2),
        right: Math.ceil((SIZES.splash.width - SIZES.splashLogo.width) / 2),
        background: COLORS.backgroundRGB
      })
      .png()
      .toFile(path.join(PATHS.assets, 'splash.png'))
    
    logSuccess('splash.png criado!')
  } catch (error) {
    logError(`Erro ao gerar splash.png: ${error.message}`)
  }
}

async function generateFeatureGraphic() {
  logInfo('Gerando feature-graphic.png (1024×500) para Google Play...')
  
  try {
    // Banner horizontal com logo + texto
    const canvas = sharp({
      create: {
        width: 1024,
        height: 500,
        channels: 4,
        background: COLORS.backgroundRGB
      }
    })

    // Overlay do logo no lado esquerdo
    const logoBuffer = await sharp(path.join(PATHS.public, 'logo.svg'))
      .resize(400, 400, { fit: 'contain', background: COLORS.backgroundRGB })
      .png()
      .toBuffer()

    await canvas
      .composite([
        { input: logoBuffer, left: 50, top: 50 }
      ])
      .png()
      .toFile(path.join(PATHS.assets, 'feature-graphic.png'))
    
    logSuccess('feature-graphic.png criado!')
  } catch (error) {
    logError(`Erro ao gerar feature-graphic.png: ${error.message}`)
    console.log('ℹ️  Você pode criar manualmente usando Figma (1024×500 px)')
  }
}

// ============================================================================
// Função Principal
// ============================================================================

async function generateAllAssets() {
  console.log('🎨 SimpleTax2026 - Gerador de Assets Android\n')
  console.log('=' .repeat(60) + '\n')

  createDirectories()

  try {
    await generateIcon()
    await generateAdaptiveIconForeground()
    await generateAdaptiveIconBackground()
    await generateSplashScreen()
    await generateFeatureGraphic()

    console.log('\n' + '=' .repeat(60))
    console.log('🎉 Todos os assets foram gerados com sucesso!\n')
    
    console.log('📁 Arquivos criados:')
    console.log('   ├─ assets/icon.png (1024×1024)')
    console.log('   ├─ assets/adaptive-icon-foreground.png (1024×1024)')
    console.log('   ├─ assets/adaptive-icon-background.png (1024×1024)')
    console.log('   ├─ assets/splash.png (1242×2436)')
    console.log('   └─ assets/feature-graphic.png (1024×500)\n')

    console.log('📋 Próximos passos:')
    console.log('   1. Verifique os arquivos em /assets/')
    console.log('   2. Tire screenshots do app (mínimo 2)')
    console.log('   3. Salve em /assets/screenshots/')
    console.log('   4. Faça upload no Google Play Console\n')

    console.log('📸 Para screenshots:')
    console.log('   - Abra http://localhost:3000 no navegador')
    console.log('   - F12 → Ctrl+Shift+M (Device Mode)')
    console.log('   - Configure: 360×640 px, escala 3x')
    console.log('   - Capture: DevTools → ⋮ → "Capture screenshot"\n')

    console.log('📚 Guia completo: ASSETS_GUIDE.md\n')

  } catch (error) {
    logError(`Erro fatal: ${error.message}`)
    console.log('\n💡 Dica: Certifique-se de que "sharp" está instalado:')
    console.log('   npm install sharp --save-dev\n')
  }
}

// ============================================================================
// Executar
// ============================================================================

if (require.main === module) {
  generateAllAssets()
}

module.exports = { generateAllAssets }
