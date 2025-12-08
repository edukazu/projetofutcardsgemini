// cards.js - V36: Dados Reais Completos (Sem buracos)

const TEAMS_DATA = {
    royal: {
        id: "team_royal",
        name: "ROYAL MADRID",
        shortName: "RMD",
        crest: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 88C72.1 88 90 70.1 90 48C90 25.9 72.1 8 50 8C27.9 8 10 25.9 10 48C10 70.1 27.9 88 50 88Z" fill="#F8F9FA" stroke="#D4AF37" stroke-width="4"/><path d="M78 28L22 72" stroke="#004D98" stroke-width="16" stroke-linecap="round" style="mix-blend-mode: multiply;"/><path d="M35 35L50 25L65 35V65L50 75L35 65V35Z" stroke="#D4AF37" stroke-width="3" fill="none"/><path d="M25 8L35 2L50 6L65 2L75 8L65 18H35L25 8Z" fill="#D4AF37"/></svg>`,
        formation: "4-4-2",
        colorPrimary: "#f0f0f0", 
        colorSecondary: "#d4af37",
        players: [
            // GK: REF, HAN, SPD, POS (Stats de linha baixos)
            { id: "rmd_gk", name: "Court", role: "GK", ovr: 90, nation: "be", face: 1, skin: "#f5d0b0", ref: 90, han: 88, spd: 46, pos: 89, pas: 35, dri: 30, des: 20, fin: 25, sta: 99, zone: 4 },
            
            // DEF: DES, INT, PAS, PHY
            { id: "rmd_lb", name: "F. Mendonça", role: "DEF", ovr: 83, nation: "fr", face: 3, skin: "#5c3a2a", des: 80, int: 78, pas: 75, dri: 78, fin: 64, sta: 90, zone: 3 },
            { id: "rmd_cb1", name: "Rudolph", role: "DEF", ovr: 87, nation: "de", face: 2, skin: "#3e2723", des: 89, int: 88, pas: 70, dri: 65, fin: 40, sta: 85, zone: 3 },
            { id: "rmd_cb2", name: "E. Miles", role: "DEF", ovr: 86, nation: "br", face: 2, skin: "#8d5524", des: 87, int: 85, pas: 72, dri: 70, fin: 50, sta: 85, zone: 3 },
            { id: "rmd_rb", name: "Carval", role: "DEF", ovr: 85, nation: "es", face: 1, skin: "#f5d0b0", des: 84, int: 82, pas: 79, dri: 75, fin: 55, sta: 88, zone: 3 },

            // MID: PAS, DRI, INT, PHY
            { id: "rmd_cm1", name: "Valente", role: "MID", ovr: 88, nation: "uy", face: 1, skin: "#e0ac69", pas: 85, dri: 82, des: 80, int: 82, fin: 79, sta: 95, zone: 2 },
            { id: "rmd_cm2", name: "J. Bells", role: "MID", ovr: 90, nation: "gb-eng", face: 2, skin: "#c68642", pas: 87, dri: 88, fin: 85, des: 75, int: 78, sta: 90, zone: 2 },
            { id: "rmd_cm3", name: "Tchou", role: "MID", ovr: 84, nation: "fr", face: 2, skin: "#3e2723", pas: 81, dri: 79, des: 84, int: 85, fin: 70, sta: 88, zone: 2 },
            { id: "rmd_cm4", name: "Cama V.", role: "MID", ovr: 83, nation: "fr", face: 4, skin: "#3e2723", pas: 81, dri: 84, des: 82, int: 80, fin: 68, sta: 87, zone: 2 },

            // ATT: FIN, DRI, PAS, SPD (Defesa baixa)
            { id: "rmd_lw", name: "Vimi", role: "ATT", ovr: 90, nation: "br", face: 4, skin: "#5c3a2a", dri: 92, fin: 85, pas: 80, des: 35, int: 40, sta: 85, zone: 1 },
            { id: "rmd_st", name: "Kylian M.", role: "ATT", ovr: 91, nation: "fr", face: 3, skin: "#8d5524", dri: 93, fin: 91, pas: 80, des: 40, int: 35, sta: 88, zone: 1 }
        ]
    },
    catalonia: {
        id: "team_cata",
        name: "FC CATALONIA",
        shortName: "FCB",
        crest: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 20H90V35C90 65 50 95 50 95C50 95 10 65 10 35V20Z" fill="#004D98" stroke="#FFD700" stroke-width="3"/><path d="M10 20H50V45H10V20Z" fill="white"/><path d="M28 20V45M10 32H50" stroke="#CD122D" stroke-width="6"/><path d="M50 20H90V45H50V20Z" fill="#FFD700"/><path d="M58 20V45M66 20V45M74 20V45M82 20V45" stroke="#CD122D" stroke-width="3"/><rect x="10" y="45" width="80" height="12" fill="#111"/><path d="M50 57V95M30 57V88M70 57V88" stroke="#CD122D" stroke-width="8"/><circle cx="50" cy="75" r="7" fill="#FFD700"/></svg>`,
        formation: "4-3-3",
        colorPrimary: "#004d98", 
        colorSecondary: "#a50044",
        players: [
            // GOLEIRO
            { id: "fcb_gk", name: "Ter Steg", role: "GK", ovr: 89, nation: "de", face: 1, skin: "#f5d0b0", ref: 90, pos: 88, han: 87, spd: 50, pas: 55, dri: 30, des: 20, fin: 25, sta: 99, zone: 0 },

            // DEFESA
            { id: "fcb_lb", name: "A. Balde", role: "DEF", ovr: 81, nation: "es", face: 2, skin: "#5c3a2a", des: 78, int: 75, pas: 70, dri: 82, fin: 50, sta: 85, zone: 1 },
            { id: "fcb_cb1", name: "R. Araujo", role: "DEF", ovr: 86, nation: "uy", face: 3, skin: "#8d5524", des: 87, int: 83, pas: 65, dri: 60, fin: 45, sta: 80, zone: 1 },
            { id: "fcb_cb2", name: "P. Cubas", role: "DEF", ovr: 78, nation: "es", face: 1, skin: "#f5d0b0", des: 79, int: 80, pas: 72, dri: 68, fin: 40, sta: 75, zone: 1 },
            { id: "fcb_rb", name: "J. Kound", role: "DEF", ovr: 85, nation: "fr", face: 4, skin: "#8d5524", des: 86, int: 84, pas: 75, dri: 72, fin: 50, sta: 88, zone: 1 },

            // MEIO
            { id: "fcb_cm1", name: "F. De Jong", role: "MID", ovr: 87, nation: "nl", face: 1, skin: "#f5d0b0", pas: 89, dri: 87, des: 75, int: 78, fin: 70, sta: 85, zone: 2 },
            { id: "fcb_cm2", name: "Pedro G.", role: "MID", ovr: 86, nation: "es", face: 3, skin: "#f5d0b0", pas: 88, dri: 89, des: 70, int: 72, fin: 72, sta: 80, zone: 2 },
            { id: "fcb_cm3", name: "Gaviota", role: "MID", ovr: 83, nation: "es", face: 1, skin: "#f5d0b0", pas: 83, dri: 84, des: 82, int: 81, fin: 70, sta: 90, zone: 2 },

            // ATAQUE
            { id: "fcb_lw", name: "Raph", role: "ATT", ovr: 84, nation: "br", face: 4, skin: "#c68642", dri: 85, fin: 80, pas: 80, des: 45, int: 50, sta: 88, zone: 3 },
            { id: "fcb_st", name: "R. Lewan", role: "ATT", ovr: 88, nation: "pl", face: 1, skin: "#f5d0b0", fin: 91, dri: 80, pas: 75, des: 35, int: 40, sta: 75, zone: 3 },
            { id: "fcb_rw", name: "I. Iamal", role: "ATT", ovr: 82, nation: "es", face: 2, skin: "#c68642", dri: 87, fin: 78, pas: 82, des: 40, int: 45, sta: 80, zone: 3 }
        ]
    }
};