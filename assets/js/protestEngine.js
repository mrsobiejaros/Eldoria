const config =
    window.ELDORIA_SCENE_CONFIG;

if (!config) {
    throw new Error(
        "Configuration de scène absente."
    );
}

const game =
    document.getElementById("game");

const world =
    document.getElementById("sceneWorld");

const player =
    document.getElementById("player");

const npcLayer =
    document.getElementById("npcLayer");

const effectsLayer =
    document.getElementById("effectsLayer");

const pickupLayer =
    document.getElementById("pickupLayer");

const hazardLayer =
    document.getElementById("hazardLayer");

const sceneFlavor =
    document.getElementById("sceneFlavor");

const roleName =
    document.getElementById("roleName");

const objectiveText =
    document.getElementById("objectiveText");

const healthFill =
    document.getElementById("healthFill");

const healthValue =
    document.getElementById("healthValue");

const questRow =
    document.getElementById("questRow");

const questFill =
    document.getElementById("questFill");

const questValue =
    document.getElementById("questValue");

const resourceRow =
    document.getElementById("resourceRow");

const specialRow =
    document.getElementById("specialRow");

const specialName =
    document.getElementById("specialName");

const specialCooldown =
    document.getElementById("specialCooldown");

const specialDescription =
    document.getElementById("specialDescription");

const gameMessage =
    document.getElementById("gameMessage");

const questCompleteOverlay =
    document.getElementById(
        "questCompleteOverlay"
    );

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

world.style.backgroundImage =
    `url("../assets/backgrounds/${config.id}.png")`;

game.style.setProperty(
    "--scene-accent",
    config.accent ||
    "#e7c66f"
);

sceneFlavor.textContent =
    config.flavor ||
    "";

const ROLE_LABELS = {
    lyceen_casseur:
        "Lycéen casseur",

    crs:
        "CRS",

    lyceen_pacifiste:
        "Lycéen pacifiste"
};

roleName.textContent =
    ROLE_LABELS[role] ||
    "Manifestant";

objectiveText.textContent =
    config.roleText[role] ||
    "";

const currentSpecial =
    config.specials &&
    config.specials[role]
        ? config.specials[role]
        : null;

if (currentSpecial) {
    specialName.textContent =
        currentSpecial.name;

    specialDescription.textContent =
        currentSpecial.description;
} else {
    specialRow.style.display =
        "none";
}

const sceneConfig =
    EldoriaCharacters.getSceneConfig(
        config.id
    );

EldoriaCharacters.applySprite(
    player,
    EldoriaCharacters.getPlayerSprite()
);

EldoriaCharacters.applySize(
    player,
    sceneConfig.player ||
    {
        width: 82,
        height: 112
    }
);

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
let lastPlayerAction = 0;
let lastAiTick = 0;
let lastFireDamage = 0;
let messageTimer = null;
let questFinishing = false;

let jumping = false;
let jumpStartedAt = 0;
const JUMP_DURATION = 650;
const JUMP_HEIGHT = 30;

let brickCount = 0;
let shieldRaised = false;

let specialReadyAt = 0;
let speedBoostUntil = 0;
let damageReductionUntil = 0;
let damageReductionFactor = 1;
let invincibleUntil = 0;
let fireImmuneUntil = 0;
let aiFrozenUntil = 0;
let batonRangeBoostUntil = 0;
let rapidActionUntil = 0;
let nextLbdBoost = false;
let nextQuestDouble = false;

let questProgress =
    Math.min(
        config.target,
        EldoriaMissions.getProgress(
            config.id,
            role
        )
    );

const keys = {};
const npcs = [];
const brickPickups = [];
const fireHazards = [];

const PLAYER_SPEED = 2.35;

