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
    },
    choices: {
        "lyceen_casseur": [
                [
                        "ignifuge",
                        "Veste ignifugée",
                        "Les zones de feu te font beaucoup moins mal."
                ],
                [
                        "sprint_feu",
                        "Sprint brûlant",
                        "Tu cours plus vite dans cette scène."
                ],
                [
                        "furie_feu",
                        "Furie des flammes",
                        "Cadence améliorée et dégâts reçus réduits."
                ]
        ],
        "crs": [
                [
                        "armure_thermique",
                        "Armure thermique",
                        "Dégâts de feu fortement réduits."
                ],
                [
                        "lbd_stable",
                        "LBD stable",
                        "Tes LBD sont plus puissants."
                ],
                [
                        "intervention_feu",
                        "Intervention rapide",
                        "Vitesse augmentée et résistance légère."
                ]
        ],
        "lyceen_pacifiste": [
                [
                        "chemin_sur",
                        "Chemin sûr",
                        "Tu subis beaucoup moins de dégâts de feu."
                ],
                [
                        "appel_calme",
                        "Appel au calme",
                        "Le mégaphone ralentit les bots."
                ],
                [
                        "secouriste",
                        "Secouriste",
                        "Tu récupères lentement de la vie et résistes mieux au feu."
                ]
        ]
}
};