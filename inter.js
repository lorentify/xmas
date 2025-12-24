const previousButton = document.getElementById("previous")
const nextButton = document.getElementById("next")
const repeatButton = document.getElementById("repeat")
const shuffleButton = document.getElementById("shuffle")
const playButton = document.getElementById("play")
const pauseButton = document.getElementById("pause")
const audio = document.getElementById("audio")
const songImage = document.getElementById("song-image")
const songName = document.getElementById("song-name")
const songArtist = document.getElementById("song-artist")
const listButton = document.getElementById("list")
const maxDuration = document.getElementById("max-duration")
const currentDuration = document.getElementById("current-time")
const progressBar = document.getElementById("progress-bar")
const playlistContainer = document.getElementById("playlist-container")
const closeButton = document.getElementById("close")
const playlistSongs = document.getElementById("playlist-songs")
const currentProgress = document.getElementById("current-progress")
const yesButton = document.getElementById("yes")
const noButton = document.getElementById("no")


//index for songs
let index = 0;

//initially loop=true
let loop = true

const songsList = [{
    name: "Snowman",
    link: "Snowman.mp3",
    artist: "Sia",
    image: "1.png",
},

{
    name: "Mistletoe",
    link: "Mistletoe.mp3",
    artist: "Justin Bieber",
    image: "Mistletoe.jpeg",
},

{
    name: "All I Want For Christmas Is You",
    link: "All-I-Want-For-Christmas-Is-You.mp3",
    artist: "Mariah Carey",
    image: "2.jpg",
},

{
    name: "Santa Tell Me",
    link: "Santa Tell Me.mp3",
    artist: "Ariana Grande",
    image: "3.jpg",
},
{
    name: "Last Christmas",
    link: "Last Christmas.mp3",
    artist: "Wham!",
    image: "4.jpeg",
},
];

//events objects
let events = {
    mouse: {
        click: "click",
    },
    touch: {
        click: "touchstart", 
    },
};

let deviceType = "";

//Detect touch device

const isTouchDevice = () => {
    try {
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    }   catch (e) {
        deviceType = "mouse";
        return false;
    }
    };

//Format time (convert ms to seconds, minutes, and add 0 id less than 10)
const timeFormatter = (timeInput) => {
    let minute = Math.floor(timeInput / 60);
    minute = minute < 10 ? "0" + minute : minute;
    let second = Math.floor(timeInput % 60);
    second = second < 10 ? "0" + second : second;
    return `${minute}:${second}`;
};

//set song

const setSong = (arrayIndex) => {

    if (!Number.isInteger(arrayIndex) || !songsList[arrayIndex]) {
    console.error("Invalid song index:", arrayIndex);
    return; }

    let { name, link, artist, image } = songsList [arrayIndex];
    audio.src = link;
    songName.innerHTML = name;
    songArtist.innerHTML= artist;
    songImage.src = image;
    //duration
    audio.onloadedmetadata = () => {
        maxDuration.innerText = timeFormatter(audio.duration);
    };
};

//play song
const playAudio = () => {
    audio.play ();
    pauseButton.classList.remove("hide");
    playButton.classList.add("hide");
};

//repeat button
repeatButton.addEventListener("click", () => {
    if (repeatButton.classList.contains("active")){
        repeatButton.classList.remove("active");
        audio.loop = false;
        console.log("repeat off")
    }
    else {
        repeatButton.classList.add("active");
        audio.loop = true;
        console.log("repeat on");
    }
});

//next song
const nextSong = () => { 
    if (loop) { if (index == songsList.length - 1) { 
        index = 0;
    } 
    else { 
        index += 1; 
    } 
    setSong (index); 
    playAudio(); 
    } 
    else { 
        let ranIndex = Math.floor(Math.random() * songsList.length); 
        console.log(ranIndex); 
        setSong(ranIndex); 
        playAudio(); 
    } 
};



//pause song
const pauseAudio = () => {
    audio.pause();
    pauseButton.classList.add("hide");
    playButton.classList.remove("hide");
};

//previous song
const previousSong = () => {
    if (index > 0) {
        pauseAudio();
        index -= 1;
    }
    else {
        index = songsList.length - 1;
    }
    setSong(index);
    playAudio();
};

//next song when curr ends
audio.onended = () => {
    nextSong();
};

//shuffle song
shuffleButton.addEventListener("click", () =>{
    if (shuffleButton.classList.contains("active")) {
        shuffleButton.classList.remove("active");
        loop = true;
        console.log("shuffle off");
    }
    else {
        shuffleButton.classList.add("active");
        loop = false;
        console.log("shuffle on");
    }
}
)

//pause button
if (pauseButton) {
pauseButton.addEventListener("click", pauseAudio); }

//play button
playButton.addEventListener("click", playAudio);

//next button
nextButton.addEventListener("click", nextSong);

//previous button
previousButton.addEventListener("click", previousSong);

//if user clicks on progress bar
isTouchDevice();
progressBar.addEventListener(events[deviceType].click, 
(events) => {
    if (!Number.isFinite(audio.duration)) return;
    let coordStart = progressBar.getBoundingClientRect().left;
    let coordEnd = !isTouchDevice() ? events.clientX:events.touches[0].clientX;
    let progress = (coordEnd - coordStart) / progressBar.offsetWidth;

    //set width
    currentProgress.style.width = progress * 100 + "%";

    //set time
    audio.currentTime = progress * audio.duration;

    //play
    audio.play();
    pauseButton.classList.remove("hide");
    playButton.classList.add("hide");
});

//update per second
setInterval(() => {
    if (!Number.isFinite(audio.duration)) return;
    currentDuration.innerHTML = timeFormatter(audio.currentTime);
    const progress = (audio.currentTime / audio.duration) * 100;
    currentProgress.style.width = progress.toFixed(2) + "%";
}, 500);

//update time
audio.addEventListener("timeupdate", () => {
    currentDuration.innerText = timeFormatter(audio.currentTime);
});

 //playlist
 const initializePlaylist = () => {
    for(let i in songsList){
        playlistSongs.innerHTML += `<li class='playlistSong' onclick='setSong(${i})'>
            <div class="playlist-image-container">
                <img src="${songsList[i].image}"></img>
            </div>
            <div class="playlist-song-details">
            <span id="playlist-song-name">
                ${songsList[i].name}
            </span>
            <span id="playlist-song-artist-album">
                ${songsList[i].artist}
            </span>
            </div>
        </li>`;
    }
 };

 //display playlist
 listButton.addEventListener("click", () => {
    console.log("List button clicked");
    playlistContainer.style.display = "block";
 });

 //hide playlist
 closeButton.addEventListener("click", () => {
    console.log("Close button clicked");
    playlistContainer.style.display = "none";
 });

window.onload = () => {
    //first song
    index = 0;
    setSong(index);
    //playlist
    initializePlaylist();
    const listButton = document.getElementById("list");
    const closeButton = document.getElementById("close");
    
    listButton.addEventListener("click", () => {
        console.log("List clicked");
        playlistContainer.style.display = "block";
    });

    closeButton.addEventListener("click", () => {
        console.log("Close clicked");
        playlistContainer.style.display = "none";
    });
};

//yes button

yesButton.addEventListener("click", () => {
    console.log("YES button clicked");        // ✅ checks button
    console.log("confetti is:", confetti);

    confetti({
        particleCount: 180,
        spread: 90,
        startVelocity: 45,
        origin: { y: 0.6 }
    });
});

//no button

noButton.addEventListener("click", () => {
    console.log("NO button clicked");
    window.location.href = "error.html";
});
