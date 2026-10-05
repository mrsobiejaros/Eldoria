const game =
    document.getElementById("game");

const player =
    document.getElementById("player");

const policier =
    document.getElementById("policier");

const interactionPrompt =
    document.getElementById("interactionPrompt");

const dialogueOverlay =
    document.getElementById("dialogueOverlay");

const choiceStudent =
    document.getElementById("choiceStudent");

const choiceCRS =
    document.getElementById("choiceCRS");

const dialogueText =
    document.getElementById("dialogueText");

const dialogueChoices =
    document.getElementById("dialogueChoices");

const inventorySlots =
    document.querySelectorAll(
        ".inventorySlot"
    );

const SPEED = 1.0;
const JUMP_HEIGHT = 22;
const JUMP_SPEED = 0.11;
const TALK_DISTANCE = 85;
const EXIT_DISTANCE = 75;

const SPAWN_X_PERCENT = 0.50;
const SPAWN_Y_PERCENT = 0.72;

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
let policemanConversationDone =
    Boolean(
        EldoriaProgress.getPolicemanChoice()
    );

let selectedInventorySlot = 0;

const inventoryIcons = {
    mortier: "../assets/items/mortier.png",
    megaphone: "../assets/items/megaphone.png",
    matraque: "../assets/items/matraque.png",
    bouclier: "../assets/items/bouclier.png",
    grenade_lbd: "../assets/items/grenade_lbd.png"
};

const collisionImage =
    new Image();

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

document.addEventListener(
    "keydown",
    (event) => {

        const key =
            event.key.toLowerCase();

        keys[key] = true;

        if (
            key >= "1" &&
            key <= "9"
        ) {
            selectInventorySlot(
                Number(key) - 1
            );
        }

        if (
            event.code === "Space" &&
            !jumping &&
            !dialogueOpen
        ) {

            event.preventDefault();

            jumping = true;
            jumpProgress = 0;

        }

        if (
            key === "e" &&
            !event.repeat &&
            !dialogueOpen
        ) {

            if (
                policemanNearby &&
                !policemanConversationDone
            ) {

                openDialogue();

                return;

            }

            if (exitNearby) {

                window.location.href =
                    "scene01.html";

                return;

            }

        }

    }
);

