import Spotify from "./sportfy.mjs";
import utils from "./utils.mjs";
import Song from "./song.mjs";

const utilits = new utils("accessTokenSpotify");
export default class PlayListSpotify {
  constructor(favorite = false) {
    this.songsList = [];
    this.access_token = utilits.getStorage("accessTokenSpotify");
    this.sportfy = new Spotify(this.access_token.access_token);
    this.playlist_id = utilits.getParams("id");
    this.songlass = new Song(0);
    this.favorite = favorite;
  }

  async HandlePayListHTML() {
    let HTML = "";
    const first_song = this.favorite
      ? this.songsList
      : this.songsList.items[0].track;

    // Get Favorites
    const favoriteSongs = utilits.getStorage("favorite");

    utilits.setStorage("first_song", JSON.stringify(first_song));

    const songs = this.favorite ? this.songsList : this.songsList.items;

    songs.map((song, index) => {
      const track = this.favorite ? song : song.track;
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
                  <p class="mobile-hidden">${utilits.convertMillisecondsToTime(
                    track.duration_ms
                  )}</p>
                  
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
        const song = this.favorite ? this.songsList[index] : this.songsList.items[index].track;
        this.songlass.handleSong(
          song.id,
          song.album.images[1].url,
          song.name,
          song.album.name,
          song.preview_url
        );
      });
    });

    // Event list to Add favarite
    document.querySelectorAll(".btn-add").forEach((element) => {
      element.addEventListener("click", async (element) => {
        utilits.AddFavorite(
          element,
          this.sportfy,
          this.init.bind(this)
        );
      });
    });

    // event list to remove favorite
    utilits.removeFavorite(this.init.bind(this));
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

  favoriteheader() {
    // change elements
    const playlistNameElement = document.querySelector(".playlist-name");
    playlistNameElement.innerHTML = "Favorite Songs";

    const playlistDescrptElement = document.querySelector(
      ".playlist-description"
    );
    playlistDescrptElement.innerHTML = "Those are your favorite songs";

    const playlistFollowElement = document.querySelector(".playlist-follows");
    playlistFollowElement.innerHTML = `${this.songsList.length} songs`;

    const playlistImageElement = document.querySelector(".playlist-image");
    playlistImageElement.setAttribute("src", "/image/favorite.jpg");

    const lastDateUpdated = utilits.getStorage("favorite-update")
    const lastUpdated = utilits.formateDate(lastDateUpdated);
    const lastUpdatedElement = document.querySelector("#last-updated");

    lastUpdatedElement.innerHTML = lastUpdated;
  }

  async init() {
    this.songsList = this.favorite
      ? utilits.getStorage("favorite") || []
      : await this.sportfy.getTracks(this.playlist_id);
    await this.HandlePayListHTML();

    const song = this.favorite
      ? this.songsList[0]
      : this.songsList.items[0].track;

    if(song)
    {
      this.songlass.handleSong(
        song.id,
        song.album.images[1].url,
        song.name,
        song.album.name,
        song.preview_url
      );
    } else {
      document.querySelector("#playmusic").classList.add("hidden")
      document.querySelector("#section-playlist").innerHTML = `
        <div class="alert">
          <h1>You don't have favorite song yet.</h1>
        </div>
      `
    }


    if (this.favorite) {
      const songsTranform = {
        items: this.songsList.map((song) => {
          const current = {
            track: {
              id: song.id,
              track: {
                id: song.id,
              },
              name: song.name,
              album: {
                name: song.album.name,
                images: [{}, { url: song.album.images[1].url }],
              },
              preview_url: song.preview_url,
            },
          };
          return current;
        }),
      };
      this.songlass.updateSongs(songsTranform);
      this.favoriteheader();
    } else {
      this.songlass.updateSongs(this.songsList);
      await this.getInfoCurrentPlayList();
      this.lastUpdated();
    }
  }
}
