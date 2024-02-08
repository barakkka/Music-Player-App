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

  const playlist = [
    {
      id: 0,
      artist: "Dake",
      title: "Best I Ever Had🤍",
      link: "./music/[4K] Drake - Best I Ever Had (Lyrics).mp3",
      bars: "barsOne",
    },
    {
      id: 1,
      artist: "Bien x Dj Edu",
      title: "Too Easy",
      link: "./music/Bien x Dj Edu - Too Easy (Official Music Video).mp3",
      bars: "barsTwo",
    },
    {
      id: 2,
      artist: "Paul Wall",
      title: "Girl",
      link: "./music/Girl - Paul Wall.mp3",
      bars: "barsThree",
    },
    {
      id: 3,
      artist: "Akon",
      title: "Be With You",
      link: "./music/Akon - Be With You.mp3",
      bars: "barsFour",
    },
    {
      id: 4,
      artist: "Nyashinski",
      title: "Perfect Design",
      link: "./music/Nyashinski - Perfect Design (Official Music Video).mp3",
      bars: "barsFive",
    },
  ];

  let currentSongId = 0;

  function renderSongDetails() {
    songDetails.innerHTML = `<h3>${playlist[currentSongId].title}</h3>
    <p><span>${playlist[currentSongId].artist}</span></p>`;
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
      image.classList.remove("imageAnimation");
      document.getElementById(playlist[currentSongId].bars).style.visibility =
        "hidden";
    } else {
      playPause.innerHTML = renderpause;
      playPause.classList.replace("play", "pause");
      if (audio.src.match(/.\/music/)) {
        console.log(
          "RegEx match found.. current link:" + playlist[currentSongId].link
        );
        audio.play();
        image.classList.add("imageAnimation");
        document.getElementById(playlist[currentSongId].bars).style.visibility =
          "visible";
      } else {
        audio.src = playlist[0].link;
        audio.play();
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
            <div><button class="deleteButton"><i class="fa fa-times-circle"></i></button></div>
        </div>
    </div>
    `;
    return renderSongitem;
  });

  const deleteButton = document.querySelector(".deleteButton");
  const musicMotion = document.querySelector(".musicMotion");

  for (let i = 0; i < playlist.length; i++) {
    let songItem = document.getElementById(playlist[i].link);
    songItem.addEventListener("click", function (event) {
      if (!event.target.closest(".deleteButton")) {
        audio.src = playlist[i].link;
        audio.play();
        currentSongId = i;
        renderSongDetails();

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
        document.getElementById(playlist[i].bars).style.visibility = "visible";
        if (playPause.classList.contains("pause")) {
          return;
        } else {
          playPause.classList.replace("play", "pause");
          playPause.innerHTML = renderpause;
        }
      }
    });
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
      audio.src = playlist[current - 1].link;
      audio.play();
      currentSongId -= 1;
      renderSongDetails();
    }
  }

  function playNextSong(previous) {
    if (previous + 1 < playlist.length) {
      document.getElementById(playlist[previous].bars).style.visibility =
        "hidden";
      audio.src = playlist[previous + 1].link;
      audio.play();
      currentSongId += 1;
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
