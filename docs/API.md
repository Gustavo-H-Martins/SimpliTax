# API Documentation - SimpliTax 2026

## Base URL
```
http://localhost:5000
```

## Authentication
Currently, the API does not require authentication. In production, consider implementing JWT or OAuth2.

## Endpoints

### Health Check
Check if the API is running.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "service": "SimpliTax 2026"
}
```

---

### Calculate Taxes
Calculate taxes based on company and financial data.

**Endpoint:** `POST /api/calcular-tributos`

**Request Body:**
```json
{
  "empresa": {
    "cnpj": "12345678000190",
    "razao_social": "Empresa Teste Ltda",
    "regime_tributario": "simples_nacional",
    "tipo_empresa": "prestacao_servicos",
    "data_inicio": "2020-01-01"
  },
  "dados_financeiros": {
    "receita_bruta": 50000,
    "custos_operacionais": 10000,
    "folha_pagamento": 15000,
    "outras_despesas": 5000,
    "periodo_referencia": "2026-01"
  }
}
```

**Response:**
```json
{
  "sucesso": true,
  "resultado": {
    "regime": "simples_nacional",
    "periodo": "2026-01",
    "irpj": 750.0,
    "csll": 450.0,
    "pis": 300.0,
    "cofins": 900.0,
    "iss": 600.0,
    "inss": 0.0,
    "total_impostos": 3000.0,
    "lucro_liquido": 32000.0,
    "fator_r": 0.30,
    "anexo_aplicavel": "Anexo III",
    "carga_tributaria_efetiva": 6.0
  }
}
```

---

### Simulate Scenarios
Simulate different distribution scenarios between pró-labore and dividends.

**Endpoint:** `POST /api/simular-cenarios`

**Request Body:**
```json
{
  "empresa": { /* same as above */ },
  "dados_financeiros": { /* same as above */ },
  "numero_socios": 2
}
```

**Response:**
```json
{
  "sucesso": true,
  "cenarios": [
    {
      "percentual_pro_labore": 0,
      "percentual_dividendos": 100,
      "valor_pro_labore": 0,
      "valor_dividendos": 32000,
      "custo_tributario_total": 3000
    },
    // ... more scenarios
  ],
  "melhor_cenario": { /* best scenario object */ },
  "economia_potencial": 8896.0
}
```

---

### Analyze Risks
Analyze fiscal risks based on company data and chosen scenario.

**Endpoint:** `POST /api/analisar-riscos`

**Request Body:**
```json
{
  "empresa": { /* same as above */ },
  "dados_financeiros": { /* same as above */ },
  "cenario": {
    "percentual_pro_labore": 30,
    "percentual_dividendos": 70,
    "valor_pro_labore": 10000,
    "valor_dividendos": 22000,
    "custo_tributario_total": 5000
  }
}
```

**Response:**
```json
{
  "sucesso": true,
  "riscos": [
    {
      "nivel": "médio",
      "categoria": "Pró-labore",
      "descricao": "Pró-labore inferior a 10% do faturamento...",
      "impacto_estimado": null,
      "recomendacao": "Considere aumentar o pró-labore..."
    }
  ]
}
```

---

### Generate Complete Report
Generate a complete analysis report.

**Endpoint:** `POST /api/relatorio-completo`

**Request Body:**
```json
{
  "empresa": { /* same as above */ },
  "dados_financeiros": { /* same as above */ },
  "numero_socios": 1,
  "formato": "json"  // or "texto" or "dashboard"
}
```

**Response (formato: json):**
```json
{
  "sucesso": true,
  "relatorio": {
    "empresa": { /* ... */ },
    "periodo": "2026-01",
    "resultado_tributario": { /* ... */ },
    "cenarios_simulados": [ /* ... */ ],
    "melhor_cenario": { /* ... */ },
    "riscos_identificados": [ /* ... */ ],
    "economia_potencial": 8896.0,
    "data_geracao": "2026-01-15"
  }
}
```

**Response (formato: dashboard):**
```json
{
  "sucesso": true,
  "dashboard": {
    "empresa": { /* ... */ },
    "metricas_principais": { /* ... */ },
    "impostos": { /* ... */ },
    "melhor_cenario": { /* ... */ },
    "cenarios": [ /* ... */ ],
    "riscos": [ /* ... */ ],
    "alertas": [ /* ... */ ]
  }
}
```

---

### Calculate Pró-labore
Calculate pró-labore costs including taxes.

**Endpoint:** `POST /api/calcular-pro-labore`

**Request Body:**
```json
{
  "valor_bruto": 5000.00,
  "numero_socios": 2
}
```

**Response:**
```json
{
  "sucesso": true,
  "resultado": {
    "valor_bruto": 10000.0,
    "inss_patronal": 2780.0,
    "inss_socio": 1100.0,
    "irpf": 1551.5,
    "custo_total_empresa": 12780.0,
    "valor_liquido_socio": 7348.5,
    "carga_tributaria": 42.5
  }
}
```

---

### Validate Fator R
Validate and calculate Fator R.

**Endpoint:** `POST /api/validar-fator-r`

**Request Body:**
```json
{
  "folha_pagamento": 15000,
  "receita_bruta": 50000
}
```

**Response:**
```json
{
  "sucesso": true,
  "resultado": {
    "valido": true,
    "fator_r": 0.3,
    "fator_r_percentual": 30.0,
    "anexo": "Anexo III",
    "folha_pagamento": 15000.0,
    "receita_bruta": 50000.0,
    "status": "Adequado",
    "recomendacao": "Fator R adequado"
  }
}
```

---

### Reconcile Revenues
Reconcile declared revenues with bank transactions.

**Endpoint:** `POST /api/conciliar-receitas`

**Request Body:**
```json
{
  "receita_declarada": 100000,
  "receitas_bancarias": [25000, 25000, 25000, 25000],
  "tolerancia": 0.01
}
```

**Response:**
```json
{
  "sucesso": true,
  "resultado": {
    "conciliado": true,
    "receita_declarada": 100000.0,
    "total_bancario": 100000.0,
    "diferenca": 0.0,
    "percentual_diferenca": 0.0,
    "status": "OK",
    "requer_ajuste": false
  }
}
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "sucesso": false,
  "erro": "Error message describing what went wrong"
}
```

**HTTP Status Codes:**
- `200`: Success
- `400`: Bad Request (validation error)
- `500`: Internal Server Error

## Data Types

### RegimeTributario (enum)
- `simples_nacional`
- `lucro_presumido`
- `lucro_real`

### TipoEmpresa (enum)
- `prestacao_servicos`
- `comercio`
- `industria`
- `mista`

### RiskLevel (enum)
- `baixo`
- `médio`
- `alto`
- `crítico`
