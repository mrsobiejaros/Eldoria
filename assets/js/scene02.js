const game =
    document.getElementById("game");

const player =
    document.getElementById("player");

const policier =
    document.getElementById("policier");

const interactionPrompt =
    document.getElementById(
        "interactionPrompt"
    );

const interactionText =
    document.getElementById(
        "interactionText"
    );

const dialogueOverlay =
    document.getElementById(
        "dialogueOverlay"
    );

const dialogueName =
    document.getElementById(
        "dialogueName"
    );

const dialogueText =
    document.getElementById(
        "dialogueText"
    );

const dialogueChoices =
    document.getElementById(
        "dialogueChoices"
    );

const choiceStudent =
    document.getElementById(
        "choiceStudent"
    );

const choiceCRS =
    document.getElementById(
        "choiceCRS"
    );

EldoriaCharacters.applySceneCharacters(
    "scene02"
);

setTimeout(
    () => {
        applyFinalEndingNpc();
    },
    0
);

window.addEventListener(
    "eldoriaCharacterChanged",
    () => {
        EldoriaCharacters.applySceneCharacters(
            "scene02"
        );

        applyFinalEndingNpc();
    }
);

const SPEED = 1.0;
const JUMP_HEIGHT = 22;
const JUMP_SPEED = 0.11;
const TALK_DISTANCE = 85;
const EXIT_DISTANCE = 75;

const SPAWN_X_PERCENT = 0.50;
const SPAWN_Y_PERCENT = 0.30;

const keys = {};

let playerX = 0;
let playerY = 0;
let jumping = false;
let jumpProgress = 0;
let jumpOffset = 0;
let collisionReady = false;
let policemanNearby = false;
let exitNearby = false;
let dialogueOpen = false;
let finalEndingAvailable =
    Boolean(
        window.EldoriaMissions &&
        EldoriaMissions.allComplete() &&
        !EldoriaMissions.isEndingSeen()
    );

let policemanConversationDone =
    Boolean(
        EldoriaCharacters.getRole()
    ) &&
    !finalEndingAvailable;

const collisionImage = new Image();
const collisionCanvas =
    document.createElement("canvas");

const collisionContext =
    collisionCanvas.getContext(
        "2d",
        {
            willReadFrequently: true
        }
    );

function setSpawnPosition() {
    playerX =
        game.clientWidth *
        SPAWN_X_PERCENT;

    playerY =
        game.clientHeight *
        SPAWN_Y_PERCENT;

    player.style.left =
        playerX + "px";

    player.style.top =
        playerY + "px";
}

collisionImage.onload = () => {
    collisionCanvas.width =
        collisionImage.naturalWidth;

    collisionCanvas.height =
        collisionImage.naturalHeight;

    collisionContext.drawImage(
        collisionImage,
        0,
        0
    );

    collisionReady = true;
    setSpawnPosition();
};

collisionImage.onerror = () => {
    console.error(
        "Impossible de charger scene02_collision.png"
    );

    setSpawnPosition();
};

collisionImage.src =
    "../assets/js/collisions/scene02_collision.png";

function getBackgroundTransform() {
    const imageWidth =
        collisionCanvas.width;

    const imageHeight =
        collisionCanvas.height;

    const gameWidth =
        game.clientWidth;

    const gameHeight =
        game.clientHeight;

    const scale =
        Math.min(
            gameWidth / imageWidth,
            gameHeight / imageHeight
        );

    const renderedWidth =
        imageWidth * scale;

    const renderedHeight =
        imageHeight * scale;

    return {
        scale,
        renderedWidth,
        renderedHeight,
        offsetX:
            (gameWidth - renderedWidth) / 2,
        offsetY:
            (gameHeight - renderedHeight) / 2
    };
}

function screenToMap(
    screenX,
    screenY
) {
    const transform =
        getBackgroundTransform();

    return {
        x:
            Math.floor(
                (screenX - transform.offsetX) /
                transform.scale
            ),
        y:
            Math.floor(
                (screenY - transform.offsetY) /
                transform.scale
            )
    };
}

