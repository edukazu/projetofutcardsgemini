/**
 * game.js - V42: Lógica de Kickoff e Interação de Clique
 */

class Game {
    constructor(config = {}) {
        this.territories = ['Gol IA', 'Defesa IA', 'Meio-Campo', 'Ataque Jogador', 'Gol Jogador'];
        this.ballPositionIndex = 2; // Bola no meio
        this.scorePlayer = 0;
        this.scoreIA = 0;

        // --- NOVOS ESTADOS ---
        this.state = 'LOADING'; // LOADING, KICKOFF, MATCH_LOGIC
        this.ballHolder = null; // Quem está com a posse
        this.possessionTeam = null; // 'player' ou 'ia'

        this.playerName = config.playerName || "JOGADOR";
        this.playerColor = config.playerTeamColor || 'blue';
        
        // 1. Identifica o Time do Jogador baseado na cor escolhida
        let playerTeamData;
        switch(this.playerColor) {
            case 'red': playerTeamData = TEAMS_DATA.catalonia; break;
            case 'redwhite': playerTeamData = TEAMS_DATA.matrice; break;
            default: playerTeamData = TEAMS_DATA.royal; break; // 'blue'
        }

        // 2. Sorteia o Oponente (Qualquer time MENOS o que o jogador escolheu)
        const allTeams = Object.values(TEAMS_DATA); // Pega a lista [Royal, Catalonia, Matrice]
        const availableOpponents = allTeams.filter(t => t.id !== playerTeamData.id);
        
        // Escolhe um índice aleatório da lista de disponíveis
        const randomOpponent = availableOpponents[Math.floor(Math.random() * availableOpponents.length)];

        // 3. Inicializa os times (Clonando para garantir segurança dos dados)
        this.teams = { 
            player: JSON.parse(JSON.stringify(playerTeamData)), 
            ia: JSON.parse(JSON.stringify(randomOpponent)) 
        };

        console.log(`Matchup: ${this.teams.player.name} vs ${this.teams.ia.name}`);

        // --- CORREÇÃO DE ZONAS (FIX ROYAL/ORIENTAÇÃO) ---
        // Aplica a orientação correta independente do time escolhido
        this.assignTacticalZones(this.teams.player, 'left');
        this.assignTacticalZones(this.teams.ia, 'right');
    }