function updateSpecialUi() {
    if (!currentSpecial) {
        return;
    }

    const remaining =
        Math.max(
            0,
            specialReadyAt -
            performance.now()
        );

    if (
        remaining <= 0
    ) {
        specialCooldown.textContent =
            "X";

        specialRow.classList.remove(
            "cooldown"
        );

        specialRow.classList.add(
            "ready"
        );
    } else {
        specialCooldown.textContent =
            (
                remaining /
                1000
            ).toFixed(1) +
            "s";

        specialRow.classList.add(
            "cooldown"
        );

        specialRow.classList.remove(
            "ready"
        );
    }
}

function freezeEnemyAi(
    duration
) {
    aiFrozenUntil =
        Math.max(
            aiFrozenUntil,
            performance.now() +
            duration
        );
}

function useSpecialAbility() {
    if (
        !currentSpecial ||
        questFinishing
    ) {
        return;
    }

    const now =
        performance.now();

    if (
        now <
        specialReadyAt
    ) {
        return;
    }

    specialReadyAt =
        now +
        currentSpecial.cooldown;

    const type =
        currentSpecial.type;

    if (
        type === "adrenaline"
    ) {
        speedBoostUntil =
            now + 4000;

        showMessage(
            "Adrénaline ! Tu cours plus vite."
        );
    }

    if (
        type === "precision_lbd"
    ) {
        nextLbdBoost =
            true;

        showMessage(
            "Visée stable : prochain LBD renforcé."
        );
    }

    if (
        type === "collective_chant"
    ) {
        freezeEnemyAi(
            2200
        );

        addQuestProgress(
            2
        );

        showMessage(
            "Le chant collectif calme la zone."
        );
    }

    if (
        type === "brick_bundle"
    ) {
        brickCount +=
            3;

        updateResourceUi();

        showMessage(
            "+3 briques récupérées."
        );
    }

    if (
        type === "riot_charge"
    ) {
        speedBoostUntil =
            now + 4000;

        batonRangeBoostUntil =
            now + 4000;

        showMessage(
            "Charge anti-émeute !"
        );
    }

    if (
        type === "mediation"
    ) {
        freezeEnemyAi(
            3000
        );

        showMessage(
            "Médiation : les affrontements s'arrêtent brièvement."
        );
    }

    if (
        type === "cover"
    ) {
        damageReductionUntil =
            now + 5000;

        damageReductionFactor =
            0.40;

        showMessage(
            "À couvert !"
        );
    }

    if (
        type === "shield_wall"
    ) {
        damageReductionUntil =
            now + 5000;

        damageReductionFactor =
            0.28;

        showMessage(
            "Mur de boucliers !"
        );
    }

    if (
        type === "safe_shelter"
    ) {
        invincibleUntil =
            now + 3000;

        showMessage(
            "Tu es à l'abri pendant 3 secondes."
        );
    }

    if (
        type === "fire_runner"
    ) {
        fireImmuneUntil =
            now + 5000;

        speedBoostUntil =
            now + 5000;

        showMessage(
            "Course dans les flammes !"
        );
    }

    if (
        type === "thermal_armor"
    ) {
        fireImmuneUntil =
            now + 6000;

        health =
            Math.min(
                100,
                health + 18
            );

        updateHealth();

        showMessage(
            "Protection thermique activée."
        );
    }

    if (
        type === "safe_path"
    ) {
        fireImmuneUntil =
            now + 7000;

        addQuestProgress();

        showMessage(
            "Chemin sûr trouvé."
        );
    }

    if (
        type === "smoke"
    ) {
        freezeEnemyAi(
            3000
        );

        showMessage(
            "Fumigène : les CRS sont désorientés."
        );
    }

    if (
        type === "turtle"
    ) {
        damageReductionUntil =
            now + 4000;

        damageReductionFactor =
            0.22;

        showMessage(
            "Formation tortue !"
        );
    }

    if (
        type === "sit_down"
    ) {
        freezeEnemyAi(
            3000
        );

        addQuestProgress(
            2
        );

        showMessage(
            "Tous assis ! La foule ralentit."
        );
    }

    if (
        type === "zone_double"
    ) {
        if (
            !isPlayerInsideControlZone()
        ) {
            specialReadyAt =
                now;

            showMessage(
                "Entre dans la zone centrale d'abord."
            );

            return;
        }

        nextQuestDouble =
            true;

        showMessage(
            "Prise éclair : prochaine action compte double."
        );
    }

    if (
        type === "hold_zone"
    ) {
        if (
            !isPlayerInsideControlZone()
        ) {
            specialReadyAt =
                now;

            showMessage(
                "Entre dans la zone centrale d'abord."
            );

            return;
        }

        nextQuestDouble =
            true;

        health =
            Math.min(
                100,
                health + 10
            );

        updateHealth();

        showMessage(
            "Maintien de zone activé."
        );
    }

    if (
        type === "rally"
    ) {
        if (
            !isPlayerInsideControlZone()
        ) {
            specialReadyAt =
                now;

            showMessage(
                "Entre dans la zone centrale d'abord."
            );

            return;
        }

        addQuestProgress(
            2
        );

        showMessage(
            "Rassemblement !"
        );
    }

    if (
        type === "last_assault"
    ) {
        speedBoostUntil =
            now + 5000;

        rapidActionUntil =
            now + 5000;

        showMessage(
            "Dernier assaut !"
        );
    }

    if (
        type === "last_line"
    ) {
        health = 100;

        damageReductionUntil =
            now + 6000;

        damageReductionFactor =
            0.30;

        updateHealth();

        showMessage(
            "Dernière ligne !"
        );
    }

    if (
        type === "final_speech"
    ) {
        freezeEnemyAi(
            4000
        );

        addQuestProgress(
            3
        );

        showMessage(
            "Discours final !"
        );
    }

    updateSpecialUi();
}

