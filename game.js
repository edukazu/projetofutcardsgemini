class Game {
    constructor() {
        this.teams = {};
        this.teams.player = JSON.parse(JSON.stringify(TEAMS_DATA.royal));
        this.teams.ia = JSON.parse(JSON.stringify(TEAMS_DATA.catalonia));
    }

    init() {
        // Renderiza as 3 cenas completas (Player vs Enemy)
        this.renderScene(1, 'row-def-player', 'row-def-enemy'); // Defesa
        this.renderScene(2, 'row-mid-player', 'row-mid-enemy'); // Meio
        this.renderScene(3, 'row-att-player', 'row-att-enemy'); // Ataque
        
        // Inicia câmera no Meio
        this.focusCamera(2);
    }

    focusCamera(zoneId) {
        const world = document.getElementById('world-container');
        const text = document.getElementById('zone-text');
        
        let offset = 0;
        let label = "";

        if (zoneId === 3) { offset = 0; label = "SEU ATAQUE"; }
        if (zoneId === 2) { offset = -100; label = "MEIO CAMPO"; }
        if (zoneId === 1) { offset = -200; label = "SUA DEFESA"; }

        world.style.transform = `translateY(${offset}vh)`;
        if(text) text.textContent = label;
    }

    // Renderiza uma cena inteira (Aliados e Rivais)
    renderScene(zoneId, playerContainerId, enemyContainerId) {
        // 1. Renderiza o Time do Jogador (Parte Inferior)
        const myContainer = document.getElementById(playerContainerId);
        const myPlayers = this.getPlayersForZone(this.teams.player.players, zoneId);
        this.renderCardsToContainer(myPlayers, myContainer, 'player', zoneId);

        // 2. Renderiza o Time Inimigo (Parte Superior)
        // ATENÇÃO: A lógica é espelhada.
        // Se a zona é 1 (Minha Defesa), eu quero ver o ATAQUE do inimigo.
        // Se a zona é 3 (Meu Ataque), eu quero ver a DEFESA do inimigo.
        const enemyContainer = document.getElementById(enemyContainerId);
        
        let enemyTargetRole = [];
        if (zoneId === 1) enemyTargetRole = ['ATT']; // Eles atacam minha defesa
        if (zoneId === 2) enemyTargetRole = ['MID']; // Meio vs Meio
        if (zoneId === 3) enemyTargetRole = ['DEF', 'GK']; // Eles defendem meu ataque

        const enemyPlayers = this.teams.ia.players.filter(p => enemyTargetRole.includes(p.role));
        this.renderCardsToContainer(enemyPlayers, enemyContainer, 'enemy', zoneId);
    }

    getPlayersForZone(players, zoneId) {
        return players.filter(p => {
            if(zoneId === 1 && (p.role === 'GK' || p.role === 'DEF')) return true;
            if(zoneId === 2 && p.role === 'MID') return true;
            if(zoneId === 3 && p.role === 'ATT') return true;
            return false;
        });
    }

    renderCardsToContainer(players, container, type, zoneId) {
        container.innerHTML = '';
        players.forEach(p => {
            const card = document.createElement('div');
            card.className = `card-unit is-${type}`;
            card.innerHTML = `
                <div class="c-head"><span>${p.ovr}</span><span>${p.role}</span></div>
                <div class="c-body">${this.getIcon(p.role)}</div>
                <div class="c-name">${p.name}</div>
            `;
            
            // Navegação de Teste ao clicar na carta
            card.onclick = () => {
                if (type === 'player') {
                    if(zoneId === 1) this.focusCamera(2); // Sobe
                    if(zoneId === 2) this.focusCamera(3); // Sobe
                } else {
                    if(zoneId === 3) this.focusCamera(2); // Desce
                    if(zoneId === 2) this.focusCamera(1); // Desce
                }
            };
            container.appendChild(card);
        });
    }

    getIcon(role) {
        if(role === 'GK') return '🧤';
        if(role === 'DEF') return '🛡️';
        if(role === 'MID') return '⚡';
        return '🚀';
    }

    action(type) { alert(`Ação: ${type}`); }
}