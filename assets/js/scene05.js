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
    }
};