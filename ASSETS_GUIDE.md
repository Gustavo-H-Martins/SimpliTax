# 🎨 Guia: Converter Logos para Assets Android

Este guia ensina como converter os arquivos SVG em assets prontos para o Google Play.

---

## 📦 Assets Necessários

### 1. **App Icon (Obrigatório)**
- **Arquivo:** `icon.png`
- **Tamanho:** 1024×1024 px
- **Formato:** PNG-24 com transparência
- **Local:** `assets/icon.png`

### 2. **Adaptive Icon (Recomendado)**
- **Foreground:** `adaptive-icon-foreground.png` (1024×1024 px)
- **Background:** `adaptive-icon-background.png` (1024×1024 px ou cor sólida)
- **Local:** `assets/`
- **Nota:** Android 8.0+ usa ícones adaptáveis (formas diferentes por fabricante)

### 3. **Splash Screen (Opcional)**
- **Arquivo:** `splash.png`
- **Tamanho:** 1242×2436 px (iPhone 12 Pro Max como base)
- **Formato:** PNG-24
- **Local:** `assets/splash.png`

### 4. **Screenshots (Google Play)**
Mínimo 2, recomendado 4-8 capturas:
- **Tamanho:** 1080×1920 px (16:9)
- **Formato:** PNG ou JPG
- **Local:** `assets/screenshots/`

---

## 🛠️ Método 1: Manual (Figma/Inkscape)

### Usando Figma (Online, Grátis)

1. **Abrir Figma**: https://www.figma.com
2. **Criar novo arquivo** (Desktop → novo design)
3. **Importar SVG**:
   - Arraste `logo.svg` ou `favicon.svg` para o canvas
   - Ou use Ctrl+Shift+K → selecione o arquivo

4. **Criar Frame 1024×1024**:
   - Tecla **F** → digite `1024` na largura e altura
   - Ou use menu: Frame → Custom Size

5. **Centralizar Logo**:
   - Selecione o logo importado
   - No painel direito: Auto Layout ou manualmente centralize
   - **Dica:** Para adaptive icon, deixe margem de **20%** (logo ocupa 80% do centro)

6. **Exportar**:
   - Selecione o frame
   - Painel direito → **Export**
   - Formato: **PNG**
   - Escala: **1x** (já é 1024×1024)
   - Clique em **Export Frame**

7. **Repita para cada asset**:
   - **icon.png**: Logo completo com fundo
   - **adaptive-icon-foreground.png**: Apenas elementos visuais (sem fundo)
   - **splash.png**: Crie frame 1242×2436, centralize logo

---

### Usando Inkscape (Desktop, Grátis)

1. **Instalar Inkscape**: https://inkscape.org/release/
2. **Abrir SVG**:
   - Arquivo → Abrir → selecione `logo.svg`

3. **Configurar Tamanho do Documento**:
   - Arquivo → Propriedades do Documento
   - Largura: `1024 px`
   - Altura: `1024 px`
   - Unidades: `px`
   - Fechar janela

4. **Ajustar Logo**:
   - Selecione todos os elementos (Ctrl+A)
   - Objeto → Agrupar (Ctrl+G)
   - Redimensione mantendo proporção (Shift+Arrastar)
   - Centralize: Objeto → Alinhar e Distribuir → Centro da página

5. **Exportar PNG**:
   - Arquivo → Exportar Imagem PNG
   - Área de Exportação: **Página**
   - Largura/Altura: `1024 px` (verificar)
   - Nome do arquivo: `icon.png`
   - Clique em **Exportar**

---

## 🤖 Método 2: Automatizado (Node.js)

### Passo 1: Instalar Dependências

```powershell
npm install sharp svg2png-many --save-dev
```

### Passo 2: Criar Script

Crie o arquivo `scripts/generate-assets.js`:

