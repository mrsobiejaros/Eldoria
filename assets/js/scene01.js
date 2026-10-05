const game = document.getElementById("game");
const player = document.getElementById("player");


// =========================
// POSITION DU JOUEUR
// =========================

let playerX = window.innerWidth / 2;
let playerY = window.innerHeight / 2;


// Vitesse du joueur
const speed = 4;


// Touches actuellement appuyées
const keys = {};


// =========================
// CLAVIER
// =========================

document.addEventListener("keydown", (event) => {

    const key = event.key.toLowerCase();

    keys[key] = true;

});


document.addEventListener("keyup", (event) => {

    const key = event.key.toLowerCase();

    keys[key] = false;

});


// =========================
// DÉPLACEMENTS
// =========================

function movePlayer() {

    // Haut
    if (
        keys["arrowup"] ||
        keys["z"] ||
        keys["w"]
    ) {

        playerY -= speed;

    }


    // Bas
    if (
        keys["arrowdown"] ||
        keys["s"]
    ) {

        playerY += speed;

    }


    // Gauche
    if (
        keys["arrowleft"] ||
        keys["q"] ||
        keys["a"]
    ) {

        playerX -= speed;

    }


    // Droite
    if (
        keys["arrowright"] ||
        keys["d"]
    ) {

        playerX += speed;

    }


    limitPlayerPosition();


    player.style.left = playerX + "px";
    player.style.top = playerY + "px";


    requestAnimationFrame(movePlayer);
}


// =========================
// LIMITES DE LA MAP
// =========================

function limitPlayerPosition() {

    const playerWidth = player.offsetWidth;
    const playerHeight = player.offsetHeight;


    const halfWidth = playerWidth / 2;
    const halfHeight = playerHeight / 2;


    // Gauche
    if (playerX < halfWidth) {

        playerX = halfWidth;

    }


    // Droite
    if (playerX > window.innerWidth - halfWidth) {

        playerX = window.innerWidth - halfWidth;

    }


    // Haut
    if (playerY < halfHeight) {

        playerY = halfHeight;

    }


    // Bas
    if (playerY > window.innerHeight - halfHeight) {

        playerY = window.innerHeight - halfHeight;

    }

}


// =========================
// REDIMENSIONNEMENT
// =========================

window.addEventListener("resize", () => {

    limitPlayerPosition();

});


// =========================
// LANCEMENT DU JEU
// =========================

movePlayer();