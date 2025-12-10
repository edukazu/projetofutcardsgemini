# 📘 Fut Cards: Manual de Regras & Matemática (Open Data)

> *"A sorte favorece a mente preparada."*

Este documento detalha as fórmulas exatas e regras que regem o jogo. Nada é escondido. O objetivo é permitir que o jogador calcule seus riscos com precisão.

---

## 1. O Núcleo Matemático (O Duelo)
Todas as disputas no jogo (Chute vs Defesa, Drible vs Desarme) seguem a mesma equação base:

$$\text{Performance Final} = \text{Atributo Base} + \text{Bônus Táticos} + \text{Fator Aleatório (d20)}$$

* **Atributo Base:** O valor impresso na carta (0-99).
* **Bônus Táticos:** Vantagens obtidas por posicionamento, escolha correta de ação (Pedra-Papel-Tesoura) ou suporte de companheiros.
* **Fator Aleatório:** Um número de 1 a 20 é somado ao final.
    * *Nota:* O dado (d20) representa a variabilidade do futebol (um escorregão, um quique ruim na bola). Ele permite "zebras", mas raramente supera uma grande desvantagem tática.

---

## 2. Mecânica de Defesa: "Smart Defense" e Cobertura
Diferente de outros jogos onde você ataca apenas uma carta isolada, no Fut Cards a defesa joga em bloco.

### A. O Cone de Influência
Quando um atacante recebe a bola, o sistema verifica quais defensores estão fisicamente próximos (raio de 35% da largura da zona).
* **1 Defensor no Cone:** Duelo X1 padrão.
* **2+ Defensores no Cone:** Situação de Cobertura (Vantagem Defensiva).

### B. Smart Defense (IA Tática)
Se houver múltiplos defensores no cone, a defesa não escolhe aleatoriamente.
1.  O sistema calcula a **Nota Defensiva** de todos os disponíveis:
    $$\text{Nota} = (\text{Desarme} + \text{Interceptação}) \times (\text{Stamina} \%)$$
2.  O defensor com a **Maior Nota** assume o duelo principal (Main Defender).
3.  Os demais tornam-se **Suportes**.

### C. Bônus de Suporte (Cobertura)
Jogadores que não estão duelando diretamente, mas estão no cone, ajudam o companheiro.
* **Fórmula:** $+10\%$ de eficiência para o Defensor Principal por cada Suporte.
    * *Exemplo:* Atacante (Vini) vs Defensor (Rudolph) + 2 Suportes.
    * Rudolph ganha $+20\%$ em seus atributos finais.
    * *Conclusão:* Driblar uma defesa compacta é estatisticamente suicida. Procure inverter o jogo (Passe).

---

## 3. O Triângulo Tático (Ações)
O jogo premia a leitura da intenção adversária.

| Atacante Escolhe | Defensor Escolhe | Resultado / Bônus | Lógica |
| :--- | :--- | :--- | :--- |
| **DRIBLE** | **DESARME** | **Confronto de Força** | O defensor aceita o desafio físico. Vence o maior atributo. |
| **DRIBLE** | **INTERCEPTAÇÃO** | **Vantagem Atacante (+15%)** | O defensor tentou adivinhar o passe e deixou o corredor aberto. |
| **PASSE** | **INTERCEPTAÇÃO** | **Confronto Tático** | Duelo mental. Quem lê melhor o jogo vence. |
| **PASSE** | **DESARME** | **Vantagem Atacante (+15%)** | O defensor foi seco no corpo ("dar o bote"), mas a bola já saiu. |

---

## 4. Stamina (Fadiga)
A Stamina (0-100) é um multiplicador de performance.
* **100-50%:** Performance Normal (1.0x).
* **49-20%:** Cansaço Leve (0.9x nos atributos).
* **19-0%:** Exaustão (0.7x nos atributos).

*Gerenciar substituições e evitar correr com o mesmo jogador todo turno é vital.*