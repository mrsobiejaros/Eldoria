const ELDORIA_CHARACTER_KEY = "eldoria_character_v1";
const ELDORIA_PROGRESS_KEY = "eldoria_progress_v1";

const ELDORIA_CHARACTER_SPRITES = {
    base: {
        men: "../assets/characters/player_men.png",
        girl: "../assets/characters/player_girl.png"
    },
    casseur: {
        men: "../assets/characters/player_men_cagoule.png",
        girl: "../assets/characters/player_girl_cagoule.png"
    },
    crs: {
        men: "../assets/characters/policier.png",
        girl: "../assets/characters/policiere.png"
    },
    npc: {
        policier: "../assets/characters/policier.png",
        policiere: "../assets/characters/policiere.png"
    }
};

const ELDORIA_CHARACTER_SIZES = {
    scene01: {
        player: {
            width: 48,
            height: 64
        }
    },
    scene02: {
        player: {
            width: 90,
            height: 120
        },
        policeman: {
            width: 105,
            height: 150
        }
    },
    scene03: {
        player: {
            width: 82,
            height: 112
        },
        npc: {
            width: 72,
            height: 98
        }
    },
    default: {
        player: {
            width: 64,
            height: 88
        }
    }
};

function readCharacterData() {
    try {
        const value = JSON.parse(
            localStorage.getItem(
                ELDORIA_CHARACTER_KEY
            ) || "{}"
        );

        if (
            typeof value !== "object" ||
            value === null ||
            Array.isArray(value)
        ) {
            return {};
        }

        return value;
    } catch {
        return {};
    }
}

function writeCharacterData(data) {
    localStorage.setItem(
        ELDORIA_CHARACTER_KEY,
        JSON.stringify(data)
    );

    window.dispatchEvent(
        new Event(
            "eldoriaCharacterChanged"
        )
    );
}

function readProgressData() {
    try {
        const value = JSON.parse(
            localStorage.getItem(
                ELDORIA_PROGRESS_KEY
            ) || "{}"
        );

        if (
            typeof value !== "object" ||
            value === null ||
            Array.isArray(value)
        ) {
            return {};
        }

        return value;
    } catch {
        return {};
    }
}

function writeProgressData(data) {
    localStorage.setItem(
        ELDORIA_PROGRESS_KEY,
        JSON.stringify(data)
    );

    window.dispatchEvent(
        new Event(
            "eldoriaProgressChanged"
        )
    );

    window.dispatchEvent(
        new Event(
            "eldoriaCharacterChanged"
        )
    );
}

function setGender(gender) {
    if (
        gender !== "men" &&
        gender !== "girl"
    ) {
        return false;
    }

    const data = readCharacterData();
    data.gender = gender;
    writeCharacterData(data);

    return true;
}

function getGender() {
    return readCharacterData().gender || null;
}

function getRole() {
    return readProgressData().policemanChoice || null;
}

function setRole(role) {
    const progress = readProgressData();

    if (progress.policemanChoice) {
        return false;
    }

    progress.policemanChoice = role;
    writeProgressData(progress);

    return true;
}

function clearRole() {
    const progress = readProgressData();
    delete progress.policemanChoice;
    writeProgressData(progress);
}

function getPlayerMode() {
    const role = getRole();

    if (role === "lyceen_casseur") {
        return "casseur";
    }

    if (role === "crs") {
        return "crs";
    }

    return "base";
}

function getPlayerSprite() {
    const gender = getGender();

    if (!gender) {
        return null;
    }

    const mode = getPlayerMode();

    return ELDORIA_CHARACTER_SPRITES[mode][gender];
}


function getNpcSprite(role, gender) {
    const safeGender =
        gender === "girl"
            ? "girl"
            : "men";

    if (role === "crs") {
        return ELDORIA_CHARACTER_SPRITES.crs[
            safeGender
        ];
    }

    if (role === "casseur") {
        return ELDORIA_CHARACTER_SPRITES.casseur[
            safeGender
        ];
    }

    return ELDORIA_CHARACTER_SPRITES.base[
        safeGender
    ];
}

function getSceneConfig(sceneName) {
    return (
        ELDORIA_CHARACTER_SIZES[sceneName] ||
        ELDORIA_CHARACTER_SIZES.default
    );
}

function applySprite(element, sprite) {
    if (!element || !sprite) {
        return;
    }

    element.style.backgroundImage =
        `url("${sprite}")`;

    element.style.backgroundSize =
        "contain";

    element.style.backgroundPosition =
        "center";

    element.style.backgroundRepeat =
        "no-repeat";

    element.style.imageRendering =
        "pixelated";
}

function applySize(element, size) {
    if (!element || !size) {
        return;
    }

    element.style.width =
        size.width + "px";

    element.style.height =
        size.height + "px";
}

function applySceneCharacters(sceneName) {
    const gender = getGender();

    if (!gender) {
        if (
            window.location.pathname.includes(
                "/pages/"
            )
        ) {
            window.location.href =
                "../index.html";
        }

        return false;
    }

    const config =
        getSceneConfig(sceneName);

    const player =
        document.getElementById(
            "player"
        );

    if (player) {
        applySprite(
            player,
            getPlayerSprite()
        );

        applySize(
            player,
            config.player
        );
    }

    const policeman =
        document.getElementById(
            "policier"
        );

    if (
        policeman &&
        config.policeman
    ) {
        applySprite(
            policeman,
            ELDORIA_CHARACTER_SPRITES.npc.policier
        );

        applySize(
            policeman,
            config.policeman
        );
    }

    return true;
}

function clearCharacter() {
    localStorage.removeItem(
        ELDORIA_CHARACTER_KEY
    );
}

window.EldoriaCharacters = {
    setGender,
    getGender,
    getRole,
    setRole,
    clearRole,
    getPlayerMode,
    getPlayerSprite,
    getNpcSprite,
    getSceneConfig,
    applySprite,
    applySize,
    applySceneCharacters,
    clearCharacter,
    sizes: ELDORIA_CHARACTER_SIZES,
    sprites: ELDORIA_CHARACTER_SPRITES
};
