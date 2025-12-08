/**
 * game.js - V15: Com Tela de Gestão de Elenco
 */

class Game {
    constructor(config = {}) {
        this.territories = ['Gol IA', 'Defesa IA', 'Meio-Campo', 'Ataque Jogador', 'Gol Jogador'];
        this.ballPositionIndex = 2; 
        this.possession = 0; 
        this.scorePlayer = 0;
        this.scoreIA = 0;
        this.isBattling = false; 

        this.teams = TEAMS_DATA;
        
        // Configurações
        this.playerName = config.playerName || "JOGADOR";
        this.playerColor = config.playerTeamColor || 'blue'; 
        
        // Flag para não renderizar o campo imediatamente se estivermos no menu de elenco
        this.autoStart = config.autoStart !== undefined ? config.autoStart : true;

        const labelName = document.getElementById('label-player-name');
        if(labelName) labelName.textContent = this.playerName.toUpperCase();

        if (this.autoStart) {
            setTimeout(() => {
                this.initBoard();
                this.renderUI();
                this.setCamera('OVERVIEW'); 
            }, 100);
        }
    }

    // --- NOVA FUNÇÃO: RENDERIZAR TELA DE ELENCO ---
    renderSquadScreen() {
        const grid = document.getElementById('squad-grid');
        grid.innerHTML = ''; // Limpa

        // Pega os jogadores do time do jogador
        const myTeam = this.teams.player; // Assumindo que o player joga com o time 'player' definido no cards.js
        // Se a cor for red, inverte (lógica do MVP anterior)
        // Mas para simplificar a visualização, vamos mostrar sempre o elenco 'player' do JSON
        
        // Atualiza cabeçalho
        document.getElementById('team-ovr-display').textContent = "86"; // Exemplo, poderia calcular a média
        document.getElementById('team-form-display').textContent = myTeam.formation;

        // Renderiza cada carta na Grid
        myTeam.players.forEach(p => {
            const card = this.createCardDOM(p, 'player');
            
            // Adiciona evento de Mouse para ver detalhes
            card.onmouseenter = () => this.showCardDetails(p, card);
            
            grid.appendChild(card);
        });

        // Mostra o primeiro jogador como default nos detalhes
        if (myTeam.players.length > 0) {
            this.showCardDetails(myTeam.players[0]);
        }
    }

    // Cria o HTML da carta (Reutilizável para Campo e Menu)
    createCardDOM(playerData, teamType) {
        const card = document.createElement('div');
        card.className = 'card-token';
        
        // Lógica de Cor
        let isRoyal = false;
        if (this.playerColor === 'blue') {
            isRoyal = (teamType === 'player');
        } else {
            isRoyal = (teamType === 'ia');
        }

        if (isRoyal) card.classList.add('bg-royal');
        else card.classList.add('bg-catalonia');
        
        card.innerHTML = `
            <div class="card-ovr">
                ${playerData.ovr}
                <span class="card-pos">${playerData.role}</span>
            </div>
            <div class="card-image"></div>
            <div class="card-info">
                <span class="card-name">${playerData.name}</span>
            </div>
        `;
        return card;
    }

    // Atualiza o Painel Lateral
    showCardDetails(playerData, cardElement) {
        // 1. Atualiza Textos
        document.getElementById('detail-name').textContent = playerData.name;
        document.getElementById('detail-role').textContent = `${playerData.role} | OVR ${playerData.ovr}`;

        // 2. Clone da Carta para o Preview
        const previewContainer = document.getElementById('detail-card-preview');
        previewContainer.innerHTML = '';
        const previewCard = this.createCardDOM(playerData, 'player'); 
        previewContainer.appendChild(previewCard);

        // 3. Gera Barras de Atributos
        const statsContainer = document.getElementById('stat-bars-container');
        statsContainer.innerHTML = '';

        // Lista de atributos para mostrar
        const attributes = [
            { label: 'DRI', val: playerData.dri || 50 },
            { label: 'PAS', val: playerData.pas || 50 },
            { label: 'FIN', val: playerData.fin || 50 },
            { label: 'DEF', val: playerData.des || 50 }, // Usando DES como geral de defesa
            { label: 'STA', val: playerData.sta || 99 }
        ];

        attributes.forEach(attr => {
            // Cor da barra baseada no valor
            let color = '#d32f2f'; // Ruim
            if(attr.val > 70) color = '#fbc02d'; // Médio
            if(attr.val > 85) color = '#388e3c'; // Bom

            const row = document.createElement('div');
            row.className = 'stat-row';
            row.innerHTML = `
                <span class="stat-label">${attr.label}</span>
                <div class="stat-bar-bg">
                    <div class="stat-bar-fill" style="width: ${attr.val}%; background-color: ${color}"></div>
                </div>
                <span class="stat-value">${attr.val}</span>
            `;
            statsContainer.appendChild(row);
        });
    }

    // --- LÓGICA DO JOGO EM CAMPO ---
    initBoard() {
        document.querySelectorAll('.cards-container').forEach(e => e.remove());

        for (let i = 0; i <= 4; i++) {
            const zone = document.getElementById(`zone-${i}`);
            if (zone) {
                const container = document.createElement('div');
                container.className = 'cards-container';
                container.id = `cards-zone-${i}`;

                const clusterPlayer = document.createElement('div');
                clusterPlayer.className = 'team-cluster cluster-player';
                clusterPlayer.id = `cluster-player-zone-${i}`;

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

        const card = this.createCardDOM(playerData, teamType);
        container.appendChild(card);
    }

    async startBattle() {
        if (this.isBattling) return; 
        this.isBattling = true;
        
        const btn = document.getElementById('btn-battle');
        btn.disabled = true;
        btn.textContent = "Batalhando...";

        this.setCamera('FOCUS');
        await this.wait(1200); 

        this.resolveRound();
        this.renderUI();
        await this.wait(1500);

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

        let direction = 0;
        if (this.possession === 0) direction = Math.random() > 0.5 ? 1 : -1;
        else direction = this.possession;

        this.ballPositionIndex += direction;
        
        if(this.possession === 0) this.possession = direction;

        if (this.ballPositionIndex > 4) this.ballPositionIndex = 4;
        if (this.ballPositionIndex < 0) this.ballPositionIndex = 0;

        if (this.ballPositionIndex === 4) {
            this.scorePlayer++;
            this.updateInfo(`GOL DO ${this.playerName}!`);
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

    setCamera(mode) {
        const pitch = document.getElementById('pitch-container');
        if (!pitch) return;

        pitch.classList.remove(
            'camera-focus-goal-left', 'camera-focus-defense', 'camera-focus-mid', 'camera-focus-attack', 'camera-focus-goal-right'
        );

        if (mode === 'OVERVIEW') return;

        if (mode === 'FOCUS') {
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
        
        let playerLabel = this.playerName.split(' ')[0].toUpperCase();
        let posText = this.possession === 0 ? "NEUTRA" : (this.possession === 1 ? playerLabel : "IA");
        let zoneText = this.territories[this.ballPositionIndex];
        
        document.getElementById('possession-display').innerHTML = `<span>${posText}</span> <small>${zoneText}</small>`;

        this.moveBallVisual();
    }

    moveBallVisual() {
        const ball = document.getElementById('ball-indicator');
        const targetZone = document.getElementById(`zone-${this.ballPositionIndex}`);
        if (!ball || !targetZone) return;

        let newLeft = targetZone.offsetLeft + (targetZone.offsetWidth / 2);
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