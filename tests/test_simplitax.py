"""
Testes para SimpliTax 2026
"""

import pytest
from decimal import Decimal
from datetime import date

from simplitax.models import (
    DadosEmpresa, DadosFinanceiros, RegimeTributario, TipoEmpresa,
    CenarioDistribuicao
)
from simplitax.calculators import CalculadoraTributos, CalculadoraProLabore
from simplitax.simulators import SimuladorCenarios, AnalisadorRiscosFiscais
from simplitax.reports import GeradorRelatorios, ConciliadorDados


@pytest.fixture
def empresa_exemplo():
    """Fixture com dados de empresa exemplo"""
    return DadosEmpresa(
        cnpj="12345678000190",
        razao_social="Empresa Teste Ltda",
        regime_tributario=RegimeTributario.SIMPLES_NACIONAL,
        tipo_empresa=TipoEmpresa.PRESTACAO_SERVICOS,
        data_inicio=date(2020, 1, 1)
    )


@pytest.fixture
def dados_financeiros_exemplo():
    """Fixture com dados financeiros exemplo"""
    return DadosFinanceiros(
        receita_bruta=Decimal("50000.00"),
        custos_operacionais=Decimal("10000.00"),
        folha_pagamento=Decimal("15000.00"),
        outras_despesas=Decimal("5000.00"),
        periodo_referencia="2026-01"
    )


class TestModels:
    """Testes para os modelos de dados"""
    
    def test_criar_dados_empresa(self, empresa_exemplo):
        """Testa criação de dados da empresa"""
        assert empresa_exemplo.cnpj == "12345678000190"
        assert empresa_exemplo.regime_tributario == RegimeTributario.SIMPLES_NACIONAL
        assert empresa_exemplo.tipo_empresa == TipoEmpresa.PRESTACAO_SERVICOS
    
    def test_validacao_cnpj_invalido(self):
        """Testa validação de CNPJ inválido"""
        with pytest.raises(ValueError):
            DadosEmpresa(
                cnpj="123",  # CNPJ inválido
                razao_social="Teste",
                regime_tributario=RegimeTributario.SIMPLES_NACIONAL,
                tipo_empresa=TipoEmpresa.PRESTACAO_SERVICOS,
                data_inicio=date(2020, 1, 1)
            )
    
    def test_receita_liquida(self, dados_financeiros_exemplo):
        """Testa cálculo de receita líquida"""
        esperado = Decimal("50000") - Decimal("10000") - Decimal("5000")
        assert dados_financeiros_exemplo.receita_liquida == esperado


class TestCalculadoraTributos:
    """Testes para a calculadora de tributos"""
    
    def test_calcular_tributos_simples_nacional(self, empresa_exemplo, dados_financeiros_exemplo):
        """Testa cálculo de tributos no Simples Nacional"""
        calc = CalculadoraTributos(empresa_exemplo)
        resultado = calc.calcular_tributos(dados_financeiros_exemplo)
        
        assert resultado.regime == RegimeTributario.SIMPLES_NACIONAL
        assert resultado.fator_r is not None
        assert resultado.total_impostos > 0
        assert resultado.anexo_aplicavel in ["Anexo III", "Anexo V"]
    
    def test_fator_r_calculation(self, empresa_exemplo, dados_financeiros_exemplo):
        """Testa cálculo do Fator R"""
        calc = CalculadoraTributos(empresa_exemplo)
        resultado = calc.calcular_tributos(dados_financeiros_exemplo)
        
        fator_r_esperado = dados_financeiros_exemplo.folha_pagamento / dados_financeiros_exemplo.receita_bruta
        assert resultado.fator_r == fator_r_esperado
    
    def test_calcular_tributos_lucro_presumido(self, dados_financeiros_exemplo):
        """Testa cálculo de tributos no Lucro Presumido"""
        empresa = DadosEmpresa(
            cnpj="12345678000190",
            razao_social="Empresa LP",
            regime_tributario=RegimeTributario.LUCRO_PRESUMIDO,
            tipo_empresa=TipoEmpresa.PRESTACAO_SERVICOS,
            data_inicio=date(2020, 1, 1)
        )
        
        calc = CalculadoraTributos(empresa)
        resultado = calc.calcular_tributos(dados_financeiros_exemplo)
        
        assert resultado.regime == RegimeTributario.LUCRO_PRESUMIDO
        assert resultado.irpj > 0
        assert resultado.csll > 0
        assert resultado.pis > 0
        assert resultado.cofins > 0


class TestCalculadoraProLabore:
    """Testes para a calculadora de pró-labore"""
    
    def test_calcular_custo_pro_labore(self):
        """Testa cálculo de custo de pró-labore"""
        calc = CalculadoraProLabore()
        resultado = calc.calcular_custo_pro_labore(Decimal("5000"), numero_socios=1)
        
        assert resultado['valor_bruto'] == Decimal("5000")
        assert resultado['inss_patronal'] > 0
        assert resultado['inss_socio'] > 0
        assert resultado['custo_total_empresa'] > resultado['valor_bruto']
    
    def test_calcular_pro_labore_multiplos_socios(self):
        """Testa cálculo com múltiplos sócios"""
        calc = CalculadoraProLabore()
        resultado = calc.calcular_custo_pro_labore(Decimal("5000"), numero_socios=2)
        
        assert resultado['valor_bruto'] == Decimal("10000")


