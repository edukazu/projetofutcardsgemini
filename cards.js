// cards.js - Banco de Dados Oficial (Versão Fictícia V3)

// Agora usamos chaves neutras (royal, catalonia) em vez de (player, ia)
// O game.js vai decidir quem é o player baseado na escolha do menu.
const TEAMS_DATABASE = {
    royal: {
        id: "team_royal",
        name: "ROYAL MADRID",
        shortName: "RMD",
        formation: "4-3-3",
        colorPrimary: "#e0e0e0", 
        colorSecondary: "#d4af37",
        players: [
            // GOLEIRO
            { id: "rmd_gk", name: "Court", role: "GK", ovr: 90, ref: 92, pos: 88, zone: 4 },
            
            // DEFESA
            { id: "rmd_lb", name: "F. Mendonça", role: "DEF", ovr: 83, des: 82, int: 78, zone: 3 },
            { id: "rmd_cb1", name: "Rudolph", role: "DEF", ovr: 87, des: 88, int: 84, zone: 3 },
            { id: "rmd_cb2", name: "E. Miles", role: "DEF", ovr: 86, des: 86, int: 85, zone: 3 },
            { id: "rmd_rb", name: "Carval", role: "DEF", ovr: 85, des: 84, int: 83, zone: 3 },

            // MEIO-CAMPO
            { id: "rmd_cm1", name: "Valente", role: "MID", ovr: 88, pas: 85, dri: 84, des: 80, sta: 95, zone: 2 },
            { id: "rmd_cm2", name: "J. Bells", role: "MID", ovr: 90, pas: 88, dri: 89, fin: 85, sta: 90, zone: 2 },
            { id: "rmd_cm3", name: "Tchou", role: "MID", ovr: 84, pas: 82, des: 85, sta: 88, zone: 2 },

            // ATAQUE
            { id: "rmd_lw", name: "Vimi Jr", role: "ATT", ovr: 90, dri: 92, fin: 86, pas: 80, sta: 85, zone: 1 }, // Nome Alterado
            { id: "rmd_st", name: "Kylian M.", role: "ATT", ovr: 91, dri: 93, fin: 90, sta: 88, zone: 1 },
            { id: "rmd_rw", name: "Rodrix", role: "ATT", ovr: 86, dri: 88, fin: 82, pas: 81, sta: 82, zone: 1 }
        ]
    },
    catalonia: {
        id: "team_cata",
        name: "FC CATALONIA",
        shortName: "FCB",
        formation: "4-3-3", 
        colorPrimary: "#004d98", 
        colorSecondary: "#a50044",
        players: [
            // GOLEIRO
            { id: "fcb_gk", name: "Ter Steg", role: "GK", ovr: 89, ref: 90, pos: 91, zone: 0 },

            // DEFESA
            { id: "fcb_lb", name: "A. Balde", role: "DEF", ovr: 81, des: 78, int: 75, zone: 1 },
            { id: "fcb_cb1", name: "R. Araujo", role: "DEF", ovr: 86, des: 87, int: 83, zone: 1 },
            { id: "fcb_cb2", name: "P. Cubas", role: "DEF", ovr: 78, des: 79, int: 80, zone: 1 },
            { id: "fcb_rb", name: "J. Kound", role: "DEF", ovr: 85, des: 86, int: 84, zone: 1 },

            // MEIO-CAMPO
            { id: "fcb_cm1", name: "F. De Jong", role: "MID", ovr: 87, pas: 89, dri: 88, des: 75, sta: 85, zone: 2 },
            { id: "fcb_cm2", name: "Pedro G.", role: "MID", ovr: 86, pas: 88, dri: 89, sta: 80, zone: 2 },
            { id: "fcb_cm3", name: "Gaviota", role: "MID", ovr: 83, pas: 82, des: 80, sta: 90, zone: 2 },

            // ATAQUE
            { id: "fcb_lw", name: "Raph", role: "ATT", ovr: 84, dri: 85, fin: 80, pas: 80, sta: 88, zone: 3 },
            { id: "fcb_st", name: "R. Lewan", role: "ATT", ovr: 88, dri: 80, fin: 92, sta: 75, zone: 3 },
            { id: "fcb_rw", name: "I. Iamal", role: "ATT", ovr: 82, dri: 87, fin: 78, pas: 82, sta: 80, zone: 3 } // Nome Alterado
        ]
    }
};