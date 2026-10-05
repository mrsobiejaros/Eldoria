const game =
    document.getElementById("game");

const player =
    document.getElementById("player");

const npcLayer =
    document.getElementById("npcLayer");

const effectsLayer =
    document.getElementById("effectsLayer");

const roleName =
    document.getElementById("roleName");

const objectiveText =
    document.getElementById("objectiveText");

const healthFill =
    document.getElementById("healthFill");

const healthValue =
    document.getElementById("healthValue");

const gameMessage =
    document.getElementById("gameMessage");

const leaveScene =
    document.getElementById("leaveScene");

const gender =
    EldoriaCharacters.getGender();

const role =
    EldoriaCharacters.getRole();

if (!gender) {
    window.location.href =
        "../index.html";
}

if (!role) {
    window.location.href =
        "scene02.html";
}

const ROLE_CONFIG = {
    lyceen_pacifiste: {
        label:
            "Lycéen pacifiste",

        objective:
            "Reste dans la manifestation. Tu peux te déplacer mais tu n'attaques personne."
    },

    lyceen_casseur: {
        label:
            "Lycéen casseur",

        objective:
            "Déplace-toi dans la manifestation et utilise ton mortier contre les CRS contrôlés par l'IA."
    },

    crs: {
        label:
            "CRS",

        objective:
            "Déplace-toi dans la manifestation. Utilise ton LBD et ta matraque contre les casseurs contrôlés par l'IA."
    }
};

const currentRole =
    ROLE_CONFIG[role] ||
    ROLE_CONFIG.lyceen_pacifiste;

roleName.textContent =
    currentRole.label;

objectiveText.textContent =
    currentRole.objective;

const playerSprite =
    EldoriaCharacters.getPlayerSprite();

EldoriaCharacters.applySprite(
    player,
    playerSprite
);

const sceneConfig =
    EldoriaCharacters.getSceneConfig(
        "scene03"
    ) || {
        player: {
            width: 82,
            height: 112
        },
        npc: {
            width: 72,
            height: 98
        }
    };

if (
    sceneConfig.player
) {
    EldoriaCharacters.applySize(
        player,
        sceneConfig.player
    );
}

const PLAYER_SPAWNS = {
    crs: {
        x: 0.82,
        y: 0.62
    },

    lyceen_casseur: {
        x: 0.18,
        y: 0.62
    },

    lyceen_pacifiste: {
        x: 0.50,
        y: 0.28
    }
};

const currentSpawn =
    PLAYER_SPAWNS[role] ||
    PLAYER_SPAWNS.lyceen_pacifiste;

let playerX =
    game.clientWidth *
    currentSpawn.x;

let playerY =
    game.clientHeight *
    currentSpawn.y;

let health = 100;
let lastAction = 0;
let lastAiTick = 0;
let messageTimer = null;

const PLAYER_SPEED = 2.3;

const keys = {};
const npcs = [];

function showMessage(text) {
    gameMessage.textContent =
        text;

    gameMessage.classList.add(
        "visible"
    );

    clearTimeout(
        messageTimer
    );

    messageTimer =
        setTimeout(
            () => {
                gameMessage.classList.remove(
                    "visible"
                );
            },
            1300
        );
}

function updateHealth() {
    health =
        Math.max(
            0,
            Math.min(
                100,
                health
            )
        );

    healthFill.style.width =
        health + "%";

    healthValue.textContent =
        Math.round(health);

    if (
        health <= 0
    ) {
        health = 100;

        playerX =
            game.clientWidth *
            currentSpawn.x;

        playerY =
            game.clientHeight *
            currentSpawn.y;

        showMessage(
            "Tu reprends ta place dans la manifestation."
        );
    }
}

function keepPlayerInside() {
    const halfWidth =
        player.offsetWidth / 2;

    const halfHeight =
        player.offsetHeight / 2;

    let minX =
        halfWidth + 12;

    let maxX =
        game.clientWidth -
        halfWidth -
        12;

    let minY =
        game.clientHeight * 0.18 +
        halfHeight;

    let maxY =
        game.clientHeight * 0.75 -
        halfHeight;

    if (
        role === "crs"
    ) {
        minX =
            game.clientWidth * 0.52;

        minY =
            game.clientHeight * 0.40 +
            halfHeight;
    }

    if (
        role === "lyceen_casseur"
    ) {
        maxX =
            game.clientWidth * 0.48;

        minY =
            game.clientHeight * 0.40 +
            halfHeight;
    }

    if (
        role === "lyceen_pacifiste"
    ) {
        minX =
            game.clientWidth * 0.32;

        maxX =
            game.clientWidth * 0.68;

        minY =
            game.clientHeight * 0.18 +
            halfHeight;

        maxY =
            game.clientHeight * 0.38 -
            halfHeight;
    }

    playerX =
        Math.max(
            minX,
            Math.min(
                maxX,
                playerX
            )
        );

    playerY =
        Math.max(
            minY,
            Math.min(
                maxY,
                playerY
            )
        );
}

