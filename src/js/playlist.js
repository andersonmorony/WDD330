import PlayListDeezer from "./playlistDeezer.mjs";
import PlayListSpotify from "./playlistSpotify.mjs";
import utils from "./utils.mjs";

const utilits = new utils();
const type = utilits.getParams("type");

if(type == "spotify") {
    const spotify = new PlayListSpotify();
    spotify.init()
} else if(type == "deezer") {
    const deezer = new PlayListDeezer();
    deezer.init()
}

