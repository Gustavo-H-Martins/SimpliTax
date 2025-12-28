"""
Configurações do SimpliTax 2026
"""

import os
from decimal import Decimal


class Config:
    """Configurações base"""
    
    # Versão da aplicação
    VERSION = "1.0.0"
    
    # Configurações de API
    API_HOST = os.getenv('API_HOST', '0.0.0.0')
    API_PORT = int(os.getenv('API_PORT', 5000))
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    
    # Configurações tributárias (2026)
    ANO_BASE = 2026
    
    # Limites do Simples Nacional (R$)
    LIMITE_SIMPLES_NACIONAL = Decimal('4800000')  # R$ 4,8 milhões/ano
    
    # Fator R mínimo para Anexo III
    FATOR_R_MINIMO_ANEXO3 = Decimal('0.28')
    
    # Teto INSS (estimado 2026)
    TETO_INSS = Decimal('7786.02')
    
    # Salário mínimo (estimado 2026)
    SALARIO_MINIMO = Decimal('1500.00')
    
    # Configurações de relatórios
    DIRETORIO_RELATORIOS = os.getenv('DIRETORIO_RELATORIOS', './reports')
    DIRETORIO_EXPORTS = os.getenv('DIRETORIO_EXPORTS', './exports')
    
    # Configurações de tolerância
    TOLERANCIA_CONCILIACAO = Decimal('0.01')  # 1%


class ConfigProducao(Config):
    """Configurações para produção"""
    DEBUG = False


class ConfigDesenvolvimento(Config):
    """Configurações para desenvolvimento"""
    DEBUG = True


class ConfigTestes(Config):
    """Configurações para testes"""
    DEBUG = True
    TESTING = True


# Mapeia ambientes para configurações
config_por_ambiente = {
    'development': ConfigDesenvolvimento,
    'production': ConfigProducao,
    'testing': ConfigTestes
}


def obter_config(ambiente: str = None) -> Config:
    """
    Obtém configuração baseada no ambiente
    
    Args:
        ambiente: Nome do ambiente (development, production, testing)
    
    Returns:
        Objeto de configuração apropriado
    """
    if ambiente is None:
        ambiente = os.getenv('FLASK_ENV', 'development')
    
    return config_por_ambiente.get(ambiente, ConfigDesenvolvimento)()
