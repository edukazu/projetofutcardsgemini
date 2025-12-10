# 🎨 Design Document: Identidade Visual e Câmera (Fut Cards)

Este documento consolida as decisões de design visual, comportamento de câmera e referências artísticas do projeto, visando o estilo "Diorama Tático".

## 1. Conceito Visual: "Diorama Tático" (Opção C)
O jogo abandona a visão chapada (Top-Down) e adota uma perspectiva isométrica/3D leve, similar a um tabuleiro de jogo premium ou maquete viva.

* **Cartas no Campo:**
    * Não usamos mais "Tokens" (ícones pequenos).
    * Usamos as **Cartas Completas (Full Art)** no campo.
    * **Estado Padrão:** As cartas ficam reduzidas (aprox. 60% do tamanho) para caberem na formação.
    * **Estado Ativo:** A carta com a bola (e seu marcador) cresce para 100% ou 110%, ganhando destaque e iluminação.
    * **Perspectiva:** As cartas ficam "em pé" verticalmente sobre o gramado inclinado.

## 2. Comportamento de Câmera (Pan & Zoom)
A câmera não é estática. Ela reage à bola para aumentar a imersão.

* **Visão Tática (Idle/Overview):**
    * Zoom: 0.9x a 1.0x.
    * Foco: Mostra a zona onde a bola está + zonas adjacentes.
    * Uso: Kickoff, momentos de estudo.

* **Visão de Posse (Normal):**
    * Zoom: 1.2x.
    * Movimento: *Pan* horizontal suave. A câmera desliza para manter o dono da bola levemente centralizado, mas mostrando o gol adversário ao fundo.

* **Visão de Duelo (Battle Zoom):**
    * Zoom: 1.6x a 1.8x.
    * Foco: Foca exclusivamente no Atacante vs Defensor.
    * Ambiente: As bordas da tela podem escurecer (vignette) para focar na ação.
    * Referência: *Soccer Spirits* (momento do ataque).

## 3. Referências Externas

### A. Soccer Spirits (Com2uS)
* **Inspiração:** Dramatismo e Foco na Arte.
* **Aplicação:**
    * Zoom agressivo nos duelos 1v1.
    * Feedback visual de impacto (tremer tela, partículas).
    * Diferenciação clara entre "Linhas" (Defesa, Meio, Ataque).

### B. Bases de Dados (EA FC / Futbin)
* **Inspiração:** Granularidade e Apresentação de Dados.
* **Aplicação:**
    * Uso de barras coloridas (Verde/Amarelo/Vermelho) para atributos instantâneos.
    * Ícones para "PlayStyles" (habilidades passivas) nas cartas.

---

## 4. Paleta e Atmosfera
* **Overlay de Eventos:** Fundo escuro opaco (85% preto) para eventos como Sorteio e Duelo.
* **Moeda:** Dourada, 3D, com cores dos times (Frente/Verso).
* **Campo:** Gramado com linhas sutis, focado na clareza das zonas.