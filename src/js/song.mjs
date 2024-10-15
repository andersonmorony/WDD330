import utils from "./utils.mjs";

const utilits = new utils("accessTokenSpotify");

export default class Song {

    constructor(currentSongIndex) {
        this.currentSongIndex = currentSongIndex
    }

  async getSongSpotifyById(URI) {
    try {
      const token = utilits.getStorage();
      const response = await fetch(URI, {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      this.handleSong(data);
      return data;
    } catch (error) {
      console.error("Song doesnt found");
    }
  }

  handleSong(song) {
    const HTML = `
            <img src="${song.album.images[1].url}" alt="">
            <div>
                <p>${song.name}</p>
                <p>${song.album.name}</p>
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
  }

  updateSongIndex(index) {
    this.currentSongIndex = index;
    return this.currentSongIndex;
  }
}