function drawPlayer() {
    player.style.left =
        playerX + "px";

    player.style.top =
        playerY + "px";
}

function npcLabel(
    npcRole
) {
    if (
        npcRole === "crs"
    ) {
        return "CRS";
    }

    if (
        npcRole === "casseur"
    ) {
        return "Casseur";
    }

    return "Pacifiste";
}

function createNpc(
    npcRole,
    x,
    y
) {
    const npcGender =
        Math.random() < 0.5
            ? "men"
            : "girl";

    const element =
        document.createElement(
            "div"
        );

    element.className =
        "sceneNpc";

    const npcSize =
        sceneConfig.npc ||
        {
            width: 72,
            height: 98
        };

    element.style.width =
        npcSize.width + "px";

    element.style.height =
        npcSize.height + "px";

    element.style.backgroundImage =
        `url("${EldoriaCharacters.getNpcSprite(
            npcRole,
            npcGender
        )}")`;

    const label =
        document.createElement(
            "div"
        );

    label.className =
        "sceneNpcLabel";

    label.textContent =
        npcLabel(
            npcRole
        );

    element.appendChild(
        label
    );

    npcLayer.appendChild(
        element
    );

    const npc = {
        element,
        role:
            npcRole,
        x:
            game.clientWidth *
            x,
        y:
            game.clientHeight *
            y,
        hp:
            100,
        down:
            false,
        nextMove:
            performance.now() +
            300 +
            Math.random() *
            1000,
        nextAction:
            performance.now() +
            1200 +
            Math.random() *
            2500
    };

    npcs.push(
        npc
    );

    drawNpc(
        npc
    );

    return npc;
}

function drawNpc(npc) {
    npc.element.style.left =
        npc.x + "px";

    npc.element.style.top =
        npc.y + "px";
}

function populateNpcs() {
    const layout = [
        ["pacifiste", 0.40, 0.24],
        ["pacifiste", 0.47, 0.27],
        ["pacifiste", 0.54, 0.23],
        ["pacifiste", 0.59, 0.30],
        ["pacifiste", 0.44, 0.33],

        ["casseur", 0.13, 0.48],
        ["casseur", 0.20, 0.57],
        ["casseur", 0.28, 0.66],
        ["casseur", 0.35, 0.52],
        ["casseur", 0.39, 0.70],

        ["crs", 0.61, 0.52],
        ["crs", 0.68, 0.66],
        ["crs", 0.76, 0.56],
        ["crs", 0.84, 0.69],
        ["crs", 0.90, 0.48]
    ];

    layout.forEach(
        (
            [
                npcRole,
                x,
                y
            ]
        ) => {
            createNpc(
                npcRole,
                x,
                y
            );
        }
    );
}

function moveNpcRandomly(npc) {
    if (
        npc.down
    ) {
        return;
    }

    npc.x +=
        (
            Math.random() -
            0.5
        ) * 70;

    npc.y +=
        (
            Math.random() -
            0.5
        ) * 50;

    if (
        npc.role === "pacifiste"
    ) {
        npc.x =
            Math.max(
                game.clientWidth *
                    0.32,
                Math.min(
                    game.clientWidth *
                        0.68,
                    npc.x
                )
            );

        npc.y =
            Math.max(
                game.clientHeight *
                    0.18,
                Math.min(
                    game.clientHeight *
                        0.38,
                    npc.y
                )
            );
    }

    if (
        npc.role === "casseur"
    ) {
        npc.x =
            Math.max(
                game.clientWidth *
                    0.06,
                Math.min(
                    game.clientWidth *
                        0.47,
                    npc.x
                )
            );

        npc.y =
            Math.max(
                game.clientHeight *
                    0.40,
                Math.min(
                    game.clientHeight *
                        0.75,
                    npc.y
                )
            );
    }

    if (
        npc.role === "crs"
    ) {
        npc.x =
            Math.max(
                game.clientWidth *
                    0.53,
                Math.min(
                    game.clientWidth *
                        0.94,
                    npc.x
                )
            );

        npc.y =
            Math.max(
                game.clientHeight *
                    0.40,
                Math.min(
                    game.clientHeight *
                        0.75,
                    npc.y
                )
            );
    }

    drawNpc(
        npc
    );
}

