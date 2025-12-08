/**
 * game.js - V7: Zoom Fix & Logic
 */

class Game {
    constructor() {
        this.territories = ['Gol IA', 'Defesa IA', 'Meio-Campo', 'Ataque Jogador', 'Gol Jogador'];
        this.ballPositionIndex = 2; // Começa no Meio
        this.possession = 0; 
        this.scorePlayer = 0;
        this.scoreIA = 0;
        this.isBattling = false; 

        this.teams = TEAMS_DATA;
        
        // Garante que o DOM carregou antes de montar
        setTimeout(() => {
            this.initBoard();
            this.renderUI();
            this.setCamera('OVERVIEW'); // Garante estado inicial
        }, 100);
    }

    initBoard() {
        document.querySelectorAll('.cards-container').forEach(e => e.remove());

        for (let i = 0; i <= 4; i++) {
            const zone = document.getElementById(`zone-${i}`);
            if (zone) {
                const container = document.createElement('div');
                container.className = 'cards-container';
                container.id = `cards-zone-${i}`;

                // Coluna Jogador (Esquerda)
                const clusterPlayer = document.createElement('div');
                clusterPlayer.className = 'team-cluster cluster-player';
                clusterPlayer.id = `cluster-player-zone-${i}`;

                // Coluna IA (Direita)
                const clusterIA = document.createElement('div');
                clusterIA.className = 'team-cluster cluster-ia';
                clusterIA.id = `cluster-ia-zone-${i}`;

                container.appendChild(clusterPlayer);
                container.appendChild(clusterIA);
                zone.appendChild(container);
            }
        }

        this.teams.player.players.forEach(p => this.createCardElement(p, 'player'));
        this.teams.ia.players.forEach(p => this.createCardElement(p, 'ia'));
    }

    createCardElement(playerData, teamType) {
        const clusterId = teamType === 'player' 
            ? `cluster-player-zone-${playerData.zone}`
            : `cluster-ia-zone-${playerData.zone}`;
            
        const container = document.getElementById(clusterId);
        if (!container) return;

        const card = document.createElement('div');
        card.className = 'card-token';
        // Define cor baseada no time
        card.style.backgroundColor = teamType === 'player' ? this.teams.player.color : this.teams.ia.color;
        
        // Conteúdo da Carta
        card.innerHTML = `
            <span style="margin-bottom:5px">${playerData.role}</span>
            <small style="font-size:0.6rem; opacity:0.8">${playerData.name}</small>
            <div style="margin-top:auto; font-size:0.7rem">
                A:${playerData.att} D:${playerData.def}
            </div>
        `;

        container.appendChild(card);
    }

    // --- CICLO DE BATALHA ---
    async startBattle() {
        if (this.isBattling) return; 
        this.isBattling = true;
        
        const btn = document.getElementById('btn-battle');
        btn.disabled = true;
        btn.textContent = "Batalhando...";

        // 1. ZOOM IN: Foca na zona da bola
        console.log("Zoom In...");
        this.setCamera('FOCUS');
        
        // Pausa dramática para o zoom chegar
        await this.wait(1200); 

        // 2. Resolve a rodada (Lógica simples por enquanto)
        this.resolveRound();
        this.renderUI();

        // Pausa para ver o resultado da jogada de perto
        await this.wait(1500);

        // 3. ZOOM OUT: Volta para visão geral
        console.log("Zoom Out...");
        this.setCamera('OVERVIEW');
        
        this.isBattling = false;
        btn.disabled = false;
        btn.textContent = "⚔️ BATALHAR";
        this.updateInfo("Rodada finalizada.");
    }

    resolveRound() {
        if (this.ballPositionIndex === 0 || this.ballPositionIndex === 4) {
            this.resetAfterGoal();
            return;
        }

        // Lógica Provisória: 50% de chance para cada lado se neutro
        let direction = 0;
        if (this.possession === 0) direction = Math.random() > 0.5 ? 1 : -1;
        else direction = this.possession;

        this.ballPositionIndex += direction;
        
        if(this.possession === 0) this.possession = direction;

        if (this.ballPositionIndex > 4) this.ballPositionIndex = 4;
        if (this.ballPositionIndex < 0) this.ballPositionIndex = 0;

        if (this.ballPositionIndex === 4) {
            this.scorePlayer++;
            this.updateInfo("GOL DO JOGADOR!");
            this.possession = 0;
        } else if (this.ballPositionIndex === 0) {
            this.scoreIA++;
            this.updateInfo("GOL DA IA!");
            this.possession = 0;
        } else {
            this.updateInfo(`Bola em: ${this.territories[this.ballPositionIndex]}`);
        }
    }

    resetAfterGoal() {
        this.ballPositionIndex = 2; 
        this.possession = 0;
        this.updateInfo("Bola no centro.");
    }

    // --- CONTROLE DA CÂMERA (FIXED) ---
    setCamera(mode) {
        const pitch = document.getElementById('pitch-container');
        if (!pitch) return;

        // Remove classes antigas de foco para resetar
        pitch.classList.remove(
            'camera-focus-goal-left',
            'camera-focus-defense',
            'camera-focus-mid',
            'camera-focus-attack',
            'camera-focus-goal-right'
        );

        if (mode === 'OVERVIEW') {
            // Ao remover as classes acima, o CSS volta para o estado padrão (scale 0.9)
            return;
        }

        if (mode === 'FOCUS') {
            // Adiciona a classe específica
            switch (this.ballPositionIndex) {
                case 0: pitch.classList.add('camera-focus-goal-left'); break;
                case 1: pitch.classList.add('camera-focus-defense'); break;
                case 2: pitch.classList.add('camera-focus-mid'); break;
                case 3: pitch.classList.add('camera-focus-attack'); break;
                case 4: pitch.classList.add('camera-focus-goal-right'); break;
            }
        }
    }

    renderUI() {
        document.getElementById('score-player').textContent = this.scorePlayer;
        document.getElementById('score-ia').textContent = this.scoreIA;
        
        let posText = this.possession === 0 ? "NEUTRA" : (this.possession === 1 ? "JOGADOR" : "IA");
        let zoneText = this.territories[this.ballPositionIndex];
        document.getElementById('possession-display').innerHTML = `<span>${posText}</span> <small>${zoneText}</small>`;

        this.moveBallVisual();
    }

    moveBallVisual() {
        const ball = document.getElementById('ball-indicator');
        const targetZone = document.getElementById(`zone-${this.ballPositionIndex}`);
        
        if (!ball || !targetZone) return;

        let newLeft = targetZone.offsetLeft + (targetZone.offsetWidth / 2);
        
        // Ajuste para Gols
        if (this.ballPositionIndex === 0) newLeft = -40;
        else if (this.ballPositionIndex === 4) newLeft = document.getElementById('pitch-container').offsetWidth + 40;

        ball.style.left = `${newLeft}px`;
    }

    updateInfo(msg) {
        document.getElementById('game-info').textContent = msg;
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}