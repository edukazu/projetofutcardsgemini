/**
 * game.js - V23: Layout Premium com Bandeira Real e Escudos
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

        if (this.playerColor === 'red') {
            this.teams = { player: TEAMS_DATA.catalonia, ia: TEAMS_DATA.royal };
        } else {
            this.teams = { player: TEAMS_DATA.royal, ia: TEAMS_DATA.catalonia };
        }

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
        
        const teamObj = (teamType === 'player') ? this.teams.player : this.teams.ia;
        const isRoyal = (teamObj.id === 'team_royal');

        if (isRoyal) card.classList.add('bg-royal');
        else card.classList.add('bg-catalonia');
        
        // --- ROSTOS (SVGs) ---
        const skin = playerData.skin || "#e0ac69";
        
        const faces = {
            1: `<g transform="translate(2,2) scale(0.9)"><path d="M12 21C12 21 7 21 5 17C5 17 3.5 13 5 9C6.5 5 9 4 12 4C15 4 17.5 5 19 9C20.5 13 19 17 19 17C17 21 12 21 12 21Z" fill="${skin}"/><path d="M5 9C5 9 6 3 12 3C18 3 19 9 19 9C19 9 20 6 12 1C4 6 5 9 5 9Z" fill="#222"/><path d="M4 24C4 24 6 18 12 18C18 18 20 24 20 24" fill="${skin}"/><path d="M12 18C8 18 4 21 2 24H22C20 21 16 18 12 18Z" fill="#222"/></g>`,
            2: `<g transform="translate(2,2) scale(0.9)"><circle cx="12" cy="10" r="8" fill="#111"/><path d="M12 21C12 21 7 21 5 17C5 17 4 13 6 10C8 7 12 7 12 7C12 7 16 7 18 10C20 13 19 17 19 17C17 21 12 21 12 21Z" fill="${skin}"/><path d="M12 18C8 18 4 21 2 24H22C20 21 16 18 12 18Z" fill="#111"/></g>`,
            3: `<g transform="translate(2,2) scale(0.9)"><path d="M12 21C12 21 7 21 5 17C5 17 3.5 13 5 9C6.5 5 9 4 12 4C15 4 17.5 5 19 9C20.5 13 19 17 19 17C17 21 12 21 12 21Z" fill="${skin}"/><path d="M12 2C8 2 5 6 5 9L6 6L12 2Z" fill="#e6c200"/><path d="M12 2C16 2 19 6 19 9L18 6L12 2Z" fill="#ffd700"/><path d="M12 18C8 18 4 21 2 24H22C20 21 16 18 12 18Z" fill="#111"/></g>`,
            4: `<g transform="translate(2,2) scale(0.9)"><path d="M12 21C12 21 7 21 5 17C5 17 3.5 13 5 9C6.5 5 9 4 12 4C15 4 17.5 5 19 9C20.5 13 19 17 19 17C17 21 12 21 12 21Z" fill="${skin}"/><path d="M4 8L3 14M20 8L21 14M12 2L12 6M7 3L6 8M17 3L18 8" stroke="#111" stroke-width="3" stroke-linecap="round"/><path d="M12 18C8 18 4 21 2 24H22C20 21 16 18 12 18Z" fill="#111"/></g>`
        };
        const selectedFace = faces[playerData.face] || faces[1];

        // Bandeira Real (CDN)
        const flagUrl = `https://flagcdn.com/w40/${playerData.nation}.png`;

        if (mode === 'token') {
            // TOKEN (Simples)
            card.innerHTML = `
                <div class="card-top-info">
                    <span class="card-ovr">${playerData.ovr}</span>
                    <span class="card-pos">${playerData.role}</span>
                </div>
                <div class="card-image"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">${selectedFace}</svg></div>
                <div class="card-name-box">
                    <span class="card-name">${playerData.name}</span>
                </div>
            `;
        } else {
            // FULL CARD (Layout com Coluna Esquerda Organizada)
            card.innerHTML = `
                <div class="card-content">
                    <div class="card-header">
                        <div class="card-left-col">
                            <span class="card-ovr">${playerData.ovr}</span>
                            <span class="card-pos">${playerData.role}</span>
                            <img src="${flagUrl}" class="card-flag-img" alt="${playerData.nation}">
                            <div class="card-crest-icon">${teamObj.crest}</div>
                        </div>
                        <div class="card-image"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">${selectedFace}</svg></div>
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