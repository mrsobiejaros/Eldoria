const game = document.getElementById("game");
const player = document.getElementById("player");


// =====================================================
// CONFIGURATION
// =====================================================

const speed = 1.0;

const keys = {};

let playerX = window.innerWidth * 0.50;
let playerY = window.innerHeight * 0.55;


// =====================================================
// MASQUE DE COLLISION
//
// NOIR = BLOQUÉ
// BLANC = AUTORISÉ
// TRANSPARENT = AUTORISÉ
// =====================================================

const collisionImage = new Image();

collisionImage.src =
    "/collisions/scene01_collision.png";


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
let collisionEnabled = true;


// =====================================================
// CHARGEMENT DU MASQUE
// =====================================================

collisionImage.onload = () => {

    collisionCanvas.width =
        collisionImage.naturalWidth;

    collisionCanvas.height =
        collisionImage.naturalHeight;


    collisionContext.clearRect(
        0,
        0,
        collisionCanvas.width,
        collisionCanvas.height
    );


    collisionContext.drawImage(
        collisionImage,
        0,
        0
    );


    collisionReady = true;


    console.log(
        "Collision chargée :",
        collisionCanvas.width,
        "x",
        collisionCanvas.height
    );

};


collisionImage.onerror = () => {

    /*
        IMPORTANT :
        si le masque ne charge pas,
        on NE BLOQUE PAS le joueur.
    */

    collisionEnabled = false;

    console.warn(
        "Masque de collision non chargé. " +
        "Déplacements autorisés sans collision."
    );

};


// =====================================================
// CLAVIER
// =====================================================

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


// =====================================================
// CALCUL DU BACKGROUND
//
// Doit correspondre à :
// background-size: cover
// background-position: center
// =====================================================

function getBackgroundData() {

    if (!collisionReady) {

        return null;

    }


    const imageWidth =
        collisionCanvas.width;

    const imageHeight =
        collisionCanvas.height;


    const gameWidth =
        game.clientWidth;

    const gameHeight =
        game.clientHeight;


    const scale =
        Math.max(
            gameWidth / imageWidth,
            gameHeight / imageHeight
        );


    const renderedWidth =
        imageWidth * scale;

    const renderedHeight =
        imageHeight * scale;


    const offsetX =
        (gameWidth - renderedWidth) / 2;

    const offsetY =
        (gameHeight - renderedHeight) / 2;


    return {

        scale,
        offsetX,
        offsetY

    };

}


// =====================================================
// POSITION ÉCRAN -> POSITION DANS L'IMAGE
// =====================================================

function screenToMap(
    screenX,
    screenY
) {

    const background =
        getBackgroundData();


    if (!background) {

        return null;

    }


    return {

        x: Math.floor(
            (
                screenX -
                background.offsetX
            ) /
            background.scale
        ),

        y: Math.floor(
            (
                screenY -
                background.offsetY
            ) /
            background.scale
        )

    };

}


// =====================================================
// TEST PIXEL NOIR
// =====================================================

function pixelIsBlocked(
    mapX,
    mapY
) {

    /*
        Hors de l'image :
        on ne bloque PAS.
    */

    if (
        mapX < 0 ||
        mapY < 0 ||
        mapX >= collisionCanvas.width ||
        mapY >= collisionCanvas.height
    ) {

        return false;

    }


    try {

        const pixel =
            collisionContext.getImageData(
                mapX,
                mapY,
                1,
                1
            ).data;


        const r = pixel[0];
        const g = pixel[1];
        const b = pixel[2];
        const a = pixel[3];


        /*
            Transparent = libre
        */

        if (a < 40) {

            return false;

        }


        /*
            Seulement le vrai noir / très foncé
            bloque le joueur.
        */

        return (
            r < 45 &&
            g < 45 &&
            b < 45
        );


    } catch (error) {

        /*
            TRÈS IMPORTANT :

            Si Chrome bloque getImageData
            par sécurité, on désactive la
            collision au lieu de bloquer
            complètement le personnage.
        */

        console.warn(
            "Lecture du masque impossible.",
            error
        );


        collisionEnabled = false;


        return false;

    }

}


// =====================================================
// PEUT-ON MARCHER ?
// =====================================================

function canWalk(
    screenX,
    screenY
) {

    /*
        Masque pas encore chargé :
        on laisse bouger.
    */

    if (
        !collisionReady ||
        !collisionEnabled
    ) {

        return true;

    }


    /*
        On teste uniquement les pieds.
        Pas la tête ni le corps complet.
    */

    const feetY =
        screenY +
        player.offsetHeight * 0.42;


    /*
        Petite largeur de collision aux pieds.
        On teste 3 points seulement.
    */

    const points = [

        {
            x: screenX,
            y: feetY
        },

        {
            x: screenX - 5,
            y: feetY
        },

        {
            x: screenX + 5,
            y: feetY
        }

    ];


    for (const point of points) {

        const mapPosition =
            screenToMap(
                point.x,
                point.y
            );


        if (!mapPosition) {

            continue;

        }


        if (
            pixelIsBlocked(
                mapPosition.x,
                mapPosition.y
            )
        ) {

            return false;

        }

    }


    return true;

}


// =====================================================
// LIMITES DE L'ÉCRAN
// =====================================================

function keepPlayerInsideScreen() {

    const halfWidth =
        player.offsetWidth / 2;

    const halfHeight =
        player.offsetHeight / 2;


    playerX =
        Math.max(
            halfWidth,
            Math.min(
                game.clientWidth -
                halfWidth,
                playerX
            )
        );


    playerY =
        Math.max(
            halfHeight,
            Math.min(
                game.clientHeight -
                halfHeight,
                playerY
            )
        );

}


// =====================================================
// DÉPLACEMENT
// =====================================================

function update() {

    let directionX = 0;
    let directionY = 0;


    // HAUT

    if (
        keys["z"] ||
        keys["w"] ||
        keys["arrowup"]
    ) {

        directionY -= 1;

    }


    // BAS

    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        directionY += 1;

    }


    // GAUCHE

    if (
        keys["q"] ||
        keys["a"] ||
        keys["arrowleft"]
    ) {

        directionX -= 1;

    }


    // DROITE

    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        directionX += 1;

    }


    // =================================================
    // NORMALISATION DIAGONALE
    // =================================================

    if (
        directionX !== 0 ||
        directionY !== 0
    ) {

        const length =
            Math.hypot(
                directionX,
                directionY
            );


        directionX /= length;
        directionY /= length;

    }


    const moveX =
        directionX * speed;

    const moveY =
        directionY * speed;


    // =================================================
    // HORIZONTAL
    // =================================================

    if (moveX !== 0) {

        const nextX =
            playerX + moveX;


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


    // =================================================
    // VERTICAL
    // =================================================

    if (moveY !== 0) {

        const nextY =
            playerY + moveY;


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


    keepPlayerInsideScreen();


    player.style.left =
        playerX + "px";

    player.style.top =
        playerY + "px";


    requestAnimationFrame(
        update
    );

}


// =====================================================
// REDIMENSIONNEMENT
// =====================================================

window.addEventListener(
    "resize",
    () => {

        keepPlayerInsideScreen();

    }
);


// =====================================================
// SOURIS
// =====================================================

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


// =====================================================
// SPAWN
// =====================================================

playerX =
    game.clientWidth * 0.50;

playerY =
    game.clientHeight * 0.55;


player.style.left =
    playerX + "px";

player.style.top =
    playerY + "px";


// =====================================================
// LANCEMENT
// =====================================================

update();