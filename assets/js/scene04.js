window.ELDORIA_SCENE_CONFIG = {
    id: "scene04",
    title: "La rue des briques",
    flavor: "Une rue étroite où tout ce qui traîne peut devenir utile.",
    accent: "#c96d43",
    tactic: "bricks_charge",
    target: 10,
    botAggroRange: 390,
    botActionMin: 850,
    botActionMax: 1900,
    botMoveSpeed: 1.2,
    bricks: true,
    crsCharge: true,
    roleText: {
        lyceen_casseur: "Ramasse des briques avec R puis lance-en 10 sur les CRS.",
        crs: "Charge les casseurs avec Maj et réussis 10 coups de matraque.",
        lyceen_pacifiste: "Utilise 10 fois ton mégaphone sans rejoindre l'affrontement."
    },
    specials: {
        lyceen_casseur: {
            name: "Sac de briques",
            description: "Récupère immédiatement 3 briques.",
            type: "brick_bundle",
            cooldown: 10000
        },
        crs: {
            name: "Charge anti-émeute",
            description: "Accélère fortement et augmente la portée de la matraque pendant 4 secondes.",
            type: "riot_charge",
            cooldown: 11000
        },
        lyceen_pacifiste: {
            name: "Médiation",
            description: "Interrompt les attaques des bots pendant 3 secondes.",
            type: "mediation",
            cooldown: 12000
        }
    },
    choices: {
        "lyceen_casseur": [
                [
                        "briques_plus",
                        "Poches pleines",
                        "Tu commences avec 4 briques supplémentaires."
                ],
                [
                        "lancer_lourd",
                        "Lancer lourd",
                        "Les briques infligent plus de dégâts."
                ],
                [
                        "ramasseur",
                        "Ramasseur",
                        "Tu te déplaces plus vite pour récupérer les briques."
                ]
        ],
        "crs": [
                [
                        "charge_longue",
                        "Charge longue",
                        "Ta charge est plus rapide et plus agressive."
                ],
                [
                        "matraque_portee",
                        "Matraque longue",
                        "Ta portée de matraque est augmentée."
                ],
                [
                        "casque_renforce",
                        "Casque renforcé",
                        "Tu subis moins de dégâts des projectiles."
                ]
        ],
        "lyceen_pacifiste": [
                [
                        "negociation",
                        "Négociation",
                        "Ton mégaphone ralentit brièvement les bots."
                ],
                [
                        "calme",
                        "Sang-froid",
                        "Tu subis moins de dégâts."
                ],
                [
                        "esquive_civile",
                        "Esquive civile",
                        "Ta fenêtre d'esquive en saut est élargie."
                ]
        ]
}
};