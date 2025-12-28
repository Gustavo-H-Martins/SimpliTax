"""
Calculadora de tributos baseada nas regras da Reforma Tributária 2026
"""

from decimal import Decimal
from typing import Optional
from simplitax.models import (
    DadosEmpresa, DadosFinanceiros, ResultadoCalculoTributario,
    RegimeTributario, TipoEmpresa
)


class CalculadoraTributos:
    """
    Calculadora de tributos que implementa as regras da Reforma Tributária 2026
    """
    
    # Alíquotas para 2026 (Reforma Tributária)
    # Nota: Valores baseados nas projeções da reforma
    ALIQUOTAS_LUCRO_PRESUMIDO = {
        'irpj': Decimal('0.15'),  # 15% sobre o lucro presumido
        'adicional_irpj': Decimal('0.10'),  # 10% sobre lucro acima de 20k/mês
        'csll': Decimal('0.09'),  # 9% sobre o lucro presumido
        'pis': Decimal('0.0065'),  # 0.65% sobre receita
        'cofins': Decimal('0.03'),  # 3% sobre receita
        'iss': Decimal('0.05'),  # 5% sobre receita (média)
    }
    
    PRESUNCAO_LUCRO = {
        TipoEmpresa.PRESTACAO_SERVICOS: Decimal('0.32'),  # 32%
        TipoEmpresa.COMERCIO: Decimal('0.08'),  # 8%
        TipoEmpresa.INDUSTRIA: Decimal('0.08'),  # 8%
        TipoEmpresa.MISTA: Decimal('0.16'),  # 16%
    }
    
    def __init__(self, empresa: DadosEmpresa):
        self.empresa = empresa
    
    def calcular_tributos(
        self, 
        dados_financeiros: DadosFinanceiros
    ) -> ResultadoCalculoTributario:
        """
        Calcula os tributos de acordo com o regime tributário
        """
        if self.empresa.regime_tributario == RegimeTributario.SIMPLES_NACIONAL:
            return self._calcular_simples_nacional(dados_financeiros)
        elif self.empresa.regime_tributario == RegimeTributario.LUCRO_PRESUMIDO:
            return self._calcular_lucro_presumido(dados_financeiros)
        elif self.empresa.regime_tributario == RegimeTributario.LUCRO_REAL:
            return self._calcular_lucro_real(dados_financeiros)
        else:
            raise ValueError(f"Regime tributário não suportado: {self.empresa.regime_tributario}")
    
    def _calcular_simples_nacional(
        self, 
        dados: DadosFinanceiros
    ) -> ResultadoCalculoTributario:
        """
        Calcula tributos no Simples Nacional
        Implementa a lógica do Fator R
        """
        resultado = ResultadoCalculoTributario(
            regime=RegimeTributario.SIMPLES_NACIONAL,
            periodo=dados.periodo_referencia
        )
        
        # Calcula Fator R
        if dados.receita_bruta > 0:
            fator_r = dados.folha_pagamento / dados.receita_bruta
        else:
            fator_r = Decimal('0')
        
        resultado.fator_r = fator_r
        
        # Define anexo baseado no Fator R e tipo de empresa
        if self.empresa.tipo_empresa == TipoEmpresa.PRESTACAO_SERVICOS:
            if fator_r >= Decimal('0.28'):
                resultado.anexo_aplicavel = "Anexo III"
                # Alíquotas progressivas do Anexo III (simplificado)
                aliquota_efetiva = self._calcular_aliquota_simples_anexo3(dados.receita_bruta)
            else:
                resultado.anexo_aplicavel = "Anexo V"
                # Alíquotas progressivas do Anexo V (simplificado)
                aliquota_efetiva = self._calcular_aliquota_simples_anexo5(dados.receita_bruta)
        else:
            resultado.anexo_aplicavel = "Anexo I"
            aliquota_efetiva = self._calcular_aliquota_simples_anexo1(dados.receita_bruta)
        
        # Calcula imposto unificado do Simples
        imposto_unificado = dados.receita_bruta * aliquota_efetiva
        
        # No Simples, o valor é unificado, mas separamos para visualização
        resultado.irpj = imposto_unificado * Decimal('0.25')
        resultado.csll = imposto_unificado * Decimal('0.15')
        resultado.pis = imposto_unificado * Decimal('0.10')
        resultado.cofins = imposto_unificado * Decimal('0.30')
        resultado.iss = imposto_unificado * Decimal('0.20')
        
        resultado.calcular_totais()
        resultado.lucro_liquido = dados.receita_liquida - resultado.total_impostos
        
        if dados.receita_bruta > 0:
            resultado.carga_tributaria_efetiva = (resultado.total_impostos / dados.receita_bruta) * 100
        
        return resultado
    
    def _calcular_lucro_presumido(
        self, 
        dados: DadosFinanceiros
    ) -> ResultadoCalculoTributario:
        """
        Calcula tributos no Lucro Presumido
        """
        resultado = ResultadoCalculoTributario(
            regime=RegimeTributario.LUCRO_PRESUMIDO,
            periodo=dados.periodo_referencia
        )
        
        # Calcula lucro presumido
        percentual_presuncao = self.PRESUNCAO_LUCRO.get(
            self.empresa.tipo_empresa, 
            Decimal('0.32')
        )
        lucro_presumido = dados.receita_bruta * percentual_presuncao
        
        # IRPJ
        resultado.irpj = lucro_presumido * self.ALIQUOTAS_LUCRO_PRESUMIDO['irpj']
        # Adicional de IRPJ (sobre o que exceder R$ 20.000/mês)
        if lucro_presumido > 20000:
            resultado.irpj += (lucro_presumido - 20000) * self.ALIQUOTAS_LUCRO_PRESUMIDO['adicional_irpj']
        
        # CSLL
        resultado.csll = lucro_presumido * self.ALIQUOTAS_LUCRO_PRESUMIDO['csll']
        
        # PIS
        resultado.pis = dados.receita_bruta * self.ALIQUOTAS_LUCRO_PRESUMIDO['pis']
        
        # COFINS
        resultado.cofins = dados.receita_bruta * self.ALIQUOTAS_LUCRO_PRESUMIDO['cofins']
        
        # ISS (para prestação de serviços)
        if self.empresa.tipo_empresa in [TipoEmpresa.PRESTACAO_SERVICOS, TipoEmpresa.MISTA]:
            resultado.iss = dados.receita_bruta * self.ALIQUOTAS_LUCRO_PRESUMIDO['iss']
        
        resultado.calcular_totais()
        resultado.lucro_liquido = dados.receita_liquida - resultado.total_impostos
        
        if dados.receita_bruta > 0:
            resultado.carga_tributaria_efetiva = (resultado.total_impostos / dados.receita_bruta) * 100
        
        return resultado
    
    def _calcular_lucro_real(
        self, 
        dados: DadosFinanceiros
    ) -> ResultadoCalculoTributario:
        """
        Calcula tributos no Lucro Real
        """
        resultado = ResultadoCalculoTributario(
            regime=RegimeTributario.LUCRO_REAL,
            periodo=dados.periodo_referencia
        )
        
        # Lucro real = receita - despesas
        lucro_real = dados.receita_liquida
        
        if lucro_real > 0:
            # IRPJ
            resultado.irpj = lucro_real * Decimal('0.15')
            if lucro_real > 20000:
                resultado.irpj += (lucro_real - 20000) * Decimal('0.10')
            
            # CSLL
            resultado.csll = lucro_real * Decimal('0.09')
        
        # PIS e COFINS no regime não-cumulativo
        resultado.pis = dados.receita_bruta * Decimal('0.0165')  # 1.65%
        resultado.cofins = dados.receita_bruta * Decimal('0.076')  # 7.6%
        
        # ISS
        if self.empresa.tipo_empresa in [TipoEmpresa.PRESTACAO_SERVICOS, TipoEmpresa.MISTA]:
            resultado.iss = dados.receita_bruta * Decimal('0.05')
        
        resultado.calcular_totais()
        resultado.lucro_liquido = dados.receita_liquida - resultado.total_impostos
        
        if dados.receita_bruta > 0:
            resultado.carga_tributaria_efetiva = (resultado.total_impostos / dados.receita_bruta) * 100
        
        return resultado
    
    def _calcular_aliquota_simples_anexo1(self, receita: Decimal) -> Decimal:
        """Calcula alíquota efetiva do Anexo I (Comércio)"""
        # Simplificado - faixa única para exemplo
        if receita <= 180000:
            return Decimal('0.04')  # 4%
        elif receita <= 360000:
            return Decimal('0.073')  # 7.3%
        elif receita <= 720000:
            return Decimal('0.095')  # 9.5%
        else:
            return Decimal('0.107')  # 10.7%
    
    def _calcular_aliquota_simples_anexo3(self, receita: Decimal) -> Decimal:
        """Calcula alíquota efetiva do Anexo III (Serviços com Fator R >= 28%)"""
        if receita <= 180000:
            return Decimal('0.06')  # 6%
        elif receita <= 360000:
            return Decimal('0.112')  # 11.2%
        elif receita <= 720000:
            return Decimal('0.135')  # 13.5%
        else:
            return Decimal('0.16')  # 16%
    
    def _calcular_aliquota_simples_anexo5(self, receita: Decimal) -> Decimal:
        """Calcula alíquota efetiva do Anexo V (Serviços com Fator R < 28%)"""
        if receita <= 180000:
            return Decimal('0.155')  # 15.5%
        elif receita <= 360000:
            return Decimal('0.18')  # 18%
        elif receita <= 720000:
            return Decimal('0.195')  # 19.5%
        else:
            return Decimal('0.205')  # 20.5%


