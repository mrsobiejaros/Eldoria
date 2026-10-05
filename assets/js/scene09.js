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
    }
};