document.addEventListener(
    "keyup",
    (event) => {

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


function getInventoryEntries() {
    return Object.entries(
        EldoriaItems.getAll()
    );
}

function renderInventory() {
    const items =
        getInventoryEntries();

    inventorySlots.forEach(
        (
            slot,
            index
        ) => {
            slot.innerHTML = "";

            slot.classList.toggle(
                "selected",
                index ===
                selectedInventorySlot
            );

            const slotNumber =
                document.createElement(
                    "span"
                );

            slotNumber.className =
                "inventorySlotNumber";

            slotNumber.textContent =
                index + 1;

            slot.appendChild(
                slotNumber
            );

            if (!items[index]) {
                return;
            }

            const [
                itemId,
                quantity
            ] = items[index];

            const icon =
                document.createElement(
                    "img"
                );

            icon.className =
                "inventoryItemIcon";

            icon.src =
                inventoryIcons[itemId] ||
                "";

            icon.alt =
                itemId;

            slot.appendChild(
                icon
            );

            if (quantity > 1) {
                const amount =
                    document.createElement(
                        "span"
                    );

                amount.className =
                    "inventoryQuantity";

                amount.textContent =
                    quantity;

                slot.appendChild(
                    amount
                );
            }
        }
    );
}

function selectInventorySlot(index) {
    if (
        index < 0 ||
        index >= inventorySlots.length
    ) {
        return;
    }

    selectedInventorySlot =
        index;

    renderInventory();
}

inventorySlots.forEach(
    (
        slot,
        index
    ) => {
        slot.addEventListener(
            "click",
            (event) => {
                event.stopPropagation();

                selectInventorySlot(
                    index
                );
            }
        );
    }
);

window.addEventListener(
    "eldoriaInventoryChanged",
    renderInventory
);

function repairSavedReward() {
    const choice =
        EldoriaProgress.getPolicemanChoice();

    if (
        choice === "lyceen_casseur"
    ) {
        EldoriaItems.addOnce(
            "mortier",
            1
        );
    }

    if (
        choice === "lyceen_pacifiste"
    ) {
        EldoriaItems.addOnce(
            "megaphone",
            1
        );
    }

    if (
        choice === "crs"
    ) {
        EldoriaItems.addOnce(
            "matraque",
            1
        );

        EldoriaItems.addOnce(
            "bouclier",
            1
        );

        EldoriaItems.addOnce(
            "grenade_lbd",
            1
        );
    }
}

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

    const offsetX =
        (
            gameWidth -
            renderedWidth
        ) / 2;

    const offsetY =
        (
            gameHeight -
            renderedHeight
        ) / 2;

    return {
        scale,
        offsetX,
        offsetY,
        renderedWidth,
        renderedHeight
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
                (
                    screenX -
                    transform.offsetX
                ) /
                transform.scale
            ),

        y:
            Math.floor(
                (
                    screenY -
                    transform.offsetY
                ) /
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

    const r =
        pixel[0];

    const g =
        pixel[1];

    const b =
        pixel[2];

    return (
        r < 100 &&
        g < 100 &&
        b < 100
    );

}

function canWalk(
    screenX,
    screenY
) {

    if (!collisionReady) {

        return true;

    }

    const feetY =
        screenY +
        player.offsetHeight * 0.43;

    const halfWidth = 7;

    const points = [

        {
            x: screenX,
            y: feetY
        },

        {
            x:
                screenX -
                halfWidth,

            y: feetY
        },

        {
            x:
                screenX +
                halfWidth,

            y: feetY
        },

        {
            x: screenX,
            y: feetY + 3
        }

    ];

    for (
        const point of points
    ) {

        const mapPoint =
            screenToMap(
                point.x,
                point.y
            );

        if (
            isBlocked(
                mapPoint.x,
                mapPoint.y
            )
        ) {

            return false;

        }

    }

    return true;

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

function updateInteractions() {

    if (dialogueOpen) {

        policemanNearby = false;
        exitNearby = false;

        interactionPrompt.classList.remove(
            "visible"
        );

        return;

    }

    const playerFeetX =
        playerX;

    const playerFeetY =
        playerY +
        player.offsetHeight * 0.4;

    policemanNearby = false;
    exitNearby = false;

    if (
        !policemanConversationDone
    ) {

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
            distance <=
            TALK_DISTANCE;

    }

    const exitX =
        game.clientWidth *
        SPAWN_X_PERCENT;

    const exitY =
        game.clientHeight *
        SPAWN_Y_PERCENT +
        player.offsetHeight * 0.4;

    const exitDistance =
        Math.hypot(
            playerFeetX -
            exitX,

            playerFeetY -
            exitY
        );

    exitNearby =
        exitDistance <=
        EXIT_DISTANCE;

    if (policemanNearby) {

        interactionPrompt.innerHTML =
            `
            <span class="interactionKey">E</span>
            <span>Parler</span>
            `;

        interactionPrompt.classList.add(
            "visible"
        );

        return;

    }

    if (exitNearby) {

        interactionPrompt.innerHTML =
            `
            <span class="interactionKey">E</span>
            <span>Sortir</span>
            `;

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
        EldoriaProgress.getPolicemanChoice();

    if (
        existingChoice &&
        existingChoice !== choice
    ) {

        finishConversation();
        return;

    }

    if (!existingChoice) {

        EldoriaProgress.setPolicemanChoice(
            choice
        );

    }

    if (
        choice === "lyceen_casseur"
    ) {

        EldoriaItems.addOnce(
            "mortier",
            1
        );

    }

    if (
        choice === "lyceen_pacifiste"
    ) {

        EldoriaItems.addOnce(
            "megaphone",
            1
        );

    }

    if (
        choice === "crs"
    ) {

        EldoriaItems.addOnce(
            "matraque",
            1
        );

        EldoriaItems.addOnce(
            "bouclier",
            1
        );

        EldoriaItems.addOnce(
            "grenade_lbd",
            1
        );

    }

    renderInventory();

    finishConversation();

}

function showStudentChoice() {

    dialogueText.textContent =
        "Tu veux être un casseur ou un pacifiste ?";

    dialogueChoices.innerHTML =
        "";

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
    () => {

        showStudentChoice();

    }
);

choiceCRS.addEventListener(
    "click",
    () => {

        validateFinalChoice(
            "crs"
        );

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

    const minX =
        transform.offsetX +
        halfWidth;

    const maxX =
        transform.offsetX +
        transform.renderedWidth -
        halfWidth;

    const minY =
        transform.offsetY +
        halfHeight;

    const maxY =
        transform.offsetY +
        transform.renderedHeight -
        halfHeight;

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

function updateJump() {

    if (!jumping) {

        jumpOffset = 0;

        return;

    }

    jumpProgress +=
        JUMP_SPEED;

    jumpOffset =
        Math.sin(
            jumpProgress
        ) *
        JUMP_HEIGHT;

    if (
        jumpProgress >=
        Math.PI
    ) {

        jumping = false;
        jumpProgress = 0;
        jumpOffset = 0;

    }

}

function update() {

    let dx = 0;
    let dy = 0;

    const pauseMenuOpen =
        window.EldoriaPauseMenu &&
        EldoriaPauseMenu.isOpen();

    if (
        !dialogueOpen &&
        !pauseMenuOpen
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
            Math.hypot(
                dx,
                dy
            );

        dx =
            dx /
            length *
            SPEED;

        dy =
            dy /
            length *
            SPEED;

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

            playerX =
                nextX;

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

            playerY =
                nextY;

        }

    }

    keepInsideMap();

    updateJump();

    updateInteractions();

    player.style.left =
        playerX + "px";

    player.style.top =
        (
            playerY -
            jumpOffset
        ) + "px";

    requestAnimationFrame(
        update
    );

}

game.addEventListener(
    "click",
    (event) => {

        if (dialogueOpen) {

            return;

        }

        if (
            event.target.closest(
                "#dialogueOverlay"
            )
        ) {

            return;

        }

        if (
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

        if (
            document.pointerLockElement ===
            game
        ) {

            game.classList.add(
                "mouse-locked"
            );

        }

        else {

            game.classList.remove(
                "mouse-locked"
            );

        }

    }
);

window.addEventListener(
    "resize",
    () => {

        setSpawnPosition();

    }
);

window.addEventListener(
    "load",
    () => {

        requestAnimationFrame(
            () => {

                setSpawnPosition();

            }
        );

    }
);

setSpawnPosition();

repairSavedReward();

renderInventory();

update();