    // Método auxiliar para distribuir posições
    assignTacticalZones(teamObj, side) {
        teamObj.players.forEach(p => {
            if (side === 'left') {
                // Jogador: GK(0), DEF(1), MID(2), ATT(3) -> Ataca para a direita
                if (p.role === 'GK') p.zone = 0;
                else if (p.role === 'DEF') p.zone = 1;
                else if (p.role === 'MID') p.zone = 2;
                else if (p.role === 'ATT') p.zone = 3; // Entra na defesa da IA
            } else {
                // IA: GK(4), DEF(3), MID(2), ATT(1) -> Ataca para a esquerda
                if (p.role === 'GK') p.zone = 4;
                else if (p.role === 'DEF') p.zone = 3;
                else if (p.role === 'MID') p.zone = 2;
                else if (p.role === 'ATT') p.zone = 1; // Entra na defesa do Jogador
            }
        });
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

    // --- TABULEIRO E INICIALIZAÇÃO ---
    initBoard() {
        this.state = 'LOADING';
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
        
        // Inicia o fluxo de Kickoff após breve delay
        setTimeout(() => this.startKickoff(), 500);
    }

    // --- LÓGICA DE KICKOFF (EVENTO DE CARA OU COROA) ---
    startKickoff() {
        this.state = 'KICKOFF';
        this.updateInfo("Aguardando o sorteio...");
    // 1. Configurar o Overlay
    const overlay = document.getElementById('coin-toss-overlay');
    const coin = document.getElementById('coin'); // O elemento que gira
    const coinFront = document.getElementById('coin-front-face');
    const coinBack = document.getElementById('coin-back-face');
    // Define as cores e nomes
    coinFront.textContent = this.teams.player.name;
    coinFront.className = `coin-face coin-front ${this.teams.player.id === 'team_royal' ? 'bg-royal' : 'bg-catalonia'}`;
    
    coinBack.textContent = this.teams.ia.name;
    coinBack.className = `coin-face coin-back ${this.teams.ia.id === 'team_royal' ? 'bg-royal' : 'bg-catalonia'}`;
    // 2. Mostrar e Girar
    overlay.style.display = 'flex';
    coin.style.transition = 'none'; // Remove transição para o giro contínuo
    coin.className = 'coin-spinning'; // Classe do CSS que gira infinito
            // 3. Determinar o Vencedor AGORA
            const winner = Math.random() < 0.5 ? 'player' : 'ia';
            const winnerTeam = (winner === 'player') ? this.teams.player : this.teams.ia;
            
            // --- FIX KICKOFF: REGRA DE MEIO-CAMPO ---
            // Primeiro, filtra apenas os Meio-Campistas (MID)
            let eligiblePlayers = winnerTeam.players.filter(p => p.role === 'MID');
            
            // Fallback de segurança: Se não houver MID (ex: formação exótica), usa qualquer um exceto GK
            if (eligiblePlayers.length === 0) {
                eligiblePlayers = winnerTeam.players.filter(p => p.role !== 'GK');
            }

            // Agora sim, busca o melhor passador DENTRO dos elegíveis
            const bestPasser = eligiblePlayers.reduce((prev, current) => {
                return (prev.pas >= current.pas) ? prev : current;
            });
    
    // 4. Agendar a PARADA da moeda (Drama)
    setTimeout(() => {
        // Para a animação infinita
        coin.className = ''; 
        
        // Adiciona uma transição suave para "travar" na face correta
        coin.style.transition = 'transform 0.5s ease-out';
        
        // Força a rotação para o lado do vencedor
        // Frente (0deg) = Jogador | Verso (180deg) = IA
        if (winner === 'player') {
            coin.style.transform = 'rotateY(0deg)'; // Para na Frente
        } else {
            coin.style.transform = 'rotateY(180deg)'; // Para no Verso
        }
        // Atualiza texto visualmente
        this.updateInfo(`Vencedor: ${winnerTeam.name}!`);
        // 5. Esperar o jogador LER o resultado antes de esconder (Delay de leitura)
        setTimeout(() => {
            overlay.style.display = 'none';
            
            // Aplica a lógica do jogo
            this.ballHolder = bestPasser;
            this.possessionTeam = winner; 
            this.moveBallToPlayer(bestPasser);
            
            if (winner === 'player') {
                this.updateInfo(`Vencedor: ${winnerTeam.name}! Bola com ${bestPasser.name}. CLIQUE em um parceiro.`);
            } else {
                // Turno da IA: Automatiza o passe
                this.updateInfo(`Vencedor: IA (${winnerTeam.name}). Bola com ${bestPasser.name}. IA preparando passe...`);
                this.triggerIAKickoff(); // <--- CHAMADA NOVA AQUI
            }
        }, 2000); // 2 segundos vendo o resultado estático
    }, 1500); // Gira por 1.5 segundos antes de parar
}

    // --- INTERAÇÃO DO JOGADOR ---
    handleCardClick(playerData, teamType) {
        // Regra 1: Só funciona no Kickoff se for posse do jogador
        if (this.state === 'KICKOFF' && this.possessionTeam === 'player') {
            if (playerData.id === this.ballHolder.id) return; // Não passar para si mesmo
            if (teamType !== 'player') return; // Não passar para adversário
        // REGRA DO KICKOFF: O passe deve ser para um Meio-Campista (MID)
        if (playerData.role !== 'MID') {
            this.updateInfo(`Regra: O pontapé inicial deve ser para um MEIO-CAMPISTA!`);
            return; // Bloqueia a ação
        }
        // Executa o passe
        console.log(`Passe de ${this.ballHolder.name} para ${playerData.name}`);
        this.ballHolder = playerData;
        this.moveBallToPlayer(playerData);
        
        // Transição para o Jogo Real
        this.startMatchState();
    }
}

    // --- NOVA FUNÇÃO: IA REALIZA O PONTAPÉ INICIAL (REGRA: SÓ PARA MEIO-CAMPO) ---
    triggerIAKickoff() {
        // Delay para parecer que a IA está "pensando"
        setTimeout(() => {
            const aiTeam = this.teams.ia.players;
            
            // Regra: O passe inicial deve ir para um Meio-Campista (MID) que não seja o dono da bola
            let possibleReceivers = aiTeam.filter(p => p.role === 'MID' && p.id !== this.ballHolder.id);
            
            // Fallback: Se não houver meias (ex: formação exótica), permite passar para qualquer um exceto GK
            if (possibleReceivers.length === 0) {
                possibleReceivers = aiTeam.filter(p => p.id !== this.ballHolder.id && p.role !== 'GK');
            }
            
            // Escolhe um alvo aleatório entre os válidos
            const target = possibleReceivers[Math.floor(Math.random() * possibleReceivers.length)];
            
            if (target) {
                console.log(`IA (Kickoff): ${this.ballHolder.name} passa para ${target.name} (MID)`);
                this.updateInfo(`IA: ${this.ballHolder.name} tocou para ${target.name}.`);
                
                // Move a bola e muda o estado
                this.ballHolder = target;
                this.moveBallToPlayer(target);
                
                // Inicia o jogo real
                this.startMatchState();
            }
        }, 1500); 
    }

    startMatchState() {
        this.state = 'MATCH_LOGIC';
        this.updateInfo('Sua vez! Escolha uma ação.');
        this.updateActionButtons(); // <--- IMPORTANTE
        
        // --- GARANTIA VISUAL: Acende o cone assim que o turno começa ---
        this.highlightValidDefenders(); 
    }

    // 1. Chamado ao clicar no botão
    executeTurnAction(actionType) {
        if (!this.ballHolder) return;

        // A. Identifica o cenário defensivo (Quem marca? Tem suporte?)
        const defendersInCone = this.identifyDefenders(this.ballHolder);
        const defenseSetup = this.resolveDefenseSetup(defendersInCone);

        if (defenseSetup.type === 'OPEN') {
            alert("Caminho Livre! (Implementar avanço automático)");
            return;
        }

        // B. Executa a Matemática do Duelo
        this.resolveDuelMath(actionType, this.ballHolder, defenseSetup);
    }

    // A. Calculadora (Faz a conta e prepara os dados)
    resolveDuelMath(actionType, attacker, defenseSetup) {
        const defender = defenseSetup.main;
        const supportBonus = defenseSetup.bonus;

        // Atributos
        let attAttr = (actionType === 'DRIBBLE') ? attacker.dri : attacker.pas;
        let defAttr = (actionType === 'DRIBBLE') ? defender.des : defender.int;
        const actionLabel = (actionType === 'DRIBBLE') ? "DRIBLE" : "PASSE";

        // Dados
        const diceAtt = Math.floor(Math.random() * 20) + 1;
        const diceDef = Math.floor(Math.random() * 20) + 1;

        // Totais
        const totalAtt = attAttr + diceAtt;
        const defAttrWithBonus = Math.floor(defAttr * (1 + (supportBonus / 100))); 
        const totalDef = defAttrWithBonus + diceDef;
        const winner = (totalAtt > totalDef) ? 'att' : 'def';

        // Objeto de Resultado para a Animação
        const duelData = {
            actionLabel,
            attacker: { name: attacker.name, id: attacker.id, base: attAttr, dice: diceAtt, total: totalAtt },
            defender: { name: defender.name, id: defender.id, base: defAttr, bonus: supportBonus, bonusVal: defAttrWithBonus, dice: diceDef, total: totalDef },
            winner
        };

        // Chama a Animação
        this.animateDuelScene(duelData);
    }

    // C. O Novo Diretor de Cena (Versão Corrigida: Remove 'hidden')
    animateDuelScene(data) {
        const overlay = document.getElementById('duel-stage-overlay');
        const attSlot = document.getElementById('fighter-att');
        const defSlot = document.getElementById('fighter-def');
        const resultPanel = document.getElementById('duel-result-panel');

        // --- FIX CRÍTICO: Garante que o palco esteja visível ---
        overlay.classList.remove('hidden'); 
        // Força o navegador a reconhecer a mudança antes de animar a opacidade
        void overlay.offsetWidth; 
        overlay.classList.add('active'); 

        // 1. Limpeza do Palco
        attSlot.innerHTML = '';
        defSlot.innerHTML = '';
        // Reseta as animações removendo as classes anteriores
        attSlot.className = 'duel-fighter attacker-slot'; 
        defSlot.className = 'duel-fighter defender-slot';
        
        resultPanel.className = 'hidden'; // Esconde o resultado no início

        // 2. CLONAGEM: Pega os visuais originais e cria cópias
        const originalAttWrapper = document.getElementById(`card-wrapper-${data.attacker.id}`);
        const originalDefWrapper = document.getElementById(`card-wrapper-${data.defender.id}`);

        // Segurança: Só clona se encontrar as cartas
        if (originalAttWrapper && originalDefWrapper) {
            const cloneAtt = originalAttWrapper.querySelector('.card-full').cloneNode(true);
            const cloneDef = originalDefWrapper.querySelector('.card-full').cloneNode(true);

            // Ajusta classes para o tamanho gigante e remove IDs duplicados
            cloneAtt.className = 'card-full cloned-card-visual';
            cloneDef.className = 'card-full cloned-card-visual';
            cloneAtt.removeAttribute('id');
            cloneDef.removeAttribute('id');

            attSlot.appendChild(cloneAtt);
            defSlot.appendChild(cloneDef);

            // 3. AÇÃO: Aplica animações de entrada (Slide In) após leve delay
            setTimeout(() => {
                attSlot.classList.add('animate-enter-left');
                defSlot.classList.add('animate-enter-right');
            }, 100);
        } else {
            console.error("Erro: Não foi possível encontrar as cartas originais para clonar.");
        }

        // Configura textos iniciais
        const titleEl = document.getElementById('duel-action-title');
        if(titleEl) titleEl.textContent = data.actionLabel;
        
        const resAtt = document.getElementById('res-att-val');
        const resDef = document.getElementById('res-def-val');
        const outcome = document.getElementById('duel-outcome-text');
        
        if(resAtt) { resAtt.textContent = ''; resAtt.style.color = '#fff'; }
        if(resDef) { resDef.textContent = ''; resDef.style.color = '#fff'; }
        if(outcome) outcome.textContent = '';

        // 4. CLÍMAX: O Resultado aparece (1.2s depois)
        setTimeout(() => {
            // Tremor de impacto
            const arena = document.querySelector('.duel-arena');
            if(arena) arena.classList.add('clash-impact');
            
            // Mostra Painel
            if(resultPanel) resultPanel.classList.remove('hidden');
            if(resultPanel) resultPanel.classList.add('show');
            
            if(resAtt) resAtt.textContent = data.attacker.total;
            if(resDef) resDef.textContent = data.defender.total;

            // Define Vencedor Visualmente
            if (data.winner === 'att') {
                attSlot.classList.add('winner-glow');
                defSlot.classList.add('loser-gray');
                if(outcome) outcome.textContent = "SUCESSO!";
                if(resAtt) resAtt.style.color = "#00e676";
                if(resDef) resDef.style.color = "#ff5252";
            } else {
                defSlot.classList.add('winner-glow');
                attSlot.classList.add('loser-gray');
                if(outcome) outcome.textContent = "BLOQUEADO!";
                if(resDef) resDef.style.color = "#00e676";
                if(resAtt) resAtt.style.color = "#ff5252";
            }

            // 5. FIM DA CENA: Fecha tudo
            setTimeout(() => {
                overlay.classList.remove('active');
                setTimeout(() => {
                    overlay.classList.add('hidden'); // Volta a esconder
                    if(arena) arena.classList.remove('clash-impact');
                }, 300);

                console.log("Cena acabou. Vencedor:", data.winner);
                
                // Feedback Provisório
                if (data.winner === 'att') this.updateInfo("ATAQUE VENCEU! Avançando...");
                else this.updateInfo("DEFESA VENCEU! Roubando a bola...");

            }, 3000); // Tempo para ler o resultado

        }, 1200); // Tempo da animação de entrada
    }

    // 3. Atualiza UI (Chamar no startMatchState)
    updateActionButtons() {
        // Atualizado para o novo ID flutuante
        const panel = document.getElementById('floating-action-menu');
        
        if (this.possessionTeam === 'player') {
            panel.classList.remove('hidden');
        } else {
            panel.classList.add('hidden');
        }
    }

    // --- LÓGICA TÁTICA: IDENTIFICAR DEFENSORES VÁLIDOS ---
    identifyDefenders(attackerCard) {
        // 1. Identificar a Zona de Defesa Oposta (Espelhamento)
        let targetZoneId = attackerCard.zone;
        if (attackerCard.zone === 3) targetZoneId = 1; // Atacante (3) vs Defesa (1)
        if (attackerCard.zone === 2) targetZoneId = 2; // Meio (2) vs Meio (2)
        if (attackerCard.zone === 1) targetZoneId = 3; // Defesa (1) saindo jogando vs Ataque (3)

        // Define quem é o time defensor baseado em quem tem a posse
        const defenseTeam = (this.possessionTeam === 'player') ? this.teams.ia.players : this.teams.player.players;
        
        // Filtra apenas os inimigos que estão fisicamente na zona de combate
        const potentialDefenders = defenseTeam.filter(p => p.zone === targetZoneId);

        if (potentialDefenders.length === 0) return []; // Caminho livre

        // 2. Calcular Posição Relativa (0% a 100% da largura do campo)
        // Precisamos saber onde o atacante está para saber quem está perto dele
        const attackTeam = (this.possessionTeam === 'player') ? this.teams.player.players : this.teams.ia.players;
        const attackersInZone = attackTeam.filter(p => p.zone === attackerCard.zone);
        
        // Descobre o índice do atacante no array da zona (ex: é o 2º de 3 jogadores)
        const attackerIndex = attackersInZone.indexOf(attackerCard);
        // Transforma em porcentagem (0.0 a 1.0). Se estiver sozinho, assume o meio (0.5)
        const attackerPos = attackersInZone.length > 1 ? attackerIndex / (attackersInZone.length - 1) : 0.5;

        // 3. Filtrar Defensores pelo Alcance (Cone de Influência)
        const RANGE = 0.35; // 35% de alcance para cada lado (cobre frente e diagonais)
        
        const validDefenders = potentialDefenders.filter((def, index) => {
            // Calcula a posição do defensor
            const defPos = potentialDefenders.length > 1 ? index / (potentialDefenders.length - 1) : 0.5;
            // Mede a distância
            const distance = Math.abs(attackerPos - defPos);
            
            // Regra Especial: Se só tem um defensor na zona, ele sempre marca (para evitar bugs de range)
            if (potentialDefenders.length === 1) return true;

            return distance <= RANGE;
        });

        return validDefenders;
    }

    // --- LÓGICA TÁTICA: RESOLVER QUEM MARCA E QUEM AJUDA ---
    resolveDefenseSetup(validDefenders) {
        if (!validDefenders || validDefenders.length === 0) {
            return { type: 'OPEN', main: null, supporters: [], bonus: 0 };
        }

        // 1. Se tiver só um, é duelo simples (1x1)
        if (validDefenders.length === 1) {
            return { type: 'DUEL', main: validDefenders[0], supporters: [], bonus: 0 };
        }

        // 2. Se tiver mais de um (1xN), escolhe o MELHOR para o combate (Smart AI)
        // Critério: Soma de (Desarme + Interceptação) * Fator Cansaço
        // Isso simula um jogador escolhendo seu melhor zagueiro para parar a jogada
        const sortedDefenders = validDefenders.sort((a, b) => {
            const scoreA = (a.des + a.int) * (a.sta / 100);
            const scoreB = (b.des + b.int) * (b.sta / 100);
            return scoreB - scoreA; // Ordena do Maior para o Menor
        });

        const mainDefender = sortedDefenders[0]; // O melhor assume
        const supporters = sortedDefenders.slice(1); // O resto ajuda

        // 3. Calcula o Bônus de Suporte (Vantagem Numérica)
        // Regra: Cada suporte adiciona 10% de eficiência ao defensor principal
        const supportBonus = supporters.length * 10; 

        console.log(`Defesa Organizada: ${mainDefender.name} assume o duelo.`);
        console.log(`Suporte: +${supportBonus}% vindo de ${supporters.length} jogadores.`);

        return { 
            type: 'CLUSTER', 
            main: mainDefender, 
            supporters: supporters, 
            bonus: supportBonus 
        };
    }

    // Atualize o método de teste highlight para usar essa nova inteligência visualmente
    highlightValidDefenders() {
        if (!this.ballHolder) return;

        // Limpa destaques anteriores
        document.querySelectorAll('.valid-defender-highlight').forEach(el => el.classList.remove('valid-defender-highlight'));
        document.querySelectorAll('.support-defender-highlight').forEach(el => el.classList.remove('support-defender-highlight'));

        // 1. Identifica quem está no cone
        const defenders = this.identifyDefenders(this.ballHolder);
        
        // 2. Resolve a hierarquia (Quem manda, quem ajuda)
        const setup = this.resolveDefenseSetup(defenders);

        if (setup.main) {
            // Destaque Laranja para o Duelista Principal
            const mainWrapper = document.getElementById(`card-wrapper-${setup.main.id}`);
            if (mainWrapper) mainWrapper.classList.add('valid-defender-highlight');

            // Destaque Amarelo/Azul para os Suportes (Se houver)
            setup.supporters.forEach(sup => {
                const supWrapper = document.getElementById(`card-wrapper-${sup.id}`);
                if (supWrapper) supWrapper.classList.add('support-defender-highlight');
            });
            
            this.updateInfo(`Defesa: ${setup.main.name} lidera a marcação (+${setup.bonus}% suporte).`);
        } else {
            this.updateInfo(`Caminho Livre! Nenhum defensor próximo.`);
        }
    }

    // --- CRIAÇÃO DE TOKENS NO CAMPO ---
    createTokenElement(playerData, teamType) {
        const clusterId = teamType === 'player' ? 
            `cluster-player-zone-${playerData.zone}` : 
            `cluster-ia-zone-${playerData.zone}`;
        const container = document.getElementById(clusterId);
        
        if (container) {
            const wrapper = document.createElement('div');
            wrapper.className = 'field-card-container';
            wrapper.id = `card-wrapper-${playerData.id}`;
            
            // Cria a carta visual
            const cardDOM = this.createCardDOM(playerData, teamType, 'full');
            wrapper.appendChild(cardDOM);
            
            // --- EVENTO DE CLIQUE BLINDADO ---
            wrapper.onclick = (e) => {
                e.stopPropagation(); // Impede que cliques duplos buguem
                console.log(`>>> CLIQUE em: ${playerData.name} | Estado: ${this.state} | Turno: ${this.possessionTeam}`);
                
                if (this.state === 'KICKOFF') {
                    this.handleCardClick(playerData, teamType);
                } else {
                    console.log("Clique ignorado: Não é momento de Kickoff.");
                }
            };
            
            container.appendChild(wrapper);
        }
    }

    // --- FÁBRICA DE CARTAS (DOM) ---
    createCardDOM(playerData, teamType, mode) {
        const card = document.createElement('div');
        card.className = mode === 'full' ? 'card-full' : 'card-token';
        
        // ID único para encontrar o elemento depois (essencial para a bola seguir o jogador)
        if (mode === 'token') {
            card.id = `card-${playerData.id}`;
        }
        
        const teamObj = (teamType === 'player') ? this.teams.player : this.teams.ia;
        const isRoyal = (teamObj.id === 'team_royal');
        const isMatrice = (teamObj.id === 'team_matrice');

        if (isRoyal) card.classList.add('bg-royal');
        else if (isMatrice) card.classList.add('bg-matrice');
        else card.classList.add('bg-catalonia');
        
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

        document.getElementById('possession-display').innerHTML = `<span>JOGO PRONTO</span> <small>Sorteando...</small>`;
    }

    // --- MOVIMENTAÇÃO DA BOLA (VISUAL) ---
    moveBallToPlayer(playerData) {
        // Remove destaque de todos primeiro
        document.querySelectorAll('.field-card-container').forEach(el => el.classList.remove('active-focus'));
    // Busca o Wrapper (que tem a escala)
    const wrapper = document.getElementById(`card-wrapper-${playerData.id}`);
        const ball = document.getElementById('ball-indicator');
        
        if (ball && wrapper) {
            // Adiciona destaque visual (Cresce a carta)
            wrapper.classList.add('active-focus');
            
            // Anexa a bola
            wrapper.appendChild(ball);
            
            // Câmera segue
            this.setCamera(playerData.zone, 'normal');
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