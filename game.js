/**
 * game.js - Com Lógica de Times e Câmera
 */

class Game {
    constructor() {
        this.territories = ['Gol IA', 'Defesa IA', 'Meio-Campo', 'Ataque Jogador', 'Gol Jogador'];
        this.ballPositionIndex = 2; // Começa no Meio
        this.possession = 0; 
        this.scorePlayer = 0;
        this.scoreIA = 0;

        // Carrega dados do cards.js
        this.teams = TEAMS_DATA;
        
        // Inicializa o jogo
        this.initBoard();
    }

    // Distribui as cartas visualmente nas zonas
    initBoard() {
        // Limpa zonas antigas se houver
        document.querySelectorAll('.cards-container').forEach(e => e.remove());

        // Adiciona containers de cartas em todas as zonas (0 a 4)
        for (let i = 0; i <= 4; i++) {
            const zone = document.getElementById(`zone-${i}`);
            const container = document.createElement('div');
            container.className = 'cards-container';
            container.id = `cards-zone-${i}`;
            zone.appendChild(container);
        }

        // Renderiza Time Jogador
        this.teams.player.players.forEach(p => this.createCardElement(p, 'player'));

        // Renderiza Time IA
        this.teams.ia.players.forEach(p => this.createCardElement(p, 'ia'));
        
        // Posiciona Câmera Inicial
        this.updateCamera();
    }

    createCardElement(playerData, teamType) {
        const container = document.getElementById(`cards-zone-${playerData.zone}`);
        if (!container) return;

        const card = document.createElement('div');
        card.className = 'card-token';
        card.style.backgroundColor = teamType === 'player' ? this.teams.player.color : this.teams.ia.color;
        
        // Conteúdo simples da carta (Nome e Posição)
        card.innerHTML = `
            <span>${playerData.role}</span>
            <small style="font-size:0.5rem">${playerData.name.substring(0,6)}</small>
        `;

        container.appendChild(card);
    }

    startBattle() {
        if (this.ballPositionIndex === 0 || this.ballPositionIndex === 4) {
            this.resetAfterGoal();
            return;
        }

        // Lógica de Movimento Simplificada para teste do Zoom
        // 1. Define direção
        let direction = 0;
        if (this.possession === 0) direction = Math.random() > 0.5 ? 1 : -1;
        else direction = this.possession;

        // 2. Simula vitória do ataque sempre para testar movimento (por enquanto)
        this.ballPositionIndex += direction;
        
        // Atualiza posse
        if(this.possession === 0) this.possession = direction;

        // Verifica Limites e Gols
        if (this.ballPositionIndex > 4) this.ballPositionIndex = 4;
        if (this.ballPositionIndex < 0) this.ballPositionIndex = 0;

        if (this.ballPositionIndex === 4) {
            this.scorePlayer++;
            this.updateInfo("GOL DO JOGADOR!");
            this.possession = 0;
        } else if (this.ballPositionIndex === 0) {
            this.scoreIA++;
            this.updateInfo("GOL DA IA!");
            this.possession = 0;
        } else {
            this.updateInfo(`Bola moveu para: ${this.territories[this.ballPositionIndex]}`);
        }

        this.render();
    }

    resetAfterGoal() {
        this.ballPositionIndex = 2;
        this.possession = 0;
        this.updateInfo("Bola no centro. Nova saída!");
        this.render();
    }

    updateInfo(msg) {
        document.getElementById('game-info').textContent = msg;
    }

    // Lógica da Câmera (Zoom e Foco)
    updateCamera() {
        const pitch = document.getElementById('pitch-container');
        
        // Remove classes de foco anteriores
        pitch.className = ''; 

        // Aplica a classe baseada na posição da bola
        switch (this.ballPositionIndex) {
            case 0: // Gol IA
                pitch.classList.add('camera-focus-goal-left');
                break;
            case 1: // Defesa IA / Ataque Jogador (Campo Esquerdo)
                pitch.classList.add('camera-focus-defense');
                break;
            case 2: // Meio-Campo
                pitch.classList.add('camera-focus-mid');
                break;
            case 3: // Ataque Jogador / Defesa IA (Campo Direito)
                pitch.classList.add('camera-focus-attack');
                break;
            case 4: // Gol Jogador
                pitch.classList.add('camera-focus-goal-right');
                break;
        }
    }

    render() {
        // Atualiza Placar
        document.getElementById('score-player').textContent = this.scorePlayer;
        document.getElementById('score-ia').textContent = this.scoreIA;
        
        let posText = this.possession === 0 ? "NEUTRA" : (this.possession === 1 ? "JOGADOR" : "IA");
        document.getElementById('possession-display').innerHTML = `<span>${posText}</span>`;

        this.moveBallVisual();
        
        // Atualiza a Câmera a cada renderização
        this.updateCamera();
    }

    moveBallVisual() {
        const ball = document.getElementById('ball-indicator');
        const targetZone = document.getElementById(`zone-${this.ballPositionIndex}`);
        
        // Cálculo centralizado
        // No layout novo, precisamos considerar que o targetZone pode estar dentro do pitch-container
        // Como o ball-indicator também está dentro do pitch-container, o offsetLeft é relativo a ele mesmo.
        
        let newLeft = targetZone.offsetLeft + (targetZone.offsetWidth / 2);
        
        // Ajuste fino para os gols que estão com margem negativa (absolute)
        // Se for zona 0 ou 4, o offsetLeft pode ser tricky por causa do position:absolute
        if (this.ballPositionIndex === 0) {
            newLeft = -30; // Centro do Gol Esquerdo (-60px largura)
        } else if (this.ballPositionIndex === 4) {
            // A largura do pitch container pode variar, então pegamos o width total
            const pitchWidth = document.getElementById('pitch-container').offsetWidth;
            newLeft = pitchWidth + 30; // Centro do Gol Direito
        }

        ball.style.left = `${newLeft}px`;
    }
}