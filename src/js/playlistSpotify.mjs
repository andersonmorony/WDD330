import Spotify from "./sportfy.mjs";
import utils from "./utils.mjs";
import Song from "./song.mjs";

const utilits = new utils("accessTokenSpotify");
const access_token = utilits.getStorage("accessTokenSpotify");
const sportfy = new Spotify(access_token.access_token);
const playlist_id = utilits.getParams("id");
const songlass = new Song(0);
let songsList = [];

export default class PlayListSpotify {

  async HandlePayListHTML(songs) {
    let HTML = "";
    songsList = songs;
    const first_song = songs.items[0].track;

    utilits.setStorage("first_song", JSON.stringify(first_song));

    songs.items.map((song, index) => {
      const { track } = song;
      HTML += `
          <div id="playlist-data">
                  <div class="play">
                      <img src="${track.album.images[2].url}">
                      <p class="song-title" data-index="${index}">${
        index + 1
      } - ${track.name}</p>
                      <span id="${track.id}">
                      </span>
                  </div>
                  <p>${track.artists[0].name}</p>
                  <p class="mobile-hidden">${track.album.name}</p>
                  <p class="mobile-hidden">${utilits.convertMillisecondsToTime(track.duration_ms)}</p>
                  <a class="mobile-hidden" href="${
                    track.external_urls.spotify
                  }" target="_blank">Open External</a>
          </div>
          `;
      document.querySelector(".datalist").innerHTML = HTML;

      document.querySelectorAll(".song-title").forEach((element, index) => {
        element.addEventListener("click", () => {
          songlass.updateSongIndex(index);
          const song = songs.items[index].track;
          songlass.handleSong(song.id, song.album.images[1].url, song.name, song.album.name, song.preview_url);
        });
      });
    });
  }

  lastUpdated() {
    const { items } = songsList;
    const lastUpdated = utilits.formateDate(items[0].added_at);
    const lastUpdatedElement = document.querySelector("#last-updated");

    lastUpdatedElement.innerHTML = lastUpdated;
  }

  async getInfoCurrentPlayList() {
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
  

  async init() {
    const songs = await sportfy.getTracks(playlist_id);
    await this.HandlePayListHTML(songs);

    const song = songsList.items[0].track;
    songlass.handleSong(song.id, song.album.images[1].url, song.name, song.album.name, song.preview_url);

    await this.getInfoCurrentPlayList();
    songlass.updateSongs(songsList);
    this.lastUpdated();
  }

  
}