```javascript
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const SIZES = {
  icon: { width: 1024, height: 1024 },
  adaptive: { width: 1024, height: 1024 },
  splash: { width: 1242, height: 2436 }
}

async function generateAssets() {
  const publicDir = path.join(__dirname, '..', 'public')
  const assetsDir = path.join(__dirname, '..', 'assets')

  // Criar pasta assets se não existir
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true })
  }

  console.log('🎨 Gerando assets Android...\n')

  try {
    // 1. App Icon (logo completo com fundo)
    console.log('📱 Gerando icon.png (1024×1024)...')
    await sharp(path.join(publicDir, 'logo.svg'))
      .resize(SIZES.icon.width, SIZES.icon.height, {
        fit: 'contain',
        background: { r: 15, g: 23, b: 42, alpha: 1 } // #0F172A
      })
      .png()
      .toFile(path.join(assetsDir, 'icon.png'))
    console.log('✅ icon.png criado!\n')

    // 2. Adaptive Icon Foreground (apenas elementos)
    console.log('📱 Gerando adaptive-icon-foreground.png...')
    await sharp(path.join(publicDir, 'favicon.svg'))
      .resize(SIZES.adaptive.width, SIZES.adaptive.height, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparente
      })
      .png()
      .toFile(path.join(assetsDir, 'adaptive-icon-foreground.png'))
    console.log('✅ adaptive-icon-foreground.png criado!\n')

    // 3. Adaptive Icon Background (fundo sólido)
    console.log('📱 Gerando adaptive-icon-background.png...')
    await sharp({
      create: {
        width: SIZES.adaptive.width,
        height: SIZES.adaptive.height,
        channels: 4,
        background: { r: 15, g: 23, b: 42, alpha: 1 } // #0F172A
      }
    })
      .png()
      .toFile(path.join(assetsDir, 'adaptive-icon-background.png'))
    console.log('✅ adaptive-icon-background.png criado!\n')

    // 4. Splash Screen
    console.log('📱 Gerando splash.png (1242×2436)...')
    await sharp(path.join(publicDir, 'logo.svg'))
      .resize(600, 600, {
        fit: 'contain',
        background: { r: 15, g: 23, b: 42, alpha: 1 }
      })
      .extend({
        top: Math.floor((SIZES.splash.height - 600) / 2),
        bottom: Math.ceil((SIZES.splash.height - 600) / 2),
        left: Math.floor((SIZES.splash.width - 600) / 2),
        right: Math.ceil((SIZES.splash.width - 600) / 2),
        background: { r: 15, g: 23, b: 42, alpha: 1 }
      })
      .png()
      .toFile(path.join(assetsDir, 'splash.png'))
    console.log('✅ splash.png criado!\n')

    console.log('🎉 Todos os assets foram gerados em /assets/')
    console.log('\n📋 Próximos passos:')
    console.log('1. Verifique os arquivos em /assets/')
    console.log('2. Tire screenshots do app (Dashboard, Otimizador, etc.)')
    console.log('3. Salve screenshots em /assets/screenshots/')
    console.log('4. Faça upload no Google Play Console')

  } catch (error) {
    console.error('❌ Erro ao gerar assets:', error.message)
  }
}

generateAssets()
```

### Passo 3: Executar Script

```powershell
node scripts/generate-assets.js
```

---

## 📸 Gerando Screenshots

### Opção 1: Browser DevTools (Desktop)

1. **Abrir app no navegador**: `http://localhost:3000`
2. **Abrir DevTools**: F12
3. **Device Mode**: Ctrl+Shift+M
4. **Configurar dispositivo**:
   - Escolha: "Responsive"
   - Largura: `360 px`
   - Altura: `640 px`
   - Escala: `3x` (resultado 1080×1920)

5. **Capturar Screenshot**:
   - DevTools → ⋮ (três pontos) → "Capture screenshot"
   - Ou use extensão "GoFullPage" para páginas longas

6. **Páginas para capturar**:
   - 📊 Dashboard principal (com dados)
   - 💎 Otimizador com resultado (cenário otimizado)
   - 📈 Gráfico comparativo visível
   - ✅ Tela "Já está otimizado!"