function showMessage(
    text,
    duration = 1300
) {
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
            duration
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
        Math.round(
            health
        );

    if (
        health <= 0 &&
        !questFinishing
    ) {
        health = 100;

        playerX =
            game.clientWidth *
            currentSpawn.x;

        playerY =
            game.clientHeight *
            currentSpawn.y;

        showMessage(
            "Tu reprends ta place."
        );
    }
}

function updateQuestUi() {
    questProgress =
        Math.max(
            0,
            Math.min(
                config.target,
                questProgress
            )
        );

    questValue.textContent =
        questProgress +
        " / " +
        config.target;

    questFill.style.width =
        (
            questProgress /
            config.target *
            100
        ) + "%";

    questRow.classList.toggle(
        "completed",
        questProgress >=
            config.target
    );
}

function addQuestProgress(
    amount = 1
) {
    if (
        questFinishing ||
        questProgress >=
            config.target
    ) {
        return;
    }

    if (
        nextQuestDouble
    ) {
        amount *=
            2;

        nextQuestDouble =
            false;
    }

    questProgress +=
        amount;

    EldoriaMissions.setProgress(
        config.id,
        role,
        questProgress
    );

    updateQuestUi();

    if (
        questProgress >=
        config.target
    ) {
        finishQuest();
    }
}

function finishQuest() {
    if (questFinishing) {
        return;
    }

    questFinishing = true;

    EldoriaMissions.markComplete(
        config.id,
        role
    );

    questCompleteOverlay.classList.add(
        "visible"
    );

    setTimeout(
        () => {
            window.location.href =
                "scene01.html";
        },
        1600
    );
}

function updateResourceUi() {
    if (
        config.bricks &&
        role ===
            "lyceen_casseur"
    ) {
        resourceRow.classList.add(
            "visible"
        );

        resourceRow.textContent =
            "Briques ramassées : " +
            brickCount;

        return;
    }

    resourceRow.classList.remove(
        "visible"
    );
}

function isJumpDodging() {
    if (!jumping) {
        return false;
    }

    const elapsed =
        performance.now() -
        jumpStartedAt;

    const progress =
        elapsed /
        JUMP_DURATION;

    return (
        progress >= 0.18 &&
        progress <= 0.82
    );
}

