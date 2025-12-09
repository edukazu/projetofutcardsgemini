/**
 * game.js - V41: Correção de Nomes dos Times no Placar
 */

class Game {
    constructor(config = {}) {
        this.territories = ['Gol IA', 'Defesa IA', 'Meio-Campo', 'Ataque Jogador', 'Gol Jogador'];
        this.ballPositionIndex = 2; // Bola no meio
        this.scorePlayer = 0;
        this.scoreIA = 0;

        this.playerName = config.playerName || "JOGADOR";
        this.playerColor = config.playerTeamColor || 'blue';
        
        // Seleção de Times
        if (this.playerColor === 'red') {
            this.teams = { 
                player: JSON.parse(JSON.stringify(TEAMS_DATA.catalonia)), 
                ia: JSON.parse(JSON.stringify(TEAMS_DATA.royal)) 
            };
        } else {
            this.teams = { 
                player: JSON.parse(JSON.stringify(TEAMS_DATA.royal)), 
                ia: JSON.parse(JSON.stringify(TEAMS_DATA.catalonia)) 
            };
        }
    }

    // --- REGRAS DE EXIBIÇÃO (4 Stats Técnicos - SEM STAMINA) ---
    getAttributesForDisplay(p) {
        if (p.role === 'GK') {
            return [
                {label:'REF', val: p.ref}, {label:'POS', val: p.pos}, 
                {label:'HAN', val: p.han}, {label:'SPD', val: p.spd}
            ];
        } else if (p.role === 'DEF') {
            return [
                {label:'DES', val: p.des}, {label:'INT', val: p.int}, 
                {label:'PAS', val: p.pas}, {label:'DRI', val: p.dri}
            ];
        } else if (p.role === 'MID') {
            return [
                {label:'PAS', val: p.pas}, {label:'DRI', val: p.dri}, 
                {label:'INT', val: p.int}, {label:'FIN', val: p.fin}
            ];
        } else { 
            return [
                {label:'FIN', val: p.fin}, {label:'DRI', val: p.dri}, 
                {label:'PAS', val: p.pas}, {label:'INT', val: p.int}
            ];
        }
    }

    // --- TELA DE ELENCO ---
    renderSquadScreen() {
        const grid = document.getElementById('squad-grid');
        grid.innerHTML = ''; 

        const myTeam = this.teams.player;
        if(!myTeam) return;

        let totalOvr = 0;
        myTeam.players.forEach(p => totalOvr += p.ovr);
        const avgOvr = Math.round(totalOvr / myTeam.players.length);
        
        document.getElementById('team-ovr-display').textContent = avgOvr;
        document.getElementById('team-form-display').textContent = myTeam.formation;

        myTeam.players.forEach(p => {
            const card = this.createCardDOM(p, 'player', 'full');
            card.onmouseenter = () => this.showCardDetails(p);
            grid.appendChild(card);
        });

        if (myTeam.players.length > 0) this.showCardDetails(myTeam.players[0]);
    }

    showCardDetails(p) {
        document.getElementById('detail-name').textContent = p.name;
        document.getElementById('detail-role').textContent = `${p.role} | OVR ${p.ovr}`;
        
        const previewContainer = document.getElementById('detail-card-preview');
        previewContainer.innerHTML = '';
        previewContainer.appendChild(this.createCardDOM(p, 'player', 'full'));
        
        const statsContainer = document.getElementById('stat-bars-container');
        statsContainer.innerHTML = '';
        
        let allStats = [];
         if (p.role === 'GK') {
            allStats = [
                {label:'REF', val: p.ref}, {label:'POS', val: p.pos}, 
                {label:'HAN', val: p.han}, {label:'SPD', val: p.spd},
                {label:'STA', val: p.sta}
            ];
        } else {
            allStats = [
                {label:'DRI', val: p.dri}, {label:'PAS', val: p.pas}, 
                {label:'FIN', val: p.fin}, {label:'DES', val: p.des}, 
                {label:'INT', val: p.int}, {label:'STA', val: p.sta}
            ];
        }

        allStats.forEach(attr => {
            const val = attr.val || 0; 
            let color = '#d32f2f'; 
            if (val > 60) color = '#fbc02d'; 
            if (val > 80) color = '#388e3c'; 
            
            const row = document.createElement('div'); 
            row.className = 'stat-row';
            row.innerHTML = `<span class="stat-label">${attr.label}</span><div class="stat-bar-bg"><div class="stat-bar-fill" style="width:${val}%; background-color:${color}"></div></div><span class="stat-value">${val}</span>`;
            statsContainer.appendChild(row);
        });
    }

    // --- TABULEIRO ---
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

        this.teams.player.players.forEach(p => this.createTokenElement(p, 'player'));
        this.teams.ia.players.forEach(p => this.createTokenElement(p, 'ia'));
        
