import utils from "./utils.mjs";

const utilits = new utils("accessTokenSpotify");

export default class Song {
  constructor(currentSongIndex) {
    this.currentSongIndex = currentSongIndex;
    this.songs = [];
    this.currentSong = {}
    this.interval;
  }

  handleSong(id, image, name, album, preview) {
    const HTML = `
            <img class="mobile-hidden" src="${image}" alt="">
            <div>
                <p>${name}</p>
                <p class="song-album">${album}</p>
                <audio id="audioSong" controls autoplay>
                    <source src="${preview}" type="audio/mpeg">
                    Seu navegador não suporta a tag de áudio.
                </audio>
                <div class="control">
                    <button id="preview" type="button">Previous</button>
                    <button id="next" type="button">Next</button>
                </div>
            </div>
        `;

    document.querySelector("#playmusic").innerHTML = HTML;

    const firstSong = utilits.getStorage("first_song");

    if (id == firstSong.id) {
      document.getElementById("preview").disabled = true;
    }
    this.NextSong();
    this.previusSong();
    this.addMusicGif(id)

    gtag("event", "song_listing", {
      'id': id,
      'name': name,
      'album': album,
      'image': image,
      'preview': preview,
      'date': new Date(),
      'current_page': window.location.pathname,
    });
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
      const song = this.songs.items[index].track ? this.songs.items[index].track : this.songs.items[index];
      this.currentSong = song
      this.handleSong(song.id, song.album.images[1].url, song.name, song.album.name, song.preview_url);
      this.RemovePreviusMusicGif(this.songs.items[index - 1].track.id)
    });
  }
  previusSong() {
    const btnNext = document.querySelector("#preview");
    btnNext.addEventListener("click", () => {
      const index = this.updateSongIndex(this.currentSongIndex - 1);
      const song = this.songs.items[index].track;
      this.currentSong = song
      this.handleSong(song.id, song.album.images[1].url, song.name, song.album.name, song.preview_url);
      this.RemovePreviusMusicGif(this.songs.items[index + 1].track.id)
    });
  }

  addMusicGif(id) {
    clearInterval(this.interval)
    this.interval = setInterval(() => {
      const audioElement = document.getElementById('audioSong');
      if (audioElement.duration > 0 && !audioElement.paused) {
          const element = document.getElementById(id);
          element.innerHTML = `<img src="/image/wave.gif" alt="playing">`;
      } else {
        this.RemovePreviusMusicGif(id);
      }
    }, 500)
  }

  RemovePreviusMusicGif(id) {
    const element = document.getElementById(id);
    element.innerHTML = ""
  }
}

