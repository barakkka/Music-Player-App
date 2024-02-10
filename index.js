document.addEventListener("DOMContentLoaded", function () {
  const previous = document.querySelector(".previous");
  const playPause = document.querySelector(".playPause");
  const next = document.querySelector(".next");
  const shuffle = document.querySelector(".shuffle");
  const image = document.querySelector(".image");
  const songDetails = document.getElementById("songDetails");

  const audio = document.getElementById("audio");
  const renderSongs = document.getElementById("renderSongs");

  const progressBar = document.getElementById("progressBar");
  const progressDot = document.getElementById("progressDot");
  const listened = document.getElementById("listened");

  let playlist = [
    {
      id: 0,
      artist: "Dake",
      title: "Best I Ever Had🤍",
      link: "./music/[4K] Drake - Best I Ever Had (Lyrics).mp3",
      bars: "barsOne",
      delete: "deleteOne",
      playing: false,
    },
    {
      id: 1,
      artist: "Bien x Dj Edu",
      title: "Too Easy",
      link: "./music/Bien x Dj Edu - Too Easy (Official Music Video).mp3",
      bars: "barsTwo",
      delete: "deleteTwo",
      playing: false,
    },
    {
      id: 2,
      artist: "Paul Wall",
      title: "Girl",
      link: "./music/Girl - Paul Wall.mp3",
      bars: "barsThree",
      delete: "deleteThree",
      playing: false,
    },
    {
      id: 3,
      artist: "Akon",
      title: "Be With You",
      link: "./music/Akon - Be With You.mp3",
      bars: "barsFour",
      delete: "deleteFour",
      playing: false,
    },
    {
      id: 4,
      artist: "Nyashinski",
      title: "Perfect Design",
      link: "./music/Nyashinski - Perfect Design (Official Music Video).mp3",
      bars: "barsFive",
      delete: "deleteFive",
      playing: false,
    },
  ];

  const copy = [...playlist];

  let currentSongId = 0;

  function renderSongDetails() {
    songDetails.innerHTML = `<h3>${playlist[currentSongId].title}</h3>
    <p><span class="span ${currentSongId}">${playlist[currentSongId].artist}</span></p>`;
  }

  renderSongDetails();

  //create the HTML elements to be rendered.
  const renderpause = `<i class="fa fa-pause" aria-hidden="true"></i>`;
  const renderplay = `<i class="fa fa-play" aria-hidden="true"></i>`;

  //function that listens for the play or pause click and performs logic accordingly.
  playPause.addEventListener("click", function () {
    if (playPause.classList.contains("pause")) {
      playPause.innerHTML = renderplay;
      playPause.classList.replace("pause", "play");
      audio.pause();
      playlist[currentSongId].playing = false;
      image.classList.remove("imageAnimation");
      document.getElementById(playlist[currentSongId].bars).style.visibility =
        "hidden";
    } else {
      playPause.innerHTML = renderpause;
      playPause.classList.replace("play", "pause");
      if (audio.src.match(/.\/music/)) {
        audio.play();
        playlist[currentSongId].playling = true;
        image.classList.add("imageAnimation");
        document.getElementById(playlist[currentSongId].bars).style.visibility =
          "visible";
      } else {
        audio.src = playlist[0].link;
        audio.play();
        playlist[currentSongId].playing = true;
        image.classList.add("imageAnimation");
        document.getElementById(playlist[currentSongId].bars).style.visibility =
          "visible";
      }
    }
  });

  next.addEventListener("click", function () {
    playNextSong(currentSongId);
  });

  previous.addEventListener("click", function () {
    playPreviousSong(currentSongId);
  });

  function mapSongs() {
    renderSongs.innerHTML = playlist.map((song, index) => {
      const renderSongitem = `
      <div class="item" id="${song.link}">
          <div><p>${song.title}</p></div>
          <div class="itemTwo">
            <div class="musicMotion" id="${song.bars}">
              <div class="first"></div>
              <div class="second"></div>
              <div class="third"></div>
            </div>
              <div><p class="artist">${song.artist}</p></div>
              <div><button class="deleteButton ${song.delete}"><i class="fa fa-times-circle"></i></button></div>
          </div>
      </div>
      `;
      return renderSongitem;
    });
  }
  mapSongs();

  const deleteButton = document.querySelector(".deleteButton");
  const musicMotion = document.querySelector(".musicMotion");

  let checker = 0;
  function reRender() {
    for (let i = 0; i < playlist.length; i++) {
      let songItem = document.getElementById(playlist[i].link);
      songItem.addEventListener("click", function (event) {
        if (!event.target.closest(".deleteButton")) {
          audio.src = playlist[i].link;
          audio.play();
          currentSongId = i;
          renderSongDetails();
          for (let x = 0; x < playlist.length; x++) {
            if (playlist[x].playing === true) {
              playlist[x].playing = false;
            }
          }
          playlist[currentSongId].playing = true;

          image.classList.add("imageAnimation");
          for (let j = 0; j < playlist.length; j++) {
            if (
              document.getElementById(playlist[j].bars).style.visibility ===
              "visible"
            ) {
              document.getElementById(playlist[j].bars).style.visibility =
                "hidden";
            }
          }
          document.getElementById(playlist[i].bars).style.visibility =
            "visible";
          if (playPause.classList.contains("pause")) {
            return;
          } else {
            playPause.classList.replace("play", "pause");
            playPause.innerHTML = renderpause;
          }
        }
      });

      const eachDelete = document.querySelector(`.${playlist[i].delete}`);
      eachDelete.addEventListener("click", function () {
        if (playlist[i].playing === true) {
          audio.src = "";
          image.classList.remove("imageAnimation");
          playPause.classList.replace("pause", "play");
          playPause.innerHTML = renderplay;
        } else {
          if (i < currentSongId) {
            currentSongId -= 1;
          }
        }
        // if (audio.playing) {
        //   document.getElementById(
        //     playlist[currentSongId].bars
        //   ).style.visibility = "visible";
        //   console.log("was playing");
        // }

        playlist = playlist.filter((item) => item.link !== playlist[i].link);
        eachDelete.style.backgroundColor = "white";

        checkerFunc(i);
        mapSongs();
        reRender();
      });
    }
  }
  reRender();

  let reset;
  function checkerFunc(index) {
    if (checker === 1) {
      reset.style.visibility = "visible";
    } else {
      if (playlist.length <= 3) {
        renderSongs.insertAdjacentHTML(
          "afterend",
          `<div class="resetContainer"><button class="reset">Reset Playlist</button><div>`
        );
        reset = document.querySelector(".reset");
        reset.addEventListener("click", function () {
          playlist = [...copy];
          mapSongs();
          reRender();
          reset.style.visibility = "hidden";
        });
        checker = 1;
      }
    }
  }

  audio.addEventListener("ended", function () {
    document.getElementById(playlist[currentSongId].bars).style.visibility =
      "hidden";
    playNextSong(currentSongId);
  });

  function playPreviousSong(current) {
    if (current <= 0) {
      return;
    } else {
      document.getElementById(playlist[current].bars).style.visibility =
        "hidden";
      document.getElementById(playlist[current - 1].bars).style.visibility =
        "visible";
      playlist[currentSongId].playing = false;
      audio.src = playlist[current - 1].link;
      audio.play();
      currentSongId -= 1;
      playlist[currentSongId].playing = true;
      renderSongDetails();
    }
  }

  function playNextSong(previous) {
    if (previous + 1 < playlist.length) {
      document.getElementById(playlist[previous].bars).style.visibility =
        "hidden";
      playlist[currentSongId].playing = false;
      audio.src = playlist[previous + 1].link;
      audio.play();
      currentSongId += 1;
      playlist[currentSongId].playing = true;
      renderSongDetails();

      document.getElementById(playlist[previous + 1].bars).style.visibility =
        "visible";
      if (image.classList.contains("imageAnimation")) {
        return;
      } else {
        image.classList.add("imageAnimation");
        playPause.classList.replace("play", "pause");
        playPause.innerHTML = renderpause;
      }
    } else {
      document.getElementById(playlist[previous].bars).style.visibility =
        "hidden";
      image.classList.remove("imageAnimation");
      if (playPause.classList.contains("pause")) {
        playPause.classList.replace("pause", "play");
        playPause.innerHTML = renderplay;
      }
      playlist[currentSongId].playing = false;
      currentSongId = 0;
      renderSongDetails(currentSongId);
      progressDot.style.left = "0%";
      audio.src = playlist[currentSongId].link;
    }
  }

  audio.addEventListener("timeupdate", function () {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressDot.style.left = progress + "%";
    listened.style.width = progress + "%";
  });

  window.seek = function (event) {
    const boundingRect = progressBar.getBoundingClientRect();
    const percentage = (event.clientX - boundingRect.left) / boundingRect.width;
    audio.currentTime = audio.duration * percentage;
  };

  audio.addEventListener("play", function () {
    if (playPause.classList.contains("play")) {
      playPause.classList.replace("play", "pause");
      playPause.innerHTML = renderpause;

      image.classList.add("imageAnimation");
      document.getElementById(playlist[currentSongId].bars).style.visibility =
        "visible";
    }
  });

  audio.addEventListener("pause", function () {
    if (playPause.classList.contains("pause")) {
      playPause.classList.replace("pause", "play");
      playPause.innerHTML = renderplay;

      image.classList.remove("imageAnimation");
      document.getElementById(playlist[currentSongId].bars).style.visibility =
        "hidden";
    }
  });
});