### Opção 2: Emulador Android (Real Device)

1. **Instalar app no emulador** (via Capacitor ou React Native)
2. **Navegar pelas telas**
3. **Capturar screenshot**:
   - **Emulador**: Clique no ícone 📷 na barra lateral
   - **Device físico**: Volume Down + Power

4. **Baixar screenshots**:
   - Emulador: Screenshots salvos em `~/Screenshots/`
   - Device: Usar Android File Transfer

---

## 🎨 Dicas de Design

### App Icon

✅ **FAÇA:**
- Fundo sólido (#0F172A do SimpliTax)
- Ícone centralizado e legível mesmo pequeno (48×48 px)
- Contraste alto (branco/ciano sobre azul escuro)
- Teste em fundo branco e preto

❌ **NÃO FAÇA:**
- Texto muito pequeno
- Elementos muito detalhados (simplificar)
- Bordas/margens (Android adiciona automaticamente)

### Adaptive Icon

- **Safe Zone**: Centro 66% é sempre visível
- **Margem**: 20% em cada lado pode ser cortado
- **Foreground**: Apenas elementos do logo (transparente)
- **Background**: Cor sólida ou gradiente simples

### Screenshots

✅ **FAÇA:**
- Mostre dados REAIS (não lorem ipsum)
- Use cenários que impressionem: "Economize R$ 50.000/ano!"
- Adicione anotações/setas destacando features
- Primeira screenshot é a mais importante (capa)

❌ **NÃO FAÇA:**
- Dados vazios ou "teste"
- Screenshots borradas ou cortadas
- Texto muito pequeno

---

## 📤 Upload no Google Play

### Local dos Assets no Console

1. **Ícone do app**:
   - Play Console → Seu App → "Presença na loja" → "Ícone do app"
   - Upload: `icon.png` (1024×1024)

2. **Screenshots**:
   - "Smartphone" → Adicionar screenshots (mín. 2, máx. 8)
   - Upload: arquivos de `assets/screenshots/`
   - **Ordem importa!** Primeira é a capa.

3. **Gráfico de recursos** (opcional mas recomendado):
   - 1024×500 px
   - Banner horizontal mostrando o app

---

## 🚀 Checklist Final

Antes de publicar, verifique:

- [ ] `icon.png` (1024×1024) criado e testado
- [ ] `adaptive-icon-foreground.png` criado
- [ ] `adaptive-icon-background.png` ou cor definida
- [ ] `splash.png` criado
- [ ] Mínimo 2 screenshots (recomendado 4-6)
- [ ] Screenshots em 1080×1920 px
- [ ] Dados reais nas screenshots (não "teste")
- [ ] Ícone legível em 48×48 px (testar reduzindo)
- [ ] Cores consistentes com branding (#0F172A, #00B4D8)

---

## 🆘 Problemas Comuns

### "SVG não renderiza corretamente"
- **Solução**: Abra o SVG no Figma/Inkscape, converta textos em paths
- Arquivo → Objeto para Caminho (Inkscape)
- Flatten (Figma)

### "PNG muito grande (>512 KB)"
- **Solução**: Comprimir com TinyPNG (https://tinypng.com)
- Ou usar sharp com `quality: 90` no script

### "Ícone fica pixelado no device"
- **Problema**: Tamanho menor que 1024×1024
- **Solução**: Sempre exportar em 1024×1024 (Android reduz automaticamente)

---

## 📚 Recursos Úteis

- **Figma**: https://www.figma.com (design online grátis)
- **Inkscape**: https://inkscape.org (editor SVG desktop)
- **TinyPNG**: https://tinypng.com (comprimir PNG)
- **Android Asset Studio**: https://romannurik.github.io/AndroidAssetStudio/ (gerador automático)
- **Material Design Icons**: https://fonts.google.com/icons (ícones extras)

---

**Dúvidas?** Releia este guia ou peça ajuda no chat! 🚀
