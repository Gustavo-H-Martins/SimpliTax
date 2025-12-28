# 📄 Exemplos de Arquivos para Upload - SimpliTax

Esta pasta contém exemplos de arquivos em diferentes formatos que podem ser importados pelo SimpliTax.

## ✅ Formatos Aceitos

### 1. **CSV** (Comma-Separated Values)
- Arquivo: `exemplo-dados-fiscais.csv`
- Formato mais simples e universal
- Pode ser criado no Excel ou qualquer editor de texto

### 2. **TXT** (Texto Simples)
- Arquivo: `exemplo-dados-fiscais.txt`
- Formato texto puro com valores separados por linha
- Ideal para copiar e colar dados

### 3. **XML** (Extensible Markup Language)
- Arquivo: `exemplo-dados-fiscais.xml`
- Formato estruturado para integração com sistemas contábeis
- Comumente usado em NFe e outros documentos fiscais

### 4. **Excel** (.xlsx)
Para criar um arquivo Excel de exemplo:
1. Abra o Microsoft Excel ou Google Sheets
2. Crie as colunas: `Receita Bruta`, `Despesas`, `Folha Pagamento`, `Pró-labore`, `Simples Nacional`
3. Preencha com valores numéricos
4. Salve como `.xlsx`

**Exemplo de estrutura:**

| Receita Bruta | Despesas | Folha Pagamento | Pró-labore | Simples Nacional |
|---------------|----------|-----------------|------------|------------------|
| 100000        | 30000    | 15000           | 5000       | 6000             |

### 5. **PDF** (Portable Document Format)
Para criar um PDF de exemplo:
1. Crie um documento com os dados fiscais (Word, Google Docs, etc.)
2. Exporte como PDF
3. O SimpliTax usa OCR para extrair os dados

**Formato recomendado no PDF:**
```
DADOS FISCAIS - DEZEMBRO 2025

Receita Bruta Mensal: R$ 100.000,00
Despesas Operacionais: R$ 30.000,00
Folha de Pagamento: R$ 15.000,00
Pró-labore Sócios: R$ 5.000,00
Simples Nacional: R$ 6.000,00
```

### 6. **Imagem** (.png, .jpg)
Para criar uma imagem de exemplo:
1. Tire um screenshot de uma planilha ou relatório contábil
2. Certifique-se que o texto está legível
3. O SimpliTax usa AI Vision (OCR) para extrair os dados

**Dicas para melhor reconhecimento:**
- Use imagens com boa resolução (mínimo 1024x768)
- Fundo branco ou claro
- Texto em preto ou cores escuras
- Evite imagens borradas ou com reflexos

## 💡 Campos Reconhecidos

O SimpliTax reconhece automaticamente as seguintes informações:

- **Receita Bruta** (ou Faturamento, Vendas)
- **Despesas** (ou Custos, Gastos)
- **Folha de Pagamento** (ou Salários, Pessoal)
- **Pró-labore** (ou Retirada de Sócios)
- **Simples Nacional** (ou DAS, Impostos)

## 🔧 Como Usar

1. Acesse a página de **Upload** no SimpliTax
2. Arraste e solte o arquivo ou clique para selecionar
3. Aguarde o processamento
4. Revise os dados extraídos
5. Clique em "Continuar para Otimizador"

## 📞 Suporte

Se tiver dúvidas sobre os formatos aceitos, entre em contato com a **LM Tech Consulting**.
