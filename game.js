/**
 * game.js - V1 (Reinício Estável)
 * Foco: Renderização correta de Menu, Elenco e Tabuleiro.
 */

class Game {
    constructor(config = {}) {
        this.territories = ['Gol IA', 'Defesa IA', 'Meio-Campo', 'Ataque Jogador', 'Gol Jogador'];
        
        // Configuração Inicial
        this.playerName = config.playerName || "JOGADOR";
        this.playerColor = config.playerTeamColor || 'blue';
        
        // Seleção de Times (Cópia Limpa)
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

        // Atualiza Nome na UI (se existir)
        const labelName = document.getElementById('label-player-name');
        if(labelName) labelName.textContent = this.playerName.toUpperCase();
    }

    // --- TELA DE ELENCO (SQUAD) ---
    renderSquadScreen() {
        const grid = document.getElementById('squad-grid');
        grid.innerHTML = ''; // Limpa grid

        const myTeam = this.teams.player;
        
        // Atualiza Header
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

        // Mostra detalhes do primeiro jogador
        if (myTeam.players.length > 0) this.showCardDetails(myTeam.players[0]);
    }

    // --- TELA DE JOGO (CAMPO) ---
    initBoard() {
        // Limpa zonas antigas
        document.querySelectorAll('.cards-container').forEach(e => e.remove());

        // Cria containers nas zonas (0 a 4)
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

        // Renderiza Tokens no Campo
        this.teams.player.players.forEach(p => this.createTokenElement(p, 'player'));
        this.teams.ia.players.forEach(p => this.createTokenElement(p, 'ia'));
    }

    createTokenElement(playerData, teamType) {
        // Encontra o cluster correto baseada na zona do jogador
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
        
        // Define Estilo do Time (Royal vs Catalonia)
        const teamObj = (teamType === 'player') ? this.teams.player : this.teams.ia;
        const isRoyal = (teamObj.id === 'team_royal');
        card.classList.add(isRoyal ? 'bg-royal' : 'bg-catalonia');
        
        // SVGs de Rosto
        const skin = playerData.skin || "#e0ac69";
        const faces = {
            1: `<g transform="translate(2,2) scale(0.9)"><path d="M12 21C12 21 7 21 5 17C5 17 3.5 13 5 9C6.5 5 9 4 12 4C15 4 17.5 5 19 9C20.5 13 19 17 19 17C17 21 12 21 12 21Z" fill="${skin}"/><path d="M5 9C5 9 6 3 12 3C18 3 19 9 19 9C19 9 20 6 12 1C4 6 5 9 5 9Z" fill="#222"/><path d="M4 24C4 24 6 18 12 18C18 18 20 24 20 24" fill="${skin}"/><path d="M12 18C8 18 4 21 2 24H22C20 21 16 18 12 18Z" fill="#222"/></g>`,
            2: `<g transform="translate(2,2) scale(0.9)"><circle cx="12" cy="10" r="8" fill="#111"/><path d="M12 21C12 21 7 21 5 17C5 17 4 13 6 10C8 7 12 7 12 7C12 7 16 7 18 10C20 13 19 17 19 17C17 21 12 21 12 21Z" fill="${skin}"/><path d="M12 18C8 18 4 21 2 24H22C20 21 16 18 12 18Z" fill="#111"/></g>`,
            3: `<g transform="translate(2,2) scale(0.9)"><path d="M12 21C12 21 7 21 5 17C5 17 3.5 13 5 9C6.5 5 9 4 12 4C15 4 17.5 5 19 9C20.5 13 19 17 19 17C17 21 12 21 12 21Z" fill="${skin}"/><path d="M12 2C8 2 5 6 5 9L6 6L12 2Z" fill="#e6c200"/><path d="M12 2C16 2 19 6 19 9L18 6L12 2Z" fill="#ffd700"/><path d="M12 18C8 18 4 21 2 24H22C20 21 16 18 12 18Z" fill="#111"/></g>`
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
            // Full Card (Layout Premium)
            card.innerHTML = `
                <div class="card-content">
                    <div class="card-header">
                        <div class="card-left-col">
                            <span class="card-ovr">${playerData.ovr}</span><span class="card-pos">${playerData.role}</span>
                            <img src="${flagUrl}" class="card-flag-img">
                            <div class="card-crest-icon">${teamObj.crest}</div>
                        </div>
                        <div class="card-image"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">${selectedFace}</svg></div>
                    </div>
                    <div class="card-name-box"><span class="card-name">${playerData.name}</span></div>
                    <div class="card-stats-grid">
                        <div class="card-stats-row"><div class="stat-item"><span class="stat-val">${playerData.dri||50}</span><span class="stat-label">DRI</span></div><div class="stat-item"><span class="stat-val">${playerData.pas||50}</span><span class="stat-label">PAS</span></div></div>
                        <div class="card-stats-row"><div class="stat-item"><span class="stat-val">${playerData.fin||50}</span><span class="stat-label">FIN</span></div><div class="stat-item"><span class="stat-val">${playerData.des||50}</span><span class="stat-label">DEF</span></div></div>
                    </div>
                </div>
            `;
        }
        return card;
    }

    showCardDetails(p) {
        document.getElementById('detail-name').textContent = p.name;
        document.getElementById('detail-role').textContent = `${p.role} | OVR ${p.ovr}`;
        const previewContainer = document.getElementById('detail-card-preview');
        previewContainer.innerHTML = '';
        previewContainer.appendChild(this.createCardDOM(p, 'player', 'full'));
        
        const statsContainer = document.getElementById('stat-bars-container');
        statsContainer.innerHTML = '';
        const attributes = [{label:'DRI',val:p.dri},{label:'PAS',val:p.pas},{label:'FIN',val:p.fin},{label:'DEF',val:p.des},{label:'STA',val:p.sta}];
        attributes.forEach(attr => {
            const row = document.createElement('div'); row.className = 'stat-row';
            row.innerHTML = `<span class="stat-label">${attr.label}</span><div class="stat-bar-bg"><div class="stat-bar-fill" style="width:${attr.val||50}%; background-color:${attr.val>80?'#388e3c':'#fbc02d'}"></div></div><span class="stat-value">${attr.val||50}</span>`;
            statsContainer.appendChild(row);
        });
    }
}