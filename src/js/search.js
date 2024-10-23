import utils from "./utils.mjs";
import Spotify from "./sportfy.mjs";
import Header from "./Head.mjs";

const header = new Header()
header.BuilderHeaderHtml()

const utilits = new utils()
const sportfy = new Spotify()

async function init() {
    const elementValue = utilits.getParams("q")
    const titleElement = document.querySelector("#title")
    titleElement.innerHTML = `Results of '<span>${elementValue}</span>'`
    await sportfy.getAccessToken()

    try {
        gtag("event", "search", {
            search_term: elementValue
        });
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