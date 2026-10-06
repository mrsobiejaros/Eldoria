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
    },
    choices: {
        "lyceen_casseur": [
                [
                        "zone_double",
                        "Prise de zone",
                        "Dans la zone centrale, 35 % de chance que l'action compte double."
                ],
                [
                        "mobilite_zone",
                        "Course de zone",
                        "Vitesse augmentée dans la zone centrale."
                ],
                [
                        "domination",
                        "Domination",
                        "Dans la zone centrale, dégâts reçus réduits."
                ]
        ],
        "crs": [
                [
                        "controle",
                        "Contrôle",
                        "Dans la zone centrale, tes LBD infligent plus de dégâts."
                ],
                [
                        "tenir",
                        "Tenir la ligne",
                        "Dans la zone centrale, dégâts reçus réduits."
                ],
                [
                        "avance_zone",
                        "Avancée tactique",
                        "Dans la zone centrale, vitesse et cadence sont améliorées."
                ]
        ],
        "lyceen_pacifiste": [
                [
                        "rassemblement",
                        "Rassemblement",
                        "Dans la zone centrale, le mégaphone a 40 % de chance de compter double."
                ],
                [
                        "protection_foule",
                        "Protection de foule",
                        "Dans la zone centrale, tu subis 40 % de dégâts en moins."
                ],
                [
                        "porte_parole",
                        "Porte-parole",
                        "Dans la zone centrale, ton mégaphone ralentit les bots."
                ]
        ]
}
};