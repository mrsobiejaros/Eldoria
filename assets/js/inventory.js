const ELDORIA_INVENTORY_KEY = "eldoria_inventory_v1";

const ELDORIA_ITEMS = {
    mortier: {
        name: "Mortier",
        texture: "../assets/items/mortier.png"
    },
    megaphone: {
        name: "Mégaphone",
        texture: "../assets/items/megaphone.png"
    },
    matraque: {
        name: "Matraque",
        texture: "../assets/items/matraque.png"
    },
    bouclier: {
        name: "Bouclier",
        texture: "../assets/items/bouclier.png"
    },
    grenade_lbd: {
        name: "Grenade LBD",
        texture: "../assets/items/grenade_lbd.png"
    }
};

let selectedInventorySlot = 0;

function readInventory() {
    try {
        const value = JSON.parse(
            localStorage.getItem(
                ELDORIA_INVENTORY_KEY
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

function saveInventory(inventory) {
    localStorage.setItem(
        ELDORIA_INVENTORY_KEY,
        JSON.stringify(inventory)
    );

    renderInventory();

    window.dispatchEvent(
        new Event(
            "eldoriaInventoryChanged"
        )
    );
}

function addItem(itemId, quantity = 1) {
    const inventory = readInventory();
    const amount = Math.max(
        1,
        Math.floor(quantity)
    );

    inventory[itemId] =
        (inventory[itemId] || 0) +
        amount;

    saveInventory(inventory);
}

function addItemOnce(itemId, quantity = 1) {
    const inventory = readInventory();

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

    saveInventory(inventory);

    return true;
}

function removeItem(itemId, quantity = 1) {
    const inventory = readInventory();

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

    saveInventory(inventory);

    return true;
}

function hasItem(itemId, quantity = 1) {
    const inventory = readInventory();

    return (
        inventory[itemId] || 0
    ) >= quantity;
}

function clearInventory() {
    localStorage.removeItem(
        ELDORIA_INVENTORY_KEY
    );

    renderInventory();

    window.dispatchEvent(
        new Event(
            "eldoriaInventoryChanged"
        )
    );
}

function ensureInventoryBar() {
    const game =
        document.getElementById("game");

    if (!game) {
        return null;
    }

    let bar =
        document.getElementById(
            "inventoryBar"
        );

    if (!bar) {
        bar =
            document.createElement(
                "div"
            );

        bar.id = "inventoryBar";

        for (
            let i = 0;
            i < 9;
            i++
        ) {
            const slot =
                document.createElement(
                    "div"
                );

            slot.className =
                "inventorySlot";

            slot.dataset.slot = i;

            bar.appendChild(slot);
        }

        game.appendChild(bar);
    }

    return bar;
}

function renderInventory() {
    const bar =
        ensureInventoryBar();

    if (!bar) {
        return;
    }

    const slots =
        bar.querySelectorAll(
            ".inventorySlot"
        );

    const entries =
        Object.entries(
            readInventory()
        );

    slots.forEach(
        (slot, index) => {
            slot.innerHTML = "";

            slot.classList.toggle(
                "selected",
                index ===
                    selectedInventorySlot
            );

            const number =
                document.createElement(
                    "span"
                );

            number.className =
                "inventorySlotNumber";

            number.textContent =
                index + 1;

            slot.appendChild(number);

            const entry = entries[index];

            if (!entry) {
                return;
            }

            const [itemId, quantity] =
                entry;

            const item =
                ELDORIA_ITEMS[itemId];

            if (item) {
                const icon =
                    document.createElement(
                        "img"
                    );

                icon.className =
                    "inventoryItemIcon";

                icon.src =
                    item.texture;

                icon.alt =
                    item.name;

                icon.title =
                    item.name;

                slot.appendChild(icon);
            }

            if (quantity > 1) {
                const amount =
                    document.createElement(
                        "span"
                    );

                amount.className =
                    "inventoryQuantity";

                amount.textContent =
                    quantity;

                slot.appendChild(amount);
            }
        }
    );
}

function selectSlot(index) {
    if (
        index < 0 ||
        index > 8
    ) {
        return;
    }

    selectedInventorySlot = index;
    renderInventory();
}

function getSelectedItem() {
    const entries =
        Object.entries(
            readInventory()
        );

    const entry =
        entries[selectedInventorySlot];

    if (!entry) {
        return null;
    }

    return {
        id: entry[0],
        quantity: entry[1],
        data: ELDORIA_ITEMS[entry[0]] || null
    };
}

function initialiseInventoryUI() {
    const bar =
        ensureInventoryBar();

    if (!bar) {
        return;
    }

    bar.addEventListener(
        "click",
        (event) => {
            const slot =
                event.target.closest(
                    ".inventorySlot"
                );

            if (!slot) {
                return;
            }

            event.stopPropagation();

            selectSlot(
                Number(
                    slot.dataset.slot
                )
            );
        }
    );

    document.addEventListener(
        "keydown",
        (event) => {
            if (
                event.key >= "1" &&
                event.key <= "9"
            ) {
                selectSlot(
                    Number(event.key) - 1
                );
            }
        }
    );

    renderInventory();
}

window.EldoriaInventory = {
    add: addItem,
    addOnce: addItemOnce,
    remove: removeItem,
    has: hasItem,
    getAll: readInventory,
    clear: clearInventory,
    render: renderInventory,
    selectSlot,
    getSelectedItem,
    items: ELDORIA_ITEMS
};

if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        initialiseInventoryUI
    );
} else {
    initialiseInventoryUI();
}
