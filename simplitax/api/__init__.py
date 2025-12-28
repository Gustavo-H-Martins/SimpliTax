"""
API REST para SimpliTax 2026
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import date
from decimal import Decimal
from typing import Dict, Any

from simplitax.models import (
    DadosEmpresa, DadosFinanceiros, RegimeTributario, TipoEmpresa
)
from simplitax.calculators import CalculadoraTributos, CalculadoraProLabore
from simplitax.simulators import SimuladorCenarios, AnalisadorRiscosFiscais
from simplitax.reports import GeradorRelatorios, ConciliadorDados


app = Flask(__name__)
CORS(app)


@app.route('/health', methods=['GET'])
def health_check():
    """Verifica saúde da API"""
    return jsonify({
        "status": "healthy",
        "version": "1.0.0",
        "service": "SimpliTax 2026"
    })


@app.route('/api/calcular-tributos', methods=['POST'])
def calcular_tributos():
    """
    Calcula tributos baseado nos dados fornecidos
    
    POST /api/calcular-tributos
    Body: {
        "empresa": {...},
        "dados_financeiros": {...}
    }
    """
    try:
        dados = request.get_json()
        
        # Valida e cria objetos
        empresa = DadosEmpresa(**dados['empresa'])
        dados_financeiros = DadosFinanceiros(**dados['dados_financeiros'])
        
        # Calcula tributos
        calc = CalculadoraTributos(empresa)
        resultado = calc.calcular_tributos(dados_financeiros)
        
        return jsonify({
            "sucesso": True,
            "resultado": resultado.model_dump()
        })
    
    except Exception as e:
        return jsonify({
            "sucesso": False,
            "erro": str(e)
        }), 400


@app.route('/api/simular-cenarios', methods=['POST'])
def simular_cenarios():
    """
    Simula cenários de distribuição entre pró-labore e dividendos
    
    POST /api/simular-cenarios
    Body: {
        "empresa": {...},
        "dados_financeiros": {...},
        "numero_socios": 1
    }
    """
    try:
        dados = request.get_json()
        
        empresa = DadosEmpresa(**dados['empresa'])
        dados_financeiros = DadosFinanceiros(**dados['dados_financeiros'])
        numero_socios = dados.get('numero_socios', 1)
        
        # Simula cenários
        simulador = SimuladorCenarios(empresa)
        cenarios = simulador.simular_cenarios(dados_financeiros, numero_socios)
        
        melhor = simulador.identificar_melhor_cenario(cenarios)
        economia = simulador.calcular_economia_potencial(cenarios)
        
        return jsonify({
            "sucesso": True,
            "cenarios": [c.model_dump() for c in cenarios],
            "melhor_cenario": melhor.model_dump(),
            "economia_potencial": float(economia)
        })
    
    except Exception as e:
        return jsonify({
            "sucesso": False,
            "erro": str(e)
        }), 400


@app.route('/api/analisar-riscos', methods=['POST'])
def analisar_riscos():
    """
    Analisa riscos fiscais
    
    POST /api/analisar-riscos
    Body: {
        "empresa": {...},
        "dados_financeiros": {...},
        "cenario": {...}
    }
    """
    try:
        dados = request.get_json()
        
        empresa = DadosEmpresa(**dados['empresa'])
        dados_financeiros = DadosFinanceiros(**dados['dados_financeiros'])
        
        # Calcula tributos
        calc = CalculadoraTributos(empresa)
        resultado = calc.calcular_tributos(dados_financeiros)
        
        # Analisa riscos
        from simplitax.models import CenarioDistribuicao
        cenario = CenarioDistribuicao(**dados['cenario'])
        
        analisador = AnalisadorRiscosFiscais(empresa)
        riscos = analisador.analisar_riscos(dados_financeiros, resultado, cenario)
        
        return jsonify({
            "sucesso": True,
            "riscos": [r.model_dump() for r in riscos]
        })
    
    except Exception as e:
        return jsonify({
            "sucesso": False,
            "erro": str(e)
        }), 400


@app.route('/api/relatorio-completo', methods=['POST'])
def relatorio_completo():
    """
    Gera relatório completo de análise
    
    POST /api/relatorio-completo
    Body: {
        "empresa": {...},
        "dados_financeiros": {...},
        "numero_socios": 1,
        "formato": "json|texto|dashboard"
    }
    """
    try:
        dados = request.get_json()
        
        empresa = DadosEmpresa(**dados['empresa'])
        dados_financeiros = DadosFinanceiros(**dados['dados_financeiros'])
        numero_socios = dados.get('numero_socios', 1)
        formato = dados.get('formato', 'json')
        
        # Calcula tributos
        calc = CalculadoraTributos(empresa)
        resultado = calc.calcular_tributos(dados_financeiros)
        
        # Simula cenários
        simulador = SimuladorCenarios(empresa)
        cenarios = simulador.simular_cenarios(dados_financeiros, numero_socios)
        melhor = simulador.identificar_melhor_cenario(cenarios)
        economia = simulador.calcular_economia_potencial(cenarios)
        
        # Analisa riscos
        analisador = AnalisadorRiscosFiscais(empresa)
        riscos = analisador.analisar_riscos(dados_financeiros, resultado, melhor)
        
        # Gera relatório
        gerador = GeradorRelatorios()
        relatorio = gerador.gerar_relatorio_completo(
            empresa, dados_financeiros, resultado, cenarios, melhor, riscos, economia
        )
        
        if formato == 'texto':
            return gerador.exportar_resumo_texto(relatorio), 200, {'Content-Type': 'text/plain; charset=utf-8'}
        elif formato == 'dashboard':
            return jsonify({
                "sucesso": True,
                "dashboard": gerador.preparar_dados_dashboard(relatorio)
            })
        else:  # json
            return jsonify({
                "sucesso": True,
                "relatorio": relatorio.model_dump()
            })
    
    except Exception as e:
        return jsonify({
            "sucesso": False,
            "erro": str(e)
        }), 400


@app.route('/api/calcular-pro-labore', methods=['POST'])
def calcular_pro_labore():
    """
    Calcula custos de pró-labore
    
    POST /api/calcular-pro-labore
    Body: {
        "valor_bruto": 5000.00,
        "numero_socios": 1
    }
    """
    try:
        dados = request.get_json()
        
        valor_bruto = Decimal(str(dados['valor_bruto']))
        numero_socios = dados.get('numero_socios', 1)
        
        calc = CalculadoraProLabore()
        resultado = calc.calcular_custo_pro_labore(valor_bruto, numero_socios)
        
        # Converte Decimals para float
        resultado_json = {k: float(v) if isinstance(v, Decimal) else v 
                         for k, v in resultado.items()}
        
        return jsonify({
            "sucesso": True,
            "resultado": resultado_json
        })
    
    except Exception as e:
        return jsonify({
            "sucesso": False,
            "erro": str(e)
        }), 400


@app.route('/api/validar-fator-r', methods=['POST'])
def validar_fator_r():
    """
    Valida e calcula Fator R
    
    POST /api/validar-fator-r
    Body: {
        "folha_pagamento": 10000.00,
        "receita_bruta": 50000.00
    }
    """
    try:
        dados = request.get_json()
        
        folha = Decimal(str(dados['folha_pagamento']))
        receita = Decimal(str(dados['receita_bruta']))
        
        conciliador = ConciliadorDados()
        resultado = conciliador.validar_fator_r(folha, receita)
        
        return jsonify({
            "sucesso": True,
            "resultado": resultado
        })
    
    except Exception as e:
        return jsonify({
            "sucesso": False,
            "erro": str(e)
        }), 400


@app.route('/api/conciliar-receitas', methods=['POST'])
def conciliar_receitas():
    """
    Concilia receitas declaradas com movimentações bancárias
    
    POST /api/conciliar-receitas
    Body: {
        "receita_declarada": 100000.00,
        "receitas_bancarias": [25000, 25000, 25000, 25000],
        "tolerancia": 0.01
    }
    """
    try:
        dados = request.get_json()
        
        receita_declarada = Decimal(str(dados['receita_declarada']))
        receitas_bancarias = [Decimal(str(r)) for r in dados['receitas_bancarias']]
        tolerancia = Decimal(str(dados.get('tolerancia', '0.01')))
        
        conciliador = ConciliadorDados()
        resultado = conciliador.conciliar_receitas(
            receita_declarada, receitas_bancarias, tolerancia
        )
        
        return jsonify({
            "sucesso": True,
            "resultado": resultado
        })
    
    except Exception as e:
        return jsonify({
            "sucesso": False,
            "erro": str(e)
        }), 400


def create_app(config=None):
    """Factory function para criar a aplicação"""
    if config:
        app.config.update(config)
    return app


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
