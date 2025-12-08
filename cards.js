// cards.js - Banco de dados das cartas e times

const TEAMS_DATA = {
    player: {
        name: "JOGADOR",
        formation: "4-4-2",
        color: "#0288d1", // Azul
        players: [
            // Zona 0: Goleiro
            { name: "Paredão", role: "GK", att: 10, def: 85, zone: 0 },
            // Zona 1: Defesa (4 jogadores)
            { name: "Capitão", role: "DEF", att: 40, def: 80, zone: 1 },
            { name: "Xerife", role: "DEF", att: 35, def: 78, zone: 1 },
            { name: "Lateral D", role: "DEF", att: 50, def: 70, zone: 1 },
            { name: "Lateral E", role: "DEF", att: 50, def: 70, zone: 1 },
            // Zona 2: Meio-Campo (4 jogadores)
            { name: "Maestro", role: "MID", att: 75, def: 60, zone: 2 },
            { name: "Volante", role: "MID", att: 60, def: 75, zone: 2 },
            { name: "Ala D", role: "MID", att: 70, def: 55, zone: 2 },
            { name: "Ala E", role: "MID", att: 70, def: 55, zone: 2 },
            // Zona 3: Ataque (2 jogadores)
            { name: "Artilheiro", role: "ATT", att: 88, def: 30, zone: 3 },
            { name: "Veloz", role: "ATT", att: 82, def: 35, zone: 3 }
        ]
    },
    ia: {
        name: "COMPUTADOR",
        formation: "4-3-3",
        color: "#d32f2f", // Vermelho
        players: [
            // Zona 4: Goleiro
            { name: "Robo-GK", role: "GK", att: 10, def: 88, zone: 4 },
            // Zona 3: Defesa (4 jogadores - Enfrentam o Ataque do Jogador)
            { name: "Robo-Zag1", role: "DEF", att: 40, def: 82, zone: 3 },
            { name: "Robo-Zag2", role: "DEF", att: 40, def: 80, zone: 3 },
            { name: "Robo-Lat1", role: "DEF", att: 55, def: 72, zone: 3 },
            { name: "Robo-Lat2", role: "DEF", att: 55, def: 72, zone: 3 },
            // Zona 2: Meio-Campo (3 jogadores - Enfrentam o Meio do Jogador)
            { name: "Robo-Mid1", role: "MID", att: 72, def: 65, zone: 2 },
            { name: "Robo-Mid2", role: "MID", att: 70, def: 68, zone: 2 },
            { name: "Robo-Mid3", role: "MID", att: 75, def: 60, zone: 2 },
            // Zona 1: Ataque (3 jogadores - Enfrentam a Defesa do Jogador)
            { name: "Robo-Att1", role: "ATT", att: 85, def: 30, zone: 1 },
            { name: "Robo-Att2", role: "ATT", att: 84, def: 32, zone: 1 },
            { name: "Robo-Att3", role: "ATT", att: 80, def: 35, zone: 1 }
        ]
    }
};