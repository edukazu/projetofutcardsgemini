/**
 * game.js - V29: Correção de Travamento e Animação de Moeda
 */

class Game {
    constructor(config = {}) {
        this.territories = ['Gol IA', 'Defesa IA', 'Meio-Campo', 'Ataque Jogador', 'Gol Jogador'];
        this.ballPositionIndex = 2; 
        this.possession = 0; 
        this.scorePlayer = 0;
        this.scoreIA = 0;
        this.isBusy = false;

        this.teams = TEAMS_DATA;
        this.playerName = config.playerName || "JOGADOR";
        this.playerColor = config.playerTeamColor || 'blue';
        
        // Deep clone e Seleção de Times
        if (this.playerColor === 'red') {
            this.teams = { player: JSON.parse(JSON.stringify(TEAMS_DATA.catalonia)), ia: JSON.parse(JSON.stringify(TEAMS_DATA.royal)) };
        } else {
            this.teams = { player: JSON.parse(JSON.stringify(TEAMS_DATA.royal)), ia: JSON.parse(JSON.stringify(TEAMS_DATA.catalonia)) };
        }
        
        // Safety check
        if (!this.teams.player || !this.teams.ia) {
            console.error("ERRO CRÍTICO: Times não carregaram. Verifique cards.js");
            return;
        }

        this.teams.player.players.forEach(p => p.currentStamina = 100);
        this.teams.ia.players.forEach(p => p.currentStamina = 100);

        const labelName = document.getElementById('label-player-name');
        if(labelName) labelName.textContent = this.playerName.toUpperCase();

        if (config.autoStart !== false) {
            setTimeout(() => {
                this.initBoard();
                this.coinToss();
            }, 500);
        }
    }

    // --- SETUP ---
    initBoard() {
        document.querySelectorAll('.cards-container').forEach(e => e.remove());
        for (let i = 0; i <= 4; i++) {
            const zone = document.getElementById(`zone-${i}`);
            if (zone) {
                const container = document.createElement('div'); container.className = 'cards-container'; container.id = `cards-zone-${i}`;
                const clusterPlayer = document.createElement('div'); clusterPlayer.className = 'team-cluster cluster-player'; clusterPlayer.id = `cluster-player-zone-${i}`;
                const clusterIA = document.createElement('div'); clusterIA.className = 'team-cluster cluster-ia'; clusterIA.id = `cluster-ia-zone-${i}`;
                container.appendChild(clusterPlayer); container.appendChild(clusterIA); zone.appendChild(container);
            }
        }
        this.teams.player.players.forEach(p => this.createCardElement(p, 'player'));
        this.teams.ia.players.forEach(p => this.createCardElement(p, 'ia'));
        this.renderUI();
    }

    createCardElement(playerData, teamType) {
        const clusterId = teamType === 'player' ? `cluster-player-zone-${playerData.zone}` : `cluster-ia-zone-${playerData.zone}`;
        const container = document.getElementById(clusterId);
        if (container) container.appendChild(this.createCardDOM(playerData, teamType, 'token'));
    }

    // --- CARA OU COROA COM ANIMAÇÃO ---
    coinToss() {
        const overlay = document.getElementById('coin-overlay');
        const coin = document.getElementById('coin');
        
        overlay.classList.add('active');
        coin.classList.remove('flipping');
        
        // Força reflow para reiniciar animação
        void coin.offsetWidth;
        coin.classList.add('flipping');
        
        this.updateInfo("Sorteando saída de bola...");

        setTimeout(() => {
            const playerWon = Math.random() > 0.5;
            this.possession = playerWon ? 1 : -1;
            
            overlay.classList.remove('active');
            this.updateInfo(playerWon ? `Venceu: ${this.playerName}!` : "Venceu: Computador!");
            
            this.renderUI();
            this.setCamera('OVERVIEW');
        }, 2500); // Tempo da animação
    }

