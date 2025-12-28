#!/usr/bin/env python3
"""
SimpliTax 2026 - Interface de Linha de Comando
"""

import sys
from decimal import Decimal
from datetime import date

from simplitax.models import (
    DadosEmpresa, DadosFinanceiros, RegimeTributario, TipoEmpresa
)
from simplitax.calculators import CalculadoraTributos
from simplitax.simulators import SimuladorCenarios, AnalisadorRiscosFiscais
from simplitax.reports import GeradorRelatorios


def main():
    """Função principal do CLI"""
    print("=" * 80)
    print("SIMPLITAX 2026")
    print("Plataforma de Suporte à Decisão para Reforma Tributária")
    print("=" * 80)
    print()
    
    # Coleta dados da empresa
    print("DADOS DA EMPRESA")
    print("-" * 80)
    
    razao_social = input("Razão Social: ").strip() or "Empresa Exemplo Ltda"
    cnpj = input("CNPJ (apenas números): ").strip() or "12345678000190"
    
    print("\nRegime Tributário:")
    print("1. Simples Nacional")
    print("2. Lucro Presumido")
    print("3. Lucro Real")
    regime_opcao = input("Escolha (1-3): ").strip() or "1"
    
    regimes = {
        "1": RegimeTributario.SIMPLES_NACIONAL,
        "2": RegimeTributario.LUCRO_PRESUMIDO,
        "3": RegimeTributario.LUCRO_REAL
    }
    regime = regimes.get(regime_opcao, RegimeTributario.SIMPLES_NACIONAL)
    
    print("\nTipo de Empresa:")
    print("1. Prestação de Serviços")
    print("2. Comércio")
    print("3. Indústria")
    print("4. Mista")
    tipo_opcao = input("Escolha (1-4): ").strip() or "1"
    
    tipos = {
        "1": TipoEmpresa.PRESTACAO_SERVICOS,
        "2": TipoEmpresa.COMERCIO,
        "3": TipoEmpresa.INDUSTRIA,
        "4": TipoEmpresa.MISTA
    }
    tipo = tipos.get(tipo_opcao, TipoEmpresa.PRESTACAO_SERVICOS)
    
    empresa = DadosEmpresa(
        cnpj=cnpj,
        razao_social=razao_social,
        regime_tributario=regime,
        tipo_empresa=tipo,
        data_inicio=date(2020, 1, 1)
    )
    
    # Coleta dados financeiros
    print()
    print("DADOS FINANCEIROS (Mensal)")
    print("-" * 80)
    
    receita_bruta = input("Receita Bruta (R$): ").strip() or "50000"
    custos = input("Custos Operacionais (R$): ").strip() or "10000"
    folha = input("Folha de Pagamento (R$): ").strip() or "15000"
    outras = input("Outras Despesas (R$): ").strip() or "5000"
    periodo = input("Período (AAAA-MM): ").strip() or "2026-01"
    
    dados_financeiros = DadosFinanceiros(
        receita_bruta=Decimal(receita_bruta),
        custos_operacionais=Decimal(custos),
        folha_pagamento=Decimal(folha),
        outras_despesas=Decimal(outras),
        periodo_referencia=periodo
    )
    
    numero_socios = int(input("Número de Sócios: ").strip() or "1")
    
    print()
    print("Processando análise...")
    print()
    
    # Executa análise
    calc = CalculadoraTributos(empresa)
    resultado = calc.calcular_tributos(dados_financeiros)
    
    simulador = SimuladorCenarios(empresa)
    cenarios = simulador.simular_cenarios(dados_financeiros, numero_socios)
    melhor = simulador.identificar_melhor_cenario(cenarios)
    economia = simulador.calcular_economia_potencial(cenarios)
    
    analisador = AnalisadorRiscosFiscais(empresa)
    riscos = analisador.analisar_riscos(dados_financeiros, resultado, melhor)
    
    # Gera relatório
    gerador = GeradorRelatorios()
    relatorio = gerador.gerar_relatorio_completo(
        empresa, dados_financeiros, resultado, cenarios, melhor, riscos, economia
    )
    
    # Exibe relatório
    print(gerador.exportar_resumo_texto(relatorio))
    
    # Pergunta se deseja salvar
    print()
    salvar = input("Deseja salvar o relatório em JSON? (s/n): ").strip().lower()
    if salvar == 's':
        filename = input("Nome do arquivo (sem extensão): ").strip() or "relatorio"
        with open(f"{filename}.json", 'w', encoding='utf-8') as f:
            f.write(gerador.exportar_json(relatorio))
        print(f"Relatório salvo em {filename}.json")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nOperação cancelada pelo usuário.")
        sys.exit(0)
    except Exception as e:
        print(f"\nErro: {e}")
        sys.exit(1)
