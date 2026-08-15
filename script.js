const audio = document.getElementById("audio");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const progress = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

let songs = [];
let currentSong = -1;

let randomOrder = [];
let randomPosition = -1;


// =====================================================
// LOAD SONG LIBRARY
// =====================================================

async function loadSongLibrary() {

    try {

        const response = await fetch(
            "songs/songs.json",
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error("Unable to load songs.json");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error(
                "songs.json must contain an array"
            );
        }

        songs = data.filter(
            file =>
                typeof file === "string" &&
                file.trim() !== ""
        );

        if (songs.length === 0) {
            throw new Error(
                "No songs found in songs.json"
            );
        }

        createRandomOrder();

        const firstSong =
            getNextRandomSong();

        loadSong(
            firstSong,
            true
        );

    } catch (error) {

        console.error(
            "GANAGAND MUSIC ERROR:",
            error
        );

    }
}


// =====================================================
// CREATE RANDOM ORDER
// =====================================================

function createRandomOrder() {

    randomOrder =
        songs.map(
            (_, index) => index
        );


    for (
        let i = randomOrder.length - 1;
        i > 0;
        i--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() * (i + 1)
            );


        [
            randomOrder[i],
            randomOrder[randomIndex]
        ] = [
            randomOrder[randomIndex],
            randomOrder[i]
        ];

    }


    randomPosition = -1;
}


// =====================================================
// GET NEXT RANDOM SONG
// =====================================================

function getNextRandomSong() {

    if (songs.length === 0) {
        return -1;
    }


    if (
        randomPosition >=
        randomOrder.length - 1
    ) {

        createRandomOrder();

    }


    randomPosition++;

    return randomOrder[randomPosition];
}


// =====================================================
// FORMAT TIME
// =====================================================

function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {
        return "0:00";
    }


    const minutes =
        Math.floor(seconds / 60);


    const secondsPart =
        Math.floor(seconds % 60)
            .toString()
            .padStart(2, "0");


    return `${minutes}:${secondsPart}`;
}


// =====================================================
// LOAD SONG
// =====================================================

function loadSong(
    index,
    autoplay = false
) {

    if (
        index < 0 ||
        index >= songs.length
    ) {
        return;
    }


    currentSong = index;


    audio.src =
        `songs/${songs[currentSong]}`;


    audio.load();


    progress.value = 0;


    currentTime.textContent =
        "0:00";


    duration.textContent =
        "0:00";


    if (autoplay) {

        audio.play().catch(() => {

            /*
             Browser autoplay policy
             may require user interaction.
            */

        });

    }

}


// =====================================================
// PLAY
// =====================================================

function playSong() {

    if (songs.length === 0) {
        return;
    }


    if (currentSong === -1) {

        const randomSong =
            getNextRandomSong();


        loadSong(
            randomSong,
            true
        );


        return;
    }


    audio.play().catch(() => {});

}


// =====================================================
// PAUSE
// =====================================================

function pauseSong() {

    audio.pause();

}


// =====================================================
// NEXT SONG
// =====================================================

function nextSong() {

    if (songs.length === 0) {
        return;
    }


    const nextIndex =
        getNextRandomSong();


    loadSong(
        nextIndex,
        true
    );

}


// =====================================================
// PREVIOUS SONG
// =====================================================

function previousSong() {

    if (songs.length === 0) {
        return;
    }


    if (randomPosition > 0) {

        randomPosition--;


        const previousIndex =
            randomOrder[randomPosition];


        loadSong(
            previousIndex,
            true
        );


        return;
    }


    loadSong(
        currentSong,
        true
    );

}


// =====================================================
// PLAY / PAUSE BUTTON
// =====================================================

playBtn.addEventListener(
    "click",
    () => {

        if (audio.paused) {

            playSong();

        } else {

            pauseSong();

        }

    }
);


// =====================================================
// PREVIOUS BUTTON
// =====================================================

prevBtn.addEventListener(
    "click",
    previousSong
);


// =====================================================
// NEXT BUTTON
// =====================================================

nextBtn.addEventListener(
    "click",
    nextSong
);


// =====================================================
// AUDIO PLAY
// =====================================================

audio.addEventListener(
    "play",
    () => {

        playBtn.textContent =
            "Ⅱ";


        playBtn.setAttribute(
            "aria-label",
            "Pause"
        );

    }
);


// =====================================================
// AUDIO PAUSE
// =====================================================

audio.addEventListener(
    "pause",
    () => {

        playBtn.textContent =
            "▶";


        playBtn.setAttribute(
            "aria-label",
            "Play"
        );

    }
);


// =====================================================
// SONG METADATA
// =====================================================

audio.addEventListener(
    "loadedmetadata",
    () => {

        duration.textContent =
            formatTime(
                audio.duration
            );

    }
);


// =====================================================
// UPDATE PROGRESS
// =====================================================

audio.addEventListener(
    "timeupdate",
    () => {

        currentTime.textContent =
            formatTime(
                audio.currentTime
            );


        if (
            Number.isFinite(
                audio.duration
            ) &&
            audio.duration > 0
        ) {

            progress.value =
                (
                    audio.currentTime /
                    audio.duration
                ) * 100;

        }

    }
);


// =====================================================
// SEEK
// =====================================================

progress.addEventListener(
    "input",
    () => {

        if (
            Number.isFinite(
                audio.duration
            ) &&
            audio.duration > 0
        ) {

            audio.currentTime =
                (
                    Number(
                        progress.value
                    ) / 100
                ) *
                audio.duration;

        }

    }
);


// =====================================================
// AUTOMATIC NEXT RANDOM SONG
// =====================================================

audio.addEventListener(
    "ended",
    () => {

        nextSong();

    }
);


// =====================================================
// AUDIO ERROR
// =====================================================

audio.addEventListener(
    "error",
    () => {

        console.error(
            "Unable to play song:",
            audio.src
        );

    }
);


// =====================================================
// START GANAGAND
// =====================================================

loadSongLibrary();