    // --- GAME LOOP ---
    startTurn() {
        if (this.isBusy) return;
        this.isBusy = true;

        const duelData = this.getDuelists(this.ballPositionIndex);
        
        // Zoom e Overlay
        this.setCamera('FOCUS');
        this.showDuelOverlay(duelData.attacker, duelData.defender);

        // Decisão
        setTimeout(() => {
            if (this.possession === 1) {
                this.showActionMenu(duelData);
            } else {
                this.processIATurn(duelData);
            }
        }, 1200);
    }

    getDuelists(zoneIndex) {
        const pPool = this.teams.player.players.filter(p => p.zone === zoneIndex);
        const iPool = this.teams.ia.players.filter(p => p.zone === zoneIndex);
        
        const pCard = pPool.length > 0 ? pPool[Math.floor(Math.random() * pPool.length)] : this.teams.player.players[0];
        const iCard = iPool.length > 0 ? iPool[Math.floor(Math.random() * iPool.length)] : this.teams.ia.players[0];

        if (this.possession === 1) return { attacker: pCard, defender: iCard };
        else return { attacker: iCard, defender: pCard };
    }

    showActionMenu(duelData) {
        const btnBattle = document.getElementById('btn-battle');
        const actionMenu = document.getElementById('action-menu');
        btnBattle.classList.add('d-none');
        actionMenu.classList.remove('d-none');
        actionMenu.innerHTML = ''; 

        const isAttackZone = (this.ballPositionIndex === 3);

        actionMenu.appendChild(this.createActionButton('DRIBLAR', 'btn-dribble', 'DRI vs DES', () => this.resolveDuel('dribble', duelData)));
        actionMenu.appendChild(this.createActionButton('PASSAR', 'btn-pass', 'PAS vs INT', () => this.resolveDuel('pass', duelData)));
        
        if (isAttackZone) {
            actionMenu.appendChild(this.createActionButton('CHUTAR', 'btn-shoot', 'FIN vs GLK', () => this.resolveDuel('shoot', duelData)));
        }
        this.updateInfo("Sua vez! Escolha a jogada.");
    }

    createActionButton(text, cssClass, subtext, callback) {
        const btn = document.createElement('button');
        btn.className = `btn-action ${cssClass}`;
        btn.innerHTML = `${text} <span>${subtext}</span>`;
        btn.onclick = callback;
        return btn;
    }

    processIATurn(duelData) {
        this.updateInfo("IA pensando...");
        setTimeout(() => {
            const actions = ['dribble', 'pass'];
            if (this.ballPositionIndex === 1) actions.push('shoot');
            const choice = actions[Math.floor(Math.random() * actions.length)];
            this.resolveDuel(choice, duelData);
        }, 1000);
    }

    resolveDuel(action, duelData) {
        document.getElementById('action-menu').classList.add('d-none');
        
        const att = duelData.attacker;
        const def = duelData.defender;
        let attStat = 0, defStat = 0;

        if (action === 'dribble') { attStat = att.dri; defStat = def.des; }
        else if (action === 'pass') { attStat = att.pas; defStat = def.int; }
        else if (action === 'shoot') { attStat = att.fin; defStat = def.ref || 50; }

        const attDice = Math.floor(Math.random() * 20) + 1;
        const defDice = Math.floor(Math.random() * 20) + 1;
        const attTotal = attStat + attDice;
        const defTotal = defStat + defDice;

        document.getElementById('duel-feedback').innerHTML = `
            <span style="color:#64ffda">${att.name}: ${attStat} + 🎲${attDice} = ${attTotal}</span> <br>
            <span style="color:#ffab91">${def.name}: ${defStat} + 🎲${defDice} = ${defTotal}</span>
        `;

        setTimeout(() => {
            if (attTotal > defTotal) this.handleSuccess(action);
            else this.handleFailure(action);
            
            setTimeout(() => {
                this.closeDuelOverlay();
                this.renderUI();
                this.setCamera('OVERVIEW');
                this.isBusy = false;
                document.getElementById('btn-battle').classList.remove('d-none');
            }, 2000);
        }, 1500);
    }

