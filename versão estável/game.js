class Game {
    constructor() {
        this.teams = {};
        this.currentZone = 2; // Começa no meio (virtualmente)
        
        // Input System
        this.isDragging = false;
        this.startClientY = 0;
        this.currentTranslateY = -100; // Posição inicial (Meio Campo)
        this.previousTranslateY = -100;
        
        // Inicia inputs imediatamente para não dar erro, mas trava ação até selecionar time
        this.setupCameraInputs(); 
    }

    selectTeam(teamKey) {
        // 1. Configura Time do Jogador
        this.teams.player = JSON.parse(JSON.stringify(TEAMS_DATA[teamKey]));
        
        // 2. Configura Rival (Pega um diferente do jogador)
        const keys = Object.keys(TEAMS_DATA).filter(k => k !== teamKey);
        const enemyKey = keys[Math.floor(Math.random() * keys.length)];
        this.teams.ia = JSON.parse(JSON.stringify(TEAMS_DATA[enemyKey]));

        // 3. Esconde Menu e Inicia
        document.getElementById('team-selection-screen').style.display = 'none';
        this.init();
    }

    init() {
        // Renderiza usando as formações
        this.renderAllZones();
        this.focusCamera(2);
        this.updateScoreBoard();
    }

    renderAllZones() {
        // ZONA 1: DEFESA (Formação Defensiva do Player vs Ataque do Enemy)
        this.renderFormation(1, 'player', 'def', 'row-def-player');
        this.renderFormation(1, 'enemy', 'att', 'row-def-enemy');
        // Goleiros
        this.renderGoalie(1, 'player', 'row-def-gk-player');

        // ZONA 2: MEIO
        this.renderFormation(2, 'player', 'mid', 'row-mid-player');
        this.renderFormation(2, 'enemy', 'mid', 'row-mid-enemy');

        // ZONA 3: ATAQUE
        this.renderFormation(3, 'player', 'att', 'row-att-player');
        this.renderFormation(3, 'enemy', 'def', 'row-att-enemy'); // Enemy defende aqui
        // Goleiros
        this.renderGoalie(3, 'enemy', 'row-att-gk-enemy');
    }

    renderFormation(zoneId, side, sector, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        const teamData = side === 'player' ? this.teams.player : this.teams.ia;
        const formationName = teamData.formation; 
        
        // Segurança
        const layoutData = FORMATIONS[formationName] ? FORMATIONS[formationName][sector] : FORMATIONS["4-4-2"][sector];

        const roleMap = { 'def': 'DEF', 'mid': 'MID', 'att': 'ATT' };
        const targetRole = roleMap[sector];
        const players = teamData.players.filter(p => p.role === targetRole);

        players.forEach((p, index) => {
            if (!layoutData[index]) return; 

            const coords = layoutData[index];
            const card = this.createCard(p, side);
            
            // APLICA APENAS COORDENADA X (Horizontal)
            if (side === 'enemy') {
                // Inimigo: Espelha o lado (se quiser manter simetria visual de posições)
                // Ex: O lateral esquerdo deles enfrenta seu lateral direito
                card.style.left = (100 - coords.left) + '%'; 
            } else {
                card.style.left = coords.left + '%';
            }
            
            // O eixo Y é controlado 100% pelo CSS (.battle-line) agora.
            // Não mexemos no style.top aqui.

            container.appendChild(card);
        });
    }

    renderGoalie(zoneId, side, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        const teamData = side === 'player' ? this.teams.player : this.teams.ia;
        const gk = teamData.players.find(p => p.role === 'GK');
        
        if(gk) {
            const card = this.createCard(gk, side);
            container.appendChild(card);
        }
    }

    createCard(p, side) {
        const card = document.createElement('div');
        card.className = `card-unit is-${side}`;
        card.innerHTML = `
            <div class="c-head"><span>${p.ovr}</span><span>${p.role}</span></div>
            <div class="c-body">${this.getIcon(p.role)}</div>
            <div class="c-name">${p.name}</div>
        `;
        return card;
    }

    updateScoreBoard() {
        // Atualiza Placar Numérico
        const pScore = document.getElementById('score-player');
        const eScore = document.getElementById('score-ia');
        if(pScore) pScore.innerText = "0";
        if(eScore) eScore.innerText = "0";

        // Atualiza Siglas (3 Letras)
        const pName = document.getElementById('name-player');
        const eName = document.getElementById('name-ia');
        
        if (pName && this.teams.player) {
            pName.innerText = this.teams.player.shortName; // Ex: RMD
        }
        
        if (eName && this.teams.ia) {
            eName.innerText = this.teams.ia.shortName; // Ex: FCB
        }
    }

    getIcon(role) {
        if(role === 'GK') return '🧤';
        if(role === 'DEF') return '🛡️';
        if(role === 'MID') return '⚡';
        return '🚀';
    }

    // --- CÂMERA E INPUTS ---

    setupCameraInputs() {
        const viewport = document.getElementById('game-viewport');
        
        // Mouse (Desktop)
        viewport.addEventListener('mousedown', (e) => this.startDrag(e.clientY));
        window.addEventListener('mousemove', (e) => this.onDrag(e.clientY));
        window.addEventListener('mouseup', () => this.endDrag());

        // Touch (Mobile)
        viewport.addEventListener('touchstart', (e) => this.startDrag(e.touches[0].clientY));
        window.addEventListener('touchmove', (e) => {
            // Previne o scroll nativo da página para não atrapalhar o jogo
            e.preventDefault(); 
            this.onDrag(e.touches[0].clientY);
        }, { passive: false });
        window.addEventListener('touchend', () => this.endDrag());
    }

    startDrag(y) {
        this.isDragging = true;
        this.startClientY = y;
        const world = document.getElementById('world-container');
        if(world) world.style.transition = 'none'; // Arrasto instantâneo
    }

    onDrag(y) {
        if (!this.isDragging) return;

        const deltaY = y - this.startClientY;
        // Converte pixels para VH (View Height)
        const vhDelta = (deltaY / window.innerHeight) * 100;
        
        let newY = this.previousTranslateY + vhDelta;
        
        // Limites físicos com "elástico" (+20 e -220)
        if (newY > 20) newY = 20;
        if (newY < -220) newY = -220;

        this.currentTranslateY = newY;
        
        const world = document.getElementById('world-container');
        if(world) world.style.transform = `translateY(${this.currentTranslateY}vh)`;
    }

    endDrag() {
        if (!this.isDragging) return;
        this.isDragging = false;

        const world = document.getElementById('world-container');
        if(world) world.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

        this.snapToNearestZone();
    }

    snapToNearestZone() {
        // Pontos de ancoragem: 0 (Ataque), -100 (Meio), -200 (Defesa)
        const positions = [
            { zone: 3, val: 0 },
            { zone: 2, val: -100 },
            { zone: 1, val: -200 }
        ];

        // Encontra o ponto mais próximo
        const nearest = positions.reduce((prev, curr) => {
            return (Math.abs(curr.val - this.currentTranslateY) < Math.abs(prev.val - this.currentTranslateY) ? curr : prev);
        });

        this.focusCamera(nearest.zone);
    }

    focusCamera(zoneId) {
        this.currentZone = zoneId;
        const world = document.getElementById('world-container');
        const text = document.getElementById('zone-text');
        
        let targetY = 0;
        let label = "";

        if (zoneId === 3) { targetY = 0; label = "SEU ATAQUE"; }
        if (zoneId === 2) { targetY = -100; label = "MEIO CAMPO"; }
        if (zoneId === 1) { targetY = -200; label = "SUA DEFESA"; }

        // Atualiza estado
        this.currentTranslateY = targetY;
        this.previousTranslateY = targetY; 

        if(world) world.style.transform = `translateY(${targetY}vh)`;
        if(text) text.textContent = label;
    }
}