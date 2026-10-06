window.ELDORIA_SCENE_CONFIG = {
    id: "scene09",
    title: "L'affrontement final",
    flavor: "Dernière ligne droite : tout le monde jette ses dernières forces dans la bataille.",
    accent: "#f05e72",
    tactic: "final",
    target: 10,
    botAggroRange: 560,
    botActionMin: 550,
    botActionMax: 1250,
    botMoveSpeed: 1.9,
    aggressiveRush: true,
    finalWave: true,
    roleText: {
        lyceen_casseur: "Dernier affrontement : touche 10 CRS au mortier en esquivant leurs LBD.",
        crs: "Dernier affrontement : touche 10 casseurs au LBD et tiens la ligne.",
        lyceen_pacifiste: "Reste au milieu du chaos et utilise 10 fois ton mégaphone."
    },
    specials: {
        lyceen_casseur: {
            name: "Dernier assaut",
            description: "Vitesse augmentée et cadence d'action accélérée pendant 5 secondes.",
            type: "last_assault",
            cooldown: 15000
        },
        crs: {
            name: "Dernière ligne",
            description: "Récupère toute ta vie et réduit fortement les dégâts pendant 6 secondes.",
            type: "last_line",
            cooldown: 16000
        },
        lyceen_pacifiste: {
            name: "Discours final",
            description: "Stoppe les bots pendant 4 secondes et ajoute 3 à la quête.",
            type: "final_speech",
            cooldown: 17000
        }
    },
    choices: {
        "lyceen_casseur": [
                [
                        "assaut_final",
                        "Assaut final",
                        "Vitesse et cadence d'action augmentées."
                ],
                [
                        "dernier_mortier",
                        "Dernier mortier",
                        "Tu subis 20 % de dégâts en moins."
                ],
                [
                        "tout_ou_rien",
                        "Tout ou rien",
                        "Très grosse cadence mais résistance plus faible."
                ]
        ],
        "crs": [
                [
                        "ligne_finale",
                        "Dernière ligne",
                        "Dégâts reçus réduits et LBD renforcés."
                ],
                [
                        "pression",
                        "Pression",
                        "Vitesse et cadence d'action augmentées."
                ],
                [
                        "commandement",
                        "Commandement",
                        "Résistance et vitesse légèrement augmentées."
                ]
        ],
        "lyceen_pacifiste": [
                [
                        "discours",
                        "Discours final",
                        "Le mégaphone a 45 % de chance de compter double."
                ],
                [
                        "resilience",
                        "Résilience",
                        "Tu subis 40 % de dégâts en moins et récupères lentement de la vie."
                ],
                [
                        "espoir",
                        "Dernier espoir",
                        "Vitesse améliorée, meilleure esquive et mégaphone parfois double."
                ]
        ]
}
};