        this.renderUI();
        this.setCamera('OVERVIEW');
        this.updateInfo("Partida pronta. Modo Visual.");
    }

    createTokenElement(playerData, teamType) {
        const clusterId = teamType === 'player' ? 
            `cluster-player-zone-${playerData.zone}` : 
            `cluster-ia-zone-${playerData.zone}`;
        const container = document.getElementById(clusterId);
        if (container) {
            container.appendChild(this.createCardDOM(playerData, teamType, 'token'));
        }
    }

    // --- FÁBRICA DE CARTAS (DOM) ---
    createCardDOM(playerData, teamType, mode) {
        const card = document.createElement('div');
        card.className = mode === 'full' ? 'card-full' : 'card-token';
        
        const teamObj = (teamType === 'player') ? this.teams.player : this.teams.ia;
        const isRoyal = (teamObj.id === 'team_royal');
        card.classList.add(isRoyal ? 'bg-royal' : 'bg-catalonia');
        
        const skin = playerData.skin || "#e0ac69";
        const faces = {
            1: `<g transform="translate(2,2) scale(0.9)"><path d="M12 21C12 21 7 21 5 17C5 17 3.5 13 5 9C6.5 5 9 4 12 4C15 4 17.5 5 19 9C20.5 13 19 17 19 17C17 21 12 21 12 21Z" fill="${skin}"/><path d="M5 9C5 9 6 3 12 3C18 3 19 9 19 9C19 9 20 6 12 1C4 6 5 9 5 9Z" fill="#222"/><path d="M4 24C4 24 6 18 12 18C18 18 20 24 20 24" fill="${skin}"/><path d="M12 18C8 18 4 21 2 24H22C20 21 16 18 12 18Z" fill="#222"/></g>`,
            2: `<g transform="translate(2,2) scale(0.9)"><circle cx="12" cy="10" r="8" fill="#111"/><path d="M12 21C12 21 7 21 5 17C5 17 4 13 6 10C8 7 12 7 12 7C12 7 16 7 18 10C20 13 19 17 19 17C17 21 12 21 12 21Z" fill="${skin}"/><path d="M12 18C8 18 4 21 2 24H22C20 21 16 18 12 18Z" fill="#111"/></g>`,
            3: `<g transform="translate(2,2) scale(0.9)"><path d="M12 21C12 21 7 21 5 17C5 17 3.5 13 5 9C6.5 5 9 4 12 4C15 4 17.5 5 19 9C20.5 13 19 17 19 17C17 21 12 21 12 21Z" fill="${skin}"/><path d="M12 2C8 2 5 6 5 9L6 6L12 2Z" fill="#e6c200"/><path d="M12 2C16 2 19 6 19 9L18 6L12 2Z" fill="#ffd700"/><path d="M12 18C8 18 4 21 2 24H22C20 21 16 18 12 18Z" fill="#111"/></g>`,
            4: `<g transform="translate(2,2) scale(0.9)"><path d="M12 21C12 21 7 21 5 17C5 17 3.5 13 5 9C6.5 5 9 4 12 4C15 4 17.5 5 19 9C20.5 13 19 17 19 17C17 21 12 21 12 21Z" fill="${skin}"/><path d="M4 8L3 14M20 8L21 14M12 2L12 6M7 3L6 8M17 3L18 8" stroke="#111" stroke-width="3" stroke-linecap="round"/><path d="M12 18C8 18 4 21 2 24H22C20 21 16 18 12 18Z" fill="#111"/></g>`
        };
        const selectedFace = faces[playerData.face] || faces[1];
        const flagUrl = `https://flagcdn.com/w40/${playerData.nation}.png`;

        const mainStats = this.getAttributesForDisplay(playerData);

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
                            <img src="${flagUrl}" class="card-flag-img"><div class="card-crest-icon">${teamObj.crest}</div>
                        </div>
                        <div class="card-image"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">${selectedFace}</svg></div>
                    </div>
                    <div class="card-name-box"><span class="card-name">${playerData.name}</span></div>
                    
                    <div class="card-stats-grid">
                        <div class="card-stats-row">
                            <div class="stat-item"><span class="stat-val">${mainStats[0].val}</span><span class="stat-label">${mainStats[0].label}</span></div>
                            <div class="stat-item"><span class="stat-val">${mainStats[1].val}</span><span class="stat-label">${mainStats[1].label}</span></div>
                        </div>
                        <div class="card-stats-row">
                            <div class="stat-item"><span class="stat-val">${mainStats[2].val}</span><span class="stat-label">${mainStats[2].label}</span></div>
                            <div class="stat-item"><span class="stat-val">${mainStats[3].val}</span><span class="stat-label">${mainStats[3].label}</span></div>
                        </div>
                    </div>
                </div>
            `;
        }
        return card;
    }

    renderUI() {
        document.getElementById('score-player').textContent = 0;
        document.getElementById('score-ia').textContent = 0;
        
        // --- ATUALIZAÇÃO DO PLACAR COM NOMES DOS TIMES ---
        document.getElementById('label-player-team').textContent = this.teams.player.name;
        document.getElementById('label-ia-team').textContent = this.teams.ia.name;

        document.getElementById('possession-display').innerHTML = `<span>JOGO PRONTO</span> <small>Meio-Campo</small>`;
        const ball = document.getElementById('ball-indicator');
        const targetZone = document.getElementById(`zone-2`);
        if (ball && targetZone) {
            let newLeft = targetZone.offsetLeft + (targetZone.offsetWidth / 2);
            ball.style.left = `${newLeft}px`;
        }
    }
    
    setCamera(mode) { 
        const pitch = document.getElementById('pitch-container');
        if(pitch) pitch.className = ''; 
    }
    
    updateInfo(msg) { document.getElementById('game-info').textContent = msg; }
    startTurn() { alert("Lógica de Batalha Desativada para Teste de Estabilidade."); }
    coinToss() { this.updateInfo("Modo de Teste: Sem Sorteio."); }
}