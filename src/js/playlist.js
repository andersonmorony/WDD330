import Spotify from "./sportfy.mjs";
import utils from "./utils.mjs";
import Song from "./song.mjs";

const utilits = new utils("accessTokenSpotify");
const access_token = utilits.getStorage("accessTokenSpotify");
const sportfy = new Spotify(access_token.access_token);
const playlist_id = utilits.getParams("id");
const songlass = new Song(0);
let songsList = [];

const GetFirstSong = async (track) => {
  songlass.handleSong(track);
};

const HandlePayListHTML = async () => {
  let HTML = "";
  const songs = await sportfy.getTracks(playlist_id);
  songsList = songs;
  const first_song = songs.items[0].track;

  utilits.setStorage("first_song", JSON.stringify(first_song));
  GetFirstSong(first_song);

  songs.items.map((song, index) => {
    HTML += `
        <div id="playlist-data">
                <div class="play">
                    <img src="${song.track.album.images[2].url}">
                    <p class="song-title" data-index="${index}">${
      index + 1
    } - ${song.track.name}</p>
                </div>
                <p>${song.track.artists[0].name}</p>
                <p>${song.track.album.name}</p>
                <p>${utilits.convertMillisecondsToTime(
                  song.track.duration_ms
                )}</p>
                <a href="${
                  song.track.external_urls.spotify
                }" target="_blank">Open External</a>
        </div>
        `;
    document.querySelector(".datalist").innerHTML = HTML;

    document.querySelectorAll(".song-title").forEach((element, index) => {
      element.addEventListener("click", () => {
        songlass.updateSongIndex(index);
        const songData = songs.items[index].track;
        GetFirstSong(songData);
      });
    });
  });
};


function lastUpdated() {
  const { items } = songsList;
  const lastUpdated = utilits.formateDate(items[0].added_at);
  const lastUpdatedElement = document.querySelector("#last-updated");

  lastUpdatedElement.innerHTML = lastUpdated;
}

async function getInfoCurrentPlayList() {
  const { description, images, name, external_urls, followers } =
    await sportfy.GetPlayListInfomation(playlist_id);

  // change elements
  const playlistNameElement = document.querySelector(".playlist-name");
  playlistNameElement.innerHTML = name;

  const playlistDescrptElement = document.querySelector(
    ".playlist-description"
  );
  playlistDescrptElement.innerHTML = description;

  const playlistFollowElement = document.querySelector(".playlist-follows");
  playlistFollowElement.innerHTML = `${followers.total.toLocaleString()} follows`;

  const playlistImageElement = document.querySelector(".playlist-image");
  playlistImageElement.setAttribute("src", images[0].url);
}

async function init() {
  await HandlePayListHTML();
  await getInfoCurrentPlayList();
  await songlass.updateSongs(songsList)
  lastUpdated();
}

init();
