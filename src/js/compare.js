import Spotify from "./sportfy.mjs";
import utils from "./utils.mjs";

const utilits = new utils();
const sportfy = new Spotify();
const playlistSelected = [];

const init = async () => {
  await sportfy.getAccessToken();
  const playlists = await sportfy.GetPlayListsData();
  buildPlaylistHtml(playlists);

  document.querySelector("#btn-clear").addEventListener("click", () => {
    playlistSelected.splice(0, playlistSelected.length);
    UpdateState();
  });
};

function buildPlaylistHtml(list) {
  let HTML = "";
  list.map((playlist) => {
    HTML += `
                <div class="card">
                  <img src="${playlist.Image}" alt="">
                  <h4>${playlist.Title}</h4>
                  <button data-id="${playlist.Id}" class="btn-compare" type="button"">Select</button>
                </div>
            `;
  });

  document.querySelector(`#spotify`).innerHTML = HTML;
  document.querySelectorAll(".btn-compare").forEach((element, index) => {
    element.addEventListener("click", () => {
      element.disabled = true;
      const playlist_id = element.dataset.id;
      selectPplaylist(playlist_id);
    });
  });
}

async function selectPplaylist(playlist_id) {
  if (playlistSelected.length == 2) {
    return false;
  }

  playlistSelected.push({
    playlist_id,
  });

  if (playlistSelected.length == 2) {
    const btn = document.querySelector("#btn-start-compare");
    btn.classList.add("show");
    btn.addEventListener("click", compare);
  }
  UpdateState();
}

async function compare() {
  debugger;
  //cards
  const cards = document.querySelector(`#spotify`);
  cards.classList.add("hidden");
  cards.classList.remove("show");
  document.querySelector("#btn-start-compare").classList.add("hidden");
  document.querySelector("#btn-start-compare").classList.remove("show");
  document.querySelector("#btn-clear").classList.add("show");
  document.querySelector("#btn-clear").classList.remove("hidden");
  document.querySelector("#compare").classList.remove("hidden");

  const first_playlist = await sportfy.GetPlayListInfomation(
    playlistSelected[0].playlist_id
  );
  const second_playlist = await sportfy.GetPlayListInfomation(
    playlistSelected[1].playlist_id
  );
  loadFirst_musics(".content-first", first_playlist);
  loadFirst_musics(".content-second", second_playlist);
}

function loadFirst_musics(elementParent, songs) {
  let HTML = `<h1 class="compare-title">${songs.name}</h1>`;
  songs.tracks.items.map((song, index) => {
    const { track } = song;
    HTML += `
          <div id="playlist-data">
                  <div class="play">
                      <img src="${track.album.images[2].url}">
                      <p data-index="${index}">${index + 1} - ${track.name}</p>
                  </div>
                  <p class="mobile-hidden">${track.artists[0].name}</p>
                  <p class="mobile-hidden">${track.album.name}</p>
                  <p class="mobile-hidden">${utilits.convertMillisecondsToTime(
                    track.duration_ms
                  )}</p>
                  <button class="btn btn-add">Add Favorite</button>
          </div>
          `;
    document.querySelector(elementParent).innerHTML = HTML;
  });
}

function UpdateState() {
  const countElement = document.querySelector("#count-selected");
  countElement.innerHTML = playlistSelected.length;

  console.log("chamou");

  if (playlistSelected == 0) {
    const cards = document.querySelector(`#spotify`);
    cards.classList.add("show");
    cards.classList.remove("hidden");

    const compareElement = document.querySelector("#compare");
    compareElement.classList.add("hidden");

    document.querySelectorAll(".btn-compare").forEach((element, index) => {
      element.disabled = false;
    });

    document.querySelector("#btn-clear").classList.add("hidden");
    document.querySelector("#btn-clear").classList.remove("show");
  }
}

init();
