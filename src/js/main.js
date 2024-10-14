import Spotify from "./sportfy.mjs";
import utils from "./utils.mjs";


const init = async () => {
    const url = "https://api.spotify.com/v1/tracks";
    const utilits = new utils('accessTokenSpotify')
    
    const token = utilits.getStorage()
    const access_token = token ? token.access_token : await sportfy.getAccessToken()
    const sportfy = new Spotify(access_token, url);
    
    
    sportfy.getTracks('37i9dQZEVXbLRQDuF5jeBp')
    sportfy.getTrack('5G2f63n7IPVPPjfNIGih7Q')
}

init()