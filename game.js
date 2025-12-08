/**
 * game.js - V32: Correção de Stats de Goleiro e Formações
 */

class Game {
    constructor(config = {}) {
        this.territories = ['Gol IA', 'Defesa IA', 'Meio-Campo', 'Ataque Jogador', 'Gol Jogador'];
        
        // Configurações
        this.playerName = config.playerName || "JOGADOR";
        this.playerColor = config.playerTeamColor || 'blue';
        
        // SELEÇÃO DE TIMES (Cópia Limpa dos Dados)
        // Se escolheu 'red', joga com Catalonia. Se 'blue', Royal.
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

        // Atualiza Nome na Interface
        const labelName = document.getElementById('label-player-name');
        if(labelName) labelName.textContent = this.playerName.toUpperCase();
    }

    // --- TELA 1: GESTÃO DE ELENCO ---
    renderSquadScreen() {
        const grid = document.getElementById('squad-grid');
        grid.innerHTML = ''; 

        const myTeam = this.teams.player;
        if(!myTeam) { console.error("Erro: Time do jogador não carregou."); return; }

        // Cabeçalho do Elenco
        let totalOvr = 0;
        myTeam.players.forEach(p => totalOvr += p.ovr);
        const avgOvr = Math.round(totalOvr / myTeam.players.length);
        
        document.getElementById('team-ovr-display').textContent = avgOvr;
        document.getElementById('team-form-display').textContent = myTeam.formation;

        // Renderiza Cartas Grandes
        myTeam.players.forEach(p => {
            const card = this.createCardDOM(p, 'player', 'full');
            card.onmouseenter = () => this.showCardDetails(p);
            grid.appendChild(card);
        });

        // Mostra o primeiro jogador por padrão
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
        
        // DEFINIÇÃO DINÂMICA DE ATRIBUTOS PARA A BARRA LATERAL
        let attributes = [];
        if (p.role === 'GK') {
            attributes = [
                {label:'REF', val: p.ref}, {label:'POS', val: p.pos}, 
                {label:'HAN', val: p.han || 80}, {label:'SPD', val: p.spd || 50},
                {label:'STA', val: p.sta || 99}
            ];
        } else {
            attributes = [
                {label:'DRI', val: p.dri}, {label:'PAS', val: p.pas}, 
                {label:'FIN', val: p.fin}, {label:'DEF', val: p.des}, 
                {label:'STA', val: p.sta || 99}
            ];
        }

        attributes.forEach(attr => {
            const val = attr.val || 50; 
            const color = val > 85 ? '#388e3c' : (val > 70 ? '#fbc02d' : '#d32f2f');
            
            const row = document.createElement('div'); 
            row.className = 'stat-row';
            row.innerHTML = `<span class="stat-label">${attr.label}</span><div class="stat-bar-bg"><div class="stat-bar-fill" style="width:${val}%; background-color:${color}"></div></div><span class="stat-value">${val}</span>`;
            statsContainer.appendChild(row);
        });
    }

    // --- TELA 2: TABULEIRO (INIT) ---
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

        // LÓGICA DE STATS: GOLEIRO vs LINHA
        // Define quais labels e valores mostrar na carta premium
        let s1Label, s1Val, s2Label, s2Val, s3Label, s3Val, s4Label, s4Val;

        if (playerData.role === 'GK') {
            s1Label = 'REF'; s1Val = playerData.ref;
            s2Label = 'POS'; s2Val = playerData.pos;
            s3Label = 'HAN'; s3Val = playerData.han || 80;
            s4Label = 'SPD'; s4Val = playerData.spd || 50;
        } else {
            s1Label = 'DRI'; s1Val = playerData.dri || '-';
            s2Label = 'PAS'; s2Val = playerData.pas || '-';
            s3Label = 'FIN'; s3Val = playerData.fin || '-';
            s4Label = 'DEF'; s4Val = playerData.des || '-';
        }

        if (mode === 'token') {
            card.innerHTML = `
                <div class="card-top-info"><span class="card-ovr">${playerData.ovr}</span><span class="card-pos">${playerData.role}</span></div>
                <div class="card-image"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">${selectedFace}</svg></div>
                <div class="card-name-box"><span class="card-name">${playerData.name}</span></div>
            `;
        } else {
            // CARTA FULL COM STATS DINÂMICOS
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
                            <div class="stat-item"><span class="stat-val">${s1Val}</span><span class="stat-label">${s1Label}</span></div>
                            <div class="stat-item"><span class="stat-val">${s2Val}</span><span class="stat-label">${s2Label}</span></div>
                        </div>
                        <div class="card-stats-row">
                            <div class="stat-item"><span class="stat-val">${s3Val}</span><span class="stat-label">${s3Label}</span></div>
                            <div class="stat-item"><span class="stat-val">${s4Val}</span><span class="stat-label">${s4Label}</span></div>
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