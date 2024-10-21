import AlbumSpotify from "./albumSpotify.mjs";
import PlayListDeezer from "./playlistDeezer.mjs";
import PlayListSpotify from "./playlistSpotify.mjs";
import utils from "./utils.mjs";

const utilits = new utils();
const type = utilits.getParams("type");

if(type == "playlist") {
    const spotify = new PlayListSpotify();
    spotify.init()
}

if(type == "album") {
    const album = new AlbumSpotify();
    album.init()
}

if(type == "deezer") {
    const deezer = new PlayListDeezer();
    deezer.init()
}