function isBlocked(
    mapX,
    mapY
) {
    if (!collisionReady) {
        return false;
    }

    if (
        mapX < 0 ||
        mapY < 0 ||
        mapX >= collisionCanvas.width ||
        mapY >= collisionCanvas.height
    ) {
        return true;
    }

    const pixel =
        collisionContext.getImageData(
            mapX,
            mapY,
            1,
            1
        ).data;

    return (
        pixel[0] < 100 &&
        pixel[1] < 100 &&
        pixel[2] < 100
    );
}

function canWalk(
    screenX,
    screenY
) {
    if (!collisionReady) {
        return true;
    }

    const transform =
        getBackgroundTransform();

    const feetY =
        screenY +
        45 * transform.scale;

    const points = [
        { x: screenX, y: feetY },
        { x: screenX - 7, y: feetY },
        { x: screenX + 7, y: feetY },
        { x: screenX, y: feetY + 3 }
    ];

    return points.every(
        point => {
            const mapPoint =
                screenToMap(
                    point.x,
                    point.y
                );

            return !isBlocked(
                mapPoint.x,
                mapPoint.y
            );
        }
    );
}

function getPolicemanPosition() {
    const policemanRect =
        policier.getBoundingClientRect();

    const gameRect =
        game.getBoundingClientRect();

    return {
        x:
            policemanRect.left -
            gameRect.left +
            policemanRect.width / 2,
        y:
            policemanRect.top -
            gameRect.top +
            policemanRect.height * 0.75
    };
}

function getFinalEndingData() {
    const currentRole =
        EldoriaCharacters.getRole();

    if (
        currentRole ===
        "lyceen_casseur"
    ) {
        return {
            name:
                "Casseur",

            text:
                "Bravo mon gars la revolution a marché on a renverser le gouvernement on a gagner",

            sprite:
                "../assets/characters/player_men_cagoule.png"
        };
    }

    if (
        currentRole === "crs"
    ) {
        return {
            name:
                "Policier",

            text:
                "Bravo tu les as bien eu ces gosses bravo la revolte est maté",

            sprite:
                "../assets/characters/policier.png"
        };
    }

    return {
        name:
            "Jeune pacifiste",

        text:
            "Bravo tu as reussi a obtenir des droits en france attention plus tard ca va peut etre changer on ne sais jamais le gouvernement est etrange.",

        sprite:
            "../assets/characters/player_men.png"
    };
}

function applyFinalEndingNpc() {
    if (!finalEndingAvailable) {
        return;
    }

    const ending =
        getFinalEndingData();

    EldoriaCharacters.applySprite(
        policier,
        ending.sprite
    );
}

function openFinalEndingDialogue() {
    const ending =
        getFinalEndingData();

    dialogueOpen = true;

    dialogueName.textContent =
        ending.name;

    dialogueText.textContent =
        ending.text;

    dialogueChoices.innerHTML =
        "";

    const continueButton =
        document.createElement(
            "button"
        );

    continueButton.className =
        "dialogueChoice";

    continueButton.textContent =
        "Continuer";

    continueButton.addEventListener(
        "click",
        () => {
            EldoriaMissions.markEndingSeen();

            finalEndingAvailable =
                false;

            policemanConversationDone =
                true;

            dialogueOpen =
                false;

            dialogueOverlay.classList.remove(
                "visible"
            );

            interactionPrompt.classList.remove(
                "visible"
            );
        }
    );

    dialogueChoices.appendChild(
        continueButton
    );

    interactionPrompt.classList.remove(
        "visible"
    );

    dialogueOverlay.classList.add(
        "visible"
    );

    if (
        document.pointerLockElement ===
        game
    ) {
        if (
            window.EldoriaPauseMenu
        ) {
            EldoriaPauseMenu.unlockPointerWithoutPause();
        } else {
            document.exitPointerLock();
        }
    }
}

