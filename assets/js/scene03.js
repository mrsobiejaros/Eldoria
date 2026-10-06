window.ELDORIA_SCENE_CONFIG = {
    id: "scene03",
    title: "Manifestation au lycée",
    flavor: "Le premier face-à-face : chacun découvre son camp et teste ses nerfs.",
    accent: "#e7c66f",
    tactic: "basic",
    target: 10,
    botAggroRange: 340,
    botActionMin: 1000,
    botActionMax: 2300,
    botMoveSpeed: 1.0,
    roleText: {
        lyceen_casseur: "Tire 10 mortiers sur les CRS.",
        crs: "Tire 10 LBD sur les casseurs.",
        lyceen_pacifiste: "Utilise 10 fois ton mégaphone."
    },
    specials: {
        lyceen_casseur: {
            name: "Adrénaline",
            description: "Course accélérée pendant 4 secondes.",
            type: "adrenaline",
            cooldown: 9000
        },
        crs: {
            name: "Visée stable",
            description: "Ton prochain LBD inflige des dégâts renforcés.",
            type: "precision_lbd",
            cooldown: 8500
        },
        lyceen_pacifiste: {
            name: "Chant collectif",
            description: "Fait progresser la quête de 2 et calme les bots brièvement.",
            type: "collective_chant",
            cooldown: 11000
        }
    },
    choices: {
        "lyceen_casseur": [
                [
                        "mortier_lourd",
                        "Mortier lourd",
                        "Mortiers très puissants et cadence légèrement améliorée."
                ],
                [
                        "mobilite",
                        "Mobilité",
                        "Tu te déplaces 30 % plus vite."
                ],
                [
                        "rage",
                        "Rage",
                        "Tu subis 20 % de dégâts en moins et ta cadence augmente."
                ]
        ],
        "crs": [
                [
                        "lbd_puissant",
                        "LBD renforcé",
                        "Tes tirs de LBD infligent davantage de dégâts."
                ],
                [
                        "protection",
                        "Protection",
                        "Tu subis 25 % de dégâts en moins."
                ],
                [
                        "discipline",
                        "Discipline",
                        "Cadence améliorée et vitesse légèrement augmentée."
                ]
        ],
        "lyceen_pacifiste": [
                [
                        "voix_forte",
                        "Voix forte",
                        "Chaque mégaphone a 25 % de chance de compter double."
                ],
                [
                        "souffle",
                        "Souffle",
                        "Tu te déplaces plus vite et récupères 10 PV."
                ],
                [
                        "calme_collectif",
                        "Calme collectif",
                        "Ton mégaphone ralentit les bots et tu subis moins de dégâts."
                ]
        ]
}
};