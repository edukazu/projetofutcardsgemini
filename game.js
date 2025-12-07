// game.js

/**
 * Classe para representar uma Carta (Jogador) no jogo.
 * Usaremos apenas a posição e os atributos básicos por enquanto.
 */
class Card {
    constructor(name, position, attack, defense) {
        this.name = name;
        this.position = position;
        this.attack = attack; // Usado ao atacar (tentar mover a bola para frente)
        this.defense = defense; // Usado ao defender (tentar manter ou retomar a posse)
    }
}

/**
 * Classe principal para gerenciar o estado do jogo e a lógica de batalha.
 */
class Game {
    constructor() {
        // O campo é dividido em 5 territórios (índice 0 a 4)
        // 0: Defesa Time A | 1: Meio-Campo A | 2: Meio-Campo Neutro | 3: Meio-Campo B | 4: Defesa Time B
        this.fieldTerritories = [
            'Defesa A', 'Meio-Campo A', 'Meio-Campo', 'Meio-Campo B', 'Defesa B'
        ];
        
        // Posição da bola (índice do território atual). Inicia no Meio-Campo (2).
        this.ballPositionIndex = 2; 

        // Posse da bola: 1 para Time A, -1 para Time B, 0 para Ninguém/Neutro
        this.possession = 0; 
        
        this.scoreA = 0;
        this.scoreB = 0;

        // Cartas de exemplo (usadas para simular a batalha)
        // Valores básicos apenas para teste: Atacante > Defensor > Meia > Goleiro
        this.teamA = [
            new Card('Atacante A', 'ATACANTE', 15, 8),
            new Card('Defensor A', 'DEFENSOR', 5, 12)
        ];
        this.teamB = [
            new Card('Atacante B', 'ATACANTE', 14, 7),
            new Card('Defensor B', 'DEFENSOR', 6, 11)
        ];
    }

    /**
     * Inicia uma nova rodada de batalha entre cartas aleatórias.
     */
    startBattle() {
        console.log(`--- Nova Batalha em ${this.fieldTerritories[this.ballPositionIndex]} ---`);

        // 1. Seleciona cartas aleatórias para a batalha
        const cardA = this.teamA[Math.floor(Math.random() * this.teamA.length)];
        const cardB = this.teamB[Math.floor(Math.random() * this.teamB.length)];

        // O atacante é quem tem a posse (ou está tentando obtê-la), o defensor é o adversário
        let attacker, defender;

        if (this.possession >= 0) { // Time A ataca
            attacker = cardA;
            defender = cardB;
        } else { // Time B ataca
            attacker = cardB;
            defender = cardA;
        }

        // 2. Calcula os valores de batalha
        // O valor de Ataque é ligeiramente modificado pelo valor de Defesa do Atacante
        const attackValue = attacker.attack + (Math.random() * 5); 
        const defenseValue = defender.defense + (Math.random() * 5); 

        console.log(`${attacker.name} (${Math.round(attackValue)}) vs ${defender.name} (${Math.round(defenseValue)})`);

        // 3. Define o resultado
        if (attackValue > defenseValue) {
            this.handleAttackWin(attacker.name);
        } else {
            this.handleDefenseWin(defender.name);
        }

        this.render(); // Atualiza a interface
    }

    /**
     * Lógica quando o atacante ganha a batalha (avanço de território).
     */
    handleAttackWin(attackerName) {
        let direction = this.possession >= 0 ? 1 : -1; // 1: Time A avança (direita), -1: Time B avança (esquerda)
        
        console.log(`Vitória do Ataque! ${attackerName} avança.`);

        if (this.ballPositionIndex === 4 && direction === 1) { // Time A faz gol
            this.scoreA++;
            this.ballPositionIndex = 2; // Volta para o meio
            console.log("GOOOL do Time A!");
        } else if (this.ballPositionIndex === 0 && direction === -1) { // Time B faz gol
            this.scoreB++;
            this.ballPositionIndex = 2; // Volta para o meio
            console.log("GOOOL do Time B!");
        } else {
            // Avança um território
            this.ballPositionIndex += direction;
            // Se a posse estava neutra, o atacante ganha a posse
            if (this.possession === 0) {
                 this.possession = direction;
            }
        }
    }

    /**
     * Lógica quando o defensor ganha a batalha (mantém a posição ou retoma a posse).
     */
    handleDefenseWin(defenderName) {
        console.log(`Vitória da Defesa! ${defenderName} segura a posição.`);

        // Se a posse estava na mão do atacante (diferente de 0), o defensor rouba a posse.
        if (this.possession !== 0) {
            this.possession *= -1; // Inverte a posse
            console.log("POSSE INVERTIDA!");
        }
        // Se a posse era 0 (neutra), ela permanece 0.
    }

    /**
     * Atualiza a interface do usuário (Placar e Posição da Bola).
     */
    render() {
        // Atualiza Placar
        document.getElementById('score-board').textContent = 
            `Placar: ${this.scoreA} x ${this.scoreB} | Posse: ${this.possession > 0 ? 'TIME A' : (this.possession < 0 ? 'TIME B' : 'NEUTRA')}`;

        // Atualiza a posição visual da bola
        const territoryElements = document.querySelectorAll('.territory');
        const territoryWidth = territoryElements[0].offsetWidth; // Largura de uma zona
        
        // Calcula a posição central do território atual
        let newLeft = (this.ballPositionIndex * territoryWidth) + (territoryWidth / 2);

        // A posição inicial é sempre a do Meio-Campo Neutro (index 2)
        document.getElementById('ball-indicator').style.left = `${newLeft}px`;

        console.log(`Estado Atual: Posse: ${this.possession}, Posição: ${this.ballPositionIndex}`);
    }
}