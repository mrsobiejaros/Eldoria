const musicPath = document.body.dataset.music;
const loopMusic = document.body.dataset.musicLoop === "true";
const volume = parseFloat(document.body.dataset.musicVolume || "0.5");

if (musicPath) {
    const audio = new Audio(musicPath);

    audio.loop = loopMusic;
    audio.volume = volume;

    audio.play().catch(() => {
        const startMusic = () => {
            audio.play();
            document.removeEventListener("click", startMusic);
            document.removeEventListener("keydown", startMusic);
        };

        document.addEventListener("click", startMusic);
        document.addEventListener("keydown", startMusic);
    });
}