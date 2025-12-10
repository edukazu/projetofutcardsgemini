# ⚽ Fut Cards - Documento de Design de Jogo (GDD)

## 1. Visão Geral
**Fut Cards** é um jogo de estratégia em turnos que simula uma partida de futebol. O núcleo do jogo é o gerenciamento de risco: o jogador deve decidir entre jogadas seguras (Passe), duelos de habilidade (Drible) ou ações de força bruta (Chute de Longe). O objetivo é vencer as batalhas de zona para chegar ao gol adversário.

---

## 2. Atributos das Cartas
Cada carta possui atributos (0-99) que definem sua eficiência em campo.

### Jogadores de Linha
| Atributo | Sigla | Descrição | Ação Principal |
| :--- | :--- | :--- | :--- |
| **Drible** | DRI | Habilidade individual, agilidade e controle. | *Infiltrar / Driblar* |
| **Passe** | PAS | Visão de jogo e precisão no toque. | *Passar / Cruzar* |
| **Finalização** | FIN | Potência e pontaria do chute. | *Chutar* |
| **Desarme** | DES | Capacidade física de roubar a bola (bote). | *Desarme (vs Drible)* |
| **Interceptação** | INT | Leitura de jogo para cortar linhas de passe. | *Interceptar (vs Passe)* |
| **Stamina** | STA | Energia atual (0-100). Afeta o desempenho global. | *Custo de Ação* |

### Goleiros (Cartas Especiais)
| Atributo | Sigla | Descrição |
| :--- | :--- | :--- |
| **Reflexo** | REF | Defesa contra chutes à queima-roupa ou colocados (1vs1). |
| **Posicionamento** | POS | Defesa contra chutes de longe ou com visão bloqueada. |

---

## 3. Mecânica de Batalha (Pedra, Papel e Tesoura)
Nas zonas de Defesa e Meio-Campo, o duelo é resolvido pela escolha tática. O sistema premia a leitura correta da jogada adversária.

### O Triângulo Tático
1.  **Drible (DRI) vs Desarme (DES)**
    * *Confronto de Força:* Vence quem tiver o maior valor (+ dado).
    * *Cenário:* O atacante tenta passar na habilidade; o defensor vai no corpo.

2.  **Drible (DRI) vs Interceptação (INT)**
    * *Vantagem:* **Atacante (Bônus no Drible)**.
    * *Cenário:* O defensor tentou adivinhar um passe e deixou o corredor livre.

3.  **Passe (PAS) vs Interceptação (INT)**
    * *Confronto Tático:* Vence quem tiver maior valor (+ dado).
    * *Cenário:* Duelo mental. O defensor tenta ler a linha de passe.

4.  **Passe (PAS) vs Desarme (DES)**
    * *Vantagem:* **Atacante (Bônus no Passe)**.
    * *Cenário:* O defensor foi seco no corpo, mas a bola já foi tocada.

> **Fator Sorte:** O cálculo final é sempre `Atributo + (Dado d20)`. Isso permite "zebras" e emoção.

---

## 4. A Zona Crítica (Ataque) - Mecânica de Decisão
Ao entrar na Zona de Ataque, o objetivo muda de "Avançar" para "Criar Chance de Gol". O jogador tem 3 opções estratégicas balanceadas:

### OPÇÃO A: Infiltrar (A Melhor Chance)
* *Ação:* O atacante chama o zagueiro para o duelo pessoal (1vs1).
* *Risco:* Alto (pode perder a bola antes de chutar).
* *Confronto:* `DRI Atacante` vs `DES Defensor`.
* *Recompensa:* Se vencer, ativa o **Chute Fatal** (Atacante ganha **+20% FIN** e chuta sem bloqueio).
* *Resumo:* É o caminho "correto" para a maioria dos jogadores. Exige 2 turnos, mas garante a maior chance de gol.

### OPÇÃO B: Chute de Longe (O Recurso de Força)
* *Ação:* Chuta imediatamente, com o zagueiro à frente bloqueando a visão.
* *Risco:* Médio (não perde a bola no drible, mas a chance de defesa é alta).
* *Confronto:* `FIN Atacante` vs `(Goleiro POS + [Defensor INT * 0.3])`.
* *Mecânica:* O zagueiro contribui com 30% da sua Interceptação para ajudar o goleiro.
* *Resumo:* Ideal para craques com chute muito forte ou quando a defesa é fraca taticamente. Economiza turno e stamina de drible.

### OPÇÃO C: Passe Tático (Preparação)
* *Ação:* Toca para um companheiro livre na mesma zona.
* *Recompensa:* O recebedor ganha **+15% no próximo atributo** e recupera um pouco de Stamina.
* *Resumo:* Usado para tirar a bola de um jogador cansado ou marcado por um defensor muito forte.

---

## 5. Sistema de Stamina (Fadiga)
Gerenciar o cansaço é vital. Jogadores exaustos falham em momentos decisivos.

* **Custos de Ação:**
    * Passe / Interceptação: **-10 STA**
    * Drible / Desarme: **-20 STA** (Exige explosão física)
    * Chute de Longe: **-25 STA** (Exige força total)
    * Chute Fatal (pós-drible): **-10 STA** (Apenas jeito/precisão)

* **Penalidades de Cansaço:**
    * Stamina < 50%: Atributos caem **10%**.
    * Stamina < 20%: Atributos caem **30%** (Jogador exausto/lesionado).

* **Recuperação:**
    * Todo jogador que **não agir** no turno recupera **+10 STA**.

---

## 6. Fluxo do Turno (Resumo)
1.  **Fase de Escolha:** Jogador seleciona a Carta ativa na zona da bola.
2.  **Fase de Ação:** Escolhe a jogada (Passe, Drible ou Chute, dependendo da zona).
3.  **Fase de Resposta:** IA decide a defesa (Desarme ou Interceptação).
4.  **Resolução:**
    * Aplica custos de Stamina.
    * Rola Dados (d20).
    * Compara Atributos + Bônus.
5.  **Resultado:**
    * *Vitória:* Avança Zona / Gol / Mantém Posse.
    * *Derrota:* Perde Posse (Contra-ataque) / Defesa do Goleiro.