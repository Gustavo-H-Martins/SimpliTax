const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const screenshotsDir = path.join(__dirname, '../assets/screenshots');
const tablet7Dir = path.join(screenshotsDir, 'tablet-7');
const tablet10Dir = path.join(screenshotsDir, 'tablet-10');

// Criar diretórios se não existirem
[tablet7Dir, tablet10Dir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Dimensões recomendadas
const TABLET_7_WIDTH = 1024;
const TABLET_7_HEIGHT = 600;
const TABLET_10_WIDTH = 1920;
const TABLET_10_HEIGHT = 1200;

const screenshots = [
  'dashboard.png',
  'indice.png',
  'otimizador.png',
  'relatorio.png'
];

async function generateTabletScreenshots() {
  console.log('📱 Gerando screenshots para tablets...\n');

  for (const screenshot of screenshots) {
    const inputPath = path.join(screenshotsDir, screenshot);
    
    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  ${screenshot} não encontrado, pulando...`);
      continue;
    }

    try {
      // Tablet 7" (1024x600)
      const tablet7Path = path.join(tablet7Dir, screenshot);
      await sharp(inputPath)
        .resize(TABLET_7_WIDTH, TABLET_7_HEIGHT, {
          fit: 'contain',
          background: { r: 15, g: 23, b: 42, alpha: 1 } // #0F172A
        })
        .png()
        .toFile(tablet7Path);
      console.log(`✅ Tablet 7": ${screenshot} → ${tablet7Path}`);

      // Tablet 10" (1920x1200)
      const tablet10Path = path.join(tablet10Dir, screenshot);
      await sharp(inputPath)
        .resize(TABLET_10_WIDTH, TABLET_10_HEIGHT, {
          fit: 'contain',
          background: { r: 15, g: 23, b: 42, alpha: 1 } // #0F172A
        })
        .png()
        .toFile(tablet10Path);
      console.log(`✅ Tablet 10": ${screenshot} → ${tablet10Path}`);

    } catch (error) {
      console.error(`❌ Erro ao processar ${screenshot}:`, error.message);
    }
  }

  console.log('\n🎉 Screenshots para tablets gerados com sucesso!');
  console.log(`\n📁 Tablet 7" (1024x600): ${tablet7Dir}`);
  console.log(`📁 Tablet 10" (1920x1200): ${tablet10Dir}`);
}

generateTabletScreenshots().catch(console.error);
