"""
Simulador de cenários de distribuição entre pró-labore e dividendos
"""

from decimal import Decimal
from typing import List, Tuple
from simplitax.models import (
    DadosEmpresa, DadosFinanceiros, ResultadoCalculoTributario,
    CenarioDistribuicao, RiscoFiscal, RegimeTributario
)
from simplitax.calculators import CalculadoraTributos, CalculadoraProLabore


class SimuladorCenarios:
    """
    Simula diferentes cenários de distribuição de lucros
    entre pró-labore e dividendos para encontrar a opção mais vantajosa
    """
    
    def __init__(self, empresa: DadosEmpresa):
        self.empresa = empresa
        self.calc_tributos = CalculadoraTributos(empresa)
        self.calc_pro_labore = CalculadoraProLabore()
    
    def simular_cenarios(
        self,
        dados_financeiros: DadosFinanceiros,
        numero_socios: int = 1,
        cenarios_percentuais: List[Tuple[int, int]] = None
    ) -> List[CenarioDistribuicao]:
        """
        Simula múltiplos cenários de distribuição
        
        Args:
            dados_financeiros: Dados financeiros da empresa
            numero_socios: Número de sócios
            cenarios_percentuais: Lista de tuplas (% pró-labore, % dividendos)
                                 Se None, usa cenários padrão
        
        Returns:
            Lista de cenários simulados ordenados por custo tributário
        """
        # Calcula resultado tributário base
        resultado_tributario = self.calc_tributos.calcular_tributos(dados_financeiros)
        lucro_disponivel = resultado_tributario.lucro_liquido
        
        if lucro_disponivel <= 0:
            return []
        
        # Define cenários padrão se não fornecido
        if cenarios_percentuais is None:
            cenarios_percentuais = [
                (0, 100),    # 100% dividendos
                (20, 80),    # 20% pró-labore, 80% dividendos
                (30, 70),    # 30% pró-labore, 70% dividendos
                (40, 60),    # 40% pró-labore, 60% dividendos
                (50, 50),    # 50/50
                (60, 40),    # 60% pró-labore, 40% dividendos
                (70, 30),    # 70% pró-labore, 30% dividendos
                (80, 20),    # 80% pró-labore, 20% dividendos
                (100, 0),    # 100% pró-labore
            ]
        
        cenarios = []
        
        for perc_pl, perc_div in cenarios_percentuais:
            cenario = self._simular_cenario_individual(
                lucro_disponivel=lucro_disponivel,
                percentual_pro_labore=perc_pl,
                percentual_dividendos=perc_div,
                numero_socios=numero_socios,
                imposto_base=resultado_tributario.total_impostos
            )
            cenarios.append(cenario)
        
        # Ordena por custo tributário (menor primeiro)
        cenarios.sort(key=lambda c: c.custo_tributario_total)
        
        return cenarios
    
    def _simular_cenario_individual(
        self,
        lucro_disponivel: Decimal,
        percentual_pro_labore: int,
        percentual_dividendos: int,
        numero_socios: int,
        imposto_base: Decimal
    ) -> CenarioDistribuicao:
        """
        Simula um cenário individual de distribuição
        """
        valor_pro_labore = lucro_disponivel * (Decimal(percentual_pro_labore) / 100)
        valor_dividendos = lucro_disponivel * (Decimal(percentual_dividendos) / 100)
        
        # Calcula custos do pró-labore
        if valor_pro_labore > 0:
            custo_pl = self.calc_pro_labore.calcular_custo_pro_labore(
                valor_pro_labore / numero_socios,
                numero_socios
            )
            custo_pro_labore = custo_pl['custo_total_empresa'] - custo_pl['valor_bruto']
        else:
            custo_pro_labore = Decimal('0')
        
        # Dividendos são isentos no Brasil (até o lucro apurado)
        custo_dividendos = Decimal('0')
        
        # Custo total = impostos da empresa + encargos do pró-labore
        custo_total = imposto_base + custo_pro_labore + custo_dividendos
        
        return CenarioDistribuicao(
            percentual_pro_labore=Decimal(percentual_pro_labore),
            percentual_dividendos=Decimal(percentual_dividendos),
            valor_pro_labore=valor_pro_labore,
            valor_dividendos=valor_dividendos,
            custo_tributario_total=custo_total
        )
    
    def identificar_melhor_cenario(
        self,
        cenarios: List[CenarioDistribuicao]
    ) -> CenarioDistribuicao:
        """
        Identifica o melhor cenário (menor carga tributária)
        """
        if not cenarios:
            raise ValueError("Lista de cenários está vazia")
        
        return min(cenarios, key=lambda c: c.custo_tributario_total)
    
    def calcular_economia_potencial(
        self,
        cenarios: List[CenarioDistribuicao]
    ) -> Decimal:
        """
        Calcula a economia potencial entre o pior e o melhor cenário
        """
        if len(cenarios) < 2:
            return Decimal('0')
        
        pior = max(cenarios, key=lambda c: c.custo_tributario_total)
        melhor = min(cenarios, key=lambda c: c.custo_tributario_total)
        
        return pior.custo_tributario_total - melhor.custo_tributario_total


