/**
 * game.js - V18: Correção de Seleção de Times e Nomes
 */

class Game {
    constructor(config = {}) {
        this.territories = ['Gol IA', 'Defesa IA', 'Meio-Campo', 'Ataque Jogador', 'Gol Jogador'];
        this.ballPositionIndex = 2; 
        this.possession = 0; 
        this.scorePlayer = 0;
        this.scoreIA = 0;
        this.isBattling = false; 

        // CONFIGURAÇÕES
        this.playerName = config.playerName || "JOGADOR";
        this.playerColor = config.playerTeamColor || 'blue'; 
        this.autoStart = config.autoStart !== undefined ? config.autoStart : true;

        // --- CORREÇÃO DA SELEÇÃO DE TIMES ---
        // Aqui definimos quem é quem baseado na cor escolhida no menu
        // Blue = Royal Madrid (Padrão)
        // Red = FC Catalonia
        
        if (this.playerColor === 'red') {
            // Jogador escolheu Vermelho (Catalonia)
            this.teams = {
                player: TEAMS_DATABASE.catalonia, // Jogador recebe Catalonia
                ia: TEAMS_DATABASE.royal          // IA recebe Royal
            };
        } else {
            // Jogador escolheu Azul (Royal) - Padrão
            this.teams = {
                player: TEAMS_DATABASE.royal,     // Jogador recebe Royal
                ia: TEAMS_DATABASE.catalonia      // IA recebe Catalonia
            };
        }

        // Atualiza UI do nome
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

    // --- SQUAD SCREEN ---
    renderSquadScreen() {
        const grid = document.getElementById('squad-grid');
        grid.innerHTML = ''; 

        const myTeam = this.teams.player;
        
        let totalOvr = 0;
        myTeam.players.forEach(p => totalOvr += p.ovr);
        const avgOvr = Math.round(totalOvr / myTeam.players.length);

        document.getElementById('team-ovr-display').textContent = avgOvr;
        document.getElementById('team-form-display').textContent = myTeam.formation;

        myTeam.players.forEach(p => {
            const card = this.createCardDOM(p, 'player', 'full');
            card.onmouseenter = () => this.showCardDetails(p, card);
            grid.appendChild(card);
        });

        if (myTeam.players.length > 0) {
            this.showCardDetails(myTeam.players[0]);
        }
    }

    // --- CARD FACTORY ---
    createCardDOM(playerData, teamType, mode = 'token') {
        const card = document.createElement('div');
        card.className = mode === 'full' ? 'card-full' : 'card-token';
        
        // Lógica de Cor (Visual)
        // Precisamos saber se esse time Específico é o Royal ou Catalonia para aplicar o CSS certo
        // Usamos o ID do time para garantir
        
        let cssClass = '';
        // Verifica se o ID do time atual é o do Royal
        const teamId = (teamType === 'player') ? this.teams.player.id : this.teams.ia.id;

        if (teamId === 'team_royal') {
            cssClass = 'bg-royal';
        } else {
            cssClass = 'bg-catalonia';
        }
        card.classList.add(cssClass);
        
        if (mode === 'token') {
            // TOKEN
            card.innerHTML = `
                <div class="card-top-info">
                    <span class="card-ovr">${playerData.ovr}</span>
                    <span class="card-pos">${playerData.role}</span>
                </div>
                <div class="card-image"></div>
                <div class="card-name-box">
                    <span class="card-name">${playerData.name}</span>
                </div>
            `;
        } else {
            // FULL CARD
            card.innerHTML = `
                <div class="card-content">
                    <div class="card-header">
                        <div class="card-left-col">
                            <span class="card-ovr">${playerData.ovr}</span>
                            <span class="card-pos">${playerData.role}</span>
                        </div>
                        <div class="card-image"></div>
                    </div>
                    <div class="card-name-box">
                        <span class="card-name">${playerData.name}</span>
                    </div>
                    <div class="card-stats-grid">
                        <div class="card-stats-row">
                            <div class="stat-item"><span class="stat-val">${playerData.dri || 50}</span><span class="stat-label">DRI</span></div>
                            <div class="stat-item"><span class="stat-val">${playerData.pas || 50}</span><span class="stat-label">PAS</span></div>
                        </div>
                        <div class="card-stats-row">
                            <div class="stat-item"><span class="stat-val">${playerData.fin || 50}</span><span class="stat-label">FIN</span></div>
                            <div class="stat-item"><span class="stat-val">${playerData.des || 50}</span><span class="stat-label">DEF</span></div>
                        </div>
                    </div>
                </div>
            `;
        }
        return card;
    }

    showCardDetails(playerData, cardElement) {
        document.getElementById('detail-name').textContent = playerData.name;
        document.getElementById('detail-role').textContent = `${playerData.role} | OVR ${playerData.ovr}`;

        const previewContainer = document.getElementById('detail-card-preview');
        previewContainer.innerHTML = '';
        const previewCard = this.createCardDOM(playerData, 'player', 'full'); 
        previewContainer.appendChild(previewCard);

        const statsContainer = document.getElementById('stat-bars-container');
        statsContainer.innerHTML = '';

        const attributes = [
            { label: 'DRI', val: playerData.dri || 50 },
            { label: 'PAS', val: playerData.pas || 50 },
            { label: 'FIN', val: playerData.fin || 50 },
            { label: 'DEF', val: playerData.des || 50 },
            { label: 'STA', val: playerData.sta || 99 }
        ];

        attributes.forEach(attr => {
            let color = '#d32f2f'; 
            if(attr.val > 70) color = '#fbc02d'; 
            if(attr.val > 85) color = '#388e3c'; 

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

    // --- GAMEPLAY ---
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

        const card = this.createCardDOM(playerData, teamType, 'token');
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