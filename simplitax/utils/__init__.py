"""
Funções utilitárias para SimpliTax
"""

from decimal import Decimal
from typing import Union


def formatar_moeda(valor: Union[Decimal, float]) -> str:
    """
    Formata valor como moeda brasileira
    
    Args:
        valor: Valor a ser formatado
    
    Returns:
        String formatada como R$ X.XXX,XX
    """
    if isinstance(valor, float):
        valor = Decimal(str(valor))
    
    valor_str = f"{valor:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return f"R$ {valor_str}"


def formatar_percentual(valor: Union[Decimal, float], casas_decimais: int = 2) -> str:
    """
    Formata valor como percentual
    
    Args:
        valor: Valor a ser formatado (já em escala 0-100)
        casas_decimais: Número de casas decimais
    
    Returns:
        String formatada como X.XX%
    """
    if isinstance(valor, float):
        valor = Decimal(str(valor))
    
    return f"{valor:.{casas_decimais}f}%"


def validar_cnpj(cnpj: str) -> bool:
    """
    Valida CNPJ usando algoritmo de dígitos verificadores
    
    Args:
        cnpj: CNPJ a ser validado (com ou sem formatação)
    
    Returns:
        True se válido, False caso contrário
    """
    # Remove formatação
    cnpj = ''.join(filter(str.isdigit, cnpj))
    
    # Verifica tamanho
    if len(cnpj) != 14:
        return False
    
    # Verifica se todos os dígitos são iguais
    if cnpj == cnpj[0] * 14:
        return False
    
    # Calcula primeiro dígito verificador
    multiplicadores1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    soma = sum(int(cnpj[i]) * multiplicadores1[i] for i in range(12))
    resto = soma % 11
    digito1 = 0 if resto < 2 else 11 - resto
    
    if int(cnpj[12]) != digito1:
        return False
    
    # Calcula segundo dígito verificador
    multiplicadores2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    soma = sum(int(cnpj[i]) * multiplicadores2[i] for i in range(13))
    resto = soma % 11
    digito2 = 0 if resto < 2 else 11 - resto
    
    return int(cnpj[13]) == digito2


def formatar_cnpj(cnpj: str) -> str:
    """
    Formata CNPJ para exibição
    
    Args:
        cnpj: CNPJ sem formatação (apenas dígitos)
    
    Returns:
        CNPJ formatado como XX.XXX.XXX/XXXX-XX
    """
    cnpj = ''.join(filter(str.isdigit, cnpj))
    
    if len(cnpj) != 14:
        return cnpj
    
    return f"{cnpj[:2]}.{cnpj[2:5]}.{cnpj[5:8]}/{cnpj[8:12]}-{cnpj[12:]}"


def calcular_diferenca_percentual(valor1: Decimal, valor2: Decimal) -> Decimal:
    """
    Calcula diferença percentual entre dois valores
    
    Args:
        valor1: Valor base
        valor2: Valor comparado
    
    Returns:
        Diferença percentual
    """
    if valor1 == 0:
        return Decimal('0')
    
    return ((valor2 - valor1) / abs(valor1)) * 100


def arredondar_moeda(valor: Decimal) -> Decimal:
    """
    Arredonda valor para 2 casas decimais (padrão monetário)
    
    Args:
        valor: Valor a ser arredondado
    
    Returns:
        Valor arredondado
    """
    from decimal import ROUND_HALF_UP
    return valor.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
