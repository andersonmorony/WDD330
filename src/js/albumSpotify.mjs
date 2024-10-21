import Spotify from "./sportfy.mjs";
import utils from "./utils.mjs";
import Song from "./song.mjs";

const utilits = new utils("accessTokenSpotify");

export default class AlbumSpotify {
  constructor() {
    this.access_token = utilits.getStorage("accessTokenSpotify");
    this.sportfy = new Spotify(this.access_token.access_token);
    this.playlist_id = utilits.getParams("id");
    this.songlass = new Song(0);
    this.songsList = [];
    this.album = {};
  }

  async HandleHTML() {
    let HTML = "";
    const first_song = this.songsList.items[0].track;

    utilits.setStorage("first_song", JSON.stringify(first_song));

    this.songsList.items.map((track, index) => {
      HTML += `
              <div id="playlist-data">
                      <div class="play">
                          <img src="${this.album.images[2].url}">
                          <p class="song-title" data-index="${index}">${
        index + 1
      } - ${track.name}</p>
                          <span id="${track.id}">
                          </span>
                      </div>
                      <p>${this.album.artists[0].name}</p>
                      <p class="mobile-hidden">${this.album.name}</p>
                      <p class="mobile-hidden">${utilits.convertMillisecondsToTime(
                        track.duration_ms
                      )}</p>
                      <a class="mobile-hidden" href="${
                        track.external_urls.spotify
                      }" target="_blank">Open External</a>
              </div>
              `;
      document.querySelector(".datalist").innerHTML = HTML;

      document.querySelectorAll(".song-title").forEach((element, index) => {
        element.addEventListener("click", () => {
          this.songlass.updateSongIndex(index);
          const song = this.songsList.items[index];
          this.songlass.handleSong(
            song.id,
            this.album.images[1].url,
            song.name,
            this.album.name,
            song.preview_url
          );
        });
      });
    });
  }
 

  async getInfoCurrentPlayList() {
    console.log(this.album)
    // change elements
    const playlistNameElement = document.querySelector(".playlist-name");
    playlistNameElement.innerHTML = this.album.name;

    const playlistDescrptElement = document.querySelector(
      ".playlist-description"
    );
    playlistDescrptElement.innerHTML = this.album.label;

    const playlistFollowElement = document.querySelector(".playlist-follows");
    playlistFollowElement.innerHTML = `${this.album.total_tracks} total tracks`;

    const playlistImageElement = document.querySelector(".playlist-image");
    playlistImageElement.setAttribute("src", this.album.images[0].url);
  }

  async init() {
    // load album or single
    const result = await this.sportfy.getAlbum(this.playlist_id);
    this.album = result;
    this.songsList = result.tracks;
    await this.HandleHTML();

    // play first song
    const song = this.songsList.items[0];
    utilits.setStorage("first_song", JSON.stringify(song));
    this.songlass.handleSong(
      song.id,
      this.album.images[1].url,
      song.name,
      this.album.name,
      song.preview_url
    );

    await this.getInfoCurrentPlayList();


    const songsTranform = {
      items: result.tracks.items.map((song) => {
        const current = {
          track: {
            id: song.id,
            track: {
              id: song.id,
            },
            name: song.name,
            album: {
              name: this.album.name,
              images: [{}, { url: this.album.images[1].url }],
            },
            preview_url: song.preview_url,
          },
        };
        return current;
      }),
    };
    this.songlass.updateSongs(songsTranform);
    utilits.lastUpdated(this.album.release_date);
  }
}
