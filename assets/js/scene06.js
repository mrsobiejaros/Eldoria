window.ELDORIA_SCENE_CONFIG = {
    id: "scene06",
    title: "La rue en feu",
    flavor: "La rue brûle : le terrain lui-même devient un adversaire.",
    accent: "#ff7a39",
    tactic: "fire",
    target: 10,
    botAggroRange: 430,
    botActionMin: 800,
    botActionMax: 1750,
    botMoveSpeed: 1.3,
    fireHazards: true,
    roleText: {
        lyceen_casseur: "Évite les zones en feu et touche 10 CRS au mortier.",
        crs: "Traverse la rue en feu et touche 10 casseurs au LBD.",
        lyceen_pacifiste: "Évite les zones en feu et utilise 10 fois ton mégaphone."
    },
    specials: {
        lyceen_casseur: {
            name: "Course dans les flammes",
            description: "Immunité au feu et vitesse augmentée pendant 5 secondes.",
            type: "fire_runner",
            cooldown: 12000
        },
        crs: {
            name: "Protection thermique",
            description: "Immunité au feu pendant 6 secondes et récupère un peu de vie.",
            type: "thermal_armor",
            cooldown: 13000
        },
        lyceen_pacifiste: {
            name: "Chemin sûr",
            description: "Immunité au feu pendant 7 secondes et +1 progression.",
            type: "safe_path",
            cooldown: 14000
        }
    }
};