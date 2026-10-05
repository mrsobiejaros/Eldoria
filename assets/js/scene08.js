window.ELDORIA_SCENE_CONFIG = {
    id: "scene08",
    title: "La place publique",
    flavor: "Tout se joue autour du centre de la place : prendre l'espace, c'est prendre l'avantage.",
    accent: "#5ed6b5",
    tactic: "control",
    target: 10,
    botAggroRange: 460,
    botActionMin: 800,
    botActionMax: 1750,
    botMoveSpeed: 1.4,
    controlZone: true,
    roleText: {
        lyceen_casseur: "Entre dans la zone centrale puis touche 10 CRS au mortier.",
        crs: "Entre dans la zone centrale puis touche 10 casseurs au LBD.",
        lyceen_pacifiste: "Reste dans la zone centrale et utilise 10 fois ton mégaphone."
    },
    specials: {
        lyceen_casseur: {
            name: "Prise éclair",
            description: "Dans la zone centrale, ta prochaine action compte double.",
            type: "zone_double",
            cooldown: 12000
        },
        crs: {
            name: "Maintien de zone",
            description: "Dans la zone centrale, ta prochaine action compte double et soigne 10 PV.",
            type: "hold_zone",
            cooldown: 12000
        },
        lyceen_pacifiste: {
            name: "Rassemblement",
            description: "Dans la zone centrale, ajoute immédiatement 2 à la quête.",
            type: "rally",
            cooldown: 13000
        }
    }
};