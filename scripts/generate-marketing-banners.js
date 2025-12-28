const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const outputDir = path.join(__dirname, '../marketing/banners');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Cores do SimpleTax
const COLORS = {
  primary: '#0F172A',
  accent: '#00B4D8',
  white: '#FFFFFF',
  success: '#10B981',
  warning: '#F59E0B'
};

// Banner 1: Instagram Post (1080x1080)
async function createInstagramBanner() {
  const width = 1080;
  const height = 1080;
  
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Background gradient -->
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0F172A;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1E293B;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad1)"/>
      
      <!-- Decorative circles -->
      <circle cx="100" cy="100" r="60" fill="${COLORS.accent}" opacity="0.1"/>
      <circle cx="${width - 100}" cy="${height - 100}" r="80" fill="${COLORS.accent}" opacity="0.15"/>
      
      <!-- Logo/Icon area (placeholder) -->
      <circle cx="540" cy="320" r="120" fill="${COLORS.accent}"/>
      <text x="540" y="340" font-family="Arial, sans-serif" font-size="80" font-weight="bold" 
            fill="${COLORS.primary}" text-anchor="middle">ST</text>
      
      <!-- Main text -->
      <text x="540" y="520" font-family="Arial, sans-serif" font-size="56" font-weight="bold" 
            fill="${COLORS.white}" text-anchor="middle">SimpleTax 2026</text>
      
      <text x="540" y="590" font-family="Arial, sans-serif" font-size="32" 
            fill="${COLORS.accent}" text-anchor="middle">Otimização Tributária Inteligente</text>
      
      <!-- Features -->
      <text x="540" y="680" font-family="Arial, sans-serif" font-size="28" 
            fill="${COLORS.white}" text-anchor="middle">💰 Economize até 30% em impostos</text>
      
      <text x="540" y="740" font-family="Arial, sans-serif" font-size="28" 
            fill="${COLORS.white}" text-anchor="middle">📊 Dashboard inteligente</text>
      
      <text x="540" y="800" font-family="Arial, sans-serif" font-size="28" 
            fill="${COLORS.white}" text-anchor="middle">🆓 7 dias grátis</text>
      
      <!-- CTA -->
      <rect x="340" y="880" width="400" height="80" rx="40" fill="${COLORS.accent}"/>
      <text x="540" y="930" font-family="Arial, sans-serif" font-size="36" font-weight="bold" 
            fill="${COLORS.primary}" text-anchor="middle">BAIXE AGORA</text>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(outputDir, 'instagram-post.png'));
  
  console.log('✅ Banner Instagram (1080x1080) criado!');
}

// Banner 2: Facebook Cover (820x312)
async function createFacebookCover() {
  const width = 820;
  const height = 312;
  
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#0F172A;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1E293B;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad2)"/>
      
      <!-- Left side - Logo -->
      <circle cx="156" cy="156" r="80" fill="${COLORS.accent}"/>
      <text x="156" y="176" font-family="Arial, sans-serif" font-size="60" font-weight="bold" 
            fill="${COLORS.primary}" text-anchor="middle">ST</text>
      
      <!-- Center - Text -->
      <text x="500" y="100" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
            fill="${COLORS.white}" text-anchor="middle">SimpleTax 2026</text>
      
      <text x="500" y="150" font-family="Arial, sans-serif" font-size="24" 
            fill="${COLORS.accent}" text-anchor="middle">Economize até 30% em impostos com IA</text>
      
      <text x="500" y="200" font-family="Arial, sans-serif" font-size="22" 
            fill="${COLORS.white}" text-anchor="middle">✓ Simples Nacional  ✓ Lucro Presumido  ✓ Reforma 2026</text>
      
      <!-- CTA -->
      <rect x="350" y="230" width="300" height="60" rx="30" fill="${COLORS.accent}"/>
      <text x="500" y="270" font-family="Arial, sans-serif" font-size="28" font-weight="bold" 
            fill="${COLORS.primary}" text-anchor="middle">Teste Grátis 7 Dias</text>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(outputDir, 'facebook-cover.png'));
  
  console.log('✅ Banner Facebook Cover (820x312) criado!');
}

// Banner 3: LinkedIn Post (1200x627)
async function createLinkedInBanner() {
  const width = 1200;
  const height = 627;
  
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0F172A;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1E293B;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad3)"/>
      
      <!-- Left side -->
      <circle cx="200" cy="313" r="120" fill="${COLORS.accent}"/>
      <text x="200" y="343" font-family="Arial, sans-serif" font-size="90" font-weight="bold" 
            fill="${COLORS.primary}" text-anchor="middle">ST</text>
      
      <!-- Right side - Text -->
      <text x="750" y="180" font-family="Arial, sans-serif" font-size="52" font-weight="bold" 
            fill="${COLORS.white}" text-anchor="middle">SimpleTax 2026</text>
      
      <text x="750" y="240" font-family="Arial, sans-serif" font-size="28" 
            fill="${COLORS.accent}" text-anchor="middle">A Revolução na Otimização Tributária</text>
      
      <text x="750" y="310" font-family="Arial, sans-serif" font-size="24" 
            fill="${COLORS.white}" text-anchor="middle">✓ Redução de até 30% em impostos</text>
      
      <text x="750" y="360" font-family="Arial, sans-serif" font-size="24" 
            fill="${COLORS.white}" text-anchor="middle">✓ Reforma Tributária 2026 integrada</text>
      
      <text x="750" y="410" font-family="Arial, sans-serif" font-size="24" 
            fill="${COLORS.white}" text-anchor="middle">✓ Relatórios profissionais em PDF</text>
      
      <!-- CTA -->
      <rect x="550" y="460" width="400" height="70" rx="35" fill="${COLORS.accent}"/>
      <text x="750" y="505" font-family="Arial, sans-serif" font-size="32" font-weight="bold" 
            fill="${COLORS.primary}" text-anchor="middle">Conheça Agora →</text>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(outputDir, 'linkedin-post.png'));
  
  console.log('✅ Banner LinkedIn (1200x627) criado!');
}