class CalculadoraProLabore:
    """
    Calcula custos tributários de pró-labore
    """
    
    def calcular_custo_pro_labore(
        self,
        valor_bruto: Decimal,
        numero_socios: int = 1
    ) -> dict:
        """
        Calcula o custo total do pró-labore incluindo encargos
        """
        valor_total = valor_bruto * numero_socios
        
        # INSS patronal (20%) + RAT (1-3%, média 2%) + Terceiros (5.8%)
        inss_patronal = valor_total * Decimal('0.278')  # 27.8% total
        
        # INSS do sócio (11% até o teto)
        teto_inss = Decimal('7786.02')  # Teto 2026 (estimado)
        inss_socio = min(valor_total * Decimal('0.11'), teto_inss)
        
        # IRPF (simplificado - usar tabela progressiva real)
        base_irpf = valor_total - inss_socio
        irpf = self._calcular_irpf(base_irpf)
        
        custo_total = valor_total + inss_patronal
        liquido_socio = valor_total - inss_socio - irpf
        
        return {
            'valor_bruto': valor_total,
            'inss_patronal': inss_patronal,
            'inss_socio': inss_socio,
            'irpf': irpf,
            'custo_total_empresa': custo_total,
            'valor_liquido_socio': liquido_socio,
            'carga_tributaria': ((custo_total - liquido_socio) / custo_total * 100) if custo_total > 0 else Decimal('0')
        }
    
    def _calcular_irpf(self, base: Decimal) -> Decimal:
        """
        Calcula IRPF pela tabela progressiva (2026 - valores estimados)
        """
        if base <= Decimal('2259.20'):
            return Decimal('0')
        elif base <= Decimal('2826.65'):
            return (base * Decimal('0.075')) - Decimal('169.44')
        elif base <= Decimal('3751.05'):
            return (base * Decimal('0.15')) - Decimal('381.44')
        elif base <= Decimal('4664.68'):
            return (base * Decimal('0.225')) - Decimal('662.77')
        else:
            return (base * Decimal('0.275')) - Decimal('896.00')
