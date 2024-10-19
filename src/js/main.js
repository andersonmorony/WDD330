import Spotify from "./sportfy.mjs";
import utils from "./utils.mjs";


const init = async () => {
    const utilits = new utils();
    const sportfy = new Spotify();
    await sportfy.getAccessToken()
    await sportfy.GetPlayLists()


     // Add search event list
     const searchElement = document.querySelector("#search-input")
     searchElement.addEventListener('keyup', async (e) => {
        const elementValue = e.target.value;
        const contentElement = document.querySelector("#content")
        const musicSearchElement = document.querySelector("#musics")

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
   
            contentElement.classList.add("hidden")
            contentElement.classList.remove("show")
            musicSearchElement.classList.add("show")
            musicSearchElement.classList.remove("hidden")
           
   
           utilits.HandlePayListHTML(songs, "musics")
         
        } catch (error) {
         console.log(error.message)
   
         contentElement.classList.add("show")
         contentElement.classList.remove("hidden")
         musicSearchElement.classList.add("hidden")
         musicSearchElement.classList.remove("show")
        }
     })

}

init()