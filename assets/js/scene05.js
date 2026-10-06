window.ELDORIA_SCENE_CONFIG = {
    id: "scene05",
    title: "Le barrage",
    flavor: "Une guerre de positions : avancer, se couvrir et tenir.",
    accent: "#7aa5d8",
    tactic: "barricades",
    target: 10,
    botAggroRange: 420,
    botActionMin: 850,
    botActionMax: 1850,
    botMoveSpeed: 1.25,
    barricades: true,
    roleText: {
        lyceen_casseur: "Utilise les barricades comme couverture et touche 10 CRS au mortier.",
        crs: "Avance derrière les barricades et touche 10 casseurs au LBD.",
        lyceen_pacifiste: "Reste derrière les barricades et utilise 10 fois ton mégaphone."
    },
    specials: {
        lyceen_casseur: {
            name: "À couvert !",
            description: "Réduit fortement les dégâts reçus pendant 5 secondes.",
            type: "cover",
            cooldown: 12000
        },
        crs: {
            name: "Mur de boucliers",
            description: "Réduit encore davantage les dégâts pendant 5 secondes.",
            type: "shield_wall",
            cooldown: 13000
        },
        lyceen_pacifiste: {
            name: "Abri improvisé",
            description: "Te rend invulnérable pendant 3 secondes.",
            type: "safe_shelter",
            cooldown: 14000
        }
    },
    choices: {
        "lyceen_casseur": [
                [
                        "couverture",
                        "Planqué",
                        "Tu subis 35 % de dégâts en moins."
                ],
                [
                        "tir_rapide",
                        "Tir rapide",
                        "Cooldown d'action réduit."
                ],
                [
                        "flanc",
                        "Contournement",
                        "Tu te déplaces plus vite pour contourner les barricades."
                ]
        ],
        "crs": [
                [
                        "bouclier_epais",
                        "Bouclier épais",
                        "Les dégâts reçus sont fortement réduits."
                ],
                [
                        "avancee",
                        "Avancée",
                        "Tu te déplaces 25 % plus vite."
                ],
                [
                        "pression_tir",
                        "Pression de tir",
                        "Tes LBD font plus mal et ta cadence augmente légèrement."
                ]
        ],
        "lyceen_pacifiste": [
                [
                        "abri",
                        "Abri",
                        "Tu récupères lentement de la vie."
                ],
                [
                        "encouragement",
                        "Encouragement",
                        "Ton mégaphone a 25 % de chance de compter double."
                ],
                [
                        "discret",
                        "Discret",
                        "Tu subis beaucoup moins de dégâts derrière les barricades."
                ]
        ]
}
};