class AnalisadorRiscosFiscais:
    """
    Analisa e identifica riscos fiscais baseados nos dados da empresa
    """
    
    def __init__(self, empresa: DadosEmpresa):
        self.empresa = empresa
    
    def analisar_riscos(
        self,
        dados_financeiros: DadosFinanceiros,
        resultado_tributario: ResultadoCalculoTributario,
        cenario_escolhido: CenarioDistribuicao
    ) -> List[RiscoFiscal]:
        """
        Analisa e retorna lista de riscos fiscais identificados
        """
        riscos = []
        
        # Risco 1: Fator R abaixo do limite (Simples Nacional)
        if resultado_tributario.fator_r is not None:
            if resultado_tributario.fator_r < Decimal('0.28'):
                riscos.append(RiscoFiscal(
                    nivel="alto",
                    categoria="Fator R",
                    descricao=f"Fator R de {resultado_tributario.fator_r:.2%} está abaixo de 28%, resultando em tributação pelo Anexo V (maior alíquota)",
                    impacto_estimado=dados_financeiros.receita_bruta * Decimal('0.05'),
                    recomendacao="Considere aumentar a folha de pagamento para atingir Fator R >= 28% e reduzir a carga tributária"
                ))
            elif resultado_tributario.fator_r < Decimal('0.30'):
                riscos.append(RiscoFiscal(
                    nivel="médio",
                    categoria="Fator R",
                    descricao=f"Fator R de {resultado_tributario.fator_r:.2%} está próximo do limite de 28%",
                    impacto_estimado=None,
                    recomendacao="Monitore o Fator R mensalmente para evitar mudança de anexo"
                ))
        
        # Risco 2: Pró-labore muito baixo ou zero
        if cenario_escolhido.valor_pro_labore < (dados_financeiros.receita_bruta * Decimal('0.10')):
            riscos.append(RiscoFiscal(
                nivel="médio",
                categoria="Pró-labore",
                descricao="Pró-labore inferior a 10% do faturamento pode chamar atenção fiscal",
                impacto_estimado=None,
                recomendacao="Considere aumentar o pró-labore para um valor mais compatível com a atividade"
            ))
        
        # Risco 3: Lucro muito alto sem distribuição adequada
        if cenario_escolhido.percentual_dividendos > 90:
            riscos.append(RiscoFiscal(
                nivel="baixo",
                categoria="Distribuição de lucros",
                descricao="Distribuição predominantemente em dividendos pode ser questionada",
                impacto_estimado=None,
                recomendacao="Equilibre melhor entre pró-labore e dividendos para reduzir risco de questionamento"
            ))
        
        # Risco 4: Margem de lucro muito alta
        if dados_financeiros.receita_bruta > 0:
            margem = (dados_financeiros.receita_liquida / dados_financeiros.receita_bruta) * 100
            if margem > 70:
                riscos.append(RiscoFiscal(
                    nivel="médio",
                    categoria="Margem de lucro",
                    descricao=f"Margem de lucro de {margem:.1f}% é muito alta e pode ser questionada",
                    impacto_estimado=None,
                    recomendacao="Revise a estrutura de custos e certifique-se de que todas as despesas dedutíveis estão sendo consideradas"
                ))
        
        # Risco 5: Limite do Simples Nacional
        if self.empresa.regime_tributario == RegimeTributario.SIMPLES_NACIONAL:
            limite_anual = Decimal('4800000')  # R$ 4,8 milhões
            if dados_financeiros.receita_bruta * 12 > limite_anual * Decimal('0.9'):
                riscos.append(RiscoFiscal(
                    nivel="alto",
                    categoria="Limite do Simples",
                    descricao="Receita se aproximando do limite do Simples Nacional",
                    impacto_estimado=dados_financeiros.receita_bruta * Decimal('0.10'),
                    recomendacao="Prepare-se para eventual desenquadramento e planeje a transição para outro regime"
                ))
        
        return riscos
