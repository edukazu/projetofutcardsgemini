// cards.js - V26: Escudos Refinados (Faixa Sobreposta & Cruz Assimétrica)

const TEAMS_DATA = {
    royal: {
        id: "team_royal",
        name: "ROYAL MADRID",
        shortName: "RMD",
        // SVG: Faixa Azul Sobreposta e Escudo Limpo
        crest: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- Base Branca -->
                  <path d="M50 8C27.9 8 10 25.9 10 48C10 70.1 27.9 88 50 88C72.1 88 90 70.1 90 48C90 25.9 72.1 8 50 8Z" fill="#F8F9FA" stroke="#D4AF37" stroke-width="4"/>
                  
                  <!-- Letras de Fundo (Agora Atrás da Faixa) -->
                  <path d="M35 35L50 25L65 35V65L50 75L35 65V35Z" stroke="#D4AF37" stroke-width="2" fill="none" opacity="0.6"/>
                  
                  <!-- Faixa Diagonal (Sobrepondo TUDO) -->
                  <path d="M78 28L22 72" stroke="#004D98" stroke-width="16" stroke-linecap="round" style="mix-blend-mode: normal;"/>
                  
                  <!-- Coroa no Topo -->
                  <path d="M25 8L35 2L50 6L65 2L75 8L65 18H35L25 8Z" fill="#D4AF37"/>
                  <circle cx="50" cy="5" r="2" fill="red"/>
                </svg>`,
        formation: "4-3-3",
        colorPrimary: "#f0f0f0", 
        colorSecondary: "#d4af37",
        players: [
            { id: "rmd_gk", name: "Court", role: "GK", ovr: 90, nation: "be", face: 1, skin: "#f5d0b0", ref: 92, pos: 88, zone: 4 },
            { id: "rmd_lb", name: "F. Mendonça", role: "DEF", ovr: 83, nation: "fr", face: 3, skin: "#5c3a2a", des: 82, int: 78, zone: 3 },
            { id: "rmd_cb1", name: "Rudolph", role: "DEF", ovr: 87, nation: "de", face: 2, skin: "#3e2723", des: 88, int: 84, zone: 3 },
            { id: "rmd_cb2", name: "E. Miles", role: "DEF", ovr: 86, nation: "br", face: 2, skin: "#8d5524", des: 86, int: 85, zone: 3 },
            { id: "rmd_rb", name: "Carval", role: "DEF", ovr: 85, nation: "es", face: 1, skin: "#f5d0b0", des: 84, int: 83, zone: 3 },
            { id: "rmd_cm1", name: "Valente", role: "MID", ovr: 88, nation: "uy", face: 1, skin: "#e0ac69", pas: 85, dri: 84, des: 80, sta: 95, zone: 2 },
            { id: "rmd_cm2", name: "J. Bells", role: "MID", ovr: 90, nation: "gb-eng", face: 2, skin: "#c68642", pas: 88, dri: 89, fin: 85, sta: 90, zone: 2 },
            { id: "rmd_cm3", name: "Tchou", role: "MID", ovr: 84, nation: "fr", face: 2, skin: "#3e2723", pas: 82, des: 85, sta: 88, zone: 2 },
            { id: "rmd_lw", name: "Vimi", role: "ATT", ovr: 90, nation: "br", face: 4, skin: "#5c3a2a", dri: 92, fin: 86, pas: 80, sta: 85, zone: 1 },
            { id: "rmd_st", name: "Kylian M.", role: "ATT", ovr: 91, nation: "fr", face: 3, skin: "#8d5524", dri: 93, fin: 90, sta: 88, zone: 1 },
            { id: "rmd_rw", name: "Rodrix", role: "ATT", ovr: 86, nation: "br", face: 2, skin: "#8d5524", dri: 88, fin: 82, pas: 81, sta: 82, zone: 1 }
        ]
    },
    catalonia: {
        id: "team_cata",
        name: "FC CATALONIA",
        shortName: "FCB",
        // SVG: Escudo Arredondado + Cruz Deslocada
        crest: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- Contorno Arredondado (Gordinho) -->
                  <path d="M10 20H90V35C90 65 80 85 50 98C20 85 10 65 10 35V20Z" fill="#004D98" stroke="#FFD700" stroke-width="3"/>
                  
                  <!-- Fundo Superior -->
                  <path d="M10 20H50V45H10V20Z" fill="white"/>
                  <path d="M50 20H90V45H50V20Z" fill="#FFD700"/>
                  
                  <!-- Cruz de São Jorge (Deslocada para a Direita) -->
                  <!-- A barra vertical foi movida para x=40 (quase encostando na divisória 50) -->
                  <rect x="38" y="20" width="8" height="25" fill="#CD122D"/> 
                  <rect x="10" y="28" width="40" height="8" fill="#CD122D"/>
                  
                  <!-- Listras Catalãs -->
                  <path d="M58 20V45M66 20V45M74 20V45M82 20V45" stroke="#CD122D" stroke-width="3"/>
                  
                  <!-- Faixa Central -->
                  <rect x="10" y="45" width="80" height="12" fill="#111"/>
                  <text x="50" y="54" font-family="Arial" font-size="9" fill="white" text-anchor="middle" font-weight="bold">FCB</text>
                  
                  <!-- Listras Inferiores -->
                  <path d="M50 57V95" stroke="#CD122D" stroke-width="10"/>
                  <path d="M30 57V88" stroke="#CD122D" stroke-width="8"/>
                  <path d="M70 57V88" stroke="#CD122D" stroke-width="8"/>
                  
                  <!-- Bola -->
                  <circle cx="50" cy="75" r="7" fill="#FFD700" stroke="#CD122D" stroke-width="1"/>
                </svg>`,
        formation: "4-3-3", 
        colorPrimary: "#004d98", 
        colorSecondary: "#a50044",
        players: [
            { id: "fcb_gk", name: "Ter Steg", role: "GK", ovr: 89, nation: "de", face: 1, skin: "#f5d0b0", ref: 90, pos: 91, zone: 0 },
            { id: "fcb_lb", name: "A. Balde", role: "DEF", ovr: 81, nation: "es", face: 2, skin: "#5c3a2a", des: 78, int: 75, zone: 1 },
            { id: "fcb_cb1", name: "R. Araujo", role: "DEF", ovr: 86, nation: "uy", face: 2, skin: "#8d5524", des: 87, int: 83, zone: 1 },
            { id: "fcb_cb2", name: "P. Cubas", role: "DEF", ovr: 78, nation: "es", face: 1, skin: "#f5d0b0", des: 79, int: 80, zone: 1 },
            { id: "fcb_rb", name: "J. Kound", role: "DEF", ovr: 85, nation: "fr", face: 4, skin: "#8d5524", des: 86, int: 84, zone: 1 },
            { id: "fcb_cm1", name: "F. De Jong", role: "MID", ovr: 87, nation: "nl", face: 1, skin: "#f5d0b0", pas: 89, dri: 88, des: 75, sta: 85, zone: 2 },
            { id: "fcb_cm2", name: "Pedro G.", role: "MID", ovr: 86, nation: "es", face: 3, skin: "#f5d0b0", pas: 88, dri: 89, sta: 80, zone: 2 },
            { id: "fcb_cm3", name: "Gaviota", role: "MID", ovr: 83, nation: "es", face: 1, skin: "#f5d0b0", pas: 82, des: 80, sta: 90, zone: 2 },
            { id: "fcb_lw", name: "Raph", role: "ATT", ovr: 84, nation: "br", face: 4, skin: "#c68642", dri: 85, fin: 80, pas: 80, sta: 88, zone: 3 },
            { id: "fcb_st", name: "R. Lewan", role: "ATT", ovr: 88, nation: "pl", face: 1, skin: "#f5d0b0", dri: 80, fin: 92, sta: 75, zone: 3 },
            { id: "fcb_rw", name: "I. Iamal", role: "ATT", ovr: 82, nation: "es", face: 2, skin: "#c68642", dri: 87, fin: 78, pas: 82, sta: 80, zone: 3 }
        ]
    }
};