"""
Exemplo de uso do SimpliTax 2026
Demonstra as principais funcionalidades da plataforma
"""

from decimal import Decimal
from datetime import date

from simplitax.models import (
    DadosEmpresa, DadosFinanceiros, RegimeTributario, TipoEmpresa
)
from simplitax.calculators import CalculadoraTributos, CalculadoraProLabore
from simplitax.simulators import SimuladorCenarios, AnalisadorRiscosFiscais
from simplitax.reports import GeradorRelatorios


def exemplo_completo():
    """
    Demonstra um fluxo completo de análise tributária
    """
    print("=" * 80)
    print("SIMPLITAX 2026 - EXEMPLO DE ANÁLISE COMPLETA")
    print("=" * 80)
    print()
    
    # 1. Criar dados da empresa
    print("1. Cadastrando empresa...")
    empresa = DadosEmpresa(
        cnpj="12345678000190",
        razao_social="Consultoria Exemplo Ltda",
        regime_tributario=RegimeTributario.SIMPLES_NACIONAL,
        tipo_empresa=TipoEmpresa.PRESTACAO_SERVICOS,
        anexo_simples="Anexo III",
        data_inicio=date(2020, 1, 1)
    )
    print(f"   Empresa: {empresa.razao_social}")
    print(f"   Regime: {empresa.regime_tributario.value}")
    print()
    
    # 2. Informar dados financeiros
    print("2. Processando dados financeiros...")
    dados_financeiros = DadosFinanceiros(
        receita_bruta=Decimal("50000.00"),
        custos_operacionais=Decimal("10000.00"),
        folha_pagamento=Decimal("15000.00"),
        outras_despesas=Decimal("5000.00"),
        periodo_referencia="2026-01"
    )
    print(f"   Receita Bruta: R$ {dados_financeiros.receita_bruta:,.2f}")
    print(f"   Folha de Pagamento: R$ {dados_financeiros.folha_pagamento:,.2f}")
    print(f"   Receita Líquida: R$ {dados_financeiros.receita_liquida:,.2f}")
    print()
    
    # 3. Calcular tributos
    print("3. Calculando tributos...")
    calculadora = CalculadoraTributos(empresa)
    resultado_tributario = calculadora.calcular_tributos(dados_financeiros)
    
    print(f"   Fator R: {resultado_tributario.fator_r:.2%}")
    print(f"   Anexo: {resultado_tributario.anexo_aplicavel}")
    print(f"   Total de Impostos: R$ {resultado_tributario.total_impostos:,.2f}")
    print(f"   Lucro Líquido: R$ {resultado_tributario.lucro_liquido:,.2f}")
    print(f"   Carga Tributária: {resultado_tributario.carga_tributaria_efetiva:.2f}%")
    print()
    
    # 4. Simular cenários
    print("4. Simulando cenários de distribuição...")
    simulador = SimuladorCenarios(empresa)
    cenarios = simulador.simular_cenarios(dados_financeiros, numero_socios=2)
    
    print(f"   {len(cenarios)} cenários simulados")
    print()
    print("   Top 3 melhores cenários:")
    for i, cenario in enumerate(cenarios[:3], 1):
        print(f"   {i}. Pró-labore: {cenario.percentual_pro_labore:.0f}% | "
              f"Dividendos: {cenario.percentual_dividendos:.0f}% | "
              f"Custo: R$ {cenario.custo_tributario_total:,.2f}")
    print()
    
    melhor_cenario = simulador.identificar_melhor_cenario(cenarios)
    economia = simulador.calcular_economia_potencial(cenarios)
    
    print(f"   Melhor Cenário: {melhor_cenario.percentual_pro_labore:.0f}% Pró-labore / "
          f"{melhor_cenario.percentual_dividendos:.0f}% Dividendos")
    print(f"   Economia Potencial: R$ {economia:,.2f}")
    print()
    
    # 5. Analisar riscos
    print("5. Analisando riscos fiscais...")
    analisador = AnalisadorRiscosFiscais(empresa)
    riscos = analisador.analisar_riscos(
        dados_financeiros,
        resultado_tributario,
        melhor_cenario
    )
    
    if riscos:
        print(f"   {len(riscos)} risco(s) identificado(s):")
        for risco in riscos:
            print(f"   - [{risco.nivel.upper()}] {risco.categoria}: {risco.descricao}")
    else:
        print("   Nenhum risco crítico identificado")
    print()
    
    # 6. Gerar relatório
    print("6. Gerando relatório completo...")
    gerador = GeradorRelatorios()
    relatorio = gerador.gerar_relatorio_completo(
        empresa=empresa,
        dados_financeiros=dados_financeiros,
        resultado_tributario=resultado_tributario,
        cenarios=cenarios,
        melhor_cenario=melhor_cenario,
        riscos=riscos,
        economia=economia
    )
    
    # Exportar relatório em texto
    relatorio_texto = gerador.exportar_resumo_texto(relatorio)
    print()
    print(relatorio_texto)
    
    # Preparar dados para dashboard
    print()
    print("7. Preparando dados para dashboard...")
    dashboard_data = gerador.preparar_dados_dashboard(relatorio)
    print(f"   Dashboard preparado com {len(dashboard_data)} seções")
    print(f"   Alertas: {len(dashboard_data['alertas'])}")
    print()
    
    print("=" * 80)
    print("Análise concluída com sucesso!")
    print("SimpliTax 2026 - Transformando a Reforma Tributária em vantagem prática")
    print("=" * 80)


def exemplo_calculo_pro_labore():
    """
    Exemplo de cálculo de pró-labore
    """
    print("\n" + "=" * 80)
    print("EXEMPLO: CÁLCULO DE PRÓ-LABORE")
    print("=" * 80)
    
    calc = CalculadoraProLabore()
    
    valor_bruto = Decimal("5000.00")
    numero_socios = 2
    
    resultado = calc.calcular_custo_pro_labore(valor_bruto, numero_socios)
    
    print(f"\nPró-labore: R$ {valor_bruto:,.2f} por sócio ({numero_socios} sócios)")
    print(f"\nValor Bruto Total: R$ {resultado['valor_bruto']:,.2f}")
    print(f"INSS Patronal (27.8%): R$ {resultado['inss_patronal']:,.2f}")
    print(f"INSS Sócio (11%): R$ {resultado['inss_socio']:,.2f}")
    print(f"IRPF: R$ {resultado['irpf']:,.2f}")
    print(f"\nCusto Total para Empresa: R$ {resultado['custo_total_empresa']:,.2f}")
    print(f"Valor Líquido para Sócio: R$ {resultado['valor_liquido_socio']:,.2f}")
    print(f"Carga Tributária: {resultado['carga_tributaria']:.2f}%")


if __name__ == "__main__":
    # Executa exemplo completo
    exemplo_completo()
    
    # Executa exemplo de pró-labore
    exemplo_calculo_pro_labore()
