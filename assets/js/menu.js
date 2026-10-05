const pauseMenuOverlay =
    document.createElement("div");

pauseMenuOverlay.id =
    "pauseMenuOverlay";

pauseMenuOverlay.innerHTML = `
    <div id="pauseMenuBox">
        <div id="pauseMenuTitle">Pause</div>

        <div id="pauseMenuText">
            Tu peux reprendre le jeu ou effacer toute ta progression locale.
        </div>

        <button
            id="pauseMenuResume"
            class="pauseMenuButton"
        >
            Reprendre
        </button>

        <button
            id="pauseMenuClear"
            class="pauseMenuButton"
        >
            Effacer toute ma progression
        </button>
    </div>
`;

document.body.appendChild(
    pauseMenuOverlay
);

const pauseMenuResume =
    document.getElementById(
        "pauseMenuResume"
    );

const pauseMenuClear =
    document.getElementById(
        "pauseMenuClear"
    );

let pauseMenuOpen = false;
let pointerWasLocked = false;
let ignoreNextPointerUnlock = false;

function unlockPointerWithoutPause() {
    if (
        document.pointerLockElement
    ) {
        ignoreNextPointerUnlock = true;
        document.exitPointerLock();
    }
}

function openPauseMenu() {
    if (pauseMenuOpen) {
        return;
    }

    pauseMenuOpen = true;

    pauseMenuOverlay.classList.add(
        "visible"
    );

    unlockPointerWithoutPause();

    window.dispatchEvent(
        new Event(
            "eldoriaPauseOpened"
        )
    );
}

function closePauseMenu() {
    if (!pauseMenuOpen) {
        return;
    }

    pauseMenuOpen = false;

    pauseMenuOverlay.classList.remove(
        "visible"
    );

    window.dispatchEvent(
        new Event(
            "eldoriaPauseClosed"
        )
    );
}

function togglePauseMenu() {
    if (pauseMenuOpen) {
        closePauseMenu();
    } else {
        openPauseMenu();
    }
}

pauseMenuResume.addEventListener(
    "click",
    () => {
        closePauseMenu();
    }
);

pauseMenuClear.addEventListener(
    "click",
    () => {
        localStorage.removeItem(
            "eldoria_inventory_v1"
        );

        localStorage.removeItem(
            "eldoria_progress_v1"
        );

        localStorage.removeItem(
            "eldoria_character_v1"
        );

        localStorage.removeItem(
            "eldoria_scene03_quest_v1"
        );

        localStorage.removeItem(
            "eldoria_missions_v1"
        );

        window.location.href =
            "../index.html";
    }
);

pauseMenuOverlay.addEventListener(
    "click",
    (event) => {
        if (
            event.target ===
            pauseMenuOverlay
        ) {
            closePauseMenu();
        }
    }
);

document.addEventListener(
    "keydown",
    (event) => {
        if (
            event.key === "Escape" &&
            !event.repeat &&
            !document.pointerLockElement
        ) {
            event.preventDefault();
            event.stopPropagation();

            togglePauseMenu();
        }
    },
    true
);

document.addEventListener(
    "pointerlockchange",
    () => {
        const isLocked =
            Boolean(
                document.pointerLockElement
            );

        if (isLocked) {
            pointerWasLocked = true;
            return;
        }

        if (
            ignoreNextPointerUnlock
        ) {
            ignoreNextPointerUnlock = false;
            pointerWasLocked = false;
            return;
        }

        if (
            pointerWasLocked &&
            !pauseMenuOpen
        ) {
            pointerWasLocked = false;

            setTimeout(
                () => {
                    openPauseMenu();
                },
                0
            );

            return;
        }

        pointerWasLocked = false;
    }
);

window.EldoriaPauseMenu = {
    open:
        openPauseMenu,

    close:
        closePauseMenu,

    toggle:
        togglePauseMenu,

    isOpen:
        () => pauseMenuOpen,

    unlockPointerWithoutPause:
        unlockPointerWithoutPause
};
