const game = document.getElementById("game");
const player = document.getElementById("player");


// ======================================================
// CONFIGURATION
// ======================================================

const speed = 1.0;

const keys = {};

let playerX = window.innerWidth / 2;
let playerY = window.innerHeight / 2;


// ======================================================
// MASQUE DE COLLISION
// NOIR = BLOQUÉ
// BLANC / TRANSPARENT = AUTORISÉ
// ======================================================

const collisionImage = new Image();

collisionImage.src =
    "../assets/collisions/scene01_collision.png";


const collisionCanvas =
    document.createElement("canvas");

const collisionContext =
    collisionCanvas.getContext(
        "2d",
        {
            willReadFrequently: true
        }
    );


let collisionReady = false;


// ======================================================
// CHARGEMENT DU MASQUE
// ======================================================

collisionImage.onload = () => {

    collisionCanvas.width =
        collisionImage.width;

    collisionCanvas.height =
        collisionImage.height;


    collisionContext.drawImage(
        collisionImage,
        0,
        0
    );


    collisionReady = true;

    console.log(
        "Masque de collision chargé :",
        collisionImage.width,
        "x",
        collisionImage.height
    );

};


collisionImage.onerror = () => {

    console.error(
        "Impossible de charger scene01_collision.png"
    );

};


// ======================================================
// CLAVIER
// ======================================================

document.addEventListener(
    "keydown",
    (event) => {

        keys[event.key.toLowerCase()] = true;

    }
);


document.addEventListener(
    "keyup",
    (event) => {

        keys[event.key.toLowerCase()] = false;

    }
);


// ======================================================
// POSITION DU BACKGROUND
// Compatible avec background-size: cover
// ======================================================

function getBackgroundTransform() {

    const mapWidth =
        collisionImage.width;

    const mapHeight =
        collisionImage.height;


    const screenWidth =
        game.clientWidth;

    const screenHeight =
        game.clientHeight;


    const scale =
        Math.max(
            screenWidth / mapWidth,
            screenHeight / mapHeight
        );


    const displayedWidth =
        mapWidth * scale;

    const displayedHeight =
        mapHeight * scale;


    const offsetX =
        (screenWidth - displayedWidth) / 2;

    const offsetY =
        (screenHeight - displayedHeight) / 2;


    return {
        scale,
        offsetX,
        offsetY
    };

}


// ======================================================
// CONVERSION ÉCRAN -> IMAGE
// ======================================================

function screenToMap(
    screenX,
    screenY
) {

    const transform =
        getBackgroundTransform();


    const mapX =
        (
            screenX -
            transform.offsetX
        ) /
        transform.scale;


    const mapY =
        (
            screenY -
            transform.offsetY
        ) /
        transform.scale;


    return {
        x: Math.floor(mapX),
        y: Math.floor(mapY)
    };

}


// ======================================================
// TEST D'UN PIXEL
// ======================================================

function isBlockedPixel(
    mapX,
    mapY
) {

    // En dehors de l'image = bloqué
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


    const red = pixel[0];
    const green = pixel[1];
    const blue = pixel[2];
    const alpha = pixel[3];


    /*
        Transparent = autorisé
    */

    if (alpha < 20) {
        return false;
    }


    /*
        Noir = collision

        On laisse une marge :
        même du gris très foncé sera considéré
        comme obstacle.
    */

    const isBlack =
        red < 60 &&
        green < 60 &&
        blue < 60;


    return isBlack;

}


// ======================================================
// TEST DE COLLISION DU JOUEUR
// ======================================================

function canWalk(
    screenX,
    screenY
) {

    /*
        Tant que le masque n'est pas chargé,
        on laisse le joueur bouger.
    */

    if (!collisionReady) {
        return true;
    }


    /*
        On teste au niveau des pieds.
    */

    const feetY =
        screenY +
        player.offsetHeight * 0.38;


    /*
        Petit hitbox au sol.

        On teste :
        - centre
        - gauche
        - droite
    */

    const hitboxHalfWidth = 8;


    const points = [

        {
            x: screenX,
            y: feetY
        },

        {
            x: screenX - hitboxHalfWidth,
            y: feetY
        },

        {
            x: screenX + hitboxHalfWidth,
            y: feetY
        }

    ];


    for (const point of points) {

        const mapPosition =
            screenToMap(
                point.x,
                point.y
            );


        if (
            isBlockedPixel(
                mapPosition.x,
                mapPosition.y
            )
        ) {

            return false;

        }

    }


    return true;

}


// ======================================================
// LIMITES DE L'ÉCRAN
// ======================================================

function keepPlayerInsideScreen() {

    const halfWidth =
        player.offsetWidth / 2;

    const halfHeight =
        player.offsetHeight / 2;


    playerX =
        Math.max(
            halfWidth,
            Math.min(
                window.innerWidth -
                halfWidth,
                playerX
            )
        );


    playerY =
        Math.max(
            halfHeight,
            Math.min(
                window.innerHeight -
                halfHeight,
                playerY
            )
        );

}


// ======================================================
// DÉPLACEMENT
// ======================================================

function update() {

    let moveX = 0;
    let moveY = 0;


    // HAUT
    if (
        keys["z"] ||
        keys["w"] ||
        keys["arrowup"]
    ) {
        moveY -= 1;
    }


    // BAS
    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {
        moveY += 1;
    }


    // GAUCHE
    if (
        keys["q"] ||
        keys["a"] ||
        keys["arrowleft"]
    ) {
        moveX -= 1;
    }


    // DROITE
    if (
        keys["d"] ||
        keys["arrowright"]
    ) {
        moveX += 1;
    }


    // ==================================================
    // NORMALISATION DIAGONALE
    // ==================================================

    if (
        moveX !== 0 ||
        moveY !== 0
    ) {

        const length =
            Math.hypot(
                moveX,
                moveY
            );


        moveX =
            moveX /
            length *
            speed;


        moveY =
            moveY /
            length *
            speed;

    }


    // ==================================================
    // COLLISION HORIZONTALE
    // ==================================================

    if (
        moveX !== 0 &&
        canWalk(
            playerX + moveX,
            playerY
        )
    ) {

        playerX += moveX;

    }


    // ==================================================
    // COLLISION VERTICALE
    // ==================================================

    if (
        moveY !== 0 &&
        canWalk(
            playerX,
            playerY + moveY
        )
    ) {

        playerY += moveY;

    }


    keepPlayerInsideScreen();


    player.style.left =
        playerX + "px";


    player.style.top =
        playerY + "px";


    requestAnimationFrame(
        update
    );

}


// ======================================================
// REDIMENSIONNEMENT
// ======================================================

window.addEventListener(
    "resize",
    () => {

        keepPlayerInsideScreen();

    }
);


// ======================================================
// SOURIS
// ======================================================

// Clic gauche = cacher la souris

game.addEventListener(
    "click",
    () => {

        if (
            document.pointerLockElement !==
            game
        ) {

            game.requestPointerLock();

        }

    }
);


// Échap libère automatiquement le pointer lock

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


// ======================================================
// POSITION INITIALE
// ======================================================

player.style.left =
    playerX + "px";

player.style.top =
    playerY + "px";


// ======================================================
// LANCEMENT
// ======================================================

update();