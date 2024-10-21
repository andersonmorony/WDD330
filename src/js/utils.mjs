export default class utils {
  constructor(key) {
    this.key = key;
  }

  setStorage(key, data) {
    localStorage.setItem(key, data);
  }

  getStorage(key) {
    const data = localStorage.getItem(key);
    return JSON.parse(data);
  }

  HandlePayListHTML(list, elementId) {
    let HTML = "";
    list.map((playlist) => {
      HTML += `
                <div class="card">
                  <img src="${playlist.Image}" alt="">
                  <h4>${playlist.Title}</h4>
                  <p>${playlist.album_type}</p>
                  <a href="/playlist/index.html?id=${playlist.Id}&type=${playlist.Type}">See musics</a>
                </div>
            `;
    });

    document.querySelector(`#${elementId}`).innerHTML = HTML;
  }

  getParams(key) {
    const urlParams = new URLSearchParams(window.location.search);
    const paramValue = urlParams.get(key);
    return paramValue;
  }

  convertMillisecondsToTime(ms, isMiliSeconds = true) {
    const totalSeconds = isMiliSeconds ? Math.floor(ms / 1000) : ms;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    return formattedTime;
  }

  formateDate(date) {
    const newDate = new Date(date)
    const dateFormated = newDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return dateFormated
  }

  lastUpdated(date) {
    const lastUpdated = this.formateDate(date);
    const lastUpdatedElement = document.querySelector("#last-updated");

    lastUpdatedElement.innerHTML = lastUpdated;
  }
}
