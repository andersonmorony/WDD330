import utils from "./utils.mjs";
import Song from "./song.mjs";
import Deezer from "./deezer.mjs";

const utilits = new utils();
const deezer = new Deezer();
const songlass = new Song();

export default class PlayListDeezer {
  constructor() {
    this.access_token = utilits.getStorage("accessTokenSpotify");
    this.playlist_id = utilits.getParams("id");
    this.first_song = {}
  }

  async HandlePlayList() {
    let HTML = "";
    const playlistinformation = await deezer.GetPlayList(this.playlist_id);
    console.log(playlistinformation.tracks)
    const songs = playlistinformation.tracks.data;

    this.first_song = songs[0]

    utilits.setStorage("first_song", JSON.stringify(this.first_song));

    songs.map((song, index) => {
      const { album, artist, duration, title, title_short, id, link } = song;
      HTML += `
              <div id="playlist-data">
                      <div class="play">
                          <img src="${album.cover_small}">
                          <p class="song-title" data-index="${index}">${ index + 1} - ${title_short}</p>
                          <span id="${id}"></span>
                      </div>
                      <p>${artist.name}</p>
                      <p>${album.title}</p>
                      <p>${utilits.convertMillisecondsToTime(duration, false)}</p>
                      <a href="${link}" target="_blank">Open External</a>
              </div>
              `;
      document.querySelector(".datalist").innerHTML = HTML;

      document.querySelectorAll(".song-title").forEach((element, index) => {
        element.addEventListener("click", () => {
          songlass.updateSongIndex(index);
          const songData = songs[index];
          const { id, album, title, preview} = songs[0]
          songlass.handleSong(id, album.cover_small, title, preview);
        });
      });
    });
  }

  async init() {
    await this.HandlePlayList();
    const { id, album, title, preview} = this.first_song;
    songlass.handleSong(id, album.cover_medium, title, album.title, preview);
  }
}