function startJump() {
    if (
        jumping ||
        questFinishing
    ) {
        return;
    }

    jumping = true;

    jumpStartedAt =
        performance.now();

    player.classList.add(
        "jumping"
    );
}

function getJumpOffset() {
    if (!jumping) {
        return 0;
    }

    const elapsed =
        performance.now() -
        jumpStartedAt;

    const progress =
        elapsed /
        JUMP_DURATION;

    if (
        progress >= 1
    ) {
        jumping = false;

        player.classList.remove(
            "jumping"
        );

        return 0;
    }

    return Math.sin(
        progress *
        Math.PI
    ) *
    JUMP_HEIGHT;
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
        game.clientHeight *
        0.18 +
        halfHeight;

    let maxY =
        game.clientHeight *
        0.75 -
        halfHeight;

    if (
        role === "crs"
    ) {
        minX =
            game.clientWidth *
            0.50;

        minY =
            game.clientHeight *
            0.39 +
            halfHeight;
    }

    if (
        role ===
        "lyceen_casseur"
    ) {
        maxX =
            game.clientWidth *
            0.50;

        minY =
            game.clientHeight *
            0.39 +
            halfHeight;
    }

    if (
        role ===
        "lyceen_pacifiste"
    ) {
        minX =
            game.clientWidth *
            0.30;

        maxX =
            game.clientWidth *
            0.70;

        minY =
            game.clientHeight *
            0.17 +
            halfHeight;

        if (
            config.id === "scene08"
        ) {
            maxY =
                game.clientHeight *
                0.72 -
                halfHeight;
        } else {
            maxY =
                game.clientHeight *
                0.39 -
                halfHeight;
        }
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
    const jumpOffset =
        getJumpOffset();

    player.style.left =
        playerX + "px";

    player.style.top =
        (
            playerY -
            jumpOffset
        ) + "px";
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
    xRatio,
    yRatio
) {
    const npcGender =
        Math.random() <
        0.5
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
            xRatio,

        y:
            game.clientHeight *
            yRatio,

        hp:
            100,

        down:
            false,

        nextMove:
            performance.now() +
            300 +
            Math.random() *
            800,

        nextAction:
            performance.now() +
            config.botActionMin +
            Math.random() *
            (
                config.botActionMax -
                config.botActionMin
            )
    };

    npcs.push(
        npc
    );

    drawNpc(
        npc
    );

    return npc;
}

function drawNpc(
    npc
) {
    npc.element.style.left =
        npc.x + "px";

    npc.element.style.top =
        npc.y + "px";
}

