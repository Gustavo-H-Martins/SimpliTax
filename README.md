# SimpliTax 2026

## Plataforma de Suporte à Decisão para Reforma Tributária

O SimpliTax 2026 é uma plataforma avançada que transforma a Reforma Tributária brasileira em vantagem prática para contadores e empresários. O sistema codifica as regras fiscais de 2026, analisa dados financeiros, simula cenários tributários e identifica oportunidades de economia.

## 🎯 Funcionalidades

### 1. **Motor de Regras Tributárias 2026**
- Codificação completa das regras da Reforma Tributária
- Suporte para Simples Nacional, Lucro Presumido e Lucro Real
- Cálculo automático de IRPJ, CSLL, PIS, COFINS, ISS e INSS
- Cálculo do Fator R para Simples Nacional

### 2. **Análise de Dados Financeiros**
- Importação e análise de dados financeiros
- Cálculo de receita líquida e margem de lucro
- Estruturação de custos operacionais

### 3. **Simulação de Cenários**
- Simulação de distribuição entre pró-labore e dividendos
- Análise comparativa de múltiplos cenários
- Identificação automática da melhor estratégia
- Cálculo de economia potencial

### 4. **Monitoramento de Fator R e Riscos Fiscais**
- Monitoramento em tempo real do Fator R
- Identificação de riscos fiscais (baixo, médio, alto, crítico)
- Recomendações personalizadas
- Alertas preventivos

### 5. **Conciliação Automatizada**
- Conciliação de receitas declaradas vs. bancárias
- Validação de Fator R
- Verificação de consistência de dados

### 6. **Relatórios e Dashboards**
- Relatórios completos em JSON e texto
- Dados estruturados para dashboards visuais
- Métricas principais destacadas
- Gráficos comparativos de cenários

### 7. **API REST**
- Endpoints para todas as funcionalidades
- Integração fácil com sistemas existentes
- Documentação completa da API

## 🚀 Instalação

### Requisitos
- Python 3.8 ou superior
- pip (gerenciador de pacotes Python)

### Passos de Instalação

```bash
# Clone o repositório
git clone https://github.com/Gustavo-H-Martins/SimpliTax.git
cd SimpliTax

# Instale as dependências
pip install -r requirements.txt
```

## 📖 Uso

### Interface de Linha de Comando (CLI)

Execute o programa principal para análise interativa:

```bash
python main.py
```

### Exemplo de Uso Programático

```python
from decimal import Decimal
from datetime import date
from simplitax.models import DadosEmpresa, DadosFinanceiros, RegimeTributario, TipoEmpresa
from simplitax.calculators import CalculadoraTributos
from simplitax.simulators import SimuladorCenarios

# Criar dados da empresa
empresa = DadosEmpresa(
    cnpj="12345678000190",
    razao_social="Minha Empresa Ltda",
    regime_tributario=RegimeTributario.SIMPLES_NACIONAL,
    tipo_empresa=TipoEmpresa.PRESTACAO_SERVICOS,
    data_inicio=date(2020, 1, 1)
)

# Dados financeiros
dados_financeiros = DadosFinanceiros(
    receita_bruta=Decimal("50000.00"),
    custos_operacionais=Decimal("10000.00"),
    folha_pagamento=Decimal("15000.00"),
    outras_despesas=Decimal("5000.00"),
    periodo_referencia="2026-01"
)

# Calcular tributos
calc = CalculadoraTributos(empresa)
resultado = calc.calcular_tributos(dados_financeiros)

print(f"Total de Impostos: R$ {resultado.total_impostos:,.2f}")
print(f"Fator R: {resultado.fator_r:.2%}")
print(f"Carga Tributária: {resultado.carga_tributaria_efetiva:.2f}%")
```

### Executar Exemplo Completo

```bash
python examples/exemplo_uso.py
```

### API REST

Inicie o servidor da API:

```bash
python -m simplitax.api
```

A API estará disponível em `http://localhost:5000`

#### Endpoints Disponíveis

- `GET /health` - Verificação de saúde da API
- `POST /api/calcular-tributos` - Calcula tributos
- `POST /api/simular-cenarios` - Simula cenários de distribuição
- `POST /api/analisar-riscos` - Analisa riscos fiscais
- `POST /api/relatorio-completo` - Gera relatório completo
- `POST /api/calcular-pro-labore` - Calcula custos de pró-labore
- `POST /api/validar-fator-r` - Valida Fator R
- `POST /api/conciliar-receitas` - Concilia receitas

#### Exemplo de Requisição

```bash
curl -X POST http://localhost:5000/api/calcular-tributos \
  -H "Content-Type: application/json" \
  -d '{
    "empresa": {
      "cnpj": "12345678000190",
      "razao_social": "Empresa Teste",
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
  }'
```

## 🧪 Testes

Execute os testes unitários:

```bash
pytest tests/
```

Execute com cobertura:

```bash
pytest --cov=simplitax tests/
```

## 📊 Estrutura do Projeto

```
SimpliTax/
├── simplitax/              # Código principal
│   ├── __init__.py
│   ├── models/             # Modelos de dados
│   ├── calculators/        # Calculadoras de tributos
│   ├── simulators/         # Simuladores de cenários
│   ├── reports/            # Geradores de relatórios
│   ├── api/                # API REST
│   ├── utils/              # Funções utilitárias
│   └── config.py           # Configurações
├── tests/                  # Testes unitários
├── examples/               # Exemplos de uso
├── docs/                   # Documentação
├── main.py                 # CLI principal
├── requirements.txt        # Dependências
└── README.md               # Este arquivo
```

## 🎓 Conceitos Importantes

### Fator R
O Fator R é a relação entre a folha de pagamento e a receita bruta. Para empresas de serviços no Simples Nacional:
- **Fator R ≥ 28%**: Anexo III (alíquotas menores)
- **Fator R < 28%**: Anexo V (alíquotas maiores)

### Pró-labore vs. Dividendos
- **Pró-labore**: Remuneração pelo trabalho dos sócios (tributado)
- **Dividendos**: Distribuição de lucros (isento de IR)

O SimpliTax simula diferentes proporções para encontrar o equilíbrio ideal.

### Regimes Tributários
- **Simples Nacional**: Regime simplificado para pequenas empresas
- **Lucro Presumido**: Presume margem de lucro predefinida
- **Lucro Real**: Baseado no lucro contábil efetivo

## 🔒 Segurança

- Validação de entrada de dados
- Sanitização de CNPJ
- Tratamento de erros robusto

## 📈 Roadmap

- [ ] Suporte a múltiplos períodos (análise histórica)
- [ ] Geração de relatórios em PDF
- [ ] Dashboard web interativo
- [ ] Integração com sistemas contábeis
- [ ] Machine Learning para previsões
- [ ] Suporte a múltiplas empresas
- [ ] Notificações automáticas de alertas

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💻 Autor

Gustavo H. Martins

## 📞 Suporte

Para dúvidas ou suporte, abra uma issue no GitHub.

---

**SimpliTax 2026** - Transformando a Reforma Tributária em vantagem prática para contadores! 🚀