    handleSuccess(action) {
        if (action === 'shoot') {
            if (this.possession === 1) { this.scorePlayer++; this.updateInfo("GOL DO JOGADOR!"); }
            else { this.scoreIA++; this.updateInfo("GOL DA IA!"); }
            this.resetAfterGoal();
        } else {
            this.ballPositionIndex += this.possession;
            if (this.ballPositionIndex > 3) this.ballPositionIndex = 3;
            if (this.ballPositionIndex < 1) this.ballPositionIndex = 1;
            this.updateInfo("Sucesso! Avançando...");
        }
    }

    handleFailure(action) {
        this.possession *= -1;
        this.updateInfo("Falha! Posse perdida.");
    }

    resetAfterGoal() {
        this.ballPositionIndex = 2; 
        this.possession = 0; 
        this.coinToss();
    }

    // --- VISUALS ---
    showDuelOverlay(attCard, defCard) {
        const overlay = document.getElementById('battle-overlay');
        const pContainer = document.getElementById('duel-card-player');
        const iaContainer = document.getElementById('duel-card-ia');
        pContainer.innerHTML = ''; iaContainer.innerHTML = '';
        
        let pCard, iCard;
        // Identifica carta do player pelo ID do time (Royal ou Catalonia)
        // Se eu sou Royal, minha carta tem ID que começa com 'rmd'.
        // Mas a lógica genérica é: verificar se a carta está na lista 'this.teams.player.players'
        const isPlayerAttacker = this.teams.player.players.some(p => p.id === attCard.id);
        
        if (isPlayerAttacker) {
            pCard = attCard; iCard = defCard;
        } else {
            pCard = defCard; iCard = attCard;
        }

        pContainer.appendChild(this.createCardDOM(pCard, 'player', 'full'));
        iaContainer.appendChild(this.createCardDOM(iCard, 'ia', 'full'));
        overlay.classList.add('active');
        document.getElementById('duel-feedback').textContent = "Calculando...";
    }

    closeDuelOverlay() { document.getElementById('battle-overlay').classList.remove('active'); }