function distanceToPlayer(
    npc
) {
    return Math.hypot(
        npc.x -
            playerX,
        npc.y -
            playerY
    );
}

function getNearestNpc(
    wantedRole
) {
    const available =
        npcs.filter(
            (npc) =>
                !npc.down &&
                npc.role ===
                    wantedRole
        );

    if (
        available.length === 0
    ) {
        return null;
    }

    available.sort(
        (a, b) =>
            distanceToPlayer(a) -
            distanceToPlayer(b)
    );

    return available[0];
}

function damageNpc(
    npc,
    amount
) {
    if (
        !npc ||
        npc.down
    ) {
        return;
    }

    npc.hp -=
        amount;

    npc.element.classList.add(
        "hit"
    );

    setTimeout(
        () => {
            npc.element.classList.remove(
                "hit"
            );
        },
        140
    );

    if (
        npc.hp <= 0
    ) {
        npc.down =
            true;

        npc.element.classList.add(
            "down"
        );

        setTimeout(
            () => {
                npc.hp = 100;

                npc.down =
                    false;

                npc.element.classList.remove(
                    "down"
                );

                if (
                    npc.role === "crs"
                ) {
                    npc.x =
                        game.clientWidth *
                        (
                            0.62 +
                            Math.random() *
                            0.28
                        );

                    npc.y =
                        game.clientHeight *
                        (
                            0.44 +
                            Math.random() *
                            0.28
                        );
                }

                if (
                    npc.role === "casseur"
                ) {
                    npc.x =
                        game.clientWidth *
                        (
                            0.10 +
                            Math.random() *
                            0.32
                        );

                    npc.y =
                        game.clientHeight *
                        (
                            0.44 +
                            Math.random() *
                            0.28
                        );
                }

                if (
                    npc.role === "pacifiste"
                ) {
                    npc.x =
                        game.clientWidth *
                        (
                            0.36 +
                            Math.random() *
                            0.28
                        );

                    npc.y =
                        game.clientHeight *
                        (
                            0.20 +
                            Math.random() *
                            0.16
                        );
                }

                drawNpc(
                    npc
                );
            },
            3000
        );
    }
}

function createImpact(
    x,
    y
) {
    const impact =
        document.createElement(
            "div"
        );

    impact.className =
        "impact";

    impact.style.left =
        x + "px";

    impact.style.top =
        y + "px";

    effectsLayer.appendChild(
        impact
    );

    setTimeout(
        () => {
            impact.remove();
        },
        500
    );
}

function useMortar() {
    if (
        !EldoriaInventory.has(
            "mortier",
            1
        )
    ) {
        showMessage(
            "Tu n'as pas de mortier."
        );

        return;
    }

    const target =
        getNearestNpc(
            "crs"
        );

    if (!target) {
        showMessage(
            "Aucun CRS à proximité."
        );

        return;
    }

    createImpact(
        target.x,
        target.y
    );

    damageNpc(
        target,
        65
    );

    showMessage(
        "Mortier lancé."
    );
}

function useLbd() {
    if (
        !EldoriaInventory.has(
            "grenade_lbd",
            1
        )
    ) {
        showMessage(
            "Tu n'as pas de LBD."
        );

        return;
    }

    const target =
        getNearestNpc(
            "casseur"
        );

    if (!target) {
        showMessage(
            "Aucun casseur à proximité."
        );

        return;
    }

    createImpact(
        target.x,
        target.y
    );

    damageNpc(
        target,
        45
    );

    showMessage(
        "Tir LBD."
    );
}

function useBaton() {
    if (
        !EldoriaInventory.has(
            "matraque",
            1
        )
    ) {
        showMessage(
            "Tu n'as pas de matraque."
        );

        return;
    }

    const target =
        getNearestNpc(
            "casseur"
        );

    if (
        !target ||
        distanceToPlayer(
            target
        ) > 145
    ) {
        showMessage(
            "Aucun casseur à portée."
        );

        return;
    }

    damageNpc(
        target,
        34
    );

    showMessage(
        "Coup de matraque."
    );
}