function updateInteractions() {
    finalEndingAvailable =
        Boolean(
            window.EldoriaMissions &&
            EldoriaMissions.allComplete() &&
            !EldoriaMissions.isEndingSeen()
        );

    policemanConversationDone =
        Boolean(
            EldoriaCharacters.getRole()
        ) &&
        !finalEndingAvailable;

    if (dialogueOpen) {
        policemanNearby = false;
        exitNearby = false;
        interactionPrompt.classList.remove(
            "visible"
        );
        return;
    }

    const playerFeetX = playerX;
    const playerFeetY =
        playerY +
        player.offsetHeight * 0.4;

    policemanNearby = false;
    exitNearby = false;

    if (!policemanConversationDone) {
        const policemanPosition =
            getPolicemanPosition();

        const distance =
            Math.hypot(
                playerFeetX -
                    policemanPosition.x,
                playerFeetY -
                    policemanPosition.y
            );

        policemanNearby =
            distance <= TALK_DISTANCE;
    }

    const exitX =
        game.clientWidth *
        SPAWN_X_PERCENT;

    const exitY =
        game.clientHeight *
        SPAWN_Y_PERCENT +
        player.offsetHeight * 0.4;

    exitNearby =
        Math.hypot(
            playerFeetX - exitX,
            playerFeetY - exitY
        ) <= EXIT_DISTANCE;

    if (policemanNearby) {
        interactionText.textContent =
            "Parler";

        interactionPrompt.classList.add(
            "visible"
        );
        return;
    }

    if (exitNearby) {
        interactionText.textContent =
            "Sortir";

        interactionPrompt.classList.add(
            "visible"
        );
        return;
    }

    interactionPrompt.classList.remove(
        "visible"
    );
}

function openDialogue() {
    if (
        finalEndingAvailable &&
        !dialogueOpen
    ) {
        openFinalEndingDialogue();
        return;
    }

    if (
        policemanConversationDone ||
        dialogueOpen
    ) {
        return;
    }

    dialogueOpen = true;

    interactionPrompt.classList.remove(
        "visible"
    );

    dialogueOverlay.classList.add(
        "visible"
    );

    if (
        document.pointerLockElement ===
        game
    ) {
        if (
            window.EldoriaPauseMenu
        ) {
            EldoriaPauseMenu.unlockPointerWithoutPause();
        } else {
            document.exitPointerLock();
        }
    }
}

function finishConversation() {
    policemanConversationDone = true;
    dialogueOpen = false;
    policemanNearby = false;

    dialogueOverlay.classList.remove(
        "visible"
    );

    interactionPrompt.classList.remove(
        "visible"
    );
}

function validateFinalChoice(choice) {
    const existingChoice =
        EldoriaCharacters.getRole();

    if (
        existingChoice &&
        existingChoice !== choice
    ) {
        finishConversation();
        return;
    }

    if (!existingChoice) {
        EldoriaCharacters.setRole(
            choice
        );
    }

    if (
        choice === "lyceen_casseur"
    ) {
        EldoriaInventory.addOnce(
            "mortier",
            1
        );
    }

    if (
        choice === "lyceen_pacifiste"
    ) {
        EldoriaInventory.addOnce(
            "megaphone",
            1
        );
    }

    if (choice === "crs") {
        EldoriaInventory.addOnce(
            "matraque",
            1
        );

        EldoriaInventory.addOnce(
            "bouclier",
            1
        );

        EldoriaInventory.addOnce(
            "grenade_lbd",
            1
        );
    }

    EldoriaCharacters.applySceneCharacters(
        "scene02"
    );

    finishConversation();
}

function showStudentChoice() {
    dialogueText.textContent =
        "Tu veux être un casseur ou un pacifiste ?";

    dialogueChoices.innerHTML = "";

    const choiceBreaker =
        document.createElement(
            "button"
        );

    choiceBreaker.className =
        "dialogueChoice";

    choiceBreaker.textContent =
        "Je veux être un casseur";

    const choicePacifist =
        document.createElement(
            "button"
        );

    choicePacifist.className =
        "dialogueChoice";

    choicePacifist.textContent =
        "Je veux être pacifiste";

    choiceBreaker.addEventListener(
        "click",
        () => {
            validateFinalChoice(
                "lyceen_casseur"
            );
        }
    );

    choicePacifist.addEventListener(
        "click",
        () => {
            validateFinalChoice(
                "lyceen_pacifiste"
            );
        }
    );

    dialogueChoices.append(
        choiceBreaker,
        choicePacifist
    );
}

