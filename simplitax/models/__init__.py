"""
Data models for SimpliTax 2026
Defines the core data structures for financial analysis
"""

from datetime import date
from decimal import Decimal
from typing import Optional, List
from enum import Enum
from pydantic import BaseModel, Field, field_validator


class RegimeTributario(str, Enum):
    """Regimes tributários disponíveis"""
    SIMPLES_NACIONAL = "simples_nacional"
    LUCRO_PRESUMIDO = "lucro_presumido"
    LUCRO_REAL = "lucro_real"


class TipoEmpresa(str, Enum):
    """Tipos de empresa"""
    PRESTACAO_SERVICOS = "prestacao_servicos"
    COMERCIO = "comercio"
    INDUSTRIA = "industria"
    MISTA = "mista"


class DadosEmpresa(BaseModel):
    """Dados cadastrais da empresa"""
    cnpj: str
    razao_social: str
    regime_tributario: RegimeTributario
    tipo_empresa: TipoEmpresa
    anexo_simples: Optional[str] = None  # Para Simples Nacional
    data_inicio: date

    @field_validator('cnpj')
    @classmethod
    def validar_cnpj(cls, v):
        # Remove formatação
        cnpj = ''.join(filter(str.isdigit, v))
        if len(cnpj) != 14:
            raise ValueError('CNPJ deve ter 14 dígitos')
        return cnpj


class DadosFinanceiros(BaseModel):
    """Dados financeiros da empresa para análise"""
    receita_bruta: Decimal = Field(ge=0, description="Receita bruta mensal/anual")
    custos_operacionais: Decimal = Field(ge=0, description="Custos operacionais")
    folha_pagamento: Decimal = Field(ge=0, description="Total da folha de pagamento incluindo encargos")
    outras_despesas: Decimal = Field(ge=0, description="Outras despesas dedutíveis")
    periodo_referencia: str = Field(description="Período de referência (ex: 2025-01)")

    @property
    def receita_liquida(self) -> Decimal:
        """Calcula receita líquida"""
        return self.receita_bruta - self.custos_operacionais - self.outras_despesas


class ConfiguracaoProLabore(BaseModel):
    """Configuração para cálculo de pró-labore"""
    valor_mensal: Decimal = Field(ge=0, description="Valor mensal do pró-labore")
    numero_socios: int = Field(ge=1, description="Número de sócios que receberão")
    aliquota_inss: Decimal = Field(default=Decimal("0.11"), ge=0, le=1)
    aliquota_irpf: Decimal = Field(default=Decimal("0.275"), ge=0, le=1)


class ResultadoCalculoTributario(BaseModel):
    """Resultado do cálculo tributário"""
    regime: RegimeTributario
    periodo: str
    
    # Impostos
    irpj: Decimal = Decimal("0")
    csll: Decimal = Decimal("0")
    pis: Decimal = Decimal("0")
    cofins: Decimal = Decimal("0")
    iss: Decimal = Decimal("0")
    inss: Decimal = Decimal("0")
    
    # Totais
    total_impostos: Decimal = Decimal("0")
    lucro_liquido: Decimal = Decimal("0")
    
    # Fator R (para Simples Nacional)
    fator_r: Optional[Decimal] = None
    anexo_aplicavel: Optional[str] = None
    
    # Carga tributária efetiva
    carga_tributaria_efetiva: Decimal = Decimal("0")

    def calcular_totais(self):
        """Calcula os totais de impostos e carga tributária"""
        self.total_impostos = (
            self.irpj + self.csll + self.pis + 
            self.cofins + self.iss + self.inss
        )


class CenarioDistribuicao(BaseModel):
    """Cenário de distribuição entre pró-labore e dividendos"""
    percentual_pro_labore: Decimal = Field(ge=0, le=100)
    percentual_dividendos: Decimal = Field(ge=0, le=100)
    valor_pro_labore: Decimal = Decimal("0")
    valor_dividendos: Decimal = Decimal("0")
    custo_tributario_total: Decimal = Decimal("0")
    
    @field_validator('percentual_dividendos')
    @classmethod
    def validar_percentuais(cls, v, info):
        if info.data.get('percentual_pro_labore'):
            total = v + info.data['percentual_pro_labore']
            if total != 100:
                raise ValueError('A soma dos percentuais deve ser 100%')
        return v


class RiscoFiscal(BaseModel):
    """Identificação de risco fiscal"""
    nivel: str = Field(description="baixo, médio, alto, crítico")
    categoria: str = Field(description="Categoria do risco")
    descricao: str
    impacto_estimado: Optional[Decimal] = None
    recomendacao: str


class RelatorioAnalise(BaseModel):
    """Relatório completo de análise"""
    empresa: DadosEmpresa
    periodo: str
    resultado_tributario: ResultadoCalculoTributario
    cenarios_simulados: List[CenarioDistribuicao] = []
    melhor_cenario: Optional[CenarioDistribuicao] = None
    riscos_identificados: List[RiscoFiscal] = []
    economia_potencial: Decimal = Decimal("0")
    data_geracao: date = Field(default_factory=date.today)
