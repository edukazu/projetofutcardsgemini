// formations.js - Gabarito Linear (Apenas Eixo X)

const FORMATIONS = {
    "4-4-2": {
        // 4 Jogadores bem espaçados (15% a 85%)
        def: [ { left: 15 }, { left: 38 }, { left: 62 }, { left: 85 } ],
        mid: [ { left: 15 }, { left: 38 }, { left: 62 }, { left: 85 } ],
        att: [ { left: 35 }, { left: 65 } ]
    },
    "4-3-3": {
        // Defesa igual
        def: [ { left: 15 }, { left: 38 }, { left: 62 }, { left: 85 } ],
        // 3 Jogadores centralizados
        mid: [ { left: 30 }, { left: 50 }, { left: 70 } ],
        att: [ { left: 20 }, { left: 50 }, { left: 80 } ]
    },
    "3-5-2": {
        // 3 Zagueiros
        def: [ { left: 30 }, { left: 50 }, { left: 70 } ],
        // 5 Meias (O desafio: precisam caber lado a lado)
        mid: [ { left: 10 }, { left: 30 }, { left: 50 }, { left: 70 }, { left: 90 } ],
        att: [ { left: 40 }, { left: 60 } ]
    }
};