choiceStudent.addEventListener(
    "click",
    showStudentChoice
);

choiceCRS.addEventListener(
    "click",
    () => {
        validateFinalChoice("crs");
    }
);

function keepInsideMap() {
    if (!collisionReady) {
        return;
    }

    const transform =
        getBackgroundTransform();

    const halfWidth =
        player.offsetWidth / 2;

    const halfHeight =
        player.offsetHeight / 2;

    playerX = Math.max(
        transform.offsetX + halfWidth,
        Math.min(
            transform.offsetX +
                transform.renderedWidth -
                halfWidth,
            playerX
        )
    );

    playerY = Math.max(
        transform.offsetY + halfHeight,
        Math.min(
            transform.offsetY +
                transform.renderedHeight -
                halfHeight,
            playerY
        )
    );
}

function updateJump() {
    if (!jumping) {
        jumpOffset = 0;
        return;
    }

    jumpProgress += JUMP_SPEED;

    jumpOffset =
        Math.sin(jumpProgress) *
        JUMP_HEIGHT;

    if (
        jumpProgress >= Math.PI
    ) {
        jumping = false;
        jumpProgress = 0;
        jumpOffset = 0;
    }
}

function isGamePaused() {
    return Boolean(
        window.EldoriaPauseMenu &&
        EldoriaPauseMenu.isOpen()
    );
}

document.addEventListener(
    "keydown",
    event => {
        const key =
            event.key.toLowerCase();

        keys[key] = true;

        if (
            event.code === "Space" &&
            !jumping &&
            !dialogueOpen &&
            !isGamePaused()
        ) {
            event.preventDefault();
            jumping = true;
            jumpProgress = 0;
        }

        if (
            key === "e" &&
            !event.repeat &&
            !dialogueOpen &&
            !isGamePaused()
        ) {
            if (policemanNearby) {
                openDialogue();
                return;
            }

            if (exitNearby) {
                window.location.href =
                    "scene01.html";
            }
        }
    }
);

document.addEventListener(
    "keyup",
    event => {
        keys[
            event.key.toLowerCase()
        ] = false;
    }
);

window.addEventListener(
    "blur",
    () => {
        for (
            const key in keys
        ) {
            keys[key] = false;
        }
    }
);

function update() {
    let dx = 0;
    let dy = 0;

    if (
        !dialogueOpen &&
        !isGamePaused()
    ) {
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
    }

    if (
        dx !== 0 ||
        dy !== 0
    ) {
        const length =
            Math.hypot(dx, dy);

        dx =
            dx / length * SPEED;

        dy =
            dy / length * SPEED;
    }

    if (dx !== 0) {
        const nextX =
            playerX + dx;

        if (
            canWalk(
                nextX,
                playerY
            )
        ) {
            playerX = nextX;
        }
    }

    if (dy !== 0) {
        const nextY =
            playerY + dy;

        if (
            canWalk(
                playerX,
                nextY
            )
        ) {
            playerY = nextY;
        }
    }

    keepInsideMap();
    updateJump();
    updateInteractions();

    player.style.left =
        playerX + "px";

    player.style.top =
        (playerY - jumpOffset) +
        "px";

    requestAnimationFrame(update);
}

game.addEventListener(
    "click",
    event => {
        if (
            dialogueOpen ||
            isGamePaused() ||
            event.target.closest(
                "#dialogueOverlay"
            ) ||
            event.target.closest(
                "#inventoryBar"
            )
        ) {
            return;
        }

        if (
            document.pointerLockElement !==
            game
        ) {
            game.requestPointerLock();
        }
    }
);

document.addEventListener(
    "pointerlockchange",
    () => {
        game.classList.toggle(
            "mouse-locked",
            document.pointerLockElement ===
                game
        );
    }
);

window.addEventListener(
    "resize",
    setSpawnPosition
);

window.addEventListener(
    "load",
    () => {
        requestAnimationFrame(
            setSpawnPosition
        );
    }
);

setSpawnPosition();
update();
