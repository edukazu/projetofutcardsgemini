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
        const teamData = side === 'player' ? this.teams.player : this.teams.ia;
        const color1 = teamData.colorPrimary;
        const color2 = teamData.colorSecondary;
        
        // Determina quais 4 atributos mostrar baseados na ROLE
        // 4 Atributos principais
        const stats = this.getStatsForRole(p);

        const card = document.createElement('div');
        card.className = `card-unit is-${side} card-premium`;
        
        // Injetamos as cores do time como variáveis CSS locais
        // Variáveis de cor
        card.style.setProperty('--team-c1', color1);
        card.style.setProperty('--team-c2', color2);

        card.innerHTML = `
            <div class="cp-header">
                <div class="cp-col-left">
                    <div class="cp-ovr">${p.ovr}</div>
                    <div class="cp-role">${p.role}</div>
                </div>

                <div class="cp-col-right">
                    <div class="cp-nation">${this.getNationSVG(p.nation)}</div>
                    <div class="cp-team-badge">${teamData.crest}</div>
                </div>
            </div>

            <div class="cp-visual">
                ${this.generateFaceSVG(p.face, p.skin)}
            </div>

            <div class="cp-name">${p.name}</div>

            <div class="cp-stats">
                <div class="stat-row">
                    <span class="s-label">${stats[0].label}</span><span class="s-val">${stats[0].val}</span>
                    <span class="s-label">${stats[1].label}</span><span class="s-val">${stats[1].val}</span>
                </div>
                <div class="stat-row">
                    <span class="s-label">${stats[2].label}</span><span class="s-val">${stats[2].val}</span>
                    <span class="s-label">${stats[3].label}</span><span class="s-val">${stats[3].val}</span>
                </div>
            </div>
        `;
        return card;
    }

    // Retorna os 4 atributos principais para exibir na carta
    getStatsForRole(p) {
        if (p.role === 'GK') {
            return [{label:'REF', val:p.ref}, {label:'HAN', val:p.han}, {label:'POS', val:p.pos}, {label:'PAS', val:p.pas}];
        }
        if (p.role === 'DEF') {
            return [{label:'DES', val:p.des}, {label:'INT', val:p.int}, {label:'PAS', val:p.pas}, {label:'FIS', val:p.sta}];
        }
        if (p.role === 'MID') {
            return [{label:'PAS', val:p.pas}, {label:'DRI', val:p.dri}, {label:'INT', val:p.int}, {label:'FIN', val:p.fin}];
        }
        // ATT
        return [{label:'FIN', val:p.fin}, {label:'DRI', val:p.dri}, {label:'PAS', val:p.pas}, {label:'FIS', val:p.sta}];
    }

    getNationSVG(code) {
        // Gabarito de Bandeiras Minimalistas
        const flags = {
            'br': `<rect width="30" height="20" fill="#009c3b"/><path d="M15 2 L28 10 L15 18 L2 10 Z" fill="#ffdf00"/><circle cx="15" cy="10" r="3.5" fill="#002776"/>`, // Brasil
            'fr': `<rect width="10" height="20" fill="#0055A4"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#EF4135"/>`, // França
            'de': `<rect width="30" height="7" fill="#000"/><rect y="7" width="30" height="7" fill="#DD0000"/><rect y="14" width="30" height="6" fill="#FFCE00"/>`, // Alemanha
            'es': `<rect width="30" height="20" fill="#AA151B"/><rect y="5" width="30" height="10" fill="#F1BF00"/>`, // Espanha
            'gb-eng': `<rect width="30" height="20" fill="#fff"/><rect x="13" width="4" height="20" fill="#CE1124"/><rect y="8" width="30" height="4" fill="#CE1124"/>`, // Inglaterra
            'uy': `<rect width="30" height="20" fill="#fff"/><rect y="4" width="30" height="2" fill="#0038A8"/><rect y="8" width="30" height="2" fill="#0038A8"/><rect y="12" width="30" height="2" fill="#0038A8"/><rect y="16" width="30" height="2" fill="#0038A8"/><rect width="12" height="10" fill="#fff"/><circle cx="5" cy="5" r="3" fill="#FCD116"/>`, // Uruguai
            'nl': `<rect width="30" height="7" fill="#AE1C28"/><rect y="7" width="30" height="7" fill="#fff"/><rect y="14" width="30" height="6" fill="#21468B"/>`, // Holanda
            'ar': `<rect width="30" height="20" fill="#fff"/><rect width="30" height="6" fill="#74ACDF"/><rect y="14" width="30" height="6" fill="#74ACDF"/><circle cx="15" cy="10" r="2" fill="#F6B40E"/>`, // Argentina
            'pt': `<rect width="12" height="20" fill="#006600"/><rect x="12" width="18" height="20" fill="#ff0000"/><circle cx="12" cy="10" r="4" fill="#FFFF00"/>`, // Portugal
            'be': `<rect width="10" height="20" fill="#000"/><rect x="10" width="10" height="20" fill="#FDDA24"/><rect x="20" width="10" height="20" fill="#EF3340"/>`, // Bélgica
            'pl': `<rect width="30" height="10" fill="#fff"/><rect y="10" width="30" height="10" fill="#DC143C"/>`, // Polônia
            'si': `<rect width="30" height="7" fill="#fff"/><rect y="7" width="30" height="7" fill="#0000ff"/><rect y="14" width="30" height="6" fill="#ff0000"/><path d="M4 7 L8 2 L12 7" fill="#fff"/>` // Eslovênia (Simplificada)
        };

        const content = flags[code] || `<rect width="30" height="20" fill="#ccc"/>`; // Bandeira cinza se não achar
        
        // Retorna SVG encapsulado
        return `<svg viewBox="0 0 30 20" width="100%" height="100%" preserveAspectRatio="none">${content}</svg>`;
    }

    // Gera um rosto SVG simples baseado nos dados
    generateFaceSVG(faceId, skinColor) {
        // Formatos de cabelo simples baseados no ID (1-4)
        // prettier-ignore
        const hairStyles = [
            `M30,30 Q50,10 70,30 L70,40 Q50,20 30,40 Z`, // Cabelo Curto
            `M25,35 Q50,5 75,35 L75,50 Q50,20 25,50 Z`,   // Topete
            `M20,40 Q50,0 80,40 L80,60 Q50,30 20,60 Z`,   // Afro/Volumoso
            `M28,30 Q50,15 72,30 L72,60 Q50,60 28,60 Z`    // Tranças/Longo
        ];
        // Adicionei camisa simples usando cor do time
        return `
        <svg class="cp-face-svg" viewBox="0 0 100 100">
            <path d="M20,90 Q50,100 80,90 L80,100 L20,100 Z" fill="var(--team-c1)" />
            <path d="M30,40 Q30,85 50,90 Q70,85 70,40 Q70,20 50,20 Q30,20 30,40" fill="${skinColor}" />
            <path d="${hairStyles[(faceId-1) % 4]}" fill="#1a1a1a" />
            <circle cx="40" cy="50" r="2" fill="#000"/>
            <circle cx="60" cy="50" r="2" fill="#000"/>
        </svg>
        `;
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