// Banner 4: WhatsApp Status (1080x1920)
async function createWhatsAppStatus() {
  const width = 1080;
  const height = 1920;
  
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad4" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#0F172A;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1E293B;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad4)"/>
      
      <!-- Logo -->
      <circle cx="540" cy="400" r="150" fill="${COLORS.accent}"/>
      <text x="540" y="430" font-family="Arial, sans-serif" font-size="110" font-weight="bold" 
            fill="${COLORS.primary}" text-anchor="middle">ST</text>
      
      <!-- Title -->
      <text x="540" y="650" font-family="Arial, sans-serif" font-size="64" font-weight="bold" 
            fill="${COLORS.white}" text-anchor="middle">SimpleTax</text>
      <text x="540" y="730" font-family="Arial, sans-serif" font-size="64" font-weight="bold" 
            fill="${COLORS.white}" text-anchor="middle">2026</text>
      
      <text x="540" y="830" font-family="Arial, sans-serif" font-size="36" 
            fill="${COLORS.accent}" text-anchor="middle">Chegou o app que vai</text>
      <text x="540" y="890" font-family="Arial, sans-serif" font-size="36" 
            fill="${COLORS.accent}" text-anchor="middle">transformar sua contabilidade</text>
      
      <!-- Features -->
      <text x="540" y="1020" font-family="Arial, sans-serif" font-size="32" 
            fill="${COLORS.white}" text-anchor="middle">💰 Economize milhares</text>
      
      <text x="540" y="1100" font-family="Arial, sans-serif" font-size="32" 
            fill="${COLORS.white}" text-anchor="middle">📊 Cálculos precisos</text>
      
      <text x="540" y="1180" font-family="Arial, sans-serif" font-size="32" 
            fill="${COLORS.white}" text-anchor="middle">🚀 Resultado em 2 min</text>
      
      <text x="540" y="1260" font-family="Arial, sans-serif" font-size="32" 
            fill="${COLORS.white}" text-anchor="middle">🆓 7 dias grátis</text>
      
      <!-- CTA -->
      <rect x="290" y="1400" width="500" height="100" rx="50" fill="${COLORS.accent}"/>
      <text x="540" y="1465" font-family="Arial, sans-serif" font-size="40" font-weight="bold" 
            fill="${COLORS.primary}" text-anchor="middle">BAIXE AGORA</text>
      
      <text x="540" y="1600" font-family="Arial, sans-serif" font-size="28" 
            fill="${COLORS.white}" text-anchor="middle">Disponível na Play Store</text>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(outputDir, 'whatsapp-status.png'));
  
  console.log('✅ Banner WhatsApp Status (1080x1920) criado!');
}

// Banner 5: YouTube Thumbnail (1280x720)
async function createYouTubeThumbnail() {
  const width = 1280;
  const height = 720;
  
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0F172A;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1E293B;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad5)"/>
      
      <!-- Background accent -->
      <circle cx="200" cy="150" r="100" fill="${COLORS.accent}" opacity="0.2"/>
      <circle cx="${width - 150}" cy="${height - 120}" r="120" fill="${COLORS.accent}" opacity="0.15"/>
      
      <!-- Main text -->
      <text x="640" y="200" font-family="Arial, sans-serif" font-size="72" font-weight="bold" 
            fill="${COLORS.white}" text-anchor="middle">ECONOMIZE</text>
      
      <text x="640" y="300" font-family="Arial, sans-serif" font-size="120" font-weight="bold" 
            fill="${COLORS.accent}" text-anchor="middle">30% EM</text>
      
      <text x="640" y="400" font-family="Arial, sans-serif" font-size="120" font-weight="bold" 
            fill="${COLORS.accent}" text-anchor="middle">IMPOSTOS</text>
      
      <text x="640" y="500" font-family="Arial, sans-serif" font-size="48" 
            fill="${COLORS.white}" text-anchor="middle">com SimpleTax 2026</text>
      
      <!-- CTA badge -->
      <rect x="440" y="570" width="400" height="80" rx="40" fill="${COLORS.success}"/>
      <text x="640" y="620" font-family="Arial, sans-serif" font-size="36" font-weight="bold" 
            fill="${COLORS.white}" text-anchor="middle">TESTE GRÁTIS 7 DIAS</text>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(outputDir, 'youtube-thumbnail.png'));
  
  console.log('✅ Banner YouTube (1280x720) criado!');
}

async function generateAllBanners() {
  console.log('🎨 Gerando banners promocionais...\n');
  
  try {
    await createInstagramBanner();
    await createFacebookCover();
    await createLinkedInBanner();
    await createWhatsAppStatus();
    await createYouTubeThumbnail();
    
    console.log('\n🎉 Todos os banners foram gerados com sucesso!');
    console.log(`📁 Salvos em: ${outputDir}`);
    console.log('\n📋 Arquivos criados:');
    console.log('   • instagram-post.png (1080x1080)');
    console.log('   • facebook-cover.png (820x312)');
    console.log('   • linkedin-post.png (1200x627)');
    console.log('   • whatsapp-status.png (1080x1920)');
    console.log('   • youtube-thumbnail.png (1280x720)');
  } catch (error) {
    console.error('❌ Erro ao gerar banners:', error);
  }
}

generateAllBanners();
