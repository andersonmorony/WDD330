import Spotify from "./sportfy.mjs";
import utils from "./utils.mjs";
import Song from "./song.mjs";

const utilits = new utils("accessTokenSpotify");
export default class PlayListSpotify {
  constructor() {
    this.songsList = []
    this.access_token = utilits.getStorage("accessTokenSpotify");
    this.sportfy = new Spotify(this.access_token.access_token);
    this.playlist_id = utilits.getParams("id");
    this.songlass = new Song(0);
  }

  async HandlePayListHTML() {
    let HTML = "";
    const first_song = this.songsList.items[0].track;

    // Get Favorites
    const favoriteSongs = utilits.getStorage("favorite");

    utilits.setStorage("first_song", JSON.stringify(first_song));

    this.songsList.items.map((song, index) => {
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
                  
                      ${
                        favoriteSongs?.filter((fav) => fav.id === track.id)
                          .length > 0
                          ? `<button data-id="${track.id}" class="btn btn-favorite btn-remove">Remove</button>`
                          : `<button data-id="${track.id}" class="btn btn-add btn-favorite">Add Favorite</button>`
                      }
          </div>
          `;
      document.querySelector(".datalist").innerHTML = HTML;

    });

    document.querySelectorAll(".song-title").forEach((element, index) => {
      element.addEventListener("click", () => {
        this.songlass.updateSongIndex(index);
        const song = this.songsList.items[index].track;
        this.songlass.handleSong(song.id, song.album.images[1].url, song.name, song.album.name, song.preview_url);
      });
    });

    // Event list to Add favarite
    document.querySelectorAll(".btn-add").forEach((element) => {
      element.addEventListener("click", async (element) => {
        utilits.AddFavorite(element, this.sportfy, this.HandlePayListHTML.bind(this));
      });
    });

    // event list to remove favorite
    utilits.removeFavorite(this.HandlePayListHTML.bind(this))
  }

  lastUpdated() {
    const { items } = this.songsList;
    const lastUpdated = utilits.formateDate(items[0].added_at);
    const lastUpdatedElement = document.querySelector("#last-updated");

    lastUpdatedElement.innerHTML = lastUpdated;
  }

  async getInfoCurrentPlayList() {
    const { description, images, name, external_urls, followers } =
      await this.sportfy.GetPlayListInfomation(this.playlist_id);

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
    this.songsList  = await this.sportfy.getTracks(this.playlist_id);
    await this.HandlePayListHTML();

    const song = this.songsList.items[0].track;
    this.songlass.handleSong(song.id, song.album.images[1].url, song.name, song.album.name, song.preview_url);

    await this.getInfoCurrentPlayList();
    this.songlass.updateSongs(this.songsList);
    this.lastUpdated();
  }

  
}