function populateNpcs() {
    const extra =
        config.finalWave
            ? 2
            : 0;

    const layout = [
        ["pacifiste", 0.39, 0.23],
        ["pacifiste", 0.46, 0.27],
        ["pacifiste", 0.54, 0.23],
        ["pacifiste", 0.61, 0.30],

        ["casseur", 0.12, 0.48],
        ["casseur", 0.20, 0.58],
        ["casseur", 0.29, 0.67],
        ["casseur", 0.39, 0.52],

        ["crs", 0.61, 0.52],
        ["crs", 0.70, 0.66],
        ["crs", 0.79, 0.56],
        ["crs", 0.89, 0.48]
    ];

    for (
        let i = 0;
        i < extra;
        i++
    ) {
        layout.push(
            [
                "casseur",
                0.15 +
                    Math.random() *
                    0.25,
                0.46 +
                    Math.random() *
                    0.25
            ]
        );

        layout.push(
            [
                "crs",
                0.60 +
                    Math.random() *
                    0.28,
                0.46 +
                    Math.random() *
                    0.25
            ]
        );
    }

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

function constrainNpcToRoleZone(
    npc
) {
    if (
        npc.role ===
        "pacifiste"
    ) {
        npc.x =
            Math.max(
                game.clientWidth *
                0.30,
                Math.min(
                    game.clientWidth *
                    0.70,
                    npc.x
                )
            );

        npc.y =
            Math.max(
                game.clientHeight *
                0.17,
                Math.min(
                    game.clientHeight *
                    0.38,
                    npc.y
                )
            );

        return;
    }

    if (
        npc.role ===
        "casseur"
    ) {
        npc.x =
            Math.max(
                game.clientWidth *
                0.05,
                Math.min(
                    game.clientWidth *
                    0.49,
                    npc.x
                )
            );

        npc.y =
            Math.max(
                game.clientHeight *
                0.39,
                Math.min(
                    game.clientHeight *
                    0.75,
                    npc.y
                )
            );

        return;
    }

    npc.x =
        Math.max(
            game.clientWidth *
            0.51,
            Math.min(
                game.clientWidth *
                0.95,
                npc.x
            )
        );

    npc.y =
        Math.max(
            game.clientHeight *
            0.39,
            Math.min(
                game.clientHeight *
                0.75,
                npc.y
            )
        );
}

function moveNpc(
    npc
) {
    if (
        npc.down
    ) {
        return;
    }

    const enemyOfPlayer =
        (
            role === "crs" &&
            npc.role ===
                "casseur"
        ) ||
        (
            role ===
                "lyceen_casseur" &&
            npc.role ===
                "crs"
        );

    const aggressive =
        enemyOfPlayer &&
        (
            config.aggressiveRush ||
            config.crsCharge ||
            distanceToPlayer(
                npc
            ) <
                config.botAggroRange
        );

    if (aggressive) {
        const dx =
            playerX -
            npc.x;

        const dy =
            playerY -
            npc.y;

        const length =
            Math.max(
                1,
                Math.hypot(
                    dx,
                    dy
                )
            );

        const step =
            32 *
            config.botMoveSpeed;

        npc.x +=
            dx /
            length *
            step;

        npc.y +=
            dy /
            length *
            step;
    } else {
        npc.x +=
            (
                Math.random() -
                0.5
            ) *
            58 *
            config.botMoveSpeed;

        npc.y +=
            (
                Math.random() -
                0.5
            ) *
            42 *
            config.botMoveSpeed;
    }

    constrainNpcToRoleZone(
        npc
    );

    drawNpc(
        npc
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
        return false;
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
                respawnNpc(
                    npc
                );
            },
            3000
        );
    }

    return true;
}

