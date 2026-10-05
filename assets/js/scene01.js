const game =
    document.getElementById("game");

const player =
    document.getElementById("player");

const interactionPrompt =
    document.getElementById("interactionPrompt");

const interactionText =
    document.getElementById("interactionText");

const inventorySlots =
    document.querySelectorAll(
        ".inventorySlot"
    );

const SPEED = 1.0;
const JUMP_HEIGHT = 22;
const JUMP_SPEED = 0.11;
const DOOR_INTERACTION_DISTANCE = 55;
const COLOR_TOLERANCE = 55;

const keys = {};

let playerX =
    game.clientWidth * 0.50;

let playerY =
    game.clientHeight * 0.55;

let jumping = false;
let jumpProgress = 0;
let jumpOffset = 0;

let nearbyDoor = null;
let collisionReady = false;
let selectedInventorySlot = 0;

const inventoryNames = {
    mortier: "Mortier",
    megaphone: "Mégaphone",
    matraque: "Matraque",
    bouclier: "Bouclier",
    grenade_lbd: "Grenade LBD"
};

const doorTypes = [
    {
        name: "yellow",
        r: 255,
        g: 255,
        b: 0,
        scene: "scene02.html"
    },
    {
        name: "red",
        r: 255,
        g: 0,
        b: 0,
        scene: "scene03.html"
    },
    {
        name: "green",
        r: 0,
        g: 255,
        b: 0,
        scene: "scene04.html"
    },
    {
        name: "blue",
        r: 0,
        g: 0,
        b: 255,
        scene: "scene05.html"
    },
    {
        name: "pink",
        r: 255,
        g: 0,
        b: 255,
        scene: "scene06.html"
    },
    {
        name: "cyan",
        r: 0,
        g: 255,
        b: 255,
        scene: "scene07.html"
    },
    {
        name: "orange",
        r: 255,
        g: 128,
        b: 0,
        scene: "scene08.html"
    },
    {
        name: "purple",
        r: 128,
        g: 0,
        b: 255,
        scene: "scene09.html"
    }
];

const detectedDoors = [];

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

function getInventoryEntries() {
    if (!window.EldoriaItems) {
        return [];
    }

    const inventory =
        EldoriaItems.getAll();

    return Object.entries(
        inventory
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
                index === selectedInventorySlot
            );

            const number =
                document.createElement(
                    "span"
                );

            number.className =
                "inventorySlotNumber";

            number.textContent =
                index + 1;

            slot.appendChild(
                number
            );

            if (!items[index]) {
                return;
            }

            const [
                itemId,
                quantity
            ] = items[index];

            const itemName =
                document.createElement(
                    "span"
                );

            itemName.className =
                "inventoryItemName";

            itemName.textContent =
                inventoryNames[itemId] ||
                itemId;

            slot.appendChild(
                itemName
            );

            if (quantity > 1) {
                const quantityText =
                    document.createElement(
                        "span"
                    );

                quantityText.className =
                    "inventoryQuantity";

                quantityText.textContent =
                    quantity;

                slot.appendChild(
                    quantityText
                );
            }
        }
    );
}

