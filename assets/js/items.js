const INVENTORY_STORAGE_KEY = "eldoria_inventory_v1";
const PROGRESS_STORAGE_KEY = "eldoria_progress_v1";

function readLocalObject(key) {
    try {
        const raw = localStorage.getItem(key);

        if (!raw) {
            return {};
        }

        const value = JSON.parse(raw);

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

function writeLocalObject(key, value) {
    localStorage.setItem(
        key,
        JSON.stringify(value)
    );
}

function getInventory() {
    return readLocalObject(
        INVENTORY_STORAGE_KEY
    );
}

function saveInventory(inventory) {
    writeLocalObject(
        INVENTORY_STORAGE_KEY,
        inventory
    );

    window.dispatchEvent(
        new Event(
            "eldoriaInventoryChanged"
        )
    );
}

function addItem(itemId, quantity = 1) {
    const inventory =
        getInventory();

    const amount =
        Math.max(
            1,
            Math.floor(quantity)
        );

    inventory[itemId] =
        (inventory[itemId] || 0) +
        amount;

    saveInventory(
        inventory
    );
}

function addItemOnce(itemId, quantity = 1) {
    const inventory =
        getInventory();

    if (
        (inventory[itemId] || 0) >=
        quantity
    ) {
        return false;
    }

    inventory[itemId] =
        Math.max(
            quantity,
            inventory[itemId] || 0
        );

    saveInventory(
        inventory
    );

    return true;
}

function removeItem(itemId, quantity = 1) {
    const inventory =
        getInventory();

    if (!inventory[itemId]) {
        return false;
    }

    inventory[itemId] -=
        Math.max(
            1,
            Math.floor(quantity)
        );

    if (
        inventory[itemId] <= 0
    ) {
        delete inventory[itemId];
    }

    saveInventory(
        inventory
    );

    return true;
}

function hasItem(itemId, quantity = 1) {
    const inventory =
        getInventory();

    return (
        inventory[itemId] || 0
    ) >= quantity;
}

function clearInventory() {
    localStorage.removeItem(
        INVENTORY_STORAGE_KEY
    );

    window.dispatchEvent(
        new Event(
            "eldoriaInventoryChanged"
        )
    );
}

function getProgress() {
    return readLocalObject(
        PROGRESS_STORAGE_KEY
    );
}

function getPolicemanChoice() {
    return (
        getProgress().policemanChoice ||
        null
    );
}

function setPolicemanChoice(choice) {
    const progress =
        getProgress();

    if (progress.policemanChoice) {
        return false;
    }

    progress.policemanChoice =
        choice;

    writeLocalObject(
        PROGRESS_STORAGE_KEY,
        progress
    );

    return true;
}

function clearProgress() {
    localStorage.removeItem(
        PROGRESS_STORAGE_KEY
    );
}

window.EldoriaItems = {
    add: addItem,
    addOnce: addItemOnce,
    remove: removeItem,
    has: hasItem,
    getAll: getInventory,
    clear: clearInventory
};

window.EldoriaProgress = {
    getPolicemanChoice: getPolicemanChoice,
    setPolicemanChoice: setPolicemanChoice,
    getAll: getProgress,
    clear: clearProgress
};
