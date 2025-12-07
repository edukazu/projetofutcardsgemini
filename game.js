// game.js

class Card {
    // ... (Mantém a mesma estrutura de Card)
    constructor(name, position, attack, defense) {
        this.name = name;
        this.position = position;
        this.attack = attack; 
        this.defense = defense; 
    }
}

class Game {
    constructor() {
        // Zonas de campo: 0 (Gol IA) a 4 (Gol Jogador)
        this.fieldTerritories = [
            'Gol IA', 'Defesa IA', 'Meio-Campo', 'Ataque Jogador', 'Gol Jogador'
        ];
        
        this.ballPositionIndex = 2; // Inicia no Meio-Campo (2).
        this.possession = 0; // 1: Jogador (Time A), -1: IA (Time B), 0: Neutro
        this.scoreA = 0; // Jogador
        this.scoreB = 0; // IA

        // Cartas de exemplo (usaremos 1 de cada posição)
        this.teamA = [
            new Card('Atacante A', 'ATACANTE', 15, 8),
            new Card('Meia A', 'MEIO-CAMPISTA', 10, 10),
            new Card('Defensor A', 'DEFENSOR', 5, 12),
            new Card('Goleiro A', 'GOLEIRO', 1, 15) 
        ];
        this.teamB = [
            new Card('Atacante B', 'ATACANTE', 14, 7),
            new Card('Meia B', 'MEIO-CAMPISTA', 9, 11),
            new Card('Defensor B', 'DEFENSOR', 6, 11),
            new Card('Goleiro B', 'GOLEIRO', 2, 14)
        ];
        
        // Define quem é o time do Jogador para fins de exibição
        this.playerTeam = this.teamA;
        this.iaTeam = this.teamB;
    }
    
    // ... (Função startBattle - A lógica de seleção de cartas precisa ser mais inteligente aqui)
    
    startBattle() {
        console.log(`--- Nova Batalha em ${this.fieldTerritories[this.ballPositionIndex]} ---`);

        let attackingTeam, defendingTeam;
        let direction; // 1: Jogador avança, -1: IA avança

        // 1. Define quem ataca e quem defende com base na posse atual
        if (this.possession >= 0) {
            attackingTeam = this.playerTeam;
            defendingTeam = this.iaTeam;
            direction = 1; // Jogador avança para a direita (Zona 4)
        } else {
            attackingTeam = this.iaTeam;
            defendingTeam = this.playerTeam;
            direction = -1; // IA avança para a esquerda (Zona 0)
        }
        
        // 2. Seleciona cartas (Simplificado: atacante e defensor aleatórios)
        const attacker = attackingTeam[Math.floor(Math.random() * attackingTeam.length)];
        const defender = defendingTeam[Math.floor(Math.random() * defendingTeam.length)];

        // --- Adição de Lógica de Batalha por ZONA ---
        // Exemplo: Ataque é mais forte na Zona de Ataque, Defesa é mais forte na Defesa.
        let zoneModifier = 1;
        if (this.ballPositionIndex === 1 || this.ballPositionIndex === 3) { // Zona de Defesa ou Ataque
            zoneModifier = 1.2; 
        } else if (this.ballPositionIndex === 0 || this.ballPositionIndex === 4) { // Zona de Gol (Goleiro!)
            // Nesta fase a batalha é entre um atacante e o goleiro
            const goalie = defendingTeam.find(c => c.position === 'GOLEIRO') || defender;
            zoneModifier = 0.5; // Dificulta muito o ataque
            // Garantimos que o defensor é o goleiro se estiver na zona de gol (simplificando)
            // Para o MVP, usaremos o defensor aleatório, mas podemos aprimorar isso depois.
        }

        // 3. Calcula os valores de batalha com modificador da zona
        const attackValue = (attacker.attack * zoneModifier) + (Math.random() * 5); 
        const defenseValue = defender.defense + (Math.random() * 5); 

        // 4. Define o resultado
        if (attackValue > defenseValue) {
            this.handleAttackWin(attacker.name, direction);
        } else {
            this.handleDefenseWin(defender.name, direction);
        }

        this.render(); 
    }

    /**
     * Lógica quando o atacante ganha a batalha (avanço de território).
     */
    handleAttackWin(attackerName, direction) {
        let currentZone = this.ballPositionIndex;
        
        if (currentZone === 4 && direction === 1) { // Jogador faz Gol (na zona 4)
            this.scoreA++;
            this.ballPositionIndex = 2; 
            this.possession = 0; 
            document.getElementById('game-info').textContent = `GOOOL do Jogador! ${attackerName} marcou.`;
        } else if (currentZone === 0 && direction === -1) { // IA faz Gol (na zona 0)
            this.scoreB++;
            this.ballPositionIndex = 2; 
            this.possession = 0; 
            document.getElementById('game-info').textContent = `GOOOL da IA! ${attackerName} marcou.`;
        } else {
            // Avança um território (Zona 1 -> 2 -> 3 ou 3 -> 2 -> 1)
            this.ballPositionIndex += direction;
            // O atacante mantém a posse ou ganha, se estava neutra
            this.possession = direction;
            document.getElementById('game-info').textContent = `${attackerName} avança para ${this.fieldTerritories[this.ballPositionIndex]}!`;
        }
    }

    /**
     * Lógica quando o defensor ganha a batalha (mantém a posição ou retoma a posse).
     */
    handleDefenseWin(defenderName, direction) {
        // Se a posse estava na mão do atacante, o defensor rouba a posse (inverte a direção).
        if (this.possession !== 0) {
            this.possession *= -1; // Inverte a posse (-1 para 1 ou 1 para -1)
            document.getElementById('game-info').textContent = `${defenderName} rouba a bola! Posse agora é do ${this.possession > 0 ? 'JOGADOR' : 'IA'}.`;
        } else {
            // Se a posse era 0 (neutra), o defensor mantém a posse neutra.
            document.getElementById('game-info').textContent = `${defenderName} segura a posição no Meio-Campo.`;
        }
    }

    /**
     * Atualiza a interface do usuário (Placar e Posição da Bola).
     */
    render() {
        // Atualiza Placar
        const possessionText = this.possession > 0 ? 'JOGADOR' : (this.possession < 0 ? 'IA' : 'NEUTRA');
        document.getElementById('score-board').textContent = 
            `JOGADOR ${this.scoreA} x ${this.scoreB} IA | Posse: ${possessionText} (${this.fieldTerritories[this.ballPositionIndex]})`;

        // Atualiza a posição visual da bola
        const territoryElements = document.querySelectorAll('.field-zone');
        // Usa a largura total do container para calcular a posição relativa
        const containerWidth = 900; // Deve ser o mesmo valor de #pitch-container.width no CSS
        
        // As 5 zonas são distribuídas. Precisamos encontrar o centro da zona atual.
        // Cada zona tem 180px (900/5). O centro da zona i é i * 180 + 90.
        const zoneWidth = containerWidth / this.fieldTerritories.length;
        let newLeft = (this.ballPositionIndex * zoneWidth) + (zoneWidth / 2);

        document.getElementById('ball-indicator').style.left = `${newLeft}px`;
    }
}