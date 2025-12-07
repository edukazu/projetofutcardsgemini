/**
 * game.js - Lógica Principal do Fut Cards MVP
 */

class Card {
    constructor(name, position, attack, defense) {
        this.name = name;
        this.position = position; // 'GOLEIRO', 'DEFENSOR', 'MEIO-CAMPISTA', 'ATACANTE'
        this.attack = attack;
        this.defense = defense;
    }
}

class Game {
    constructor() {
        // Zonas mapeadas pelos IDs do HTML
        // 0: Gol IA | 1: Defesa IA | 2: Meio | 3: Ataque Jogador | 4: Gol Jogador
        this.territories = ['Gol IA', 'Defesa IA', 'Meio-Campo', 'Ataque Jogador', 'Gol Jogador'];
        
        this.ballPositionIndex = 2; // Começa no Meio (Index 2)
        this.possession = 0; // 0: Neutro, 1: Jogador, -1: IA
        
        this.scorePlayer = 0;
        this.scoreIA = 0;

        // Times (Dados Mockados para teste)
        this.playerTeam = [
            new Card('Atacante Jr', 'ATACANTE', 85, 30),
            new Card('Meia Silva', 'MEIO-CAMPISTA', 70, 60),
            new Card('Zagueirão', 'DEFENSOR', 40, 80),
            new Card('Paredão', 'GOLEIRO', 10, 85)
        ];

        this.iaTeam = [
            new Card('Robo-Atak', 'ATACANTE', 80, 35),
            new Card('Robo-Mid', 'MEIO-CAMPISTA', 65, 65),
            new Card('Robo-Def', 'DEFENSOR', 45, 75),
            new Card('Robo-Goal', 'GOLEIRO', 12, 82)
        ];
    }

    startBattle() {
        // Se alguém marcou gol na rodada anterior, reseta para o meio
        if (this.ballPositionIndex === 0 || this.ballPositionIndex === 4) {
            this.resetAfterGoal();
            return;
        }

        console.log("--- Iniciando Batalha ---");
        
        // 1. Identificar quem ataca e quem defende
        // Se posse for 0 (neutra), sorteia quem tenta atacar primeiro ou define padrão
        let attackerTeam, defenderTeam;
        let direction; // 1 (Direita/Jogador) ou -1 (Esquerda/IA)

        if (this.possession === 0) {
            // Disputa inicial: 50/50
            if (Math.random() > 0.5) {
                this.possession = 1; // Jogador ganha a posse inicial
            } else {
                this.possession = -1; // IA ganha a posse inicial
            }
        }

        if (this.possession === 1) {
            attackerTeam = this.playerTeam;
            defenderTeam = this.iaTeam;
            direction = 1; // Tenta ir para zona 4
        } else {
            attackerTeam = this.iaTeam;
            defenderTeam = this.playerTeam;
            direction = -1; // Tenta ir para zona 0
        }

        // 2. Selecionar Cartas (Lógica Simplificada Aleatória por enquanto)
        const attacker = attackerTeam[Math.floor(Math.random() * attackerTeam.length)];
        const defender = defenderTeam[Math.floor(Math.random() * defenderTeam.length)];

        // 3. Calcular Resultado (Ataque vs Defesa + Fator Sorte)
        const attackRoll = attacker.attack + (Math.random() * 20);
        const defenseRoll = defender.defense + (Math.random() * 20);

        let message = `${attacker.name} (Atk) vs ${defender.name} (Def)`;
        
        if (attackRoll > defenseRoll) {
            // Ataque venceu: Avança
            this.ballPositionIndex += direction;
            message += ` -> Ataque Venceu! Avança para ${this.territories[this.ballPositionIndex]}`;
            
            // Verifica Gol
            if (this.ballPositionIndex === 4) {
                this.scorePlayer++;
                message = "GOL DO JOGADOR!!!";
                this.possession = 0; // Posse reseta
            } else if (this.ballPositionIndex === 0) {
                this.scoreIA++;
                message = "GOL DA IA!!!";
                this.possession = 0; // Posse reseta
            }

        } else {
            // Defesa venceu: Rouba a bola (inverte posse) ou mantém se for neutro
            this.possession *= -1; 
            message += ` -> Defesa Venceu! Posse invertida.`;
        }

        this.updateInfo(message);
        this.render();
    }

    resetAfterGoal() {
        this.ballPositionIndex = 2; // Volta para o meio
        this.possession = 0;
        this.updateInfo("Bola no centro. Nova saída!");
        this.render();
    }

    updateInfo(msg) {
        document.getElementById('game-info').textContent = msg;
    }

    render() {
        // Atualiza Placar
        let posText = "NEUTRA";
        if (this.possession === 1) posText = "JOGADOR";
        if (this.possession === -1) posText = "IA";

        document.getElementById('score-board').innerHTML = 
            `JOGADOR ${this.scorePlayer} x ${this.scoreIA} IA <br>` +
            `<span id="possession-display">Posse: ${posText} (${this.territories[this.ballPositionIndex]})</span>`;

        // Atualiza Posição da Bola Visualmente
        this.moveBallVisual();
    }

    moveBallVisual() {
        const container = document.getElementById('pitch-container');
        const ball = document.getElementById('ball-indicator');
        
        // Zonas HTML (0 a 4)
        const zones = [
            document.getElementById('zone-0'), // Gol IA
            document.getElementById('zone-1'), // Defesa IA
            document.getElementById('zone-2'), // Meio
            document.getElementById('zone-3'), // Ataque Jogador
            document.getElementById('zone-4')  // Gol Jogador
        ];

        const targetZone = zones[this.ballPositionIndex];
        
        // Calcula o centro da zona alvo relativo ao container do campo
        // OffsetLeft dá a posição da zona dentro do container pai
        // OffsetWidth dá a largura da zona
        
        const zoneCenter = targetZone.offsetLeft + (targetZone.offsetWidth / 2);
        
        // Aplica a posição à bola
        ball.style.left = `${zoneCenter}px`;
    }
}