function respawnNpc(
    npc
) {
    npc.hp = 100;
    npc.down = false;

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
        npc.role ===
        "casseur"
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
        npc.role ===
        "pacifiste"
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

function flashPlayerHit() {
    player.classList.remove(
        "playerHitFlash"
    );

    void player.offsetWidth;

    player.classList.add(
        "playerHitFlash"
    );
}

function botProjectileToPlayer(
    npc,
    shotType,
    damage
) {
    const projectile =
        document.createElement(
            "div"
        );

    projectile.className =
        "botProjectile " +
        shotType;

    projectile.style.left =
        npc.x + "px";

    projectile.style.top =
        npc.y + "px";

    effectsLayer.appendChild(
        projectile
    );

    requestAnimationFrame(
        () => {
            projectile.style.left =
                playerX + "px";

            projectile.style.top =
                playerY + "px";

            projectile.style.opacity =
                "0.1";
        }
    );

    setTimeout(
        () => {
            projectile.remove();

            if (
                shotType === "lbd" &&
                isJumpDodging()
            ) {
                showMessage(
                    "Esquive ! Tu as sauté au bon moment."
                );

                return;
            }

            if (
                shotType === "brick" &&
                isJumpDodging()
            ) {
                showMessage(
                    "Esquive !"
                );

                return;
            }

            if (
                shotType === "mortar" &&
                isJumpDodging()
            ) {
                damage =
                    Math.ceil(
                        damage *
                        0.45
                    );

                showMessage(
                    "Le saut réduit l'explosion !"
                );
            }

            if (
                performance.now() <
                invincibleUntil
            ) {
                showMessage(
                    "Aucun dégât !"
                );

                return;
            }

            if (
                shieldRaised &&
                role === "crs"
            ) {
                damage =
                    Math.ceil(
                        damage *
                        0.30
                    );
            }

            if (
                performance.now() <
                damageReductionUntil
            ) {
                damage =
                    Math.ceil(
                        damage *
                        damageReductionFactor
                    );
            }

            health -=
                damage;

            flashPlayerHit();

            updateHealth();
        },
        310
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

    if (
        config.controlZone &&
        !isPlayerInsideControlZone()
    ) {
        showMessage(
            "Entre dans la zone centrale pour que l'action compte."
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
        100
    );

    addQuestProgress();
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

    if (
        config.controlZone &&
        !isPlayerInsideControlZone()
    ) {
        showMessage(
            "Entre dans la zone centrale pour que l'action compte."
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

    const lbdDamage =
        nextLbdBoost
            ? 92
            : 70;

    nextLbdBoost =
        false;

    damageNpc(
        target,
        lbdDamage
    );

    addQuestProgress();
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
        ) >
        (
            performance.now() <
            batonRangeBoostUntil
                ? 230
                : 150
        )
    ) {
        showMessage(
            "Aucun casseur à portée."
        );

        return;
    }

    damageNpc(
        target,
        38
    );

    if (
        config.tactic ===
        "bricks_charge"
    ) {
        addQuestProgress();
    }
}

function useMegaphone() {
    if (
        !EldoriaInventory.has(
            "megaphone",
            1
        )
    ) {
        showMessage(
            "Tu n'as pas de mégaphone."
        );

        return;
    }

    if (
        config.controlZone &&
        !isPlayerInsideControlZone()
    ) {
        showMessage(
            "Reste dans la zone centrale."
        );

        return;
    }

    addQuestProgress();

    showMessage(
        "Tu utilises ton mégaphone."
    );
}

function throwBrick() {
    if (
        brickCount <= 0
    ) {
        showMessage(
            "Ramasse une brique avec R."
        );

        return;
    }

    const target =
        getNearestNpc(
            "crs"
        );

    if (!target) {
        return;
    }

    brickCount--;

    updateResourceUi();

    createImpact(
        target.x,
        target.y
    );

    damageNpc(
        target,
        55
    );

    addQuestProgress();
}

function primaryAction() {
    const now =
        performance.now();

    const actionCooldown =
        now <
        rapidActionUntil
            ? 180
            : 430;

    if (
        questFinishing ||
        now -
        lastPlayerAction <
        actionCooldown
    ) {
        return;
    }

    lastPlayerAction =
        now;

    if (
        role ===
        "lyceen_pacifiste"
    ) {
        useMegaphone();
        return;
    }

    if (
        role ===
        "lyceen_casseur"
    ) {
        if (
            config.bricks
        ) {
            throwBrick();
        } else {
            useMortar();
        }

        return;
    }

    if (
        role === "crs"
    ) {
        if (
            config.tactic ===
            "bricks_charge"
        ) {
            useBaton();
        } else {
            useLbd();
        }
    }
}

function createBrickPickups() {
    if (!config.bricks) {
        return;
    }

    const points = [
        [0.18, 0.47],
        [0.25, 0.59],
        [0.33, 0.69],
        [0.41, 0.48],
        [0.29, 0.43],
        [0.14, 0.69]
    ];

    points.forEach(
        (
            [
                xRatio,
                yRatio
            ],
            index
        ) => {
            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "brickPickup";

            const pickup = {
                element,
                x:
                    game.clientWidth *
                    xRatio,
                y:
                    game.clientHeight *
                    yRatio,
                active:
                    true,
                index
            };

            element.style.left =
                pickup.x + "px";

            element.style.top =
                pickup.y + "px";

            pickupLayer.appendChild(
                element
            );

            brickPickups.push(
                pickup
            );
        }
    );
}

function pickupNearestBrick() {
    if (
        !config.bricks ||
        role !==
            "lyceen_casseur"
    ) {
        return;
    }

    const active =
        brickPickups
            .filter(
                (pickup) =>
                    pickup.active
            )
            .sort(
                (a, b) =>
                    Math.hypot(
                        a.x -
                        playerX,
                        a.y -
                        playerY
                    ) -
                    Math.hypot(
                        b.x -
                        playerX,
                        b.y -
                        playerY
                    )
            );

    if (
        active.length === 0
    ) {
        showMessage(
            "Il n'y a plus de briques ici."
        );

        return;
    }

    const pickup =
        active[0];

    const distance =
        Math.hypot(
            pickup.x -
            playerX,
            pickup.y -
            playerY
        );

    if (
        distance > 105
    ) {
        showMessage(
            "Approche-toi d'une brique."
        );

        return;
    }

    pickup.active =
        false;

    pickup.element.style.display =
        "none";

    brickCount++;

    updateResourceUi();

    setTimeout(
        () => {
            pickup.active =
                true;

            pickup.element.style.display =
                "block";
        },
        5500
    );
}

function createBarricades() {
    if (!config.barricades) {
        return;
    }

    [
        [0.42, 0.52],
        [0.58, 0.63],
        [0.50, 0.70]
    ].forEach(
        (
            [
                x,
                y
            ]
        ) => {
            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "barricade";

            element.style.left =
                (
                    game.clientWidth *
                    x
                ) + "px";

            element.style.top =
                (
                    game.clientHeight *
                    y
                ) + "px";

            hazardLayer.appendChild(
                element
            );
        }
    );
}

let controlZone = null;

function createControlZone() {
    if (!config.controlZone) {
        return;
    }

    const element =
        document.createElement(
            "div"
        );

    element.className =
        "controlZone";

    controlZone = {
        element,
        x:
            game.clientWidth *
            0.50,
        y:
            game.clientHeight *
            0.56,
        radius:
            95
    };

    element.style.left =
        controlZone.x + "px";

    element.style.top =
        controlZone.y + "px";

    hazardLayer.appendChild(
        element
    );
}

function isPlayerInsideControlZone() {
    if (!controlZone) {
        return true;
    }

    return (
        Math.hypot(
            playerX -
            controlZone.x,
            playerY -
            controlZone.y
        ) <=
        controlZone.radius
    );
}

function createFireHazards() {
    if (!config.fireHazards) {
        return;
    }

    [
        [0.36, 0.52],
        [0.47, 0.67],
        [0.61, 0.54],
        [0.72, 0.69]
    ].forEach(
        (
            [
                xRatio,
                yRatio
            ]
        ) => {
            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "fireHazard";

            const hazard = {
                element,
                x:
                    game.clientWidth *
                    xRatio,
                y:
                    game.clientHeight *
                    yRatio,
                radius:
                    47
            };

            element.style.left =
                hazard.x + "px";

            element.style.top =
                hazard.y + "px";

            hazardLayer.appendChild(
                element
            );

            fireHazards.push(
                hazard
            );
        }
    );
}

function updateFireDamage() {
    if (
        fireHazards.length === 0 ||
        isJumpDodging() ||
        performance.now() <
        fireImmuneUntil
    ) {
        return;
    }

    const now =
        performance.now();

    if (
        now -
        lastFireDamage <
        700
    ) {
        return;
    }

    const touching =
        fireHazards.some(
            (hazard) =>
                Math.hypot(
                    playerX -
                    hazard.x,
                    playerY -
                    hazard.y
                ) <
                hazard.radius
        );

    if (touching) {
        lastFireDamage =
            now;

        health -=
            7;

        flashPlayerHit();

        updateHealth();
    }
}

function enemyCanAttackPlayer(
    npc
) {
    if (
        npc.down ||
        role ===
            "lyceen_pacifiste"
    ) {
        return false;
    }

    if (
        role === "crs"
    ) {
        return (
            npc.role ===
            "casseur"
        );
    }

    return (
        role ===
            "lyceen_casseur" &&
        npc.role ===
            "crs"
    );
}

function aiAttack(
    npc
) {
    if (
        !enemyCanAttackPlayer(
            npc
        )
    ) {
        return;
    }

    const distance =
        distanceToPlayer(
            npc
        );

    if (
        distance >
        config.botAggroRange
    ) {
        return;
    }

    if (
        npc.role === "crs"
    ) {
        if (
            config.crsCharge &&
            distance < 145
        ) {
            if (
                performance.now() <
                invincibleUntil
            ) {
                showMessage(
                    "Aucun dégât !"
                );

                return;
            }

            let meleeDamage =
                18;

            if (
                performance.now() <
                damageReductionUntil
            ) {
                meleeDamage =
                    Math.ceil(
                        meleeDamage *
                        damageReductionFactor
                    );
            }

            health -=
                meleeDamage;

            flashPlayerHit();

            updateHealth();

            showMessage(
                "Un CRS te frappe à la matraque !"
            );

            return;
        }

        botProjectileToPlayer(
            npc,
            "lbd",
            26
        );

        return;
    }

    botProjectileToPlayer(
        npc,
        "mortar",
        38
    );
}

function updateAi(
    now
) {
    if (
        now <
        aiFrozenUntil
    ) {
        return;
    }

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
                moveNpc(
                    npc
                );

                npc.nextMove =
                    now +
                    420 +
                    Math.random() *
                    650;
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
                    config.botActionMin +
                    Math.random() *
                    (
                        config.botActionMax -
                        config.botActionMin
                    );
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

        dx /=
            length;

        dy /=
            length;

        let speed =
            PLAYER_SPEED;

        if (
            performance.now() <
            speedBoostUntil
        ) {
            speed *=
                1.65;
        }

        if (
            role === "crs" &&
            config.crsCharge &&
            keys["shift"]
        ) {
            speed *=
                2.05;
        }

        playerX +=
            dx *
            speed;

        playerY +=
            dy *
            speed;
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

    if (
        !paused &&
        !questFinishing
    ) {
        updatePlayerMovement();

        updateAi(
            now
        );

        updateFireDamage();
    } else {
        drawPlayer();
    }

    updateSpecialUi();

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
            event.code === "Space"
        ) {
            event.preventDefault();

            startJump();
        }

        if (
            key === "x"
        ) {
            useSpecialAbility();
        }

        if (
            key === "r"
        ) {
            pickupNearestBrick();
        }

        if (
            key === "f" &&
            role === "crs"
        ) {
            useBaton();
        }

        if (
            key === "e" &&
            !questFinishing
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
            questFinishing ||
            (
                window.EldoriaPauseMenu &&
                EldoriaPauseMenu.isOpen()
            )
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

        if (
            event.button === 2 &&
            role === "crs"
        ) {
            shieldRaised =
                true;

            showMessage(
                "Bouclier levé."
            );
        }
    }
);

document.addEventListener(
    "mouseup",
    (event) => {
        if (
            event.button === 2
        ) {
            shieldRaised =
                false;
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
        if (!questFinishing) {
            window.location.href =
                "scene01.html";
        }
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

        shieldRaised =
            false;
    }
);

window.addEventListener(
    "resize",
    () => {
        playerX =
            game.clientWidth *
            currentSpawn.x;

        playerY =
            game.clientHeight *
            currentSpawn.y;

        keepPlayerInside();

        drawPlayer();
    }
);

if (
    EldoriaMissions.isComplete(
        config.id
    )
) {
    showMessage(
        "Cette mission est déjà validée.",
        900
    );

    setTimeout(
        () => {
            window.location.href =
                "scene01.html";
        },
        1100
    );
} else {
    populateNpcs();

    createBrickPickups();

    createBarricades();

    createFireHazards();

    createControlZone();

    updateResourceUi();

    updateHealth();

    updateQuestUi();

    updateSpecialUi();

    keepPlayerInside();

    drawPlayer();

    requestAnimationFrame(
        update
    );
}
