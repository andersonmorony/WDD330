import Spotify from "./sportfy.mjs";
import utils from "./utils.mjs";
import Deezer from "./deezer.mjs";


const init = async () => {
    const url = "https://api.spotify.com/v1/tracks";
    const utilits = new utils('accessTokenSpotify')
    
    const token = utilits.getStorage()
    const sportfy = new Spotify();
    await sportfy.getAccessToken()
    await sportfy.GetPlayLists()

    const deezer = new Deezer();
    await deezer.GetPlaylists()

}

init()