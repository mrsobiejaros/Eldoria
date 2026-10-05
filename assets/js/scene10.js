if (
    !EldoriaMissions.allComplete() ||
    !EldoriaMissions.isEndingSeen()
) {
    window.location.href =
        "scene01.html";
}

const endingPlayer =
    document.getElementById(
        "endingPlayer"
    );

const endingRole =
    document.getElementById(
        "endingRole"
    );

const endingText =
    document.getElementById(
        "endingText"
    );

const endingFuture =
    document.getElementById(
        "endingFuture"
    );

const endingContinue =
    document.getElementById(
        "endingContinue"
    );

const role =
    EldoriaCharacters.getRole();

const gender =
    EldoriaCharacters.getGender();

const ENDINGS = {
    lyceen_casseur: {
        role:
            "La révolution a laissé sa marque.",

        text:
            "Les rues se sont enfin vidées. Les slogans disparaissent peu à peu des murs, mais personne n'oubliera ce qui s'est passé ici.",

        future:
            "Le pouvoir a changé. Reste à savoir ce que ceux qui l'ont obtenu décideront d'en faire."
    },

    crs: {
        role:
            "L'ordre est revenu.",

        text:
            "Les sirènes se taisent. Les lignes de CRS quittent progressivement les rues et la ville reprend son rythme.",

        future:
            "Pourtant, derrière les fenêtres fermées, certaines voix n'ont pas dit leur dernier mot."
    },

    lyceen_pacifiste: {
        role:
            "Les voix ont fini par être entendues.",

        text:
            "La place est calme. Ce qui paraissait impossible quelques jours plus tôt fait maintenant partie de l'histoire du pays.",

        future:
            "Des droits ont été gagnés. Mais aucune victoire n'est éternelle lorsque le monde continue de changer."
    }
};

const ending =
    ENDINGS[role] ||
    ENDINGS.lyceen_pacifiste;

endingRole.textContent =
    ending.role;

endingText.textContent =
    ending.text;

endingFuture.textContent =
    ending.future;

const sprite =
    EldoriaCharacters.getPlayerSprite();

endingPlayer.style.backgroundImage =
    `url("${sprite}")`;

endingContinue.addEventListener(
    "click",
    () => {
        endingContinue.disabled =
            true;

        endingContinue.textContent =
            "Merci d'avoir joué à Eldoria";

        document.getElementById(
            "endingTease"
        ).style.animationDelay =
            "0s";
    }
);
