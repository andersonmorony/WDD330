import utils from "./utils.mjs";

const utilits = new utils();

export default class Deezer {
    constructor(){
        this.playlists = []
    }

    async GetPlaylists() {
        const response = await fetch("/data/playlist-deezer.json");
        const data = await response.json()
        this.playlists = data;
        utilits.HandlePayListHTML(data, "deezer")
    }
}