function selectInventorySlot(
    slotNumber
) {
    if (
        slotNumber < 0 ||
        slotNumber >=
        inventorySlots.length
    ) {
        return;
    }

    selectedInventorySlot =
        slotNumber;

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
    () => {
        renderInventory();
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
    for (const door of doorTypes) {
        if (
            colorMatches(
                r,
                g,
                b,
                door.r,
                door.g,
                door.b
            )
        ) {
            return door;
        }
    }

    return null;
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

    const visited =
        new Uint8Array(
            width * height
        );

    const step = 2;

    for (
        let startY = 0;
        startY < height;
        startY += step
    ) {
        for (
            let startX = 0;
            startX < width;
            startX += step
        ) {
            const startIndex =
                startY * width +
                startX;

            if (
                visited[startIndex]
            ) {
                continue;
            }

            const dataIndex =
                startIndex * 4;

            const type =
                getDoorTypeFromColor(
                    data[dataIndex],
                    data[dataIndex + 1],
                    data[dataIndex + 2]
                );

            if (!type) {
                continue;
            }

            const queue = [
                {
                    x: startX,
                    y: startY
                }
            ];

            visited[startIndex] = 1;

            let totalX = 0;
            let totalY = 0;
            let count = 0;

            while (
                queue.length > 0
            ) {
                const current =
                    queue.pop();

                totalX += current.x;
                totalY += current.y;
                count++;

                const neighbours = [
                    {
                        x: current.x + step,
                        y: current.y
                    },
                    {
                        x: current.x - step,
                        y: current.y
                    },
                    {
                        x: current.x,
                        y: current.y + step
                    },
                    {
                        x: current.x,
                        y: current.y - step
                    }
                ];

                for (
                    const neighbour of neighbours
                ) {
                    if (
                        neighbour.x < 0 ||
                        neighbour.y < 0 ||
                        neighbour.x >= width ||
                        neighbour.y >= height
                    ) {
                        continue;
                    }

                    const neighbourIndex =
                        neighbour.y * width +
                        neighbour.x;

                    if (
                        visited[neighbourIndex]
                    ) {
                        continue;
                    }

                    const pixelIndex =
                        neighbourIndex * 4;

                    const neighbourType =
                        getDoorTypeFromColor(
                            data[pixelIndex],
                            data[pixelIndex + 1],
                            data[pixelIndex + 2]
                        );

                    if (
                        !neighbourType ||
                        neighbourType.name !==
                        type.name
                    ) {
                        continue;
                    }

                    visited[neighbourIndex] = 1;

                    queue.push(
                        neighbour
                    );
                }
            }

            if (count > 1) {
                detectedDoors.push({
                    type,
                    x: totalX / count,
                    y: totalY / count
                });
            }
        }
    }
}

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
            !jumping
        ) {
            event.preventDefault();

            jumping = true;
            jumpProgress = 0;
        }

        if (
            key === "e" &&
            !event.repeat &&
            nearbyDoor
        ) {
            window.location.href =
                nearbyDoor.type.scene;
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
            (
                screenX -
                transform.offsetX
            ) /
            transform.scale,

        y:
            (
                screenY -
                transform.offsetY
            ) /
            transform.scale
    };
}

function getPixel(
    mapX,
    mapY
) {
    mapX =
        Math.floor(mapX);

    mapY =
        Math.floor(mapY);

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

    const door =
        getDoorTypeFromColor(
            r,
            g,
            b
        );

    if (door) {
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
        {
            x: screenX,
            y: feetY
        },
        {
            x: screenX - 7,
            y: feetY
        },
        {
            x: screenX + 7,
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

function updateDoorInteraction() {
    nearbyDoor = null;

    interactionPrompt.classList.remove(
        "visible"
    );

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
        !pauseMenuOpen &&
        (
            keys["z"] ||
        keys["w"] ||
        keys["arrowup"]
        )
    ) {
        dy -= 1;
    }

    if (
        !pauseMenuOpen &&
        (
        keys["s"] ||
        keys["arrowdown"]
        )
    ) {
        dy += 1;
    }

    if (
        !pauseMenuOpen &&
        (
        keys["q"] ||
        keys["a"] ||
        keys["arrowleft"]
        )
    ) {
        dx -= 1;
    }

    if (
        !pauseMenuOpen &&
        (
        keys["d"] ||
        keys["arrowright"]
        )
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
    updateDoorInteraction();

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
        } else {
            game.classList.remove(
                "mouse-locked"
            );
        }
    }
);

window.addEventListener(
    "resize",
    () => {
        keepInsideMap();
    }
);

player.style.left =
    playerX + "px";

player.style.top =
    playerY + "px";

renderInventory();
update();
