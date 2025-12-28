# 📚 Esclarecimento: Cálculo do Fator R no SimpliTax

## 🎯 Resumo Executivo

O cálculo do **Fator R** no SimpliTax está **CORRETO** e conforme a legislação brasileira (Lei Complementar 123/2006).

---

## 📖 O que é o Fator R?

O **Fator R** é um indicador usado pelo Simples Nacional para determinar se empresas de serviços podem ficar no **Anexo III** (alíquotas menores) ou precisam migrar para o **Anexo V** (alíquotas maiores).

### Fórmula:

```
Fator R = (Folha de Pagamento dos últimos 12 meses) / (Receita Bruta dos últimos 12 meses)
```

### Regra:

- **Fator R ≥ 28%** → Empresa fica no **Anexo III** (ECONOMIA!)
- **Fator R < 28%** → Empresa vai para o **Anexo V** (Impostos mais altos)

---

## ✅ O que ENTRA no cálculo da "Folha de Pagamento"?

Segundo a **Lei Complementar 123/2006, Art. 18, § 5º-C**, a folha de pagamento inclui:

1. ✅ **Salários de empregados CLT**
2. ✅ **Pró-labore dos sócios** (SIM, entra no cálculo!)
3. ✅ **Encargos sociais** (FGTS, INSS Patronal)
4. ✅ **13º salário, férias, gratificações**
5. ✅ **Comissões de empregados**

### 🔍 Esclarecimento Importante:

Muitos contadores têm dúvida se o **pró-labore** entra no cálculo. A resposta é **SIM**!

O pró-labore é considerado parte da "folha de pagamento" para fins de cálculo do Fator R, pois:
- É uma remuneração pelo trabalho (assim como salários)
- Sofre incidência de INSS
- Está previsto na LC 123/2006 como "massa salarial"

---

## 🔧 Como o SimpliTax Implementa Isso?

No SimpliTax, separamos os valores para melhor visualização:

```typescript
interface DadosEmpresa {
  receitaBruta: number        // Receita total
  folhaAtual: number          // Salários dos empregados CLT
  prolaboreAtual: number      // Retirada dos sócios
}
```

### Cálculo do Fator R:

```typescript
const folhaTotal = folhaAtual + prolaboreAtual
const fatorR = folhaTotal / receitaBruta
```

### Por que separamos?

A separação entre `folhaAtual` e `prolaboreAtual` serve para:

1. **Clareza**: Facilita identificar onde fazer ajustes
2. **Estratégia**: O sistema pode sugerir "aumente o pró-labore" ou "aumente a folha de empregados"
3. **Flexibilidade**: Diferentes empresas têm diferentes proporções

Mas **AMBOS** entram no cálculo do Fator R!

---

## 📊 Exemplo Prático

### Cenário:

```
Receita Bruta: R$ 100.000/mês
Folha de Empregados: R$ 15.000/mês
Pró-labore Atual: R$ 5.000/mês
```

### Cálculo:

```
Folha Total = R$ 15.000 + R$ 5.000 = R$ 20.000
Fator R = R$ 20.000 / R$ 100.000 = 0,20 (20%)
```

**Resultado:** Fator R = 20% → Abaixo de 28% → Empresa vai para o **Anexo V** 😰

### Solução do SimpliTax:

O sistema sugere:

```
"AUMENTE O PRÓ-LABORE! Aumentando de R$ 5.000 para R$ 13.000,
você economiza R$ XXXXX por ano!"
```

Novo cálculo:
```
Folha Total = R$ 15.000 + R$ 13.000 = R$ 28.000
Fator R = R$ 28.000 / R$ 100.000 = 0,28 (28%)
```

**Resultado:** Fator R = 28% → Empresa fica no **Anexo III** 🎉

---

## 🎯 Conclusão

O SimpliTax calcula o Fator R corretamente:

✅ **Folha Total = Empregados + Pró-labore**  
✅ **Fator R = Folha Total / Receita Bruta**  
✅ **Regra: ≥ 28% para Anexo III**

A separação entre `folhaAtual` e `prolaboreAtual` é apenas para fins de **visualização e estratégia**, mas ambos são somados no cálculo final do Fator R, conforme a legislação.

---

## 📚 Referências Legais

- **Lei Complementar nº 123/2006** - Estatuto Nacional da Microempresa e da Empresa de Pequeno Porte
- **Art. 18, § 5º-C** - Definição do Fator R
- **Resolução CGSN nº 140/2018** - Regulamentação do Simples Nacional

---

**Desenvolvido por LM Tech Consulting**  
SimpliTax - Transformando complexidade em clareza
