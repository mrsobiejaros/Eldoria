window.ELDORIA_SCENE_CONFIG = {
    id: "scene07",
    title: "L'encerclement",
    flavor: "Plus personne ne tient sa ligne : les groupes se ruent les uns sur les autres.",
    accent: "#a08cff",
    tactic: "rush",
    target: 10,
    botAggroRange: 520,
    botActionMin: 650,
    botActionMax: 1450,
    botMoveSpeed: 1.75,
    aggressiveRush: true,
    roleText: {
        lyceen_casseur: "Les CRS te poursuivent. Saute pour esquiver leurs LBD et touche-en 10.",
        crs: "Les casseurs te poursuivent. Évite leurs tirs et touche-en 10 au LBD.",
        lyceen_pacifiste: "Reste mobile au milieu de l'encerclement et utilise 10 fois ton mégaphone."
    },
    specials: {
        lyceen_casseur: {
            name: "Fumigène",
            description: "Désoriente les CRS et bloque leurs actions pendant 3 secondes.",
            type: "smoke",
            cooldown: 12500
        },
        crs: {
            name: "Formation tortue",
            description: "Réduit énormément les dégâts pendant 4 secondes.",
            type: "turtle",
            cooldown: 12500
        },
        lyceen_pacifiste: {
            name: "Tous assis !",
            description: "Stoppe les bots pendant 3 secondes et ajoute 2 à la quête.",
            type: "sit_down",
            cooldown: 14000
        }
    },
    choices: {
        "lyceen_casseur": [
                [
                        "esquive",
                        "Esquive",
                        "La fenêtre d'esquive pendant le saut est plus large."
                ],
                [
                        "rush",
                        "Rush",
                        "Vitesse augmentée de 35 %."
                ],
                [
                        "agressif",
                        "Agressif",
                        "Cadence d'action fortement réduite."
                ]
        ],
        "crs": [
                [
                        "formation",
                        "Formation serrée",
                        "Dégâts reçus réduits de 30 %."
                ],
                [
                        "tir_reactif",
                        "Tir réactif",
                        "Cooldown d'action réduit."
                ],
                [
                        "poursuite",
                        "Poursuite",
                        "Tu te déplaces 30 % plus vite."
                ]
        ],
        "lyceen_pacifiste": [
                [
                        "panique_zero",
                        "Zéro panique",
                        "Tu subis 30 % de dégâts en moins."
                ],
                [
                        "chant",
                        "Chant continu",
                        "Le mégaphone a 30 % de chance de compter double."
                ],
                [
                        "fuite",
                        "Fuite organisée",
                        "Vitesse augmentée et meilleure esquive."
                ]
        ]
}
};