function primaryAction() {
    const now =
        performance.now();

    if (
        now -
        lastAction <
        500
    ) {
        return;
    }

    lastAction =
        now;

    if (
        role ===
        "lyceen_casseur"
    ) {
        useMortar();
        return;
    }

    if (
        role ===
        "crs"
    ) {
        useLbd();
        return;
    }

    showMessage(
        "Tu restes avec les manifestants."
    );
}

function aiAttack(
    npc
) {
    if (
        npc.down
    ) {
        return;
    }

    const distance =
        distanceToPlayer(
            npc
        );

    if (
        role === "crs" &&
        npc.role === "casseur" &&
        distance < 240
    ) {
        health -= 5;
        updateHealth();
        return;
    }

    if (
        role ===
            "lyceen_casseur" &&
        npc.role === "crs" &&
        distance < 240
    ) {
        health -= 5;
        updateHealth();
        return;
    }

    if (
        role ===
            "lyceen_pacifiste" &&
        (
            npc.role === "crs" ||
            npc.role === "casseur"
        ) &&
        distance < 115 &&
        Math.random() < 0.25
    ) {
        health -= 2;
        updateHealth();
    }
}

function updateAi(
    now
) {
    if (
        now -
        lastAiTick <
        120
    ) {
        return;
    }

    lastAiTick =
        now;

    npcs.forEach(
        (npc) => {
            if (
                now >=
                npc.nextMove
            ) {
                moveNpcRandomly(
                    npc
                );

                npc.nextMove =
                    now +
                    650 +
                    Math.random() *
                    1300;
            }

            if (
                now >=
                npc.nextAction
            ) {
                aiAttack(
                    npc
                );

                npc.nextAction =
                    now +
                    1300 +
                    Math.random() *
                    2500;
            }
        }
    );
}

function updatePlayerMovement() {
    let dx = 0;
    let dy = 0;

    if (
        keys["z"] ||
        keys["w"] ||
        keys["arrowup"]
    ) {
        dy -= 1;
    }

    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {
        dy += 1;
    }

    if (
        keys["q"] ||
        keys["a"] ||
        keys["arrowleft"]
    ) {
        dx -= 1;
    }

    if (
        keys["d"] ||
        keys["arrowright"]
    ) {
        dx += 1;
    }

    if (
        dx !== 0 ||
        dy !== 0
    ) {
        const length =
            Math.hypot(
                dx,
                dy
            );

        dx =
            dx /
            length;

        dy =
            dy /
            length;

        playerX +=
            dx *
            PLAYER_SPEED;

        playerY +=
            dy *
            PLAYER_SPEED;
    }

    keepPlayerInside();

    drawPlayer();
}

function update(
    now
) {
    const paused =
        window.EldoriaPauseMenu &&
        EldoriaPauseMenu.isOpen();

    if (!paused) {
        updatePlayerMovement();
        updateAi(
            now
        );
    }

    requestAnimationFrame(
        update
    );
}

document.addEventListener(
    "keydown",
    (event) => {
        const key =
            event.key.toLowerCase();

        keys[key] =
            true;

        if (
            key === "f" &&
            role === "crs"
        ) {
            useBaton();
        }

        if (
            key === "e"
        ) {
            window.location.href =
                "scene01.html";
        }
    }
);

document.addEventListener(
    "keyup",
    (event) => {
        keys[
            event.key.toLowerCase()
        ] =
            false;
    }
);

game.addEventListener(
    "mousedown",
    (event) => {
        if (
            window.EldoriaPauseMenu &&
            EldoriaPauseMenu.isOpen()
        ) {
            return;
        }

        if (
            event.target.closest(
                "#inventoryBar"
            ) ||
            event.target.closest(
                "#leaveScene"
            )
        ) {
            return;
        }

        if (
            event.button === 0
        ) {
            primaryAction();
        }
    }
);

document.addEventListener(
    "contextmenu",
    (event) => {
        event.preventDefault();
    }
);

leaveScene.addEventListener(
    "click",
    () => {
        window.location.href =
            "scene01.html";
    }
);

window.addEventListener(
    "blur",
    () => {
        for (
            const key in keys
        ) {
            keys[key] =
                false;
        }
    }
);

window.addEventListener(
    "resize",
    () => {
        playerX =
            Math.min(
                playerX,
                game.clientWidth -
                    60
            );

        playerY =
            Math.min(
                playerY,
                game.clientHeight -
                    115
            );

        keepPlayerInside();
        drawPlayer();
    }
);

keepPlayerInside();
drawPlayer();

populateNpcs();

updateHealth();

requestAnimationFrame(
    update
);
