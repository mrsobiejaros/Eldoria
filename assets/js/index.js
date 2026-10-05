const choiceMen =
    document.getElementById(
        "choiceMen"
    );

const choiceGirl =
    document.getElementById(
        "choiceGirl"
    );

if (
    EldoriaCharacters.getGender()
) {
    window.location.href =
        "pages/scene01.html";
}

function startGame(gender) {
    EldoriaCharacters.setGender(
        gender
    );

    window.location.href =
        "pages/scene01.html";
}

choiceMen.addEventListener(
    "click",
    () => {
        startGame("men");
    }
);

choiceGirl.addEventListener(
    "click",
    () => {
        startGame("girl");
    }
);
