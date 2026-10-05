const game =
    document.getElementById("game");

const player =
    document.getElementById("player");

const interactionPrompt =
    document.getElementById(
        "interactionPrompt"
    );

const interactionText =
    document.getElementById(
        "interactionText"
    );

EldoriaCharacters.applySceneCharacters(
    "scene01"
);

window.addEventListener(
    "eldoriaCharacterChanged",
    () => {
        EldoriaCharacters.applySceneCharacters(
            "scene01"
        );
    }
);

const SPEED = 1.0;
const JUMP_HEIGHT = 22;
const JUMP_SPEED = 0.11;
const DOOR_INTERACTION_DISTANCE = 55;
const FINAL_PORTAL_DISTANCE = 72;
const COLOR_TOLERANCE = 55;

const FINAL_PORTAL_X_PERCENT = 0.50;
const FINAL_PORTAL_Y_PERCENT = 0.55;

const keys = {};

let playerX =
    game.clientWidth * 0.50;

let playerY =
    game.clientHeight * 0.55;

let jumping = false;
let jumpProgress = 0;
let jumpOffset = 0;
let nearbyDoor = null;
let nearFinalPortal = false;
let collisionReady = false;

function isFinalSceneUnlocked() {
    return Boolean(
        window.EldoriaMissions &&
        EldoriaMissions.allComplete() &&
        EldoriaMissions.isEndingSeen()
    );
}

const doorTypes = [
    { name: "yellow", r: 255, g: 255, b: 0, scene: "scene02.html" },
    { name: "red", r: 255, g: 0, b: 0, scene: "scene03.html" },
    { name: "green", r: 0, g: 255, b: 0, scene: "scene04.html" },
    { name: "blue", r: 0, g: 0, b: 255, scene: "scene05.html" },
    { name: "pink", r: 255, g: 0, b: 255, scene: "scene06.html" },
    { name: "cyan", r: 0, g: 255, b: 255, scene: "scene07.html" },
    { name: "orange", r: 255, g: 128, b: 0, scene: "scene08.html" },
    { name: "purple", r: 128, g: 0, b: 255, scene: "scene09.html" }
];

const detectedDoors = [];

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
    detectDoors();
};

collisionImage.onerror = () => {
    console.error(
        "Impossible de charger scene01_collision.png"
    );
};

collisionImage.src =
    "../assets/js/collisions/scene01_collision.png";

function colorMatches(
    r1,
    g1,
    b1,
    r2,
    g2,
    b2
) {
    return (
        Math.abs(r1 - r2) <= COLOR_TOLERANCE &&
        Math.abs(g1 - g2) <= COLOR_TOLERANCE &&
        Math.abs(b1 - b2) <= COLOR_TOLERANCE
    );
}

function getDoorTypeFromColor(
    r,
    g,
    b
) {
    return doorTypes.find(
        door =>
            colorMatches(
                r,
                g,
                b,
                door.r,
                door.g,
                door.b
            )
    ) || null;
}

function detectDoors() {
    detectedDoors.length = 0;

    const width =
        collisionCanvas.width;

    const height =
        collisionCanvas.height;

    const data =
        collisionContext.getImageData(
            0,
            0,
            width,
            height
        ).data;

    for (
        const type of doorTypes
    ) {
        let totalX = 0;
        let totalY = 0;
        let count = 0;

        for (
            let y = 0;
            y < height;
            y += 2
        ) {
            for (
                let x = 0;
                x < width;
                x += 2
            ) {
                const i =
                    (y * width + x) * 4;

                if (
                    colorMatches(
                        data[i],
                        data[i + 1],
                        data[i + 2],
                        type.r,
                        type.g,
                        type.b
                    )
                ) {
                    totalX += x;
                    totalY += y;
                    count++;
                }
            }
        }

        if (count > 0) {
            detectedDoors.push({
                type,
                x: totalX / count,
                y: totalY / count
            });
        }
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
            (screenX - transform.offsetX) /
            transform.scale,
        y:
            (screenY - transform.offsetY) /
            transform.scale
    };
}

function getPixel(
    mapX,
    mapY
) {
    mapX = Math.floor(mapX);
    mapY = Math.floor(mapY);

    if (
        mapX < 0 ||
        mapY < 0 ||
        mapX >= collisionCanvas.width ||
        mapY >= collisionCanvas.height
    ) {
        return null;
    }

    return collisionContext.getImageData(
        mapX,
        mapY,
        1,
        1
    ).data;
}

function isBlocked(
    mapX,
    mapY
) {
    const pixel =
        getPixel(
            mapX,
            mapY
        );

    if (!pixel) {
        return true;
    }

    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];

    if (
        getDoorTypeFromColor(
            r,
            g,
            b
        )
    ) {
        return true;
    }

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

function updateDoorInteraction() {
    nearbyDoor = null;
    nearFinalPortal = false;

    interactionPrompt.classList.remove(
        "visible"
    );

    if (
        isFinalSceneUnlocked()
    ) {
        const finalPortalX =
            game.clientWidth *
            FINAL_PORTAL_X_PERCENT;

        const finalPortalY =
            game.clientHeight *
            FINAL_PORTAL_Y_PERCENT;

        const finalPortalDistance =
            Math.hypot(
                playerX -
                finalPortalX,
                playerY -
                finalPortalY
            );

        if (
            finalPortalDistance <=
            FINAL_PORTAL_DISTANCE
        ) {
            nearFinalPortal =
                true;

            interactionText.textContent =
                "Entrer dans la scène finale";

            interactionPrompt.classList.add(
                "visible"
            );

            return;
        }
    }

    if (!collisionReady) {
        return;
    }

    const playerMap =
        screenToMap(
            playerX,
            playerY +
                player.offsetHeight * 0.43
        );

    let closestDistance =
        Infinity;

    for (
        const door of detectedDoors
    ) {
        const distance =
            Math.hypot(
                door.x -
                playerMap.x,
                door.y -
                playerMap.y
            );

        if (
            distance <=
                DOOR_INTERACTION_DISTANCE &&
            distance <
                closestDistance
        ) {
            closestDistance =
                distance;

            nearbyDoor =
                door;
        }
    }

    if (nearbyDoor) {
        interactionText.textContent =
            "Entrer";

        interactionPrompt.classList.add(
            "visible"
        );
    }
}

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
            !isGamePaused()
        ) {
            event.preventDefault();
            jumping = true;
            jumpProgress = 0;
        }

        if (
            key === "e" &&
            !event.repeat &&
            !isGamePaused()
        ) {
            if (
                nearFinalPortal &&
                isFinalSceneUnlocked()
            ) {
                window.location.href =
                    "scene10.html";

                return;
            }

            if (nearbyDoor) {
                window.location.href =
                    nearbyDoor.type.scene;
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

    if (!isGamePaused()) {
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
    updateDoorInteraction();

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
            event.target.closest(
                "#inventoryBar"
            ) ||
            isGamePaused()
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
    keepInsideMap
);

player.style.left =
    playerX + "px";

player.style.top =
    playerY + "px";

update();
