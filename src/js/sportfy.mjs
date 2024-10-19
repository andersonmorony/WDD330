import utils from "./utils.mjs";

const utilits = new utils("accessTokenSpotify");
export default class Spotify {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.playlists = [];
  }

  async getAccessToken() {
    const authURL = "https://accounts.spotify.com/api/token";
    const client_id = "3cb4e838fb4945f7b0f71c7890c15259"; // GET ON ENV
    const client_secret = "0856fe475ff14237a4f383bf46c8c264"; // GET ON ENV

    const authOptions = {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(client_id + ":" + client_secret),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    };

    const response = await fetch(authURL, authOptions);
    const data = await response.json();

    utilits.setStorage("accessTokenSpotify", JSON.stringify(data));

    this.accessToken = data.access_token;
    return data.access_token;
  }

  async getTracks(playlist_id) {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    const data = await response.json();
    return data;
  }

  async getTrack(track_id) {
    const response = await fetch(
      `https://api.spotify.com/v1/tracks/${track_id}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );
    const data = await response.json();
  }
  async getAlbum(album_id) {
    const endpoint = `https://api.spotify.com/v1/albums/${album_id}`
    const response = await fetch(endpoint,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );
    const data = await response.json();
    return data;
  }

  async GetPlayLists() {
    const response = await fetch("/data/playlist-spotify.json");
    const data = await response.json();
    this.playlists = data;
    utilits.HandlePayListHTML(data, "spotify");
  }

  async GetPlayListInfomation(playlist_id) {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlist_id}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          }
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error.message);
    }
  }

  async Search(trackName, isTrack = true, isAlbum = false) {
    try {
      console.log(trackName)
      const endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(trackName)}&type=track&limit=10`;
      const response = await fetch(endpoint,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          }
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error.message);
    }
  }
}
