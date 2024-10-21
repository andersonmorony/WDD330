import utils from "./utils.mjs";
import Spotify from "./sportfy.mjs";
const utilits = new utils()
const sportfy = new Spotify()

async function init() {
    const elementValue = utilits.getParams("q")
    const titleElement = document.querySelector("#title")
    titleElement.innerHTML = `Results of '<span>${elementValue}</span>'`
    await sportfy.getAccessToken()

    try {
       const result = await sportfy.Search(elementValue);

       if(!result) { return false}

       const songs = result.tracks.items.map((track) => {
           const { name, id, album } = track;
           return {
              Id: album.id,
              Image: album.images[1].url,
              Title: name,
              Type: "album",
              album_type: album.album_type
           }
       });
       
       utilits.HandlePayListHTML(songs, "musics")
     
    } catch (error) {
     console.log(error.message)
    }
}

init()