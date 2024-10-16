import utils from "./utils.mjs";

const utilits = new utils("accessTokenSpotify");

export default class Song {
  constructor(currentSongIndex) {
    this.currentSongIndex = currentSongIndex;
    this.songs = [];
  }

  handleSong(song) {
    const HTML = `
            <img src="${song.album.images[1].url}" alt="">
            <div>
                <p>${song.name}</p>
                <p class="song-album">${song.album.name}</p>
                <audio controls autoplay>
                    <source src="${song.preview_url}" type="audio/mpeg">
                    Seu navegador não suporta a tag de áudio.
                </audio>
                <div class="control">
                    <button id="preview" type="button">Anterior</button>
                    <button id="next" type="button">Proxima</button>
                </div>
            </div>
        `;

    document.querySelector("#playmusic").innerHTML = HTML;

    const firstSong = utilits.getStorage("first_song");

    if (song.id == firstSong.id) {
      document.getElementById("preview").disabled = true;
    }
    this.NextSong();
    this.previusSong();
  }

  updateSongIndex(index) {
    this.currentSongIndex = index;
    return this.currentSongIndex;
  }

  updateSongs(songs) {
    this.songs = songs;
  }

  NextSong() {
    const btnNext = document.querySelector("#next");
    btnNext.addEventListener("click", () => {
      const index = this.updateSongIndex(this.currentSongIndex + 1);
      const songData = this.songs.items[index].track;
      this.handleSong(songData);
    });
  }
  previusSong() {
    const btnNext = document.querySelector("#preview");
    btnNext.addEventListener("click", () => {
      const index = this.updateSongIndex(this.currentSongIndex - 1);
      const songData = this.songs.items[index].track;
      this.handleSong(songData);
    });
  }
}