class TestSimuladorCenarios:
    """Testes para o simulador de cenários"""
    
    def test_simular_cenarios(self, empresa_exemplo, dados_financeiros_exemplo):
        """Testa simulação de cenários"""
        simulador = SimuladorCenarios(empresa_exemplo)
        cenarios = simulador.simular_cenarios(dados_financeiros_exemplo)
        
        assert len(cenarios) > 0
        assert all(isinstance(c, CenarioDistribuicao) for c in cenarios)
    
    def test_identificar_melhor_cenario(self, empresa_exemplo, dados_financeiros_exemplo):
        """Testa identificação do melhor cenário"""
        simulador = SimuladorCenarios(empresa_exemplo)
        cenarios = simulador.simular_cenarios(dados_financeiros_exemplo)
        melhor = simulador.identificar_melhor_cenario(cenarios)
        
        assert melhor in cenarios
        assert melhor.custo_tributario_total == min(c.custo_tributario_total for c in cenarios)
    
    def test_calcular_economia_potencial(self, empresa_exemplo, dados_financeiros_exemplo):
        """Testa cálculo de economia potencial"""
        simulador = SimuladorCenarios(empresa_exemplo)
        cenarios = simulador.simular_cenarios(dados_financeiros_exemplo)
        economia = simulador.calcular_economia_potencial(cenarios)
        
        assert economia >= 0


class TestAnalisadorRiscosFiscais:
    """Testes para o analisador de riscos fiscais"""
    
    def test_analisar_riscos(self, empresa_exemplo, dados_financeiros_exemplo):
        """Testa análise de riscos"""
        calc = CalculadoraTributos(empresa_exemplo)
        resultado = calc.calcular_tributos(dados_financeiros_exemplo)
        
        cenario = CenarioDistribuicao(
            percentual_pro_labore=Decimal("30"),
            percentual_dividendos=Decimal("70"),
            valor_pro_labore=Decimal("10000"),
            valor_dividendos=Decimal("20000"),
            custo_tributario_total=Decimal("5000")
        )
        
        analisador = AnalisadorRiscosFiscais(empresa_exemplo)
        riscos = analisador.analisar_riscos(dados_financeiros_exemplo, resultado, cenario)
        
        assert isinstance(riscos, list)


class TestGeradorRelatorios:
    """Testes para o gerador de relatórios"""
    
    def test_gerar_relatorio_completo(self, empresa_exemplo, dados_financeiros_exemplo):
        """Testa geração de relatório completo"""
        calc = CalculadoraTributos(empresa_exemplo)
        resultado = calc.calcular_tributos(dados_financeiros_exemplo)
        
        simulador = SimuladorCenarios(empresa_exemplo)
        cenarios = simulador.simular_cenarios(dados_financeiros_exemplo)
        melhor = simulador.identificar_melhor_cenario(cenarios)
        economia = simulador.calcular_economia_potencial(cenarios)
        
        analisador = AnalisadorRiscosFiscais(empresa_exemplo)
        riscos = analisador.analisar_riscos(dados_financeiros_exemplo, resultado, melhor)
        
        gerador = GeradorRelatorios()
        relatorio = gerador.gerar_relatorio_completo(
            empresa_exemplo, dados_financeiros_exemplo, resultado,
            cenarios, melhor, riscos, economia
        )
        
        assert relatorio.empresa == empresa_exemplo
        assert relatorio.resultado_tributario == resultado
        assert relatorio.melhor_cenario == melhor
    
    def test_exportar_json(self, empresa_exemplo, dados_financeiros_exemplo):
        """Testa exportação em JSON"""
        calc = CalculadoraTributos(empresa_exemplo)
        resultado = calc.calcular_tributos(dados_financeiros_exemplo)
        
        gerador = GeradorRelatorios()
        relatorio = gerador.gerar_relatorio_completo(
            empresa_exemplo, dados_financeiros_exemplo, resultado,
            [], None, [], Decimal("0")
        )
        
        json_str = gerador.exportar_json(relatorio)
        assert isinstance(json_str, str)
        assert len(json_str) > 0
    
    def test_preparar_dados_dashboard(self, empresa_exemplo, dados_financeiros_exemplo):
        """Testa preparação de dados para dashboard"""
        calc = CalculadoraTributos(empresa_exemplo)
        resultado = calc.calcular_tributos(dados_financeiros_exemplo)
        
        gerador = GeradorRelatorios()
        relatorio = gerador.gerar_relatorio_completo(
            empresa_exemplo, dados_financeiros_exemplo, resultado,
            [], None, [], Decimal("0")
        )
        
        dashboard = gerador.preparar_dados_dashboard(relatorio)
        
        assert 'empresa' in dashboard
        assert 'metricas_principais' in dashboard
        assert 'impostos' in dashboard


class TestConciliadorDados:
    """Testes para o conciliador de dados"""
    
    def test_validar_fator_r(self):
        """Testa validação de Fator R"""
        conciliador = ConciliadorDados()
        resultado = conciliador.validar_fator_r(
            Decimal("15000"),
            Decimal("50000")
        )
        
        assert resultado['valido']
        assert resultado['fator_r'] == 0.3
        assert resultado['anexo'] == "Anexo III"
    
    def test_conciliar_receitas(self):
        """Testa conciliação de receitas"""
        conciliador = ConciliadorDados()
        resultado = conciliador.conciliar_receitas(
            Decimal("100000"),
            [Decimal("25000"), Decimal("25000"), Decimal("25000"), Decimal("25000")]
        )
        
        assert resultado['conciliado']
        assert resultado['status'] == "OK"
