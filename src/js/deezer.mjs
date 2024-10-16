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

    async GetPlayList(playlist_id) {
        try {
            const response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.deezer.com/playlist/${playlist_id}`)
            const data = await response.json()
            return data
        } catch (error) {
            console.log(error)
        }
    }
}