    // --- CARD FACTORY (Igual V24) ---
    // (Mantido igual para economizar espaço visual, mas essencial estar aqui)
    createCardDOM(playerData, teamType, mode = 'token') {
        const card = document.createElement('div');
        card.className = mode === 'full' ? 'card-full' : 'card-token';
        const teamObj = (teamType === 'player') ? this.teams.player : this.teams.ia;
        const isRoyal = (teamObj.id === 'team_royal');
        if (isRoyal) card.classList.add('bg-royal'); else card.classList.add('bg-catalonia');
        
        const skin = playerData.skin || "#e0ac69";
        const faces = {
            1: `<g transform="translate(2,2) scale(0.9)"><path d="M12 21C12 21 7 21 5 17C5 17 3.5 13 5 9C6.5 5 9 4 12 4C15 4 17.5 5 19 9C20.5 13 19 17 19 17C17 21 12 21 12 21Z" fill="${skin}"/><path d="M5 9C5 9 6 3 12 3C18 3 19 9 19 9C19 9 20 6 12 1C4 6 5 9 5 9Z" fill="#222"/><path d="M4 24C4 24 6 18 12 18C18 18 20 24 20 24" fill="${skin}"/><path d="M12 18C8 18 4 21 2 24H22C20 21 16 18 12 18Z" fill="#222"/></g>`,
            2: `<g transform="translate(2,2) scale(0.9)"><circle cx="12" cy="10" r="8" fill="#111"/><path d="M12 21C12 21 7 21 5 17C5 17 4 13 6 10C8 7 12 7 12 7C12 7 16 7 18 10C20 13 19 17 19 17C17 21 12 21 12 21Z" fill="${skin}"/><path d="M12 18C8 18 4 21 2 24H22C20 21 16 18 12 18Z" fill="#111"/></g>`,
            3: `<g transform="translate(2,2) scale(0.9)"><path d="M12 21C12 21 7 21 5 17C5 17 3.5 13 5 9C6.5 5 9 4 12 4C15 4 17.5 5 19 9C20.5 13 19 17 19 17C17 21 12 21 12 21Z" fill="${skin}"/><path d="M12 2C8 2 5 6 5 9L6 6L12 2Z" fill="#e6c200"/><path d="M12 2C16 2 19 6 19 9L18 6L12 2Z" fill="#ffd700"/><path d="M12 18C8 18 4 21 2 24H22C20 21 16 18 12 18Z" fill="#111"/></g>`,
            4: `<g transform="translate(2,2) scale(0.9)"><path d="M12 21C12 21 7 21 5 17C5 17 3.5 13 5 9C6.5 5 9 4 12 4C15 4 17.5 5 19 9C20.5 13 19 17 19 17C17 21 12 21 12 21Z" fill="${skin}"/><path d="M4 8L3 14M20 8L21 14M12 2L12 6M7 3L6 8M17 3L18 8" stroke="#111" stroke-width="3" stroke-linecap="round"/><path d="M12 18C8 18 4 21 2 24H22C20 21 16 18 12 18Z" fill="#111"/></g>`
        };
        const selectedFace = faces[playerData.face] || faces[1];
        const flagUrl = `https://flagcdn.com/w40/${playerData.nation}.png`;

        if (mode === 'token') {
            card.innerHTML = `
                <div class="card-top-info"><span class="card-ovr">${playerData.ovr}</span><span class="card-pos">${playerData.role}</span></div>
                <div class="card-image"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">${selectedFace}</svg></div>
                <div class="card-name-box"><span class="card-name">${playerData.name}</span></div>
            `;
        } else {
            card.innerHTML = `
                <div class="card-content">
                    <div class="card-header">
                        <div class="card-left-col">
                            <span class="card-ovr">${playerData.ovr}</span><span class="card-pos">${playerData.role}</span>
                            <img src="${flagUrl}" class="card-flag-img" alt="${playerData.nation}"><div class="card-crest-icon">${teamObj.crest}</div>
                        </div>
                        <div class="card-image"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">${selectedFace}</svg></div>
                    </div>
                    <div class="card-name-box"><span class="card-name">${playerData.name}</span></div>
                    <div class="card-stats-grid">
                        <div class="card-stats-row"><div class="stat-item"><span class="stat-val">${playerData.dri || 50}</span><span class="stat-label">DRI</span></div><div class="stat-item"><span class="stat-val">${playerData.pas || 50}</span><span class="stat-label">PAS</span></div></div>
                        <div class="card-stats-row"><div class="stat-item"><span class="stat-val">${playerData.fin || 50}</span><span class="stat-label">FIN</span></div><div class="stat-item"><span class="stat-val">${playerData.des || 50}</span><span class="stat-label">DEF</span></div></div>
                    </div>
                </div>
            `;
        }
        return card;
    }
    
    // Auxiliares
    renderSquadScreen() { /* Código anterior */ }
    showCardDetails(p, c) { /* Código anterior */ }
    setCamera(mode) {
        const pitch = document.getElementById('pitch-container');
        if (!pitch) return;
        pitch.classList.remove('camera-focus-goal-left', 'camera-focus-defense', 'camera-focus-mid', 'camera-focus-attack', 'camera-focus-goal-right');
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
        document.getElementById('possession-display').innerHTML = `<span>${posText}</span> <small>${this.territories[this.ballPositionIndex]}</small>`;
        this.moveBallVisual();
    }
    moveBallVisual() {
        const ball = document.getElementById('ball-indicator');
        const targetZone = document.getElementById(`zone-${this.ballPositionIndex}`);
        if (!ball || !targetZone) return;
        let newLeft = targetZone.offsetLeft + (targetZone.offsetWidth / 2);
        if (this.ballPositionIndex === 0) newLeft = -40; else if (this.ballPositionIndex === 4) newLeft = document.getElementById('pitch-container').offsetWidth + 40;
        ball.style.left = `${newLeft}px`;
    }
    updateInfo(msg) { document.getElementById('game-info').textContent = msg; }
    wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
}